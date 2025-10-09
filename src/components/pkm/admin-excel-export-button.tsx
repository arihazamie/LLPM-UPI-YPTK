"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet } from "lucide-react";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface AdminExcelExportButtonProps {
  disabled?: boolean;
  className?: string;
}

export function AdminExcelExportButton({
  disabled = false,
  className = "",
}: AdminExcelExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    try {
      setIsExporting(true);

      // Show loading toast
      const loadingToast = toast.loading("Menyiapkan file Excel...", {
        description: "Mengumpulkan semua data PKM, publikasi, HKI, dan buku...",
      });

      const response = await fetch("/api/admin/export/pkm-excel", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal mengekspor data");
      }

      // Get filename from response headers
      const contentDisposition = response.headers.get("content-disposition");
      const filenameMatch = contentDisposition?.match(/filename="(.+)"/);
      const filename = filenameMatch ? filenameMatch[1] : "PKM_Data_Admin.xlsx";

      // Create blob and download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      // Dismiss loading toast and show success
      toast.dismiss(loadingToast);
      toast.success("Berhasil mengekspor data!", {
        description: `File ${filename} telah diunduh`,
      });
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Gagal mengekspor data", {
        description:
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan saat mengekspor",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const buttonContent = (
    <Button
      onClick={handleExport}
      disabled={disabled || isExporting}
      className={`bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2.5 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 border-0 ${className}`}>
      {isExporting ? (
        <>
          <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
          Mengekspor...
        </>
      ) : (
        <>
          <FileSpreadsheet className="w-4 h-4 mr-2" />
          Export Excel
        </>
      )}
    </Button>
  );

  if (disabled) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="inline-block">{buttonContent}</div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Tidak ada data untuk diekspor</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{buttonContent}</TooltipTrigger>
        <TooltipContent>
          <p>
            Ekspor semua data PKM ke file Excel dengan multiple sheets (Admin)
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
