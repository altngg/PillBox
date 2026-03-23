import React from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { Home } from "./pages/Home"
import { Login } from "./pages/Login"
import { Pillbox } from "./pages/Pillbox"
import { Addmed } from "./pages/Addmed"
import { Register } from "./pages/Register"
import { Reminder } from "./pages/Reminder"
import { Profile } from "./pages/Profile"
import { Medicine } from "./pages/Medicine"
import { Reminders } from "./pages/Reminders"
import { AdminDashboard } from "./pages/Admin/AdminDashboard"
import { AdminUsers } from "./pages/Admin/AdminUsers"
import { AdminMedicines } from "./pages/Admin/AdminMedicines"
import { AdminReminders } from "./pages/Admin/AdminReminders"
import { ProtectedRoute } from "./components/ProtectedRoute"
import { AuthProvider } from "./context/AuthContext"

import "./App.css"

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/pillbox"
            element={
              <ProtectedRoute>
                <Pillbox />
              </ProtectedRoute>
            }
          />
          <Route
            path="/addmed"
            element={
              <ProtectedRoute>
                <Addmed />
              </ProtectedRoute>
            }
          />
          <Route path="/medicine/:id" element={<Medicine />} />
          <Route
            path="/reminder"
            element={
              <ProtectedRoute>
                <Reminder />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reminders"
            element={
              <ProtectedRoute>
                <Reminders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute requireAdmin>
                <AdminUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/medicines"
            element={
              <ProtectedRoute requireAdmin>
                <AdminMedicines />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reminders"
            element={
              <ProtectedRoute requireAdmin>
                <AdminReminders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/*"
            element={<Navigate to="/admin" replace />}
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App