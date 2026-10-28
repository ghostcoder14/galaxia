import React from "react";
import Header from "./Header";
import { Outlet, useLocation } from "react-router-dom";

const Layout = () => {
  const location = useLocation();
  const isHeaderVisible = !["/orbit-align", "/cosmic-quiz"].includes(location.pathname);

  return (
    <div className="min-h-screen bg-black">
      {isHeaderVisible && <Header />}
      <main className={`${isHeaderVisible ? "pt-20" : "pt-0"}`}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
