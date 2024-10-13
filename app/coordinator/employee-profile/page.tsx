import React from "react";
import db from "@/lib/db";
import Heading from "@/components/heading";
import { format } from "date-fns";
import { getAcronym } from "@/lib/utils";
import { EmployeeProfileColumn } from "./_components/column";
import EmployeeProfileClient from "./_components/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const EmployeeProfile = async () => {
  const facultyCOS = await db.faculty.findMany({
    orderBy: {
      createdAt: "desc",
    },
    where: {
      status: "COS",
    },
  });

  const facultyRegular = await db.faculty.findMany({
    orderBy: {
      createdAt: "desc",
    },
    where: {
      status: "Regular",
    },
  });

  const formattedCos: EmployeeProfileColumn[] = facultyCOS.map((item) => ({
    id: item.id,
    name: item.fname + " " + item.mname + " " + item.lname + " " + item.suffix,
    email: item.email,
    imageUrl: item.profile ?? "",
    department: item.department ?? "",
    academicRank: item.academicRank ?? "",
    createdAt: format(item.createdAt, "MMMM dd, yyyy"),
    status: item.status ?? "N/A",
  }));

  const formattedRegular: EmployeeProfileColumn[] = facultyRegular.map(
    (item) => ({
      id: item.id,
      name:
        item.fname + " " + item.mname + " " + item.lname + " " + item.suffix,
      email: item.email,
      imageUrl: item.profile ?? "",
      department: item.department ?? "",
      academicRank: item.academicRank ?? "",
      createdAt: format(item.createdAt, "MMMM dd, yyyy"),
      status: item.status ?? "N/A",
    })
  );

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <Heading title={`Employee Profile`} description="" />
      </div>
      <Tabs defaultValue="regular">
        <TabsList>
          <TabsTrigger value="regular">Regular</TabsTrigger>
          <TabsTrigger value="non-teaching">Non-Teaching</TabsTrigger>
          <TabsTrigger value="cos">Contract of Service</TabsTrigger>
        </TabsList>
        <TabsContent value="regular">
          <EmployeeProfileClient data={formattedRegular} />
        </TabsContent>
        <TabsContent value="non-teaching"></TabsContent>
        <TabsContent value="cos">
          <EmployeeProfileClient data={formattedCos} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmployeeProfile;
