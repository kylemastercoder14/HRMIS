"use client";

import React from "react";
import { DataTable } from "@/components/ui/data-table";
import { StudentColumn, columns } from "./column";

interface StudentRecordClientProps {
  data: StudentColumn[];
}

const StudentRecordClient: React.FC<StudentRecordClientProps> = ({ data }) => {
  return (
    <>
      <DataTable searchKey="name" columns={columns} data={data} />
    </>
  );
};

export default StudentRecordClient;
