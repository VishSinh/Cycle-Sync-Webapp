"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface DatePickerProps {
  date: Date | undefined;
  onSelect: (date: Date | undefined) => void;
  disabled?: (date: Date) => boolean;
  placeholder?: string;
  dateFormat?: string; // Add format option
}

export function DatePicker({
  date,
  onSelect,
  disabled,
  placeholder = "Select a date",
  dateFormat = "PPP", // Default format (e.g., "April 29, 2023")
}: DatePickerProps) {
  // Add state to control navigation
  const [calendarDate, setCalendarDate] = React.useState<Date>(date || new Date());
  
  // Update calendar date when selected date changes
  React.useEffect(() => {
    if (date) {
      setCalendarDate(date);
    }
  }, [date]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, dateFormat) : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex flex-col">
          <Calendar
            mode="single"
            selected={date}
            onSelect={onSelect}
            disabled={disabled}
            initialFocus
            month={calendarDate}
            onMonthChange={setCalendarDate}
          />
          {date && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onSelect(undefined)}
              className="mt-2 mx-auto"
            >
              Clear
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

