"use client";

import { Dialog } from "@base-ui/react/dialog";
import { X } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export const DialogRoot = Dialog.Root;
export const DialogTrigger = Dialog.Trigger;
export const DialogClose = Dialog.Close;

export function DialogContent({ title, description, children, className }: { title: string; description?: string; children: ReactNode; className?: string }) {
  return <Dialog.Portal><Dialog.Backdrop className="fixed inset-0 z-50 bg-black/60 transition-opacity data-ending-style:opacity-0 data-starting-style:opacity-0 motion-reduce:transition-none" /><Dialog.Viewport className="fixed inset-0 z-[60] grid place-items-center overflow-y-auto p-4"><Dialog.Popup className={cn("relative w-full max-w-lg rounded-xl border border-[var(--border)] bg-[#f7f2ef] p-6 text-[var(--ink)] shadow-[0_24px_80px_rgba(0,0,0,.28)] outline-none transition data-ending-style:scale-[.98] data-ending-style:opacity-0 data-starting-style:scale-[.98] data-starting-style:opacity-0 motion-reduce:transition-none", className)}><Dialog.Title className="pr-10 font-display text-3xl leading-none">{title}</Dialog.Title>{description ? <Dialog.Description className="mt-3 text-sm leading-6 text-[var(--muted)]">{description}</Dialog.Description> : null}<Dialog.Close aria-label="Close dialog" className="absolute right-4 top-4 grid size-10 place-items-center rounded-md text-[var(--muted)] hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--red)]"><X aria-hidden="true" size={19} /></Dialog.Close><div className="mt-6">{children}</div></Dialog.Popup></Dialog.Viewport></Dialog.Portal>;
}
