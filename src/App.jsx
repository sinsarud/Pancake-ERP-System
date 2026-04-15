import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react"; 
import { SpeedInsights } from "@vercel/speed-insights/react"; // 🟢 1. Import Speed Insights เพิ่มเข้ามา

import AuthPortal from "./AuthPortal";
import Dashboard from "./Dashboard";
import CheckIn from "./CheckIn";
import AdminMap from "./AdminMap";
import AttendanceHistory from "./AttendanceHistory";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* หน้าแรกบังคับไป Login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* หน้า Login */}
          <Route path="/login" element={<AuthPortal />} />
          
          {/* หน้า Dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* หน้าลงเวลา (Timestamp) */}
          <Route path="/check-in" element={<CheckIn />} />
          
          {/* หน้าแผนที่สำหรับ Admin */}
          <Route path="/admin-map" element={<AdminMap />} />

          {/* หน้าประวัติการเข้างาน */}
          <Route path="/history" element={<AttendanceHistory />} />
        </Routes>
      </BrowserRouter>

      {/* 🟢 2. วางทั้ง Analytics และ SpeedInsights ไว้ที่นี่เพื่อให้ทำงานทุกหน้า */}
      <Analytics />
      <SpeedInsights />
    </>
  );
}