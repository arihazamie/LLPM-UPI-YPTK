import { ExternalLink, FileText } from "lucide-react";

interface ExternalLinkButtonProps {
  href: string;
  label: string;
  variant?: "proposal" | "laporan" | "default";
  className?: string;
}

export function ExternalLinkButton({
  href,
  label,
  variant = "default",
  className = "",
}: ExternalLinkButtonProps) {
  const isValidUrl =
    href && (href.startsWith("http://") || href.startsWith("https://"));

  if (!href) {
    return <span className="text-slate-400 text-sm">Tidak ada link</span>;
  }

  if (!isValidUrl) {
    return <span className="text-slate-400 text-sm">Link tidak valid</span>;
  }

  const getVariantStyles = () => {
    switch (variant) {
      case "proposal":
        return "bg-gradient-to-r from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 text-red-700 hover:text-red-800 border-red-200 hover:border-red-300";
      case "laporan":
        return "bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 text-blue-700 hover:text-blue-800 border-blue-200 hover:border-blue-300";
      default:
        return "bg-gradient-to-r from-slate-50 to-slate-100 hover:from-slate-100 hover:to-slate-200 text-slate-700 hover:text-slate-800 border-slate-200 hover:border-slate-300";
    }
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center space-x-2 px-3 py-1.5 font-medium rounded-lg border transition-all duration-200 shadow-sm hover:shadow-md ${getVariantStyles()} ${className}`}>
      <FileText className="w-4 h-4" />
      <span>{label}</span>
      <ExternalLink className="w-3 h-3" />
    </a>
  );
}
