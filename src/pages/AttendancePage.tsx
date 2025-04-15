
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AttendanceRecord } from "@/types";
import { initialAttendanceRecords } from "@/data/attendance";
import { format, parseISO } from "date-fns";
import { Search, RefreshCw } from "lucide-react";

const AttendancePage: React.FC = () => {
  const [records] = useState<AttendanceRecord[]>(initialAttendanceRecords);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  // Filter records based on search term and date
  const filteredRecords = records.filter(record => {
    const matchesSearch = searchTerm === "" || 
      record.userName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDate = dateFilter === "" || 
      format(parseISO(record.timestamp), "yyyy-MM-dd") === dateFilter;
    
    return matchesSearch && matchesDate;
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Attendance Records</h1>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Attendance Log</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 flex space-x-2">
                <Input
                  placeholder="Search by name"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1"
                />
                <Button variant="outline" size="icon">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex space-x-2">
                <Input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setDateFilter("")}
                  disabled={!dateFilter}
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                        No records found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium">{record.userName}</TableCell>
                        <TableCell>{format(parseISO(record.timestamp), "yyyy-MM-dd")}</TableCell>
                        <TableCell>{format(parseISO(record.timestamp), "HH:mm:ss")}</TableCell>
                        <TableCell>
                          <span className={`
                            px-2 py-1 rounded-full text-xs
                            ${record.type === "IN" ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}
                          `}>
                            {record.type}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className={`
                            px-2 py-1 rounded-full text-xs
                            ${record.status === "SUCCESS" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                          `}>
                            {record.status}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendancePage;
