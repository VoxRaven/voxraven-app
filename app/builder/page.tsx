"use client";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  BackgroundVariant,
  MarkerType,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";
import TestNode from "./TestNode";

const initialEdges = [{ id: "1-2", source: "1", target: "2" }];

const initialNodes = [
  { id: "1", position: { x: 0, y: 0 }, data: { label: "1" }, type: "testNode" },
  {
    id: "2",
    data: { label: "World" },
    position: { x: 400, y: 400 },
  },
];

function Flow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const nodeTypes = { testNode: TestNode };

  return (
    <div className="h-full border border-slate-150 rounded-md">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        minZoom={0.1}
        nodeTypes={nodeTypes}
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}

export default Flow;
function useCallback(
  arg0: (params: any) => void,
  arg1: import("react").Dispatch<
    import("react").SetStateAction<
      { id: string; source: string; target: string }[]
    >
  >[]
) {
  throw new Error("Function not implemented.");
}
