"use client"
import React, { useEffect, useState } from 'react'
import Layout from "../Layouts/Layout"
import withAuth from '../../withAuth'
import SparklesText from "@/components/magicui/sparkles-text";
import Image from "next/image"
import Link from "next/link"

import {
  ChevronLeft,
  ChevronRight,
  Copy,
  CreditCard,
  File,
  Home,
  LineChart,
  ListFilter,
  MoreVertical,
  Package,
  Package2,
  PanelLeft,
  Search,
  Settings,
  ShoppingCart,
  Truck,
  Users2,
  SquarePlus
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Pagination } from "@/components/ui/pagination"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import Sheets from "../Layouts/Sheets"
import DatePickerWithRange from "../Layouts/DatePickerWithRange"
import { TooltipProvider } from "@radix-ui/react-tooltip"
import BarCharts from '../Layouts/BarCharts';
import LineCharts from '../Layouts/LineCharts';
import RadialCharts from '../Layouts/RadialCharts';

interface DashboardData {
  productMetrics: {
    totalProducts: number;
    totalStock: number;
    lowStockCount: number;
    activeProducts: number;
    averagePrice: number;
  };
  categoryMetrics: {
    totalCategories: number;
    activeCategories: number;
  };
  salesMetrics: {
    totalOrders: number;
    totalItemsSold: number | null;
    totalRevenue: number | null;
    uniqueCustomers: number;
    averageOrderValue: number | null;
  };
  topProducts: Array<{
    id: string;
    name: string;
    price: number;
    stock: number;
    totalSold: number | null;
    totalRevenue: number | null;
  }>;
  lowStockProducts: Array<{
    id: string;
    name: string;
    stock: number;
    categoryName: string;
  }>;
  categorySales: Array<{
    id: string;
    name: string;
    orderCount: number;
    itemsSold: number | null;
    revenue: number | null;
  }>;
}

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product/dashboard`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.status && data.data) {
        setDashboardData(data.data);
        setTotalPages(data.data.totalPages);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          Loading...
        </div>
      </Layout>
    );
  }

  const formatCurrency = (value: number | null | undefined) => {
    if (value === null || value === undefined) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'NGN'
    }).format(value);
  };

  const formatNumber = (value: number | null | undefined) => {
    if (value === null || value === undefined) return 'N/A';
    return Number(value).toLocaleString();
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <Layout>
      <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        <div className="grid gap-3 sm:grid-cols-2">
          <h1 className='font-bold text-4xl text-gray-950'>Dashboard</h1>
          <div className='sm:justify-self-end grid gap-5 sm:grid-cols-2 lg:grid-cols-1'>
            <DatePickerWithRange />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Product Metrics */}
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Products</CardDescription>
              <CardTitle className="text-4xl">{formatNumber(dashboardData?.productMetrics.totalProducts)}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                {formatNumber(dashboardData?.productMetrics.activeProducts)} active products
              </div>
            </CardContent>
            <CardFooter>
              <Progress 
                value={(dashboardData?.productMetrics.activeProducts || 0) / (dashboardData?.productMetrics.totalProducts || 1) * 100} 
                aria-label="Active products percentage" 
              />
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Stock</CardDescription>
              <CardTitle className="text-4xl">{formatNumber(dashboardData?.productMetrics.totalStock)}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                {formatNumber(dashboardData?.productMetrics.lowStockCount)} items low in stock
              </div>
            </CardContent>
            <CardFooter>
              <Progress 
                value={((dashboardData?.productMetrics.totalStock || 0) - (dashboardData?.productMetrics.lowStockCount || 0)) / (dashboardData?.productMetrics.totalStock || 1) * 100} 
                aria-label="Stock health percentage" 
              />
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Revenue</CardDescription>
              <CardTitle className="text-4xl">{formatCurrency(dashboardData?.salesMetrics.totalRevenue)}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                From {formatNumber(dashboardData?.salesMetrics.totalOrders)} orders
              </div>
            </CardContent>
            <CardFooter>
              <Progress 
                value={dashboardData?.salesMetrics.totalOrders ? 100 : 0} 
                aria-label="Orders progress" 
              />
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Categories</CardDescription>
              <CardTitle className="text-4xl">{formatNumber(dashboardData?.categoryMetrics.totalCategories)}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                {formatNumber(dashboardData?.categoryMetrics.activeCategories)} active categories
              </div>
            </CardContent>
            <CardFooter>
              <Progress 
                value={(dashboardData?.categoryMetrics.activeCategories || 0) / (dashboardData?.categoryMetrics.totalCategories || 1) * 100} 
                aria-label="Active categories percentage" 
              />
            </CardFooter>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          {/* Top Products */}
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Top Products</CardTitle>
              <CardDescription>Product inventory overview</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Sold</TableHead>
                    <TableHead>Revenue</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dashboardData?.topProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{formatCurrency(product.price)}</TableCell>
                      <TableCell>{formatNumber(product.stock)}</TableCell>
                      <TableCell>{formatNumber(product.totalSold)}</TableCell>
                      <TableCell>{formatCurrency(product.totalRevenue)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Low Stock Products */}
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Low Stock Alert</CardTitle>
              <CardDescription>Products that need restocking</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Stock</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dashboardData?.lowStockProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.categoryName}</TableCell>
                      <TableCell>
                        <Badge
                          variant={product.stock <= 5 ? "destructive" : "default"}
                          className="ml-2"
                        >
                          {product.stock} in stock
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Category Sales */}
        <Card>
          <CardHeader>
            <CardTitle>Category Performance</CardTitle>
            <CardDescription>Sales metrics by category</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead>Items Sold</TableHead>
                  <TableHead>Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dashboardData?.categorySales.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell>{formatNumber(category.orderCount)}</TableCell>
                    <TableCell>{formatNumber(category.itemsSold)}</TableCell>
                    <TableCell>{formatCurrency(category.revenue)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="sm:w-[90vw] grid gap-3 sm:grid-cols-3">
          <BarCharts />
          <div className="flex-col">
            <LineCharts />
            <RadialCharts />
          </div>
        </div>
      </main>
    </Layout>
  )
}

export default Dashboard