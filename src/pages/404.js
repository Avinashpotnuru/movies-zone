import Image from "next/image";
import Link from "next/link";
import React from "react";

import Seo from "@/components/Seo";

const NotFound = () => {
  return (
    <>
      <Seo
        title="Page not found"
        description="The page you are looking for is not available on Movies-Zone."
        path="/404"
        noindex
      />
      <div className="pt-[65px] h-[80vh] md:h-[80vh] flex flex-col space-y-5 justify-center items-center ">
        <Image
          height={400}
          width={400}
          src={"/404.webp"}
          className=" object-cover"
          alt="404"
        />
        <Link href="/">
          <button className="px-6 py-3 bg-white text-blue-500 font-bold rounded-lg shadow-md hover:bg-blue-100 hover:shadow-lg transition duration-300 transform  focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50">
            Go to Home Page
          </button>
        </Link>
      </div>
    </>
  );
};

export default NotFound;
