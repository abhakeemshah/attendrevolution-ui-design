import { Link, useLocation } from "react-router-dom";
import { GraduationCap, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  userRole?: "teacher" | "student";
  onLogout?: () => void;
}

export function Header({ userRole, onLogout }: HeaderProps) {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
            <GraduationCap className="w-6 h-6 text-primary" />
          </div>
          <span className="font-display font-bold text-xl text-foreground">
            Attend<span className="text-primary">Revolution</span>
          </span>
        </Link>

        {!isHome && userRole && (
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {userRole === "teacher" ? "Teacher Panel" : "Student Panel"}
            </span>
            <Button variant="ghost" size="sm" onClick={onLogout} className="gap-2">
              <LogOut className="w-4 h-4" />
              Exit
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
