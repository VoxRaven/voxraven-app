import React from "react";
import { Handle, useNodeConnections } from "@xyflow/react";

import { HandleProps } from "@xyflow/react";


const CustomHandle = (props: HandleProps & { connectionCount: number }) => {
  const connections = useNodeConnections({
    handleType: "target",
    handleId: props.id ?? "",
  });

  return (
    <Handle
      {...props}
      isConnectable={connections.length < props.connectionCount}
    />
  );
};

export default CustomHandle;
