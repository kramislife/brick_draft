import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "@/components/layout/header/Header";
import Footer from "@/components/layout/footer/Footer";
import AdminSidebar from "@/components/layout/sidebar/AdminSidebar";
import {
  BackToTopButton,
  ScrollToTop,
} from "@/components/layout/scroll/ScrollToTop";

const RootLayout = () => {
  const { pathname } = useLocation();
  const isAdminRoute = pathname.startsWith("/admin");

  return (
    <div className="relative min-h-screen flex flex-col">
      <ScrollToTop />
      <Header />
      {/* Main Content */}
      <div className="flex-1 w-full">
        <div className="flex w-full max-w-screen-2xl mx-auto">
          {isAdminRoute && (
            <aside className="min-h-full">
              <AdminSidebar />
            </aside>
          )}
          <main className={`flex-1 w-full  ${isAdminRoute ? "p-5 gradient-blue" : ""}`}>
            <Outlet />
          </main>
        </div>
      </div>
      <Footer />
      <BackToTopButton />
    </div>
  );
};

export default RootLayout;
