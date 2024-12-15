import React from "react";
import db from "@/lib/db";
import Heading from "@/components/heading";
import { format } from "date-fns";
import {
  EmployeeProfileColumn,
  NonTeachingProfileColumn,
} from "./_components/column";
import EmployeeProfileClient from "./_components/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const EmployeeProfile = async () => {
  const faculty = await db.faculty.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const supervisor = await db.supervisor.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const nonTeaching = await db.nonTeaching.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const teachingStaff = [...faculty, ...supervisor];

  const formattedTeaching: EmployeeProfileColumn[] = teachingStaff.map(
    (item) => ({
      id: item.id,
      name: item.fname + " " + item.lname,
      email: item.email,
      imageUrl: item.profile ?? "",
      department: item.department ?? "",
      employeeId: item.employeeId,
      academicRank: item.academicRank ?? "",
      position: item.position ?? "",
      dateHired: format(item.dateHired, "MMMM dd, yyyy"),
      status: item.status ?? "N/A",
    })
  );

  const formattedNonTeaching: NonTeachingProfileColumn[] = nonTeaching.map(
    (item) => ({
      id: item.id,
      name: item.fname + " " + item.lname,
      email: item.email,
      imageUrl: item.profile ?? "",
      position2: item.position ?? "",
      employeeId: item.employeeId,
      dateHired: format(item.dateHired, "MMMM dd, yyyy"),
      office: item.office ?? "N/A",
      status: item.status ?? "N/A",
    })
  );

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex md:flex-row flex-col md:items-center items-start justify-between">
        <Heading title={`Employee Profile`} description="" />
        <Button asChild>
          <Link href={`/coordinator/employee-profile/new/employee`}>
            + Add Employee
          </Link>
        </Button>
      </div>
      <Tabs defaultValue="teaching">
        <TabsList>
          <TabsTrigger value="teaching">Teaching</TabsTrigger>
          <TabsTrigger value="non-teaching">Non-Teaching</TabsTrigger>
        </TabsList>
        <TabsContent value="teaching">
          <EmployeeProfileClient
            data={formattedTeaching}
            isNonTeaching={false}
          />
        </TabsContent>
        <TabsContent value="non-teaching">
          <EmployeeProfileClient
            isNonTeaching={true}
            data2={formattedNonTeaching}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmployeeProfile;
