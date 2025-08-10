import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, XCircle } from "lucide-react"

interface AuthMessageProps {
  type: "success" | "error"
  message: string
}

export function AuthMessage({ type, message }: AuthMessageProps) {
  const isSuccess = type === "success"
  const Icon = isSuccess ? CheckCircle : XCircle
  const title = isSuccess ? "Berhasil!" : "Gagal!"
  const alertClass = isSuccess
    ? "border-green-500 text-green-700 bg-green-50/50"
    : "border-red-500 text-red-700 bg-red-50/50"
  const iconClass = isSuccess ? "text-green-600" : "text-red-600"

  return (
    <Alert className={`flex items-center space-x-3 ${alertClass}`}>
      <Icon className={`h-5 w-5 shrink-0 ${iconClass}`} />
      <div>
        <AlertTitle className="font-semibold">{title}</AlertTitle>
        <AlertDescription className="text-sm">{message}</AlertDescription>
      </div>
    </Alert>
  )
}
