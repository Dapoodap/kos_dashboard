interface Room {
  id: string
  name: string
  price: number
  status: "available" | "occupied"
  description: string
  image?: string
}

interface Resident {
  id: string
  name: string
  email: string
  phone: string
  roomId: string
  checkInDate: string
  contractEndDate: string
}

interface Payment {
  id: string
  residentId: string
  roomId: string
  amount: number
  dueDate: string
  paidDate?: string
  status: "pending" | "paid" | "overdue"
}

interface User {
  id: string
  email: string
  password: string
  role: "admin" | "penghuni"
  name: string
  residentId?: string
}

const STORAGE_KEYS = {
  USERS: "kos_users",
  ROOMS: "kos_rooms",
  RESIDENTS: "kos_residents",
  PAYMENTS: "kos_payments",
  CURRENT_USER: "kos_current_user",
}

// Initialize default data
export function initializeStorage() {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    const defaultUsers: User[] = [
      {
        id: "1",
        email: "admin@kos.com",
        password: "admin123",
        role: "admin",
        name: "Admin Kos",
      },
      {
        id: "2",
        email: "penghuni@kos.com",
        password: "penghuni123",
        role: "penghuni",
        name: "Budi Santoso",
        residentId: "1",
      },
    ]
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(defaultUsers))
  }

  if (!localStorage.getItem(STORAGE_KEYS.ROOMS)) {
    const defaultRooms: Room[] = [
      {
        id: "1",
        name: "Kamar 101",
        price: 1500000,
        status: "occupied",
        description: "Kamar standar dengan AC dan WiFi",
      },
      {
        id: "2",
        name: "Kamar 102",
        price: 1500000,
        status: "available",
        description: "Kamar standar dengan AC dan WiFi",
      },
      {
        id: "3",
        name: "Kamar 201",
        price: 2500000,
        status: "occupied",
        description: "Kamar premium dengan balkon",
      },
    ]
    localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(defaultRooms))
  }

  if (!localStorage.getItem(STORAGE_KEYS.RESIDENTS)) {
    const defaultResidents: Resident[] = [
      {
        id: "1",
        name: "Budi Santoso",
        email: "penghuni@kos.com",
        phone: "081234567890",
        roomId: "1",
        checkInDate: "2024-01-15",
        contractEndDate: "2025-01-15",
      },
    ]
    localStorage.setItem(STORAGE_KEYS.RESIDENTS, JSON.stringify(defaultResidents))
  }

  if (!localStorage.getItem(STORAGE_KEYS.PAYMENTS)) {
    const defaultPayments: Payment[] = [
      {
        id: "1",
        residentId: "1",
        roomId: "1",
        amount: 1500000,
        dueDate: "2025-10-01",
        paidDate: "2025-09-28",
        status: "paid",
      },
      {
        id: "2",
        residentId: "1",
        roomId: "1",
        amount: 1500000,
        dueDate: "2025-11-01",
        status: "pending",
      },
    ]
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(defaultPayments))
  }
}

// User functions
export function getUsers(): User[] {
  const data = localStorage.getItem(STORAGE_KEYS.USERS)
  return data ? JSON.parse(data) : []
}

export function getCurrentUser(): User | null {
  const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER)
  return data ? JSON.parse(data) : null
}

export function setCurrentUser(user: User | null) {
  if (user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user))
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER)
  }
}

export function loginUser(email: string, password: string): User | null {
  const users = getUsers()
  const user = users.find((u) => u.email === email && u.password === password)
  if (user) {
    setCurrentUser(user)
    return user
  }
  return null
}

// Room functions
export function getRooms(): Room[] {
  const data = localStorage.getItem(STORAGE_KEYS.ROOMS)
  return data ? JSON.parse(data) : []
}

export function addRoom(room: Omit<Room, "id">) {
  const rooms = getRooms()
  const newRoom: Room = {
    ...room,
    id: Date.now().toString(),
  }
  rooms.push(newRoom)
  localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(rooms))
  return newRoom
}

export function updateRoom(id: string, updates: Partial<Room>) {
  const rooms = getRooms()
  const index = rooms.findIndex((r) => r.id === id)
  if (index !== -1) {
    rooms[index] = { ...rooms[index], ...updates }
    localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(rooms))
  }
}

export function deleteRoom(id: string) {
  const rooms = getRooms()
  const filtered = rooms.filter((r) => r.id !== id)
  localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(filtered))
}

// Resident functions
export function getResidents(): Resident[] {
  const data = localStorage.getItem(STORAGE_KEYS.RESIDENTS)
  return data ? JSON.parse(data) : []
}

export function addResident(resident: Omit<Resident, "id">) {
  const residents = getResidents()
  const newResident: Resident = {
    ...resident,
    id: Date.now().toString(),
  }
  residents.push(newResident)
  localStorage.setItem(STORAGE_KEYS.RESIDENTS, JSON.stringify(residents))
  return newResident
}

export function updateResident(id: string, updates: Partial<Resident>) {
  const residents = getResidents()
  const index = residents.findIndex((r) => r.id === id)
  if (index !== -1) {
    residents[index] = { ...residents[index], ...updates }
    localStorage.setItem(STORAGE_KEYS.RESIDENTS, JSON.stringify(residents))
  }
}

export function deleteResident(id: string) {
  const residents = getResidents()
  const filtered = residents.filter((r) => r.id !== id)
  localStorage.setItem(STORAGE_KEYS.RESIDENTS, JSON.stringify(filtered))
}

// Payment functions
export function getPayments(): Payment[] {
  const data = localStorage.getItem(STORAGE_KEYS.PAYMENTS)
  return data ? JSON.parse(data) : []
}

export function addPayment(payment: Omit<Payment, "id">) {
  const payments = getPayments()
  const newPayment: Payment = {
    ...payment,
    id: Date.now().toString(),
  }
  payments.push(newPayment)
  localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments))
  return newPayment
}

export function updatePayment(id: string, updates: Partial<Payment>) {
  const payments = getPayments()
  const index = payments.findIndex((p) => p.id === id)
  if (index !== -1) {
    payments[index] = { ...payments[index], ...updates }
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments))
  }
}

export function getPaymentsByResident(residentId: string): Payment[] {
  const payments = getPayments()
  return payments.filter((p) => p.residentId === residentId)
}

export function getPaymentsByRoom(roomId: string): Payment[] {
  const payments = getPayments()
  return payments.filter((p) => p.roomId === roomId)
}
