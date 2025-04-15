
import { AttendanceRecord } from "@/types";

// Initial attendance data
export const initialAttendanceRecords: AttendanceRecord[] = [
  {
    id: "1",
    userId: "1",
    userName: "Budi Santoso",
    timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    type: "IN",
    status: "SUCCESS"
  },
  {
    id: "2",
    userId: "2",
    userName: "Siti Rahayu",
    timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    type: "IN",
    status: "SUCCESS"
  },
  {
    id: "3",
    userId: "3",
    userName: "Ahmad Wijaya",
    timestamp: new Date(Date.now() - 10800000).toISOString(), // 3 hours ago
    type: "IN",
    status: "SUCCESS"
  }
];
