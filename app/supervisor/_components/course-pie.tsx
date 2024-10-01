"use client";

import { Pie, PieChart } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Student } from "@prisma/client";

// Define your chart configuration
const chartConfig = {
  // Define your configuration here as needed
  value: {
    label: "Number of Students",
  },
};

const CoursePie = ({ studentData }: { studentData: Student[] }) => {
  // Count students by course
  const courseCounts = studentData.reduce((acc, student) => {
    const course = student.course; // Adjust according to your Student model
    acc[course] = (acc[course] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });

  // Prepare data for the pie chart
  const chartData = Object.entries(courseCounts).map(([course, count]) => ({
    name: course,
    value: count,
  }));

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-0">
        <CardTitle>Course Summary</CardTitle>
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
              fill="#8884d8"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default CoursePie;
