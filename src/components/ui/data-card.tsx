
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DataCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  className?: string;
  children: React.ReactNode;
  headerClassName?: string;
  contentClassName?: string;
}

export const DataCard = ({
  title,
  description,
  className,
  children,
  headerClassName,
  contentClassName,
  ...props
}: DataCardProps) => {
  return (
    <Card className={cn("overflow-hidden", className)} {...props}>
      <CardHeader className={cn("pb-2", headerClassName)}>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className={cn("pt-2", contentClassName)}>{children}</CardContent>
    </Card>
  );
};
