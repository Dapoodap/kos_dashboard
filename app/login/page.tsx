"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { loginUser, initializeStorage } from "@/lib/storage"
import { Home } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("admin@kos.com")
  const [password, setPassword] = useState("admin123")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Initialize storage on mount


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

   try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email,
          password: password,
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Login failed')
      }

      // Redirect to login
      router.push('/admin/dashboard')
      
    } catch (err: any) {
      setError(err.message)
    } finally {
      // setLoading(false)
    }}

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Home className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="font-bold text-2xl text-primary">KosHub</span>
        </Link>

        <Card>
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl">Masuk ke KosHub</CardTitle>
            <CardDescription>Masukkan email dan password Anda</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  placeholder="admin@kos.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Password</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              {error && <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg">{error}</div>}

              <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
                {isLoading ? "Memproses..." : "Masuk"}
              </Button>
            </form>

            <div className="mt-6 space-y-3 text-sm">
              <div className="bg-secondary/50 p-3 rounded-lg">
                <p className="font-semibold mb-2">Demo Admin:</p>
                <p>Email: admin@kos.com</p>
                <p>Password: admin123</p>
              </div>
              <div className="bg-secondary/50 p-3 rounded-lg">
                <p className="font-semibold mb-2">Demo Penghuni:</p>
                <p>Email: penghuni@kos.com</p>
                <p>Password: penghuni123</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
