"use client";

import React from "react";
import { DataTable } from "@/components/ui/data-table";
import { ListEvaluationColumn, columns } from "./column";

interface ListEvaluationClientProps {
  data: ListEvaluationColumn[];
}

const ListEvaluationClient: React.FC<ListEvaluationClientProps> = ({ data }) => {
  return (
    <>
      <DataTable searchKey="evaluatee" columns={columns} data={data} />
    </>
  );
};

export default ListEvaluationClient;
