"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";

interface AuthorsModalProps {
  authors: string[];
}

export function AuthorsModal({ authors }: AuthorsModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (authors.length <= 1) return null;

  const additionalAuthorsCount = authors.length - 1;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="ml-2 h-6 px-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors font-medium">
          <Users className="w-3 h-3 mr-1" />+{additionalAuthorsCount} lainnya
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md bg-white border border-red-200 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold bg-gradient-to-r from-red-600 to-yellow-500 bg-clip-text text-transparent">
            Semua Penulis
          </DialogTitle>
          <DialogDescription className="text-slate-600 font-medium">
            Daftar lengkap penulis prototype ini
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 mt-4">
          <div className="flex flex-wrap gap-2">
            {authors.map((author, index) => (
              <Badge
                key={index}
                variant="outline"
                className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 border-yellow-300 text-white font-medium hover:from-yellow-500 hover:to-orange-500 transition-colors shadow-sm">
                {author}
              </Badge>
            ))}
          </div>
          <div className="text-sm text-slate-600 mt-3 p-3 bg-gradient-to-r from-red-50 to-yellow-50 rounded-md border border-red-200 font-medium">
            <span className="text-red-600 font-semibold">Total:</span>{" "}
            {authors.length} penulis
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
