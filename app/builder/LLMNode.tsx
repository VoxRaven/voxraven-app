import React, { memo, useEffect, useState } from "react";
import { Position, useNodeConnections, useReactFlow } from "@xyflow/react";
import { Input } from "@/components/ui/input";

import NodeHeader from "./components/NodeHeader";

import { ChatOpenAI } from "@langchain/openai";
import NodeHandles from "./components/NodeHandles";
import NodeBody from "./components/NodeBody";
import { Node, NodeComponentProps } from "./components/Node";

export default memo(({ id, data, isConnectable }: NodeComponentProps) => {
  const { updateNodeData } = useReactFlow();
  const [urlEndpoint, setUrlEndpoint] = useState("http://localhost:1234/v1");
  const [valideEndpoint, setValidEndpoint] = useState(false);
  const [prompt, setPrompt] = useState("");

  const outputHandles = [
    {
      label: "Output",
      id: "4",
      position: Position.Right,
      type: "source",
    },
  ];

  const connections = useNodeConnections({
    id: id,
    handleType: "source",
  });

  useEffect(() => {
    const interval = setInterval(() => {
      fetch(urlEndpoint + "/models")
        .then((response) => {
          if (response.status === 200) {
            setValidEndpoint(true);
          } else {
            setValidEndpoint(false);
          }
        })
        .catch(() => {
          setValidEndpoint(false);
        });
    }, 1000);

    return () => clearInterval(interval);
  }, [urlEndpoint]);

  useEffect(() => {
    if (data?.start) {
      console.log("LLM Node Invoked");
      const model = new ChatOpenAI({
        temperature: 0,
        configuration: {
          baseURL: urlEndpoint,
          apiKey: "sk_test_123",
        },
      });

      const invokeModel = async () => {
        console.log("Sending request to model");
        connections.forEach((connection) => {
          updateNodeData(connection.target, { thinking: true });
        });

        const out = await model.invoke(prompt);
        console.log("Received response from model", out);

        connections.forEach((connection) => {
          updateNodeData(connection.target, {
            thinking: false,
            content: out.content,
          });
        });
      };

      invokeModel();
    }
  }, [data]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUrlEndpoint(event.target.value);
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
            {valideEndpoint ? (
              <span className="bottom-3 left-[63px] absolute w-1.5 h-1.5 bg-emerald-500 border border-emerald-300 rounded-full"></span>
            ) : (
              <span className="bottom-3 left-[63px] absolute w-1.5 h-1.5 bg-gray-500 border border-gray-300 rounded-full"></span>
            )}
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

      <NodeHandles handles={outputHandles} />
    </Node>
  );
});
