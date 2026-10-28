import { Check } from "lucide-react";
import { useStore } from "../store";

export function Toast() {
  const { toast } = useStore();
  if (!toast) return null;
  return (
    <div className="toast" role="status" aria-live="polite">
      <span className="toast__icon">
        <Check size={15} strokeWidth={2.5} />
      </span>
      {toast}
    </div>
  );
}
