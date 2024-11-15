import { differenceInDays, format } from "date-fns";

import { cn } from "@/lib/utils";

interface TaskDateProps {
  date: string;
  className?: string;
}

export function TaskDate({ date, className }: TaskDateProps) {
  const today = new Date();
  const endDate = new Date(date);
  const diffInDays = differenceInDays(endDate, today);

  let textColor = "text-muted-foreground";

  if (diffInDays <= 3) {
    textColor = "text-red-500";
  } else if (diffInDays <= 7) {
    textColor = "text-orange-500";
  } else if (diffInDays <= 14) {
    textColor = "text-yellow-500";
  }

  return (
    <div className={textColor}>
      <span className={cn("truncate", className)}>{format(date, "PPP")}</span>
    </div>
  );
}
