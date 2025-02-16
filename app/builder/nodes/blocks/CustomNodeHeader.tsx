import { Avatar } from "@/components/ui/avatar";
import { CardHeader } from "@/components/ui/card";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

interface CustomNodeHeaderProps {
  title: string;
  imgSrc?: string;
  intials: string;
}

export const CustomNodeHeader = ({
  title,
  imgSrc,
  intials,
}: CustomNodeHeaderProps) => {
  return (
    <CardHeader>
      <div className="flex items-center gap-2">
        <div>
          <Avatar className="w-8 h-8">
            <AvatarImage src={imgSrc} alt="avatar" />
            <AvatarFallback>{intials}</AvatarFallback>
          </Avatar>
        </div>
        <div className="text-lg font-bold tracking-tight">{title}</div>
      </div>
    </CardHeader>
  );
};
