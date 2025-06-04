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
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
import Layout from "../Layouts/Layout";
import { toast } from "@/components/ui/use-toast";
import { Pagination } from "@/components/ui/pagination";

interface Category {
  [x: string]: any;
  categoryId: string;
  categoryName: string;
  productCount: number;
  createdAt: string;
}

const Page: React.FC = () => {
  const [formData, setFormData] = useState<{ name: string }>({ name: '' });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);

  // Edit category state
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editFormData, setEditFormData] = useState<{ name: string; status?: boolean }>({
    name: '',
    status: true
  });
  const [editLoading, setEditLoading] = useState(false);


  const getAllCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/category?page=${currentPage}&limit=${pageSize}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      console.log("🚀 ~ getAllCategories ~ API response:", data);
      console.log("🚀 ~ getAllCategories ~ categories sample:", data.categories?.[0]);

      setCategories(data.categories);
      setTotalPages(data.pagination.totalPages);
      setTotalItems(data.pagination.totalItems);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setError('Failed to fetch categories.');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {

    getAllCategories();
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/category`, {
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
        await getAllCategories();
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

  const handleEditCategory = (category: Category) => {
    console.log("🚀 ~ handleEditCategory ~ category:", category);
    console.log("🚀 ~ handleEditCategory ~ category keys:", Object.keys(category));

    // Check for different possible ID field names
    const categoryId = category.categoryId || category.categoryid || category.id || category._id;
    console.log("🚀 ~ handleEditCategory ~ categoryId found:", categoryId);

    if (!categoryId) {
      toast({
        title: "Error",
        description: "Category ID not found. Please try again.",
        variant: "destructive",
      });
      return;
    }

    setEditingCategory(category);
    setEditFormData({
      name: category.categoryname || category.categoryName || category.name || '',
      status: category.status !== undefined ? category.status : true
    });
    setIsEditSheetOpen(true);
  };

  const handleEditFormChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleStatusChange = (checked: boolean) => {
    setEditFormData({
      ...editFormData,
      status: checked
    });
  };

  const handleUpdateCategory = async (e: FormEvent) => {
    e.preventDefault();

    if (!editFormData.name.trim()) {
      toast({
        title: "Oops",
        description: "Please input a category name.",
        variant: "destructive",
      });
      return;
    }

    // Check for different possible ID field names
    const categoryId = editingCategory?.categoryId || editingCategory?.categoryid || editingCategory?.id || editingCategory?._id;

    if (!categoryId) {
      console.log("🚀 ~ handleUpdateCategory ~ editingCategory:", editingCategory);
      console.log("🚀 ~ handleUpdateCategory ~ available keys:", editingCategory ? Object.keys(editingCategory) : 'no category');
      toast({
        title: "Error",
        description: "Category ID is missing.",
        variant: "destructive",
      });
      return;
    }

    setEditLoading(true);
    try {
      const token = localStorage.getItem("token");

      // Prepare the request body - status is optional
      const requestBody: { name: string; status?: boolean } = {
        name: editFormData.name
      };

      // Only include status if it's defined
      if (editFormData.status !== undefined) {
        requestBody.status = editFormData.status;
      }

      console.log("🚀 ~ handleUpdateCategory ~ requestBody:", requestBody);
      console.log("🚀 ~ handleUpdateCategory ~ categoryId:", categoryId);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/category/${categoryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      console.log("🚀 ~ handleUpdateCategory ~ response status:", response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const details = await response.json();
      console.log("🚀 ~ handleUpdateCategory ~ response data:", details);

      if (details.status) {
        toast({
          title: "Success",
          description: details.message || "Category updated successfully",
        });
        await getAllCategories();
        setIsEditSheetOpen(false);
        setEditingCategory(null);
        setEditFormData({ name: '', status: true });
      } else {
        toast({
          title: "Failed",
          description: details.message || "Failed to update category",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Update category error:", err);
      toast({
        title: "Failed",
        description: `An error occurred while updating the category: ${err instanceof Error ? err.message : 'Unknown error'}`,
        variant: "destructive",
      });
    } finally {
      setEditLoading(false);
    }
  };

  const handleCloseEditSheet = () => {
    setIsEditSheetOpen(false);
    setEditingCategory(null);
    setEditFormData({ name: '', status: true });
  };

  return (
    <Layout>
      <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        <h1 className='font-bold text-4xl text-gray-950'>Categories</h1>
        <Tabs defaultValue="all">
          <div className="flex items-center">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="draft">Draft</TabsTrigger>
              <TabsTrigger value="archived" className="hidden sm:flex">
                Archived
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
                    Active
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>Draft</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>
                    Archived
                  </DropdownMenuCheckboxItem>
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
                <CardTitle>Categories</CardTitle>
                <CardDescription>
                  Manage your categories and view their sales performance.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      {/* <TableHead className="hidden w-[100px] sm:table-cell">
                        <span className="sr-only">Image</span>
                      </TableHead> */}
                      <TableHead>Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden md:table-cell">
                        product count
                      </TableHead>
                      {/* <TableHead className="hidden md:table-cell">
                        Total Sales
                      </TableHead> */}
                      <TableHead className="hidden md:table-cell">
                        Created At
                      </TableHead>
                      <TableHead>
                        <span className="sr-only">Actions</span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categories?.map((cat) => (
                      <TableRow key={cat?.categoryId}>
                        {/* <TableCell className="hidden sm:table-cell">
                          <Image
                            alt="Category image"
                            className="aspect-square rounded-md object-cover"
                            height={64}
                            src="/placeholder.svg"
                            width={64}
                          />
                        </TableCell> */}
                        <TableCell className="font-medium">
                          {cat?.categoryname}
                        </TableCell>
                        <TableCell>
                        <Badge className="text-primary-foreground" variant={cat?.status ? "secondary" : "destructive"}>
                          {cat?.status ? "Active" : "Inactive"}
                        </Badge>

                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                        {cat?.productcount}
                        </TableCell>
                        {/* <TableCell className="hidden md:table-cell">
                          {cat.productcount}
                        </TableCell> */}
                        <TableCell className="hidden md:table-cell">
                          {cat?.createdat}
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
                              <DropdownMenuItem onClick={() => handleEditCategory(cat)}>
                                Edit Category
                              </DropdownMenuItem>
                              <DropdownMenuItem>Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
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

        {/* Edit Category Sheet */}
        <Sheet open={isEditSheetOpen} onOpenChange={setIsEditSheetOpen}>
          <SheetContent className="w-[400px] sm:w-[540px]">
            <SheetHeader>
              <SheetTitle>Edit Category</SheetTitle>
              <SheetDescription>
                Update the category information. Status is optional.
              </SheetDescription>
            </SheetHeader>

            <div className="grid gap-6 py-6">
              {/* Category Name */}
              <div className="grid gap-2">
                <Label htmlFor="edit-name" className="text-sm font-medium">
                  Category Name *
                </Label>
                <Input
                  id="edit-name"
                  name="name"
                  placeholder="Enter category name"
                  value={editFormData.name}
                  onChange={handleEditFormChange}
                  className="w-full"
                />
              </div>

              {/* Category Status */}
              <div className="grid gap-2">
                <Label htmlFor="edit-status" className="text-sm font-medium">
                  Status (Optional)
                </Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="edit-status"
                    checked={editFormData.status}
                    onCheckedChange={handleStatusChange}
                  />
                  <Label htmlFor="edit-status" className="text-sm text-muted-foreground">
                    {editFormData.status ? 'Active' : 'Inactive'}
                  </Label>
                </div>
                <p className="text-xs text-muted-foreground">
                  Toggle to set the category as active or inactive
                </p>
              </div>

              {/* Current Category Info */}
              {editingCategory && (
                <div className="grid gap-2 p-4 bg-muted rounded-lg">
                  <h4 className="text-sm font-medium">Current Information</h4>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p><strong>ID:</strong> {editingCategory.categoryId || editingCategory.categoryid || editingCategory.id || editingCategory._id || 'Not found'}</p>
                    <p><strong>Current Name:</strong> {editingCategory.categoryname || editingCategory.categoryName || editingCategory.name || 'Not found'}</p>
                    <p><strong>Current Status:</strong> {editingCategory.status ? 'Active' : 'Inactive'}</p>
                    <p><strong>Product Count:</strong> {editingCategory.productcount || editingCategory.productCount || 0}</p>
                  </div>
                </div>
              )}
            </div>

            <SheetFooter className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleCloseEditSheet}
                disabled={editLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdateCategory}
                disabled={editLoading || !editFormData.name.trim()}
              >
                {editLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Updating...
                  </div>
                ) : (
                  "Update Category"
                )}
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </main>
    </Layout>
  );
};

export default Page;
