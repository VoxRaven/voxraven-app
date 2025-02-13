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
          <AvatarImage src="https://ignos.blog/wp-content/uploads/2024/01/lm-studio-logo.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
      <div className="mr-4 font-bold text-md">LM Studio Model</div>
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
  const { updateNodeData } = useReactFlow();
  const [urlEndpoint, setUrlEndpoint] = useState("http://localhost:1234/v1");
  const [valideEndpoint, setValidEndpoint] = useState(false);
  const [prompt, setPrompt] = useState("");

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
        updateNodeData(connections[0].target, { thinking: true });
        const out = await model.invoke(prompt);
        console.log("Received response from model", out);
        updateNodeData(connections[0].target, {
          thinking: false,
          content: out.content,
        });
      };

      invokeModel();
    }
  }, [data]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUrlEndpoint(event.target.value);
  };

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
        <div className="relative">
          <div className="font-bold">Endpoint</div>
          {valideEndpoint ? (
            <span className="bottom-3 left-[55px] absolute w-1.5 h-1.5 bg-emerald-500 border border-emerald-300 rounded-full"></span>
          ) : (
            <span className="bottom-3 left-[55px] absolute w-1.5 h-1.5 bg-gray-500 border border-gray-300 rounded-full"></span>
          )}
        </div>

        <Input
          className="w-full h-[25px]"
          value={urlEndpoint}
          onChange={handleInputChange}
          placeholder="Endpoint /v1/models"
        />
      </div>

      <div className="flex flex-col gap-2 mt-2">
        <div className="flex items-center">
          <div className="font-bold">Prompt</div>
        </div>

        <Input
          className="w-full h-[25px]"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Your prompt goes here"
        />
      </div>

      <div className="mt-2 gap-2 flex flex-col">
        {outputHandles.map((item, index) => (
          <div key={index} className="text-end font-bold">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>{item}</TooltipTrigger>
                <TooltipContent>
                  <p>LM Studio Model</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        ))}
      </div>
    </div>
  );
};

const isValidConnection = (connection: any) => {
  console.log(connection);
  return true;
};

export default memo(({ id, data, isConnectable }: TestNodeProps) => {
  const handleStyle = { top: 10 };
  const inputHandles: string[] = [];
  const outputHandles: string[] = ["Output"];
  const [componentUuid, setComponentUuid] = React.useState<string>("");

  React.useEffect(() => {
    setComponentUuid(uuidv4());
  }, []);

  return (
    <div className="border border-black rounded-lg bg-white">
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
          isValidConnection={isValidConnection}
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
            top: 210 + 24 * (inputHandles.length + index),
          }}
          id={componentUuid + index}
          key={index}
          isValidConnection={isValidConnection}
        />
      ))}
    </div>
  );
});
