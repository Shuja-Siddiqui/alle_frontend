"use client";

import { ReactNode, useMemo } from "react";
import { BACKGROUNDS } from "../app/backgrounds";
import type { Role, PageKey } from "../app/types/roles";

type RolePageLayoutProps = {
  role: Role;
  page: PageKey;
  children: ReactNode;
  className?: string;
};

export function RolePageLayout({
  role,
  page,
  children,
  className,
}: RolePageLayoutProps) {
  const bg = BACKGROUNDS[role]?.[page];

  const style = useMemo(
    () => ({
      background: bg?.background,
      backgroundImage: bg?.backgroundImage,
      backgroundSize: "cover",
      backgroundPosition: "-10% 0%",
      minHeight: "100vh",
      width: "100%",
    }),
    [bg],
  );

  return (
    <div style={style} className={className}>
      {children}
    </div>
  );
}






















