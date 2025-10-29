"use client"

import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getRooms, getResidents, getPayments } from "@/lib/storage"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Home, Users, CreditCard, TrendingUp } from "lucide-react"

export default function AdminDashboard() {
  const stats = useMemo(() => {
    const rooms = getRooms()
    const residents = getResidents()
    const payments = getPayments()

    const occupiedRooms = rooms.filter((r) => r.status === "occupied").length
    const totalRevenue = payments.filter((p) => p.status === "paid").reduce((sum, p) => sum + p.amount, 0)
    const pendingPayments = payments.filter((p) => p.status === "pending").length

    return {
      totalRooms: rooms.length,
      occupiedRooms,
      availableRooms: rooms.length - occupiedRooms,
      occupancyRate: rooms.length > 0 ? Math.round((occupiedRooms / rooms.length) * 100) : 0,
      totalResidents: residents.length,
      totalRevenue,
      pendingPayments,
      payments,
    }
  }, [])

  const chartData = useMemo(() => {
    const rooms = getRooms()
    return rooms.map((room) => ({
      name: room.name,
      price: room.price / 1000000,
      status: room.status === "occupied" ? 1 : 0,
    }))
  }, [])

  const paymentStatusData = useMemo(() => {
    const payments = getPayments()
    const paid = payments.filter((p) => p.status === "paid").length
    const pending = payments.filter((p) => p.status === "pending").length
    const overdue = payments.filter((p) => p.status === "overdue").length

    return [
      { name: "Lunas", value: paid, color: "#22c55e" },
      { name: "Pending", value: pending, color: "#f59e0b" },
      { name: "Overdue", value: overdue, color: "#ef4444" },
    ]
  }, [])

  return (
    <div className="p-4 md:p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard Admin</h1>
        <p className="text-muted-foreground">Selamat datang kembali! Berikut ringkasan kos Anda</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Kamar</p>
                <p className="text-3xl font-bold">{stats.totalRooms}</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Home className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Okupansi</p>
                <p className="text-3xl font-bold">{stats.occupancyRate}%</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.occupiedRooms}/{stats.totalRooms} kamar
                </p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Penghuni</p>
                <p className="text-3xl font-bold">{stats.totalResidents}</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Pembayaran Pending</p>
                <p className="text-3xl font-bold">{stats.pendingPayments}</p>
              </div>
              <div className="w-12 h-12 bg-destructive/10 rounded-lg flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Harga Kamar</CardTitle>
            <CardDescription>Daftar harga per kamar</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="price" fill="#22c55e" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status Pembayaran</CardTitle>
            <CardDescription>Distribusi status pembayaran</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={paymentStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {paymentStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Ringkasan Pendapatan</CardTitle>
          <CardDescription>Total pendapatan dari pembayaran yang sudah lunas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-primary">Rp {(stats.totalRevenue / 1000000).toFixed(1)}M</div>
          <p className="text-sm text-muted-foreground mt-2">
            Dari {stats.payments.filter((p) => p.status === "paid").length} pembayaran yang sudah lunas
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
