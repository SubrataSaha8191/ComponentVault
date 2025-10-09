"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { AlertTriangle, CheckCircle2, Info, XCircle, Trash2, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"

interface AlertDialogCustomProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  type?: "info" | "success" | "warning" | "error" | "delete" | "logout"
  confirmText?: string
  cancelText?: string
  onConfirm?: () => void
  onCancel?: () => void
  showCancel?: boolean
}

export function AlertDialogCustom({
  open,
  onOpenChange,
  title,
  description,
  type = "info",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  showCancel = true,
}: AlertDialogCustomProps) {
  const iconMap = {
    info: <Info className="h-6 w-6 text-blue-500" />,
    success: <CheckCircle2 className="h-6 w-6 text-green-500" />,
    warning: <AlertTriangle className="h-6 w-6 text-yellow-500" />,
    error: <XCircle className="h-6 w-6 text-red-500" />,
    delete: <Trash2 className="h-6 w-6 text-red-500" />,
    logout: <LogOut className="h-6 w-6 text-orange-500" />,
  }

  const buttonColorMap = {
    info: "bg-blue-600 hover:bg-blue-700",
    success: "bg-green-600 hover:bg-green-700",
    warning: "bg-yellow-600 hover:bg-yellow-700",
    error: "bg-red-600 hover:bg-red-700",
    delete: "bg-red-600 hover:bg-red-700",
    logout: "bg-orange-600 hover:bg-orange-700",
  }

  const handleConfirm = () => {
    onConfirm?.()
    onOpenChange(false)
  }

  const handleCancel = () => {
    onCancel?.()
    onOpenChange(false)
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md border-white/10 bg-gradient-to-br from-gray-900 to-gray-950">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-full bg-white/5 border border-white/10">
              {iconMap[type]}
            </div>
            <AlertDialogTitle className="text-xl text-white">
              {title}
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-gray-400 text-base leading-relaxed">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex gap-2 sm:gap-2">
          {showCancel && (
            <AlertDialogCancel
              onClick={handleCancel}
              className="bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white"
            >
              {cancelText}
            </AlertDialogCancel>
          )}
          <AlertDialogAction
            onClick={handleConfirm}
            className={cn(
              "text-white transition-colors",
              buttonColorMap[type]
            )}
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
