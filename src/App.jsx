import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import CheckIn from './CheckIn';
import AdminMap from './AdminMap';
import AdminDashboard from './AdminDashboard'; // 1. เพิ่มบรรทัดนี้

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/check-in" element={<CheckIn />} />
        <Route path="/admin-map" element={<AdminMap />} />
        {/* 2. เพิ่มเส้นทาง Dashboard */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;