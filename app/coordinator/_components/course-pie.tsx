"use client";

import { Pie, PieChart, Legend, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Student } from "@prisma/client";

// Define your chart configuration
const chartConfig = {
  value: {
    label: "Number of Students",
  },
};

const generateRandomColor = () =>
  `#${Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, "0")}`;

const CoursePie = ({ studentData }: { studentData: Student[] }) => {
  // Count students by course
  const courseCounts = studentData.reduce((acc, student) => {
    const course = student.course; // Adjust according to your Student model
    acc[course] = (acc[course] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });

  // Prepare data for the pie chart with random colors
  const chartData = Object.entries(courseCounts).map(([course, count]) => ({
    name: course,
    value: count,
    color: generateRandomColor(),
  }));

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-0">
        <CardTitle>Department Summary</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig} // Pass the config prop here
          className="mx-auto aspect-square max-h-[650px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              outerRadius="80%"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Legend
              layout="vertical"
              align="right"
              verticalAlign="middle"
              formatter={(value: string, entry: any) => (
                <span style={{ color: entry.payload.color }}>{value}</span>
              )}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default CoursePie;
