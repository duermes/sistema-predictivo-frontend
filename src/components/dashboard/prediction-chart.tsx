"use client";

import { useEffect, useRef } from "react";

export function PredictionChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = 300;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 1;

    for (let i = 0; i <= 5; i++) {
      const y = i * (canvas.height / 5);
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    for (let i = 0; i <= 24; i++) {
      const x = i * (canvas.width / 24);
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.moveTo(0, canvas.height * 0.8);

    const points = [
      { x: 0, y: 0.8 },
      { x: 0.1, y: 0.7 },
      { x: 0.2, y: 0.6 },
      { x: 0.3, y: 0.5 },
      { x: 0.4, y: 0.4 },
      { x: 0.5, y: 0.3 },
      { x: 0.6, y: 0.2 },
      { x: 0.7, y: 0.3 },
      { x: 0.8, y: 0.5 },
      { x: 0.9, y: 0.7 },
      { x: 1.0, y: 0.6 },
    ];

    ctx.beginPath();
    ctx.moveTo(0, canvas.height * points[0].y);

    for (let i = 1; i < points.length; i++) {
      const x = points[i].x * canvas.width;
      const y = points[i].y * canvas.height;
      ctx.lineTo(x, y);
    }

    ctx.strokeStyle = "#ef4444";
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.lineTo(canvas.width, canvas.height);
    ctx.lineTo(0, canvas.height);
    ctx.closePath();
    ctx.fillStyle = "rgba(239, 68, 68, 0.1)";
    ctx.fill();

    const highlightX = canvas.width * 0.8;
    const highlightY = canvas.height * 0.5;

    ctx.beginPath();
    ctx.arc(highlightX, highlightY, 6, 0, Math.PI * 2);
    ctx.fillStyle = "#ef4444";
    ctx.fill();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(highlightX - 15, highlightY - 30, 30, 20);
    ctx.strokeStyle = "#e2e8f0";
    ctx.strokeRect(highlightX - 15, highlightY - 30, 30, 20);

    ctx.fillStyle = "#000000";
    ctx.font = "12px Arial";
    ctx.textAlign = "center";
    ctx.fillText("38", highlightX, highlightY - 15);

    ctx.fillStyle = "#94a3b8";
    ctx.textAlign = "center";
    for (let i = 0; i <= 24; i += 4) {
      const x = i * (canvas.width / 24);
      ctx.fillText(i.toString(), x, canvas.height - 5);
    }

    ctx.textAlign = "right";
    for (let i = 0; i <= 5; i++) {
      const y = i * (canvas.height / 5);
      const value = 50 - i * 10;
      ctx.fillText(value.toString(), 20, y + 15);
    }
  }, []);

  return (
    <div className="w-full h-full">
      <canvas ref={canvasRef} className="w-full h-[300px]"></canvas>
    </div>
  );
}
