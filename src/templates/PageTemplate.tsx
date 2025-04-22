import React, { ReactNode } from "react";

interface Props {
  children?: ReactNode;
}

const PageTemplate: React.FC<Props> = ({ children }) => {
  return (
    <div className="relative w-full h-screen overflow-auto font-serif bg-slate-300">
      {children}
    </div>
  );
};

export default PageTemplate;
