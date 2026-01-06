/**
 * SessionLive.tsx
 * ================
 * Live attendance session page for teachers
 * 
 * Layout (as per reference image):
 * - Side by side: LEFT = Attendance tracking, RIGHT = QR Code
 * - Timer directly under QR (no circular progress ring)
 * - Mobile: stacked layout (QR on top)
 * 
 * Features:
 * - Real-time attendance marking (boxes turn blue when marked)
 * - Countdown timer display
 * - End session early option
 * - Success overlay with download option
 */

import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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

// Session data interface
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

// Attendance record interface
interface AttendanceRecord {
  rollNo: number;
  markedAt: Date;
}

export default function SessionLive() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Session data from navigation
  const sessionData: SessionData = location.state?.sessionData;
  
  // Timer state
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isActive, setIsActive] = useState(true);
  
  // Attendance tracking
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  
  // UI state
  const [showStopDialog, setShowStopDialog] = useState(false);
  const [sessionEnded, setSessionEnded] = useState(false);

  // Initialize timer on mount
  useEffect(() => {
    if (sessionData) {
      setTimeRemaining(sessionData.timerMinutes * 60);
    }
  }, [sessionData]);

  // Countdown timer
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

  // Simulate students scanning (demo only)
  useEffect(() => {
    if (!isActive || !sessionData) return;

    const simulateScans = setInterval(() => {
      const randomRoll = Math.floor(Math.random() * sessionData.expectedBatch) + 1;
      
      setAttendance(prev => {
        if (prev.find(a => a.rollNo === randomRoll)) return prev;
        return [...prev, { rollNo: randomRoll, markedAt: new Date() }];
      });
    }, 2000);

    return () => clearInterval(simulateScans);
  }, [isActive, sessionData]);

  // End session and save attendance
  const endSession = useCallback(() => {
    setIsActive(false);
    setSessionEnded(true);
    
    console.log("Session ended. Saving:", {
      sessionId: sessionData?.id,
      attendance: attendance.map(a => ({ rollNo: a.rollNo, time: a.markedAt })),
      totalPresent: attendance.length,
    });
  }, [attendance, sessionData]);

  const handleStopSession = () => setShowStopDialog(true);

  const confirmStopSession = () => {
    setShowStopDialog(false);
    endSession();
  };

  // Format seconds to MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Download CSV report
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

  // Error: No session data
  if (!sessionData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="bg-card border-border max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="w-12 h-12 text-primary mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">Session not found. Please create a new session.</p>
            <Button onClick={() => navigate("/")} className="gap-2">
              <Home className="w-4 h-4" />
              Go Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Create roll number boxes
  const rollBoxes = Array.from({ length: sessionData.expectedBatch }, (_, i) => i + 1);
  const markedRolls = new Set(attendance.map(a => a.rollNo));

  return (
    <div className="min-h-screen bg-background">
      <main className="p-4 sm:p-6">
        <div className="container mx-auto max-w-6xl">
          
          {/* Session Header */}
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-primary/5 border border-primary/20 rounded-lg text-center">
            <h1 className="text-lg sm:text-xl font-display font-bold text-foreground">
              {sessionData.className} {sessionData.group && `(${sessionData.group})`} • {sessionData.sessionType} • {sessionData.date}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">{sessionData.courseName}</p>
          </div>

          {/* === Success Overlay === */}
          {sessionEnded && (
            <div className="fixed inset-0 bg-background/95 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <Card className="bg-card border-primary/20 max-w-md w-full animate-fade-in shadow-xl">
                <CardContent className="pt-8 pb-8 text-center">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-primary" />
                  </div>
                  <h2 className="text-2xl font-display font-bold text-foreground mb-2">
                    Attendance Saved!
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    {attendance.length} of {sessionData.expectedBatch} students marked present
                  </p>
                  
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

          {/* === Main Layout: Side by Side === */}
          <div className="grid lg:grid-cols-5 gap-4 sm:gap-6">
            
            {/* LEFT: Attendance Tracking (60% width on desktop) */}
            <Card className="bg-card border-border shadow-md lg:col-span-3 order-2 lg:order-1">
              <CardHeader className="py-3 px-4 border-b border-border">
                <CardTitle className="flex items-center justify-between text-base">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" />
                    <span>Live Attendance Tracking</span>
                  </div>
                  <span className="text-sm font-normal text-muted-foreground">
                    {attendance.length} / {sessionData.expectedBatch}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                {/* Roll number grid - small boxes */}
                <div className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 lg:grid-cols-10 xl:grid-cols-12 gap-1.5">
                  {rollBoxes.map((rollNo) => (
                    <div
                      key={rollNo}
                      className={`
                        aspect-square flex items-center justify-center rounded text-xs font-medium
                        transition-all duration-300 min-w-[28px]
                        ${markedRolls.has(rollNo) 
                          ? "bg-primary text-primary-foreground shadow-sm" 
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

            {/* RIGHT: QR Code + Timer (40% width on desktop) */}
            <div className="space-y-4 lg:col-span-2 order-1 lg:order-2">
              
              {/* QR Code Card */}
              <Card className="bg-card border-border shadow-md">
                <CardHeader className="py-3 px-4 border-b border-border">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <QrCode className="w-4 h-4 text-primary" />
                    QR Code
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 flex flex-col items-center">
                  
                  {/* QR Code display */}
                  <div className="w-full max-w-[200px] aspect-square bg-foreground rounded-lg flex items-center justify-center p-2">
                    <div className="w-full h-full bg-background rounded flex items-center justify-center">
                      {/* Simulated QR pattern */}
                      <div className="grid grid-cols-8 gap-0.5 p-2">
                        {Array.from({ length: 64 }).map((_, i) => (
                          <div
                            key={i}
                            className={`aspect-square ${Math.random() > 0.5 ? "bg-foreground" : "bg-background"}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Timer - directly under QR, no progress ring */}
                  <div className="mt-4 text-center">
                    <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm mb-1">
                      <Clock className="w-4 h-4" />
                      <span>Time Remaining</span>
                    </div>
                    <span className={`text-3xl sm:text-4xl font-display font-bold ${
                      timeRemaining < 60 ? "text-destructive" : "text-primary"
                    }`}>
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
        <AlertDialogContent className="bg-card border-border max-w-sm mx-4">
          <AlertDialogHeader>
            <AlertDialogTitle>End Session Early?</AlertDialogTitle>
            <AlertDialogDescription>
              This will stop the session and save all recorded attendance. 
              Students can no longer mark their attendance.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continue</AlertDialogCancel>
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
