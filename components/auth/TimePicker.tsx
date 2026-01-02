"use client";

import { useState, useRef, useEffect } from "react";
import { Clock } from "lucide-react";
import { Button } from "../ui/button";

interface TimePickerProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

// Generate time options in 30-minute intervals
const generateTimeOptions = () => {
  const times: string[] = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute of [0, 30]) {
      const hourStr = hour.toString().padStart(2, "0");
      const minStr = minute.toString().padStart(2, "0");
      times.push(`${hourStr}:${minStr}`);
    }
  }
  return times;
};

const TIME_OPTIONS = generateTimeOptions();

const formatTime = (time: string) => {
  const [hour, minute] = time.split(":");
  const hourNum = parseInt(hour);
  const period = hourNum >= 12 ? "PM" : "AM";
  const displayHour =
    hourNum === 0 ? 12 : hourNum > 12 ? hourNum - 12 : hourNum;
  return `${displayHour}:${minute} ${period}`;
};

export function TimePicker({
  value,
  onChange,
  className = "",
}: TimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const selectedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      // Scroll to selected time
      setTimeout(() => {
        selectedRef.current?.scrollIntoView({
          block: "center",
          behavior: "smooth",
        });
      }, 100);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleTimeSelect = (time: string) => {
    onChange(time);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      <Button
        ref={buttonRef}
        type="button"
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="h-11 w-40 justify-start text-left font-medium bg-gradient-to-br from-background to-primary/5 border-2 border-border hover:border-primary/60 hover:bg-primary/5 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 rounded-xl shadow-sm hover:shadow-md"
      >
        <Clock className="w-4 h-4 mr-2 text-primary" />
        <span className="text-sm">{formatTime(value)}</span>
      </Button>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute z-50 mt-2 w-48 bg-card border-2 border-primary/20 rounded-xl shadow-2xl overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200"
        >
          <div className="p-2 border-b border-border bg-gradient-to-r from-primary/10 to-orange-500/10">
            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-primary" />
              Select Time
            </p>
          </div>

          <div className="max-h-64 overflow-y-auto custom-scrollbar">
            <div className="p-1.5 space-y-0.5">
              {TIME_OPTIONS.map((time) => {
                const isSelected = time === value;
                return (
                  <div
                    key={time}
                    ref={isSelected ? selectedRef : null}
                    onClick={() => handleTimeSelect(time)}
                    className={`px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-150 ${
                      isSelected
                        ? "bg-gradient-to-r from-primary to-orange-500 text-white font-semibold shadow-md scale-105"
                        : "hover:bg-primary/10 hover:pl-4 text-foreground"
                    }`}
                  >
                    <span className="text-sm">{formatTime(time)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: hsl(var(--primary) / 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: hsl(var(--primary) / 0.5);
        }
      `}</style>
    </div>
  );
}
