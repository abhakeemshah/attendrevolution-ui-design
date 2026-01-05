/**
 * CreateSession.tsx
 * =================
 * Form for teachers to create a new attendance session
 * 
 * Fields:
 * - Semester (1st/2nd)
 * - Year (23-26)
 * - Shift (Morning/Evening)
 * - Class name & optional Group
 * - Date (auto-filled)
 * - Session Type (Theory/Practical)
 * - Course Name
 * - Expected Batch Size
 * - Attendance Time Duration (2-5 min)
 * - Class Time (From-To with presets)
 * - Additional Notes (optional)
 * 
 * On submit: Navigates to SessionLive with session data
 */

import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  ArrowLeft, Calendar, Clock, Users, BookOpen, 
  Check, Sun, Moon, FlaskConical, BookText, AlertCircle 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Year options: 23 to 26
const YEAR_OPTIONS = ["23", "24", "25", "26"];

// Common class time presets for easier selection
const TIME_PRESETS = [
  { label: "8:00 - 9:30", from: "08:00", to: "09:30" },
  { label: "9:30 - 11:00", from: "09:30", to: "11:00" },
  { label: "11:00 - 12:30", from: "11:00", to: "12:30" },
  { label: "1:00 - 2:30", from: "13:00", to: "14:30" },
  { label: "2:30 - 4:00", from: "14:30", to: "16:00" },
];

export default function CreateSession() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Teacher ID passed from RoleSelection
  const teacherId = location.state?.teacherId || "Unknown";

  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState("");
  
  // Form state - all required fields initialized empty for validation
  const [semester, setSemester] = useState("");
  const [year, setYear] = useState("");
  const [shift, setShift] = useState<"morning" | "evening" | "">("");
  const [className, setClassName] = useState("");
  const [group, setGroup] = useState(""); // Optional
  const [sessionType, setSessionType] = useState<"theory" | "practical" | "">("");
  const [courseName, setCourseName] = useState("");
  const [expectedBatch, setExpectedBatch] = useState("");
  const [timer, setTimer] = useState("");
  const [timeFrom, setTimeFrom] = useState("");
  const [timeTo, setTimeTo] = useState("");
  const [notes, setNotes] = useState(""); // Optional

  // Auto-generate today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  /**
   * Apply a time preset to the from/to fields
   */
  const applyTimePreset = (from: string, to: string) => {
    setTimeFrom(from);
    setTimeTo(to);
  };

  /**
   * Validate form and create session
   * All required fields must be filled
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Validation - check all required fields
    if (!semester || !year || !shift || !className || !sessionType || 
        !courseName || !expectedBatch || !timer || !timeFrom || !timeTo) {
      setError("Please fill in all required fields");
      return;
    }

    // Validate batch size is a positive number
    const batchSize = parseInt(expectedBatch);
    if (isNaN(batchSize) || batchSize <= 0) {
      setError("Expected batch size must be a positive number");
      return;
    }

    setIsCreating(true);
    
    // Prepare session data for API (POST /api/v1/sessions)
    const sessionData = {
      teacherId,
      semester,
      year,
      shift,
      className,
      group: group || null,
      date: today,
      sessionType,
      courseName,
      expectedBatch: batchSize,
      timerMinutes: parseInt(timer),
      timeFrom,
      timeTo,
      notes: notes || null,
    };

    // Log for debugging - would be API call in production
    console.log("Creating session:", sessionData);

    // Simulate API delay
    setTimeout(() => {
      setIsCreating(false);
      const sessionId = `session-${Date.now()}`;
      
      // Navigate to live session page with session data
      navigate(`/teacher/session/${sessionId}/live`, { 
        state: { 
          sessionData: { ...sessionData, id: sessionId }
        }
      });
    }, 800);
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="pt-8 pb-16 px-6">
        <div className="container mx-auto max-w-2xl">
          {/* Back navigation */}
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-6 gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-2xl font-display">Create Attendance Session</CardTitle>
              <CardDescription>
                Teacher ID: <span className="text-primary font-medium">{teacherId}</span>
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* === Semester and Year Row === */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Semester *</Label>
                    <Select value={semester} onValueChange={setSemester}>
                      <SelectTrigger className="bg-secondary border-border">
                        <SelectValue placeholder="Select Semester" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1st Semester</SelectItem>
                        <SelectItem value="2">2nd Semester</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Year *</Label>
                    <Select value={year} onValueChange={setYear}>
                      <SelectTrigger className="bg-secondary border-border">
                        <SelectValue placeholder="Select Year" />
                      </SelectTrigger>
                      <SelectContent>
                        {YEAR_OPTIONS.map((y) => (
                          <SelectItem key={y} value={y}>20{y}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* === Shift Selection (Morning/Evening) === */}
                <div className="space-y-2">
                  <Label>Shift *</Label>
                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant={shift === "morning" ? "default" : "outline"}
                      onClick={() => setShift("morning")}
                      className="flex-1 gap-2"
                    >
                      <Sun className="w-4 h-4" />
                      Morning
                    </Button>
                    <Button
                      type="button"
                      variant={shift === "evening" ? "default" : "outline"}
                      onClick={() => setShift("evening")}
                      className="flex-1 gap-2"
                    >
                      <Moon className="w-4 h-4" />
                      Evening
                    </Button>
                  </div>
                </div>

                {/* === Class and Group === */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="className" className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-primary" />
                      Class *
                    </Label>
                    <Input
                      id="className"
                      placeholder="e.g., SWE Part III"
                      value={className}
                      onChange={(e) => setClassName(e.target.value)}
                      className="bg-secondary border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="group">Group (Optional)</Label>
                    <Input
                      id="group"
                      placeholder="e.g., A or B"
                      value={group}
                      onChange={(e) => setGroup(e.target.value)}
                      className="bg-secondary border-border"
                    />
                  </div>
                </div>

                {/* === Date (Auto-filled, read-only) === */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    Date
                  </Label>
                  <Input
                    type="date"
                    value={today}
                    disabled
                    className="bg-secondary/50 border-border text-muted-foreground"
                  />
                </div>

                {/* === Session Type (Theory/Practical) === */}
                <div className="space-y-2">
                  <Label>Session Type *</Label>
                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant={sessionType === "theory" ? "default" : "outline"}
                      onClick={() => setSessionType("theory")}
                      className="flex-1 gap-2"
                    >
                      <BookText className="w-4 h-4" />
                      Theory
                    </Button>
                    <Button
                      type="button"
                      variant={sessionType === "practical" ? "default" : "outline"}
                      onClick={() => setSessionType("practical")}
                      className="flex-1 gap-2"
                    >
                      <FlaskConical className="w-4 h-4" />
                      Practical
                    </Button>
                  </div>
                </div>

                {/* === Course Name === */}
                <div className="space-y-2">
                  <Label htmlFor="courseName">Course Name *</Label>
                  <Input
                    id="courseName"
                    placeholder="e.g., Data Structures"
                    value={courseName}
                    onChange={(e) => setCourseName(e.target.value)}
                    className="bg-secondary border-border"
                  />
                </div>

                {/* === Expected Batch Size === */}
                <div className="space-y-2">
                  <Label htmlFor="expectedBatch" className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" />
                    Expected Batch Size *
                  </Label>
                  <Input
                    id="expectedBatch"
                    type="number"
                    placeholder="e.g., 45"
                    min="1"
                    value={expectedBatch}
                    onChange={(e) => setExpectedBatch(e.target.value)}
                    className="bg-secondary border-border"
                  />
                </div>

                {/* === Attendance Time Duration === */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    Attendance Time Duration *
                  </Label>
                  <Select value={timer} onValueChange={setTimer}>
                    <SelectTrigger className="bg-secondary border-border">
                      <SelectValue placeholder="Select Duration (2-5 minutes)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">2 Minutes</SelectItem>
                      <SelectItem value="3">3 Minutes</SelectItem>
                      <SelectItem value="4">4 Minutes</SelectItem>
                      <SelectItem value="5">5 Minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* === Class Time (From-To) with Presets === */}
                <div className="space-y-3">
                  <Label>Class Time *</Label>
                  
                  {/* Quick presets for common times */}
                  <div className="flex flex-wrap gap-2">
                    {TIME_PRESETS.map((preset) => (
                      <Button
                        key={preset.label}
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => applyTimePreset(preset.from, preset.to)}
                        className={`text-xs ${timeFrom === preset.from && timeTo === preset.to ? 'border-primary bg-primary/10' : ''}`}
                      >
                        {preset.label}
                      </Button>
                    ))}
                  </div>
                  
                  {/* Manual time inputs */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label htmlFor="timeFrom" className="text-xs text-muted-foreground">From</Label>
                      <Input
                        id="timeFrom"
                        type="time"
                        value={timeFrom}
                        onChange={(e) => setTimeFrom(e.target.value)}
                        className="bg-secondary border-border"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="timeTo" className="text-xs text-muted-foreground">To</Label>
                      <Input
                        id="timeTo"
                        type="time"
                        value={timeTo}
                        onChange={(e) => setTimeTo(e.target.value)}
                        className="bg-secondary border-border"
                      />
                    </div>
                  </div>
                </div>

                {/* === Additional Notes (Optional) === */}
                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any additional notes..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="bg-secondary border-border min-h-[80px]"
                  />
                </div>

                {/* === Error Display - Centered, themed === */}
                {error && (
                  <div className="flex items-center justify-center gap-2 p-4 rounded-lg bg-secondary border border-border">
                    <AlertCircle className="w-5 h-5 text-primary" />
                    <span className="text-muted-foreground">{error}</span>
                  </div>
                )}

                {/* === Submit Button === */}
                <Button
                  type="submit"
                  size="lg"
                  disabled={isCreating}
                  className="w-full gap-2"
                >
                  {isCreating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Creating Session...
                    </>
                  ) : (
                    <>
                      <Check className="w-5 h-5" />
                      Start Session & Generate QR
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
