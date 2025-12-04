import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

interface ChatHeaderProps {
  sessionId: string | null;
  onMenuClick: () => void;
}

export function ChatHeader({ sessionId, onMenuClick }: ChatHeaderProps) {
  return (
    <header className="flex items-center gap-4 p-4 border-b border-slate-700">
      <Button
        variant="ghost"
        size="icon"
        className="h-10 w-10 text-slate-400 hover:text-slate-100 hover:bg-slate-800"
        onClick={onMenuClick}
      >
        <Menu className="h-6 w-6" />
      </Button>

      <div className="flex items-center gap-4 flex-1">
        <picture>
          <source
            media="(prefers-color-scheme: light)"
            srcSet="https://raw.githubusercontent.com/opencloudhub/.github/main/assets/brand/assets/logos/primary-logo-light.svg"
          />
          <img
            alt="OpenCloudHub"
            src="https://raw.githubusercontent.com/opencloudhub/.github/main/assets/brand/assets/logos/primary-logo-dark.svg"
            className="h-12"
          />
        </picture>
        <Separator orientation="vertical" className="h-8 bg-slate-700" />
        <span className="text-lg text-slate-300 font-medium">Assistant</span>
      </div>

      {sessionId && (
        <p className="text-xs text-slate-500">
          Session: {sessionId.slice(0, 8)}
        </p>
      )}
    </header>
  );
}
