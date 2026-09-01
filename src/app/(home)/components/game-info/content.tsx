import React from 'react'

export default function GameInfoContent() {
    return (
        <div className='space-y-3 text-sm'>
            <p>Flip two cards per turn. Matching pairs stay open; misses hide again. Clear every pair to win.</p>

            <h3 className='font-semibold'>Game types</h3>
            <ul className='list-disc pl-5 space-y-1'>
                <li><strong>Color</strong> — match identical swatches.</li>
                <li><strong>Number</strong> — match identical numbers.</li>
                <li><strong>Number Sequence</strong> — no pairs: reveal the numbers in order, 1, 2, 3… The header shows which number comes next.</li>
                <li><strong>Emoji</strong> — match identical emojis.</li>
            </ul>

            <h3 className='font-semibold'>Complexity</h3>
            <ul className='list-disc pl-5 space-y-1'>
                <li><strong>Easy</strong> — 8 pairs (16 cards).</li>
                <li><strong>Medium</strong> — 16 pairs (32 cards).</li>
                <li><strong>Hard</strong> — 24 pairs (48 cards).</li>
                <li><strong>Extreme</strong> — 24 pairs, and any mismatch wipes your found pairs.</li>
            </ul>

            <h3 className='font-semibold'>Modes</h3>
            <ul className='list-disc pl-5 space-y-1'>
                <li><strong>Classic</strong> — straightforward round.</li>
                <li><strong>Daily Challenge</strong> — a seeded board, the same for everyone on that date. Share the link to race friends.</li>
                <li><strong>Time Attack</strong> — 60 seconds, clear as much as you can.</li>
                <li><strong>Duel</strong> — hot-seat for two: a match keeps your turn, a miss passes it.</li>
                <li><strong>Best of 3</strong> — a duel across three rounds; first to two round wins takes the series.</li>
                <li><strong>Zen</strong> — no timer, no score; practice at your own pace.</li>
                <li><strong>Custom board</strong> — pick any pair count (4–40) and column layout.</li>
            </ul>

            <h3 className='font-semibold'>Extras</h3>
            <ul className='list-disc pl-5 space-y-1'>
                <li><strong>Wildcards</strong> (optional) — two ★ jokers that match anything; a joker match also clears its partner&apos;s twin.</li>
                <li><strong>Trap card</strong> — Hard and Extreme boards hide one ☠️: flipping it costs 2 moves and breaks your streak.</li>
                <li><strong>Extreme shift</strong> — in Extreme, after every 5 matches the remaining cards quietly swap positions.</li>
                <li><strong>Theme packs</strong> — pick emoji packs (Faces, Animals, Food, Space) and color palettes (Vibrant, Pastel, Neon).</li>
                <li><strong>Haptics</strong> — subtle vibration on flips and matches (supported devices).</li>
                <li><strong>Idle pause</strong> — 30 seconds without input auto-pauses the round.</li>
            </ul>

            <h3 className='font-semibold'>Tools</h3>
            <ul className='list-disc pl-5 space-y-1'>
                <li><strong>Lives</strong> (optional) — three lives; each mismatch costs one. Run out and the round is lost.</li>
                <li><strong>Peek</strong> — once per round, reveal the whole board for 3 seconds. Costs 2 moves. (Disabled in Number Sequence — it would spoil the order.)</li>
                <li><strong>Pause</strong> — hides the board and freezes the timer.</li>
                <li><strong>Sound</strong> — toggle in the top-left of the round header.</li>
                <li><strong>Haptics</strong> — subtle vibration on flips and matches (supported devices).</li>
                <li><strong>Idle pause</strong> — 30 seconds without input auto-pauses the round.</li>            </ul>

            <h3 className='font-semibold'>Controls</h3>
            <p>Play entirely by keyboard: Tab to reach the grid, arrow keys to move between cards, Enter/Space to flip.</p>

            <p>Progress is saved locally: best times and fewest moves per type and complexity, plus achievements — check them in the stats section below.</p>
        </div>
    )
}
