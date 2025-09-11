"use client";

import { cn } from "@/lib/utils";
import { useStore } from "@/lib/hooks/useStore";
import { Sidebar } from "@/components/custom/admin-panel/sidebar";
import { useSidebarToggle } from "@/lib/hooks/useSidebarToggle";

export default function AdminPanelLayout({
  children,
  userDetails,
  freshCount,
  stockCount
}: {
  children: React.ReactNode;
  userDetails: any;
  freshCount:any;
  stockCount:any;
}) {
  const sidebar = useStore(useSidebarToggle, (state) => state);

  if (!sidebar) return null;

  return (
    <>
      <Sidebar userDetails={userDetails} freshCount={freshCount} stockCount={stockCount} />
      <main
        className={cn(
          "min-h-dvh bg-background transition-[margin-left] duration-300 ease-in-out",
          sidebar?.isOpen === false ? "lg:ml-[90px]" : "lg:ml-72",
        )}
      >
        {children}
      </main>
    </>
  );
}
