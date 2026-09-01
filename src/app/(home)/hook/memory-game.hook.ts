import { useEffect } from "react";
import memoryGameStore from "../store/store";
import { buildDeck, JOKER, TRAP } from "../helpers/deck";
import { sfx } from "../helpers/sfx";
import { getUnlocked, unlock } from "../helpers/progress";
import { shuffle } from "../helpers/core";

export default function useMemoryGame() {
    const {
        complexity,
        mode,
        gameCards,
        firstCard,
        matchedCards,
        deadIndices,
        lives,
        livesEnabled,
        setGameState,
        setOutcome,
        secondCard,
        setMatchedCards,
        setGameCards,
        setDeadIndices,
        setToast,
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
                const a = firstCard!.color;
                const b = secondCard!.color;
                // jokers match anything
                const isMatch = a === b || a === JOKER || b === JOKER;
                if (isMatch) {
                    sfx.match();
                    const additions = [firstCard!, secondCard!];
                    // joker + normal: the normal card's twin is auto-matched too
                    if (a === JOKER && b !== JOKER) {
                        const twin = gameCards.findIndex((c, i) => c === b && i !== secondCard!.index && !matchedCards.some(m => m.index === i) && !deadIndices.includes(i));
                        if (twin >= 0) additions.push({ index: twin, color: b });
                    } else if (b === JOKER && a !== JOKER) {
                        const twin = gameCards.findIndex((c, i) => c === a && i !== firstCard!.index && !matchedCards.some(m => m.index === i) && !deadIndices.includes(i));
                        if (twin >= 0) additions.push({ index: twin, color: a });
                    }
                    const nextStreak = streak + 1;
                    setStreak(nextStreak);
                    setMaxStreak(Math.max(nextStreak, memoryGameStore.getState().maxStreak));
                    if (duelish) {
                        const scores: [number, number] = [...playerScores];
                        scores[activePlayer] += 1;
                        setPlayerScores(scores);
                    }
                    setMatchedCards([...matchedCards, ...additions]);

                    // Extreme: after every 5 matches, remaining cards quietly swap positions
                    const totalMatched = matchedCards.length + additions.length;
                    if (complexity === "Extreme" && totalMatched > 0 && totalMatched % 10 === 0 && totalMatched < gameCards.length) {
                        const keep = new Set<number>([...matchedCards.map(m => m.index), ...additions.map(m => m.index), ...deadIndices]);
                        const rest = shuffle(gameCards.filter((_, i) => !keep.has(i)));
                        const next = [...gameCards];
                        let k = 0;
                        for (let i = 0; i < gameCards.length; i++) {
                            if (!keep.has(i)) next[i] = rest[k++];
                        }
                        setGameCards(next);
                    }
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
                // mid-game achievement toast: 5-streak
                if (memoryGameStore.getState().maxStreak === 5 && !getUnlocked().includes("streak-5")) {
                    unlock(["streak-5"]);
                    setToast("🏆 In the Zone — 5 in a row!");
                }
                setFirstCard(null)
                setSecondCard(null)
                setLocked(false)
            }, 800);
            return () => clearTimeout(timer);
        }
    }, [secondCard])

    // round is over when every card is accounted for (matched or neutralized trap)
    useEffect(() => {
        if (gameCards.length > 0 && matchedCards.length + deadIndices.length === gameCards.length) {
            endGame();
        }
    }, [matchedCards, deadIndices])

    return { gameCards }
}
