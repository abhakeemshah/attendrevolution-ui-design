/**
 * RoleSelection.tsx
 * =================
 * Landing page for AttendRevolution
 * Users select their role (Teacher/Student) and enter their ID
 * 
 * Flow:
 * - Teacher: Enter ID -> Verify -> Navigate to CreateSession
 * - Student: Enter Roll No -> Navigate to StudentScan
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap, BookOpen, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Valid teacher IDs - In production, this would be verified via API
const VALID_TEACHER_IDS = ["T001", "T002", "T003", "TEACH123", "ADMIN"];

export default function RoleSelection() {
  const navigate = useNavigate();
  
  // Dialog visibility states
  const [showTeacherDialog, setShowTeacherDialog] = useState(false);
  const [showStudentDialog, setShowStudentDialog] = useState(false);
  
  // Form inputs
  const [teacherId, setTeacherId] = useState("");
  const [rollNo, setRollNo] = useState("");
  
  // Error handling - displayed inline in dialog
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  // Open teacher dialog and reset state
  const handleTeacherClick = () => {
    setShowTeacherDialog(true);
    setTeacherId("");
    setError("");
  };

  // Open student dialog and reset state
  const handleStudentClick = () => {
    setShowStudentDialog(true);
    setRollNo("");
    setError("");
  };

  /**
   * Verify teacher ID against valid IDs
   * Shows error if invalid, navigates if valid
   */
  const verifyTeacherId = async () => {
    // Validate input
    if (!teacherId.trim()) {
      setError("Please enter your Teacher ID");
      return;
    }

    setIsVerifying(true);
    setError("");
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Check if ID is valid
    if (VALID_TEACHER_IDS.includes(teacherId.toUpperCase())) {
      setShowTeacherDialog(false);
      navigate("/teacher/create", { state: { teacherId: teacherId.toUpperCase() } });
    } else {
      setError("ID is wrong. Please check and try again.");
    }
    
    setIsVerifying(false);
  };

  /**
   * Validate roll number and navigate to scan page
   * Roll number must be a positive integer
   */
  const verifyRollNo = async () => {
    const rollNumber = parseInt(rollNo);
    
    // Validate: must be a positive number
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
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      {/* Decorative background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      {/* Header with app name */}
      <div className="text-center mb-12 z-10">
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
          <span className="gradient-text">AttendRevolution</span>
        </h1>
        <p className="text-muted-foreground text-lg">
          Select your role to continue
        </p>
      </div>

      {/* Role Selection Cards - Square, clickable boxes */}
      <div className="flex flex-col sm:flex-row gap-8 z-10">
        {/* Teacher Card */}
        <button
          onClick={handleTeacherClick}
          className="group w-48 h-48 bg-card border-2 border-border rounded-lg p-6 flex flex-col items-center justify-center gap-4 hover:border-primary hover:bg-card/80 transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-lg hover:shadow-primary/20"
        >
          {/* Avatar circle with icon */}
          <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
            <BookOpen className="w-10 h-10 text-primary" />
          </div>
          <span className="text-lg font-display font-semibold text-foreground">
            Teacher
          </span>
        </button>

        {/* Student Card */}
        <button
          onClick={handleStudentClick}
          className="group w-48 h-48 bg-card border-2 border-border rounded-lg p-6 flex flex-col items-center justify-center gap-4 hover:border-accent hover:bg-card/80 transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-lg hover:shadow-accent/20"
        >
          {/* Avatar circle with icon */}
          <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center group-hover:bg-accent/30 transition-colors">
            <GraduationCap className="w-10 h-10 text-accent" />
          </div>
          <span className="text-lg font-display font-semibold text-foreground">
            Student
          </span>
        </button>
      </div>

      {/* Teacher ID Verification Dialog */}
      <Dialog open={showTeacherDialog} onOpenChange={setShowTeacherDialog}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-xl font-display">Enter Teacher ID</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            {/* Input field */}
            <div className="space-y-2">
              <Label htmlFor="teacherId">Teacher ID</Label>
              <Input
                id="teacherId"
                placeholder="e.g., T001"
                value={teacherId}
                onChange={(e) => {
                  setTeacherId(e.target.value);
                  setError(""); // Clear error on input change
                }}
                onKeyDown={(e) => e.key === "Enter" && verifyTeacherId()}
                className="bg-secondary border-border"
                autoFocus
              />
            </div>
            
            {/* Error message - themed, centered */}
            {error && (
              <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-secondary border border-border text-muted-foreground">
                <AlertCircle className="w-4 h-4 text-primary" />
                <span className="text-sm">{error}</span>
              </div>
            )}
            
            <Button 
              onClick={verifyTeacherId} 
              className="w-full"
              disabled={isVerifying}
            >
              {isVerifying ? (
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                "Verify & Continue"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Student Roll Number Dialog */}
      <Dialog open={showStudentDialog} onOpenChange={setShowStudentDialog}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-xl font-display">Enter Roll Number</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            {/* Input field */}
            <div className="space-y-2">
              <Label htmlFor="rollNo">Roll Number</Label>
              <Input
                id="rollNo"
                type="number"
                placeholder="e.g., 15"
                value={rollNo}
                onChange={(e) => {
                  setRollNo(e.target.value);
                  setError(""); // Clear error on input change
                }}
                onKeyDown={(e) => e.key === "Enter" && verifyRollNo()}
                className="bg-secondary border-border"
                min="1"
                autoFocus
              />
            </div>
            
            {/* Error message - themed, centered */}
            {error && (
              <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-secondary border border-border text-muted-foreground">
                <AlertCircle className="w-4 h-4 text-primary" />
                <span className="text-sm">{error}</span>
              </div>
            )}
            
            <Button 
              onClick={verifyRollNo} 
              className="w-full"
              disabled={isVerifying}
            >
              {isVerifying ? (
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
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
