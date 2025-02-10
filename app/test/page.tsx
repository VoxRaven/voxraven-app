"use client";
import React, { useCallback, useEffect, useState } from "react";
import {
  ReactFlow,
  addEdge,
  useNodesState,
  useEdgesState,
  Handle,
  Connection,
  Edge,
  Position,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Button } from "@/components/ui/button";

interface NodeData {
  input: number;
  output: number;
  onChange?: (id: string, data: Omit<NodeData, "onChange">) => void;
}

interface CustomNodeProps {
  id: string;
  data: NodeData;
  selected: boolean;
}

const CustomNode: React.FC<CustomNodeProps> = ({ id, data, selected }) => {
  useEffect(() => {
    if (data.onChange) {
      data.onChange(id, { ...data, output: data.input + 1 });
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
      <Handle type="source" position={Position.Right} id="a" />
      <Handle type="target" position={Position.Left} id="b" />
    </div>
  );
};

const nodeTypes = { customNode: CustomNode };

const initialNodes = [
  {
    id: "1",
    type: "customNode",
    position: { x: 100, y: 100 },
    data: { input: 0, output: 0 },
  },
  {
    id: "2",
    type: "customNode",
    position: { x: 100, y: 400 },
    data: { input: 0, output: 0 },
  },
];

const initialEdges: Edge[] = [
  { id: "e1-2", source: "1", target: "2", animated: true },
//   { id: "e2-1", source: "2", target: "1", animated: true },
];

const FlowChart: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [inputValue, setInputValue] = useState(0);
  const [compute, setCompute] = useState(false);

  const updateNodeData = useCallback(
    (nodeId: string, newData: NodeData) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId
            ? {
                ...node,
                data: {
                  ...newData,
                  onChange: (node.data as NodeData).onChange,
                },
              }
            : node
        )
      );
      propagateOutput(nodeId, newData.output);
    },
    [setNodes, edges]
  );

  const propagateOutput = (sourceId: string, outputValue: number) => {
    console.log("propagating output", sourceId, outputValue);
    const outgoingEdges = edges.filter((edge) => edge.source === sourceId);
    setNodes((nds) =>
      nds.map((node) => {
        if (outgoingEdges.some((edge) => edge.target === node.id)) {
          return {
            ...node,
            data: { ...node.data, input: outputValue },
          };
        }
        return node;
      })
    );
  };

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const nodesWithCallbacks = nodes.map((node) => ({
    ...node,
    data: { ...node.data, onChange: updateNodeData },
  }));

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10) || 0;
    setInputValue(newValue);
  };

  const handleCompute = () => {
    setCompute(!compute);
    console.log("Compute set to ", compute);
    updateNodeData("1", { ...nodes[0].data, input: inputValue });
  };

  return (
    <div style={{ height: "100vh" }}>
      <div className="flex gap-2 mb-4">
        <input
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Enter initial input"
        />
        <Button variant="outline" onClick={handleCompute}>
          Start Computation
        </Button>
      </div>
      <ReactFlow
        nodes={nodesWithCallbacks}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
      />
    </div>
  );
};

export default FlowChart;
