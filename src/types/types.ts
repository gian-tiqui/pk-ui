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
  middleName?: string;
  lastName: string;
  deptId: number;
  deptName: string;
  deptCode: string;
};

type Query = {
  status?: string;
  search?: string;
  offset?: number;
  limit?: number;
  sortBy?: string;
  departmentId?: number;
  divisionId?: number;
  name?: string;
  code?: string;
  level?: number;
  sortOrder?: string;
  isDeleted?: boolean;
  roomImageDeleted?: boolean;
};

type Room = {
  id: number;
  name: string;
  code: string;
  detail?: string;
  floorId: number;
  createdAt: Date;
  updatedAt: Date;
};

type Floor = {
  id: number;
  name: string;
  level: number;
  code: string;
  isDeleted: boolean;
  rooms: Room[];
  createdAt: Date;
  updatedAt: Date;
};

type SettingsPanel = {
  header: string;
  panel: ReactNode;
  icon: string;
};

type User = {
  firstName: string;
  middleName?: string;
  lastName: string;
  deptId: number;
};

type ChangePassword = {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};

type Department = {
  id: number;
  name: string;
  code: string;
};

type Question = {
  id: number;
  question: string;
};

type Secrets = { question: string; answer: string };

type ForgotPassword = {
  employeeId: string;
  questionId: number;
  answer: string;
};

export type {
  Route,
  UserData,
  Query,
  Floor,
  Room,
  Question,
  SettingsPanel,
  User,
  ChangePassword,
  Department,
  Secrets,
  ForgotPassword,
};
