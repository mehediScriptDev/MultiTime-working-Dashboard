import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { Timezone } from "@shared/schema";
import { getTimeInTimezone, getWorkingHoursPercent, formatAMPM } from "@/lib/utils";

export function TimezoneCard({ timezone, use24Hour, onEdit, onDelete }) {
  const { time, date, isWorkingHours } = getTimeInTimezone(timezone.offset, use24Hour);
  
  const workingHoursPercent = getWorkingHoursPercent(
    timezone.offset,
    timezone.workingHoursStart,
    timezone.workingHoursEnd
  );

  const workingHoursText = `${formatAMPM(timezone.workingHoursStart, use24Hour)} - ${formatAMPM(timezone.workingHoursEnd, use24Hour)}`;

  return (
    <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white dark:bg-slate-900">
      <div className={`h-2 w-full ${isWorkingHours ? 'bg-gradient-to-r from-blue-400 to-indigo-500' : 'bg-gradient-to-r from-slate-400 to-slate-600'}`} />
      <CardContent className="p-4 sm:p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl leading-6 font-bold text-gray-900 dark:text-white tracking-tight">{timezone.name}</h3>
            <p className="mt-1 max-w-2xl text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-slate-500">
              {timezone.region} • {timezone.abbreviation}
            </p>
          </div>
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-primary hover:bg-primary/10 mr-1 dark:hover:bg-blue-900/20"
              onClick={() => onEdit(timezone)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
              onClick={() => onDelete(timezone)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="mt-8 text-center py-4 bg-gray-50/50 dark:bg-slate-800/50 rounded-2xl border border-gray-100/50 dark:border-slate-700/50">
          <div className="text-5xl font-black text-gray-800 dark:text-slate-100 tracking-tighter">{time}</div>
          <div className="mt-2 text-xs font-bold text-primary/70 dark:text-blue-400 uppercase tracking-widest">{date}</div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-slate-800">
          <div className="flex justify-between items-center mb-3">
            <div className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider">Working Hours</div>
            <div className="px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold">
              {workingHoursText}
            </div>
          </div>
          <div className="relative h-3 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
            <div 
              className={`absolute top-0 left-0 h-full rounded-full transition-all duration-500 ${isWorkingHours ? 'bg-gradient-to-r from-blue-600 to-indigo-600 shadow-[0_0_10px_rgba(37,99,235,0.5)]' : 'bg-gray-300 dark:bg-slate-700'}`} 
              style={{ width: `${workingHoursPercent}%` }}
            ></div>
          </div>
          <div className="mt-2 text-[10px] text-center font-medium text-gray-400 dark:text-slate-500">
            {isWorkingHours ? 'Current team is online!' : 'Team is currently offline'}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
