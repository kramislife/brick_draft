import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "@/components/layout/header/Header";
import Footer from "@/components/layout/footer/Footer";
import AdminSidebar from "@/components/layout/sidebar/AdminSidebar";
import {
  BackToTopButton,
  ScrollToTop,
} from "@/components/layout/scroll/ScrollToTop";
import { usePlayroom } from "@/context/PlayroomContext";

const RootLayout = () => {
  const { pathname } = useLocation();
  const { isInPlayroom } = usePlayroom();
  const isAdminRoute = pathname.startsWith("/admin");

  return (
    <div
      className={`relative ${
        isInPlayroom ? "h-screen" : "min-h-screen"
      } flex flex-col`}
    >
      <ScrollToTop />
      {!isInPlayroom && <Header />}
      {/* Main Content */}
      <div className="flex-1 w-full">
        <div
          className={`flex w-full ${
            isInPlayroom ? "h-full" : "max-w-screen-2xl mx-auto"
          }`}
        >
          {isAdminRoute && !isInPlayroom && (
            <aside className="min-h-full">
              <AdminSidebar />
            </aside>
          )}
          <main
            className={`flex-1 w-full ${
              isAdminRoute && !isInPlayroom ? "p-5 gradient-blue" : ""
            } ${isInPlayroom ? "h-full" : ""}`}
          >
            <Outlet />
          </main>
        </div>
      </div>
      {!isInPlayroom && <Footer />}
      {!isInPlayroom && <BackToTopButton />}
    </div>
  );
};

export default RootLayout;
