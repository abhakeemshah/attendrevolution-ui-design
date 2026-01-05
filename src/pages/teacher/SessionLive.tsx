/**
 * SessionLive.tsx
 * ================
 * Live attendance session page for teachers
 * 
 * Layout:
 * - LEFT: Roll number grid (smaller boxes to fit screen)
 * - RIGHT: QR code with circular progress ring around it, timer below
 * 
 * Features:
 * - Real-time attendance marking (boxes turn green when marked)
 * - Countdown timer with progress visualization
 * - End session early option
 * - Success message with download option when complete
 * 
 * Note: Teacher cannot refresh or save QR manually - it's displayed automatically
 */

import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { QrCode, StopCircle, Clock, Users, CheckCircle2, Download, Home, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Session data structure passed from CreateSession
interface SessionData {
  id: string;
  teacherId: string;
  semester: string;
  year: string;
  shift: string;
  className: string;
  group: string | null;
  date: string;
  sessionType: string;
  courseName: string;
  expectedBatch: number;
  timerMinutes: number;
  timeFrom: string;
  timeTo: string;
  notes: string | null;
}

// Attendance record for each student
interface AttendanceRecord {
  rollNo: number;
  markedAt: Date;
}

export default function SessionLive() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  
  // Session data from navigation state
  const sessionData: SessionData = location.state?.sessionData;
  
  // Timer state
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [isActive, setIsActive] = useState(true);
  
  // Attendance tracking
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  
  // UI state
  const [showStopDialog, setShowStopDialog] = useState(false);
  const [sessionEnded, setSessionEnded] = useState(false);
  const [qrValue, setQrValue] = useState("");

  // Initialize timer and QR on mount
  useEffect(() => {
    if (sessionData) {
      const totalSeconds = sessionData.timerMinutes * 60;
      setTimeRemaining(totalSeconds);
      setTotalTime(totalSeconds);
      // Generate unique QR value (in production, this comes from backend)
      setQrValue(`ATTEND-${sessionData.id}-${Date.now()}`);
    }
  }, [sessionData]);

  // Countdown timer logic
  useEffect(() => {
    if (!isActive || timeRemaining <= 0) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setIsActive(false);
          endSession();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, timeRemaining]);

  // Simulate students scanning QR (demo only - remove in production)
  useEffect(() => {
    if (!isActive || !sessionData) return;

    const simulateScans = setInterval(() => {
      // Random roll number within batch size
      const randomRoll = Math.floor(Math.random() * sessionData.expectedBatch) + 1;
      
      // Only add if not already marked
      setAttendance(prev => {
        if (prev.find(a => a.rollNo === randomRoll)) return prev;
        return [...prev, { rollNo: randomRoll, markedAt: new Date() }];
      });
    }, 2000);

    return () => clearInterval(simulateScans);
  }, [isActive, sessionData]);

  /**
   * End the session and save attendance
   * In production: POST to /api/v1/attendance with session data
   */
  const endSession = useCallback(() => {
    setIsActive(false);
    setSessionEnded(true);
    
    // Log attendance data (would be API call in production)
    console.log("Session ended. Saving to MongoDB:", {
      sessionId: sessionData?.id,
      teacherId: sessionData?.teacherId,
      attendance: attendance.map(a => ({ rollNo: a.rollNo, time: a.markedAt })),
      totalPresent: attendance.length,
      totalExpected: sessionData?.expectedBatch,
    });
  }, [attendance, sessionData]);

  // Handle early session end request
  const handleStopSession = () => setShowStopDialog(true);

  // Confirm and execute early end
  const confirmStopSession = () => {
    setShowStopDialog(false);
    endSession();
  };

  /**
   * Format seconds to MM:SS display
   */
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  /**
   * Download attendance report as CSV
   */
  const downloadReport = () => {
    const csvContent = [
      "Roll No,Marked At",
      ...attendance
        .sort((a, b) => a.rollNo - b.rollNo)
        .map(a => `${a.rollNo},${a.markedAt.toISOString()}`)
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `attendance-${sessionData?.id}.csv`;
    link.click();
  };

  // Error state: No session data
  if (!sessionData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="bg-card border-border max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="w-12 h-12 text-primary mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">Session data not found. Please create a new session.</p>
            <Button onClick={() => navigate("/")} className="gap-2">
              <Home className="w-4 h-4" />
              Go Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Create roll number boxes array
  const rollBoxes = Array.from({ length: sessionData.expectedBatch }, (_, i) => i + 1);
  const markedRolls = new Set(attendance.map(a => a.rollNo));
  
  // Calculate progress percentage for circular ring
  const progressPercent = totalTime > 0 ? (timeRemaining / totalTime) * 100 : 0;
  const circumference = 2 * Math.PI * 120; // Circle radius = 120
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <div className="min-h-screen bg-background">
      <main className="p-4 md:p-6">
        <div className="container mx-auto">
          
          {/* Session Header Info */}
          <div className="mb-4 text-center">
            <h1 className="text-xl md:text-2xl font-display font-bold mb-1">
              {sessionData.courseName}
            </h1>
            <p className="text-muted-foreground text-sm">
              {sessionData.className} {sessionData.group && `(${sessionData.group})`} • {sessionData.sessionType} • {sessionData.date}
            </p>
          </div>

          {/* === Success State: Session Completed === */}
          {sessionEnded && (
            <div className="fixed inset-0 bg-background/90 backdrop-blur-sm flex items-center justify-center z-50 p-6">
              <Card className="bg-card border-primary/30 max-w-md w-full animate-fade-in">
                <CardContent className="pt-8 pb-8 text-center">
                  <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-primary" />
                  </div>
                  <h2 className="text-2xl font-display font-bold text-foreground mb-2">
                    Attendance Saved!
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    {attendance.length} of {sessionData.expectedBatch} students marked present
                  </p>
                  
                  {/* Action buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button onClick={downloadReport} variant="outline" className="flex-1 gap-2">
                      <Download className="w-4 h-4" />
                      Download Report
                    </Button>
                    <Button onClick={() => navigate("/")} className="flex-1 gap-2">
                      <Home className="w-4 h-4" />
                      Leave
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* === Main Content: Left (Boxes) + Right (QR) === */}
          <div className="grid lg:grid-cols-2 gap-4 md:gap-6">
            
            {/* LEFT SIDE: Attendance Roll Number Grid */}
            <Card className="bg-card border-border order-2 lg:order-1">
              <CardHeader className="py-3 px-4">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Users className="w-4 h-4 text-primary" />
                  Attendance
                  <span className="ml-auto text-sm font-normal text-muted-foreground">
                    {attendance.length} / {sessionData.expectedBatch}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                {/* Grid of small roll number boxes */}
                <div className="grid grid-cols-10 sm:grid-cols-12 md:grid-cols-15 gap-1">
                  {rollBoxes.map((rollNo) => (
                    <div
                      key={rollNo}
                      className={`
                        w-7 h-7 flex items-center justify-center rounded text-xs font-medium
                        transition-all duration-300
                        ${markedRolls.has(rollNo) 
                          ? "bg-primary text-primary-foreground" 
                          : "bg-secondary text-muted-foreground border border-border"
                        }
                      `}
                    >
                      {rollNo}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* RIGHT SIDE: QR Code with Progress Ring + Timer */}
            <div className="space-y-4 order-1 lg:order-2">
              
              {/* QR Code with circular progress ring */}
              <Card className="bg-card border-border">
                <CardHeader className="py-3 px-4">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <QrCode className="w-4 h-4 text-primary" />
                    Scan to Mark Attendance
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center pb-6">
                  
                  {/* QR with circular progress ring around it */}
                  <div className="relative w-64 h-64 flex items-center justify-center">
                    {/* Circular progress ring (SVG) */}
                    <svg className="absolute w-full h-full -rotate-90">
                      {/* Background circle */}
                      <circle
                        cx="128"
                        cy="128"
                        r="120"
                        fill="none"
                        stroke="hsl(var(--secondary))"
                        strokeWidth="8"
                      />
                      {/* Progress circle */}
                      <circle
                        cx="128"
                        cy="128"
                        r="120"
                        fill="none"
                        stroke="hsl(var(--primary))"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        className="transition-all duration-1000"
                      />
                    </svg>
                    
                    {/* QR Code placeholder inside the ring */}
                    <div className="w-44 h-44 bg-foreground rounded-lg flex items-center justify-center">
                      <div className="w-40 h-40 bg-background rounded flex items-center justify-center">
                        {/* Simulated QR pattern */}
                        <div className="grid grid-cols-8 gap-0.5">
                          {Array.from({ length: 64 }).map((_, i) => (
                            <div
                              key={i}
                              className={`w-4 h-4 ${Math.random() > 0.5 ? "bg-foreground" : "bg-background"}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Timer display - directly under QR */}
                  <div className="mt-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Time Remaining</p>
                    <span className={`text-4xl font-display font-bold ${timeRemaining < 60 ? "text-destructive" : "text-primary"}`}>
                      {formatTime(timeRemaining)}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* End Session Button */}
              <Button
                variant="destructive"
                size="lg"
                onClick={handleStopSession}
                disabled={!isActive}
                className="w-full gap-2"
              >
                <StopCircle className="w-5 h-5" />
                End Session Early
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Stop Confirmation Dialog */}
      <AlertDialog open={showStopDialog} onOpenChange={setShowStopDialog}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>End Session Early?</AlertDialogTitle>
            <AlertDialogDescription>
              This will stop the attendance session and save all recorded attendance. 
              Students will no longer be able to mark their attendance.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continue Session</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmStopSession} 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              End Session
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
