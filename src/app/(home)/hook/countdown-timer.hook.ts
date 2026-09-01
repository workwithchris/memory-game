import { useEffect, useRef, useState } from "react";

export default function useCountdownTimer(time: number, onComplete: (value: boolean) => void, paused = false) {
    const [timeLeft, setTimeLeft] = useState(time * 60);

    const timerRef = useRef<any>(null);

    const startTimer = () => {
        if (timerRef.current !== null) {
            clearInterval(timerRef.current);
        }

        timerRef.current = setInterval(() => {
            setTimeLeft((prevTime) => {
                if (paused) return prevTime;
                if (prevTime <= 1) {
                    clearInterval(timerRef.current);
                    stopTimer();
                    onComplete(true);
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);
    };

    const stopTimer = () => {
        if (timerRef.current !== null) {
            clearInterval(timerRef.current);
        }
    };

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    };

    useEffect(() => {
        startTimer();
        // clear on unmount so the countdown can't fire after leaving the round
        return () => {
            stopTimer();
        };
    }, []);

    return formatTime(timeLeft);
}
