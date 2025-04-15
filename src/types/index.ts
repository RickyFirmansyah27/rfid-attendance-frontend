
// User Types
export interface User {
  id: string;
  rfidTag: string;
  name: string;
  department: string;
  position: string;
  imageUrl: string;
}

// Attendance Types
export interface AttendanceRecord {
  id: string;
  userId: string;
  userName: string;
  timestamp: string;
  type: "IN" | "OUT";
  status: "SUCCESS" | "FAILED";
}

// Authentication Types
export interface AuthUser {
  username: string;
  password: string;
  role: "ADMIN" | "USER";
}
