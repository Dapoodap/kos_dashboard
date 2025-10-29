"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { getPayments, getResidents, getRooms, updatePayment, addPayment } from "@/lib/storage"
import { PaymentCalendar } from "@/components/payment-calendar"
import { Check, Plus } from "lucide-react"

export default function PaymentsPage() {
  const [payments, setPayments] = useState(getPayments())
  const [residents] = useState(getResidents())
  const [rooms] = useState(getRooms())
  const [showForm, setShowForm] = useState(false)
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list")
  const [formData, setFormData] = useState({
    residentId: "",
    roomId: "",
    amount: "",
    dueDate: "",
    status: "pending" as const,
  })

  const handleMarkAsPaid = (id: string) => {
    updatePayment(id, {
      status: "paid",
      paidDate: new Date().toISOString().split("T")[0],
    })
    setPayments(getPayments())
  }

  const handleAddPayment = () => {
    if (formData.residentId && formData.roomId && formData.amount && formData.dueDate) {
      addPayment({
        residentId: formData.residentId,
        roomId: formData.roomId,
        amount: Number.parseInt(formData.amount),
        dueDate: formData.dueDate,
        status: "pending",
      })
      setPayments(getPayments())
      setFormData({
        residentId: "",
        roomId: "",
        amount: "",
        dueDate: "",
        status: "pending",
      })
      setShowForm(false)
    }
  }

  const getResidentName = (id: string) => residents.find((r) => r.id === id)?.name || "Unknown"
  const getRoomName = (id: string) => rooms.find((r) => r.id === id)?.name || "Unknown"

  const stats = useMemo(() => {
    const paid = payments.filter((p) => p.status === "paid").length
    const pending = payments.filter((p) => p.status === "pending").length
    const overdue = payments.filter((p) => p.status === "overdue").length
    const totalRevenue = payments.filter((p) => p.status === "paid").reduce((sum, p) => sum + p.amount, 0)

    return { paid, pending, overdue, totalRevenue }
  }, [payments])

  const calendarPayments = useMemo(() => {
    return payments.map((p) => ({
      ...p,
      residentName: getResidentName(p.residentId),
    }))
  }, [payments])

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Tracking Pembayaran</h1>
          <p className="text-muted-foreground">Kelola pembayaran sewa penghuni</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          Tambah Pembayaran
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Lunas</p>
            <p className="text-3xl font-bold text-primary">{stats.paid}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Pending</p>
            <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Overdue</p>
            <p className="text-3xl font-bold text-destructive">{stats.overdue}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Total Pendapatan</p>
            <p className="text-2xl font-bold text-primary">Rp {(stats.totalRevenue / 1000000).toFixed(1)}M</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-2">
        <Button
          variant={viewMode === "list" ? "default" : "outline"}
          onClick={() => setViewMode("list")}
          className={viewMode === "list" ? "bg-primary hover:bg-primary/90" : ""}
        >
          Tampilan List
        </Button>
        <Button
          variant={viewMode === "calendar" ? "default" : "outline"}
          onClick={() => setViewMode("calendar")}
          className={viewMode === "calendar" ? "bg-primary hover:bg-primary/90" : ""}
        >
          Tampilan Kalender
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Tambah Pembayaran Baru</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Penghuni</label>
                <select
                  value={formData.residentId}
                  onChange={(e) => setFormData({ ...formData, residentId: e.target.value })}
                  className="w-full px-3 py-2 border border-input rounded-lg bg-background"
                >
                  <option value="">Pilih penghuni</option>
                  {residents.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Kamar</label>
                <select
                  value={formData.roomId}
                  onChange={(e) => setFormData({ ...formData, roomId: e.target.value })}
                  className="w-full px-3 py-2 border border-input rounded-lg bg-background"
                >
                  <option value="">Pilih kamar</option>
                  {rooms.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Jumlah (Rp)</label>
                <Input
                  type="number"
                  placeholder="1500000"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Tanggal Jatuh Tempo</label>
                <Input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddPayment} className="bg-primary hover:bg-primary/90">
                Tambah
              </Button>
              <Button onClick={() => setShowForm(false)} variant="outline">
                Batal
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {viewMode === "calendar" ? (
        <PaymentCalendar
          payments={calendarPayments}
          title="Kalender Pembayaran Semua Penghuni"
          description="Lihat jadwal pembayaran semua penghuni dalam format kalender"
        />
      ) : (
        /* Payments List */
        <div className="space-y-4">
          {payments.map((payment) => (
            <Card key={payment.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Penghuni</p>
                    <p className="font-semibold">{getResidentName(payment.residentId)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Kamar</p>
                    <p className="font-semibold">{getRoomName(payment.roomId)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Jumlah</p>
                    <p className="font-semibold">Rp {(payment.amount / 1000000).toFixed(1)}M</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Jatuh Tempo</p>
                    <p className="font-semibold">{new Date(payment.dueDate).toLocaleDateString("id-ID")}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <div
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        payment.status === "paid"
                          ? "bg-primary/10 text-primary"
                          : payment.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-destructive/10 text-destructive"
                      }`}
                    >
                      {payment.status === "paid" ? "Lunas" : payment.status === "pending" ? "Pending" : "Overdue"}
                    </div>
                  </div>
                </div>
                {payment.status !== "paid" && (
                  <Button
                    onClick={() => handleMarkAsPaid(payment.id)}
                    size="sm"
                    className="bg-primary hover:bg-primary/90"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Tandai Lunas
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
