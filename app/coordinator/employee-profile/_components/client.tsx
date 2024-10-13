"use client";

import React from "react";
import { DataTable } from "@/components/ui/data-table";
import { EmployeeProfileColumn, columns } from "./column";

interface EmployeeProfileClientProps {
  data: EmployeeProfileColumn[];
}

const EmployeeProfileClient: React.FC<EmployeeProfileClientProps> = ({ data }) => {
  return (
    <>
      <DataTable searchKey="name" columns={columns} data={data} />
    </>
  );
};

export default EmployeeProfileClient;
