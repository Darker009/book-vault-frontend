import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./componants/navbar/Navbar";
import Login from "./auth/Login";
import Register from "./auth/Register";
import StudentDashboard from "./pages/StudentDashboard";
import StudentProfile from "./pages/StudentProfile";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProfile from "./pages/AdminProfile";
import AddBook from "./pages/AddBook";
import EditBook from "./pages/EditBook"; // ✅ imported
import ProtectedRoute from "./componants/protectedRoute/ProtectedRoute";
import AdminBooks from "./pages/AdminBooks";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Student Routes */}
        <Route
          path="/student-dashboard"
          element={
            <ProtectedRoute allowedRoles={["ROLE_STUDENT"]}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/profile"
          element={
            <ProtectedRoute allowedRoles={["ROLE_STUDENT"]}>
              <StudentProfile />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/profile"
          element={
            <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
              <AdminProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/books"
          element={
            <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
              <AdminBooks />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/books/add"
          element={
            <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
              <AddBook />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/books/edit/:id" // ✅ added edit route with dynamic ID
          element={
            <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
              <EditBook />
            </ProtectedRoute>
          }
        />

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}

export default App;
