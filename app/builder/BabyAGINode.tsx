import React, { memo, use, useEffect, useState } from "react";
import { Position, useNodeConnections, useReactFlow } from "@xyflow/react";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Loader2Icon } from "lucide-react";
import { Node, NodeComponentProps } from "./components/Node";
import NodeHeader from "./components/NodeHeader";
import NodeBody from "./components/NodeBody";
import {
  NodeInputHandles,
  NodeOutputHandles,
  NodeOutputHandlesProps,
  NodeInputHandlesProps,
} from "./components/NodeHandles";
import NodeDataTypes from "./components/NodeDataTypes";

import { BabyAGI } from "langchain/experimental/babyagi";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings, OpenAI } from "@langchain/openai";
import { stringify } from "querystring";
import { Button } from "@/components/ui/button";

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

export default memo(({ id, data }: NodeComponentProps) => {
  const [LLM, setLLM] = useState();
  const [vectorStore, setVectorStore] = useState();
  const [hasLLM, setHasLLM] = useState(false);

  const inputHandles = [
    {
      label: "LLM",
      acceptedType: NodeDataTypes.LLM,
    },
    {
      label: "Vector Store",
      acceptedType: NodeDataTypes.VectorStore,
    },
  ];

  useEffect(() => {
    console.log("Data", data);
  }, [data]);

  useEffect(() => {
    setLLM(data.LLM);
    if (data.LLM) {
      setHasLLM(true);
    } else {
      setHasLLM(false);
    }
  }, [data.LLM]);

  useEffect(() => {
    setVectorStore(data.vectorStore);
  }, [data.vectorStore]);

  const run = async () => {
    const babyAGI = BabyAGI.fromLLM({
      llm: LLM!,
      vectorstore: vectorStore!,
      maxIterations: 3,
    });

    await babyAGI.invoke({ objective: "Write a weather report for SF today" });
  };

  return (
    <Node>
      <NodeHeader
        title="Baby AGI"
        imgSrc="https://sprout24.com/hub/wp-content/uploads/sites/2/2024/08/babyagi-600x600.png"
      />

      <NodeInputHandles handles={inputHandles} />

      <NodeBody>
        <div className="mt-2 flex flex-row">
          <div>Has LLM {hasLLM.toString()}</div>
        </div>
        <Button onClick={run}> Run </Button>
      </NodeBody>
    </Node>
  );
});
