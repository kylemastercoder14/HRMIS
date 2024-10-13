
"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";

export type EmployeeProfileColumn = {
  id: string;
  name: string;
  status: string;
  imageUrl: string;
  email: string;
  academicRank: string;
  department: string;
  createdAt: string;
};

export const columns: ColumnDef<EmployeeProfileColumn>[] = [
  {
    accessorKey: "name",
    header: "Faculty",
    cell: ({ row }) => (
      <div className="flex items-center gap-x-2">
        {row.original.imageUrl ? (
          <Image
            src={row.original.imageUrl}
            alt="Image"
            width={40}
            height={40}
            className="object-cover rounded-md"
          />
        ) : (
          <Avatar className="w-10 h-10 object-cover rounded-md">
            <AvatarFallback className="rounded-md">
              {row.original.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
        )}
        <div className="flex flex-col">
          <p className="font-semibold">{row.original.name}</p>
          <p className="text-muted-foreground text-sm">{row.original.email}</p>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "department",
    header: "Department",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "academicRank",
    header: "Academic Rank",
  },
  {
    accessorKey: "createdAt",
    header: "Date Created",
  },
];
