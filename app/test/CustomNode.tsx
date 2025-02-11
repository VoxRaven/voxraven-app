"use client";
import React, { useCallback, useEffect, useState } from "react";
import {
  Handle,
  Position,
  useReactFlow,
  useNodeConnections,
} from "@xyflow/react";
import { on } from "events";

export interface NodeData {
  input: number;
  output: number;
}

interface CustomNodeProps {
  id: string;
  data: NodeData;
  selected: boolean;
}

export const CustomNode: React.FC<CustomNodeProps> = ({
  id,
  data,
  selected,
}) => {
  const { updateNodeData } = useReactFlow();

  const connections = useNodeConnections({
    id: id,
    handleType: "source",
  });

  useEffect(() => {
    const input = data.input;
    const output = input + 1;

    updateNodeData(id, { output: output });
    if (connections[0] && connections[0].target) {
      setTimeout(() => {
        updateNodeData(connections[0].target, { input: output });
      }, 10);
    }
  }, [data.input]);

  return (
    <div
      style={{
        padding: "10px",
        border: selected ? "2px solid blue" : "1px solid gray",
        textAlign: "center",
      }}
    >
      <div>Input: {data.input}</div>
      <div>Output: {data.output}</div>
      <Handle type="source" position={Position.Right} id="output" />
      <Handle type="target" position={Position.Left} id="input" />
    </div>
  );
};
