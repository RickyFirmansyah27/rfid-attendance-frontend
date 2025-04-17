
import { AttendanceRecord } from "@/types";

// Initial attendance data
export const initialAttendanceRecords: AttendanceRecord[] = [
  {
    id: "1",
    userId: "1",
    userName: "Budi Santoso",
    idCard: "1234567890",
    timestamp: "2025-04-12T08:00:00.000Z",
    timeIn: "09:00:00", 
    timeOut: "17:00:00",
    status: "SUCCESS"
  },
  {
    id: "2",
    userId: "2",
    idCard: "9876543210",
    userName: "Siti Rahayu",
    timestamp: "2025-04-12T08:00:00.000Z",
    timeIn: "09:00:00", 
    timeOut: "17:00:00",
    status: "SUCCESS"
  },
  {
    id: "3",
    userId: "3",
    idCard: "4567890123",
    userName: "Ahmad Wijaya",
    timestamp: "2025-04-12T08:00:00.000Z",
    timeIn: "09:00:00", 
    timeOut: "17:00:00",
    status: "SUCCESS"
  }
];
