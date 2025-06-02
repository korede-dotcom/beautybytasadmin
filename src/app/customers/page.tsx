"use client";
import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { File, ListFilter, MoreHorizontal, PlusCircle } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
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
import { toast } from "@/components/ui/use-toast";

interface Customer {
  [x: string]: any;
  username: string,
	useremail: string,
  customerid: string,
  phonenumber: string,
  address: string,
  createdat: string
}

const Page: React.FC = () => {
  const [formData, setFormData] = useState<{ name: string }>({ name: '' });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [customer, setCustomer] = useState<Customer[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);

  const getAllCustomers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customers?page=${currentPage}&limit=${pageSize}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (data.status && data.data) {
        setCustomer(data.data.customers);
        setTotalPages(data.data.pagination.totalPages);
        setTotalItems(parseInt(data.data.pagination.totalItems));
      } else {
        console.error("Error in response format:", data);
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllCustomers();
  }, [currentPage, pageSize]);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateCategory = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast({
        title: "Oops",
        description: "Please input a category name.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const details = await response.json();

      if (details.status) {
        toast({
          title: "Category",
          description: details.message,
        });
        setFormData({ name: '' })
        await getAllCustomers();
        setIsSheetOpen(false);
      } else {
        toast({
          title: "Failed",
          description: details.message,
          variant: "destructive",
        });
        setError('Invalid credentials');
      }
    } catch (err) {
      console.error("Create category error:", err);
      toast({
        title: "Failed",
        description: "An error occurred.",
        variant: "destructive",
      });
      setError('An error occurred during creation.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        <h1 className='font-bold text-4xl text-gray-950'>Customers</h1>
        <Tabs defaultValue="all">
          <div className="flex items-center">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="inactive">Inactive</TabsTrigger>
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
                    Active
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>Inactive</DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button size="sm" variant="outline" className="h-8 gap-1">
                <File className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Export
                </span>
              </Button>
              <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetTrigger asChild>
                  <Button size="sm" className="h-8 gap-1" onClick={() => setIsSheetOpen(true)}>
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                      Add Category
                    </span>
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Create Category</SheetTitle>
                    <SheetDescription>
                      Make changes to your profile here. Click save when you're done.
                    </SheetDescription>
                  </SheetHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4 justify-start">
                      <p className="text-right font-bold text-sm">
                        Name
                      </p>
                      <Input
                        id="name"
                        className="col-span-3"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <SheetFooter>
                    <Button onClick={handleCreateCategory} type="submit">
                      {loading ? (
                        <svg className="bg-white animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                          {/* Your loading spinner SVG */}
                        </svg>
                      ) : "Submit"}
                    </Button>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            </div>
          </div>
          <TabsContent value="all">
            <Card x-chunk="dashboard-06-chunk-0">
              <CardHeader>
                <CardTitle>Customers</CardTitle>
                <CardDescription>
                  Manage your customers and view their information.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead className="hidden md:table-cell">
                        Email
                      </TableHead>
                      <TableHead className="hidden md:table-cell">
                        Address
                      </TableHead>
                      <TableHead className="hidden md:table-cell">
                        Orders
                      </TableHead>
                      <TableHead className="hidden md:table-cell">
                        Created At
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
                    ) : !customer || customer.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center">
                          No customers found
                        </TableCell>
                      </TableRow>
                    ) : (
                      customer.map((cat) => (
                        <TableRow key={cat?.customerId}>
                          <TableCell className="font-medium">
                            {cat?.userName}
                          </TableCell>
                          <TableCell>
                            <Badge className="text-primary-foreground" variant="secondary">
                              {cat?.phoneNumber}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {cat?.userEmail}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {cat?.address}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {cat?.orderCount}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {new Date(cat?.createdAt).toLocaleDateString()}
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
                                <DropdownMenuItem>
                                  <Link href={`/customers/${cat?.customerId}`}>Edit Customer</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>Delete</DropdownMenuItem>
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
