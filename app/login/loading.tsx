import { Loader2 } from "lucide-react"

export default function LoginLoading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#dfe1e7]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2563EB]" />
    </div>
  )
}
