
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: number;
  trendLabel?: string;
  className?: string;
}

export const StatCard = ({
  title,
  value,
  icon,
  trend,
  trendLabel,
  className,
  ...props
}: StatCardProps) => {
  return (
    <Card className={cn("overflow-hidden", className)} {...props}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
            <h3 className="text-2xl font-semibold">{value}</h3>
            
            {(trend !== undefined || trendLabel) && (
              <div className="flex items-center mt-2">
                {trend !== undefined && (
                  <span
                    className={cn(
                      "text-xs font-medium",
                      trend > 0 ? "text-trading-green" : trend < 0 ? "text-trading-red" : "text-gray-500"
                    )}
                  >
                    {trend > 0 ? "+" : ""}
                    {trend.toFixed(2)}%
                  </span>
                )}
                {trendLabel && (
                  <span className="text-xs font-medium text-muted-foreground ml-1">
                    {trendLabel}
                  </span>
                )}
              </div>
            )}
          </div>
          
          {icon && <div className="text-muted-foreground">{icon}</div>}
        </div>
      </CardContent>
    </Card>
  );
};
