import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RoleCard } from "@/components/ui/RoleCard";
import { Header } from "@/components/layout/Header";

export default function RoleSelection() {
  const [selectedRole, setSelectedRole] = useState<"teacher" | "student" | null>(null);
  const navigate = useNavigate();

  const handleContinue = () => {
    if (selectedRole === "teacher") {
      navigate("/teacher");
    } else if (selectedRole === "student") {
      navigate("/student");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <main className="relative pt-32 pb-16 px-6">
        <div className="container mx-auto max-w-4xl">
          {/* Hero Section */}
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="font-display text-5xl md:text-6xl font-bold text-foreground mb-6">
              Welcome to{" "}
              <span className="gradient-text">AttendRevolution</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Modern attendance tracking made simple. Select your role to get started.
            </p>
          </div>

          {/* Role Selection Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
              <RoleCard
                icon={<GraduationCap className="w-10 h-10" />}
                title="Teacher"
                description="Create sessions, generate QR codes, and track student attendance in real-time"
                selected={selectedRole === "teacher"}
                onClick={() => setSelectedRole("teacher")}
              />
            </div>
            <div className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <RoleCard
                icon={<Users className="w-10 h-10" />}
                title="Student"
                description="Mark your attendance by scanning QR codes or entering session codes"
                selected={selectedRole === "student"}
                onClick={() => setSelectedRole("student")}
              />
            </div>
          </div>

          {/* Continue Button */}
          <div className="flex justify-center animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <Button
              size="xl"
              disabled={!selectedRole}
              onClick={handleContinue}
              className="min-w-[200px] gap-2"
            >
              Continue
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
