export default function Marquee({
  items,
  separator = "✦",
  speed = "normal",
  reverse = false,
  className = "",
}) {
  const track = [...items, ...items];
  const speedClass = speed === "slow" ? "marquee--slow" : "";
  const directionClass = reverse ? "marquee--reverse" : "";

  return (
    <div
      className={`marquee ${speedClass} ${directionClass} ${className}`.trim()}
      aria-hidden="true"
    >
      <div className="marquee__track">
        {track.map((item, idx) => (
          <span key={idx} className="inline-flex items-center gap-12 whitespace-nowrap">
            <span>{item}</span>
            <span className="text-[var(--laser)]">{separator}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
