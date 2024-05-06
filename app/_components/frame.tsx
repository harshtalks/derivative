import React, { ReactNode } from "react";

const Frame = ({ children }: { children: ReactNode }) => {
  return (
    <div className="relative p-2 bg-gray-950/5 backdrop-blur-2xl ring-1 ring-gray-950/10 dark:ring-gray-950/25 rounded-md border border-white/50 dark:bg-white/5 dark:border-white/5">
      <div className="absolute inset-1 flex justify-between">
        <div className="flex flex-col justify-between">
          <div className="size-[3px] rounded-full bg-gray-950/30 dark:bg-white/15"></div>
          <div className="size-[3px] rounded-full bg-gray-950/30 dark:bg-white/15"></div>
        </div>
        <div className="flex flex-col justify-between">
          <div className="size-[3px] rounded-full bg-gray-950/30 dark:bg-white/15"></div>
          <div className="size-[3px] rounded-full bg-gray-950/30 dark:bg-white/15"></div>
        </div>
      </div>
      <div className="relative z-20">{children}</div>
    </div>
  );
};

export default Frame;
