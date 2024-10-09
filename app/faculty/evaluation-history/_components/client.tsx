"use client";

import React from "react";
import { DataTable } from "@/components/ui/data-table";
import { MyEvaluationColumn, columns } from "./column";

interface MyEvaluationClientProps {
  data: MyEvaluationColumn[];
}

const MyEvaluationClient: React.FC<MyEvaluationClientProps> = ({ data }) => {
  return (
    <>
      <DataTable searchKey="name" columns={columns} data={data} />
    </>
  );
};

export default MyEvaluationClient;
