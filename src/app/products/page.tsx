"use client"
import Image from "next/image"
import Link from "next/link"
import {
  File,
  ListFilter,
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
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
import UploadImage from "../Layouts/UploadImage"
import { useState,useEffect, ChangeEvent } from "react"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectLabel, SelectItem } from "@radix-ui/react-select"
import { Avatar, Message, Upload } from '@arco-design/web-react';
import { toast } from "@/components/ui/use-toast"
import { Pagination } from "@/components/ui/pagination";
const AvatarGroup = Avatar.Group;

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
    productid: string,
    productname:string,
    categoryId: string,
    createdAt: string,
    categoryname: string,
    images: [string],
    price:number,
    totalStock:number,
    description:string,
    howtouse:string,
    ingredients: string,
    benefits: string,
}

interface Imgurl  {
  [x: string]: any,
}

// interface postProduct {
// 	name:string,
// 	description:string,
// 	price:number,
// 	categoryId:string,
// 	images:[string],
// 	totalStock:number
// }





function page() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [prodcuts, setProducts] = useState<Product[]>([]);
  const [isUploading, setUploading] = useState(false);
  const [imgUrls, setImageUrls] = useState<Imgurl[]>([]);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [postProduct, setPostProduct] = useState(
    {
      name:"",
      description:"",
      price:0,
      images:[""],
      howtouse:"",
      ingredients: "",
      benefits: "",
      totalStock:0
    }
  );
  const [loading, setloading] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
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
    
      setProducts(data.data);
      setTotalPages(data.pagination.totalPages);
      setTotalItems(data.pagination.totalItems);
    } catch (error) {
      
   
    } finally {
      // setLoading(false);
    }
  };
  useEffect(() => {
    getAllProduct();
    getAllCategories();
  }, [currentPage, pageSize]);


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

        setImageUrls((prev) => {
          const updatedUrls = [...prev, data.results.url];
          console.log("🚀 ~ handleImageChange ~ updatedUrls:", updatedUrls);
          return updatedUrls;
        });

        console.log("🚀 ~ handleImageChange ~ data:", data);
      } catch (error) {
        console.error("Error during file upload:", error);
      } finally {
        // setLoading(false);
        setUploading(false); // Reset the flag after upload completes
      }
    } else {
      setUploading(false); // Reset the flag if there's no valid file
    }
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPostProduct(prev => ({
      ...prev,
      [name]: value
    }));
    console.log("🚀 ~ handleValueChange ~ setPostProduct:", postProduct)

    
  };

  const createProduct = async (e: any) => {
    e.preventDefault()
    setloading(true)
    const token = localStorage.getItem("token");
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({...postProduct,images:imgUrls})
    };
    
   const create = await  fetch(`${process.env.NEXT_PUBLIC_API_URL}/product`, options)
    const data = await create.json()
    if(data.status){
      toast({
        title: "product created",
        description: data.message,
      });
     await getAllProduct();
     setIsSheetOpen(false);
      setloading(false)
      return;
    }
    toast({
      title: "fail to create product",
      description: data.message,
      variant:"destructive"
    });
    setloading(false)
    
  }
  
  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
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
                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetTrigger asChild >
                <Button size="sm" className="h-8 gap-1"  onClick={() => setIsSheetOpen(true)}>
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Add Product
                  </span>
                </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>create product</SheetTitle>
                    <SheetDescription>
                      Make changes to your product here. Click save when you're done.
                    </SheetDescription>
                  </SheetHeader>
                  <div className="grid gap-4 py-4 ">
                    {/* <div className="grid grid-cols-4 items-center gap-4 justify-start" > 
                    </div> */}
                    <div className="">
                      <p className="text-left font-bold text-sm ">
                        categories
                      </p>

                        <SelectCategories onChange={(e) => {
                            setPostProduct(prev => ({
                              ...prev,
                              categoryId:e,
                            }));
                        }  } />

                    </div>
                    <div >
                      <p  className="text-left font-bold text-sm ">
                        name
                      </p>
                      <Input name="name" placeholder="product name" id="name" className="col-span-1"  onChange={handleValueChange}/>
                    </div>
                    <div className="flex gap-x-2" >
                      <div className="">
                      <p  className="text-left font-bold text-sm ">
                        In stock
                      </p>
                      <Input onChange={handleValueChange}  name="totalStock" placeholder="how many are in stock ?" id="name" className="col-span-1" />

                      </div>
                      <div >
                      <p  className="text-left font-bold text-sm ">
                        Price
                      </p>
                      <Input onChange={handleValueChange} name="price"  type="number" placeholder="how much ?" id="name" className="col-span-1" />
                    </div>
                    </div>
                    <div className="">
                      <p  className="text-left font-bold text-sm ">
                          product descpritions
                        </p>
                        <Textarea
                          onChange={(e) => {
                            const { value } = e.target;
                            console.log(value)
                            setPostProduct(prev => ({
                              ...prev,
                              description: value,
                            }));
                          }}
                          name="description"
                          placeholder="Type product descriptions here."
                        />
                      <p  className="text-left font-bold text-sm ">
                         how to use
                        </p>
                        <Textarea
                          onChange={(e) => {
                            const { value } = e.target;
                            console.log(value)
                            setPostProduct(prev => ({
                              ...prev,
                              howtouse: value,
                            }));
                          }}
                          name="description"
                          placeholder="Type how to use product here."
                        />
                      <p  className="text-left font-bold text-sm ">
                         Ingredients
                        </p>
                        <Textarea
                          onChange={(e) => {
                            const { value } = e.target;
                            console.log(value)
                            setPostProduct(prev => ({
                              ...prev,
                              ingredients: value,
                            }));
                          }}
                          name="description"
                          placeholder="Type product ingredients here."
                        />
                      <p  className="text-left font-bold text-sm ">
                      benefits
                        </p>
                        <Textarea
                          onChange={(e) => {
                            const { value } = e.target;
                            console.log(value)
                            setPostProduct(prev => ({
                              ...prev,
                              benefits: value,
                            }));
                          }}
                          name="description"
                          placeholder="Type product benefits here."
                        />

                    </div>

                    
                    
                    <div>
                    <div>
                      <p className="text-left font-bold text-sm ">
                        Upload Pictures
                      </p>

                      <Upload
        multiple
        imagePreview
        defaultFileList={[
        ]}
        action='/'
        onChange={(fileList) => console.log(fileList)}
        onProgress={handleImageChange}
        listType='picture-card'
        onPreview={(file) => {
          Message.info('click preview icon')
        }}
      />

                       <div>
                        <br/>
   
    </div>
                    </div>
                    
                    </div>
                  
                    
  
                  </div>
                  <SheetFooter>
                    <SheetClose asChild>
                      <Button className="w-full" onClick={createProduct} type="submit">
                      {loading ? (
                <svg className="bg-white animate-spin h-5 w-5 mr-3 ..." viewBox="0 0 24 24">
              
              </svg>
              ) : "Submint"}
                      </Button>
                    </SheetClose>
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
                        prodcuts.map(product => {
                          return (
                            <TableRow>
                              <TableCell className="hidden sm:table-cell">
                                <Image
                                  alt="Product image"
                                  className="aspect-square  rounded-xl object-cover"
                                  height="64"
                                  src={product.images[0]}
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
                                {product.productname}
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
                                    <DropdownMenuItem>
                                    <Link href={`/products/${product.productid}`}>Edit Product</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>Delete</DropdownMenuItem>
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

// export default withAuth(page)
export default page
