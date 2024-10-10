"use client";

import React from "react";
import { DataTable } from "@/components/ui/data-table";
import { EvaluationColumn, columns } from "./column";

interface EvaluationListClientProps {
  data: EvaluationColumn[];
}

const EvaluationListClient: React.FC<EvaluationListClientProps> = ({ data }) => {
  return (
    <>
      <DataTable searchKey="title" columns={columns} data={data} />
    </>
  );
};

export default EvaluationListClient;
