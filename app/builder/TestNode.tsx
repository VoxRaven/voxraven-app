import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TestNodeProps {
  data: any;
  isConnectable: boolean;
}

export default memo(({ data, isConnectable }: TestNodeProps) => {
  const handleStyle = { top: 10 };

  return (
    <div className="border border-black rounded-sm bg-white">
      {/* Header */}
      <div className="border-b border-black flex items-center h-14">
        <div className="ml-2">
          <Avatar className="m-2 w-7 h-7">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
        <div className="mr-4 font-bold text-md">Custom AI Component</div>
      </div>

      <div className="flex flex-col gap-2 py-2 px-2 text-xs">
        <div className="">First field</div>
        <div className="">Second field</div>

        <div className="flex flex-col gap-2 mt-2">
          <div className="font-bold">Credentials</div>
          <Select>
            <SelectTrigger className="w-full h-[25px]">
              <SelectValue placeholder="Please select" className="text-sm" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2 mt-2">
          <div className="font-bold">Credentials</div>
          <Input className="w-full h-[25px]" type="email" placeholder="Email" />
        </div>

        <div className="text-end mt-2">First output</div>
        <div className="text-end">Second output</div>
      </div>

      {/* Handles */}
      <Handle
        type="target"
        style={{
          borderWidth: "1px",
          borderColor: "#888888",
          padding: "3px",
          background: "#FFF",
          top: 72,
          left: 0,
        }}
        id={"a"}
        position={Position.Left}
      />

      <Handle
        type="target"
        style={{
          borderWidth: "1px",
          borderColor: "#888888",
          padding: "3px",
          background: "#FFF",
          top: 72 + 25,
          left: 0,
        }}
        id={"b"}
        position={Position.Left}
      />

      <Handle
        type="source"
        position={Position.Right}
        style={{
          borderWidth: "1px",
          borderColor: "#888888",
          padding: "3px",
          background: "#FFF",
          top: 260,
        }}
      />

      <Handle
        type="source"
        position={Position.Right}
        style={{
          borderWidth: "1px",
          borderColor: "#888888",
          padding: "3px",
          background: "#FFF",
          top: 260 + 24,
        }}
      />
    </div>
  );
});
