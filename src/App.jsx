import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthPortal from "./AuthPortal";
import Dashboard from "./Dashboard";
import CheckIn from "./CheckIn";
import AdminMap from "./AdminMap";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* หน้าแรกบังคับไป Login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* หน้า Login สวยๆ ที่เพิ่งสร้าง */}
        <Route path="/login" element={<AuthPortal />} />
        
        {/* หน้า Dashboard สีม่วง */}
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* หน้าลงเวลา (Timestamp) */}
        <Route path="/check-in" element={<CheckIn />} />
        
        <Route path="/admin-map" element={<AdminMap />} />
      </Routes>
    </BrowserRouter>
  );
}