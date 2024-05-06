import React from "react";
import HomePageRoute from "../route.info";
import Image from "next/image";

const Logo = () => {
  return (
    <div>
      <HomePageRoute.Link params={{}}>
        <Image
          src={"/logo/logo-dark.png"}
          alt="logo"
          width={150}
          height={60}
          className="cursor-pointer object-contain dark:block hidden"
        />
        <Image
          src={"/logo/logo-light.png"}
          alt="logo"
          width={150}
          height={60}
          className="cursor-pointer object-contain dark:hidden block"
        />
      </HomePageRoute.Link>
    </div>
  );
};

export default Logo;
