import React from "react";
import Hero from "./_components/Hero";
import WebAuthRoute from "./route.info";
import AuthInterceptor from "@/auth/authIntercepter";

const page = async () => {
  await new AuthInterceptor(WebAuthRoute({})).withTwoFactor().check();

  return <Hero />;
};

export default page;
