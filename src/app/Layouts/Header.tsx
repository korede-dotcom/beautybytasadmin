"use client"
import * as React from "react"
import { usePathname } from 'next/navigation'
import Image from "next/image"
import Link from "next/link"

import {
  Home,
  LineChart,
  Package,
  Package2,
  PanelLeft,
  Search,
  Settings,
  ShoppingCart,
  Users2
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { RectangleEllipsis } from 'lucide-react';
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import ModeToggle from "./ModeToggle"


function Header() {
  const pathname = usePathname();

  const linkClasses = (path: string) => {
    return `flex items-center gap-4 px-2.5 transition-colors ${
      pathname === path ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
    }`;
  };

  return (
    <header className="sticky top-90 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="sm:hidden">
            <PanelLeft className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="sm:max-w-xs">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              href="/dashboard"
              className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
            >
              <Package2 className="h-5 w-5 transition-all group-hover:scale-110" />
              <Image
            src="/logo.svg"
            alt="Image"
            width="920"
            height="80"
            className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
          />
              <span className="sr-only">Acme Inc</span>
            </Link>
            <Link
              href="/dashboard"
              className={linkClasses('/dashboard')}
            >
              <Home className="h-5 w-5" />
              Dashboard
            </Link>
            <Link
              href="/category"
              className={linkClasses('/orders')}
            >
              <RectangleEllipsis className="h-5 w-5" />
              Caategory
            </Link>
            <Link
              href="/products"
              className={linkClasses('/products')}
            >
              <Package className="h-5 w-5" />
              Products
            </Link>
            <Link
              href="/orders"
              className={linkClasses('/orders')}
            >
              <ShoppingCart className="h-5 w-5" />
              Orders
            </Link>
            <Link
              href="/customers"
              className={linkClasses('/customers')}
            >
              <Users2 className="h-5 w-5" />
              Customers
            </Link>
            <Link
              href="/analytics"
              className={linkClasses('/analytics')}
            >
              <LineChart className="h-5 w-5" />
              Analytics
            </Link>
            <Link
              href="/settings"
              className={linkClasses('/settings')}
            >
              <Settings className="h-5 w-5" />
              Settings
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
      <div className="relative ml-auto flex-1 md:grow-0">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search..."
          className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
        />
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="overflow-hidden rounded-full border border-primary"
          >
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>BTY</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuItem>Support</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ModeToggle/>
    </header>
  )
}

export default Header
