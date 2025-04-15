
import React, { useState } from "react";
import RFIDScanner from "@/components/RFIDScanner";
import AttendanceHistory from "@/components/AttendanceHistory";
import { AttendanceRecord, User } from "@/types";
import { initialAttendanceRecords } from "@/data/attendance";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Users, UserCheck } from "lucide-react";

const Dashboard: React.FC = () => {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(initialAttendanceRecords);

  const handleSuccessfulScan = (user: User, record: AttendanceRecord) => {
    setAttendanceRecords(prev => [record, ...prev]);
  };

  // Calculate statistics
  const todayRecords = attendanceRecords.filter(record => {
    const recordDate = new Date(record.timestamp).toDateString();
    const today = new Date().toDateString();
    return recordDate === today;
  });

  const uniqueUsersToday = new Set(todayRecords.map(record => record.userId)).size;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Today's Check-ins
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayRecords.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="h-4 w-4" />
              Unique Attendees Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueUsersToday}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <UserCheck className="h-4 w-4" />
              Total Records
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attendanceRecords.length}</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <RFIDScanner onSuccessfulScan={handleSuccessfulScan} />
        <AttendanceHistory records={attendanceRecords} />
      </div>
    </div>
  );
};

export default Dashboard;
