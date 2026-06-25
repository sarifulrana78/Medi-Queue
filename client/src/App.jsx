import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ErrorBoundary from "./pages/ErrorBoundary";
import DynamicTitle from "./components/DynamicTitle";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Tutors from "./pages/Tutors";
import TutorDetails from "./pages/TutorDetails";
import AddTutor from "./pages/AddTutor";
import MyTutors from "./pages/MyTutors";
import MyBookings from "./pages/MyBookings";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AuthCallback from "./pages/AuthCallback";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          {/* Reactive Title Manager */}
          <DynamicTitle />
          
          <Routes>
            {/* Layout Wrappers */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="tutors" element={<Tutors />} />
              
              {/* Private Routes */}
              <Route
                path="tutors/:id"
                element={
                  <RouteWrapper>
                    <TutorDetails />
                  </RouteWrapper>
                }
              />
              <Route
                path="add-tutor"
                element={
                  <RouteWrapper>
                    <AddTutor />
                  </RouteWrapper>
                }
              />
              <Route
                path="my-tutors"
                element={
                  <RouteWrapper>
                    <MyTutors />
                  </RouteWrapper>
                }
              />
              <Route
                path="my-booked-sessions"
                element={
                  <RouteWrapper>
                    <MyBookings />
                  </RouteWrapper>
                }
              />

              {/* Public Authentication routes */}
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="auth/callback" element={<AuthCallback />} />

              {/* Fallback Catch-all 404 */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

// Inline Private Wrapper helper for readability
import PrivateRoute from "./routes/PrivateRoute";
const RouteWrapper = ({ children }) => {
  return <PrivateRoute>{children}</PrivateRoute>;
};

export default App;
