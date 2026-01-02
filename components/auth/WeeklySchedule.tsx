"use client";

import { useState } from "react";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";
import { Copy } from "lucide-react";
import { TimePicker } from "./TimePicker";

interface WeeklyScheduleProps {
  value: {
    monday?: { open: string; close: string };
    tuesday?: { open: string; close: string };
    wednesday?: { open: string; close: string };
    thursday?: { open: string; close: string };
    friday?: { open: string; close: string };
    saturday?: { open: string; close: string };
    sunday?: { open: string; close: string };
  };
  onChange: (hours: any) => void;
}

const DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

const DAY_LABELS = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};

export function WeeklySchedule({ value, onChange }: WeeklyScheduleProps) {
  const [schedule, setSchedule] = useState(() => {
    const initial: any = {};
    DAYS.forEach((day) => {
      // If the day exists in value, it's open; otherwise it's closed
      if (value[day]) {
        initial[day] = {
          isOpen: true,
          open: value[day].open,
          close: value[day].close,
        };
      } else {
        // Day is closed - use default times but mark as closed
        initial[day] = {
          isOpen: false,
          open: "09:00",
          close: "18:00",
        };
      }
    });
    return initial;
  });

  const updateSchedule = (newSchedule: any) => {
    setSchedule(newSchedule);

    // Convert back to the format expected by parent
    // Only include days that are open - closed days should not be in the object
    const convertedHours: any = {};
    DAYS.forEach((day) => {
      if (newSchedule[day].isOpen) {
        convertedHours[day] = {
          open: newSchedule[day].open,
          close: newSchedule[day].close,
        };
      }
      // Don't include closed days in the object at all
    });
    onChange(convertedHours);
  };

  const toggleDay = (day: string) => {
    const newSchedule = {
      ...schedule,
      [day]: {
        ...schedule[day],
        isOpen: !schedule[day].isOpen,
      },
    };
    updateSchedule(newSchedule);
  };

  const updateTime = (day: string, field: "open" | "close", value: string) => {
    const newSchedule = {
      ...schedule,
      [day]: {
        ...schedule[day],
        [field]: value,
      },
    };
    updateSchedule(newSchedule);
  };

  const copyToAll = (day: string) => {
    const newSchedule = { ...schedule };
    const sourceDaySchedule = schedule[day];

    DAYS.forEach((targetDay) => {
      if (targetDay !== day) {
        newSchedule[targetDay] = {
          isOpen: sourceDaySchedule.isOpen,
          open: sourceDaySchedule.open,
          close: sourceDaySchedule.close,
        };
      }
    });

    updateSchedule(newSchedule);
  };

  return (
    <div className="space-y-1">
      {DAYS.map((day) => (
        <div
          key={day}
          className="group border border-border rounded-lg p-4 hover:border-primary/50 hover:shadow-sm transition-all duration-200 bg-card"
        >
          {/* Day header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3 flex-1">
              <Switch
                checked={schedule[day].isOpen}
                onCheckedChange={() => toggleDay(day)}
                className="data-[state=checked]:bg-primary"
              />
              <Label
                className={`text-base font-medium capitalize cursor-pointer transition-colors ${
                  schedule[day].isOpen
                    ? "text-foreground"
                    : "text-muted-foreground"
                }`}
                onClick={() => toggleDay(day)}
              >
                {DAY_LABELS[day]}
              </Label>
            </div>

            {schedule[day].isOpen && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => copyToAll(day)}
                className="text-xs text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Copy className="w-3 h-3 mr-1" />
                Copy to all
              </Button>
            )}
          </div>

          {/* Time inputs */}
          {schedule[day].isOpen ? (
            <div className="ml-10">
              <div className="flex items-center gap-3">
                {/* Start time */}
                <TimePicker
                  value={schedule[day].open}
                  onChange={(value) => updateTime(day, "open", value)}
                />

                <span className="text-lg font-bold text-primary/70 px-1">
                  →
                </span>

                {/* End time */}
                <TimePicker
                  value={schedule[day].close}
                  onChange={(value) => updateTime(day, "close", value)}
                />
              </div>
            </div>
          ) : (
            <div className="ml-10 text-sm text-muted-foreground italic">
              Unavailable
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
