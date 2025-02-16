"use client";
import {
  ReactFlow,
  Controls,
  Background,
  useReactFlow,
  useNodesState,
  useEdgesState,
  Connection,
  addEdge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import ComputationalNode from "./nodes/ComputationalNode";
import { Button } from "@/components/ui/button";
import { useCallback } from "react";

const initialEdges = [{ id: "1-2", source: "1", target: "2", animated: true }];

const initialNodes = [
  {
    id: "1",
    data: {},
    position: { x: 0, y: 0 },
    type: "computationalNode",
  },
  {
    id: "2",
    data: {},
    position: { x: 600, y: 0 },
    type: "computationalNode",
  },
];

const nodeTypes = {
  computationalNode: ComputationalNode,
};

function Flow() {
  const { updateNodeData } = useReactFlow();

  const startCompute = () => {
    updateNodeData("1", { input: 1 });
  };

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div className="h-full relative">
      <div className="absolute z-10">
        <Button onClick={startCompute}>Run</Button>
      </div>
      <ReactFlow
        nodeTypes={nodeTypes}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}

export default Flow;
