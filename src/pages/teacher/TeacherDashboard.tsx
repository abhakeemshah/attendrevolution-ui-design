import { useState } from "react";
import { Plus, QrCode, Users, FileText, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface Session {
  id: string;
  name: string;
  date: string;
  attendees: number;
  total: number;
  status: "active" | "completed";
}

const mockSessions: Session[] = [
  { id: "1", name: "Mathematics 101", date: "2026-01-05 09:00", attendees: 28, total: 35, status: "active" },
  { id: "2", name: "Physics Lab", date: "2026-01-04 14:00", attendees: 22, total: 25, status: "completed" },
  { id: "3", name: "Chemistry Lecture", date: "2026-01-03 11:00", attendees: 30, total: 32, status: "completed" },
];

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const [sessions] = useState<Session[]>(mockSessions);

  return (
    <div className="min-h-screen bg-background">
      <Header userRole="teacher" onLogout={() => navigate("/")} />

      <main className="pt-24 pb-16 px-6">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="font-display text-3xl font-bold text-foreground mb-2">
                Teacher Dashboard
              </h1>
              <p className="text-muted-foreground">
                Manage your sessions and track attendance
              </p>
            </div>
            <Button size="lg" onClick={() => navigate("/teacher/create")} className="gap-2">
              <Plus className="w-5 h-5" />
              New Session
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            <Card className="bg-card border-border">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{sessions.filter(s => s.status === "active").length}</p>
                    <p className="text-sm text-muted-foreground">Active Sessions</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-success/10">
                    <Users className="w-6 h-6 text-success" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{sessions.reduce((a, s) => a + s.attendees, 0)}</p>
                    <p className="text-sm text-muted-foreground">Total Attendees</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-accent/10">
                    <FileText className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{sessions.length}</p>
                    <p className="text-sm text-muted-foreground">Total Sessions</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sessions List */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-xl font-display">Recent Sessions</CardTitle>
              <CardDescription>Click on a session to view details and QR code</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    onClick={() => navigate(`/teacher/session/${session.id}`)}
                    className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 hover:bg-secondary cursor-pointer transition-all duration-200 group"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full ${session.status === "active" ? "bg-success animate-pulse" : "bg-muted-foreground"}`} />
                      <div>
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {session.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">{session.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="font-semibold text-foreground">
                          {session.attendees}/{session.total}
                        </p>
                        <p className="text-xs text-muted-foreground">attendees</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <QrCode className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <FileText className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
