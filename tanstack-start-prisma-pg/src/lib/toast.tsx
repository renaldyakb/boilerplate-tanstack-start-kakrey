import { cn } from "@/lib/utils";
import { AlertCircle, CircleCheckIcon, Info, Loader2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type ToastOptions = {
  type?: "success" | "error" | "info" | "loading";
  description?: string;
  action?: { label: string; onClick: () => void };
  closable?: boolean;
  duration?: number; // default 3s, set to 0 for no auto-dismiss
};

export function showToast(message: string, options: ToastOptions = {}) {
  const {
    type = "info",
    description,
    action,
    closable = true,
    duration = 5000,
  } = options;

  const toastId = String(Date.now());

  // For loading type, always set duration to 0 (no auto-dismiss)
  const finalDuration = type === "loading" ? 0 : duration;

  toast.custom(
    (t) => {
      function ProgressBar() {
        const [progress, setProgress] = useState(100);

        useEffect(() => {
          if (!finalDuration || finalDuration <= 0 || type === "loading")
            return;

          const start = Date.now();
          const tick = setInterval(() => {
            const elapsed = Date.now() - start;
            const percent = Math.max(100 - (elapsed / finalDuration) * 100, 0);
            setProgress(percent);
            if (percent <= 0) {
              clearInterval(tick);
            }
          }, 50); // More smooth animation with 50ms intervals

          return () => clearInterval(tick);
        }, []);

        // Don't show progress bar for loading type or when no duration is set
        if (!finalDuration || finalDuration <= 0 || type === "loading")
          return null;

        return (
          <div className="absolute inset-x-0 bottom-0 h-1 w-full overflow-hidden rounded-b bg-neutral-200/50">
            <div
              className={cn(
                "h-full transition-all duration-75 ease-linear",
                type === "info" && "bg-primary",
                type === "error" && "bg-red-500",
                type === "success" && "bg-green-500",
              )}
              style={{ width: `${progress}%` }}
            />
          </div>
        );
      }

      function getIcon() {
        switch (type) {
          case "success":
            return (
              <CircleCheckIcon
                className="mt-0.5 shrink-0 text-green-600"
                size={18}
                aria-hidden="true"
              />
            );
          case "error":
            return (
              <AlertCircle
                className="mt-0.5 shrink-0 text-red-600"
                size={18}
                aria-hidden="true"
              />
            );
          case "loading":
            return (
              <Loader2
                className="mt-0.5 shrink-0 animate-spin"
                size={18}
                aria-hidden="true"
              />
            );
          case "info":
          default:
            return (
              <Info className="mt-0.5 shrink-0" size={18} aria-hidden="true" />
            );
        }
      }

      function getToastStyles() {
        return cn(
          "relative z-50 max-w-[420px] bg-accent overflow-hidden rounded-lg border shadow-lg",
          type === "success" && "border-green-400/10 ",
          type === "error" && "border-red-400/10 ",
          type === "info" && "border-primary/10",
          type === "loading" && "",
        );
      }

      return (
        <div className={getToastStyles()}>
          <div className="p-3">
            <div
              className={cn(
                description && "items-start",
                !description && "items-center",
                "flex gap-3",
              )}
            >
              {getIcon()}

              <div
                className={cn(
                  description && "flex-1 space-y-1",
                  !description && "flex items-center justify-between gap-7",
                )}
              >
                <p className="text-foreground text-sm font-medium">{message}</p>
                {description && (
                  <p className="text-[0.79rem] opacity-55">{description}</p>
                )}
                {action && (
                  <div className={cn(description && "mt-3 mb-2")}>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        action.onClick();
                        toast.dismiss(t);
                      }}
                      className="rounded-sm text-sm font-medium"
                    >
                      {action.label}
                    </Button>
                  </div>
                )}
              </div>

              {closable && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="group h-6 w-6 shrink-0 p-0 hover:bg-gray-200/50"
                  onClick={() => toast.dismiss(t)}
                  aria-label="Close notification"
                >
                  <X
                    size={14}
                    className="opacity-60 transition-opacity group-hover:opacity-100"
                    aria-hidden="true"
                  />
                </Button>
              )}
            </div>
          </div>

          <ProgressBar />
        </div>
      );
    },
    {
      id: toastId,
      duration: finalDuration === 0 ? Infinity : finalDuration,
      position: "top-right",
    },
  );

  return toastId;
}

// Helper functions for different toast types
export const toastSuccess = (
  message: string,
  options?: Omit<ToastOptions, "type">,
) => {
  return showToast(message, { ...options, type: "success" });
};

export const toastError = (
  message: string,
  options?: Omit<ToastOptions, "type">,
) => {
  return showToast(message, { ...options, type: "error" });
};

export const toastInfo = (
  message: string,
  options?: Omit<ToastOptions, "type">,
) => {
  return showToast(message, { ...options, type: "info" });
};

export const toastLoading = (
  message: string,
  options?: Omit<ToastOptions, "type" | "duration">,
) => {
  return showToast(message, { ...options, type: "loading" });
};

// Function to dismiss a specific toast
export const dismissToast = (toastId: string) => {
  toast.dismiss(toastId);
};

// Function to update a loading toast to success/error
export const updateLoadingToast = (
  toastId: string,
  message: string,
  type: "success" | "error",
  options?: Omit<ToastOptions, "type">,
) => {
  // Dismiss the loading toast
  toast.dismiss(toastId);

  // Show new toast with updated content
  return showToast(message, { ...options, type });
};

// Function to dismiss all toasts
export const dismissAllToasts = () => {
  toast.dismiss();
};

// Compatibility export usually not needed if we refactor, but useful for quick migration if desired.
// However, the requested code has different exports. I will follow user request exactly.
