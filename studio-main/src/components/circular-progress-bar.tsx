"use client";

import { useEffect, useState } from "react";

interface CircularProgressBarProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
}

export function CircularProgressBar({
  progress,
  size = 100,
  strokeWidth = 10,
  color = "hsl(var(--primary))",
}: CircularProgressBarProps) {
  const [displayProgress, setDisplayProgress] = useState(0);

  useEffect(() => {
    const animation = requestAnimationFrame(() => setDisplayProgress(progress));
    return () => cancelAnimationFrame(animation);
  }, [progress]);

  const center = size / 2;
  const radius = center - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - displayProgress / 100);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="w-full h-full" viewBox={`0 0 ${size} ${size}`}>
        <circle
          className="text-muted/50"
          stroke="currentColor"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={radius}
          cx={center}
          cy={center}
        />
        <circle
          stroke={color}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          r={radius}
          cx={center}
          cy={center}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{
            transition: 'stroke-dashoffset 0.5s ease-out',
            transform: 'rotate(-90deg)',
            transformOrigin: 'center',
          }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xl font-bold" style={{ color }}>
          {Math.round(progress)}%
        </span>
      </div>
    </div>
  );
}
