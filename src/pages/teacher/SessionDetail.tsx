import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Download, RefreshCw, Users, CheckCircle2, XCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/StatusBadge";

interface Student {
  id: string;
  name: string;
  studentId: string;
  status: "present" | "absent" | "pending";
  markedAt?: string;
}

const mockStudents: Student[] = [
  { id: "1", name: "Alice Johnson", studentId: "STU001", status: "present", markedAt: "09:05 AM" },
  { id: "2", name: "Bob Smith", studentId: "STU002", status: "present", markedAt: "09:07 AM" },
  { id: "3", name: "Carol Williams", studentId: "STU003", status: "present", markedAt: "09:08 AM" },
  { id: "4", name: "David Brown", studentId: "STU004", status: "pending" },
  { id: "5", name: "Eve Davis", studentId: "STU005", status: "absent" },
  { id: "6", name: "Frank Miller", studentId: "STU006", status: "present", markedAt: "09:12 AM" },
  { id: "7", name: "Grace Wilson", studentId: "STU007", status: "pending" },
  { id: "8", name: "Henry Moore", studentId: "STU008", status: "present", markedAt: "09:15 AM" },
];

export default function SessionDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const presentCount = students.filter(s => s.status === "present").length;
  const absentCount = students.filter(s => s.status === "absent").length;
  const pendingCount = students.filter(s => s.status === "pending").length;

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate API call to GET /api/v1/sessions/:id/report
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const handleDownloadReport = () => {
    // Would call GET /api/v1/sessions/:id/report
    console.log("Downloading report for session:", id);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header userRole="teacher" onLogout={() => navigate("/")} />

      <main className="pt-24 pb-16 px-6">
        <div className="container mx-auto max-w-6xl">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => navigate("/teacher")}
            className="mb-6 gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* QR Code Section */}
            <Card className="lg:col-span-1 bg-card border-border">
              <CardHeader>
                <CardTitle className="font-display">Session QR Code</CardTitle>
                <CardDescription>Students scan this to mark attendance</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                {/* QR Code Placeholder - would be generated from GET /api/v1/sessions/:id/qrcode */}
                <div className="w-full aspect-square max-w-[280px] bg-secondary rounded-2xl border-2 border-dashed border-border flex items-center justify-center mb-6 relative overflow-hidden">
                  <div className="absolute inset-4 grid grid-cols-8 grid-rows-8 gap-1">
                    {Array.from({ length: 64 }).map((_, i) => (
                      <div
                        key={i}
                        className={`rounded-sm ${Math.random() > 0.5 ? "bg-foreground" : "bg-transparent"}`}
                      />
                    ))}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-card p-2 rounded-lg">
                      <span className="font-display font-bold text-primary text-sm">AR</span>
                    </div>
                  </div>
                </div>

                <div className="text-center mb-6">
                  <p className="text-sm text-muted-foreground mb-1">Session Code</p>
                  <p className="font-mono text-2xl font-bold text-primary tracking-wider">MTH-5K9X</p>
                </div>

                <div className="flex gap-3 w-full">
                  <Button variant="outline" className="flex-1 gap-2" onClick={handleRefresh}>
                    <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
                    Refresh
                  </Button>
                  <Button variant="secondary" className="flex-1 gap-2">
                    <Download className="w-4 h-4" />
                    Save
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Attendance List */}
            <Card className="lg:col-span-2 bg-card border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-display">Mathematics 101</CardTitle>
                    <CardDescription>January 5, 2026 • 09:00 AM</CardDescription>
                  </div>
                  <Button variant="outline" onClick={handleDownloadReport} className="gap-2">
                    <Download className="w-4 h-4" />
                    Export Report
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-success/10">
                    <CheckCircle2 className="w-5 h-5 text-success" />
                    <div>
                      <p className="font-bold text-foreground">{presentCount}</p>
                      <p className="text-xs text-muted-foreground">Present</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-destructive/10">
                    <XCircle className="w-5 h-5 text-destructive" />
                    <div>
                      <p className="font-bold text-foreground">{absentCount}</p>
                      <p className="text-xs text-muted-foreground">Absent</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-warning/10">
                    <Clock className="w-5 h-5 text-warning" />
                    <div>
                      <p className="font-bold text-foreground">{pendingCount}</p>
                      <p className="text-xs text-muted-foreground">Pending</p>
                    </div>
                  </div>
                </div>

                {/* Student List */}
                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                  {students.map((student) => (
                    <div
                      key={student.id}
                      className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                          <span className="text-sm font-semibold text-muted-foreground">
                            {student.name.split(" ").map(n => n[0]).join("")}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{student.name}</p>
                          <p className="text-sm text-muted-foreground">{student.studentId}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {student.markedAt && (
                          <span className="text-xs text-muted-foreground">{student.markedAt}</span>
                        )}
                        <StatusBadge status={student.status} pulse={student.status === "pending"}>
                          {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                        </StatusBadge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
