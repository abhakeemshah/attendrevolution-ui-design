import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { QrCode, StopCircle, Clock, Users, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
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

interface AttendanceRecord {
  rollNo: number;
  markedAt: Date;
}

export default function SessionLive() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const { toast } = useToast();
  
  const sessionData: SessionData = location.state?.sessionData;
  
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [showStopDialog, setShowStopDialog] = useState(false);
  const [qrValue, setQrValue] = useState("");

  // Initialize timer and QR
  useEffect(() => {
    if (sessionData) {
      setTimeRemaining(sessionData.timerMinutes * 60);
      // Generate a unique QR value (in real app, this would come from backend)
      setQrValue(`ATTEND-${sessionData.id}-${Date.now()}`);
    }
  }, [sessionData]);

  // Timer countdown
  useEffect(() => {
    if (!isActive || timeRemaining <= 0) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setIsActive(false);
          handleSessionEnd();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, timeRemaining]);

  // Simulate students scanning (for demo purposes)
  useEffect(() => {
    if (!isActive || !sessionData) return;

    const simulateScans = setInterval(() => {
      const randomRoll = Math.floor(Math.random() * sessionData.expectedBatch) + 1;
      if (!attendance.find(a => a.rollNo === randomRoll)) {
        setAttendance(prev => [...prev, { rollNo: randomRoll, markedAt: new Date() }]);
      }
    }, 3000);

    return () => clearInterval(simulateScans);
  }, [isActive, sessionData, attendance]);

  const handleSessionEnd = useCallback(async () => {
    // In real app, this would POST to /api/v1/attendance with all records
    console.log("Session ended. Saving attendance to MongoDB:", {
      sessionId: sessionData?.id,
      attendance: attendance.map(a => a.rollNo),
    });

    toast({
      title: "Session Ended",
      description: `Attendance saved. ${attendance.length} students marked present.`,
    });
  }, [attendance, sessionData, toast]);

  const handleStopSession = () => {
    setShowStopDialog(true);
  };

  const confirmStopSession = () => {
    setIsActive(false);
    setShowStopDialog(false);
    handleSessionEnd();
    setTimeout(() => navigate("/"), 2000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (!sessionData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Session data not found. Please create a new session.</p>
      </div>
    );
  }

  // Create roll number boxes
  const rollBoxes = Array.from({ length: sessionData.expectedBatch }, (_, i) => i + 1);
  const markedRolls = new Set(attendance.map(a => a.rollNo));

  return (
    <div className="min-h-screen bg-background">
      <main className="p-6">
        <div className="container mx-auto">
          {/* Header Info */}
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-display font-bold mb-2">
              {sessionData.courseName}
            </h1>
            <p className="text-muted-foreground">
              {sessionData.className} {sessionData.group && `(${sessionData.group})`} • {sessionData.sessionType} • {sessionData.date}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Side - Roll Number Boxes */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Attendance Grid
                  <span className="ml-auto text-sm font-normal text-muted-foreground">
                    {attendance.length} / {sessionData.expectedBatch}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-8 sm:grid-cols-10 gap-2">
                  {rollBoxes.map((rollNo) => (
                    <div
                      key={rollNo}
                      className={`
                        aspect-square flex items-center justify-center rounded-md text-sm font-medium
                        transition-all duration-300
                        ${markedRolls.has(rollNo) 
                          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30" 
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

            {/* Right Side - QR Code & Timer */}
            <div className="space-y-6">
              {/* QR Code Card */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <QrCode className="w-5 h-5 text-primary" />
                    Scan to Mark Attendance
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                  {/* Placeholder QR Code */}
                  <div className="w-64 h-64 bg-foreground rounded-lg flex items-center justify-center mb-4">
                    <div className="w-56 h-56 bg-background rounded flex items-center justify-center">
                      <div className="grid grid-cols-8 gap-0.5">
                        {Array.from({ length: 64 }).map((_, i) => (
                          <div
                            key={i}
                            className={`w-6 h-6 ${Math.random() > 0.5 ? "bg-foreground" : "bg-background"}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground text-center">
                    QR Code: {qrValue.slice(0, 20)}...
                  </p>
                </CardContent>
              </Card>

              {/* Timer Card */}
              <Card className={`bg-card border-border ${!isActive ? "opacity-60" : ""}`}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-primary" />
                      <span className="font-medium">Time Remaining</span>
                    </div>
                    <span className={`text-3xl font-display font-bold ${timeRemaining < 60 ? "text-destructive" : "text-primary"}`}>
                      {formatTime(timeRemaining)}
                    </span>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="w-full bg-secondary rounded-full h-2 mb-4">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-1000"
                      style={{ 
                        width: `${(timeRemaining / (sessionData.timerMinutes * 60)) * 100}%` 
                      }}
                    />
                  </div>

                  {/* Stop Button */}
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
                </CardContent>
              </Card>

              {/* Session Complete Message */}
              {!isActive && (
                <Card className="bg-success/10 border-success">
                  <CardContent className="pt-6 flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-success" />
                    <div>
                      <p className="font-medium text-success">Session Completed</p>
                      <p className="text-sm text-muted-foreground">
                        Attendance has been saved to the database.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
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
            <AlertDialogAction onClick={confirmStopSession} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              End Session
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
