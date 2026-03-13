import { Brain, Loader2 } from "lucide-react";
import { useModels } from "@/hooks/useModels";

export default function ModelStatus() {
  const { loaded, loading, error } = useModels();

  if (error) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-destructive/10 border border-destructive/30 text-destructive text-xs font-mono-tech">
        <Brain className="w-3 h-3" /> AI ERROR
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-warning/10 border border-warning/30 text-warning text-xs font-mono-tech">
        <Loader2 className="w-3 h-3 animate-spin" /> LOADING AI MODELS...
      </div>
    );
  }

  if (loaded) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-success/10 border border-accent/30 text-accent text-xs font-mono-tech">
        <Brain className="w-3 h-3" /> AI READY
      </div>
    );
  }

  return null;
}
