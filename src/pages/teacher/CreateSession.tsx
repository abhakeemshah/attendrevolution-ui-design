import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, Users, BookOpen, MapPin, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export default function CreateSession() {
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    
    // Simulate API call to POST /api/v1/sessions
    setTimeout(() => {
      setIsCreating(false);
      navigate("/teacher/session/new-session-id");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header userRole="teacher" onLogout={() => navigate("/")} />

      <main className="pt-24 pb-16 px-6">
        <div className="container mx-auto max-w-2xl">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => navigate("/teacher")}
            className="mb-6 gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-2xl font-display">Create New Session</CardTitle>
              <CardDescription>
                Fill in the session details to generate a unique attendance QR code
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Session Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-primary" />
                    Session Name
                  </Label>
                  <Input
                    id="name"
                    placeholder="e.g., Mathematics 101 - Lecture 5"
                    required
                    className="bg-secondary border-border"
                  />
                </div>

                {/* Date and Time */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date" className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary" />
                      Date
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      required
                      className="bg-secondary border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time" className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primary" />
                      Time
                    </Label>
                    <Input
                      id="time"
                      type="time"
                      required
                      className="bg-secondary border-border"
                    />
                  </div>
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <Label htmlFor="location" className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    Location
                  </Label>
                  <Input
                    id="location"
                    placeholder="e.g., Room 301, Science Building"
                    className="bg-secondary border-border"
                  />
                </div>

                {/* Expected Students */}
                <div className="space-y-2">
                  <Label htmlFor="students" className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" />
                    Expected Number of Students
                  </Label>
                  <Input
                    id="students"
                    type="number"
                    placeholder="e.g., 35"
                    min="1"
                    className="bg-secondary border-border"
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Add any additional notes about this session..."
                    className="bg-secondary border-border min-h-[100px]"
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
                      Create Session & Generate QR
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
