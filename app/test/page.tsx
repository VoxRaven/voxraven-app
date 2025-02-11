"use client";
import React, { useCallback } from "react";
import {
  ReactFlow,
  addEdge,
  useNodesState,
  useEdgesState,
  Connection,
  Edge,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Button } from "@/components/ui/button";
import { CustomNode } from "./CustomNode";

const nodeTypes = { customNode: CustomNode };

const initialNodes = [
  {
    id: "InputNode",
    type: "customNode",
    position: { x: 100, y: 100 },
    data: { input: 0, output: 0 },
  },
  {
    id: "ComputeNode",
    type: "customNode",
    position: { x: 100, y: 400 },
    data: { input: 0, output: 0 },
  },
];

const initialEdges: Edge[] = [
  { id: "e1-2", source: "InputNode", target: "ComputeNode", animated: true },
  { id: "e2-1", source: "ComputeNode", target: "InputNode", animated: true },
];

const FlowChart: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const { updateNodeData } = useReactFlow();

  const start = () => {
    updateNodeData("InputNode", { input: 3 });
  };

  return (
    <div style={{ height: "100vh" }}>
      <div className="flex gap-2 mb-4">
        <Button variant="outline" onClick={start}>
          Start Computation
        </Button>
      </div>
      <ReactFlow
        nodes={nodes}
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
