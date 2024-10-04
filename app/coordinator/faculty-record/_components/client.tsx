"use client";

import React from "react";
import { DataTable } from "@/components/ui/data-table";
import { FacultyColumn, columns } from "./column";

interface FacultyRecordClientProps {
  data: FacultyColumn[];
}

const FacultyRecordClient: React.FC<FacultyRecordClientProps> = ({ data }) => {
  return (
    <>
      <DataTable searchKey="name" columns={columns} data={data} />
    </>
  );
};

export default FacultyRecordClient;
