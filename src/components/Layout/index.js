import Navbar from "../Navbar";
import Footer from "../Footer";

//  import components

const Layout = ({ children }) => {
  return (
    <div className="  h-screen w-full  ">
      <Navbar />

      <main className="pt-[76px] sm:pt-[88px]">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
