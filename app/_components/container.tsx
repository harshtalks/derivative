import React, { ReactNode } from "react";

const Container = ({ children }: { children: ReactNode }) => {
  return (
    <div className="max-w-6xl mx-auto px-6 md:px-12 xl:px-6">{children}</div>
  );
};

export default Container;
