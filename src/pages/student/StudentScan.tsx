import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Camera, CheckCircle2, XCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function StudentScan() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const rollNo = location.state?.rollNo;
  
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [attendanceMarked, setAttendanceMarked] = useState(false);

  useEffect(() => {
    if (!rollNo) {
      navigate("/");
      return;
    }
    startCamera();
    
    return () => {
      stopCamera();
    };
  }, [rollNo, navigate]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
        setCameraError(null);
      }
    } catch (err) {
      console.error("Camera error:", err);
      setCameraError("Unable to access camera. Please grant camera permissions.");
      
      // For demo, simulate successful scan after 3 seconds
      setTimeout(() => {
        simulateScan();
      }, 3000);
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const simulateScan = () => {
    setIsScanning(true);
    
    // Simulate QR scan and API call to POST /api/v1/attendance
    setTimeout(() => {
      setIsScanning(false);
      setAttendanceMarked(true);
      stopCamera();
      
      toast({
        title: "Attendance Marked!",
        description: `Roll No ${rollNo} - Your attendance has been recorded.`,
      });
    }, 1500);
  };

  // Simulate scanning when camera is active
  useEffect(() => {
    if (cameraActive && !attendanceMarked) {
      const timeout = setTimeout(() => {
        simulateScan();
      }, 3000);
      
      return () => clearTimeout(timeout);
    }
  }, [cameraActive, attendanceMarked]);

  if (!rollNo) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="p-4 border-b border-border">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <Card className="bg-card border-border w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-display">
              {attendanceMarked ? "Attendance Confirmed" : "Scan QR Code"}
            </CardTitle>
            <p className="text-muted-foreground">
              Roll Number: <span className="text-primary font-semibold">{rollNo}</span>
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {!attendanceMarked ? (
              <>
                {/* Camera View */}
                <div className="relative aspect-square bg-secondary rounded-lg overflow-hidden">
                  {cameraError ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                      <Camera className="w-12 h-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground text-sm mb-4">{cameraError}</p>
                      <p className="text-xs text-muted-foreground">Simulating scan...</p>
                    </div>
                  ) : (
                    <>
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover"
                      />
                      {/* Scanning overlay */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-48 h-48 border-2 border-primary rounded-lg relative">
                          <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-primary" />
                          <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-primary" />
                          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-primary" />
                          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-primary" />
                        </div>
                      </div>
                    </>
                  )}
                  
                  {/* Scanning indicator */}
                  {isScanning && (
                    <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                        <p className="text-foreground font-medium">Processing...</p>
                      </div>
                    </div>
                  )}
                </div>

                <p className="text-center text-sm text-muted-foreground">
                  Point your camera at the QR code displayed by your teacher
                </p>
              </>
            ) : (
              /* Success State */
              <div className="flex flex-col items-center py-8">
                <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-10 h-10 text-success" />
                </div>
                <h2 className="text-xl font-display font-bold text-success mb-2">
                  Attendance Marked
                </h2>
                <p className="text-muted-foreground text-center mb-6">
                  Roll No <span className="text-foreground font-semibold">{rollNo}</span> has been recorded successfully.
                </p>
                <Button onClick={() => navigate("/")} className="w-full">
                  Back to Home
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
