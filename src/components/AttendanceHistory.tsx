
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AttendanceRecord } from "@/types";
import { formatDistanceToNow, parseISO } from "date-fns";
import { ClipboardList } from "lucide-react";

interface AttendanceHistoryProps {
  records: AttendanceRecord[];
  limit?: number;
}

const AttendanceHistory: React.FC<AttendanceHistoryProps> = ({ 
  records, 
  limit = 5 
}) => {
  // Sort records by timestamp (newest first) and limit the number
  const displayRecords = [...records]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limit);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <ClipboardList className="h-5 w-5" />
          Recent Attendance
        </CardTitle>
      </CardHeader>
      <CardContent>
        {displayRecords.length === 0 ? (
          <div className="text-center p-4 text-gray-500">
            No attendance records yet
          </div>
        ) : (
          <div className="space-y-3">
            {displayRecords.map((record) => (
              <div 
                key={record.id} 
                className={`
                  p-3 rounded-md border flex justify-between items-center
                  ${record.status === "SUCCESS" ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}
                `}
              >
                <div>
                  <h4 className="font-medium">{record.userName}</h4>
                  <div className="flex gap-2 text-sm text-gray-600">
                    <span className={`
                      px-1.5 py-0.5 rounded-full text-xs
                      ${record.type === "IN" ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}
                    `}>
                      {record.type}
                    </span>
                    <time dateTime={record.timestamp}>
                      {formatDistanceToNow(parseISO(record.timestamp), { addSuffix: true })}
                    </time>
                  </div>
                </div>
                <div className={`
                  rounded-full w-2 h-2
                  ${record.status === "SUCCESS" ? "bg-green-500" : "bg-red-500"}
                `} />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AttendanceHistory;
