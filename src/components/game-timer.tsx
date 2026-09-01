// src/Timer.js
import React, { useState, useEffect } from 'react';

type TimerProps = {
  startDate: string | null;
  pausedAt?: number | null;
  pausedTotalMs?: number;
};

const Timer = ({ startDate, pausedAt = null, pausedTotalMs = 0 }: TimerProps) => {
  const calculateTimePassed = () => {
    if (!startDate) return {};
    // while paused, freeze at the pause moment; subtract accumulated pause time
    const now = pausedAt ?? Date.now();
    const difference = now - +new Date(startDate) - pausedTotalMs;
    let timePassed = {};

    if (difference > 0) {
      timePassed = {
        hr: Math.floor((difference / (1000 * 60 * 60)) % 24),
        m: Math.floor((difference / 1000 / 60) % 60),
        s: Math.floor((difference / 1000) % 60),
      };
    }

    return timePassed;
  };

  const [timePassed, setTimePassed] = useState<Record<string, number>>({});

  useEffect(() => {
    if (pausedAt) return; // frozen while paused
    const tick = () => setTimePassed(calculateTimePassed());
    const first = setTimeout(tick, 0);
    const timer = setInterval(tick, 1000);

    return () => {
      clearTimeout(first);
      clearInterval(timer);
    };
  }, [pausedAt, pausedTotalMs, startDate]);

  const timerComponents: any = [];

  Object.keys(timePassed).forEach((interval) => {
    if (!timePassed[interval]) {
      return;
    }

    timerComponents.push(
      <span key={interval} className='tabular-nums'>
        {timePassed[interval]} {interval}{" "}
      </span>
    );
  });

  return (
    <div className='font-mono text-sm'>
      {timerComponents.length ? timerComponents : <span>0 s</span>}
    </div>
  );
};

export default Timer;
