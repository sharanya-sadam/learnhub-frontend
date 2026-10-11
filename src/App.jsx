import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import RoleBasedRoute from './components/RoleBasedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CourseCatalog from './pages/CourseCatalog';
import CourseDetails from './pages/CourseDetails';

// Student Pages
import StudentDashboard from './pages/StudentDashboard';
import MyCourses from './pages/MyCourses';
import CourseLearning from './pages/CourseLearning';
import MyGrades from './pages/MyGrades';

// Instructor Pages
import InstructorDashboard from './pages/InstructorDashboard';
import ManageCourses from './pages/ManageCourses';
import CreateCourse from './pages/CreateCourse';
import EditCourse from './pages/EditCourse';
import ManageLessons from './pages/ManageLessons';
import ManageAssignments from './pages/ManageAssignments';
import ViewSubmissions from './pages/ViewSubmissions';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import ManageUsers from './pages/ManageUsers';
import ManageEnrollments from './pages/ManageEnrollments';

// Common Pages
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <div className="d-flex flex-column min-vh-100">
            <Navbar />
            <main className="flex-grow-1">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/catalog" element={<CourseCatalog />} />
                <Route path="/courses/:id" element={<CourseDetails />} />

                {/* Common Authenticated Routes */}
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />

                {/* Student Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <RoleBasedRoute allowedRoles={['ROLE_STUDENT', 'ROLE_ADMIN']}>
                      <StudentDashboard />
                    </RoleBasedRoute>
                  }
                />
                <Route
                  path="/my-courses"
                  element={
                    <RoleBasedRoute allowedRoles={['ROLE_STUDENT', 'ROLE_ADMIN']}>
                      <MyCourses />
                    </RoleBasedRoute>
                  }
                />
                <Route
                  path="/courses/:id/learn"
                  element={
                    <RoleBasedRoute allowedRoles={['ROLE_STUDENT', 'ROLE_ADMIN']}>
                      <CourseLearning />
                    </RoleBasedRoute>
                  }
                />
                <Route
                  path="/grades"
                  element={
                    <RoleBasedRoute allowedRoles={['ROLE_STUDENT', 'ROLE_ADMIN']}>
                      <MyGrades />
                    </RoleBasedRoute>
                  }
                />

                {/* Instructor Routes */}
                <Route
                  path="/instructor/dashboard"
                  element={
                    <RoleBasedRoute allowedRoles={['ROLE_INSTRUCTOR', 'ROLE_ADMIN']}>
                      <InstructorDashboard />
                    </RoleBasedRoute>
                  }
                />
                <Route
                  path="/instructor/courses"
                  element={
                    <RoleBasedRoute allowedRoles={['ROLE_INSTRUCTOR', 'ROLE_ADMIN']}>
                      <ManageCourses />
                    </RoleBasedRoute>
                  }
                />
                <Route
                  path="/instructor/courses/new"
                  element={
                    <RoleBasedRoute allowedRoles={['ROLE_INSTRUCTOR', 'ROLE_ADMIN']}>
                      <CreateCourse />
                    </RoleBasedRoute>
                  }
                />
                <Route
                  path="/instructor/courses/:id/edit"
                  element={
                    <RoleBasedRoute allowedRoles={['ROLE_INSTRUCTOR', 'ROLE_ADMIN']}>
                      <EditCourse />
                    </RoleBasedRoute>
                  }
                />
                <Route
                  path="/instructor/courses/:id/lessons"
                  element={
                    <RoleBasedRoute allowedRoles={['ROLE_INSTRUCTOR', 'ROLE_ADMIN']}>
                      <ManageLessons />
                    </RoleBasedRoute>
                  }
                />
                <Route
                  path="/instructor/courses/:id/assignments"
                  element={
                    <RoleBasedRoute allowedRoles={['ROLE_INSTRUCTOR', 'ROLE_ADMIN']}>
                      <ManageAssignments />
                    </RoleBasedRoute>
                  }
                />
                <Route
                  path="/instructor/assignments/:id/submissions"
                  element={
                    <RoleBasedRoute allowedRoles={['ROLE_INSTRUCTOR', 'ROLE_ADMIN']}>
                      <ViewSubmissions />
                    </RoleBasedRoute>
                  }
                />

                {/* Admin Routes */}
                <Route
                  path="/admin/dashboard"
                  element={
                    <RoleBasedRoute allowedRoles={['ROLE_ADMIN']}>
                      <AdminDashboard />
                    </RoleBasedRoute>
                  }
                />
                <Route
                  path="/admin/users"
                  element={
                    <RoleBasedRoute allowedRoles={['ROLE_ADMIN']}>
                      <ManageUsers />
                    </RoleBasedRoute>
                  }
                />
                <Route
                  path="/admin/courses"
                  element={
                    <RoleBasedRoute allowedRoles={['ROLE_ADMIN']}>
                      <ManageCourses />
                    </RoleBasedRoute>
                  }
                />
                <Route
                  path="/admin/enrollments"
                  element={
                    <RoleBasedRoute allowedRoles={['ROLE_ADMIN']}>
                      <ManageEnrollments />
                    </RoleBasedRoute>
                  }
                />

                {/* Catch All */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
