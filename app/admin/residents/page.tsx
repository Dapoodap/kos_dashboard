"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { getResidents, getRooms, addResident, updateResident, deleteResident } from "@/lib/storage"
import { Plus, Edit2, Trash2 } from "lucide-react"

export default function ResidentsPage() {
  const [residents, setResidents] = useState(getResidents())
  const [rooms] = useState(getRooms())
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    roomId: "",
    checkInDate: "",
    contractEndDate: "",
  })

  const handleAddResident = () => {
    if (formData.name && formData.email && formData.roomId) {
      if (editingId) {
        updateResident(editingId, formData)
      } else {
        addResident(formData)
      }
      setResidents(getResidents())
      setFormData({
        name: "",
        email: "",
        phone: "",
        roomId: "",
        checkInDate: "",
        contractEndDate: "",
      })
      setShowForm(false)
      setEditingId(null)
    }
  }

  const handleEdit = (resident: any) => {
    setFormData(resident)
    setEditingId(resident.id)
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus penghuni ini?")) {
      deleteResident(id)
      setResidents(getResidents())
    }
  }

  const getRoomName = (roomId: string) => {
    return rooms.find((r) => r.id === roomId)?.name || "Kamar tidak ditemukan"
  }

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Manajemen Penghuni</h1>
          <p className="text-muted-foreground">Kelola data penghuni kos</p>
        </div>
        <Button
          onClick={() => {
            setShowForm(!showForm)
            setEditingId(null)
            setFormData({
              name: "",
              email: "",
              phone: "",
              roomId: "",
              checkInDate: "",
              contractEndDate: "",
            })
          }}
          className="bg-primary hover:bg-primary/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Tambah Penghuni
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "Edit Penghuni" : "Tambah Penghuni Baru"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Nama</label>
                <Input
                  placeholder="Nama penghuni"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Email</label>
                <Input
                  type="email"
                  placeholder="email@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Nomor Telepon</label>
                <Input
                  placeholder="081234567890"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Kamar</label>
                <select
                  value={formData.roomId}
                  onChange={(e) => setFormData({ ...formData, roomId: e.target.value })}
                  className="w-full px-3 py-2 border border-input rounded-lg bg-background"
                >
                  <option value="">Pilih kamar</option>
                  {rooms.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Tanggal Check-in</label>
                <Input
                  type="date"
                  value={formData.checkInDate}
                  onChange={(e) => setFormData({ ...formData, checkInDate: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Tanggal Akhir Kontrak</label>
                <Input
                  type="date"
                  value={formData.contractEndDate}
                  onChange={(e) => setFormData({ ...formData, contractEndDate: e.target.value })}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddResident} className="bg-primary hover:bg-primary/90">
                {editingId ? "Update" : "Tambah"}
              </Button>
              <Button
                onClick={() => {
                  setShowForm(false)
                  setEditingId(null)
                  setFormData({
                    name: "",
                    email: "",
                    phone: "",
                    roomId: "",
                    checkInDate: "",
                    contractEndDate: "",
                  })
                }}
                variant="outline"
              >
                Batal
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Residents List */}
      <div className="space-y-4">
        {residents.map((resident) => (
          <Card key={resident.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Nama</p>
                  <p className="font-semibold">{resident.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-semibold text-sm">{resident.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Kamar</p>
                  <p className="font-semibold">{getRoomName(resident.roomId)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Kontrak Berakhir</p>
                  <p className="font-semibold">{new Date(resident.contractEndDate).toLocaleDateString("id-ID")}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => handleEdit(resident)} variant="outline" size="sm">
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button
                  onClick={() => handleDelete(resident.id)}
                  variant="outline"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Hapus
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
