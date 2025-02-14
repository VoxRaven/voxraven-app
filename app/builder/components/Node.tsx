import React from "react";

interface NodeProps {
  children: React.ReactNode;
}

// Parent component that accepts children
export const Node: React.FC<NodeProps> = ({ children }) => {
  return (
    <div className="border border-black rounded-lg bg-white">
      <div>{children}</div>
    </div>
  );
};

export interface NodeComponentProps {
  id: string;
  data: any;
  isConnectable: boolean;
}
