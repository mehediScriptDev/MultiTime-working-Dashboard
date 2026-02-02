import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import GuidePage from "@/pages/guide";
import { useState } from "react";

export function GuideModal({ children }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <div className="max-h-[70vh] overflow-auto">
          <GuidePage />
        </div>
      </DialogContent>
    </Dialog>
  );
}
