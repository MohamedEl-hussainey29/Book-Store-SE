import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom"
import NavBar from "../NavBar/NavBar";
import Contact from "../Contact/Contact";
import Footer from "../Footer/Footer";

export default function MasterLayout() {

    const location = useLocation();

    useEffect(()=>{
        window.scrollTo(0 , 0);
    } , [location.pathname]);
  return (
    <>
      <div>
        <Contact/>
        <NavBar/>
      </div>
      <div>
        <Outlet/>
      </div>
      <div>
        <Footer/>
      </div>
    </>
  )
}
