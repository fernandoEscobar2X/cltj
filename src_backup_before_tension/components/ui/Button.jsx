import { Link } from "react-router-dom";

const variantMap = {
  laser: "cut-btn cut-btn--laser",
  ghost: "cut-btn cut-btn--ghost",
  hazard: "cut-btn cut-btn--hazard",
};

const sizeMap = {
  sm: "cut-btn--sm",
  md: "",
  lg: "cut-btn--lg",
};

function buildClassName(variant, size, className) {
  return [variantMap[variant] ?? variantMap.ghost, sizeMap[size] ?? "", className]
    .filter(Boolean)
    .join(" ");
}

export default function Button({
  to,
  href,
  variant = "laser",
  size = "md",
  className = "",
  children,
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

  const isExternal = /^https?:\/\//i.test(href ?? "");

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
