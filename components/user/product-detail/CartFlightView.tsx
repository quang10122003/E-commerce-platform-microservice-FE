import type { RefObject } from "react";
import { PackageIcon } from "@phosphor-icons/react/dist/csr/Package";

// Gói hàng trang trí nằm ngoài bố cục, không nhận focus hay sự kiện chuột.
export function CartFlightView({ flightRef }: { flightRef: RefObject<HTMLDivElement | null> }) {
  return (
    <div
      ref={flightRef}
      popover="manual"
      aria-hidden="true"
      className="pointer-events-none invisible fixed inset-auto left-0 top-0 z-[10000] m-0 flex h-14 w-14 items-center justify-center overflow-visible border-0 bg-transparent p-0 text-muted-foreground"
    >
      <PackageIcon className="h-full w-full" weight="duotone" aria-hidden="true" />
    </div>
  );
}
