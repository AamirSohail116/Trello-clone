"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

import { useMobileSidebar } from "@/hooks/use-mobile-sidebar";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import Sidebar from "./sidebar";

const MobileSidebar = () => {
  const pathname = usePathname();

  const { isOpen, onClose, onOpen } = useMobileSidebar((state) => state);

  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  return (
    <>
      <Button
        className=" block md:hidden mr-2"
        onClick={onOpen}
        variant={"ghost"}
        size={"sm"}
      >
        <Menu className=" size-4" />
      </Button>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="left" className=" p-2 pt-10">
          <Sidebar storageKey="t-sidebar-mobile-state" />
        </SheetContent>
      </Sheet>
    </>
  );
};

export default MobileSidebar;
