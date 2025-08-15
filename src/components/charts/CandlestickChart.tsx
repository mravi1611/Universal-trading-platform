
import React, { useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  ReferenceLine,
  ComposedChart,
  Line
} from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { AssetHistoricalData } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const timeRanges = [
  { label: "1D", days: 1 },
  { label: "1W", days: 7 },
  { label: "1M", days: 30 },
  { label: "3M", days: 90 },
  { label: "1Y", days: 365 },
];

interface CandlestickChartProps {
  data: AssetHistoricalData[];
  assetName: string;
  assetSymbol: string;
  onTimeRangeChange?: (days: number) => void;
}

export const CandlestickChart = ({
  data,
  assetName,
  assetSymbol,
  onTimeRangeChange,
}: CandlestickChartProps) => {
  const [activeRange, setActiveRange] = useState(2); // Default to 1M

  const handleRangeChange = (index: number) => {
    setActiveRange(index);
    if (onTimeRangeChange) {
      onTimeRangeChange(timeRanges[index].days);
    }
  };

  // Calculate min and max for Y-axis
  const minPrice = Math.min(...data.map((d) => d.low)) * 0.999;
  const maxPrice = Math.max(...data.map((d) => d.high)) * 1.001;

  // Calculate min and max for volume Y-axis
  const maxVolume = Math.max(...data.map((d) => d.volume)) * 1.1;

  // Format date for X-axis
  const formatXAxis = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  // Format price for tooltip
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(price);
  };

  const colorConfig = {
    increase: {
      theme: { light: "#22c55e", dark: "#4ade80" },
    },
    decrease: {
      theme: { light: "#ef4444", dark: "#f87171" },
    },
    volume: {
      theme: { light: "#3b82f6", dark: "#60a5fa" },
    },
  };

  // Check if we have upward or downward trend for each data point
  const processedData = data.map((item) => ({
    ...item,
    trend: item.close >= item.open ? "increase" : "decrease",
  }));

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">
            {assetSymbol} - {assetName}
          </CardTitle>
          <div className="flex space-x-1">
            {timeRanges.map((range, index) => (
              <Button
                key={range.label}
                variant={activeRange === index ? "default" : "outline"}
                size="sm"
                className="text-xs px-2 py-1 h-8"
                onClick={() => handleRangeChange(index)}
              >
                {range.label}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ChartContainer
            config={colorConfig}
            className="h-full w-full"
          >
            <ComposedChart
              data={processedData}
              margin={{ top: 10, right: 0, left: 0, bottom: 10 }}
            >
              <defs>
                <linearGradient id="colorIncrease" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorDecrease" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                tickFormatter={formatXAxis}
                minTickGap={50}
                padding={{ left: 10, right: 10 }}
              />
              <YAxis
                domain={[minPrice, maxPrice]}
                tickFormatter={(value) => formatPrice(value)}
                width={80}
              />
              {/* Add a second Y-axis for volume */}
              <YAxis
                yAxisId="volume"
                orientation="right"
                domain={[0, maxVolume]}
                tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
                width={50}
                tickLine={false}
                axisLine={false}
                label={{ value: 'Volume', angle: -90, position: 'insideRight' }}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-background border border-border p-3 rounded-md shadow-md">
                        <p className="font-medium">{new Date(data.date).toLocaleDateString()}</p>
                        <p>Open: {formatPrice(data.open)}</p>
                        <p>High: {formatPrice(data.high)}</p>
                        <p>Low: {formatPrice(data.low)}</p>
                        <p>Close: {formatPrice(data.close)}</p>
                        <p>Volume: {new Intl.NumberFormat().format(data.volume)}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              
              {/* Candlestick body */}
              {processedData.map((entry, index) => (
                <React.Fragment key={`candle-${index}`}>
                  {/* Wick line (high to low) */}
                  <Line
                    type="monotone"
                    dataKey="high"
                    stroke={entry.trend === "increase" ? "#22c55e" : "#ef4444"}
                    dot={false}
                    activeDot={false}
                    isAnimationActive={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="low"
                    stroke={entry.trend === "increase" ? "#22c55e" : "#ef4444"}
                    dot={false}
                    activeDot={false}
                    isAnimationActive={false}
                  />
                </React.Fragment>
              ))}
              
              {/* Candle body (open to close) */}
              <Bar
                dataKey="trend"
                fill="#8884d8"
                stroke="#8884d8"
                barSize={8}
                shape={(props: any) => {
                  const { x, y, width, height, trend } = props;
                  const fill = trend === "increase" ? "#22c55e" : "#ef4444";
                  const stroke = trend === "increase" ? "#22c55e" : "#ef4444";
                  
                  return (
                    <rect
                      x={x - width / 2}
                      y={y}
                      width={width}
                      height={height}
                      stroke={stroke}
                      fill={fill}
                    />
                  );
                }}
              />
              
              {/* Volume bars at bottom - Fixed by adding yAxisId */}
              <Bar
                dataKey="volume"
                yAxisId="volume"
                fill="#3b82f6"
                opacity={0.3}
              />
            </ComposedChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};
