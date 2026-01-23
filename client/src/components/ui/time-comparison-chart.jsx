import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatTimezoneOffset, formatAMPM } from "@/lib/utils";
import { useState, useEffect } from "react";
import dayjs from "dayjs";

export function TimeComparisonChart({ timezones, use24Hour }) {
  const [currentTime, setCurrentTime] = useState(dayjs());

  // Update time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(dayjs());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Generate hours for the time scale
  const timeScale = Array.from({ length: 24 }, (_, i) => 
    use24Hour ? `${i.toString().padStart(2, "0")}` : formatAMPM(i, false).split(":")[0] + (i >= 12 ? "p" : "a")
  );

  return (
    <Card className="mb-8 border-none shadow-xl overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
      <CardHeader className="pb-4 border-b border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/30">
        <CardTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <div className="w-2 h-6 bg-blue-600 rounded-full" />
          Time Comparison
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="overflow-x-auto">
          <div className="min-w-[800px] px-2">
            {/* Time scale (24 hour) */}
            <div className="flex h-12 border-b border-gray-100 dark:border-slate-800 mb-6 bg-gray-50/30 dark:bg-slate-800/20 rounded-t-lg">
              {timeScale.map((hour, i) => (
                <div key={i} className="flex-1 flex flex-col justify-center items-center border-r last:border-r-0 border-gray-100/50 dark:border-slate-700/30">
                  <span className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-tighter">{hour}</span>
                </div>
              ))}
            </div>

            {/* Timezone rows */}
            {timezones.map((timezone, idx) => {
              const now = currentTime.utcOffset(timezone.offset / 60);
              const hour = now.hour();
              const minute = now.minute();
              const currentTimePercent = ((hour * 60 + minute) / (24 * 60)) * 100;
              
              // Calculate working hours positions
              const workingHoursStart = timezone.workingHoursStart;
              const workingHoursEnd = timezone.workingHoursEnd;
              const workingHoursStartPercent = (workingHoursStart / 24) * 100;
              const workingHoursWidthPercent = ((workingHoursEnd - workingHoursStart) / 24) * 100;
              
              // Dynamic blue/indigo colors for rows
              const rowColors = [
                'bg-blue-600/20 border-blue-400/30',
                'bg-indigo-600/20 border-indigo-400/30',
                'bg-sky-600/20 border-sky-400/30',
                'bg-blue-500/20 border-blue-300/30',
                'bg-indigo-500/20 border-indigo-300/30'
              ];
              const accentColor = rowColors[idx % rowColors.length];
              
              return (
                <div key={timezone.id} className="flex items-center mb-6 group">
                  <div className="w-40 pr-6 shrink-0">
                    <div className="font-bold text-gray-800 dark:text-slate-200 truncate group-hover:text-blue-600 transition-colors">{timezone.name}</div>
                    <div className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">
                      {formatTimezoneOffset(timezone.offset)}
                    </div>
                  </div>
                  <div className="flex-1 h-8 bg-gray-100/50 dark:bg-slate-800/50 rounded-xl relative shadow-inner border border-gray-200/50 dark:border-slate-700/50 overflow-hidden">
                    {/* Grid lines */}
                    <div className="absolute inset-0 flex">
                      {Array.from({ length: 24 }).map((_, i) => (
                        <div key={i} className="flex-1 border-r border-gray-200/20 dark:border-slate-700/20 last:border-r-0" />
                      ))}
                    </div>

                    {/* Working hours */}
                    <div 
                      className={`h-full absolute transition-all duration-700 ease-out border-x ${accentColor}`}
                      style={{ 
                        left: `${workingHoursStartPercent}%`, 
                        width: `${workingHoursWidthPercent}%` 
                      }}
                    >
                      <div className="w-full h-full bg-white/10 flex items-center justify-center">
                        <span className="text-[8px] font-bold text-gray-500/50 uppercase tracking-tighter hidden md:block">Active</span>
                      </div>
                    </div>

                    {/* Current time indicator */}
                    <div 
                      className="absolute w-0.5 h-full bg-red-500 z-10 shadow-[0_0_8px_rgba(239,68,68,0.5)] transition-all duration-1000 ease-in-out" 
                      style={{ left: `${currentTimePercent}%` }}
                    >
                      <div className="absolute top-1/2 -translate-y-1/2 -left-1 w-2.5 h-2.5 rounded-full bg-red-500 ring-4 ring-red-100 dark:ring-red-900/50 shadow-sm"></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-slate-800 flex flex-wrap gap-6 text-xs font-bold uppercase tracking-widest text-gray-400">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-600/20 border border-blue-600/30 rounded-md mr-2.5"></div>
            <span>Working hours</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-500 rounded-full ring-4 ring-red-50 dark:ring-red-900/20 mr-2.5"></div>
            <span>Current time</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
