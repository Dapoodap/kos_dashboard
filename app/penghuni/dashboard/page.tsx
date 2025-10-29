"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getCurrentUser, getResidents, getRooms, getPayments } from "@/lib/storage"
import { PaymentCalendar } from "@/components/payment-calendar"
import { Calendar, CreditCard, Home, CheckCircle } from "lucide-react"

export default function PenghuniDashboard() {
  const currentUser = getCurrentUser()
  const residents = getResidents()
  const rooms = getRooms()
  const payments = getPayments()
  const [showCalendar, setShowCalendar] = useState(false)

  const userResident = useMemo(() => {
    return residents.find((r) => r.id === currentUser?.residentId)
  }, [currentUser, residents])

  const userRoom = useMemo(() => {
    if (!userResident) return null
    return rooms.find((r) => r.id === userResident.roomId)
  }, [userResident, rooms])

  const userPayments = useMemo(() => {
    if (!userResident) return []
    return payments.filter((p) => p.residentId === userResident.id)
  }, [userResident, payments])

  const thisMonthPayment = useMemo(() => {
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()

    return userPayments.find((p) => {
      const dueDate = new Date(p.dueDate)
      return dueDate.getMonth() === currentMonth && dueDate.getFullYear() === currentYear
    })
  }, [userPayments])

  const nextPayment = useMemo(() => {
    const now = new Date()
    return userPayments
      .filter((p) => new Date(p.dueDate) > now)
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0]
  }, [userPayments])

  return (
    <div className="p-4 md:p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Selamat Datang, {currentUser?.name}!</h1>
        <p className="text-muted-foreground">Berikut ringkasan informasi kamar dan pembayaran Anda</p>
      </div>

      {/* Room Info */}
      {userRoom && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="w-5 h-5 text-primary" />
              Informasi Kamar Anda
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Nomor Kamar</p>
              <p className="text-2xl font-bold text-primary">{userRoom.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Harga Sewa</p>
              <p className="text-2xl font-bold">Rp {(userRoom.price / 1000000).toFixed(1)}M</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Periode</p>
              <p className="text-2xl font-bold">/bulan</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payment Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* This Month */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Pembayaran Bulan Ini
            </CardTitle>
            <CardDescription>Oktober 2025</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {thisMonthPayment ? (
              <>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Jumlah</p>
                  <p className="text-3xl font-bold">Rp {(thisMonthPayment.amount / 1000000).toFixed(1)}M</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Status</p>
                  <div
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold ${
                      thisMonthPayment.status === "paid"
                        ? "bg-primary/10 text-primary"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {thisMonthPayment.status === "paid" ? (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        Sudah Lunas
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5" />
                        Belum Dibayar
                      </>
                    )}
                  </div>
                </div>
                {thisMonthPayment.status === "paid" && thisMonthPayment.paidDate && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Tanggal Pembayaran</p>
                    <p className="font-semibold">{new Date(thisMonthPayment.paidDate).toLocaleDateString("id-ID")}</p>
                  </div>
                )}
              </>
            ) : (
              <p className="text-muted-foreground">Tidak ada pembayaran untuk bulan ini</p>
            )}
          </CardContent>
        </Card>

        {/* Next Payment */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Pembayaran Berikutnya
            </CardTitle>
            <CardDescription>Estimasi pembayaran</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {nextPayment ? (
              <>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Jumlah</p>
                  <p className="text-3xl font-bold">Rp {(nextPayment.amount / 1000000).toFixed(1)}M</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Jatuh Tempo</p>
                  <p className="font-semibold text-lg">{new Date(nextPayment.dueDate).toLocaleDateString("id-ID")}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Sisa Hari</p>
                  <p className="text-2xl font-bold text-primary">
                    {Math.ceil(
                      (new Date(nextPayment.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
                    )}{" "}
                    hari
                  </p>
                </div>
              </>
            ) : (
              <p className="text-muted-foreground">Tidak ada pembayaran berikutnya</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center">
        <Button
          onClick={() => setShowCalendar(!showCalendar)}
          variant="outline"
          className="border-primary text-primary hover:bg-primary/10"
        >
          <Calendar className="w-4 h-4 mr-2" />
          {showCalendar ? "Sembunyikan Kalender" : "Lihat Kalender Pembayaran"}
        </Button>
      </div>

      {showCalendar && (
        <PaymentCalendar
          payments={userPayments}
          title="Kalender Pembayaran Anda"
          description="Lihat jadwal pembayaran sewa kamar Anda dalam format kalender"
        />
      )}

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle>Riwayat Pembayaran</CardTitle>
          <CardDescription>Daftar semua pembayaran Anda</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {userPayments.length > 0 ? (
              userPayments.map((payment) => (
                <div key={payment.id} className="flex justify-between items-center p-3 bg-secondary/30 rounded-lg">
                  <div>
                    <p className="font-semibold">{new Date(payment.dueDate).toLocaleDateString("id-ID")}</p>
                    <p className="text-sm text-muted-foreground">Rp {(payment.amount / 1000000).toFixed(1)}M</p>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
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
              ))
            ) : (
              <p className="text-muted-foreground">Belum ada riwayat pembayaran</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
