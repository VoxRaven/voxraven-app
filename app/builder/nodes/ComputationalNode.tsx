import React, { memo, use, useEffect, useState } from "react";
import {
  Handle,
  Position,
  useNodeConnections,
  useReactFlow,
} from "@xyflow/react";
import { CustomNode, NodeComponentProps } from "./blocks/CustomNode";
import { CustomNodeHeader } from "./blocks/CustomNodeHeader";
import { CustomNodeBody } from "./blocks/CustomNodeBody";
import { CustomHandle } from "./blocks/CustomHandles";

export default memo(({ id, data }: NodeComponentProps) => {
  const [output, setOutput] = useState<number>(0);
  const [input, setInput] = useState<number>(0);

  const { updateNodeData } = useReactFlow();
  const sourceConnections = useNodeConnections({ id, handleType: "source" });

  useEffect(() => {
    console.log("==== Node", id, "====");
    console.log(sourceConnections);
    console.log(data);

    const targetNodeId = sourceConnections[0]?.target;

    if (data.input) {
      setInput(data.input);
      const computation = doComputation(data.input);
      console.log("Sending to target node", targetNodeId);

      const payload = { input: computation };

      console.log("Payload", payload);

      setTimeout(() => {
        updateNodeData(targetNodeId, payload);
      }, 1000);
    }
  }, [data.input]);

  const doComputation = (input: number) => {
    const computation = input + 1;
    setOutput(computation);
    return computation;
  };

  return (
    <CustomNode>
      <CustomNodeHeader
        title="Computational Node"
        intials="T"
        imgSrc="https://placehold.co/600x400.png"
      />
      <CustomHandle
        label="Input Number"
        id="input"
        type="target"
        postion={Position.Left}
      />
      <CustomNodeBody>
        <div className="flex flex-col p-4 space-y-4">
          <div>Input: {input}</div>
          <div>Output: {output}</div>
        </div>
      </CustomNodeBody>
      <CustomHandle
        label="Output Number"
        id="output"
        type="source"
        postion={Position.Right}
      />
    </CustomNode>
  );
});
