import { useEffect, useState } from "react";
import memoryGameStore from "../store/store";
import { GameType } from "../types";
import generateNumbers from "../helpers/numbers";
import { generateColors } from "../helpers/colors";
import generateNumberSequence from "../helpers/numbers-sequence";
import generateEmojis from "../helpers/emoji";

export default function useMemoryGame() {
    const { complexity,
        firstCard,
        matchedCards,
        setGameState,
        secondCard,
        setMatchedCards,
        setFirstCard,
        setSecondCard,
        setLocked,
        setEndTime,
        setOutcome,
        gameType
    } = memoryGameStore();

    function endGame() {
        setGameState("Ended")
        setOutcome("won")
        setEndTime(new Date().toISOString())
    }

    function cardsFor(type: GameType, level: string) {
        if (type === "Number") return generateNumbers(level);
        if (type === "Emoji") return generateEmojis(level);
        if (type === "Number-Sequence") return generateNumberSequence(level);
        return generateColors(level);
    }

    // deck is generated once per round
    const [gameCards] = useState(() => cardsFor(gameType, complexity));

    useEffect(() => {
        if (secondCard && gameType !== "Number-Sequence") {
            // lock input while the pair is being judged
            setLocked(true);
            const timer = setTimeout(() => {
                if (firstCard!.color === secondCard!.color) {
                    setMatchedCards([...matchedCards, firstCard!, secondCard])
                } else {
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
