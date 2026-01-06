/**
 * CreateSession.tsx
 * =================
 * Form for teachers to create a new attendance session
 * 
 * Features:
 * - Teacher ID hidden (password) - not displayed anywhere
 * - Time slots from 8:30 onwards in 1-hour increments
 * - Required field validation with visual indicators
 * - Group field optional (no "(Optional)" text)
 * - Fully responsive for mobile devices
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Year options: 23 to 26 only
const YEAR_OPTIONS = ["23", "24", "25", "26"];

// Time slots from 8:30 onwards in 1-hour increments
const TIME_PRESETS = [
  { label: "8:30 - 9:30", from: "08:30", to: "09:30" },
  { label: "9:30 - 10:30", from: "09:30", to: "10:30" },
  { label: "10:30 - 11:30", from: "10:30", to: "11:30" },
  { label: "11:30 - 12:30", from: "11:30", to: "12:30" },
  { label: "12:30 - 1:30", from: "12:30", to: "13:30" },
  { label: "1:30 - 2:30", from: "13:30", to: "14:30" },
  { label: "2:30 - 3:30", from: "14:30", to: "15:30" },
  { label: "3:30 - 4:30", from: "15:30", to: "16:30" },
];

export default function CreateSession() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Teacher ID passed from RoleSelection (kept hidden)
  const teacherId = location.state?.teacherId || "";

  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState("");
  
  // Track which fields have validation errors
  const [fieldErrors, setFieldErrors] = useState<Record<string, boolean>>({});
  
  // Form state
  const [semester, setSemester] = useState("");
  const [year, setYear] = useState("");
  const [shift, setShift] = useState<"morning" | "evening" | "">("");
  const [className, setClassName] = useState("");
  const [group, setGroup] = useState(""); // Optional - no text shown
  const [sessionType, setSessionType] = useState<"theory" | "practical" | "">("");
  const [courseName, setCourseName] = useState("");
  const [expectedBatch, setExpectedBatch] = useState("");
  const [timer, setTimer] = useState("");
  const [timeFrom, setTimeFrom] = useState("");
  const [timeTo, setTimeTo] = useState("");
  const [notes, setNotes] = useState(""); // Optional

  // Auto-generate today's date
  const today = new Date().toISOString().split('T')[0];

  // Apply a time preset
  const applyTimePreset = (from: string, to: string) => {
    setTimeFrom(from);
    setTimeTo(to);
    // Clear time field errors when preset is selected
    setFieldErrors(prev => ({ ...prev, timeFrom: false, timeTo: false }));
  };

  /**
   * Validate form and mark fields with errors
   */
  const validateForm = () => {
    const errors: Record<string, boolean> = {};
    
    if (!semester) errors.semester = true;
    if (!year) errors.year = true;
    if (!shift) errors.shift = true;
    if (!className.trim()) errors.className = true;
    if (!sessionType) errors.sessionType = true;
    if (!courseName.trim()) errors.courseName = true;
    if (!expectedBatch || parseInt(expectedBatch) <= 0) errors.expectedBatch = true;
    if (!timer) errors.timer = true;
    if (!timeFrom) errors.timeFrom = true;
    if (!timeTo) errors.timeTo = true;
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Validate all required fields
    if (!validateForm()) {
      setError("Please fill in all required fields");
      return;
    }

    const batchSize = parseInt(expectedBatch);
    if (isNaN(batchSize) || batchSize <= 0) {
      setFieldErrors(prev => ({ ...prev, expectedBatch: true }));
      setError("Expected batch size must be a positive number");
      return;
    }

    setIsCreating(true);
    
    // Prepare session data (teacherId is stored but never shown)
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

    console.log("Creating session:", sessionData);

    // Simulate API delay
    setTimeout(() => {
      setIsCreating(false);
      const sessionId = `session-${Date.now()}`;
      
      navigate(`/teacher/session/${sessionId}/live`, { 
        state: { sessionData: { ...sessionData, id: sessionId } }
      });
    }, 800);
  };

  // Helper to get input class with error state
  const getInputClass = (fieldName: string) => {
    return `bg-secondary border-border ${fieldErrors[fieldName] ? 'input-error' : ''}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="pt-6 pb-12 px-4 sm:px-6">
        <div className="container mx-auto max-w-2xl">
          
          {/* Back navigation */}
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-4 gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>

          <Card className="bg-card border-border shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl sm:text-2xl font-display">
                Create Attendance Session
              </CardTitle>
              {/* Note: Teacher ID is NOT displayed here - it's kept hidden */}
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* === Semester and Year Row === */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-2">
                    <Label>Semester *</Label>
                    <Select value={semester} onValueChange={(v) => {
                      setSemester(v);
                      setFieldErrors(prev => ({ ...prev, semester: false }));
                    }}>
                      <SelectTrigger className={getInputClass('semester')}>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1st Semester</SelectItem>
                        <SelectItem value="2">2nd Semester</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Year *</Label>
                    <Select value={year} onValueChange={(v) => {
                      setYear(v);
                      setFieldErrors(prev => ({ ...prev, year: false }));
                    }}>
                      <SelectTrigger className={getInputClass('year')}>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {YEAR_OPTIONS.map((y) => (
                          <SelectItem key={y} value={y}>20{y}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* === Shift Selection === */}
                <div className="space-y-2">
                  <Label>Shift *</Label>
                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant={shift === "morning" ? "default" : "outline"}
                      onClick={() => {
                        setShift("morning");
                        setFieldErrors(prev => ({ ...prev, shift: false }));
                      }}
                      className={`flex-1 gap-2 ${fieldErrors.shift && !shift ? 'input-error' : ''}`}
                    >
                      <Sun className="w-4 h-4" />
                      Morning
                    </Button>
                    <Button
                      type="button"
                      variant={shift === "evening" ? "default" : "outline"}
                      onClick={() => {
                        setShift("evening");
                        setFieldErrors(prev => ({ ...prev, shift: false }));
                      }}
                      className={`flex-1 gap-2 ${fieldErrors.shift && !shift ? 'input-error' : ''}`}
                    >
                      <Moon className="w-4 h-4" />
                      Evening
                    </Button>
                  </div>
                </div>

                {/* === Class and Group - Aligned evenly === */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="className" className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-primary" />
                      Class *
                    </Label>
                    <Input
                      id="className"
                      placeholder="e.g., SWE Part III"
                      value={className}
                      onChange={(e) => {
                        setClassName(e.target.value);
                        setFieldErrors(prev => ({ ...prev, className: false }));
                      }}
                      className={getInputClass('className')}
                    />
                  </div>
                  <div className="space-y-2">
                    {/* No "(Optional)" text - just the label */}
                    <Label htmlFor="group">Group</Label>
                    <Input
                      id="group"
                      placeholder="e.g., A or B"
                      value={group}
                      onChange={(e) => setGroup(e.target.value)}
                      className="bg-secondary border-border"
                    />
                  </div>
                </div>

                {/* === Date (Auto-filled) === */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    Date
                  </Label>
                  <Input
                    type="date"
                    value={today}
                    disabled
                    className="bg-muted border-border text-muted-foreground"
                  />
                </div>

                {/* === Session Type === */}
                <div className="space-y-2">
                  <Label>Session Type *</Label>
                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant={sessionType === "theory" ? "default" : "outline"}
                      onClick={() => {
                        setSessionType("theory");
                        setFieldErrors(prev => ({ ...prev, sessionType: false }));
                      }}
                      className={`flex-1 gap-2 ${fieldErrors.sessionType && !sessionType ? 'input-error' : ''}`}
                    >
                      <BookText className="w-4 h-4" />
                      Theory
                    </Button>
                    <Button
                      type="button"
                      variant={sessionType === "practical" ? "default" : "outline"}
                      onClick={() => {
                        setSessionType("practical");
                        setFieldErrors(prev => ({ ...prev, sessionType: false }));
                      }}
                      className={`flex-1 gap-2 ${fieldErrors.sessionType && !sessionType ? 'input-error' : ''}`}
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
                    onChange={(e) => {
                      setCourseName(e.target.value);
                      setFieldErrors(prev => ({ ...prev, courseName: false }));
                    }}
                    className={getInputClass('courseName')}
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
                    onChange={(e) => {
                      setExpectedBatch(e.target.value);
                      setFieldErrors(prev => ({ ...prev, expectedBatch: false }));
                    }}
                    className={getInputClass('expectedBatch')}
                  />
                </div>

                {/* === Attendance Time Duration === */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    Attendance Time Duration *
                  </Label>
                  <Select value={timer} onValueChange={(v) => {
                    setTimer(v);
                    setFieldErrors(prev => ({ ...prev, timer: false }));
                  }}>
                    <SelectTrigger className={getInputClass('timer')}>
                      <SelectValue placeholder="Select (2-5 minutes)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">2 Minutes</SelectItem>
                      <SelectItem value="3">3 Minutes</SelectItem>
                      <SelectItem value="4">4 Minutes</SelectItem>
                      <SelectItem value="5">5 Minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* === Class Time (From-To) with Easy Presets === */}
                <div className="space-y-3">
                  <Label>Class Time *</Label>
                  
                  {/* Quick time slot presets - scrollable on mobile */}
                  <div className="flex flex-wrap gap-2">
                    {TIME_PRESETS.map((preset) => (
                      <Button
                        key={preset.label}
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => applyTimePreset(preset.from, preset.to)}
                        className={`text-xs ${
                          timeFrom === preset.from && timeTo === preset.to 
                            ? 'border-primary bg-primary/10 text-primary' 
                            : ''
                        }`}
                      >
                        {preset.label}
                      </Button>
                    ))}
                  </div>
                  
                  {/* Manual time inputs */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label htmlFor="timeFrom" className="text-xs text-muted-foreground">From</Label>
                      <Input
                        id="timeFrom"
                        type="time"
                        value={timeFrom}
                        onChange={(e) => {
                          setTimeFrom(e.target.value);
                          setFieldErrors(prev => ({ ...prev, timeFrom: false }));
                        }}
                        className={getInputClass('timeFrom')}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="timeTo" className="text-xs text-muted-foreground">To</Label>
                      <Input
                        id="timeTo"
                        type="time"
                        value={timeTo}
                        onChange={(e) => {
                          setTimeTo(e.target.value);
                          setFieldErrors(prev => ({ ...prev, timeTo: false }));
                        }}
                        className={getInputClass('timeTo')}
                      />
                    </div>
                  </div>
                </div>

                {/* === Additional Notes (Optional - no text shown) === */}
                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any additional notes..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="bg-secondary border-border min-h-[80px]"
                  />
                </div>

                {/* === Centered, themed error message === */}
                {error && (
                  <div className="flex items-center justify-center gap-2 p-4 rounded-lg 
                                  bg-primary/5 border border-primary/20">
                    <AlertCircle className="w-5 h-5 text-primary" />
                    <span className="text-foreground">{error}</span>
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
                      <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground 
                                      rounded-full animate-spin" />
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
