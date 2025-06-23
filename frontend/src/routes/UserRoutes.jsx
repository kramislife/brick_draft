import React from "react";
import { Routes, Route } from "react-router-dom";
import RootLayout from "@/routes/RootLayout";
import ProtectedRoutes from "@/routes/ProtectedRoutes";
import AdminProtectedRoutes from "@/routes/AdminProtectedRoutes";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Results from "@/pages/Results";
import TermsofUse from "@/components/layout/footer/TermsofUse";
import PrivacyPolicy from "@/components/layout/footer/PrivacyPolicy";
import Profile from "@/pages/auth/Profile";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import LotteryAll from "@/pages/LotteryAll";
import LotteryDetails from "@/pages/LotteryDetails";
import Dashboard from "@/pages/admin/Dashboard";
import Announcement from "@/pages/admin/Announcement";
import Banner from "@/pages/admin/Banner";
import Lottery from "@/pages/admin/Lottery";
import Parts from "@/pages/admin/Parts";
import Tickets from "@/pages/admin/Tickets";
import Users from "@/pages/admin/Users";
import LiveDraw from "@/pages/LiveDraw";
import Collections from "@/pages/admin/Collections";
import PartCategories from "@/pages/admin/PartCategories";
import Colors from "@/pages/admin/Colors";

const UserRoutes = () => {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact-us" element={<Contact />} />
        <Route path="/results" element={<Results />} />
        <Route path="/live-draw" element={<LiveDraw />} />
        <Route path="/terms-of-use" element={<TermsofUse />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/lottery/all" element={<LotteryAll />} />
        <Route path="/lottery/:id" element={<LotteryDetails />} />

        {/* Protected User Routes */}
        <Route element={<ProtectedRoutes />}>
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Protected Admin Routes */}
        <Route element={<AdminProtectedRoutes />}>
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/announcements" element={<Announcement />} />
          <Route path="/admin/banners" element={<Banner />} />
          <Route path="/admin/collections" element={<Collections />} />
          <Route path="/admin/colors" element={<Colors />} />
          <Route path="/admin/part-categories" element={<PartCategories />} />
          <Route path="/admin/lotteries" element={<Lottery />} />
          <Route path="/admin/parts" element={<Parts />} />
          <Route path="/admin/tickets" element={<Tickets />} />
          <Route path="/admin/users" element={<Users />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default UserRoutes;
