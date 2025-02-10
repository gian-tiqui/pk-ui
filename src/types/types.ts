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
  isIncomplete?: boolean;
};

type Floor = {
  id: number;
  name: string;
  level: number;
  code: string;
  isDeleted: boolean;
  rooms: Room[];
  imageLocation?: string;
  createdAt: Date;
  updatedAt: Date;
};

type ArrowType = {
  points: number[];
};

type Room = {
  id: number;
  name: string;
  code: string;
  detail?: string;
  floorId: number;
  createdAt: Date;
  updatedAt: Date;
  floor: Floor;
  direction?: string;
  directionPattern?: { arrows: ArrowType[] };
};

type Panel = {
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

type FloorParam = {
  floorId: string;
};

type ArrowDimension = {
  pointerLength: number;
  pointerWidth: number;
  strokeWidth: number;
  stroke: string;
  fill: string;
};

export type {
  ArrowDimension,
  Route,
  UserData,
  Query,
  Floor,
  Room,
  Question,
  Panel,
  User,
  ChangePassword,
  Department,
  Secrets,
  ForgotPassword,
  FloorParam,
  ArrowType,
};
