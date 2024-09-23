"use client";

import { setRandomCookie } from "@/actions/random-cookie";

export const Dummy = () => {
  return (
    <button
      onClick={async () => {
        await setRandomCookie();
      }}
    >
      dummy
    </button>
  );
};
