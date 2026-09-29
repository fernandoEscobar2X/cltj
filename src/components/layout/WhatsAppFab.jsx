import { WhatsappLogo } from "@phosphor-icons/react";
import { siteConfig } from "../../data/siteConfig";

export default function WhatsAppFab() {
  return (
    <a
      className="fixed bottom-[calc(1.25rem+env(safe-area-inset-bottom))] right-4 z-50 grid h-14 w-14 place-items-center rounded-full bg-[#25d366] text-white shadow-[0_12px_30px_rgba(0,0,0,0.25)] transition hover:bg-[#1fb455] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--laser)] lg:hidden"
      href={siteConfig.whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Cotizar por WhatsApp al ${siteConfig.phoneDisplay}`}
    >
      <WhatsappLogo size={28} weight="fill" />
    </a>
  );
}
