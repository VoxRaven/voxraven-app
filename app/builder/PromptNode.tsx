import React, { memo, useEffect, useState } from "react";
import {
  Handle,
  Position,
  useNodeConnections,
  useReactFlow,
} from "@xyflow/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { v4 as uuidv4 } from "uuid";
import CustomHandle from "./CustomHandle";

import { ChatOpenAI } from "@langchain/openai";
import { AIMessage } from "@langchain/core/messages";

interface TestNodeProps {
  id: string;
  data: any;
  isConnectable: boolean;
}

const NodeHeader = () => {
  return (
    <div className="border-b border-black flex items-center h-14">
      <div className="ml-2">
        <Avatar className="m-2 w-7 h-7">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
      <div className="mr-4 font-bold text-md">Prompt output</div>
    </div>
  );
};

interface NodeBodyProps {
  id: string;
  data: any;
  inputHandles: string[];
  outputHandles: string[];
}

const NodeBody = ({ id, data, inputHandles, outputHandles }: NodeBodyProps) => {
  const [modelOutput, setModelOutput] = useState<any>();

  useEffect(() => {
    console.log(data);
    setModelOutput(data.content);
  }, [data]);

  return (
    <div className="flex flex-col gap-2 py-2 px-2 text-xs">
      {inputHandles.map((item, index) => (
        <div key={index} className="">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>{item}</TooltipTrigger>
              <TooltipContent>
                <p>Handle Type</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      ))}

      <div className="flex flex-col gap-2 mt-2">
        <div className="flex items-center">
          <div className="text-sm">{modelOutput}</div>
        </div>
      </div>

      <div className="mt-2 gap-2 flex flex-col">
        {outputHandles.map((item, index) => (
          <div key={index} className="text-end">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>{item}</TooltipTrigger>
                <TooltipContent>
                  <p>Prompt Test</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        ))}
      </div>
    </div>
  );
};

export default memo(({ id, data, isConnectable }: TestNodeProps) => {
  const handleStyle = { top: 10 };
  const inputHandles: string[] = ["LLM"];
  const outputHandles: string[] = [];
  const [componentUuid, setComponentUuid] = React.useState<string>("");

  React.useEffect(() => {
    setComponentUuid(uuidv4());
  }, []);

  return (
    <div className="border border-black rounded-lg bg-white max-w-64">
      {/* Header */}
      <NodeHeader />

      <NodeBody
        id={id}
        data={data}
        inputHandles={inputHandles}
        outputHandles={outputHandles}
      />

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
            top: 147 + 24 * (inputHandles.length + index),
          }}
          id={componentUuid + index}
          key={index}
        />
      ))}
    </div>
  );
});
