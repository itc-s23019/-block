"use client";

import React, { useState, useEffect, useRef } from 'react';
import styles from './BlockBreaker.module.css';

const BlockMain = () => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [score, setScore] = useState(0);
  const intervalRef = useRef(null);
  const canvasRef = useRef(null);
  const gameRef = useRef({
    ball: {
      x: 0,
      y: 0,
      radius: 10,
      dx: 2,
      dy: -2,
    },
    paddle: {
      height: 10,
      width: 75,
      x: 0,
    },
    blocks: [],
  });

  const startTimeRef = useRef(null);
  const gameStartedRef = useRef(false);
  const blocksInitializedRef = useRef(false);

  const drawBall = (ctx, ball) => {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
  };

  const drawPaddle = (ctx, paddle, canvas) => {
    ctx.beginPath();
    ctx.rect(paddle.x, canvas.height - paddle.height, paddle.width, paddle.height);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
  };

  const drawBlocks = (ctx, blocks) => {
    blocks.forEach((block) => {
      if (!block.isDestroyed) {
        ctx.beginPath();
        ctx.rect(block.x, block.y, block.width, block.height);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
      }
    });
  };

  const drawScore = (ctx, score) => {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText(`Score: ${score}`, 8, 20);
  };

  const draw = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { ball, paddle, blocks } = gameRef.current;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall(ctx, ball);
    drawPaddle(ctx, paddle, canvas);
    drawBlocks(ctx, blocks);
    drawScore(ctx, score);

    if (ball.x + ball.dx > canvas.width - ball.radius || ball.x + ball.dx < ball.radius) {
      ball.dx = -ball.dx;
    }

    if (ball.y + ball.dy < ball.radius) {
      ball.dy = -ball.dy;
    } else if (ball.y + ball.dy > canvas.height - ball.radius) {
      if (ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
        const relativePosition = (ball.x - (paddle.x + paddle.width / 2)) / (paddle.width / 2);
        const reflectionAngle = relativePosition * Math.PI / 4;
        const speedMultiplier = 1;
        const speed = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy) * speedMultiplier;
        ball.dx = Math.sin(reflectionAngle) * speed;
        ball.dy = -Math.cos(reflectionAngle) * speed;
      } else {
        alert('GAME OVER');
        document.location.reload();
        return;
      }
    }

    let allBlocksDestroyed = true;
    blocks.forEach((block) => {
      if (!block.isDestroyed) {
        allBlocksDestroyed = false;
        if (
          ball.x > block.x &&
          ball.x < block.x + block.width &&
          ball.y > block.y &&
          ball.y < block.y + block.height
        ) {
          block.isDestroyed = true;
          ball.dy = -ball.dy;
          setScore((prevScore) => prevScore + 10);
        }
      }
    });

    if (allBlocksDestroyed) {
      const endTime = new Date();
      const timeDiff = endTime - startTimeRef.current;
      const seconds = Math.floor(timeDiff / 1000);
      const baseScore = score;
      const bonusScore = Math.max(10000 - (seconds * 100), 0); // 経過時間が短いほど高いボーナス

      const finalScore = baseScore + bonusScore;

      alert(`ゲームクリア！おめでとうございます😁\nクリアにかかった時間：${seconds}秒\nスコア: ${finalScore}`);
      document.location.reload();
      return;
    }

    ball.x += ball.dx;
    ball.y += ball.dy;

    requestAnimationFrame(draw);
  };

  const mouseMoveHandler = (e) => {
    const canvas = canvasRef.current;
    const { paddle } = gameRef.current;
    const relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
      paddle.x = relativeX - paddle.width / 2;
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const { ball, paddle } = gameRef.current;

    if (!blocksInitializedRef.current) {
      const blockRowCount = 6;
      const blockColumnCount = 8;
      const blockWidth = 75;
      const blockHeight = 20;
      const blockPadding = 15;
      const blockOffsetTop = 30;
      const blockOffsetLeft = 30;

      for (let c = 0; c < blockColumnCount; c++) {
        for (let r = 0; r < blockRowCount; r++) {
          const blockX = (c * (blockWidth + blockPadding)) + blockOffsetLeft;
          const blockY = (r * (blockHeight + blockPadding)) + blockOffsetTop;
          gameRef.current.blocks.push({
            x: blockX,
            y: blockY,
            width: blockWidth,
            height: blockHeight,
            isDestroyed: false,
          });
        }
      }
      blocksInitializedRef.current = true;
    }

    ball.x = Math.random() * (canvas.width - 3 * ball.radius) + ball.radius;
    ball.y = Math.random() * (canvas.height - 3 * ball.radius) + ball.radius;
    ball.dx = 4;
    ball.dy = -4;
    paddle.x = (canvas.width - paddle.width) / 2;

    canvas.addEventListener("mousemove", mouseMoveHandler);

    return () => {
      canvas.removeEventListener("mousemove", mouseMoveHandler);
    };
  }, []);

  const startGame = () => {
    if (!gameStartedRef.current) {
      gameStartedRef.current = true;
      startTimeRef.current = new Date();
      setIsRunning(true);
      draw();
    }
  };

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setElapsedTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => {
      clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  return (
    <div className={styles.mainContent}>
      <p>経過時間: {Math.floor(elapsedTime / 60)}分{elapsedTime % 60}秒</p>
      <p>スコア: {score}</p>
      <canvas ref={canvasRef} width={800} height={600} style={{ border: '1px solid #000' }} />
      <div className={styles.startButton}>
        <button onClick={startGame}>ゲームスタート</button>
      </div>
    </div>
  );
};

export default BlockMain;

