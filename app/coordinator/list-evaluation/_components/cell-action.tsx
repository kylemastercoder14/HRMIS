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
import { CirclePlay, CircleStop, Copy, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { EvaluationColumn } from "./column";
import StartEvaluationModal from "@/components/start-evaluation-modal";
import { useState } from "react";
import EndEvaluationModal from "@/components/end-evaluation-modal";
import { endEvaluation, startEvaluation } from "@/actions/evaluation";

interface CellActionProps {
  data: EvaluationColumn;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [openStart, setOpenStart] = useState(false);
  const [openEnd, setOpenEnd] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const onCopy = (name: string) => {
    navigator.clipboard.writeText(name);
    toast.success("Data copied to the clipboard");
  };

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
          <DropdownMenuItem onClick={() => onCopy(data.title)}>
            <Copy className="w-4 h-4 mr-2" />
            Copy
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
