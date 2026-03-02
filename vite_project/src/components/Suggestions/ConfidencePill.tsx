export const ConfidencePill: React.FC<{ value: number }> = ({ value }) => {
    const pct = Math.round(Math.max(0, Math.min(1, value)) * 100)
    return <span className="re-intent-pill">{pct}% match</span>
}