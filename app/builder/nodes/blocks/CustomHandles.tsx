import { Handle, HandleType, Position } from "@xyflow/react";
import {Badge} from "@/components/ui/badge";

interface CustomHandleProps {
  label: string;
  type: string;
  id: string;
  postion: Position;
}

export const CustomHandle = ({
  label,
  type,
  id,
  postion,
}: CustomHandleProps) => {
  return (
    <div
      className={`relative my-1 ${
        postion === Position.Right ? "text-end" : ""
      }`}
    >
      <Badge variant="outline" className="mx-2 font-light">{label}</Badge>
      <Handle
        type={type as HandleType}
        position={postion}
        id={id}
        style={{
          borderWidth: "1px",
          borderColor: "#888888",
          padding: "3px",
          background: "#FFF",
          top: 13,
        }}
      />
    </div>
  );
};
