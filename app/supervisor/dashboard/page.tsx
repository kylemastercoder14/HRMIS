import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileBarChart, FolderClosed, Notebook, Users } from "lucide-react";
import React from "react";
import CoursePie from "../_components/course-pie";
import YearlevelBar from "../_components/yearlevel-bar";
import db from "@/lib/db";

const Dashboard = async () => {
  const students = await db.student.findMany();
  const faculties = await db.faculty.findMany();
  const evaluations = await db.evaluation.findMany();
  const invitations = await db.invitation.findMany();
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card x-chunk="dashboard-01-chunk-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Students
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{students.length}</div>
          </CardContent>
        </Card>
        <Card x-chunk="dashboard-01-chunk-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Faculties
            </CardTitle>
            <Notebook className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{faculties.length}</div>
          </CardContent>
        </Card>
        <Card x-chunk="dashboard-01-chunk-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Evaluations
            </CardTitle>
            <FileBarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{evaluations.length}</div>
          </CardContent>
        </Card>
        <Card x-chunk="dashboard-01-chunk-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Training Invitations
            </CardTitle>
            <FolderClosed className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{invitations.length}</div>
          </CardContent>
        </Card>
      </div>
      <div className="mt-5 grid grid-cols-5 gap-5">
        <div className="col-span-2">
          <CoursePie studentData={students} />
        </div>
        <div className="col-span-3">
          <YearlevelBar studentData={students} />
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
