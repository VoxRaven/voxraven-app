import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface NodeHeaderProps {
  title: string;
  imgSrc?: string;
}

const NodeHeader = ({ title, imgSrc }: NodeHeaderProps) => {
  return (
    <div className="border-b border-black flex items-center h-14">
      <div className="ml-2">
        <Avatar className="m-2 w-7 h-7">
          <AvatarImage src={imgSrc} />
        </Avatar>
      </div>
      <div className="mr-4 font-bold text-md">{title}</div>
    </div>
  );
};


export default NodeHeader;