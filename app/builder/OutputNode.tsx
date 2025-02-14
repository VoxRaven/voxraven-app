import React, { memo, useEffect, useState } from "react";
import { Position } from "@xyflow/react";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Loader2Icon } from "lucide-react";
import { Node, NodeComponentProps } from "./components/Node";
import NodeHeader from "./components/NodeHeader";
import NodeBody from "./components/NodeBody";
import NodeHandles from "./components/NodeHandles";

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

export default memo(({ id, data, isConnectable }: NodeComponentProps) => {
  const [modelOutput, setModelOutput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const inputHandles = [
    {
      label: "LLM Output",
      id: "5",
      position: Position.Left,
      type: "target",
      maxConnections: 1,  
    },
  ];

  useEffect(() => {
    setModelOutput(data.content);
  }, [data.content]);

  useEffect(() => {
    setIsThinking(data.thinking);
  }, [data.thinking]);

  return (
    <Node>
      <NodeHeader title="Prompt output" />

      <NodeHandles handles={inputHandles} />

      <NodeBody>
        <div className="mt-2">
          {!isThinking ? (
            <div className="text-sm max-w-64">
              <MarkdownRenderer content={modelOutput} />
            </div>
          ) : (
            <div className="flex justify-center">
              <Loader2Icon className="animate-spin h-8 w-8" />
            </div>
          )}
        </div>
      </NodeBody>
    </Node>
  );
});
