import React from "react";

interface NodeBodyProps {
  children: React.ReactNode;
}

// Parent component that accepts children
const NodeBody: React.FC<NodeBodyProps> = ({ children }) => {
  return (
    <div className="mx-2 my-4">
      <div>{children}</div>
    </div>
  );
};

export default NodeBody;
