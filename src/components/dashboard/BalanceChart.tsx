
import { useMemo } from "react";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from "recharts";
import { Card } from "@/components/ui/card";

interface BalanceChartProps {
  data: Array<{ date: string; value: number }>;
  className?: string;
}

export function BalanceChart({ data, className }: BalanceChartProps) {
  const chartData = useMemo(() => {
    // Ensure we have at least 10 data points for a nice chart
    return data.slice(-30);
  }, [data]);

  // Calculate min and max to set proper domain
  const minValue = useMemo(() => {
    const min = Math.min(...chartData.map(d => d.value));
    return Math.floor(min * 0.95); // 5% padding below min
  }, [chartData]);
  
  const maxValue = useMemo(() => {
    const max = Math.max(...chartData.map(d => d.value));
    return Math.ceil(max * 1.05); // 5% padding above max
  }, [chartData]);

  // Calculate if overall trend is positive
  const isPositiveTrend = chartData.length >= 2 && 
    chartData[chartData.length - 1].value > chartData[0].value;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <Card className={`p-6 ${className}`}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Account Balance</h3>
        <p className="text-sm text-muted-foreground">30-day performance</p>
      </div>
      
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                <stop 
                  offset="5%" 
                  stopColor={isPositiveTrend ? "#22c55e" : "#ef4444"} 
                  stopOpacity={0.3} 
                />
                <stop 
                  offset="95%" 
                  stopColor={isPositiveTrend ? "#22c55e" : "#ef4444"} 
                  stopOpacity={0} 
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tickLine={false} 
              axisLine={{ stroke: "#E5E7EB" }}
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => {
                const date = new Date(value);
                return `${date.getDate()}/${date.getMonth() + 1}`;
              }}
              interval="preserveStartEnd"
            />
            <YAxis 
              tickLine={false}
              axisLine={{ stroke: "#E5E7EB" }}
              tick={{ fontSize: 12 }}
              domain={[minValue, maxValue]}
              tickFormatter={formatCurrency}
            />
            <Tooltip
              formatter={(value: number) => [formatCurrency(value), "Balance"]}
              labelFormatter={(label) => {
                const date = new Date(label);
                return date.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric"
                });
              }}
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke={isPositiveTrend ? "#22c55e" : "#ef4444"} 
              fillOpacity={1}
              fill="url(#colorBalance)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
