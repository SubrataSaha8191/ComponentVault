"use client"

import { create } from 'zustand'

interface AlertState {
  isOpen: boolean
  title: string
  description: string
  type: "info" | "success" | "warning" | "error" | "delete" | "logout"
  confirmText: string
  cancelText: string
  showCancel: boolean
  onConfirm?: () => void
  onCancel?: () => void
}

interface AlertStore extends AlertState {
  openAlert: (config: Partial<AlertState>) => void
  closeAlert: () => void
}

const useAlertStore = create<AlertStore>((set: any) => ({
  isOpen: false,
  title: '',
  description: '',
  type: 'info',
  confirmText: 'OK',
  cancelText: 'Cancel',
  showCancel: false,
  onConfirm: undefined,
  onCancel: undefined,
  openAlert: (config: Partial<AlertState>) => set({ 
    isOpen: true, 
    ...config,
    confirmText: config.confirmText || 'OK',
    cancelText: config.cancelText || 'Cancel',
    showCancel: config.showCancel ?? false,
  }),
  closeAlert: () => set({ 
    isOpen: false,
    onConfirm: undefined,
    onCancel: undefined,
  }),
}))

export function useAlert() {
  const store = useAlertStore()

  return {
    showInfo: (title: string, description: string, onConfirm?: () => void) => {
      store.openAlert({
        title,
        description,
        type: 'info',
        confirmText: 'OK',
        showCancel: false,
        onConfirm,
      })
    },
    showSuccess: (title: string, description: string, onConfirm?: () => void) => {
      store.openAlert({
        title,
        description,
        type: 'success',
        confirmText: 'OK',
        showCancel: false,
        onConfirm,
      })
    },
    showWarning: (title: string, description: string, onConfirm?: () => void) => {
      store.openAlert({
        title,
        description,
        type: 'warning',
        confirmText: 'OK',
        showCancel: false,
        onConfirm,
      })
    },
    showError: (title: string, description: string, onConfirm?: () => void) => {
      store.openAlert({
        title,
        description,
        type: 'error',
        confirmText: 'OK',
        showCancel: false,
        onConfirm,
      })
    },
    showConfirm: (
      title: string, 
      description: string, 
      onConfirm?: () => void,
      onCancel?: () => void,
      type: "info" | "warning" | "delete" | "logout" = "warning"
    ) => {
      store.openAlert({
        title,
        description,
        type,
        confirmText: type === 'delete' ? 'Delete' : type === 'logout' ? 'Logout' : 'Confirm',
        cancelText: 'Cancel',
        showCancel: true,
        onConfirm,
        onCancel,
      })
    },
    ...store,
  }
}
