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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { v4 as uuidv4 } from "uuid";
import CustomHandle from "./CustomHandle";

interface TestNodeProps {
  data: any;
  isConnectable: boolean;
}

export default memo(({ data, isConnectable }: TestNodeProps) => {
  const handleStyle = { top: 10 };
  const inputHandles = [
    "Item 1",
    "Item 2",
    "Item 3",
    "Item 4",
    "Item 5",
    "Item 6",
  ];
  const outputHandles = ["Item 1", "Item 2", "Item 3", "Item 4"];
  const [componentUuid, setComponentUuid] = React.useState<string>("");

  React.useEffect(() => {
    setComponentUuid(uuidv4());
  }, []);

  return (
    <div className="border border-black rounded-lg bg-white">
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
        {inputHandles.map((item, index) => (
          <div key={index} className="">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>{item}</TooltipTrigger>
                <TooltipContent>
                  <p>Add to library</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        ))}

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

        <div className="mt-2 gap-2 flex flex-col">
          {outputHandles.map((item, index) => (
            <div key={index} className="text-end">
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* Handles */}
      {inputHandles.map((item, index) => (
        <CustomHandle
          type="target"
          position={Position.Left}
          style={{
            borderWidth: "1px",
            borderColor: "#888888",
            background: "#FFF",
            padding: "3px",
            top: 72 + 24 * index,
            left: 0,
          }}
          id={componentUuid + index}
          key={index}
          isConnectable={true}
          connectionCount={1}
        />
      ))}

      {outputHandles.map((item, index) => (
        <Handle
          type="source"
          position={Position.Right}
          style={{
            borderWidth: "1px",
            borderColor: "#888888",
            padding: "3px",
            background: "#FFF",
            top: 211 + 24 * (inputHandles.length + index),
          }}
          id={componentUuid + index}
          key={index}
        />
      ))}
    </div>
  );
});
