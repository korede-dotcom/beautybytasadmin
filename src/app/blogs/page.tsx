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
  SquarePlus,
  MoreHorizontal
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
  TableCaption,
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
import { Textarea } from '@/components/ui/textarea';
import Upload from '@arco-design/web-react/es/Upload/upload';
import Message from '@arco-design/web-react/es/Message';
import { toast } from '@/components/ui/use-toast';

interface Blogs {
    [blogid: string]: any,
    blogtitle: string,
    status: boolean,
    coverimage: string,
    textcontent: string,
    createdat: string,
    updatedat: string
}



function page() {
  const [createBlog,setCreateBlog] = useState({
    title:"",
    textContent:""
  })
  const [isUploading, setUploading] = useState(false);
  const [loading, setloading] = useState(false);
  const [imgUrls, setImageUrls] = useState("");
  const [blog, setBlog] = useState<Blogs[]>([])
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);

  const getAllBlogs = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blogs?page=${currentPage}&limit=${pageSize}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      console.log("🚀 ~ getAllProduct ~ data:", data)
    
      setBlog(data.blogs);
      setTotalPages(data.pagination.totalPages);
      setTotalItems(data.pagination.totalItems);
    } catch (error) {
      throw new Error('Function not implemented.');
   
    } finally {
      // setLoading(false);
    }
  };

  useEffect(() => {
    getAllBlogs();
  }, [currentPage, pageSize]);



  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCreateBlog(prev => ({
      ...prev,
      [name]: value
    }));
    console.log("🚀 ~ handleValueChange ~ setPostBlogs:", createBlog)

    
  };

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

        setImageUrls(data.results.url);

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

  const createBlogs = async (e: any) => {
    e.preventDefault()
    setloading(true)
    console.log("🚀 ~ createBlogs ~ imgUrls:", imgUrls)
    const token = localStorage.getItem("token");
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({...createBlog,coverImage:imgUrls})
    };
    
   const create = await  fetch(`${process.env.NEXT_PUBLIC_API_URL}/blogs`, options)
    const data = await create.json()
    if(data.status){
      toast({
        title: "product created",
        description: data.message,
      });
    //  await getAllProduct();
    //  setIsSheetOpen(false);
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
          <div className="grid gap-3 sm:grid-cols-2 ">
              <h1 className='font-bold text-4xl text-gray-950'>Blogs</h1>
              <div className='sm:justify-self-end grid gap-5 sm:grid-cols-2 lg:grid-cols-1'>
              {/* <DatePickerWithRange />  */}
            {/* <Button type="submit" className="w-full">
              download
            </Button> */}
              </div>
          </div>
          <Tabs defaultValue="create blogs" className="sm:w-[400px]">
            <TabsList>
              <TabsTrigger value="create blogs" className='sm:w-[100px]'>create blogs</TabsTrigger>
              <TabsTrigger value="see blogs" className='sm:w-[100px]'>Blogs</TabsTrigger>
              {/* <TabsTrigger value="Report" className='sm:w-[100px]'>Report</TabsTrigger>
              <TabsTrigger value="Notification" className='sm:w-[100px]'>Notification</TabsTrigger> */}
            </TabsList>
            <TabsContent value="create blogs">

            <div className="grid gap-3 sm:grid-cols-2 ">
                <div className="sm:w-[90vw] grid gap-3 sm:grid-cols-3 ">
                    <div className="sm:grid w-full gap-2">
                      <Badge className='sm:w-[80px]'>Blog title</Badge>
                    <Input onChange={handleValueChange} name="title" placeholder="Title" className='sm:w-[400px]' />
                     
                      {/* <Badge className='sm:w-[80px]'>Image</Badge> */}
                    {/* <Input type="file" placeholder="upload cover image" className='sm:w-[400px]' onChange={handleImageChange} /> */}

                    <Upload className="sm:w-5"
                      // multiple="false"
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

                          <Card className='p-5 sm:w-[70vw] flex-col'>
                              <Textarea
                                placeholder="Type your message here."
                                // value={message}
                                onChange={(e) => {
                                  const { value } = e.target;
                                  console.log(value)
                                  setCreateBlog(prev => ({
                                    ...prev,
                                    textContent: value,
                                  }));
                                }}
                                className="col-span-4 pb-5 h-36"
                              />
                              <div className='pt-5'>
                                <Button onClick={createBlogs}>Post Blog</Button>
                              </div>
                          </Card>
                    </div>
                    {/* <BarCharts/> */}
                    {/* <div className="flex-col">
                        <LineCharts/>
                        <RadialCharts/>
                    </div> */}

              </div>
              </div>
            </TabsContent>
            <TabsContent value="see blogs" className='grid gap-3 sm:grid-cols-2'>
            <div className="grid gap-3 sm:grid-cols-2 ">
               
         

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
                                {blog?.map((blog) => (
                                  <TableRow key={blog?.blogtitle}>
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
                                      {blog?.blogtitle}
                                    </TableCell>
                                    <TableCell>
                                    <Badge className="text-primary-foreground" variant={blog?.status ? "secondary" : "destructive"}>
                                      {blog?.status ? "Active" : "Inactive"}
                                    </Badge>

                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">
                                    {blog?.textcontent}
                                    </TableCell>
                                    {/* <TableCell className="hidden md:table-cell">
                                      {cat.productcount}
                                    </TableCell> */}
                                    <TableCell className="hidden md:table-cell">
                                      {blog?.createdat}
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
                                            <Link href={`/categories/${blog?.categoryId}`}>Edit Category</Link>
                                          </DropdownMenuItem>
                                          <DropdownMenuItem>Delete</DropdownMenuItem>
                                        </DropdownMenuContent>
                                      </DropdownMenu>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                      
                      </div>
                      <div className="pt-4">
                        <Pagination
                          currentPage={currentPage}
                          totalPages={totalPages}
                          onPageChange={handlePageChange}
                          pageSize={pageSize}
                          totalItems={totalItems}
                        />
                      </div>
            </TabsContent>
          
            <TabsContent value="password">Change your password here.</TabsContent>
          </Tabs>
         
      </main>
    </Layout>
  )
}

// export default withAuth(page)
export default page

