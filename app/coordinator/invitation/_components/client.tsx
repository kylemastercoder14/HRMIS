"use client";

import React from "react";
import { DataTable } from "@/components/ui/data-table";
import { InvitationColumn, columns } from "./column";

interface InvitationClientProps {
  data: InvitationColumn[];
}

const InvitationClient: React.FC<InvitationClientProps> = ({ data }) => {
  return (
    <>
      <DataTable searchKey="file" columns={columns} data={data} />
    </>
  );
};

export default InvitationClient;
