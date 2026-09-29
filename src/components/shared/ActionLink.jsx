import Button from "../ui/Button";

const variantAlias = {
  dark: "laser",
  soft: "ghost",
  whatsapp: "laser",
  hazard: "hazard",
  laser: "laser",
  accent: "accent",
  ghost: "ghost",
};

export default function ActionLink({ variant = "soft", ...props }) {
  return <Button variant={variantAlias[variant] ?? "ghost"} {...props} />;
}
