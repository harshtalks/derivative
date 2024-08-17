import { ComponentPropsWithoutRef } from "react";
import { Button } from "./ui/button";

const LoaderCTA = (props: ComponentPropsWithoutRef<typeof Button>) => {
  return <Button {...props}></Button>;
};

export default LoaderCTA;
