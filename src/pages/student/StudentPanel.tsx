import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, QrCode, Keyboard, CheckCircle2, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/StatusBadge";

interface AttendanceRecord {
  id: string;
  sessionName: string;
  date: string;
  status: "present" | "absent";
}

const mockHistory: AttendanceRecord[] = [
  { id: "1", sessionName: "Mathematics 101", date: "Jan 5, 2026", status: "present" },
  { id: "2", sessionName: "Physics Lab", date: "Jan 4, 2026", status: "present" },
  { id: "3", sessionName: "Chemistry Lecture", date: "Jan 3, 2026", status: "absent" },
  { id: "4", sessionName: "Biology Workshop", date: "Jan 2, 2026", status: "present" },
];

export default function StudentPanel() {
  const navigate = useNavigate();
  const [studentId, setStudentId] = useState("");
  const [sessionCode, setSessionCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<"mark" | "history">("mark");

  const handleMarkAttendance = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call to POST /api/v1/attendance
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header userRole="student" onLogout={() => navigate("/")} />

      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <main className="relative pt-24 pb-16 px-6">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">
              Student Panel
            </h1>
            <p className="text-muted-foreground">
              Mark your attendance or view your history
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center gap-2 mb-8">
            <Button
              variant={activeTab === "mark" ? "default" : "ghost"}
              onClick={() => setActiveTab("mark")}
              className="gap-2"
            >
              <QrCode className="w-4 h-4" />
              Mark Attendance
            </Button>
            <Button
              variant={activeTab === "history" ? "default" : "ghost"}
              onClick={() => setActiveTab("history")}
              className="gap-2"
            >
              <History className="w-4 h-4" />
              History
            </Button>
          </div>

          {activeTab === "mark" ? (
            <div className="grid md:grid-cols-2 gap-6">
              {/* QR Scanner Option */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="font-display flex items-center gap-2">
                    <QrCode className="w-5 h-5 text-primary" />
                    Scan QR Code
                  </CardTitle>
                  <CardDescription>
                    Point your camera at the attendance QR code
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-square bg-secondary rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center">
                    <QrCode className="w-16 h-16 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground text-center px-4">
                      QR Scanner would open camera here
                    </p>
                    <Button variant="outline" className="mt-4">
                      Open Camera
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Manual Entry Option */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="font-display flex items-center gap-2">
                    <Keyboard className="w-5 h-5 text-primary" />
                    Enter Code Manually
                  </CardTitle>
                  <CardDescription>
                    Type in your student ID and session code
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {success ? (
                    <div className="flex flex-col items-center justify-center py-12 animate-scale-in">
                      <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center mb-4">
                        <CheckCircle2 className="w-10 h-10 text-success" />
                      </div>
                      <h3 className="text-xl font-bold text-foreground mb-2">
                        Attendance Marked!
                      </h3>
                      <p className="text-muted-foreground text-center">
                        Your attendance has been recorded successfully
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleMarkAttendance} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="studentId">Student ID</Label>
                        <Input
                          id="studentId"
                          value={studentId}
                          onChange={(e) => setStudentId(e.target.value)}
                          placeholder="Enter your student ID"
                          required
                          className="bg-secondary border-border"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="sessionCode">Session Code</Label>
                        <Input
                          id="sessionCode"
                          value={sessionCode}
                          onChange={(e) => setSessionCode(e.target.value.toUpperCase())}
                          placeholder="e.g., MTH-5K9X"
                          required
                          className="bg-secondary border-border font-mono tracking-wider"
                        />
                      </div>
                      <Button
                        type="submit"
                        size="lg"
                        disabled={isSubmitting}
                        className="w-full gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                            Marking Attendance...
                          </>
                        ) : (
                          <>
                            Mark Attendance
                            <ArrowRight className="w-5 h-5" />
                          </>
                        )}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
            /* History Tab */
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="font-display">Attendance History</CardTitle>
                <CardDescription>Your recent attendance records</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockHistory.map((record) => (
                    <div
                      key={record.id}
                      className="flex items-center justify-between p-4 rounded-xl bg-secondary/50"
                    >
                      <div>
                        <h3 className="font-medium text-foreground">{record.sessionName}</h3>
                        <p className="text-sm text-muted-foreground">{record.date}</p>
                      </div>
                      <StatusBadge status={record.status}>
                        {record.status === "present" ? "Present" : "Absent"}
                      </StatusBadge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
