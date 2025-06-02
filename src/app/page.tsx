"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BorderBeam } from "@/components/magicui/border-beam";
import SparklesText from "@/components/magicui/sparkles-text";
import { useState, ChangeEvent, FormEvent } from "react";
import { toast } from "@/components/ui/use-toast";

export default function Dashboard() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
      console.log("🚀 ~ handleChange ~ formData:", formData)
    
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault(); // Prevent form from submitting the default way
    setLoading(true)
    // const options = {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json', 'User-Agent': 'insomnia/9.1.0' },
    //   body: JSON.stringify(formData),
    // };
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
     
        body: JSON.stringify(formData),
      }
    );
      const loginDetails = await response.json();

      if (loginDetails.token) {
        localStorage.setItem('token', loginDetails.token);
        toast({
          title: "Welcome Admin.",
          description: "You will now have access to the admin portal",
        });
        setLoading(false)
        window.location.assign("/dashboard");
      } else {
        toast({
          title: "Login failed.",
          description: loginDetails.message,
          variant:"destructive"
        });
        setLoading(false)
        setError('Invalid credentials');
      }
    } catch (err) {
      setLoading(false)
      setError('An error occurred during login');
      console.error("Login error:", err);
    }
  };

  console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);

  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex items-center justify-center py-12">
        <form className="mx-auto grid w-[350px] gap-9" onSubmit={handleLogin}>
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">
              <p>Login</p>
            </h1>
            <SparklesText text="welcome back" className="text-[1rem] font-light" />
          </div>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                required
                value={formData.email}
                onChange={handleChange}
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
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <Button type="submit" className="w-full">
         
              {loading ? (
                <svg className="bg-white animate-spin h-5 w-5 mr-3 ..." viewBox="0 0 24 24">
              
              </svg>
              ) : "Login"}
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Don't have an account?{" "}
            <Link href="#" className="underline">
              Sign up
            </Link>
          </div>
        </form>
      </div>
      <div className="hidden bg-primary lg:block h-screen">
        <BorderBeam size={300} />
        <Image
          src="/logo.svg"
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
