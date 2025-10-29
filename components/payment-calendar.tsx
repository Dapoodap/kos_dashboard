"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaymentCalendarProps {
  payments: Array<{
    id: string
    dueDate: string
    amount: number
    status: "pending" | "paid" | "overdue"
    residentName?: string
  }>
  title?: string
  description?: string
}

export function PaymentCalendar({
  payments,
  title = "Kalender Pembayaran",
  description = "Lihat jadwal pembayaran",
}: PaymentCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const monthYear = useMemo(() => {
    return currentDate.toLocaleDateString("id-ID", { month: "long", year: "numeric" })
  }, [currentDate])

  const daysInMonth = useMemo(() => {
    return new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
  }, [currentDate])

  const firstDayOfMonth = useMemo(() => {
    return new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()
  }, [currentDate])

  const paymentsByDate = useMemo(() => {
    const map = new Map<string, typeof payments>()
    payments.forEach((payment) => {
      const date = new Date(payment.dueDate)
      if (date.getMonth() === currentDate.getMonth() && date.getFullYear() === currentDate.getFullYear()) {
        const day = date.getDate().toString()
        if (!map.has(day)) {
          map.set(day, [])
        }
        map.get(day)!.push(payment)
      }
    })
    return map
  }, [payments, currentDate])

  const calendarDays = useMemo(() => {
    const days = []
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null)
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i)
    }
    return days
  }, [firstDayOfMonth, daysInMonth])

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-primary/10 text-primary"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "overdue":
        return "bg-destructive/10 text-destructive"
      default:
        return "bg-gray-100 text-gray-800"
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
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Calendar Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Button variant="outline" size="sm" onClick={previousMonth}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <h3 className="text-lg font-semibold capitalize">{monthYear}</h3>
            <Button variant="outline" size="sm" onClick={nextMonth}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-2">
            {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((day) => (
              <div key={day} className="text-center font-semibold text-sm text-muted-foreground py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((day, index) => {
              const dayPayments = day ? paymentsByDate.get(day.toString()) : undefined
              const hasPayment = dayPayments && dayPayments.length > 0

              return (
                <div
                  key={index}
                  className={`aspect-square p-2 rounded-lg border-2 transition-colors ${
                    day === null
                      ? "bg-muted/30 border-transparent"
                      : hasPayment
                        ? "border-primary/30 bg-primary/5 hover:bg-primary/10"
                        : "border-border hover:border-primary/50"
                  }`}
                >
                  {day && (
                    <div className="h-full flex flex-col">
                      <span className="text-sm font-semibold">{day}</span>
                      {hasPayment && (
                        <div className="mt-1 space-y-1 flex-1 overflow-hidden">
                          {dayPayments.slice(0, 2).map((payment) => (
                            <div
                              key={payment.id}
                              className={`text-xs px-1.5 py-0.5 rounded truncate font-medium ${getStatusColor(payment.status)}`}
                            >
                              {getStatusLabel(payment.status)}
                            </div>
                          ))}
                          {dayPayments.length > 2 && (
                            <div className="text-xs text-muted-foreground px-1.5">+{dayPayments.length - 2}</div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Payment Details for Selected Month */}
        <div className="border-t pt-6">
          <h4 className="font-semibold mb-4">Detail Pembayaran - {monthYear}</h4>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {Array.from(paymentsByDate.entries())
              .sort((a, b) => Number.parseInt(a[0]) - Number.parseInt(b[0]))
              .map(([day, dayPayments]) =>
                dayPayments.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                    <div className="flex-1">
                      <p className="font-semibold text-sm">
                        {Number.parseInt(day)} {monthYear}
                      </p>
                      {payment.residentName && <p className="text-xs text-muted-foreground">{payment.residentName}</p>}
                      <p className="text-sm font-medium">Rp {(payment.amount / 1000000).toFixed(1)}M</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(payment.status)}`}>
                      {getStatusLabel(payment.status)}
                    </div>
                  </div>
                )),
              )}
            {paymentsByDate.size === 0 && (
              <p className="text-center text-muted-foreground py-8">Tidak ada pembayaran di bulan ini</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
