
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AttendanceRecord } from "@/types";
import { initialAttendanceRecords } from "@/data/attendance";
import { users } from "@/data/users";
import { format, parseISO, startOfMonth, endOfMonth, subDays } from "date-fns";
import { FileSpreadsheet, Search, Calendar, BarChart, FileText } from "lucide-react";
import * as XLSX from 'xlsx';
import { toast } from "sonner";

const ReportsPage: React.FC = () => {
  const [records] = useState<AttendanceRecord[]>(initialAttendanceRecords);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [userFilter, setUserFilter] = useState("all");
  const [reportType, setReportType] = useState("daily");

  // Calculate start and end dates for month report
  const handleMonthReport = () => {
    const today = new Date();
    const firstDay = startOfMonth(today);
    const lastDay = endOfMonth(today);
    
    setStartDate(format(firstDay, "yyyy-MM-dd"));
    setEndDate(format(lastDay, "yyyy-MM-dd"));
    toast.success("Monthly report range selected");
  };

  // Set report for last 7 days
  const handleWeeklyReport = () => {
    const today = new Date();
    const lastWeek = subDays(today, 7);
    
    setStartDate(format(lastWeek, "yyyy-MM-dd"));
    setEndDate(format(today, "yyyy-MM-dd"));
    toast.success("Weekly report range selected");
  };

  // Filter records based on date range and user
  const filteredRecords = records.filter(record => {
    let matchesDateRange = true;
    
    if (startDate) {
      matchesDateRange = matchesDateRange && 
        format(parseISO(record.timestamp), "yyyy-MM-dd") >= startDate;
    }
    
    if (endDate) {
      matchesDateRange = matchesDateRange && 
        format(parseISO(record.timestamp), "yyyy-MM-dd") <= endDate;
    }
    
    const matchesUser = userFilter === "all" || record.userId === userFilter;
    
    return matchesDateRange && matchesUser;
  });

  // Export to Excel
  const exportToExcel = () => {
    // Prepare data for export
    const dataToExport = filteredRecords.map(record => {
      const user = users.find(u => u.id === record.userId);
      return {
        "Name": record.userName,
        "Department": user?.department || "",
        "Position": user?.position || "",
        "Date": format(parseISO(record.timestamp), "yyyy-MM-dd"),
        "Time": format(parseISO(record.timestamp), "HH:mm:ss"),
        "Type": record.type,
        "Status": record.status
      };
    });
    
    if (dataToExport.length === 0) {
      toast.warning("No data to export");
      return;
    }
    
    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    
    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance Report");
    
    // Generate report title
    let reportTitle = "Attendance_Report";
    if (startDate && endDate) {
      reportTitle += `_${startDate}_to_${endDate}`;
    }
    
    // Save file
    XLSX.writeFile(workbook, `${reportTitle}.xlsx`);
    toast.success("Report exported to Excel successfully!");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">Attendance Reports</h1>
      
      <Card className="shadow-lg border-t-4 border-t-green-500">
        <CardHeader className="bg-gray-50 dark:bg-gray-800 rounded-t-lg flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <BarChart className="h-5 w-5 text-green-500" />
            Generate Reports
          </CardTitle>
          <Button 
            variant="default" 
            className="bg-green-600 hover:bg-green-700 flex items-center gap-2 shadow-md"
            onClick={exportToExcel}
          >
            <FileSpreadsheet className="h-4 w-4" />
            <span>Export to Excel</span>
          </Button>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium mb-1 block">Report Type</label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily Report</SelectItem>
                    <SelectItem value="weekly">Weekly Report</SelectItem>
                    <SelectItem value="monthly">Monthly Report</SelectItem>
                    <SelectItem value="custom">Custom Range</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium mb-1 block">Start Date</label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium mb-1 block">End Date</label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium mb-1 block">Filter by User</label>
                <Select value={userFilter} onValueChange={setUserFilter}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Users" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    {users.map(user => (
                      <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <Button 
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 shadow-md"
                onClick={handleMonthReport}
              >
                <Calendar className="h-4 w-4" />
                <span>This Month</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="flex items-center gap-2 border-blue-200 hover:bg-blue-50"
                onClick={handleWeeklyReport}
              >
                <FileText className="h-4 w-4" />
                <span>Last 7 Days</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={() => toast.success("Search completed")}
              >
                <Search className="h-4 w-4" />
                <span>Search</span>
              </Button>
            </div>
            
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader className="bg-gray-50 dark:bg-gray-800">
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                        No records found for the selected criteria
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRecords.map((record) => {
                      const user = users.find(u => u.id === record.userId);
                      return (
                        <TableRow key={record.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                          <TableCell className="font-medium">{record.userName}</TableCell>
                          <TableCell>{user?.department || ""}</TableCell>
                          <TableCell>{format(parseISO(record.timestamp), "yyyy-MM-dd")}</TableCell>
                          <TableCell>{format(parseISO(record.timestamp), "HH:mm:ss")}</TableCell>
                          <TableCell>
                            <span className={`
                              px-2 py-1 rounded-full text-xs font-medium
                              ${record.type === "IN" ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}
                            `}>
                              {record.type}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className={`
                              px-2 py-1 rounded-full text-xs font-medium
                              ${record.status === "SUCCESS" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                            `}>
                              {record.status}
                            </span>
                          </TableCell>
                        </TableRow>
                      );
                    })
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

export default ReportsPage;
