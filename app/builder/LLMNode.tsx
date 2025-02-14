import React, { memo, useEffect, useState } from "react";
import {
  getOutgoers,
  Position,
  useNodeConnections,
  useReactFlow,
} from "@xyflow/react";
import { Input } from "@/components/ui/input";

import NodeHeader from "./components/NodeHeader";

import { ChatOpenAI } from "@langchain/openai";

import NodeBody from "./components/NodeBody";
import { Node, NodeComponentProps } from "./components/Node";
import { NodeOutputHandles } from "./components/NodeHandles";
import NodeDataTypes from "./components/NodeDataTypes";

type LLMOutput = {
  content?: string;
  thinking: boolean;
};

export default memo(({ id, data }: NodeComponentProps) => {
  const { updateNodeData, getNode } = useReactFlow();
  const [urlEndpoint, setUrlEndpoint] = useState("http://localhost:1234/v1");
  const [model, setModel] = useState<any>();
  const [prompt, setPrompt] = useState("");

  const outputHandles = [
    {
      label: "LLM",
      outputType: NodeDataTypes.LLM,
    },
  ];

  const LLMOutputConnections = useNodeConnections({
    id: id,
    handleType: "source",
    handleId: NodeDataTypes.LLM,
  });

  useEffect(() => {
    propagateLLMModel(LLMOutputConnections);
  }, [LLMOutputConnections]);

  useEffect(() => {
    console.log("Model Created");
  }, [urlEndpoint]);

  const propagateLLMModel = (connections: any) => {
    const model = new ChatOpenAI({
      temperature: 0,
      configuration: {
        baseURL: urlEndpoint,
        apiKey: "sk_test_123",
      },
    });

    const payload = {
      LLM: model,
    };

    connections?.forEach((connection: any) => {
      updateNodeData(connection.target, payload);
    });
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUrlEndpoint(event.target.value);
    propagateLLMModel(LLMOutputConnections);
  };

  return (
    <Node>
      <NodeHeader
        title="LM Studio Model"
        imgSrc="https://ignos.blog/wp-content/uploads/2024/01/lm-studio-logo.png"
      />

      <NodeBody>
        <div className="flex flex-col gap-1 mt-2">
          <div className="relative">
            <div className="font-bold text-sm">Endpoint</div>
          </div>

          <Input
            className="w-full h-[25px]"
            value={urlEndpoint}
            onChange={handleInputChange}
            placeholder="Endpoint /v1/models"
          />
        </div>

        <div className="flex flex-col gap-1 mt-2">
          <div className="flex items-center">
            <div className="font-bold text-sm">Prompt</div>
          </div>

          <Input
            className="w-full h-[25px]"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Your prompt goes here"
          />
        </div>
      </NodeBody>

      <NodeOutputHandles handles={outputHandles} />
    </Node>
  );
});
