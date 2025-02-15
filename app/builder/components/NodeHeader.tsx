import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CardHeader } from "@/components/ui/card";
import { CircleIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface NodeHeaderProps {
  title: string;
  imgSrc?: string;
}

const NodeHeader = ({ title, imgSrc }: NodeHeaderProps) => {
  return (
    // <CardHeader className="space-y-1">
    //   <div className="flex items-center gap-2">
    //     <Avatar className="m-2 w-7 h-7">
    //       <AvatarImage src={imgSrc} />
    //     </Avatar>
    //     <h2 className="font-semibold tracking-tight">{title}</h2>
    //   </div>
    // </CardHeader>

    <CardHeader className="space-y-1">
      <div className="flex items-center gap-2">
        <div className="rounded-full">
          <Avatar className="w-8 h-8">
            <AvatarImage src={imgSrc} />
          </Avatar>
        </div>
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      </div>
    </CardHeader>
  );
};

export default NodeHeader;
