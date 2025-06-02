"use client"

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
  }[];
}

const LineCharts = () => {
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
        if (data.status && data.data?.productPerformance) {
          // Add colors to the datasets
          const datasets = data.data.productPerformance.datasets.map((dataset: any, index: number) => ({
            ...dataset,
            borderColor: `hsl(${index * 120}, 70%, 50%)`,
            backgroundColor: `hsla(${index * 120}, 70%, 50%, 0.2)`,
          }));
          setChartData({
            labels: data.data.productPerformance.labels,
            datasets,
          });
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
        text: 'Product Performance',
      },
    },
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Product Performance</CardTitle>
          <CardDescription>Loading chart data...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!chartData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Product Performance</CardTitle>
          <CardDescription>No data available</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Performance</CardTitle>
        <CardDescription>Weekly sales by product</CardDescription>
      </CardHeader>
      <CardContent>
        <Line options={options} data={chartData} />
      </CardContent>
    </Card>
  );
};

export default LineCharts;
