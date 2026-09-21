import { Link } from "react-router-dom";

const variantMap = {
  laser: "cut-btn cut-btn--laser",
  accent: "cut-btn cut-btn--accent",
  ghost: "cut-btn cut-btn--ghost",
  hazard: "cut-btn cut-btn--accent",
};

const sizeMap = {
  sm: "cut-btn--sm",
  md: "",
  lg: "cut-btn--lg",
};

function buildClassName(variant, size, className) {
  return [variantMap[variant] ?? variantMap.accent, sizeMap[size] ?? "", className]
    .filter(Boolean)
    .join(" ");
}

export default function Button({
  to,
  href,
  variant = "accent",
  size = "md",
  className = "",
  children,
  type,
  ...props
}) {
  const resolved = buildClassName(variant, size, className);

  if (to) {
    return (
      <Link className={resolved} to={to} {...props}>
        {children}
      </Link>
    );
  }

  if (href) {
    const isExternal = /^https?:\/\//i.test(href);
    return (
      <a
        className={resolved}
        href={href}
        target={isExternal ? "_blank" : props.target}
        rel={isExternal ? "noopener noreferrer" : props.rel}
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <button type={type ?? "button"} className={resolved} {...props}>
      {children}
    </button>
  );
}
