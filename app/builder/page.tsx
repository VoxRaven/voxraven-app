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
  reconnectEdge,
} from "@xyflow/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import "@xyflow/react/dist/style.css";
import LLMNode from "./LLMNode";
import OutputNode from "./OutputNode";
import { Button } from "@/components/ui/button";
import { Play, Save, StarIcon } from "lucide-react";

const initialEdges: any[] = [
  { id: "e1-2", source: "1", target: "2", type: "default" },
];

const initialNodes = [
  { id: "1", position: { x: 0, y: 0 }, data: { label: "1" }, type: "llmNode" },
  {
    id: "2",
    data: {},
    position: { x: 600, y: 100 },
    type: "outputNode",
  },
  {
    id: "3",
    data: {},
    position: { x: 600, y: 400 },
    type: "outputNode",
  },
  {
    id: "4",
    data: {},
    position: { x: 600, y: 800 },
    type: "outputNode",
  },

];

function Flow() {
  const edgeReconnectSuccessful = useRef(true);
  const { updateNodeData } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);

  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onReconnectStart = useCallback(() => {
    edgeReconnectSuccessful.current = false;
  }, []);

  const onReconnect = useCallback((oldEdge: any, newConnection: any) => {
    edgeReconnectSuccessful.current = true;
    setEdges((els) => reconnectEdge(oldEdge, newConnection, els));
  }, []);

  interface Edge {
    id: string;
  }

  const onReconnectEnd = useCallback((_: any, edge: Edge) => {
    if (!edgeReconnectSuccessful.current) {
      setEdges((eds) => eds.filter((e) => e.id !== edge.id));
    }

    edgeReconnectSuccessful.current = true;
  }, []);

  const { getNodes, getEdges } = useReactFlow();
  const [isEditedUnsaved, setIsEditedUnsaved] = useState(false);

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (event: {
      preventDefault: () => void;
      returnValue: string;
    }) => {
      if (isEditedUnsaved) {
        event.preventDefault();
        event.returnValue = "Are you sure you want to leave?"; // Standard message (ignored in some browsers)
      }
    };

    if (isEditedUnsaved) {
      console.log("Added event listener");
      window.addEventListener("beforeunload", handleBeforeUnload);
    } else {
      console.log("Removed event listener");
      window.removeEventListener("beforeunload", handleBeforeUnload);
    }

    // Cleanup on component unmount or when `isEditedUnsaved` changes
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isEditedUnsaved]); // Only depend on `isEditedUnsaved`

  useEffect(() => {
    console.log("Change detected");
    setIsEditedUnsaved(true);
    console.log(edges);
    console.log(nodes);
  }, [edges, nodes]);

  const save = () => {
    console.log("Change saved");
    localStorage.setItem("nodes", JSON.stringify(nodes));
    localStorage.setItem("edges", JSON.stringify(edges));
    setIsEditedUnsaved(false);

    toast.success("Success", {
      description: "Your changes have been saved.",
      // action: {
      //   label: "Undo",
      //   onClick: () => console.log("Undo"),
      // },
    });
  };

  const load = () => {
    const savedNodes = localStorage.getItem("nodes");
    const savedEdges = localStorage.getItem("edges");

    if (savedNodes && savedEdges) {
      setNodes(JSON.parse(savedNodes));
      setEdges(JSON.parse(savedEdges));
      setIsEditedUnsaved(false);
    }
  };

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

  const nodeTypes = {
    llmNode: LLMNode,
    outputNode: OutputNode,
  };

  const [events, setEvents] = useState({
    onReconnectStart: false,
    onConnectStart: false,
    onConnect: false,
    onReconnect: false,
    onConnectEnd: false,
    onReconnectEnd: false,
  });

  const onConnectStart = useCallback((params: any) => {
    console.log("onConnectStart", params);
    setEvents((events) => ({
      ...events,
      onConnectStart: true,
      onConnect: false,
      onReconnect: false,
      onConnectEnd: false,
      onReconnectEnd: false,
    }));
  }, []);

  const start = () => {
    updateNodeData("1", { start: true });
  };

  return (
    <div className="h-full border border-slate-150 rounded-md">
      <div className="absolute z-10 flex flex-row gap-2 p-2 m-2 ">
        <Button
          className="rounded-full bg-green-500 hover:bg-green-300 w-20"
          size="icon"
          onClick={start}
        >
          <Play /> Run
        </Button>
        <Button
          className="rounded-full bg-yellow-500 hover:bg-yellow-300 w-20"
          size="icon"
          onClick={save}
        >
          <Save /> Save
        </Button>
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onConnect={onConnect}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onReconnect={onReconnect}
        onReconnectStart={onReconnectStart}
        onReconnectEnd={onReconnectEnd}
        isValidConnection={isValidConnection}
        onConnectStart={onConnectStart}
        fitView
        minZoom={0.1}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={{
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 10,
            height: 10,
            color: "#000000",
          },
          animated: true,
          style: {
            strokeWidth: 1,
            stroke: "#000000",
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
