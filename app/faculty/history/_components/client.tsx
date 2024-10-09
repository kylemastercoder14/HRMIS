"use client";

import React from "react";
import { DataTable } from "@/components/ui/data-table";
import { EvaluationColumn, columns } from "./column";

interface EvaluationClientProps {
  data: EvaluationColumn[];
}

const EvaluationClient: React.FC<EvaluationClientProps> = ({ data }) => {
  return (
    <>
      <DataTable searchKey="faculty" columns={columns} data={data} />
    </>
  );
};

export default EvaluationClient;
