"use client";

import React from "react";
import { DataTable } from "@/components/ui/data-table";
import { AssignColumn, columns } from "./column";

interface AssignClientProps {
  data: AssignColumn[];
}

const AssignClient: React.FC<AssignClientProps> = ({ data }) => {
  return (
    <>
      <DataTable searchKey="name" columns={columns} data={data} />
    </>
  );
};

export default AssignClient;
