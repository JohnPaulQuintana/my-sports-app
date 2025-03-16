import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { showAlert } from './components/swal/showAlert';
import "./App.css"
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import CoachPage from './pages/CoachPage';
import AthletePage from './pages/AthletePage';
import ResetPassword from './components/auth/ResetPassword';

function App() {
  // Check authentication
  const isAuthenticated = () => {
    return JSON.parse(localStorage.getItem("sport-science-token"));
  };

  // Extract user role safely
  const getUserRole = () => {
    const user = isAuthenticated();
    // console.log(user.user.role)
    return user ? user.user.role : null; // Ensure role exists
  };

  // Redirect users based on role after login
  const RedirectToDashboard = () => {
    const role = getUserRole();
    
    switch (role) {
      case "admin":
        console.log('ginagawa')
        return <Navigate to="/admin" />;
      case "coach":
        return <Navigate to="/coach" />;
      case "athlete":
        return <Navigate to="/athlete" />;
      default:
        return <Navigate to="/" />;
    }
  };

  // Protected Route Component
  const ProtectedRoute = ({ children, allowedRoles }) => {
    const userRole = getUserRole();
    console.log(userRole)
    if (!isAuthenticated()) {
      showAlert("Access Denied", "You need to log in first!", "warning");
      return <Navigate to="/" />;
    }

    if (!allowedRoles.includes(userRole)) {
      showAlert("Access Denied", "You do not have permission!", "error");
      if(isAuthenticated) return <Navigate to={`/${userRole}`}/>
      return <Navigate to="/" />;
    }

    return children;
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<RedirectToDashboard />} />
        
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/coach"
          element={
            <ProtectedRoute allowedRoles={["coach"]}>
              <CoachPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/athlete"
          element={
            <ProtectedRoute allowedRoles={["athlete"]}>
              <AthletePage />
            </ProtectedRoute>
          }
        />

         {/* Add Reset Password Route */}
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
