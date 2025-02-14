import React, { memo, useEffect, useState } from "react";
import {
  getOutgoers,
  Position,
  useNodeConnections,
  useReactFlow,
} from "@xyflow/react";
import { Input } from "@/components/ui/input";

import NodeHeader from "./components/NodeHeader";

import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";

import NodeBody from "./components/NodeBody";
import { Node, NodeComponentProps } from "./components/Node";
import { NodeOutputHandles } from "./components/NodeHandles";
import NodeDataTypes from "./components/NodeDataTypes";
import { MemoryVectorStore } from "langchain/vectorstores/memory";

export default memo(({ id, data }: NodeComponentProps) => {
  const { updateNodeData, getNode } = useReactFlow();
  const [urlEndpoint, setUrlEndpoint] = useState("http://localhost:1234/v1");
  const [model, setModel] = useState<any>();
  const [prompt, setPrompt] = useState("");

  const outputHandles = [
    {
      label: "Vector Store",
      outputType: NodeDataTypes.VectorStore,
    },
  ];

  const LLMOutputConnections = useNodeConnections({
    id: id,
    handleType: "source",
    handleId: NodeDataTypes.VectorStore,
  });

  useEffect(() => {
    propagateVS(LLMOutputConnections);
  }, [LLMOutputConnections]);

  const propagateVS = (connections: any) => {
    const vectorStore = new MemoryVectorStore(
      new OpenAIEmbeddings({
        configuration: {
          baseURL: "http://localhost:1234/v1",
          apiKey: "sk_test_123",
        },
      })
    );

    const payload = {
      vectorStore: vectorStore,
    };

    connections?.forEach((connection: any) => {
      updateNodeData(connection.target, payload);
    });
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUrlEndpoint(event.target.value);
    propagateVS(LLMOutputConnections);
  };

  return (
    <Node>
      <NodeHeader
        title="Vetor Store"
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

      </NodeBody>

      <NodeOutputHandles handles={outputHandles} />
    </Node>
  );
});
