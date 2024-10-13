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
import AlertModal from "@/components/ui/alert-modal";
import React from "react";
import InvitationForm from "./invitation-form";
import EditInvitationForm from "./edit-invitation-form";
import { deleteInvitation } from "@/actions/invitation";

interface CellActionProps {
  data: InvitationColumn;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [editInvitation, setEditInvitation] = React.useState(false);

  const onDelete = async () => {
    setLoading(true);
    try {
      await deleteInvitation(data.id);
      toast.success("Invitation deleted");
      setOpen(false);
      window.location.reload();
    } catch (error) {
      toast.error("Failed to delete invitation");
      console.log("Failed to delete invitation", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AlertModal
        loading={loading}
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
      />
      {editInvitation && <EditInvitationForm onClose={() => setEditInvitation(false)} initialData={data} />}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => setEditInvitation(true)}>
            <Edit className="w-4 h-4 mr-2" />
            Update
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
