"use client";

import { createEmployee, updateEmployee } from "@/actions/faculty";
import Heading from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Faculty } from "@prisma/client";
import React from "react";
import { toast } from "sonner";

const EmployeeForm = ({ initialData }: { initialData: Faculty | null }) => {
  const title = initialData ? "Edit Employee" : "Add Employee";
  const description = initialData
    ? "Edit employee details"
    : "Add employee details";
  const action = initialData ? "Save Changes" : "Create Employee";
  const facultyRanks = [
    "Associate Professor I",
    "Associate Professor II",
    "Associate Professor III",
    "Associate Professor IV",
    "Associate Professor V",
    "Assistant Professor I",
    "Assistant Professor II",
    "Assistant Professor III",
    "Assistant Professor IV",
    "Assistant Professor V",
    "COS Faculty",
    "Instructor I",
    "Instructor II",
    "Instructor III",
    "Professor I",
    "Professor II",
    "Professor III",
    "Professor IV",
  ];

  const departmentData = [
    "College of Criminology",
    "College of Education",
    "College of Industrial Technology",
    "College of Information Technology",
    "College of BSES and BSAF Program",
  ];

  const [employeeId, setEmployeeId] = React.useState<string>(
    initialData?.employeeId || ""
  );
  const [firstName, setFirstName] = React.useState<string>(
    initialData?.fname || ""
  );
  const [middleName, setMiddleName] = React.useState<string>(
    initialData?.mname || ""
  );
  const [lastName, setLastName] = React.useState<string>(
    initialData?.lname || ""
  );
  const [department, setDepartment] = React.useState<string>(
    initialData?.department || ""
  );
  const [academicRank, setAcademicRank] = React.useState<string>(
    initialData?.academicRank || ""
  );
  const [position, setPosition] = React.useState<string>(
    initialData?.position || ""
  );
  const [status, setStatus] = React.useState<string>(initialData?.status || "");
  const [email, setEmail] = React.useState<string>(initialData?.email || "");
  const [password, setPassword] = React.useState<string>(
    initialData?.password || ""
  );
  const [dateHired, setDateHired] = React.useState<string>(
    initialData?.dateHired || ""
  );
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (initialData) {
        const data = await updateEmployee(initialData.id, {
          employeeId,
          fname: firstName,
          mname: middleName,
          lname: lastName,
          department,
          academicRank,
          position,
          status,
          email,
          password,
          dateHired,
        });
        if (data.error) {
          toast.error(data.error);
        } else {
          toast.success(data.success);
          window.location.assign("/coordinator/employee-profile");
        }
      } else {
        const data = await createEmployee({
          employeeId,
          fname: firstName,
          mname: middleName,
          lname: lastName,
          department,
          academicRank,
          position,
          status,
          email,
          password,
          dateHired,
        });
        if (data.error) {
          toast.error(data.error);
        } else {
          toast.success(data.success);
          window.location.assign("/coordinator/employee-profile");
        }
      }
    } catch (error: any) {
      console.error(JSON.stringify(error, null, 2));
      toast.error(error.message || "Failed to sign up.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <Card>
        <CardContent className="p-5">
          <div className="flex items-center justify-between space-y-2">
            <Heading title={title} description={description} />
          </div>
          <form onSubmit={onSubmit} className="mt-2 space-y-4">
            <div className="mb-4 space-y-1">
              <Label>Employee ID</Label>
              <Input
                disabled={isLoading}
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                name="employeeId"
                required
                placeholder="Enter Employee ID"
                className="border border-input!important"
              />
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="mb-4 space-y-1">
                <Label>First Name</Label>
                <Input
                  disabled={isLoading}
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  name="firstName"
                  required
                  placeholder="Enter First Name"
                  className="border border-input!important"
                />
              </div>
              <div className="mb-4 space-y-1">
                <Label>Middle Name (optional)</Label>
                <Input
                  disabled={isLoading}
                  value={middleName}
                  onChange={(e) => setMiddleName(e.target.value)}
                  name="middleName"
                  placeholder="Enter Middle Name"
                  className="border border-input!important"
                />
              </div>
              <div className="mb-4 space-y-1">
                <Label>Last Name</Label>
                <Input
                  disabled={isLoading}
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  name="lastName"
                  required
                  placeholder="Enter Last Name"
                  className="border border-input!important"
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="mb-4 space-y-1">
                <Label>Department</Label>
                <Select
                  disabled={isLoading}
                  defaultValue={department}
                  onValueChange={setDepartment}
                >
                  <SelectTrigger className="border border-input!important">
                    <SelectValue placeholder="Select Department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departmentData.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="mb-4 space-y-1">
                <Label>Academic Rank</Label>
                <Select
                  disabled={isLoading}
                  defaultValue={academicRank}
                  onValueChange={setAcademicRank}
                >
                  <SelectTrigger className="border border-input!important">
                    <SelectValue placeholder="Select Academic Rank" />
                  </SelectTrigger>
                  <SelectContent>
                    {facultyRanks.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="mb-4 space-y-1">
                <Label>Position</Label>
                <Select
                  disabled={isLoading}
                  defaultValue={position}
                  onValueChange={setPosition}
                >
                  <SelectTrigger className="border border-input!important">
                    <SelectValue placeholder="Select Position" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Teaching">Teaching</SelectItem>
                    <SelectItem value="Chairperson">Chairperson</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="mb-4 space-y-1">
                <Label>Status</Label>
                <Select
                  disabled={isLoading}
                  defaultValue={status}
                  onValueChange={setStatus}
                >
                  <SelectTrigger className="border border-input!important">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Regular">Regular</SelectItem>
                    <SelectItem value="COS">COS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="mb-4 space-y-1">
                <Label>Email Address</Label>
                <Input
                  disabled={isLoading}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  name="email"
                  required
                  placeholder="Enter Email Address"
                  className="border border-input!important"
                />
              </div>
              <div className="mb-4 space-y-1">
                <Label>Password</Label>
                <Input
                  disabled={isLoading}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  name="password"
                  required
                  type="password"
                  placeholder="Enter Password"
                  className="border border-input!important"
                />
              </div>
            </div>
            <div className="mb-4 space-y-1">
              <Label>Date Hired</Label>
              <Input
                disabled={isLoading}
                value={dateHired}
                onChange={(e) => setDateHired(e.target.value)}
                name="dateHired"
                type="date"
                required
                placeholder="Enter Date Hired"
                className="border border-input!important"
              />
            </div>
            <Button disabled={isLoading} type="submit">
              {action}
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
};

export default EmployeeForm;
