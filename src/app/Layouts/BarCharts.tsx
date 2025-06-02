"use client"

import React, { useEffect, useState } from 'react';
import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
  }[];
}

const BarCharts = () => {
  const [chartData, setChartData] = useState<ChartData | null>(null);
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
        const data = await response.json();
        if (data.status && data.data?.monthlySales) {
          setChartData(data.data.monthlySales);
        }
      } catch (error) {
        console.error("Error fetching chart data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Monthly Sales Overview',
      },
    },
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sales Overview</CardTitle>
          <CardDescription>Loading chart data...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!chartData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sales Overview</CardTitle>
          <CardDescription>No data available</CardDescription>
        </CardHeader>
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
        <Bar options={options} data={chartData} />
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  )
}

export default BarCharts;
