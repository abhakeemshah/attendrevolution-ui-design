import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, Users, BookOpen, Check, Sun, Moon, FlaskConical, BookText } from "lucide-react";
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
import { useToast } from "@/hooks/use-toast";

export default function CreateSession() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const teacherId = location.state?.teacherId || "Unknown";

  const [isCreating, setIsCreating] = useState(false);
  
  // Form state
  const [semester, setSemester] = useState<string>("");
  const [year, setYear] = useState<string>("");
  const [shift, setShift] = useState<"morning" | "evening" | "">("");
  const [className, setClassName] = useState("");
  const [group, setGroup] = useState("");
  const [sessionType, setSessionType] = useState<"theory" | "practical" | "">("");
  const [courseName, setCourseName] = useState("");
  const [expectedBatch, setExpectedBatch] = useState("");
  const [timer, setTimer] = useState<string>("");
  const [timeFrom, setTimeFrom] = useState("");
  const [timeTo, setTimeTo] = useState("");
  const [notes, setNotes] = useState("");

  // Auto-generate today's date
  const today = new Date().toISOString().split('T')[0];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!semester || !year || !shift || !className || !sessionType || !courseName || !expectedBatch || !timer || !timeFrom || !timeTo) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);
    
    // Simulate API call to POST /api/v1/sessions
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
      expectedBatch: parseInt(expectedBatch),
      timerMinutes: parseInt(timer),
      timeFrom,
      timeTo,
      notes: notes || null,
    };

    console.log("Creating session:", sessionData);

    setTimeout(() => {
      setIsCreating(false);
      const sessionId = `session-${Date.now()}`;
      navigate(`/teacher/session/${sessionId}/live`, { 
        state: { 
          sessionData: {
            ...sessionData,
            id: sessionId,
          }
        }
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="pt-8 pb-16 px-6">
        <div className="container mx-auto max-w-2xl">
          {/* Back Button */}
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
                {/* Semester and Year Row */}
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
                        {years.map((y) => (
                          <SelectItem key={y} value={y.toString()}>
                            {y}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Shift Selection */}
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

                {/* Class and Group */}
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

                {/* Date (Auto-filled) */}
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

                {/* Session Type */}
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

                {/* Course Name */}
                <div className="space-y-2">
                  <Label htmlFor="courseName">Course Name *</Label>
                  <Input
                    id="courseName"
                    placeholder="e.g., Data Structures & Algorithms"
                    value={courseName}
                    onChange={(e) => setCourseName(e.target.value)}
                    className="bg-secondary border-border"
                  />
                </div>

                {/* Expected Batch */}
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

                {/* Timer Selection */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    Timer Duration *
                  </Label>
                  <Select value={timer} onValueChange={setTimer}>
                    <SelectTrigger className="bg-secondary border-border">
                      <SelectValue placeholder="Select Timer (2-5 minutes)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">2 Minutes</SelectItem>
                      <SelectItem value="3">3 Minutes</SelectItem>
                      <SelectItem value="4">4 Minutes</SelectItem>
                      <SelectItem value="5">5 Minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Time From-To */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="timeFrom">Time From *</Label>
                    <Input
                      id="timeFrom"
                      type="time"
                      value={timeFrom}
                      onChange={(e) => setTimeFrom(e.target.value)}
                      className="bg-secondary border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timeTo">Time To *</Label>
                    <Input
                      id="timeTo"
                      type="time"
                      value={timeTo}
                      onChange={(e) => setTimeTo(e.target.value)}
                      className="bg-secondary border-border"
                    />
                  </div>
                </div>

                {/* Additional Notes */}
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

                {/* Submit Button */}
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
