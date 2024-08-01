"use client"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BorderBeam } from "@/components/magicui/border-beam";
import ShineBorder from "@/components/magicui/shine-border";
import SparklesText from "@/components/magicui/sparkles-text";
import ShinyButton from "@/components/magicui/shiny-button";
// import { useAuth } from '../auth-context'; // Adjust the import path as necessary
import { redirect } from "next/navigation";
import { useEffect, useState } from "react"

export default function Dashboard() {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  // const router = useRouter();


  const handleLogin = () => {
    // Dummy authentication logic (replace with actual logic)
    if (username === 'user' && password === 'password') {
      sessionStorage.setItem('isAuthenticated', 'true'); // Save authentication state in sessionStorage
      // router.push('/dashboard'); // Redirect to dashboard after login
      redirect("/dashboard");
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-9">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">
              <p>Login</p>
              
            </h1>
            <SparklesText text="welcome back" className="text-[1rem] font-light"  />
            {/* <p className="text-balance text-muted-foreground">
              welcome back
            </p> */}
          </div>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/forgot-password"
                  className="ml-auto inline-block text-sm underline"
                >
                  Forgot your password?
                </Link>
              </div>
              <Input id="password" type="password" required />
            </div>
            <ShinyButton text="Login" className="bg-white" />
            {/* <Button onClick={handleLogin} type="submit" className="w-full">
              Login
            </Button> */}
            {/* <Button variant="outline" className="w-full">
              Login with Google
            </Button> */}
          </div>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="#" className="underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden bg-primary lg:block h-screen">
      {/* <div className="relative h-[200px] w-[200px] rounded-xl"> */}
      <BorderBeam size={300} />
    {/* </div> */}

      <Image
        src="/logo.svg"
        alt="Image"
        width="1920"
        height="1080"
        className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
      />
      </div>
    </div>
  )
}
