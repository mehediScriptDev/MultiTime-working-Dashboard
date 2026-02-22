import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CheckCircle2, AlertCircle, Info, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

const iconMap = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

const colorMap = {
  success: {
    // Use app primary color so alerts match website buttons
    icon: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/20",
    button: "bg-primary text-primary-foreground hover:bg-primary/90",
  },
  error: {
    icon: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    button: "bg-red-600 hover:bg-red-700 text-white",
  },
  warning: {
    icon: "text-amber-400",
    bg: "bg-amber-500",
    border: "border-amber-500/20",
    button: "bg-amber-600 hover:bg-amber-700 text-white",
  },
  info: {
    icon: "text-blue-400",
    bg: "bg-blue-500",
    border: "border-blue-500/20",
    button: "bg-blue-600 hover:bg-blue-700 text-white",
  },
};

export function SweetAlert({
  open,
  onClose,
  type = "info",
  title,
  description,
  confirmText = "OK",
  autoClose = false,
  autoCloseDelay = 3000,
}) {
  const Icon = iconMap[type];
  const colors = colorMap[type];

  useEffect(() => {
    if (open && autoClose) {
      const timer = setTimeout(() => {
        onClose?.();
      }, autoCloseDelay);
      return () => clearTimeout(timer);
    }
  }, [open, autoClose, autoCloseDelay, onClose]);

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 max-w-md">
        <AlertDialogHeader>
          <div className="flex flex-col items-center gap-4 mb-2">
              <div className="flex items-center justify-center mb-1">
                <Icon className={cn("w-12 h-12", colors.icon)} />
              </div>
            <AlertDialogTitle className="text-xl text-center text-gray-900 dark:text-slate-100">
              {title}
            </AlertDialogTitle>
          </div>
          {description && (
            <AlertDialogDescription className="text-center text-gray-600 dark:text-slate-400 text-base">
              {description}
            </AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter className="sm:justify-center">
          <AlertDialogAction
            onClick={onClose}
            className={cn(
              buttonVariants(),
              "px-8 rounded-xl",
              colors.button
            )}
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// Hook for easier usage
export function useSweetAlert() {
  const [alert, setAlert] = useState(null);

  const showAlert = ({ type = "info", title, description, confirmText, autoClose = true }) => {
    setAlert({ type, title, description, confirmText, autoClose });
  };

  const closeAlert = () => {
    setAlert(null);
  };

  const AlertComponent = alert ? (
    <SweetAlert
      open={!!alert}
      onClose={closeAlert}
      type={alert.type}
      title={alert.title}
      description={alert.description}
      confirmText={alert.confirmText}
      autoClose={alert.autoClose}
    />
  ) : null;

  return { showAlert, AlertComponent };
}
