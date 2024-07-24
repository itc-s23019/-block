// pages/index.js
import { useEffect, useRef, useState } from 'react';
import { db, collection, addDoc, getDocs } from '../lib/firebase';

const BlockBreakerGame = () => {
  const canvasRef = useRef(null);
  const [paddle, setPaddle] = useState({ x: 0, y: 0, width: 75, height: 10 });
  const [ball, setBall] = useState({ x: 0, y: 0, radius: 10, dx: 2, dy: -2 });
  const [bricks, setBricks] = useState([]);

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

    const initialBricks = [];
    for (let c = 0; c < brickColumnCount; c++) {
      initialBricks[c] = [];
      for (let r = 0; r < brickRowCount; r++) {
        initialBricks[c][r] = { x: 0, y: 0, status: 1 };
      }
    }
    setBricks(initialBricks);

    const updateGame = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);

      drawBricks(context);
      drawBall(context);
      drawPaddle(context);

      if (
        ball.x + ball.dx > canvas.width - ball.radius ||
        ball.x + ball.dx < ball.radius
      ) {
        setBall((prev) => ({ ...prev, dx: -prev.dx }));
      }

      if (ball.y + ball.dy < ball.radius) {
        setBall((prev) => ({ ...prev, dy: -prev.dy }));
      } else if (ball.y + ball.dy > canvas.height - ball.radius) {
        // GAME OVER
        saveScore();
        alert('GAME OVER');
        document.location.reload();
      }

      if (
        ball.y + ball.dy > paddle.y - ball.radius &&
        ball.x > paddle.x &&
        ball.x < paddle.x + paddle.width
      ) {
        setBall((prev) => ({ ...prev, dy: -prev.dy }));
      }

      bricks.forEach((column, c) => {
        column.forEach((brick, r) => {
          if (brick.status === 1) {
            if (
              ball.x > brick.x &&
              ball.x < brick.x + brickWidth &&
              ball.y > brick.y &&
              ball.y < brick.y + brickHeight
            ) {
              setBall((prev) => ({ ...prev, dy: -prev.dy }));
              brick.status = 0;
            }
          }
        });
      });

      setBall((prev) => ({
        ...prev,
        x: prev.x + prev.dx,
        y: prev.y + prev.dy,
      }));

      requestAnimationFrame(updateGame);
    };

    const drawBall = (context) => {
      context.beginPath();
      context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      context.fillStyle = '#0095DD';
      context.fill();
      context.closePath();
    };

    const drawPaddle = (context) => {
      context.beginPath();
      context.rect(paddle.x, paddle.y, paddle.width, paddle.height);
      context.fillStyle = '#0095DD';
      context.fill();
      context.closePath();
    };

    const drawBricks = (context) => {
      bricks.forEach((column, c) => {
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

    const keyDownHandler = (e) => {
      if (e.key === 'Right' || e.key === 'ArrowRight') {
        setPaddle((prev) => ({
          ...prev,
          x: Math.min(canvas.width - prev.width, prev.x + 7),
        }));
      } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        setPaddle((prev) => ({
          ...prev,
          x: Math.max(0, prev.x - 7),
        }));
      }
    };

    document.addEventListener('keydown', keyDownHandler, false);

    updateGame();

    return () => {
      document.removeEventListener('keydown', keyDownHandler, false);
    };
  }, [ball, paddle, bricks]);

  const saveScore = async () => {
    try {
      const scoresRef = collection(db, 'scores');
      await addDoc(scoresRef, {
        score: 100, // スコアを設定する
        timestamp: new Date(),
      });
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  };

  return (
    <div className="container">
      <h1 className="title">Block Breaker Game</h1>
      <canvas className="canvas" ref={canvasRef} width={480} height={320} />
    </div>
  );
};

export default BlockBreakerGame;

