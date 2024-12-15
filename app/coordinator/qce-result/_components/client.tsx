"use client";

import React from "react";
import { DataTable } from "@/components/ui/data-table";
import { DepartmentColumn, EvaluationColumn, columns, columns1 } from "./column";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface EvaluationClientProps {
  data: EvaluationColumn[];
  department: DepartmentColumn[];
}

const EvaluationClient: React.FC<EvaluationClientProps> = ({
  data,
  department,
}) => {
  return (
    <>
      <Tabs defaultValue="individual">
        <TabsList>
          <TabsTrigger value="individual">Faculty</TabsTrigger>
          <TabsTrigger value="department">Department</TabsTrigger>
        </TabsList>
        <TabsContent value="individual">
          <DataTable searchKey="name" columns={columns} data={data} />
        </TabsContent>
        <TabsContent value="department">
          <DataTable searchKey="department" columns={columns1} data={department} />
        </TabsContent>
      </Tabs>
    </>
  );
};

export default EvaluationClient;
