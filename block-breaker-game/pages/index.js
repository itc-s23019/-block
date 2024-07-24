// pages/index.js
import { useEffect, useRef, useState } from 'react';
import Head from 'next/head';

const BlockBreakerGame = () => {
  const canvasRef = useRef(null);
  const [paddle, setPaddle] = useState({ x: 0, y: 0, width: 75, height: 10 });
  const [ball, setBall] = useState({ x: 0, y: 0, radius: 10, dx: 2, dy: -2 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    const brickRowCount = 5;
    const brickColumnCount = 3;
    const brickWidth = 75;
    const brickHeight = 20;
    const brickPadding = 10;
    const brickOffsetTop = 30;
    const brickOffsetLeft = 30;

    let bricksArray = [];
    for (let c = 0; c < brickColumnCount; c++) {
      bricksArray[c] = [];
      for (let r = 0; r < brickRowCount; r++) {
        bricksArray[c][r] = { x: 0, y: 0, status: 1 };
      }
    }

    setPaddle((prevPaddle) => ({
      ...prevPaddle,
      x: (canvas.width - prevPaddle.width) / 2,
      y: canvas.height - prevPaddle.height - 10,
    }));
    setBall((prevBall) => ({
      ...prevBall,
      x: canvas.width / 2,
      y: canvas.height - 30,
    }));

    const drawBricks = () => {
      bricksArray.forEach((column, c) => {
        column.forEach((brick, r) => {
          if (brick.status === 1) {
            const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
            const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
            brick.x = brickX;
            brick.y = brickY;
            context.beginPath();
            context.rect(brickX, brickY, brickWidth, brickHeight);
            context.fillStyle = '#0095DD';
            context.fill();
            context.closePath();
          }
        });
      });
    };

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

    const draw = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      drawBricks();
      drawBall();
      drawPaddle();

      // ボールが左右の壁に衝突した場合の処理
      if (
        ball.x + ball.dx > canvas.width - ball.radius ||
        ball.x + ball.dx < ball.radius
      ) {
        setBall((prevBall) => ({ ...prevBall, dx: -prevBall.dx }));
      }

      // ボールが上の壁に衝突した場合の処理
      if (ball.y + ball.dy < ball.radius) {
        setBall((prevBall) => ({ ...prevBall, dy: -prevBall.dy }));
      }

      // ボールがパドルに衝突した場合の処理
      if (
        ball.y + ball.dy > paddle.y - ball.radius &&
        ball.x > paddle.x &&
        ball.x < paddle.x + paddle.width
      ) {
        setBall((prevBall) => ({ ...prevBall, dy: -prevBall.dy }));
      } 
      
      // ボールが下の壁に衝突した場合の処理（ゲームオーバー）
      else if (ball.y + ball.dy > canvas.height - ball.radius) {
        alert('GAME OVER');
        document.location.reload();
      }

      bricksArray.forEach((column, c) => {
        column.forEach((brick, r) => {
          if (brick.status === 1) {
            if (
              ball.x > brick.x &&
              ball.x < brick.x + brickWidth &&
              ball.y > brick.y &&
              ball.y < brick.y + brickHeight
            ) {
              setBall((prevBall) => ({ ...prevBall, dy: -prevBall.dy }));
              brick.status = 0;
            }
          }
        });
      });

      setBall((prevBall) => ({
        ...prevBall,
        x: prevBall.x + prevBall.dx,
        y: prevBall.y + prevBall.dy,
      }));

      requestAnimationFrame(draw);
    };

    draw();

    const keyDownHandler = (e) => {
      if (e.key === 'Right' || e.key === 'ArrowRight') {
        setPaddle((prevPaddle) => ({
          ...prevPaddle,
          x: Math.min(canvas.width - prevPaddle.width, prevPaddle.x + 7),
        }));
      } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        setPaddle((prevPaddle) => ({
          ...prevPaddle,
          x: Math.max(0, prevPaddle.x - 7),
        }));
      }
    };

    document.addEventListener('keydown', keyDownHandler, false);

    return () => {
      document.removeEventListener('keydown', keyDownHandler, false);
    };
  }, [paddle, ball]);

  return (
    <div className="container">
      <Head>
        <title>Block Breaker Game</title>
      </Head>
      <h1 className="title">Block Breaker Game</h1>
      <canvas className="canvas" ref={canvasRef} width={480} height={320} />
    </div>
  );
};

export default BlockBreakerGame;

