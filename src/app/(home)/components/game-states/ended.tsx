import { Card } from '@/components/ui/card'
import React, { useEffect } from 'react'
import { Button } from '@/components/ui/button';
import memoryGameStore from '../../store/store';
import { Share2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ACHIEVEMENTS, evaluate, recordRun, RunSummary, unlock } from '../../helpers/progress';

function getTimeDifference(start: Date, end: Date): string {
  if (!(start instanceof Date) || !(end instanceof Date)) {
    throw new Error('Invalid date object provided');
  }
  let diff = Math.abs(end.getTime() - start.getTime());
  let hours = Math.floor(diff / 3600000);
  diff -= hours * 3600000;
  let minutes = Math.floor(diff / 60000);
  let seconds = Math.floor(diff / 1000);
  return `${hours !== 0 ? `${hours}h:` : ""}${minutes !== 0 ? `${minutes}m:` : ""}${seconds}s`;
}

export default function Ended() {
  const {
    startTime,
    endTime,
    playerName,
    player2Name,
    mode,
    gameType,
    complexity,
    outcome,
    moves,
    mismatches,
    maxStreak,
    livesEnabled,
    lostLife,
    matchedCards,
    playerScores,
    roundWins,
    setRoundWins,
    setPlayerScores,
    setActivePlayer,
    setStartTime, setMatchedCards, setMoves, setOutcome, setLocked,
    setGameState, setFirstCard, setSecondCard,
  } = memoryGameStore()

  const lost = outcome === "lost";
  const won = !lost;
  const duelish = mode === "Duel" || mode === "BestOf3";
  const bestOf3 = mode === "BestOf3";

  // run recorded once, on mount
  const [result] = React.useState(() => {
    const timeMs = Math.abs(new Date(endTime!).getTime() - new Date(startTime!).getTime());
    const run: RunSummary = {
      gameType, complexity, won, timeMs, moves, mismatches, maxStreak, mode, lostLife,
    };
    const flags = recordRun(run);
    const earned = evaluate(run, []);
    unlock(earned);
    let value: number | null = null;
    if (won && !duelish) {
      const elapsedSec = Math.round(timeMs / 1000);
      value = Math.max(0,
        matchedCards.length * 100
        - moves * 10
        + maxStreak * 25
        + Math.max(0, 240 - elapsedSec) * 2
      );
    }
    return { run, flags, earned, value };
  });

  const { run, flags: bestFlags, earned: newAchievements, value: score } = result;

  // BestOf3: round winner derived from scores; credit happens on "Next round"
  const roundWinner = bestOf3 && playerScores[0] !== playerScores[1]
    ? (playerScores[0] > playerScores[1] ? 0 : 1)
    : null;

  const seriesWinner = bestOf3 && (roundWins[0] >= 2 || roundWins[1] >= 2)
    ? (roundWins[0] >= 2 ? 0 : 1)
    : null;

  useEffect(() => {
    if (won && !duelish) {
      confetti({ particleCount: 120, spread: 80, disableForReducedMotion: true });
    }
  }, []);

  function share() {
    const dailySuffix = mode === "Daily" && run.gameType ? ` — replay: ${window.location.origin}/?daily=${run.mode === "Daily" ? memoryGameStore.getState().dailySeedValue : ""}` : "";
    const text = duelish
      ? `Memory Duel: ${playerName} ${playerScores[0]} — ${playerScores[1]} ${player2Name}${roundWinner !== null ? `, ${roundWinner === 0 ? playerName : player2Name} takes the round` : ", tied"}`
      : won
        ? `Memory Game — ${gameType}/${complexity}: cleared in ${getTimeDifference(new Date(startTime!), new Date(endTime!))} with ${moves} moves${score !== null ? ` (score ${score})` : ""}`
        : `Memory Game — ${gameType}/${complexity}: ${lost ? "time ran out" : "lives ran out"} after ${matchedCards.length / 2} pairs and ${moves} moves`;
    if (navigator.share) {
      navigator.share({ title: "Memory Game", text }).catch(() => { });
    } else {
      navigator.clipboard?.writeText(text + (mode === "Daily" ? dailySuffix : "")).catch(() => { });
    }
  }

  function nextRound() {
    // credit the round winner, keep series progress, reset the round
    if (roundWinner !== null) {
      const next: [number, number] = [...roundWins];
      next[roundWinner] += 1;
      setRoundWins(next);
    }
    setPlayerScores([0, 0]);
    setActivePlayer(0);
    setFirstCard(null)
    setSecondCard(null)
    setMatchedCards([])
    setMoves(0)
    setOutcome("won")
    setLocked(false)
    setGameState("Playing");
    setStartTime(new Date().toISOString());
  }

  function resetRoundState() {
    setFirstCard(null)
    setSecondCard(null)
    setMatchedCards([])
    setMoves(0)
    setOutcome("won")
    setLocked(false)
  }

  return (
    <Card className='p-8 space-y-5 text-center'>
      <h2 className='text-3xl'>
        {seriesWinner !== null
          ? "Series Won!"
          : bestOf3
            ? `Round ${roundWins[0] + roundWins[1] + 1} Over`
            : duelish ? "Duel Over" : lost ? "Time's Up" : "Congratulations"}
      </h2>
      {duelish ? (
        <>
          <p className='text-2xl font-semibold font-serif'>
            {seriesWinner !== null
              ? `${seriesWinner === 0 ? playerName : player2Name} wins the series`
              : roundWinner !== null
                ? `${roundWinner === 0 ? playerName : player2Name} takes the round`
                : "It's a tie!"}
          </p>
          <p className='text-4xl uppercase font-bold tabular-nums'>
            {playerName} {playerScores[0]} — {playerScores[1]} {player2Name}
          </p>
          {bestOf3 && (
            <p className='text-lg tabular-nums'>
              Series: {playerName} {roundWins[0]} — {roundWins[1]} {player2Name} (first to 2)
            </p>
          )}
        </>
      ) : (
        <>
          <p className='text-2xl font-semibold font-serif'>{playerName}</p>
          <p className='text-xl'>{lost ? "You ran out of time after" : "You have completed the game in"}</p>
          <p className='text-4xl uppercase font-bold'>{getTimeDifference(new Date(startTime!), new Date(endTime!))}</p>
          {score !== null && <p className='text-xl'>Score: <span className='font-bold tabular-nums'>{score}</span></p>}
          <p className='text-sm text-muted-foreground'>Moves {moves} · Misses {mismatches} · Best streak {maxStreak}</p>
          {(bestFlags.isNewBestTime || bestFlags.isNewBestMoves) && (
            <p className='text-sm font-bold text-primary'>
              {bestFlags.isNewBestTime && "New best time! "}{bestFlags.isNewBestMoves && "New fewest moves!"}
            </p>
          )}
        </>
      )}
      {newAchievements.length > 0 && (
        <div className='space-y-1'>
          <p className='text-sm uppercase tracking-wider text-muted-foreground'>Achievement unlocked</p>
          {newAchievements.map(id => {
            const a = ACHIEVEMENTS.find(x => x.id === id);
            return a ? <p key={id} className='text-sm'>🏆 <span className='font-bold'>{a.name}</span> — {a.description}</p> : null;
          })}
        </div>
      )}
      <hr />
      {!duelish && <ResultGame />}
      <div className='flex-col gap-2 flex'>
        {bestOf3 && seriesWinner === null ? (
          <Button onClick={nextRound}>Next round</Button>
        ) : (
          <Button onClick={() => {
            resetRoundState();
            if (bestOf3) { setRoundWins([0, 0]); setPlayerScores([0, 0]); setActivePlayer(0); }
            setGameState("Playing");
            setStartTime(new Date().toISOString());
          }}>Play Again</Button>
        )}
        <Button onClick={() => {
          resetRoundState();
          if (bestOf3) { setRoundWins([0, 0]); setPlayerScores([0, 0]); setActivePlayer(0); }
          setGameState("New");
          setStartTime(null);
        }}>New Game</Button>
        <Button variant='secondary' onClick={share}>
          <Share2 className='h-4 w-4 mr-2' /> Share result
        </Button>
      </div>
    </Card>
  )
}

const ResultGame = () => {
  const { matchedCards, complexity, gameType } = memoryGameStore()

  return <div>
    <div className={`grid ${complexity === "Easy" ? "grid-cols-4" : "grid-cols-8"} gap-5`}>
      {matchedCards.sort((a, b) => a.index - b.index).map((card, index) =>
        <Card key={index}
          className='h-16 w-16 lg:h-20 lg:w-20 hover:scale-105 cursor-pointer transition-all flex items-center justify-center rounded-lg border bg-card'
          style={{ backgroundColor: card.color }}>
          {gameType !== "Color" && card.color}
        </Card>
      )}
    </div>
  </div>
}
