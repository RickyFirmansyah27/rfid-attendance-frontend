
import React, { useState } from "react";
import RFIDScanner from "@/components/RFIDScanner";
import AttendanceHistory from "@/components/AttendanceHistory";
import { AttendanceRecord, User } from "@/types";
import { initialAttendanceRecords } from "@/data/attendance";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Users, UserCheck, Activity } from "lucide-react";

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
      <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">Dashboard</h1>
      
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500 shadow-md hover:shadow-lg transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-500" />
              Today's Check-ins
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayRecords.length}</div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-green-500 shadow-md hover:shadow-lg transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="h-4 w-4 text-green-500" />
              Unique Attendees Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueUsersToday}</div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-purple-500 shadow-md hover:shadow-lg transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-purple-500" />
              Total Records
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attendanceRecords.length}</div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-amber-500 shadow-md hover:shadow-lg transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Activity className="h-4 w-4 text-amber-500" />
              Attendance Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueUsersToday > 0 ? Math.round((uniqueUsersToday / 10) * 100) : 0}%</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-1">
          <RFIDScanner onSuccessfulScan={handleSuccessfulScan} />
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-1">
          <AttendanceHistory records={attendanceRecords} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
