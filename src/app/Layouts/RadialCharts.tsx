"use client"

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

interface ChartData {
  labels: string[];
  data: number[];
}

const RadialCharts = () => {
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
        if (data.status && data.data?.categoryDistribution) {
          setChartData(data.data.categoryDistribution);
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
        text: 'Category Distribution',
      },
    },
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Category Distribution</CardTitle>
          <CardDescription>Loading chart data...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!chartData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Category Distribution</CardTitle>
          <CardDescription>No data available</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const chartDataConfig = {
    labels: chartData.labels,
    datasets: [
      {
        data: chartData.data,
        backgroundColor: chartData.labels.map((_, index) => 
          `hsl(${index * 120}, 70%, 50%)`
        ),
        borderColor: chartData.labels.map((_, index) => 
          `hsl(${index * 120}, 70%, 50%)`
        ),
        borderWidth: 1,
      },
    ],
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Category Distribution</CardTitle>
        <CardDescription>Sales distribution by category</CardDescription>
      </CardHeader>
      <CardContent>
        <Doughnut options={options} data={chartDataConfig} />
      </CardContent>
    </Card>
  );
};

export default RadialCharts;
