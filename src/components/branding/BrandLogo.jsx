import { siteConfig } from "../../data/siteConfig";

const sizeMap = {
  xs: "w-[110px] sm:w-[132px]",
  sm: "w-[136px] sm:w-[162px]",
  md: "w-[172px] sm:w-[214px]",
  panel: "w-full max-w-[18rem] sm:max-w-[20rem]",
};

export default function BrandLogo({
  size = "md",
  variant = "light",
  className = "",
  priority = false,
}) {
  const resolvedSize = sizeMap[size] ?? sizeMap.md;

  return (
    <img
      src={variant === "dark" ? siteConfig.logo.darkSrc : siteConfig.logo.src}
      alt={siteConfig.name}
      width={siteConfig.logo.width}
      height={siteConfig.logo.height}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={priority ? "high" : "auto"}
      className={`${resolvedSize} ${className}`.trim()}
    />
  );
}
