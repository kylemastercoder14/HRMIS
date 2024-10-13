"use client";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Copy, Edit, MoreHorizontal, Printer, Trash } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { InvitationColumn } from "./column";
import Link from "next/link";

interface CellActionProps {
  data: InvitationColumn;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const router = useRouter();
  const onCopy = (name: string) => {
    navigator.clipboard.writeText(name);
    toast.success("Data copied to the clipboard");
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          {data.statuses === "Completed" && (
            <DropdownMenuItem asChild>
              <Link
                target="_blank"
                href={`/certificate?name=${data.name}&title=${data.title}&platform=${data.platform}&date=${data.createdAt}&time=${data.time}`}
              >
                <Printer className="w-4 h-4 mr-2" />
                Print Certificate
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={() => onCopy(data.file)}>
            <Copy className="w-4 h-4 mr-2" />
            Copy
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
