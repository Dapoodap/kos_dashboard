"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Check, Home, Users, CreditCard, BarChart3 } from "lucide-react"

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false)

  const features = [
    {
      icon: Home,
      title: "Manajemen Kamar",
      description: "Kelola kamar, status okupansi, dan harga dengan mudah",
    },
    {
      icon: Users,
      title: "Kelola Penghuni",
      description: "Atur data penghuni dan kontrak dengan sistem yang terorganisir",
    },
    {
      icon: CreditCard,
      title: "Tracking Pembayaran",
      description: "Pantau pembayaran sewa dan cicilan dengan real-time",
    },
    {
      icon: BarChart3,
      title: "Dashboard Analytics",
      description: "Lihat laporan pendapatan dan okupansi dalam satu dashboard",
    },
  ]

  const pricing = [
    {
      name: "Starter",
      price: "Gratis",
      description: "Untuk kos kecil",
      features: ["Hingga 10 kamar", "Manajemen dasar", "Laporan sederhana"],
    },
    {
      name: "Professional",
      price: "Rp 99.000",
      period: "/bulan",
      description: "Untuk kos menengah",
      features: ["Hingga 50 kamar", "Manajemen lengkap", "Laporan detail", "Support prioritas"],
      highlighted: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "Untuk kos besar",
      features: ["Unlimited kamar", "Fitur custom", "Dedicated support", "API access"],
    },
  ]

  const rooms = [
    { id: 1, name: "Kamar Standar", price: "Rp 1.500.000", image: "/kamar-kos-standar.jpg" },
    { id: 2, name: "Kamar Premium", price: "Rp 2.500.000", image: "/kamar-kos-premium.jpg" },
    { id: 3, name: "Kamar Deluxe", price: "Rp 3.500.000", image: "/kamar-kos-deluxe.jpg" },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Home className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl text-primary">KosHub</span>
          </div>
          <div className="flex gap-4">
            <Link href="/login">
              <Button variant="outline">Masuk</Button>
            </Link>
            <Link href="/login">
              <Button className="bg-primary hover:bg-primary/90">Mulai Gratis</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">
              Kelola Kos Anda dengan <span className="text-primary">Mudah & Efisien</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 text-balance">
              Platform all-in-one untuk manajemen kos modern. Kelola kamar, penghuni, dan pembayaran dalam satu tempat.
            </p>
            <div className="flex gap-4">
              <Link href="/login">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  Coba Sekarang
                </Button>
              </Link>
              <Button size="lg" variant="outline">
                Pelajari Lebih Lanjut
              </Button>
            </div>
          </div>
          <div className="bg-secondary rounded-lg h-96 flex items-center justify-center">
            <img src="/dashboard-kos-management.jpg" alt="Dashboard" className="w-full h-full object-cover rounded-lg" />
          </div>
        </div>
      </section>

      {/* Room Preview Section */}
      <section className="bg-secondary/30 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Tipe Kamar Kami</h2>
            <p className="text-muted-foreground text-lg">Pilih kamar yang sesuai dengan kebutuhan Anda</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <Card key={room.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 bg-muted overflow-hidden">
                  <img src={room.image || "/placeholder.svg"} alt={room.name} className="w-full h-full object-cover" />
                </div>
                <CardContent className="pt-6">
                  <h3 className="font-bold text-lg mb-2">{room.name}</h3>
                  <p className="text-primary font-bold text-xl">{room.price}</p>
                  <p className="text-sm text-muted-foreground mt-2">/bulan</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Fitur Unggulan</h2>
            <p className="text-muted-foreground text-lg">Semua yang Anda butuhkan untuk mengelola kos</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => {
              const Icon = feature.icon
              return (
                <Card key={idx} className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-bold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="bg-secondary/30 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Paket Harga</h2>
            <p className="text-muted-foreground text-lg">Pilih paket yang sesuai dengan kebutuhan Anda</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {pricing.map((plan, idx) => (
              <Card key={idx} className={`relative ${plan.highlighted ? "ring-2 ring-primary shadow-lg" : ""}`}>
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-bold">
                    Paling Populer
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
                  </div>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, fidx) => (
                      <li key={fidx} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-primary" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full ${plan.highlighted ? "bg-primary hover:bg-primary/90" : ""}`}
                    variant={plan.highlighted ? "default" : "outline"}
                  >
                    Pilih Paket
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Siap Mengelola Kos Anda?</h2>
          <p className="text-lg mb-8 opacity-90">
            Bergabunglah dengan ratusan pemilik kos yang telah mempercayai KosHub
          </p>
          <Link href="/login">
            <Button size="lg" variant="secondary">
              Mulai Sekarang - Gratis
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary/50 border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Home className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="font-bold text-primary">KosHub</span>
              </div>
              <p className="text-sm text-muted-foreground">Platform manajemen kos modern</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Produk</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground">
                    Fitur
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground">
                    Harga
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground">
                    Keamanan
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Perusahaan</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground">
                    Tentang
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground">
                    Kontak
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground">
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 KosHub. Semua hak dilindungi.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
