import * as React from "react";
import { cn } from "@/lib/utils";

interface RoleCardProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: React.ReactNode;
  title: string;
  description: string;
  selected?: boolean;
}

const RoleCard = React.forwardRef<HTMLDivElement, RoleCardProps>(
  ({ className, icon, title, description, selected, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "group relative flex flex-col items-center justify-center p-8 rounded-2xl cursor-pointer transition-all duration-300",
        "bg-card border-2 border-border hover:border-primary/50",
        "hover:shadow-[0_0_40px_hsl(82_84%_55%/0.15)] hover:scale-[1.02]",
        selected && "border-primary bg-primary/5 shadow-[0_0_40px_hsl(82_84%_55%/0.2)]",
        className
      )}
      {...props}
    >
      <div className={cn(
        "flex items-center justify-center w-20 h-20 rounded-2xl mb-6 transition-all duration-300",
        "bg-secondary group-hover:bg-primary/10",
        selected && "bg-primary/20"
      )}>
        <div className={cn(
          "text-muted-foreground group-hover:text-primary transition-colors duration-300",
          selected && "text-primary"
        )}>
          {icon}
        </div>
      </div>
      <h3 className="text-2xl font-display font-bold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground text-center text-sm">{description}</p>
    </div>
  )
);
RoleCard.displayName = "RoleCard";

export { RoleCard };
