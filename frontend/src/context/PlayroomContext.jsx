import React, { createContext, useContext, useState } from "react";

const PlayroomContext = createContext();

export const usePlayroom = () => {
  const context = useContext(PlayroomContext);
  if (!context) {
    throw new Error("usePlayroom must be used within a PlayroomProvider");
  }
  return context;
};

export const PlayroomProvider = ({ children }) => {
  const [isInPlayroom, setIsInPlayroom] = useState(false);

  return (
    <PlayroomContext.Provider value={{ isInPlayroom, setIsInPlayroom }}>
      {children}
    </PlayroomContext.Provider>
  );
};
