"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { getRooms, addRoom, updateRoom, deleteRoom } from "@/lib/storage"
import { Plus, Edit2, Trash2 } from "lucide-react"

export default function RoomsPage() {
  const [rooms, setRooms] = useState(getRooms())
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    status: "available" as const,
    description: "",
  })

  const handleAddRoom = () => {
    if (formData.name && formData.price) {
      if (editingId) {
        updateRoom(editingId, {
          name: formData.name,
          price: Number.parseInt(formData.price),
          status: formData.status,
          description: formData.description,
        })
      } else {
        addRoom({
          name: formData.name,
          price: Number.parseInt(formData.price),
          status: formData.status,
          description: formData.description,
        })
      }
      setRooms(getRooms())
      setFormData({ name: "", price: "", status: "available", description: "" })
      setShowForm(false)
      setEditingId(null)
    }
  }

  const handleEdit = (room: any) => {
    setFormData({
      name: room.name,
      price: room.price.toString(),
      status: room.status,
      description: room.description,
    })
    setEditingId(room.id)
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus kamar ini?")) {
      deleteRoom(id)
      setRooms(getRooms())
    }
  }

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Manajemen Kamar</h1>
          <p className="text-muted-foreground">Kelola kamar dan status okupansi</p>
        </div>
        <Button
          onClick={() => {
            setShowForm(!showForm)
            setEditingId(null)
            setFormData({ name: "", price: "", status: "available", description: "" })
          }}
          className="bg-primary hover:bg-primary/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Tambah Kamar
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "Edit Kamar" : "Tambah Kamar Baru"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Nama Kamar</label>
                <Input
                  placeholder="Kamar 101"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Harga (Rp)</label>
                <Input
                  type="number"
                  placeholder="1500000"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-3 py-2 border border-input rounded-lg bg-background"
                >
                  <option value="available">Tersedia</option>
                  <option value="occupied">Terisi</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Deskripsi</label>
                <Input
                  placeholder="Deskripsi kamar"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddRoom} className="bg-primary hover:bg-primary/90">
                {editingId ? "Update" : "Tambah"}
              </Button>
              <Button
                onClick={() => {
                  setShowForm(false)
                  setEditingId(null)
                  setFormData({ name: "", price: "", status: "available", description: "" })
                }}
                variant="outline"
              >
                Batal
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Rooms List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rooms.map((room) => (
          <Card key={room.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{room.name}</CardTitle>
                  <CardDescription>Rp {(room.price / 1000000).toFixed(1)}M/bulan</CardDescription>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    room.status === "occupied" ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"
                  }`}
                >
                  {room.status === "occupied" ? "Terisi" : "Tersedia"}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{room.description}</p>
              <div className="flex gap-2">
                <Button onClick={() => handleEdit(room)} variant="outline" size="sm" className="flex-1">
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button
                  onClick={() => handleDelete(room.id)}
                  variant="outline"
                  size="sm"
                  className="flex-1 text-destructive hover:text-destructive"
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
