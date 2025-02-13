import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Handle,
  HandleType,
  Position,
  useNodeConnections,
} from "@xyflow/react";

interface NodeHandlesProps {
  handles: Array<CustomHandleProps>;
}

interface CustomHandleProps {
  label: string;
  id: string;
  position: Position;
  type: string;
  maxConnections?: number;
}

const CustomHandle = ({
  label,
  type,
  id,
  position,
  maxConnections = 1,
}: CustomHandleProps) => {
  const connections = useNodeConnections({
    handleType: type as HandleType,
    handleId: id,
  });

  return (
    <div
      className={`relative ${position === Position.Right ? "text-end" : ""}`}
    >
      <span className="mx-2 text-xs italic">{label}</span>
      <Handle
        type={type as HandleType}
        position={position}
        style={{
          borderWidth: "1px",
          borderColor: "#888888",
          padding: "3px",
          background: "#FFF",
          top: 13,
        }}
        id={id}
        isConnectable={connections.length < maxConnections}
      />
    </div>
  );
};

const NodeHandles = ({ handles }: NodeHandlesProps) => {
  return (
    <div className="flex flex-col">
      {handles.map((item, index) => (
        <CustomHandle
          type={item.type}
          position={item.position}
          id={item.id}
          label={item.label}
          key={index}
        />
      ))}
    </div>
  );
};

export default NodeHandles;
