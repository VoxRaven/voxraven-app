import React, { memo, useCallback, useEffect, useState } from "react";
import { Handle, Position } from "@xyflow/react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { v4 as uuidv4 } from "uuid";
import CustomHandle from "./CustomHandle";

import { BotMessageSquare } from "lucide-react";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Loader2Icon } from "lucide-react";

interface MarkdownProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownProps> = ({ content }) => {
  return (
    <div className="prose max-w-none">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
};

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
          {/* <AvatarImage src="https://github.com/shadcn.png" /> */}
          <BotMessageSquare />
          {/* <AvatarFallback>CN</AvatarFallback> */}
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
  const [isThinking, setIsThinking] = useState<boolean>(false);

  useEffect(() => {
    console.log(data);

    if ("thinking" in data) {
      setIsThinking(data.thinking);
    }

    if ("content" in data) {
      setModelOutput(data.content);
    }
  }, [data]);

  return (
    <div className="flex flex-col gap-2 py-2 px-2 text-xs">
      {inputHandles.map((item, index) => (
        <div key={index} className="">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="font-bold">{item}</TooltipTrigger>
              <TooltipContent>
                <p>Handle Type</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      ))}

      <div className="mt-2">
        {!isThinking ? (
          <div className="text-sm">
            <MarkdownRenderer content={modelOutput} />
          </div>
        ) : (
          <div className="flex justify-center">
            <Loader2Icon className="animate-spin h-8 w-8" />
          </div>
        )}
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
  const inputHandles: string[] = ["LLM Content"];
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
