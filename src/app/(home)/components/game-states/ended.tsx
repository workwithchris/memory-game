import { Card } from '@/components/ui/card'
import React from 'react'
import { Button } from '@/components/ui/button';
import memoryGameStore from '../../store/store';

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
  const { startTime,
    endTime, playerName, outcome, setStartTime, setMatchedCards, setMoves, setOutcome,
    setGameState, setFirstCard, setSecondCard } = memoryGameStore()
  const lost = outcome === "lost";
  return (
    <Card className='p-8 space-y-5 text-center'>
      <h2 className='text-3xl'>{lost ? "Time's Up" : "Congratulations"}</h2>
      <p className='text-2xl font-semibold font-serif'>{playerName}</p>
      <p className='text-xl'>{lost ? "You ran out of time after" : "You have completed the game in"}</p>
      <p className='text-4xl uppercase font-bold'>{getTimeDifference(new Date(startTime!), new Date(endTime!))}</p>
      <hr />
      <ResultGame />
      <div className='flex-col gap-2 flex'>
        <Button onClick={() => {
          setGameState("Playing");
          setStartTime(new Date().toISOString());
          setFirstCard(null)
          setSecondCard(null)
          setMatchedCards([])
          setMoves(0)
          setOutcome("won")
        }}>Play Again</Button>
        <Button onClick={() => {
          setGameState("New");
          setStartTime(null);
        }}>New Game</Button>
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