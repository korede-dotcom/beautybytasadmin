"use client"
import type React from "react"
import { useState, useEffect } from "react"
import { File, ListFilter, MoreHorizontal } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Layout from "../Layouts/Layout"
import SelectCategories from "../Layouts/SelectCategories"
import { Textarea } from "@/components/ui/textarea"
import UploadImage from "../Layouts/UploadImage"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectLabel, SelectItem } from "@radix-ui/react-select"
import { Avatar, Message, Upload } from '@arco-design/web-react';
import { toast } from "@/components/ui/use-toast"
import { Pagination } from "@/components/ui/pagination";

// Updated interface to match your API response
interface Order {
  id: string
  reference: string
  productId: string
  productName: string
  customerName: string
  amount: number
  userId: string
  quantity: number
  status: string
  createdAt: string
  userEmail: string
  address: string | null
  city: string | null
  state: string | null
  country: string | null
  deliveryStatus: string | null
}

interface ApiResponse {
  status: boolean
  message: string
  data: {
    orders: Order[]
    pagination: {
      totalItems: string
      totalPages: number
      currentPage: number
      itemsPerPage: number
      hasNextPage: boolean
      hasPrevPage: boolean
    }
  }
}

// Mock data for development/testing
const mockApiResponse: ApiResponse = {
  status: true,
  message: "Orders retrieved successfully",
  data: {
    orders: [
      {
        id: "5fb9f765-881f-47db-867a-43e00c925044",
        reference: "8y2iryey8t",
        productId: "3d0bd963-e7ae-4dfc-9732-3f85274e4fc3",
        productName: "face cream",
        customerName: "korede",
        amount: 1000,
        userId: "652aef8b-046f-4168-b8ab-c5a3e4f5d14d",
        quantity: 1,
        status: "success",
        createdAt: "2025-06-03T15:52:04.748Z",
        userEmail: "koredebada@gmail.com",
        address: null,
        city: null,
        state: null,
        country: null,
        deliveryStatus: null,
      },
      {
        id: "773c5a84-6e67-497e-aea1-382161aeaccc",
        reference: "szpivw3oc0",
        productId: "b7d91da2-b3c5-4289-9e93-7919e2123600",
        productName: "lips sticks",
        customerName: "korede",
        amount: 40000,
        userId: "652aef8b-046f-4168-b8ab-c5a3e4f5d14d",
        quantity: 2,
        status: "success",
        createdAt: "2025-06-03T15:45:58.709Z",
        userEmail: "koredebada@gmail.com",
        address: null,
        city: null,
        state: null,
        country: null,
        deliveryStatus: null,
      },
      {
        id: "bf327a89-2107-4ab9-8e03-7e99a42845d0",
        reference: "szpivw3oc0",
        productId: "3d0bd963-e7ae-4dfc-9732-3f85274e4fc3",
        productName: "face cream",
        customerName: "korede",
        amount: 1000,
        userId: "652aef8b-046f-4168-b8ab-c5a3e4f5d14d",
        quantity: 1,
        status: "pending",
        createdAt: "2025-06-03T15:45:58.680Z",
        userEmail: "koredebada@gmail.com",
        address: null,
        city: null,
        state: null,
        country: null,
        deliveryStatus: null,
      },
    ],
    pagination: {
      totalItems: "3",
      totalPages: 1,
      currentPage: 1,
      itemsPerPage: 10,
      hasNextPage: false,
      hasPrevPage: false,
    },
  },
}

const Page: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [totalItems, setTotalItems] = useState<number>(0)
  const [error, setError] = useState<string | null>(null)
  const [usingMockData, setUsingMockData] = useState(false)

  useEffect(() => {
    getAllOrders()
  }, [currentPage, pageSize])

  const getAllOrders = async () => {
    try {
      setLoading(true)
      setError(null)

      const apiUrl = process.env.NEXT_PUBLIC_API_URL

      // Check if API URL is configured
      if (!apiUrl) {
        console.warn("NEXT_PUBLIC_API_URL not configured, using mock data")
        setUsingMockData(true)
        setOrders(mockApiResponse.data.orders)
        setTotalPages(mockApiResponse.data.pagination.totalPages)
        setTotalItems(Number.parseInt(mockApiResponse.data.pagination.totalItems))
        return
      }

      const token = localStorage.getItem("token")
      const fullUrl = `${apiUrl}/orders?page=${currentPage}&limit=${pageSize}`

      console.log("Calling API URL:", fullUrl)

      const response = await fetch(fullUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      })

      console.log("Response status:", response.status)
      console.log("Response URL:", response.url)

      // Check if response is HTML (error page)
      const contentType = response.headers.get("content-type")
      if (contentType && contentType.includes("text/html")) {
        console.error("API returned HTML instead of JSON - endpoint may not exist")
        throw new Error(`API endpoint not found. Expected JSON but got HTML. Status: ${response.status}`)
      }

      if (!response.ok) {
        const errorText = await response.text()
        console.error("API Error Response:", errorText)
        throw new Error(`API Error: ${response.status} - ${errorText}`)
      }

      const data: ApiResponse = await response.json()
      console.log("API Response:", data)

      if (data.status && data.data) {
        setOrders(data.data.orders || [])
        setTotalPages(data.data.pagination.totalPages || 1)
        setTotalItems(Number.parseInt(data.data.pagination.totalItems) || 0)
        setUsingMockData(false)
      } else {
        throw new Error("Invalid API response structure")
      }
    } catch (error) {
      console.error("Error fetching orders:", error)
      setError(error instanceof Error ? error.message : "Unknown error occurred")

      // Fallback to mock data on error
      console.log("Falling back to mock data")
      setUsingMockData(true)
      setOrders(mockApiResponse.data.orders)
      setTotalPages(mockApiResponse.data.pagination.totalPages)
      setTotalItems(Number.parseInt(mockApiResponse.data.pagination.totalItems))
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "NGN",
    }).format(amount / 100)
  }

  return (
    <Layout>
     <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-4xl text-gray-950">Orders</h1>
        {usingMockData && (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Using Mock Data
          </Badge>
        )}
      </div>

      {/* Error Alert */}
      {error && !usingMockData && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <div className="flex">
            <div className="text-red-800">
              <h3 className="font-medium">API Connection Error</h3>
              <p className="text-sm mt-1">{error}</p>
              <p className="text-sm mt-2">
                <strong>Possible solutions:</strong>
              </p>
              <ul className="text-sm mt-1 list-disc list-inside">
                <li>Set NEXT_PUBLIC_API_URL in your .env.local file</li>
                <li>Ensure your backend API server is running</li>
                <li>Check that the /orders endpoint exists</li>
                <li>Verify your authentication token is valid</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      <Tabs defaultValue="all">
        <div className="flex items-center">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="processing">Processing</TabsTrigger>
            <TabsTrigger value="success" className="hidden sm:flex">
              Success
            </TabsTrigger>
          </TabsList>
          <div className="ml-auto flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1">
                  <ListFilter className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Filter</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem checked>Pending</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Processing</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Success</DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button size="sm" variant="outline" className="h-8 gap-1">
              <File className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Export</span>
            </Button>
          </div>
        </div>
        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>Orders</CardTitle>
              <CardDescription>Manage your orders and view their status.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Reference</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead className="hidden md:table-cell">Date</TableHead>
                    <TableHead className="hidden md:table-cell">Status</TableHead>
                    <TableHead className="hidden md:table-cell">Amount</TableHead>
                    <TableHead className="hidden md:table-cell">Quantity</TableHead>
                    <TableHead>
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                          <span className="ml-2">Loading orders...</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : !orders || orders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        <div className="text-gray-500">
                          <p className="text-lg font-medium">No orders found</p>
                          <p className="text-sm">Orders will appear here once customers make purchases.</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.reference}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{order.customerName}</div>
                            <div className="text-sm text-gray-500">{order.userEmail}</div>
                          </div>
                        </TableCell>
                        <TableCell>{order.productName}</TableCell>
                        <TableCell className="hidden md:table-cell">{formatDate(order.createdAt)}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Badge
                            variant={
                              order.status === "success"
                                ? "default"
                                : order.status === "processing"
                                  ? "secondary"
                                  : order.status === "pending"
                                    ? "outline"
                                    : "destructive"
                            }
                          >
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{formatCurrency(order.amount)}</TableCell>
                        <TableCell className="hidden md:table-cell">{order.quantity}</TableCell>
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
                              <DropdownMenuItem>Send Receipt</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Showing {orders.length} of {totalItems} orders
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage <= 1}
                >
                  Previous
                </Button>
                <span className="text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                >
                  Next
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
    </Layout>
  );
};

export default Page; 