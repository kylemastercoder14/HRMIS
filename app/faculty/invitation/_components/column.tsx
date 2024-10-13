
"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { CellAction } from "./cell-action";
import { Badge } from "@/components/ui/badge";

export type InvitationColumn = {
  id: string;
  file: string;
  title: string;
  time: string;
  name: string;
  statuses: string;
  platform: string;
  createdAt: string;
};

export const columns: ColumnDef<InvitationColumn>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "platform",
    header: "Platform",
  },
  {
    accessorKey: "file",
    header: "File",
  },
  {
    accessorKey: "statuses",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.statuses;
      let variant: "default" | "secondary" | "outline" | "destructive" | null | undefined = "default";
  
      if (status === "Pending") {
        variant = "destructive";
      } else if (status === "On-going") {
        variant = "secondary";
      } else if (status === "Completed") {
        variant = "default";
      }
  
      return <Badge variant={variant}>{status}</Badge>;
    }
  },
  {
    accessorKey: "createdAt",
    header: "Date Created",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
