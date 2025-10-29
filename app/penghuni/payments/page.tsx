"use client"

import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getCurrentUser, getResidents, getPayments } from "@/lib/storage"
import { Calendar, CheckCircle, Clock, AlertCircle } from "lucide-react"

export default function PenghuniPaymentsPage() {
  const currentUser = getCurrentUser()
  const residents = getResidents()
  const payments = getPayments()

  const userResident = useMemo(() => {
    return residents.find((r) => r.id === currentUser?.residentId)
  }, [currentUser, residents])

  const userPayments = useMemo(() => {
    if (!userResident) return []
    return payments
      .filter((p) => p.residentId === userResident.id)
      .sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime())
  }, [userResident, payments])

  const stats = useMemo(() => {
    const paid = userPayments.filter((p) => p.status === "paid").length
    const pending = userPayments.filter((p) => p.status === "pending").length
    const overdue = userPayments.filter((p) => p.status === "overdue").length
    const totalPaid = userPayments.filter((p) => p.status === "paid").reduce((sum, p) => sum + p.amount, 0)

    return { paid, pending, overdue, totalPaid }
  }, [userPayments])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <CheckCircle className="w-5 h-5 text-primary" />
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-600" />
      case "overdue":
        return <AlertCircle className="w-5 h-5 text-destructive" />
      default:
        return null
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "paid":
        return "Lunas"
      case "pending":
        return "Pending"
      case "overdue":
        return "Overdue"
      default:
        return status
    }
  }

  return (
    <div className="p-4 md:p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Jadwal Pembayaran</h1>
        <p className="text-muted-foreground">Kelola dan pantau semua pembayaran sewa Anda</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Sudah Lunas</p>
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
            <p className="text-sm text-muted-foreground mb-1">Total Terbayar</p>
            <p className="text-2xl font-bold text-primary">Rp {(stats.totalPaid / 1000000).toFixed(1)}M</p>
          </CardContent>
        </Card>
      </div>

      {/* Calendar View */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Kalender Pembayaran
          </CardTitle>
          <CardDescription>Lihat jadwal pembayaran Anda dalam format kalender</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {userPayments.length > 0 ? (
              userPayments.map((payment) => {
                const dueDate = new Date(payment.dueDate)
                const today = new Date()
                const isUpcoming = dueDate > today && payment.status === "pending"
                const isOverdue = dueDate < today && payment.status === "pending"

                return (
                  <div
                    key={payment.id}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      payment.status === "paid"
                        ? "bg-primary/5 border-primary/20"
                        : isOverdue
                          ? "bg-destructive/5 border-destructive/20"
                          : isUpcoming
                            ? "bg-yellow-50 border-yellow-200"
                            : "bg-secondary/30 border-border"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="mt-1">{getStatusIcon(payment.status)}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <p className="font-bold text-lg">
                              {dueDate.toLocaleDateString("id-ID", { month: "long", year: "numeric" })}
                            </p>
                            <span
                              className={`text-xs font-semibold px-2 py-1 rounded ${
                                payment.status === "paid"
                                  ? "bg-primary/10 text-primary"
                                  : isOverdue
                                    ? "bg-destructive/10 text-destructive"
                                    : isUpcoming
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {getStatusLabel(payment.status)}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Jatuh Tempo:{" "}
                            {dueDate.toLocaleDateString("id-ID", {
                              weekday: "long",
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">Rp {(payment.amount / 1000000).toFixed(1)}M</p>
                        {payment.status === "paid" && payment.paidDate && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Dibayar: {new Date(payment.paidDate).toLocaleDateString("id-ID")}
                          </p>
                        )}
                        {isUpcoming && (
                          <p className="text-xs text-yellow-600 mt-1 font-semibold">
                            {Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))} hari lagi
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })
            ) : (
              <p className="text-muted-foreground text-center py-8">Belum ada jadwal pembayaran</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
