import React from "react";
import ModalMessage from "../components/ModalMessage";
import Sidebar from "../components/Sidebar";

const Layout = ({ children }) => {
  return (
    <div className="flex min-h-screen login-gradient">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>

      <ModalMessage />
    </div>
  );
};

export default Layout;
