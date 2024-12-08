import React from "react";
import { EvaluationColumn } from "./column";
import { Button } from "@/components/ui/button";

const RecommendationModal = ({ data }: { data: EvaluationColumn }) => {
  return (
    <>
      <Button size="sm" onClick={() => window.location.assign(`/coordinator/employee-profile/${data.facultyId}`)}>View</Button>
    </>
  );
};

export default RecommendationModal;
