type TaskAttemptFractionProps = {
  /** 1-based attempt index (same as previous “Attempt n of …”). */
  attemptCurrent: number;
  attemptLimit: number;
};

/** Compact `n/m` retry label: numerator white, slash + denominator pink. */
export function TaskAttemptFraction({
  attemptCurrent,
  attemptLimit,
}: TaskAttemptFractionProps) {
  return (
    <p
      style={{
        marginTop: "16px",
        fontSize: "12px",
        fontWeight: 600,
        lineHeight: 1.2,
        letterSpacing: "0.03em",
      }}
    >
      <span style={{ color: "#FFFFFF" }}>{attemptCurrent}</span>
      <span style={{ color: "#F529F9" }}>/{attemptLimit}</span>
    </p>
  );
}
