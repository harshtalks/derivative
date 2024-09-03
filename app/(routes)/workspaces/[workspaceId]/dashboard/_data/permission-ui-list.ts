import { permissions } from "@/database/schema";
import {
  AArrowDown as AnyIcon,
  PencilRuler,
  Eraser,
  UserPlus,
} from "lucide-react";

type PermissionsUIList = {
  value: (typeof permissions)[number];
  icon: typeof AnyIcon;
  label: string;
  description: string;
};

export const permissionsUIList: PermissionsUIList[] = [
  {
    value: "read",
    icon: PencilRuler,
    label: "Read",
    description: "Can read everything in the workspace.",
  },
  {
    value: "write",
    icon: Eraser,
    label: "Write",
    description: "Can do the changes in the workspace templates",
  },
  {
    value: "member_controls",
    icon: UserPlus,
    label: "Member Controls",
    description: "Can add and remove members from the workspace.",
  },
];

export default permissionsUIList;
