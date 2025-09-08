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
import { NextResponse } from "next/server";

interface PKMExcelExportButtonProps {
  disabled?: boolean;
  className?: string;
}

export function PKMExcelButton({
  disabled = false,
  className = "bg-black drop-shadow-2xl transition-all duration-200",
}: PKMExcelExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    try {
      setIsExporting(true);

      // Show loading toast
      const loadingToast = toast.loading("Menyiapkan file Excel...", {
        description: "Mengumpulkan data PKM...",
      });

      const response = await fetch("/api/dosen/export/pkm-excel", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        // Cek apakah response adalah JSON atau file
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Gagal mengekspor data");
        } else {
          throw new Error("Gagal mengekspor data");
        }
      }

      // Get filename from response headers
      const contentDisposition = response.headers.get("content-disposition");
      const filenameMatch = contentDisposition?.match(/filename="(.+)"/);
      const filename = filenameMatch ? filenameMatch[1] : "PKM_Data.xlsx";

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
      console.error("Error exporting PKM data:", error);
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Gagal mengekspor data PKM",
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } finally {
      setIsExporting(false);
    }
  };

  const buttonContent = (
    <Button
      onClick={handleExport}
      disabled={disabled || isExporting}
      className={`bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-6 py-2.5 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 border-0 ${className}`}>
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
          <p>Ekspor data PKM ke file Excel</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
