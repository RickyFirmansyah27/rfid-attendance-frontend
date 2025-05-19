
export interface User {
  id: string;
  rfidTag: string;
  name: string;
  department: string;
  position: string;
  imageUrl: string;
}

export interface AttendanceRecord {
  id: string;
  userId: string;
  idCard: string;
  userName: string;
  timestamp: string;
  timeIn: string;
  timeOut: string;
  status: "SUCCESS" | "FAILED";
}

export interface AuthUser {
  username: string;
  password: string;
  role: "ADMIN" | "USER";
}
