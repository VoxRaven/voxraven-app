import * as React from "react";

import {
  Card,
} from "@/components/ui/card";

interface CustomNodeProps {
  children: React.ReactNode;
}

export const CustomNode: React.FC<CustomNodeProps> = ({ children }) => {
  return <Card>{children}</Card>;
};

export interface NodeComponentProps {
  id: string;
  data: any;
}
