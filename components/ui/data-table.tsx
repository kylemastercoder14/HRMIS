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
import { COURSES, DEPARTMENTS } from "@/lib/constants";
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
  const [semester, setSemester] = useState("");

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

  const handleSemesterChange = (semester: string) => {
    setSemester(semester);
    table.getColumn("semester")?.setFilterValue(semester);
  };

  return (
    <div>
      <div className="flex justify-between items-center py-4">
        {/* Search Input */}
        <Input
          placeholder="Search..."
          value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn(searchKey)?.setFilterValue(event.target.value)
          }
          className="max-w-sm border-primary"
        />

        {table.getColumn("course") && (
          <Select
            defaultValue={selectedCourse}
            onValueChange={handleCourseChange}
          >
            <SelectTrigger className="w-[300px] border border-input!important">
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

        {(table.getColumn("status") || table.getColumn("department")) && (
          <div className="flex items-center gap-5">
            {table.getColumn("status") && (
              <Select
                defaultValue={selectedStatus}
                onValueChange={handleStatusChange}
              >
                <SelectTrigger className="w-[300px] border border-input!important">
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
                <SelectTrigger className="w-[300px] border border-input!important">
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
                <SelectTrigger className="w-[300px] border border-input!important">
                  <SelectValue placeholder="All Semester" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1st Semester">
                  1st Semester
                  </SelectItem>
                  <SelectItem value="2nd Semester">
                  2nd Semester
                  </SelectItem>
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
