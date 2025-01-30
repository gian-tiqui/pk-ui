import { ReactNode } from "react";

type Route = {
  name: string;
  path: string;
  element: ReactNode;
  hidden: boolean;
};

type UserData = {
  sub: number;
  firstName: string;
  lastName: string;
  deptId: number;
  deptName: string;
  deptCode: string;
};

export type { Route, UserData };
