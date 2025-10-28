import Footer from "@/pages/Footer";
import Header from "@/pages/Header";
import { routes } from "@/routes/routes";
import { Routes } from "react-router-dom";

const Layout = () => {
  return (
    <div className="page-content-wrapper">
      <div className="d-flex">
        <div className="main-window bg-white flex-grow-1">
          <div className="d-flex flex-column h-100">
            <Header />
            <main id="main-content">
              <div className="container h-100">
                <Routes>{routes}</Routes>
              </div>
            </main>
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
