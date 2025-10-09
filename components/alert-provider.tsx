"use client"

import { AlertDialogCustom } from "@/components/ui/alert-dialog-custom"
import { useAlert } from "@/hooks/use-alert"

export function AlertProvider() {
  const alert = useAlert()

  return (
    <AlertDialogCustom
      open={alert.isOpen}
      onOpenChange={alert.closeAlert}
      title={alert.title}
      description={alert.description}
      type={alert.type}
      confirmText={alert.confirmText}
      cancelText={alert.cancelText}
      showCancel={alert.showCancel}
      onConfirm={alert.onConfirm}
      onCancel={alert.onCancel}
    />
  )
}
