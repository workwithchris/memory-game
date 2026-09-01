"use client"
import React, { useState } from 'react'
import { ACHIEVEMENTS, getStats, getUnlocked, Stats } from '../../helpers/progress';

export default function ProgressView() {
    // read localStorage once per drawer mount
    const [stats] = useState<Stats>(() => (typeof window === "undefined" ? {} : getStats()));
    const [unlocked] = useState<string[]>(() => (typeof window === "undefined" ? [] : getUnlocked()));

    const entries = Object.entries(stats).filter(([, s]) => s.games > 0);

    return (
        <div className='space-y-4'>
            <div>
                <h3 className='font-semibold text-sm uppercase tracking-wider pb-2'>Your stats</h3>
                {entries.length === 0 ? (
                    <p className='text-sm text-muted-foreground'>No games yet — finish a round to record stats.</p>
                ) : (
                    <ul className='space-y-1 text-sm'>
                        {entries.map(([key, s]) => (
                            <li key={key} className='flex justify-between gap-2'>
                                <span className='truncate'>{key.replace(":", " · ")}</span>
                                <span className='tabular-nums whitespace-nowrap text-muted-foreground'>
                                    {s.wins}W/{s.games}G
                                    {s.bestTimeMs !== null && ` · ${Math.round(s.bestTimeMs / 1000)}s`}
                                    {s.bestMoves !== null && ` · ${s.bestMoves} moves`}
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <div>
                <h3 className='font-semibold text-sm uppercase tracking-wider pb-2'>Achievements</h3>
                <ul className='space-y-1 text-sm'>
                    {ACHIEVEMENTS.map(a => (
                        <li key={a.id}>
                            <span aria-hidden>{unlocked.includes(a.id) ? "🏆" : "🔒"}</span>{" "}
                            <span className={unlocked.includes(a.id) ? "font-semibold" : "text-muted-foreground"}>
                                {a.name} — {a.description}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
