import { TabPanel } from "primereact/tabview";
import { IconType } from "primereact/utils";
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
  startingPoint?: number;
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
  status: string;
  direction?: string;
  directionPattern?: { arrows: ArrowType[] };
};

type Panel = {
  header: string;
  panel: ReactNode;
  icon: string | IconType<TabPanel> | ReactNode;
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

type Doctor = {
  id: number;
  firstName: string;
  middleName: string;
  lastName: string;

  specializationId: number;
};

type ArrowDimension = {
  pointerLength: number;
  pointerWidth: number;
  strokeWidth: number;
  stroke: string;
  fill: string;
};

type RoomImage = {
  id: number;
  imageLocation: string;
};

// For the OrderPage.tsx file
// These types are used to define the structure of services, departments, and cart items

type Item = {
  code: string;
  description: string;
};

interface Department {
  id: number;
  name: string;
  code?: string;
  icon: string;
  serviceCount: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  currency: string;
  departmentId: number;
  departmentName: string;
  isActive: boolean;
  isPopular: boolean;
  duration?: number;
  requiresPreparation: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface CartItem extends Service {
  quantity: number;
  subtotal: number;
}

type SubCart = {
  departmentId: number;
  departmentName: string;
  departmentIcon: string;
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
  selectedDoctorId: number | null;
  selectedDoctorName: string | null;
};

export type {
  Service,
  SubCart,
  CartItem,
  Item,
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
  Doctor,
  RoomImage,
};
