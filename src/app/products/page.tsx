
"use client"
import Image from "next/image"
import {
  File,
  MoreHorizontal,
  PlusCircle,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
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
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
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
import Layout from "../Layouts/Layout"
import SelectCategories from "../Layouts/SelectCategories"
import { Textarea } from "@/components/ui/textarea"
import { useState,useEffect } from "react"
import { Message, Upload } from '@arco-design/web-react';
import { toast } from "@/components/ui/use-toast"
import { Pagination } from "@/components/ui/pagination";

interface Category {
  [x: string]: any;
  categoryId: string;
  categoryName: string;
  productCount: number;
  createdAt: string;
}

interface Product {
    [x: string]: any,
    status: boolean,
    productId: string,
    productName: string,
    categoryId: string,
    createdAt: string,
    categoryName: string,
    images: [string],
    price: number,
    totalStock: number,
    description: string,
    howtouse: string,
    ingredients: string,
    benefits: string,
}

// Remove this interface since we'll use string[] for image URLs

// interface postProduct {
// 	name:string,
// 	description:string,
// 	price:number,
// 	categoryId:string,
// 	images:[string],
// 	totalStock:number
// }





function Page() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [prodcuts, setProducts] = useState<Product[]>([]);
  const [isUploading, setUploading] = useState(false);
  const [imgUrls, setImageUrls] = useState<string[]>([]);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [postProduct, setPostProduct] = useState(
    {
      productName:"",
      description:"",
      price:0,
      images:[""],
      howtouse:"",
      ingredients: "",
      benefits: "",
      totalStock:0,
      categoryId: ""
    }
  );
  const [loading, setloading] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [originalProduct, setOriginalProduct] = useState<any>(null);
  const getAllCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/category?type=all`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      console.log("🚀 ~ getAllCategories ~ data:", data)
      setCategories(data.categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
   
    } finally {
      // setLoading(false);
    }
  };
  const getAllProduct = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product?page=${currentPage}&limit=${pageSize}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      console.log("🚀 ~ getAllProduct ~ data:", data)
      console.log("🚀 ~ getAllProduct ~ products array:", data?.data);

      if (data?.data && data.data.length > 0) {
        console.log("🚀 ~ getAllProduct ~ first product:", data.data[0]);
        console.log("🚀 ~ getAllProduct ~ first product name:", data.data[0].productName);
      }

      // Add null checks to prevent undefined errors
      setProducts(data?.data || []);
      setTotalPages(data?.pagination?.totalPages || 1);
      setTotalItems(data?.pagination?.totalItems || 0);
    } catch (error) {
      console.error("Error fetching products:", error);
      // Set empty array on error to prevent undefined issues
      setProducts([]);
      setTotalPages(1);
      setTotalItems(0);
    } finally {
      // setLoading(false);
    }
  };
  useEffect(() => {
    console.log("🚀 ~ useEffect ~ Loading products...");
    getAllProduct();
    getAllCategories();
  }, [currentPage, pageSize]);

  // Debug products state changes
  useEffect(() => {
    console.log("🚀 ~ Products state changed:", prodcuts);
    console.log("🚀 ~ Products count:", prodcuts?.length);
    if (prodcuts && prodcuts.length > 0) {
      console.log("🚀 ~ First product in state:", prodcuts[0]);
    }
  }, [prodcuts]);

  // Ensure form is properly initialized
  useEffect(() => {
    if (!postProduct.productName) {
      setPostProduct(prev => ({
        ...prev,
        productName: "",
        description: "",
        howtouse: "",
        ingredients: "",
        benefits: ""
      }));
    }
  }, []);


  const handleImageChange = async (e: any) => {
    if (isUploading) return; // Prevent multiple uploads
    setUploading(true);

    const token = localStorage.getItem("token");
    const form = new FormData();
    console.log("🚀 ~ handleImageChange ~ e:", e);

    if (e && e['originFile']) {
      form.append("image", e['originFile']);

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product/image`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: form
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Fix: Store image URLs as strings, not objects
        setImageUrls((prev) => {
          const updatedUrls = [...prev, data.results.url];
          console.log("🚀 ~ handleImageChange ~ updatedUrls:", updatedUrls);
          return updatedUrls;
        });

        console.log("🚀 ~ handleImageChange ~ data:", data);
      } catch (error) {
        console.error("Error during file upload:", error);
        toast({
          title: "Upload failed",
          description: "Failed to upload image. Please try again.",
          variant: "destructive"
        });
      } finally {
        setUploading(false); // Reset the flag after upload completes
      }
    } else {
      setUploading(false); // Reset the flag if there's no valid file
    }
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Convert numeric fields to numbers
    let processedValue: string | number = value;
    if (name === 'price' || name === 'totalStock') {
      processedValue = value === '' ? 0 : Number(value);
    }

    setPostProduct(prev => ({
      ...prev,
      [name]: processedValue
    }));
    console.log("🚀 ~ handleValueChange ~ setPostProduct:", {
      ...postProduct,
      [name]: processedValue
    });
  };

  const validateForm = () => {
    const errors = [];

    if (!postProduct.productName || !postProduct.productName.trim()) {
      errors.push("Product name is required");
    }
    if (!postProduct.categoryId) {
      errors.push("Please select a category");
    }
    if (!postProduct.price || postProduct.price <= 0) {
      errors.push("Please enter a valid price");
    }
    if (!postProduct.totalStock || postProduct.totalStock <= 0) {
      errors.push("Please enter a valid stock quantity");
    }
    if (!postProduct.description || !postProduct.description.trim()) {
      errors.push("Product description is required");
    }
    if (!imgUrls || imgUrls.length === 0) {
      errors.push("Please upload at least one product image");
    }

    return errors;
  };

  const createProduct = async (e: any) => {
    e.preventDefault()

    // Validate form before submission
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      toast({
        title: "Validation Error",
        description: validationErrors.join(", "),
        variant: "destructive"
      });
      return;
    }

    setloading(true)
    const token = localStorage.getItem("token");

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({...postProduct, images: imgUrls})
    };

    try {
      const create = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product`, options);
      const data = await create.json();

      if(data.status){
        toast({
          title: "Product created",
          description: data.message,
        });
        await getAllProduct();
        setIsSheetOpen(false);
        // Reset form after successful creation
        resetForm();
      } else {
        toast({
          title: "Failed to create product",
          description: data.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while creating the product",
        variant: "destructive"
      });
    } finally {
      setloading(false);
    }
  }
  
  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const resetForm = () => {
    setPostProduct({
      productName: "",
      description: "",
      price: 0,
      images: [""],
      howtouse: "",
      ingredients: "",
      benefits: "",
      totalStock: 0,
      categoryId: ""
    });
    setImageUrls([]);
    setIsEditing(false);
    setEditingProductId(null);
    setOriginalProduct(null);
  };

  const updateProduct = async (e: any) => {
    try {
      e.preventDefault();
      console.log("🚀 ~ updateProduct ~ Starting update process");

      // Get only the changed fields
      const changedFields = getChangedFields();
      console.log("🚀 ~ updateProduct ~ changedFields:", changedFields);
      console.log("🚀 ~ updateProduct ~ editingProductId:", editingProductId);
      console.log("🚀 ~ updateProduct ~ originalProduct:", originalProduct);
      console.log("🚀 ~ updateProduct ~ postProduct:", postProduct);

      // Check if there are any changes
      if (Object.keys(changedFields).length === 0) {
        toast({
          title: "No changes detected",
          description: "Please make some changes before updating the product.",
          variant: "default"
        });
        return;
      }

      // Validate form before submission
      const validationErrors = validateForm();
      if (validationErrors.length > 0) {
        toast({
          title: "Validation Error",
          description: validationErrors.join(", "),
          variant: "destructive"
        });
        return;
      }

      // Check if editingProductId exists
      if (!editingProductId) {
        console.error("🚀 ~ updateProduct ~ editingProductId is missing");
        toast({
          title: "Error",
          description: "Product ID is missing. Please try again.",
          variant: "destructive"
        });
        return;
      }

      setloading(true);
      const token = localStorage.getItem("token");
      console.log("🚀 ~ updateProduct ~ token exists:", !!token);

      // Only send changed fields + productId
      const updatePayload = {
        ...changedFields,
        productId: editingProductId
      };

      console.log("🚀 ~ updateProduct ~ Final payload:", updatePayload);

      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/product/update/${editingProductId}`;
      console.log("🚀 ~ updateProduct ~ API URL:", apiUrl);
      console.log("🚀 ~ updateProduct ~ Environment API URL:", process.env.NEXT_PUBLIC_API_URL);

      const options = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updatePayload)
      };

      console.log("🚀 ~ updateProduct ~ Request options:", options);
      console.log("🚀 ~ updateProduct ~ About to make fetch request...");

      const response = await fetch(apiUrl, options);
      console.log("🚀 ~ updateProduct ~ Response received:", response);
      console.log("🚀 ~ updateProduct ~ Response status:", response.status);
      console.log("🚀 ~ updateProduct ~ Response ok:", response.ok);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("🚀 ~ updateProduct ~ Response data:", data);

      if (data.status) {
        toast({
          title: "Product updated",
          description: data.message || "Product updated successfully",
        });
        await getAllProduct();
        setIsSheetOpen(false);
        resetForm();
      } else {
        toast({
          title: "Failed to update product",
          description: data.message || "Unknown error occurred",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("🚀 ~ updateProduct ~ Error caught:", error);
      console.error("🚀 ~ updateProduct ~ Error stack:", error instanceof Error ? error.stack : 'No stack trace');
      toast({
        title: "Error",
        description: `An error occurred while updating the product: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
      });
    } finally {
      console.log("🚀 ~ updateProduct ~ Finally block - setting loading to false");
      setloading(false);
    }
  };

  // Function to get only changed fields
  const getChangedFields = () => {
    console.log("🚀 ~ getChangedFields ~ originalProduct:", originalProduct);
    console.log("🚀 ~ getChangedFields ~ postProduct:", postProduct);

    if (!originalProduct) {
      console.log("🚀 ~ getChangedFields ~ No original product, returning all fields");
      return postProduct;
    }

    const changes: any = {};

    // Compare each field and only include changed ones
    if (postProduct.productName !== originalProduct.productName) {
      console.log("🚀 ~ getChangedFields ~ Name changed:", originalProduct.productName, "->", postProduct.productName);
      changes.productName = postProduct.productName;
    }
    if (postProduct.description !== originalProduct.description) {
      console.log("🚀 ~ getChangedFields ~ Description changed");
      changes.description = postProduct.description;
    }
    if (postProduct.price !== originalProduct.price) {
      console.log("🚀 ~ getChangedFields ~ Price changed:", originalProduct.price, "->", postProduct.price);
      changes.price = postProduct.price;
    }
    if (postProduct.howtouse !== originalProduct.howtouse) {
      console.log("🚀 ~ getChangedFields ~ How to use changed");
      changes.howtouse = postProduct.howtouse;
    }
    if (postProduct.ingredients !== originalProduct.ingredients) {
      console.log("🚀 ~ getChangedFields ~ Ingredients changed");
      changes.ingredients = postProduct.ingredients;
    }
    if (postProduct.benefits !== originalProduct.benefits) {
      console.log("🚀 ~ getChangedFields ~ Benefits changed");
      changes.benefits = postProduct.benefits;
    }
    if (postProduct.totalStock !== originalProduct.totalStock) {
      console.log("🚀 ~ getChangedFields ~ Stock changed:", originalProduct.totalStock, "->", postProduct.totalStock);
      changes.totalStock = postProduct.totalStock;
    }
    if (postProduct.categoryId !== originalProduct.categoryId) {
      console.log("🚀 ~ getChangedFields ~ Category changed:", originalProduct.categoryId, "->", postProduct.categoryId);
      changes.categoryId = postProduct.categoryId;
    }

    // Check if images have changed
    const originalImages = originalProduct.images || [];
    const currentImages = imgUrls || [];
    console.log("🚀 ~ getChangedFields ~ Original images:", originalImages);
    console.log("🚀 ~ getChangedFields ~ Current images:", currentImages);

    if (JSON.stringify(originalImages.sort()) !== JSON.stringify(currentImages.sort())) {
      console.log("🚀 ~ getChangedFields ~ Images changed");
      changes.images = imgUrls;
    }

    console.log("🚀 ~ getChangedFields ~ Final changes:", changes);
    return changes;
  };

  const handleEdit = (product: Product) => {
    console.log("🚀 ~ handleEdit ~ product:", product);
    console.log("🚀 ~ handleEdit ~ product.productId:", product.productId);

    setIsEditing(true);
    setEditingProductId(product.productId);

    // Store original product data for comparisons
    const originalProductData = {
      productName: product.productName || "",
      description: product.description || "",
      price: product.price || 0,
      images: product.images || [],
      howtouse: product.howtouse || "",
      ingredients: product.ingredients || "",
      benefits: product.benefits || "",
      totalStock: product.totalStock || 0,
      categoryId: product.categoryId || ""
    };

    console.log("🚀 ~ handleEdit ~ originalProductData:", originalProductData);

    setOriginalProduct(originalProductData);
    setPostProduct(originalProductData);
    setImageUrls(product.images || []);
    setIsSheetOpen(true);
  };

  const handleSubmit = (e: any) => {
    if (isEditing) {
      updateProduct(e);
    } else {
      createProduct(e);
    }
  };

  const handleSheetClose = () => {
    setIsSheetOpen(false);
    resetForm();
  };

  const deleteProduct = async (productId: string) => {
    try {
      console.log("🚀 ~ deleteProduct ~ productId:", productId);

      const token = localStorage.getItem("token");
      console.log("🚀 ~ deleteProduct ~ token exists:", !!token);

      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/product/delete/${productId}`;
      console.log("🚀 ~ deleteProduct ~ API URL:", apiUrl);

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log("🚀 ~ deleteProduct ~ Response received:", response);
      console.log("🚀 ~ deleteProduct ~ Response status:", response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("🚀 ~ deleteProduct ~ Response data:", data);

      if (data.status) {
        toast({
          title: "Product deleted",
          description: data.message || "Product deleted successfully",
        });
        // Refresh the products list
        await getAllProduct();
      } else {
        toast({
          title: "Failed to delete product",
          description: data.message || "Unknown error occurred",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("🚀 ~ deleteProduct ~ Error caught:", error);
      toast({
        title: "Error",
        description: `An error occurred while deleting the product: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
      });
    }
  };

  const handleDeleteProduct = (product: Product) => {
    // Show confirmation dialog before deleting
    if (window.confirm(`Are you sure you want to delete "${product.productName}"? This action cannot be undone.`)) {
      deleteProduct(product.productId);
    }
  };

  const handleAddProduct = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    resetForm();
    setIsSheetOpen(true);
  };

  return (
    <Layout>
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
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
               
                  <div className="ml-auto flex items-center gap-2">
            
                <Button size="sm" variant="outline" className="h-8 gap-1">
                  <File className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Export
                  </span>
                </Button>
                {/* <Button size="sm" className="h-8 gap-1">
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Add Category
                  </span>
                </Button> */}
                <Button
                  size="sm"
                  className="h-8 gap-1"
                  onClick={handleAddProduct}
                  type="button"
                >
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Add Product
                  </span>
                </Button>

                <Sheet open={isSheetOpen} onOpenChange={handleSheetClose}>
                <SheetContent className="w-full sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl overflow-y-auto max-h-screen">
                  <SheetHeader className="sticky top-0 bg-background z-10 pb-4">
                    <SheetTitle>{isEditing ? "Edit Product" : "Create Product"}</SheetTitle>
                    <SheetDescription>
                      {isEditing ? "Update your product details here." : "Add a new product to your store."}
                    </SheetDescription>
                  </SheetHeader>
                  <div className="grid gap-4 py-4 pb-20">
                    {/* <div className="grid grid-cols-4 items-center gap-4 justify-start" > 
                    </div> */}
                    <div className="space-y-2">
                      <p className="text-left font-bold text-sm">
                        Category *
                        {isEditing && originalProduct && postProduct.categoryId !== originalProduct.categoryId && (
                          <span className="ml-2 text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">Modified</span>
                        )}
                      </p>
                        <SelectCategories
                          value={postProduct.categoryId}
                          onChange={(e) => {
                            setPostProduct(prev => ({
                              ...prev,
                              categoryId: e,
                            }));
                            console.log("Selected category ID:", e);
                        }} />
                    </div>

                    <div className="space-y-2">
                      <p className="text-left font-bold text-sm">
                        Product Name *
                        {isEditing && originalProduct && postProduct.productName !== originalProduct.productName && (
                          <span className="ml-2 text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">Modified</span>
                        )}
                      </p>
                      <Input
                        name="productName"
                        placeholder="Enter product name"
                        id="productName"
                        className="w-full"
                        value={postProduct.productName}
                        onChange={handleValueChange}
                      />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-2" >
                      <div className="flex-1">
                      <p  className="text-left font-bold text-sm mb-2">
                        In stock
                      </p>
                      <Input
                        onChange={handleValueChange}
                        name="totalStock"
                        placeholder="Stock quantity"
                        id="totalStock"
                        className="w-full"
                        value={postProduct.totalStock}
                        type="number"
                      />

                      </div>
                      <div className="flex-1">
                      <p  className="text-left font-bold text-sm mb-2">
                        Price
                      </p>
                      <Input
                        onChange={handleValueChange}
                        name="price"
                        type="number"
                        placeholder="Price"
                        id="price"
                        className="w-full"
                        value={postProduct.price}
                      />
                    </div>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <p className="text-left font-bold text-sm">
                          Product Description *
                        </p>
                        <Textarea
                          onChange={(e) => {
                            const { value } = e.target;
                            setPostProduct(prev => ({
                              ...prev,
                              description: value,
                            }));
                          }}
                          name="description"
                          placeholder="Describe your product..."
                          value={postProduct.description}
                          className="min-h-[80px] resize-none"
                        />
                      </div>

                      <div className="space-y-2">
                        <p className="text-left font-bold text-sm">
                          How to Use
                        </p>
                        <Textarea
                          onChange={(e) => {
                            const { value } = e.target;
                            setPostProduct(prev => ({
                              ...prev,
                              howtouse: value,
                            }));
                          }}
                          name="howtouse"
                          placeholder="Instructions for use..."
                          value={postProduct.howtouse}
                          className="min-h-[60px] resize-none"
                        />
                      </div>

                      <div className="space-y-2">
                        <p className="text-left font-bold text-sm">
                          Ingredients
                        </p>
                        <Textarea
                          onChange={(e) => {
                            const { value } = e.target;
                            setPostProduct(prev => ({
                              ...prev,
                              ingredients: value,
                            }));
                          }}
                          name="ingredients"
                          placeholder="List ingredients..."
                          value={postProduct.ingredients}
                          className="min-h-[60px] resize-none"
                        />
                      </div>

                      <div className="space-y-2">
                        <p className="text-left font-bold text-sm">
                          Benefits
                        </p>
                        <Textarea
                          onChange={(e) => {
                            const { value } = e.target;
                            setPostProduct(prev => ({
                              ...prev,
                              benefits: value,
                            }));
                          }}
                          name="benefits"
                          placeholder="Product benefits..."
                          value={postProduct.benefits}
                          className="min-h-[60px] resize-none"
                        />
                      </div>
                    </div>

                    
                    
                    <div className="space-y-2">
                      <p className="text-left font-bold text-sm">
                        Product Images *
                      </p>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                        <Upload
                          multiple
                          imagePreview
                          defaultFileList={imgUrls.map((url, index) => ({
                            uid: `existing-${index}`,
                            name: `image-${index}`,
                            status: 'done',
                            url: url,
                            response: { url: url }
                          }))}
                          action='/'
                          onChange={(fileList) => console.log(fileList)}
                          onProgress={handleImageChange}
                          listType='picture-card'
                          onPreview={(_file) => {
                            Message.info('Click to preview image')
                          }}
                          className="w-full"
                        />
                      </div>
                    </div>
                  
                    
  
                  </div>
                  <SheetFooter className="sticky bottom-0 bg-background border-t pt-4 mt-4">
                      <Button
                        className="w-full"
                        onClick={handleSubmit}
                        type="submit"
                        disabled={loading}
                      >
                      {loading ? (
                        <div className="flex items-center">
                          <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          {isEditing ? "Updating..." : "Creating..."}
                        </div>
                      ) : isEditing ? "Update Product" : "Create Product"}
                      </Button>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
              </div>
              </div>
            </div>
            <TabsContent value="all">
              <Card x-chunk="dashboard-06-chunk-0">
                <CardHeader>
                  <CardTitle>Products</CardTitle>
                  <CardDescription>
                    Manage your products and view their sales performance.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="hidden w-[100px] sm:table-cell">
                          <span className="sr-only">Image</span>
                        </TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="hidden md:table-cell">
                          Price
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                          In Stock
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                          Created at
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
                      ) : prodcuts.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center">
                            No products found
                          </TableCell>
                        </TableRow>
                      ) : (
                        prodcuts.map((product, index) => {
                          console.log(`🚀 ~ Table render ~ Product ${index}:`, product);
                          console.log(`🚀 ~ Table render ~ Product ${index} name:`, product.productName);
                          return (
                            <TableRow key={product.productId || index}>
                              <TableCell className="hidden sm:table-cell">
                                <Image
                                  alt="Product image"
                                  className="aspect-square  rounded-xl object-cover"
                                  height="64"
                                  src={product.images?.[0] || '/placeholder-image.jpg'}
                                  width="64"
                                />
                                 {/* <AvatarGroup
                                  size={32}
                                  style={{ margin: 10 }}
                                >
                                    <div className="flex">
                                  {
                                      product.images.map(img => {
                                        return (
                                          <Avatar style={{backgroundColor: '#7BC616'}}>
                                                <Image
                                                  alt="Product image"
                                                  className="aspect-square rounded-md object-cover"
                                                  height="64"
                                                  src={img}
                                                  width="64"
                                                />
                                          // </Avatar>
                                        )
                                      })
                                    }
                                    </div>


                                </AvatarGroup> */}
                              </TableCell>
                              <TableCell className="font-medium">
                                {product.productName || 'No name available'}
                              </TableCell>
                              <TableCell>
                              <Badge className="text-primary-foreground" variant={product.status ? "secondary" : "destructive"}>
                          {product.status ? "Active" : "Inactive"}
                        </Badge>
                              </TableCell>
                              <TableCell className="hidden md:table-cell">
                                {product.price}
                              </TableCell>
                              <TableCell className="hidden md:table-cell">
                               {product.totalStock}
                              </TableCell>
                              <TableCell className="hidden md:table-cell">
                                {product.createdAt}
                              </TableCell>
                              <TableCell>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      aria-haspopup="true"
                                      size="icon"
                                      variant="ghost"
                                    >
                                      <MoreHorizontal className="h-4 w-4" />
                                      <span className="sr-only">Toggle menu</span>
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuItem onClick={() => handleEdit(product)}>
                                      Edit Product
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => handleDeleteProduct(product)}
                                      className="text-red-600 focus:text-red-600"
                                    >
                                      Delete Product
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          )
                        })
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
  )
}

// export default withAuth(Page)
export default Page
