import { ReactNode } from "react";
import { setCurrentWorkspace } from "../../route.info";
import Branded from "@/types/branded.type";

const Layout = ({
  children,
  params,
}: {
  children: ReactNode;
  params: { workspaceId: string };
}) => {
  setCurrentWorkspace(Branded.WorkspaceId(params.workspaceId));

  return <div>{children}</div>;
};

export default Layout;
