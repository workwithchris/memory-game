import React from 'react';
import useCountdownTimer from '../../hook/countdown-timer.hook';

const CountdownTimer = ({ time, onComplete, paused = false }: { time: number, onComplete: (value: boolean) => void, paused?: boolean }) => {
  const timerVal = useCountdownTimer(time, onComplete, paused);
  return (
    <span className='font-bold tabular-nums'>
      {timerVal}
    </span>
  );
};

export default CountdownTimer;
