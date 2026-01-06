/**
 * RoleSelection.tsx
 * =================
 * Landing page for AttendRevolution
 * Beautiful white/blue theme with clean typography
 * 
 * Features:
 * - Large, clickable role cards with avatars
 * - Teacher ID is treated as password (hidden input)
 * - Centered, themed error messages
 * - Responsive design for all devices
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap, BookOpen, AlertCircle, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Valid teacher IDs (passwords) - In production, verified via API
const VALID_TEACHER_IDS = ["T001", "T002", "T003", "TEACH123", "ADMIN"];

export default function RoleSelection() {
  const navigate = useNavigate();
  
  // Dialog visibility states
  const [showTeacherDialog, setShowTeacherDialog] = useState(false);
  const [showStudentDialog, setShowStudentDialog] = useState(false);
  
  // Form inputs
  const [teacherId, setTeacherId] = useState("");
  const [rollNo, setRollNo] = useState("");
  
  // Password visibility toggle for teacher ID
  const [showPassword, setShowPassword] = useState(false);
  
  // Error handling
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  // Open teacher dialog and reset state
  const handleTeacherClick = () => {
    setShowTeacherDialog(true);
    setTeacherId("");
    setError("");
    setShowPassword(false);
  };

  // Open student dialog and reset state
  const handleStudentClick = () => {
    setShowStudentDialog(true);
    setRollNo("");
    setError("");
  };

  /**
   * Verify teacher password against valid IDs
   * Shows centered error if invalid
   */
  const verifyTeacherId = async () => {
    if (!teacherId.trim()) {
      setError("Please enter your Teacher ID");
      return;
    }

    setIsVerifying(true);
    setError("");
    
    // Simulate API verification delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (VALID_TEACHER_IDS.includes(teacherId.toUpperCase())) {
      setShowTeacherDialog(false);
      // Pass ID securely - not displayed on next page
      navigate("/teacher/create", { state: { teacherId: teacherId.toUpperCase() } });
    } else {
      setError("ID is wrong. Please check and try again.");
    }
    
    setIsVerifying(false);
  };

  /**
   * Validate roll number and navigate to scan page
   */
  const verifyRollNo = async () => {
    const rollNumber = parseInt(rollNo);
    
    if (!rollNo.trim() || isNaN(rollNumber) || rollNumber <= 0) {
      setError("Please enter a valid Roll Number (greater than 0)");
      return;
    }

    setIsVerifying(true);
    setError("");
    await new Promise(resolve => setTimeout(resolve, 300));
    
    setShowStudentDialog(false);
    navigate("/student/scan", { state: { rollNo: rollNumber } });
    
    setIsVerifying(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      
      {/* === Decorative Background Elements === */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Soft blue gradient blobs */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 via-transparent to-accent/10" />
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        {/* Subtle grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), 
                              linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      {/* === Header with App Name === */}
      <div className="text-center mb-12 sm:mb-16 z-10 px-4">
        {/* Main title with beautiful typography */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-extrabold mb-4 tracking-tight">
          <span className="gradient-text">Attend</span>
          <span className="text-foreground">Revolution</span>
        </h1>
        {/* Tagline */}
        <p className="text-lg sm:text-xl text-muted-foreground font-light mb-6">
          The Future of Attendance Management
        </p>
        {/* Subtle role prompt */}
        <p className="text-sm text-muted-foreground/70">
          Select your role to continue
        </p>
      </div>

      {/* === Role Selection Cards - Large, Square, Clickable === */}
      <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 z-10 w-full max-w-lg sm:max-w-none sm:w-auto px-4 sm:px-0">
        
        {/* Teacher Card */}
        <button
          onClick={handleTeacherClick}
          className="group w-full sm:w-56 h-56 sm:h-64 bg-card border-2 border-border rounded-2xl p-6 
                     flex flex-col items-center justify-center gap-5
                     hover:border-primary hover:shadow-xl hover:shadow-primary/10 
                     transition-all duration-300 cursor-pointer hover:scale-[1.02]"
        >
          {/* Avatar circle with icon */}
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center 
                          group-hover:bg-primary/20 transition-colors">
            <BookOpen className="w-12 h-12 text-primary" />
          </div>
          <span className="text-xl font-display font-semibold text-foreground">
            Teacher
          </span>
        </button>

        {/* Student Card */}
        <button
          onClick={handleStudentClick}
          className="group w-full sm:w-56 h-56 sm:h-64 bg-card border-2 border-border rounded-2xl p-6 
                     flex flex-col items-center justify-center gap-5
                     hover:border-primary hover:shadow-xl hover:shadow-primary/10 
                     transition-all duration-300 cursor-pointer hover:scale-[1.02]"
        >
          {/* Avatar circle with icon */}
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center 
                          group-hover:bg-primary/20 transition-colors">
            <GraduationCap className="w-12 h-12 text-primary" />
          </div>
          <span className="text-xl font-display font-semibold text-foreground">
            Student
          </span>
        </button>
      </div>

      {/* === Teacher Password Dialog === */}
      <Dialog open={showTeacherDialog} onOpenChange={setShowTeacherDialog}>
        <DialogContent className="bg-card border-border max-w-sm mx-4">
          <DialogHeader>
            <DialogTitle className="text-xl font-display">Enter Teacher ID</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            {/* Password input with toggle visibility */}
            <div className="space-y-2">
              <Label htmlFor="teacherId">Teacher ID</Label>
              <div className="relative">
                <Input
                  id="teacherId"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your ID"
                  value={teacherId}
                  onChange={(e) => {
                    setTeacherId(e.target.value);
                    setError("");
                  }}
                  onKeyDown={(e) => e.key === "Enter" && verifyTeacherId()}
                  className={`bg-secondary border-border pr-10 ${error ? 'input-error' : ''}`}
                  autoFocus
                />
                {/* Show/Hide password button */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground 
                             hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            
            {/* Centered, themed error message */}
            {error && (
              <div className="flex items-center justify-center gap-2 p-3 rounded-lg 
                              bg-primary/5 border border-primary/20">
                <AlertCircle className="w-4 h-4 text-primary" />
                <span className="text-sm text-foreground">{error}</span>
              </div>
            )}
            
            <Button 
              onClick={verifyTeacherId} 
              className="w-full"
              disabled={isVerifying}
            >
              {isVerifying ? (
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground 
                                rounded-full animate-spin" />
              ) : (
                "Verify & Continue"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* === Student Roll Number Dialog === */}
      <Dialog open={showStudentDialog} onOpenChange={setShowStudentDialog}>
        <DialogContent className="bg-card border-border max-w-sm mx-4">
          <DialogHeader>
            <DialogTitle className="text-xl font-display">Enter Roll Number</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="rollNo">Roll Number</Label>
              <Input
                id="rollNo"
                type="number"
                placeholder="e.g., 15"
                value={rollNo}
                onChange={(e) => {
                  setRollNo(e.target.value);
                  setError("");
                }}
                onKeyDown={(e) => e.key === "Enter" && verifyRollNo()}
                className={`bg-secondary border-border ${error ? 'input-error' : ''}`}
                min="1"
                autoFocus
              />
            </div>
            
            {/* Centered, themed error message */}
            {error && (
              <div className="flex items-center justify-center gap-2 p-3 rounded-lg 
                              bg-primary/5 border border-primary/20">
                <AlertCircle className="w-4 h-4 text-primary" />
                <span className="text-sm text-foreground">{error}</span>
              </div>
            )}
            
            <Button 
              onClick={verifyRollNo} 
              className="w-full"
              disabled={isVerifying}
            >
              {isVerifying ? (
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground 
                                rounded-full animate-spin" />
              ) : (
                "Continue to Scan"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
