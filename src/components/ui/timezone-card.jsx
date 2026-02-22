import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  getTimeInTimezone,
  getWorkingHoursPercent,
  formatAMPM,
} from "@/lib/utils";

export function TimezoneCard({ timezone, use24Hour, onEdit, onDelete }) {
  const { t } = useTranslation();

  // Use IANA timezone string if available, otherwise fallback to offset
  const timezoneIdentifier = timezone.timezone || timezone.offset;

  // State to force re-render for real-time clock
  const [, setTick] = useState(0);

  // State for pulse animation
  const [isPulsing, setIsPulsing] = useState(false);

  // Set up interval to update time every minute (no need for seconds)
  useEffect(() => {
    const intervalId = setInterval(() => {
      setTick((prev) => prev + 1);
    }, 60000); // Update every minute

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  // Pulse animation effect - pulses every 2 seconds to indicate live clock
  useEffect(() => {
    const pulseInterval = setInterval(() => {
      setIsPulsing(true);
      setTimeout(() => setIsPulsing(false), 1000);
    }, 2000);

    return () => clearInterval(pulseInterval);
  }, []);

  // Get current time using IANA string for accuracy, fallback to offset
  const { time, date, isWorkingHours } = getTimeInTimezone(
    timezoneIdentifier,
    use24Hour,
  );

  const workingHoursPercent = getWorkingHoursPercent(
    timezoneIdentifier,
    timezone.workingHoursStart,
    timezone.workingHoursEnd,
  );

  const workingHoursText = `${formatAMPM(timezone.workingHoursStart, use24Hour)} - ${formatAMPM(timezone.workingHoursEnd, use24Hour)}`;

  return (
    <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 rounded-[12px]">
      {/* Top accent line (light mode uses --primary) */}
      <div
        style={{ height: 4, backgroundColor: "hsl(var(--primary))" }}
        className="w-full"
      />
      <CardContent className="p-8 sm:p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl leading-6 font-bold text-gray-900 dark:text-white tracking-tight">
              {timezone.label || timezone.name}
            </h3>
            <p className="mt-1 max-w-2xl text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-slate-500">
              {timezone.region} • {timezone.abbreviation}
            </p>
          </div>
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="text-[#9CA3AF] hover:text-[#4F7CFF] hover:bg-blue-50 dark:text-gray-400 dark:hover:text-primary dark:hover:bg-blue-900/20 mr-1"
              onClick={() => onEdit(timezone)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-[#9CA3AF] hover:text-[#4F7CFF] hover:bg-blue-50 dark:text-gray-400 dark:hover:text-red-500 dark:hover:bg-red-900/20"
              onClick={() => onDelete(timezone)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="mt-8 text-center py-4 bg-white dark:bg-slate-800/50 rounded-2xl border border-gray-100/50 dark:border-slate-700/50 relative">
          {/* Live indicator - only show when within working hours */}
          {isWorkingHours && (
            <div className="absolute top-3 right-3 flex items-center gap-1.5">
              <span
                className={`w-2 h-2 rounded-full bg-green-500 transition-all duration-500 ${
                  isPulsing ? "scale-125 opacity-100" : "scale-100 opacity-70"
                }`}
                style={{
                  boxShadow: isPulsing
                    ? "0 0 8px rgba(34, 197, 94, 0.6)"
                    : "none",
                }}
              />
              <span className="text-[10px] font-medium text-green-600 dark:text-green-400 uppercase tracking-wider">
                active
              </span>
            </div>
          )}
          <div className="lg:text-5xl text-4xl py-3 sm:py-0 font-black text-gray-800 dark:text-slate-100 tracking-tighter">
            {time}
          </div>
          <div className="mt-2 text-xs font-bold text-primary/70 dark:text-blue-400 uppercase tracking-widest">
            {date}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-[#E5E9F0] dark:border-slate-800">
          <div className="flex justify-between items-center mb-3">
            <div className="text-xs font-semibold text-[#6B7280] dark:text-slate-500 uppercase tracking-wider">
              {t("home.workingHours")}
            </div>
            <div className="px-3 py-1 rounded-full bg-[#EEF2FF] dark:bg-blue-900/30 text-[#4F7CFF] dark:text-blue-400 text-xs font-semibold">
              {workingHoursText}
            </div>
          </div>
          <div className="relative h-3 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`absolute top-0 left-0 h-full rounded-full transition-all duration-500 ${isWorkingHours ? "bg-blue-500 dark:bg-gradient-to-r dark:from-blue-600 dark:to-indigo-600" : "bg-slate-400 dark:bg-slate-700"}`}
              style={{ width: `${workingHoursPercent}%` }}
            ></div>
          </div>
          <div className="mt-2 text-[10px] text-center font-medium text-[#9CA3AF] dark:text-slate-500">
            {isWorkingHours
              ? "Current team is online!"
              : "Team is currently offline"}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
