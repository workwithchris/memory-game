// renders the round result as a shareable PNG; falls back to text share / clipboard
export async function shareCard(fields: {
    title: string;
    subtitle: string;
    big: string;
    footer: string;
}) {
    if (typeof window === "undefined") return;

    // draw
    const canvas = document.createElement("canvas");
    canvas.width = 1000;
    canvas.height = 500;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#F59E0B";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(0,0,0,0.06)";
    for (let y = 0; y < canvas.height; y += 24) {
        ctx.fillRect(0, y, canvas.width, 2);
    }
    ctx.fillStyle = "#1F2937";
    ctx.textBaseline = "top";

    ctx.font = "700 44px system-ui, sans-serif";
    ctx.fillText(fields.title.toUpperCase(), 64, 64);

    ctx.font = "500 30px system-ui, sans-serif";
    ctx.fillText(fields.subtitle, 64, 140);

    ctx.font = "700 110px ui-monospace, monospace";
    ctx.fillText(fields.big, 64, 230);

    ctx.font = "500 26px system-ui, sans-serif";
    ctx.fillText(fields.footer, 64, 420);

    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
    const nav = navigator as Navigator & { canShare?: (data: ShareData) => boolean };

    if (blob && nav.share && nav.canShare?.({ files: [new File([blob], "memory-result.png", { type: "image/png" })] })) {
        try {
            await nav.share({ files: [new File([blob], "memory-result.png", { type: "image/png" })], title: "Memory Game" });
            return;
        } catch { /* fall through */ }
    }

    // text share fallback
    const text = `${fields.title} — ${fields.subtitle}: ${fields.big}. ${fields.footer}`;
    if (nav.share) {
        try {
            await nav.share({ title: "Memory Game", text });
            return;
        } catch { /* fall through */ }
    }
    try {
        await navigator.clipboard?.writeText(text);
    } catch { /* last resort: download */ }
    if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "memory-result.png";
        a.click();
        URL.revokeObjectURL(url);
    }
}
