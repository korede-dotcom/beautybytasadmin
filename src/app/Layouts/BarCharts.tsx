"use client"

import React, { useEffect, useState } from 'react';
import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface ChartDataItem {
  month: string;
  revenue: number;
  orders: number;
}

interface ApiResponse {
  status: boolean;
  data: {
    monthlySales: {
      labels: string[];
      datasets: {
        label: string;
        data: number[];
      }[];
    };
  };
}

const BarCharts = () => {
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product/charts`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        const data: ApiResponse = await response.json();

        if (data.status && data.data?.monthlySales) {
          // Transform Chart.js format to Recharts format
          const { labels, datasets } = data.data.monthlySales;
          const transformedData: ChartDataItem[] = labels.map((month, index) => ({
            month,
            revenue: datasets[0]?.data[index] || 0,
            orders: datasets[1]?.data[index] || 0,
          }));
          setChartData(transformedData);
        }
      } catch (error) {
        console.error("Error fetching chart data:", error);
        // Set fallback data for development
        setChartData([
          { month: "Jan", revenue: 1200, orders: 45 },
          { month: "Feb", revenue: 1900, orders: 67 },
          { month: "Mar", revenue: 1500, orders: 52 },
          { month: "Apr", revenue: 2100, orders: 78 },
          { month: "May", revenue: 1800, orders: 61 },
          { month: "Jun", revenue: 2400, orders: 89 },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, []);

  const chartConfig = {
    revenue: {
      label: "Revenue",
      color: "hsl(var(--chart-1))",
    },
    orders: {
      label: "Orders",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig;

  if (loading) {
    return (
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Sales Overview</CardTitle>
          <CardDescription>Loading chart data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <div className="text-muted-foreground">Loading...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!chartData || chartData.length === 0) {
    return (
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Sales Overview</CardTitle>
          <CardDescription>No data available</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <div className="text-muted-foreground">No chart data available</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Sales Overview</CardTitle>
        <CardDescription>Monthly revenue and orders</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="revenue" fill="var(--color-revenue)" radius={4} />
            <Bar dataKey="orders" fill="var(--color-orders)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total revenue and orders for the last 6 months
        </div>
      </CardFooter>
    </Card>
  )
}

export default BarCharts;
