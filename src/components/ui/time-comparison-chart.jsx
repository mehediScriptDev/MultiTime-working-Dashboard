import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatTimezoneOffset } from "@/lib/utils";
import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";

export function TimeComparisonChart({ timezones, use24Hour }) {
  const { t } = useTranslation();
  const [currentTime, setCurrentTime] = useState(dayjs());
  const [hoverPosition, setHoverPosition] = useState(null); // percent 0-100
  const timelineGridRef = useRef(null);

  // Update time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(dayjs());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="mb-5 lg:mb-6 border-none shadow-xl overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
      <CardHeader className="pb-3 sm:pb-4 border-b border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/30">
        <CardTitle className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <div className="w-1.5 sm:w-2 h-5 sm:h-6 bg-blue-600 rounded-full" />
          {t("common.timeComparison")}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 sm:pt-5 md:pt-6">
        {/* Desktop/Tablet View - Original horizontal layout */}
        <div className="hidden md:block -mx-2 sm:mx-0">
          <div className="min-w-[700px] md:min-w-[800px] px-2">
            {/* Header row: logo only */}
            <div className="flex items-center mb-4 md:mb-5">
              {/* Logo cell — same width as the timezone label column */}
              <div className="w-40 md:w-52 pr-4 md:pr-6 shrink-0 flex items-center gap-2">
                <img src="/Logo.png" alt="TimeSync" className="h-10 w-auto" />
                <span className="text-xl font-black tracking-tighter text-gray-900 dark:text-white">
                  Time<span className="text-blue-600 dark:text-blue-400">Sync</span>
                </span>
              </div>
            </div>

            {/* Timezone rows - Desktop */}
            {timezones.map((timezone, idx) => {
              const now = currentTime.utcOffset(timezone.offset / 60);
              const hour = now.hour();
              const minute = now.minute();
              const currentTimePercent =
                ((hour * 60 + minute) / (24 * 60)) * 100;

              // Calculate working hours positions
              const workingHoursStart = timezone.workingHoursStart ?? 9;
              const workingHoursEnd = timezone.workingHoursEnd ?? 17;
              const workingHoursStartPercent = (workingHoursStart / 24) * 100;
              // handle overnight shifts
              let workingHoursWidthPercent = 0;
              if (workingHoursEnd >= workingHoursStart) {
                workingHoursWidthPercent =
                  ((workingHoursEnd - workingHoursStart) / 24) * 100;
              } else {
                workingHoursWidthPercent =
                  ((24 - workingHoursStart + workingHoursEnd) / 24) * 100;
              }

              // Dynamic blue/indigo colors for rows
              const rowColors = [
                "bg-blue-600/20 border-blue-400/30",
                "bg-indigo-600/20 border-indigo-400/30",
                "bg-sky-600/20 border-sky-400/30",
                "bg-blue-500/20 border-blue-300/30",
                "bg-indigo-500/20 border-indigo-300/30",
              ];
              const accentColor = rowColors[idx % rowColors.length];

              // Determine if current time in this timezone falls within working hours
              const currentHourDecimal = now.hour() + now.minute() / 60;
              let isActive = false;
              if (workingHoursStart <= workingHoursEnd) {
                isActive =
                  currentHourDecimal >= workingHoursStart &&
                  currentHourDecimal < workingHoursEnd;
              } else {
                isActive =
                  currentHourDecimal >= workingHoursStart ||
                  currentHourDecimal < workingHoursEnd;
              }

              // calculate hover time for this timezone
              let hoverTimeLabel = null;
              if (hoverPosition !== null) {
                const minutesAtPos = (hoverPosition / 100) * 24 * 60;
                const hoverLocal = dayjs()
                  .startOf("day")
                  .add(Math.round(minutesAtPos), "minute")
                  .utcOffset(timezone.offset / 60);
                hoverTimeLabel = hoverLocal.format(
                  use24Hour ? "HH:mm" : "h:mm A",
                );
              }

              return (
                <div
                  key={timezone.id}
                  className="flex items-center mb-4 md:mb-6 group"
                >
                  <div className="w-40 md:w-52 pr-4 md:pr-6 shrink-0">
                    <div className="flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-800/80 rounded-lg md:rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-200 group-hover:scale-[1.02]">
                      <div
                        title={isActive ? "Active Now" : "Inactive"}
                        className={`w-2.5 md:w-3.5 h-2.5 md:h-3.5 rounded-full flex-shrink-0 ${isActive ? "bg-green-500 shadow-lg shadow-green-500/50 animate-pulse" : "bg-gray-300 dark:bg-slate-600"}`}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-sm lg:text-sm text-gray-900 dark:text-slate-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {timezone.label || timezone.name}
                        </div>
                        <div className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wide mt-0.5">
                          {formatTimezoneOffset(timezone.offset)}
                          {hoverTimeLabel
                            ? ` · ${hoverTimeLabel}`
                            : ` · ${now.format(use24Hour ? "HH:mm" : "h:mm A")}`}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    ref={idx === 0 ? timelineGridRef : null}
                    onMouseMove={(e) => {
                      const el = e.currentTarget;
                      if (!el) return;
                      const rect = el.getBoundingClientRect();
                      const x = e.clientX - rect.left;
                      const pct = Math.max(
                        0,
                        Math.min(100, (x / rect.width) * 100),
                      );
                      setHoverPosition(pct);
                    }}
                    onMouseLeave={() => setHoverPosition(null)}
                    className="flex-1 h-7 md:h-8 bg-gray-100/50 dark:bg-slate-800/50 rounded-lg md:rounded-xl relative shadow-inner border border-gray-200/50 dark:border-slate-700/50"
                  >
                    {/* Grid lines */}
                    <div className="absolute inset-0 flex">
                      {Array.from({ length: 24 }).map((_, i) => (
                        <div
                          key={i}
                          className="flex-1 border-r border-gray-200/20 dark:border-slate-700/20 last:border-r-0"
                        />
                      ))}
                    </div>

                    {/* Working hours */}
                    <div
                      className={`h-full absolute transition-all duration-700 ease-out border-x ${accentColor}`}
                      style={{
                        left: `${workingHoursStartPercent}%`,
                        width: `${workingHoursWidthPercent}%`,
                      }}
                    >
                      <div className="w-full h-full bg-white/10 flex items-center justify-center">
                        <span className="text-[8px] font-bold dark:text-white text-[#2563eb] drop-shadow-md uppercase tracking-tighter block">
                          Active
                        </span>
                      </div>
                    </div>

                    {/* Hover position dashed line */}
                    {hoverPosition !== null && (
                      <div
                        className="absolute inset-y-0 z-20 pointer-events-none"
                        style={{ left: `${hoverPosition}%` }}
                      >
                        <div className="h-full border-l-2 border-dashed border-gray-400/60 dark:border-slate-400/40" />
                      </div>
                    )}

                    {/* Current time indicator with time label */}
                    <div
                      className="absolute w-0.5 h-full bg-red-500 z-10 shadow-[0_0_8px_rgba(239,68,68,0.5)] transition-all duration-1000 ease-in-out"
                      style={{ left: `${currentTimePercent}%` }}
                    >
                      <div className="absolute top-1/2 -translate-y-1/2 -left-1 w-2.5 h-2.5 rounded-full bg-red-500 ring-4 ring-red-100 dark:ring-red-900/50 shadow-sm"></div>
                      {/* Time label — right of line by default, flips left when near right edge */}
                      <div
                        className="absolute top-1/2 text-[10px] font-bold text-white dark:text-slate-200 whitespace-nowrap pointer-events-none select-none z-20"
                        style={{
                          left: currentTimePercent > 85 ? '-6px' : '12px',
                          transform: currentTimePercent > 85
                            ? 'translateX(-100%) translateY(-50%)'
                            : 'translateY(-50%)',
                        }}
                      >
                        {now.format(use24Hour ? "HH:mm" : "h:mm A")}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile View - Card layout like the reference image */}
        <div className="md:hidden space-y-4">
          {timezones.map((timezone, idx) => {
            const now = currentTime.utcOffset(timezone.offset / 60);
            const hour = now.hour();
            const minute = now.minute();
            const currentTimePercent = ((hour * 60 + minute) / (24 * 60)) * 100;

            // Calculate working hours positions
            const workingHoursStart = timezone.workingHoursStart ?? 9;
            const workingHoursEnd = timezone.workingHoursEnd ?? 17;
            const workingHoursStartPercent = (workingHoursStart / 24) * 100;
            let workingHoursWidthPercent = 0;
            if (workingHoursEnd >= workingHoursStart) {
              workingHoursWidthPercent =
                ((workingHoursEnd - workingHoursStart) / 24) * 100;
            } else {
              workingHoursWidthPercent =
                ((24 - workingHoursStart + workingHoursEnd) / 24) * 100;
            }

            // Determine if current time in this timezone falls within working hours
            const currentHourDecimal = now.hour() + now.minute() / 60;
            let isActive = false;
            if (workingHoursStart <= workingHoursEnd) {
              isActive =
                currentHourDecimal >= workingHoursStart &&
                currentHourDecimal < workingHoursEnd;
            } else {
              isActive =
                currentHourDecimal >= workingHoursStart ||
                currentHourDecimal < workingHoursEnd;
            }

            // Format working hours display
            const formatHour = (h) => {
              if (use24Hour) {
                return `${h.toString().padStart(2, "0")}:00`;
              }
              const period = h >= 12 ? "PM" : "AM";
              const hour12 = h % 12 === 0 ? 12 : h % 12;
              return `${hour12}:00 ${period}`;
            };

            return (
              <div
                key={timezone.id}
                className="bg-white dark:bg-[#131c2e] rounded-xl p-4 border border-slate-200 dark:border-[#1e2d47] shadow-sm"
              >
                {/* Header: Status dot + City + Country */}
                <div className="flex items-center gap-3 mb-1">
                  <div
                    className={`w-3 h-3 rounded-full flex-shrink-0 ${
                      isActive
                        ? "bg-green-500 shadow-lg shadow-green-500/50"
                        : "bg-gray-400 dark:bg-slate-500"
                    }`}
                  />
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {timezone.city || timezone.name?.split(",")[0]}
                    {timezone.region && (
                      <span className="text-slate-900 dark:text-white">
                        ,{" "}
                        {timezone.region
                          ?.split(" ")[0]
                          ?.substring(0, 2)
                          .toUpperCase() || ""}
                      </span>
                    )}
                  </h3>
                </div>

                {/* GMT offset + current time */}
                <div className="text-slate-600 dark:text-[#7b8ba5] text-sm font-medium mb-4 ml-6">
                  {formatTimezoneOffset(timezone.offset)} ·{" "}
                  {now.format(use24Hour ? "HH:mm" : "h:mm")}
                </div>

                {/* Timeline bar */}
                <div className="relative h-5 bg-slate-200 dark:bg-[#252f45] rounded-lg mb-7">
                  {/* Working hours bar with centered Active label */}
                  <div
                    className="absolute h-full bg-blue-500 dark:bg-[#3d5a8a] rounded -ml-3"
                    style={{
                      left: `${workingHoursStartPercent}%`,
                      width: `${workingHoursWidthPercent}%`,
                    }}
                  >
                    <span className="absolute inset-0 flex items-center justify-center text-[10px] font-semibold text-white dark:text-slate-200 uppercase tracking-widest">
                      ACTIVE
                    </span>
                  </div>
                  {/* Current time indicator with time label */}
                  <div
                    className="absolute z-10 flex flex-col items-center -translate-x-1/2"
                    style={{
                      left: `${currentTimePercent}%`,
                      top: "-4px",
                      bottom: "-4px",
                    }}
                  >
                    {/* Top vertical line */}
                    <div className="w-0.5 flex-1 bg-red-500" />
                    {/* Circle in center */}
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500 flex-shrink-0 ring-2 ring-red-500/30" />
                    {/* Bottom vertical line */}
                    <div className="w-0.5 flex-1 bg-red-500" />
                    {/* Time label following the red marker */}
                    <div
                      className="absolute -bottom-5 text-[9px] font-bold text-red-500 dark:text-red-400 whitespace-nowrap pointer-events-none select-none"
                      style={{
                        left: '50%',
                        transform: currentTimePercent > 85
                          ? 'translateX(-100%)'
                          : currentTimePercent < 15
                            ? 'translateX(0%)'
                            : 'translateX(-50%)',
                      }}
                    >
                      {now.format(use24Hour ? "HH:mm" : "h:mm A")}
                    </div>
                  </div>
                </div>

                {/* Working hours range + ACTIVE label */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-600 dark:text-[#7b8ba5] text-sm">
                    {formatHour(workingHoursStart)} -{" "}
                    {formatHour(workingHoursEnd)}
                  </span>
                  {isActive && (
                    <span className="text-green-600 dark:text-green-400 text-xs font-bold uppercase tracking-wider">
                      ACTIVE
                    </span>
                  )}
                </div>

                {/* Local Time */}
                <div className="text-slate-600 dark:text-[#7b8ba5] text-sm">
                  Local Time: {now.format(use24Hour ? "HH:mm" : "h:mm A")}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend - only show on desktop */}
        <div className="hidden md:flex mt-7 md:mt-8 pt-5 md:pt-6 border-t border-gray-100 dark:border-slate-800 flex-wrap gap-6 text-xs font-bold uppercase tracking-widest text-gray-400">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-600/20 border border-blue-600/30 rounded-md mr-2.5"></div>
            <span>{t("common.workingHoursLabel")}</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-500 rounded-full ring-4 ring-red-50 dark:ring-red-900/20 mr-2.5"></div>
            <span>{t("home.currentTime")}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
