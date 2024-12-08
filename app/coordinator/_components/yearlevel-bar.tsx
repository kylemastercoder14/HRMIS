"use client";

import { TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Legend,
  XAxis,
  YAxis,
  Cell,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Student } from "@prisma/client";

const generateRandomColor = () =>
  `#${Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, "0")}`;

const YearlevelBar = ({ studentData }: { studentData: Student[] }) => {
  // Count students by year level
  const yearLevelCounts = studentData.reduce((acc, student) => {
    const yearLevel = student.yearLevel + " year"; // Adjust according to your Student model
    acc[yearLevel] = (acc[yearLevel] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });

  // Prepare data for the bar chart with unique colors
  const chartData = Object.entries(yearLevelCounts).map(
    ([yearLevel, count]) => ({
      yearLevel,
      count,
      color: generateRandomColor(),
    })
  );

  const chartConfig = {
    desktop: {
      label: (
        <>
          <TrendingUp /> Desktop
        </>
      ),
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Year Level Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="yearLevel"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="count" radius={8}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
            <Legend
              layout="horizontal"
              align="center"
              verticalAlign="bottom"
              formatter={(value, entry) => {
                const color = chartData.find(
                  (data) => data.yearLevel === value
                )?.color;
                return <span style={{ color: color }}>{value}</span>;
              }}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default YearlevelBar;
