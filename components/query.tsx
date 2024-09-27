import { cn } from "@/lib/utils";
import { Loader } from "lucide-react";

const Loading = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "py-24 mx-auto flex items-center flex-col space-y-4",
        className,
      )}
    >
      <Loader className="shrink-0 animate-spin size-5" />
      <div className="text-muted-foreground text-sm">
        Please wait while loading..
      </div>
    </div>
  );
};

const Error = ({ error, className }: { error: string; className?: string }) => {
  return (
    <div
      className={cn(
        "py-24 mx-auto flex items-center flex-col space-y-2",
        className,
      )}
    >
      <div className="text-red-500 text-sm">{error}</div>
    </div>
  );
};

const Query = {
  Loading,
  Error,
};

export default Query;
