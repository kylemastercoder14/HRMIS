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
import {
  BookCopy,
  Copy,
  Edit,
  MoreHorizontal,
  Printer,
  Trash,
  View,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AlertModal from "@/components/ui/alert-modal";
import React from "react";
import { EmployeeProfileColumn } from "./column";
import { deleteEmployee } from "@/actions/faculty";
import RecordTableModal from "./record-table-modal";

interface CellActionProps {
  data: EmployeeProfileColumn;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [openRecord, setOpenRecord] = React.useState(false);
  const [selectedName, setSelectedName] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const onDelete = async () => {
    setLoading(true);
    try {
      deleteEmployee(data.id);
      toast.success("Employee deleted successfully");
      setOpen(false);
    } catch (error) {
      toast.error("Failed to delete employee");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AlertModal
        onConfirm={onDelete}
        isOpen={open}
        onClose={() => setOpen(false)}
        loading={loading}
      />
      <RecordTableModal
        isOpen={openRecord}
        evaluatee={selectedName}
        onClose={() => setOpenRecord(false)}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => {
              setSelectedName(data.name);
              setOpenRecord(true);
            }}
          >
            <View className="w-4 h-4 mr-2" />
            View Record
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              router.push(`/coordinator/employee-profile/${data.id}/employee`)
            }
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="w-4 h-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
