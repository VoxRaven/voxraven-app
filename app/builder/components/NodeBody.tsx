import React from "react";

interface NodeBodyProps {
  children: React.ReactNode;
}

// Parent component that accepts children
const NodeBody: React.FC<NodeBodyProps> = ({ children }) => {
  return (
    <>
       <div className="text-center py-1 bg-slate-100 text-xs">Configuration</div>
      <div className="mx-2 my-4">{children}</div>
    </>
  );
};

export default NodeBody;
