
"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { CellAction } from "./cell-action";

export type InvitationColumn = {
  id: string;
  file: string;
  title: string;
  time: string;
  name: string;
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
    accessorKey: "createdAt",
    header: "Date Created",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
