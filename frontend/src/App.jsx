import React from "react";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { PlayroomProvider } from "@/context/PlayroomContext";
import UserRoutes from "@/routes/UserRoutes";

const App = () => {
  return (
    <BrowserRouter>
      <PlayroomProvider>
        <Toaster position="bottom-right" />
        <UserRoutes />
      </PlayroomProvider>
    </BrowserRouter>
  );
};

export default App;
