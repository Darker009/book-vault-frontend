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
import EditBook from "./pages/EditBook";
import ProtectedRoute from "./componants/protectedRoute/ProtectedRoute";
import AdminBooks from "./pages/AdminBooks";
import EditStudentProfile from "./pages/EditStudentProfile";
import AdminStudents from "./pages/AdminStudents";
import AdminStats from "./pages/AdminStats";
import AdminBorrows from "./pages/AdminBorrows";
import AdminRecommendations from "./pages/AdminRecommendations";
import StudentBooks from "./pages/StudentBooks";

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
        <Route
          path="/student/profile/edit"
          element={
            <ProtectedRoute allowedRoles={["ROLE_STUDENT"]}>
              <EditStudentProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/books"
          element={
            <ProtectedRoute allowedRoles={["ROLE_STUDENT"]}>
              <StudentBooks />
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
          path="/admin/books/edit/:id"
          element={
            <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
              <EditBook />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/students"
          element={
            <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
              <AdminStudents />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/stats"
          element={
            <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
              <AdminStats />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/borrows"
          element={
            <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
              <AdminBorrows />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/recommendations"
          element={
            <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
              <AdminRecommendations />
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
