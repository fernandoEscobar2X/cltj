import { siteConfig } from "../../data/siteConfig";

const sizeMap = {
  xs: "w-[110px] sm:w-[132px]",
  // Header: altura fija para que el header mida 68px y lo sticky cuadre.
  sm: "h-[48px] w-auto sm:h-[52px]",
  md: "w-[172px] sm:w-[214px]",
  panel: "w-full max-w-[18rem]",
};

export default function BrandLogo({
  size = "md",
  className = "",
  priority = false,
  tone = "light",
}) {
  const resolvedSize = sizeMap[size] ?? sizeMap.md;
  const src = tone === "dark" ? siteConfig.logo.dark : siteConfig.logo.src;

  return (
    <img
      src={src}
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
