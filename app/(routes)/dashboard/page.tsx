import { validateRequestCached } from "@/auth/validate-request";
import React from "react";

const page = async () => {
  const { user } = await validateRequestCached();
  return (
    <div className="py-24">
      {user ? (
        <div className="text-5xl text-center">Welcome {user.username}</div>
      ) : null}
    </div>
  );
};

export default page;
