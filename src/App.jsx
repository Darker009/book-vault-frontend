import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import Navbar from './components/Navbar/Navbar';
import Welcome from './pages/Welcome/Welcome';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import AdminDashboard from './pages/admin/AdminDashboard';
import StudentDashboard from './pages/student/StudentDashboard';
import ProtectedRoute from './components/ProtectedRoutes';
import Books from './pages/Book/Books';
import AddBook from './pages/admin/AddBook';
import Profile from './pages/Profile/UserProfile';
import EditBook from './pages/admin/EditBook';
import AdminStudent from './pages/admin/AdminStudent';
import BorrowBook from './pages/Book/BorrowBook';
import BorrowedBooks from './pages/Book/BorrowedBooks';
import EditProfile from './pages/Profile/EditProfile';
import Footer from './components/Footer/Footer';
import AdminStats from './pages/admin/AdminStats';

function App() {
  return (

    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />

          <Route path="/books" element={
            <ProtectedRoute allowedRoles={['ROLE_ADMIN', 'ROLE_STUDENT']}>
              <Books />
            </ProtectedRoute>
          } />

          <Route path="/admin/students" element={
            <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
              <AdminStudent />
            </ProtectedRoute>
          } />
          <Route path="/admin/stats" element={
            <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
              <AdminStats />
            </ProtectedRoute>
          } />
          <Route path="/admin/books/add" element={
            <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
              <AddBook />
            </ProtectedRoute>
          } />

          <Route path="/admin/books/edit/:id" element={
            <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
              <EditBook />
            </ProtectedRoute>
          } />

          <Route path="/profile" element={
            <ProtectedRoute allowedRoles={['ROLE_ADMIN', 'ROLE_STUDENT']}>
              <Profile />
            </ProtectedRoute>
          } />

          <Route path="/user/edit-profile" element={
            <ProtectedRoute allowedRoles={['ROLE_ADMIN', 'ROLE_STUDENT']}>
              <EditProfile />
            </ProtectedRoute>
          } />

          {/* Student Routes */}
          <Route path="/student/dashboard" element={
            <ProtectedRoute allowedRoles={['ROLE_STUDENT']}>
              <StudentDashboard />
            </ProtectedRoute>
          } />
          <Route path="/borrow/books" element={
            <ProtectedRoute allowedRoles={['ROLE_STUDENT']}>
              <BorrowBook />
            </ProtectedRoute>
          } />

          <Route path="/borrowed/books" element={
            <ProtectedRoute allowedRoles={['ROLE_STUDENT', 'ROLE_ADMIN']}>
              <BorrowedBooks />
            </ProtectedRoute>
          } />
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Footer />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;