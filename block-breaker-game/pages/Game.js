// Game.js
import React, { useRef, useEffect, useState } from 'react';

const Game = () => {
  const canvasRef = useRef(null);
  const [ball, setBall] = useState({
    x: 0,
    y: 0,
    radius: 10,
    dx: 2,
    dy: -2
  });
  const [paddle, setPaddle] = useState({
    x: 0,
    y: 0,
    width: 75,
    height: 10
  });
  const [rightPressed, setRightPressed] = useState(false);
  const [leftPressed, setLeftPressed] = useState(false);

  const keyDownHandler = (e) => {
    if (e.key === 'ArrowRight') {
      setRightPressed(true);
    } else if (e.key === 'ArrowLeft') {
      setLeftPressed(true);
    }
  };

  const keyUpHandler = (e) => {
    if (e.key === 'ArrowRight') {
      setRightPressed(false);
    } else if (e.key === 'ArrowLeft') {
      setLeftPressed(false);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    const drawBall = () => {
      context.beginPath();
      context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      context.fillStyle = '#0095DD';
      context.fill();
      context.closePath();
    };

    const drawPaddle = () => {
      context.beginPath();
      context.rect(paddle.x, paddle.y, paddle.width, paddle.height);
      context.fillStyle = '#0095DD';
      context.fill();
      context.closePath();
    };

    const update = () => {
      // ボールの動き
      setBall(prevBall => ({
        ...prevBall,
        x: prevBall.x + prevBall.dx,
        y: prevBall.y + prevBall.dy
      }));

      // ボールが画面の端に当たった時
      if (ball.x + ball.dx > canvas.width - ball.radius || ball.x + ball.dx < ball.radius) {
        setBall(prevBall => ({ ...prevBall, dx: -prevBall.dx }));
      }
      if (ball.y + ball.dy < ball.radius) {
        setBall(prevBall => ({ ...prevBall, dy: -prevBall.dy }));
      } else if (ball.y + ball.dy > canvas.height - ball.radius) {
        if (ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
          setBall(prevBall => ({ ...prevBall, dy: -prevBall.dy }));
        } else {
          alert('GAME OVER');
          document.location.reload();
        }
      }

      // パドルの動き
      if (rightPressed && paddle.x < canvas.width - paddle.width) {
        setPaddle(prevPaddle => ({ ...prevPaddle, x: prevPaddle.x + 7 }));
      } else if (leftPressed && paddle.x > 0) {
        setPaddle(prevPaddle => ({ ...prevPaddle, x: prevPaddle.x - 7 }));
      }
    };

    const draw = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      drawBall();
      drawPaddle();
      update();
    };

    const interval = setInterval(draw, 10);

    // キーボードイベントリスナーの設定
    window.addEventListener('keydown', keyDownHandler);
    window.addEventListener('keyup', keyUpHandler);

    return () => {
      clearInterval(interval);
      window.removeEventListener('keydown', keyDownHandler);
      window.removeEventListener('keyup', keyUpHandler);
    };
  }, [ball, paddle, rightPressed, leftPressed]);

  return <canvas ref={canvasRef} width={800} height={600} className="canvas" />;
};

export default Game;

