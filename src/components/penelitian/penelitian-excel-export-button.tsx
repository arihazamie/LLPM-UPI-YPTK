"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet } from "lucide-react";
import { toast } from "sonner";

interface PenelitianExcelExportButtonProps {
  disabled?: boolean;
}

export function PenelitianExcelExportButton({ disabled }: PenelitianExcelExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      const response = await fetch("/api/dosen/export/penelitian-excel", {
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
        a.download = `penelitian-upi-yptk-${new Date().toISOString().split('T')[0]}.xlsx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        toast.success("Data penelitian berhasil diekspor ke Excel");
      } else {
        const error = await response.json();
        toast.error(error.message || "Gagal mengekspor data penelitian");
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
      onClick={handleExport}
      disabled={disabled || isExporting}
      variant="outline"
      className="border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-800"
    >
      {isExporting ? (
        <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin mr-2" />
      ) : (
        <FileSpreadsheet className="w-4 h-4 mr-2" />
      )}
      {isExporting ? "Mengekspor..." : "Export Excel"}
    </Button>
  );
} 