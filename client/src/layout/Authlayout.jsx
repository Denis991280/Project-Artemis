import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useContext, useState } from "react";
import { AuthContext } from "../components/context/AuthProvider";
import Landingpage from "../pages/Landingpage";

export default function Authlayout() {
  const { isLoading } = useContext(AuthContext);

  return (
    <>
      {isLoading ? (
        <div className="flex flex-col gap-4 w-52">
          <div className="skeleton h-32 w-full">TEst TEst</div>
        </div>
      ) : (
        <>
          <Navbar />
          <Outlet />
          <Footer />
        </>
      )}
    </>
  );
}