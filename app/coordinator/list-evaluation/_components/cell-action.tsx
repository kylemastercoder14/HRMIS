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
  CirclePlay,
  CircleStop,
  Copy,
  MoreHorizontal,
  Trash,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { EvaluationColumn } from "./column";
import StartEvaluationModal from "@/components/start-evaluation-modal";
import { useState } from "react";
import EndEvaluationModal from "@/components/end-evaluation-modal";
import {
  deleteEvaluation,
  endEvaluation,
  startEvaluation,
} from "@/actions/evaluation";
import AlertModal from "@/components/ui/alert-modal";

interface CellActionProps {
  data: EvaluationColumn;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [openDelete, setOpenDelete] = useState(false);
  const [openStart, setOpenStart] = useState(false);
  const [openEnd, setOpenEnd] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onStart = async () => {
    setLoading(true);
    try {
      await startEvaluation(data.id);
      toast.success("Evaluation started");
      setOpenStart(false);
      window.location.reload();
    } catch (error) {
      toast.error("Failed to start evaluation");
      console.log("Failed to start evaluation", error);
    } finally {
      setLoading(false);
    }
  };
  const onEnd = async () => {
    setLoading(true);
    try {
      await endEvaluation(data.id);
      toast.success("Evaluation ended");
      setOpenEnd(false);
      window.location.reload();
    } catch (error) {
      toast.error("Failed to end evaluation");
      console.log("Failed to end evaluation", error);
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    setLoading(true);
    try {
      await deleteEvaluation(data.id);
      toast.success("Evaluation deleted");
      setOpenEnd(false);
      window.location.reload();
    } catch (error) {
      toast.error("Failed to delete evaluation");
      console.log("Failed to delete evaluation", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <StartEvaluationModal
        isOpen={openStart}
        onClose={() => setOpenStart(false)}
        loading={loading}
        onConfirm={onStart}
      />
      <EndEvaluationModal
        isOpen={openEnd}
        onClose={() => setOpenEnd(false)}
        loading={loading}
        onConfirm={onEnd}
      />
      <AlertModal
        isOpen={openDelete}
        onClose={() => setOpenDelete(false)}
        loading={loading}
        onConfirm={onDelete}
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
          <DropdownMenuItem onClick={() => setOpenStart(true)}>
            <CirclePlay className="w-4 h-4 mr-2" />
            Start
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpenEnd(true)}>
            <CircleStop className="w-4 h-4 mr-2" />
            End
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpenDelete(true)}>
            <Trash className="w-4 h-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
