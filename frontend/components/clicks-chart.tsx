"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ClicksChartProps {
  data: Array<{
    shortCode: string;
    clicks: number;
  }>;
}

export default function ClicksChart({ data }: ClicksChartProps) {
  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader>
        <CardTitle>Clicks by Link</CardTitle>
        <CardDescription>Performance of your shortened links</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="shortCode" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="clicks" fill="hsl(var(--primary))" name="Clicks" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
