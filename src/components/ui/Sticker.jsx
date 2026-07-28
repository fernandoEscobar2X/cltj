const variantMap = {
  paper: "sticker",
  laser: "sticker sticker--laser",
  hazard: "sticker sticker--hazard",
  ghost: "sticker sticker--ghost",
  "ghost-invert": "sticker sticker--ghost-invert",
};

export default function Sticker({
  variant = "paper",
  className = "",
  icon: Icon,
  children,
}) {
  const base = variantMap[variant] ?? variantMap.paper;
  return (
    <span className={`${base} ${className}`.trim()}>
      {Icon ? <Icon size={12} strokeWidth={2.25} /> : null}
      {children}
    </span>
  );
}
