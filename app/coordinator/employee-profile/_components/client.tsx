"use client";

import React from "react";
import { DataTable } from "@/components/ui/data-table";
import {
  EmployeeProfileColumn,
  NonTeachingProfileColumn,
  columns,
  columns2,
} from "./column";

interface EmployeeProfileClientProps {
  data?: EmployeeProfileColumn[];
  data2?: NonTeachingProfileColumn[];
  isNonTeaching?: boolean;
}

const EmployeeProfileClient: React.FC<EmployeeProfileClientProps> = ({
  data,
  isNonTeaching,
  data2,
}) => {
  return (
    <>
      {isNonTeaching ? (
        <DataTable searchKey="name" columns={columns2} data={data2 || []} />
      ) : (
        <DataTable searchKey="name" columns={columns} data={data || []} />
      )}
    </>
  );
};

export default EmployeeProfileClient;
