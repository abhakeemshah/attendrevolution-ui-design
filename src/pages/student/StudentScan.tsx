/**
 * StudentScan.tsx
 * ================
 * QR scanning page for students to mark attendance
 * 
 * Flow:
 * 1. Roll number passed from RoleSelection
 * 2. Camera opens for QR scanning
 * 3. On success: show confirmation with roll number
 * 
 * Responsive: Works on all device sizes
 */

import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Camera, CheckCircle2, ArrowLeft, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function StudentScan() {
  const navigate = useNavigate();
  const location = useLocation();
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Roll number from RoleSelection
  const rollNo = location.state?.rollNo;
  
  // Camera states
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [attendanceMarked, setAttendanceMarked] = useState(false);

  // Redirect if no roll number
  useEffect(() => {
    if (!rollNo) {
      navigate("/");
      return;
    }
    startCamera();
    
    return () => stopCamera();
  }, [rollNo, navigate]);

  // Start device camera
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
      setCameraError("Unable to access camera. Please grant permissions.");
      // Demo: simulate scan after delay
      setTimeout(simulateScan, 3000);
    }
  };

  // Stop camera tracks
  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
  };

  // Simulate QR scan
  const simulateScan = () => {
    setIsScanning(true);
    
    setTimeout(() => {
      setIsScanning(false);
      setAttendanceMarked(true);
      stopCamera();
      
      console.log("Attendance marked:", { rollNo, timestamp: new Date() });
    }, 1500);
  };

  // Auto-scan after camera active (demo)
  useEffect(() => {
    if (cameraActive && !attendanceMarked) {
      const timeout = setTimeout(simulateScan, 3000);
      return () => clearTimeout(timeout);
    }
  }, [cameraActive, attendanceMarked]);

  if (!rollNo) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      
      {/* Header */}
      <header className="p-4 border-b border-border bg-card">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <Card className="bg-card border-border w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-xl sm:text-2xl font-display">
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
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="w-4 h-4 text-primary" />
                        <p className="text-muted-foreground text-sm">{cameraError}</p>
                      </div>
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
                        <div className="w-48 h-48 sm:w-56 sm:h-56 border-2 border-primary rounded-lg relative">
                          <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-primary" />
                          <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-primary" />
                          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-primary" />
                          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-primary" />
                        </div>
                      </div>
                    </>
                  )}
                  
                  {/* Processing overlay */}
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
              <div className="flex flex-col items-center py-8 animate-fade-in">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-10 h-10 text-primary" />
                </div>
                <h2 className="text-xl font-display font-bold text-primary mb-2">
                  Attendance Marked!
                </h2>
                <p className="text-muted-foreground text-center mb-6">
                  Roll No <span className="text-foreground font-semibold">{rollNo}</span> has been recorded.
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
