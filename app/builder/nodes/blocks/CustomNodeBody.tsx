import * as React from "react";

import { CardContent } from "@/components/ui/card";

interface CustomNodeBodyProps {
  children: React.ReactNode;
}

export const CustomNodeBody: React.FC<CustomNodeBodyProps> = ({ children }) => {
  return <CardContent className="min-w-72 space-y-4">{children}</CardContent>;
};
