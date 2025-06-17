import React from "react";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import UserRoutes from "@/routes/UserRoutes";

const App = () => {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <UserRoutes />
    </BrowserRouter>
  );
};

export default App;
