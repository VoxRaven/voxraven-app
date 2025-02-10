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
  useReactFlow,
  getOutgoers,
} from "@xyflow/react";
import { useCallback } from "react";

import "@xyflow/react/dist/style.css";
import TestNode from "./TestNode";

const initialEdges: any[] = [];

const initialNodes = [
  { id: "1", position: { x: 0, y: 0 }, data: { label: "1" }, type: "testNode" },
  {
    id: "2",
    data: { label: "World" },
    position: { x: 400, y: 400 },
    type: "testNode",
  },
];

function Flow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  //const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const { getNodes, getEdges } = useReactFlow();

  const isValidConnection = useCallback(
    (connection: { target: any; source: any }) => {
      // we are using getNodes and getEdges helpers here
      // to make sure we create isValidConnection function only once
      const nodes = getNodes();
      const edges = getEdges();
      const target = nodes.find(
        (node: { id: any }) => node.id === connection.target
      );
      const hasCycle = (node: { id: string }, visited = new Set<string>()) => {
        if (visited.has(node.id)) return false;

        visited.add(node.id);

        for (const outgoer of getOutgoers(node, nodes, edges)) {
          if (outgoer.id === connection.source) return true;
          if (hasCycle(outgoer, visited)) return true;
        }
      };

      if (!target || target.id === connection.source) return false;
      return !hasCycle(target);
    },
    [getNodes, getEdges]
  );

  const nodeTypes = { testNode: TestNode };

  return (
    <div className="h-full border border-slate-150 rounded-md">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        isValidConnection={isValidConnection}
        onConnect={onConnect}
        fitView
        minZoom={0.1}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={{
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 20,
            height: 10,
            color: "#0a7ffc",
          },
          label: "is working",
          style: {
            strokeWidth: 2,
            stroke: "#0a7ffc",
          },
        }}
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}

export default Flow;
