"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet } from "lucide-react";
import { toast } from "sonner";

interface PengabdianExcelExportButtonProps {
  disabled?: boolean;
}

export function PengabdianExcelExportButton({ disabled }: PengabdianExcelExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      const response = await fetch("/api/dosen/export/pengabdian-excel", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `pengabdian-upi-yptk-${new Date().toISOString().split('T')[0]}.xlsx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        toast.success("Data pengabdian berhasil diekspor ke Excel");
      } else {
        const error = await response.json();
        toast.error(error.message || "Gagal mengekspor data pengabdian");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat mengekspor data", {
        description: error instanceof Error ? error.message : undefined,
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleExport}
      disabled={disabled || isExporting}
      className="flex items-center gap-2"
    >
      <FileSpreadsheet className="h-4 w-4" />
      {isExporting ? "Mengekspor..." : "Export Excel"}
    </Button>
  );
}
