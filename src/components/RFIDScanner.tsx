
import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { users } from "@/data/users";
import { AttendanceRecord, User } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { AlertCircle, CheckCircle, Clock } from "lucide-react";

interface RFIDScannerProps {
  onSuccessfulScan: (user: User, record: AttendanceRecord) => void;
}

const RFIDScanner: React.FC<RFIDScannerProps> = ({ onSuccessfulScan }) => {
  const [rfidInput, setRfidInput] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [lastScannedUser, setLastScannedUser] = useState<User | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Auto-focus the input field when component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleScan = () => {
    if (!rfidInput) return;

    // Find user with matching RFID tag
    const user = users.find((user) => user.rfidTag === rfidInput);

    if (user) {
      // Create attendance record
      const newRecord: AttendanceRecord = {
        id: Date.now().toString(),
        userId: user.id,
        userName: user.name,
        timestamp: new Date().toISOString(),
        type: "IN", // You could determine IN/OUT based on previous records
        status: "SUCCESS",
      };

      // Update state and invoke callback
      setStatus("success");
      setLastScannedUser(user);
      onSuccessfulScan(user, newRecord);
      
      toast({
        title: "Attendance Recorded",
        description: `${user.name} has been checked in.`,
        variant: "default",
      });

      // Reset after success
      setTimeout(() => {
        setStatus("idle");
        setRfidInput("");
        inputRef.current?.focus();
      }, 2000);
    } else {
      // Handle error - unknown RFID tag
      setStatus("error");
      
      toast({
        title: "Unknown RFID Card",
        description: "This card is not registered in the system.",
        variant: "destructive",
      });
      
      // Reset after error
      setTimeout(() => {
        setStatus("idle");
        setRfidInput("");
        inputRef.current?.focus();
      }, 2000);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleScan();
    }
  };

  return (
    <Card className={`
      transition-all duration-300
      ${status === "success" ? "border-green-500 bg-green-50" : ""}
      ${status === "error" ? "border-red-500 bg-red-50" : ""}
    `}>
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          {status === "idle" && <Clock className="h-5 w-5" />}
          {status === "success" && <CheckCircle className="h-5 w-5 text-green-500" />}
          {status === "error" && <AlertCircle className="h-5 w-5 text-red-500" />}
          RFID Attendance Scanner
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex space-x-2">
            <Input
              ref={inputRef}
              value={rfidInput}
              onChange={(e) => setRfidInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Scan RFID Card"
              className={`
                font-mono text-center transition-all 
                ${status === "success" ? "border-green-500 bg-green-100" : ""}
                ${status === "error" ? "border-red-500 bg-red-100" : ""}
              `}
              disabled={status !== "idle"}
              autoFocus
            />
            <Button onClick={handleScan} disabled={status !== "idle" || !rfidInput}>
              Scan
            </Button>
          </div>
          
          {lastScannedUser && status === "success" && (
            <div className="bg-green-100 p-4 rounded-md flex items-center gap-4">
              <img 
                src={lastScannedUser.imageUrl} 
                alt={lastScannedUser.name} 
                className="w-16 h-16 rounded-full object-cover border-2 border-green-500"
              />
              <div>
                <h3 className="font-medium text-lg">{lastScannedUser.name}</h3>
                <p className="text-sm text-gray-600">{lastScannedUser.department}</p>
                <p className="text-sm text-gray-600">{lastScannedUser.position}</p>
              </div>
            </div>
          )}
          
          {status === "error" && (
            <div className="bg-red-100 p-4 rounded-md">
              <p className="text-red-700 font-medium">Error: Card not recognized</p>
              <p className="text-sm text-red-600">Please try again or contact an administrator.</p>
            </div>
          )}
          
          {status === "idle" && (
            <div className="text-center text-gray-500 text-sm">
              <p>Please scan your RFID card or enter the ID manually and press Enter.</p>
              <p className="mt-2">Test IDs: A1B2C3D4, E5F6G7H8, I9J0K1L2</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RFIDScanner;
