"use client";

import React from "react";
import { Modal } from "@/components/ui/modal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getAllEvaluationsSummaryByEvaluatee,
  getAllEvaluators,
} from "@/actions/evaluation";
import { Loader2 } from "lucide-react";

interface EvaluationRecord {
  id: string;
  evaluatorId: string;
  evaluatee: string;
  evaluator: string;
  academicRank: string;
  semester: string;
  yearLevel: string | null;
  questionId: string;
  rating: number;
  comments: string | null;
}

interface Evaluator {
  id: string;
  name: string;
  type: string;
}

const RecordTableModal = ({
  isOpen,
  evaluatee,
  onClose,
}: {
  isOpen: boolean;
  evaluatee: string;
  onClose: () => void;
}) => {
  const [loading, setLoading] = React.useState(true);
  const [groupedData, setGroupedData] = React.useState<
    Record<string, { name: string; type: string; comments: string[] }>
  >({});

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const evaluationData = await getAllEvaluationsSummaryByEvaluatee(
          evaluatee
        );

        const evaluatorData = await getAllEvaluators();

        // Map evaluators by ID for quick lookup
        const evaluatorMap = evaluatorData.reduce(
          (acc: Record<string, Evaluator>, evaluator) => {
            acc[evaluator.id] = {
              id: evaluator.id,
              name: `${evaluator.lname}, ${evaluator.fname}`,
              type: evaluator.type,
            };
            return acc;
          },
          {}
        );

        // Group evaluation data by evaluatorId
        const grouped = evaluationData.reduce(
          (
            acc: Record<
              string,
              { name: string; type: string; comments: string[] }
            >,
            record: EvaluationRecord
          ) => {
            const evaluator = evaluatorMap[record.evaluatorId];
            if (evaluator) {
              if (!acc[record.evaluatorId]) {
                acc[record.evaluatorId] = {
                  name: evaluator.name,
                  type: evaluator.type,
                  comments: [],
                };
              }
              acc[record.evaluatorId].comments.push(record.comments || "N/A");
            }
            return acc;
          },
          {}
        );

        setGroupedData(grouped);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [evaluatee]);

  return (
    <Modal
      className="max-w-3xl"
      isOpen={isOpen}
      onClose={onClose}
      title="Employee Evaluation Summary"
      description="View the evaluation summary of the employee"
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Evaluator Name</TableHead>
            <TableHead>Type</TableHead>
            {/* <TableHead>Comments</TableHead> */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center">
                <Loader2 className="w-6 h-6 animate-spin" />
              </TableCell>
            </TableRow>
          ) : !groupedData || Object.keys(groupedData).length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center">
                No evaluation records found
              </TableCell>
            </TableRow>
          ) : (
            Object.entries(groupedData).map(([evaluatorId, details]) => (
              <TableRow key={evaluatorId}>
                <TableCell>{details.name}</TableCell>
                <TableCell>{details.type}</TableCell>
                {/* <TableCell>{details.comments}</TableCell> */}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </Modal>
  );
};

export default RecordTableModal;
