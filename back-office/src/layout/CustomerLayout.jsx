import { Outlet } from "react-router-dom";
import Header from "../components/customer/Header";
import Footer from "../components/customer/Footer";

const CustomerLayout = () => {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
};

export default CustomerLayout;
