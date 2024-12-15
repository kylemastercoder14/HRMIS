"use client";

import React, { useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "./button";
import { Input } from "@/components/ui/input";
import {
  COURSES,
  DEPARTMENTS,
  OFFICES,
  POSITION,
  POSITION2,
  YEAR_LEVEL_FILTER,
} from "@/lib/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedOffice, setSelectedOffice] = useState("");
  const [selectedYearLevel, setSelectedYearLevel] = useState("");
  const [selectedPosition, setSelectedPosition] = useState("");
  const [selectedPosition2, setSelectedPosition2] = useState("");
  const [semester, setSemester] = useState("");
  const [schoolYear, setSchoolYear] = useState("");

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    state: {
      columnFilters,
    },
  });

  // Handle course change
  const handleCourseChange = (course: string) => {
    setSelectedCourse(course);
    table.getColumn("course")?.setFilterValue(course);
  };

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    table.getColumn("status")?.setFilterValue(status);
  };

  const handleDepartmentChange = (department: string) => {
    setSelectedDepartment(department);
    table.getColumn("department")?.setFilterValue(department);
  };

  const handleOfficeChange = (office: string) => {
    setSelectedOffice(office);
    table.getColumn("office")?.setFilterValue(office);
  };

  const handleSemesterChange = (semester: string) => {
    setSemester(semester);
    table.getColumn("semester")?.setFilterValue(semester);
  };

  const handleSchoolYearChange = (schoolYear: string) => {
    setSchoolYear(schoolYear);
    table.getColumn("schoolYear")?.setFilterValue(schoolYear);
  };

  const handleYearLevelChange = (yearLevel: string) => {
    setSelectedYearLevel(yearLevel);
    table.getColumn("yearLevelFilter")?.setFilterValue(yearLevel);
  };

  const handlePositionChange = (position: string) => {
    setSelectedPosition(position);
    table.getColumn("position")?.setFilterValue(position);
  };

  const handlePositionChange2 = (position: string) => {
    setSelectedPosition2(position);
    table.getColumn("position2")?.setFilterValue(position);
  };

  return (
    <div>
      <div className="flex md:flex-row flex-col justify-between md:items-center items-start py-4 gap-3">
        {/* Search Input */}
        <Input
          placeholder="Search..."
          value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn(searchKey)?.setFilterValue(event.target.value)
          }
          className="md:max-w-sm w-full border-primary"
        />

        {(table.getColumn("course") || table.getColumn("yearLevelFilter")) && (
          <div className="flex md:flex-row w-full flex-col md:items-center items-start gap-5">
            {table.getColumn("yearLevelFilter") && (
              <Select
                defaultValue={selectedYearLevel}
                onValueChange={handleYearLevelChange}
              >
                <SelectTrigger className="md:w-[300px] w-full border border-input!important">
                  <SelectValue placeholder="All Year Level" />
                </SelectTrigger>
                <SelectContent>
                  {YEAR_LEVEL_FILTER.map((yearLevel) => (
                    <SelectItem key={yearLevel} value={yearLevel.toString()}>
                      {yearLevel}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {table.getColumn("course") && (
              <Select
                defaultValue={selectedCourse}
                onValueChange={handleCourseChange}
              >
                <SelectTrigger className="md:w-[300px] w-full border border-input!important">
                  <SelectValue placeholder="All Courses" />
                </SelectTrigger>
                <SelectContent>
                  {COURSES.map((course) => (
                    <SelectItem key={course} value={course}>
                      {course}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        )}

        {(table.getColumn("semester") || table.getColumn("schoolYear")) && (
          <div className="flex md:flex-row w-full flex-col md:items-center justify-end items-start gap-5">
            {table.getColumn("semester") && (
              <Select
                defaultValue={semester}
                onValueChange={handleSemesterChange}
              >
                <SelectTrigger className="md:w-[300px] w-full border border-input!important">
                  <SelectValue placeholder="All Semester" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1st Semester">1st Semester</SelectItem>
                  <SelectItem value="2nd Semester">2nd Semester</SelectItem>
                </SelectContent>
              </Select>
            )}
            {table.getColumn("schoolYear") && (
              <Select
                defaultValue={schoolYear}
                onValueChange={handleSchoolYearChange}
              >
                <SelectTrigger className="md:w-[300px] w-full border border-input!important">
                  <SelectValue placeholder="All School Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2021-2022">2021-2022</SelectItem>
                  <SelectItem value="2022-2023">2022-2023</SelectItem>
                  <SelectItem value="2023-2024">2023-2024</SelectItem>
                  <SelectItem value="2024-2025">2024-2025</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        )}

        {(table.getColumn("status") ||
          table.getColumn("department") ||
          table.getColumn("office") ||
          table.getColumn("position")) && (
          <div className="flex w-full md:flex-row flex-col md:items-center items-start gap-5">
            {table.getColumn("office") && (
              <Select
                defaultValue={selectedOffice}
                onValueChange={handleOfficeChange}
              >
                <SelectTrigger className="md:w-[300px] w-full border border-input!important">
                  <SelectValue placeholder="All Office" />
                </SelectTrigger>
                <SelectContent>
                  {OFFICES.map((course) => (
                    <SelectItem key={course} value={course}>
                      {course}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {table.getColumn("position2") && (
              <Select
                defaultValue={selectedPosition2}
                onValueChange={handlePositionChange2}
              >
                <SelectTrigger className="md:w-[300px] w-full border border-input!important">
                  <SelectValue placeholder="All Designation" />
                </SelectTrigger>
                <SelectContent>
                  {POSITION2.map((position) => (
                    <SelectItem key={position} value={position}>
                      {position}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {table.getColumn("position") && (
              <Select
                defaultValue={selectedPosition}
                onValueChange={handlePositionChange}
              >
                <SelectTrigger className="md:w-[300px] w-full border border-input!important">
                  <SelectValue placeholder="All Designation" />
                </SelectTrigger>
                <SelectContent>
                  {POSITION.map((position) => (
                    <SelectItem key={position} value={position.toString()}>
                      {position}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {table.getColumn("status") && (
              <Select
                defaultValue={selectedStatus}
                onValueChange={handleStatusChange}
              >
                <SelectTrigger className="md:w-[300px] w-full border border-input!important">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Regular">Regular</SelectItem>
                  <SelectItem value="COS">COS</SelectItem>
                </SelectContent>
              </Select>
            )}
            {table.getColumn("department") && (
              <Select
                defaultValue={selectedDepartment}
                onValueChange={handleDepartmentChange}
              >
                <SelectTrigger className="md:w-[300px] w-full border border-input!important">
                  <SelectValue placeholder="All Department" />
                </SelectTrigger>
                <SelectContent>
                  {DEPARTMENTS.map((department) => (
                    <SelectItem key={department} value={department}>
                      {department}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {table.getColumn("semester") && (
              <Select
                defaultValue={semester}
                onValueChange={handleSemesterChange}
              >
                <SelectTrigger className="md:w-[300px] w-full border border-input!important">
                  <SelectValue placeholder="All Semester" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1st Semester">1st Semester</SelectItem>
                  <SelectItem value="2nd Semester">2nd Semester</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        )}
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
