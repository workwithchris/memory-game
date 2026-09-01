import { useEffect } from "react";
import memoryGameStore from "../store/store";
import { buildDeck } from "../helpers/deck";
import { sfx } from "../helpers/sfx";

export default function useMemoryGame() {
    const {
        complexity,
        mode,
        gameCards,
        firstCard,
        matchedCards,
        lives,
        livesEnabled,
        setGameState,
        setOutcome,
        secondCard,
        setMatchedCards,
        setFirstCard,
        setSecondCard,
        setLocked,
        setLives,
        setLostLife,
        setStreak,
        setMaxStreak,
        setMismatches,
        setActivePlayer,
        setPlayerScores,
        setEndTime,
        playerScores,
        activePlayer,
        streak,
        gameType
    } = memoryGameStore();

    const duelish = mode === "Duel" || mode === "BestOf3";

    function endGame() {
        sfx.win();
        setGameState("Ended")
        setOutcome("won")
        setEndTime(new Date().toISOString())
    }

    function loseGame() {
        sfx.lose();
        setGameState("Ended")
        setOutcome("lost")
        setEndTime(new Date().toISOString())
    }

    useEffect(() => {
        if (secondCard && gameType !== "Number-Sequence") {
            // lock input while the pair is being judged
            setLocked(true);
            const timer = setTimeout(() => {
                if (firstCard!.color === secondCard!.color) {
                    sfx.match();
                    const nextStreak = streak + 1;
                    setStreak(nextStreak);
                    setMaxStreak(Math.max(nextStreak, memoryGameStore.getState().maxStreak));
                    if (duelish) {
                        const scores: [number, number] = [...playerScores];
                        scores[activePlayer] += 1;
                        setPlayerScores(scores);
                    }
                    setMatchedCards([...matchedCards, firstCard!, secondCard])
                } else {
                    sfx.miss();
                    setStreak(0);
                    setMismatches(memoryGameStore.getState().mismatches + 1);
                    if (duelish) {
                        setActivePlayer(activePlayer === 0 ? 1 : 0);
                    }
                    if (livesEnabled) {
                        const remaining = lives - 1;
                        setLives(remaining);
                        setLostLife(true);
                        if (remaining <= 0) {
                            loseGame();
                        }
                    }
                    if (complexity === "Extreme") {
                        setMatchedCards([])
                    }
                }
                setFirstCard(null)
                setSecondCard(null)
                setLocked(false)
            }, 800);
            return () => clearTimeout(timer);
        }
    }, [secondCard])

    useEffect(() => {
        if (gameType === "Number-Sequence") {
            const matchCounts = {
                "Easy": 16,
                "Medium": 32,
                "Hard": 48,
                "Extreme": 48
            };

            if (matchedCards.length === matchCounts[complexity]) {
                endGame();
            }
        }
        else {
            const matchCounts = {
                "Easy": 8,
                "Medium": 16,
                "Hard": 24,
                "Extreme": 24
            };

            if (matchedCards.length === matchCounts[complexity] * 2) {
                endGame();
            }
        }
    }, [matchedCards])

    return { gameCards }
}
