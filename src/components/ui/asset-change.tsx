
import { cn } from "@/lib/utils";
import { ArrowUp, ArrowDown } from "lucide-react";

interface AssetChangeProps {
  value: number;
  showIcon?: boolean;
  showValue?: boolean;
  className?: string;
  iconOnly?: boolean;
}

export const AssetChange = ({
  value,
  showIcon = true,
  showValue = true,
  className,
  iconOnly = false
}: AssetChangeProps) => {
  const isPositive = value > 0;
  const isNegative = value < 0;
  const isNeutral = value === 0;
  
  return (
    <div 
      className={cn(
        "flex items-center gap-1",
        isPositive && "text-trading-green",
        isNegative && "text-trading-red",
        isNeutral && "text-gray-500",
        className
      )}
    >
      {showIcon && isPositive && <ArrowUp className="w-3 h-3" />}
      {showIcon && isNegative && <ArrowDown className="w-3 h-3" />}
      {showValue && !iconOnly && (
        <span>
          {isPositive ? "+" : ""}
          {value.toFixed(2)}%
        </span>
      )}
    </div>
  );
};
