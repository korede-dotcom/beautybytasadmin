"use client";
import React, { useState, useEffect } from "react";
import { File, ListFilter, MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Pagination } from "@/components/ui/pagination";
import Layout from "../Layouts/Layout";

interface Order {
  orderId: string;
  customerName: string;
  orderDate: string;
  status: string;
  totalAmount: number;
  paymentMethod: string;
}

const Page: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);

  const getAllOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders?page=${currentPage}&limit=${pageSize}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();

      setOrders(data.orders);
      setTotalPages(data.pagination.totalPages);
      setTotalItems(data.pagination.totalItems);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllOrders();
  }, [currentPage, pageSize]);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <Layout>
      <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        <h1 className='font-bold text-4xl text-gray-950'>Orders</h1>
        <Tabs defaultValue="all">
          <div className="flex items-center">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="processing">Processing</TabsTrigger>
              <TabsTrigger value="completed" className="hidden sm:flex">
                Completed
              </TabsTrigger>
            </TabsList>
            <div className="ml-auto flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 gap-1">
                    <ListFilter className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                      Filter
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem checked>
                    Pending
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>Processing</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>
                    Completed
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button size="sm" variant="outline" className="h-8 gap-1">
                <File className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Export
                </span>
              </Button>
            </div>
          </div>
          <TabsContent value="all">
            <Card x-chunk="dashboard-06-chunk-0">
              <CardHeader>
                <CardTitle>Orders</CardTitle>
                <CardDescription>
                  Manage your orders and view their status.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead className="hidden md:table-cell">
                        Date
                      </TableHead>
                      <TableHead className="hidden md:table-cell">
                        Status
                      </TableHead>
                      <TableHead className="hidden md:table-cell">
                        Amount
                      </TableHead>
                      <TableHead className="hidden md:table-cell">
                        Payment Method
                      </TableHead>
                      <TableHead>
                        <span className="sr-only">Actions</span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center">
                          Loading...
                        </TableCell>
                      </TableRow>
                    ) : !orders || orders.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center">
                          No orders found
                        </TableCell>
                      </TableRow>
                    ) : (
                      orders.map((order) => (
                        <TableRow key={order.orderId}>
                          <TableCell className="font-medium">
                            {order.orderId}
                          </TableCell>
                          <TableCell>
                            {order.customerName}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {order.orderDate}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <Badge variant={
                              order.status === 'completed' ? 'default' :
                              order.status === 'processing' ? 'secondary' :
                              'outline'
                            }>
                              {order.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            ${order.totalAmount.toFixed(2)}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {order.paymentMethod}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button aria-haspopup="true" size="icon" variant="ghost">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Toggle menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                <DropdownMenuItem>Update Status</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  pageSize={pageSize}
                  totalItems={totalItems}
                />
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </Layout>
  );
};

export default Page; 