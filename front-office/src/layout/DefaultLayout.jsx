import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Chatbot from "@/components/chatBot/Chatbot";
import { Outlet } from "react-router-dom";

const DefaultLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-paper text-ink">
      <Header />
      <div className="flex-grow">
        <Chatbot />
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default DefaultLayout;
