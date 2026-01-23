import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatAMPM(hour: number, use24Hour = false): string {
  if (use24Hour) {
    return `${hour.toString().padStart(2, "0")}:00`;
  }
  
  const isPM = hour >= 12;
  const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${formattedHour}:00 ${isPM ? 'PM' : 'AM'}`;
}

export function getTimeInTimezone(offsetMinutes: number, use24Hour = false): {
  time: string;
  date: string;
  isWorkingHours: boolean;
} {
  const now = dayjs().utcOffset(offsetMinutes);
  
  const time = use24Hour
    ? now.format("HH:mm")
    : now.format("h:mm A");
  
  const date = now.format("ddd, MMM D, YYYY");
  
  const hour = now.hour();
  const isWorkingHours = hour >= 9 && hour < 17;
  
  return { time, date, isWorkingHours };
}

export function getWorkingHoursPercent(
  currentOffsetMinutes: number,
  workingHoursStart: number,
  workingHoursEnd: number
): number {
  const now = dayjs().utcOffset(currentOffsetMinutes);
  const hour = now.hour();
  const minute = now.minute();
  
  const currentTime = hour + minute / 60;
  
  if (currentTime < workingHoursStart || currentTime >= workingHoursEnd) {
    return 0; // Outside working hours
  }
  
  const totalWorkingHours = workingHoursEnd - workingHoursStart;
  const hoursPassed = currentTime - workingHoursStart;
  
  return (hoursPassed / totalWorkingHours) * 100;
}

export function getCommonTimezones() {
  return [
    // North America
    { name: "New York", city: "New York", region: "United States", abbreviation: "EST", offset: -300 },
    { name: "Los Angeles", city: "Los Angeles", region: "United States", abbreviation: "PST", offset: -480 },
    { name: "Chicago", city: "Chicago", region: "United States", abbreviation: "CST", offset: -360 },
    { name: "Toronto", city: "Toronto", region: "Canada", abbreviation: "EST", offset: -300 },
    { name: "Vancouver", city: "Vancouver", region: "Canada", abbreviation: "PST", offset: -480 },
    { name: "Mexico City", city: "Mexico City", region: "Mexico", abbreviation: "CST", offset: -360 },
    
    // Europe
    { name: "London", city: "London", region: "United Kingdom", abbreviation: "GMT", offset: 0 },
    { name: "Paris", city: "Paris", region: "France", abbreviation: "CET", offset: 60 },
    { name: "Berlin", city: "Berlin", region: "Germany", abbreviation: "CET", offset: 60 },
    { name: "Madrid", city: "Madrid", region: "Spain", abbreviation: "CET", offset: 60 },
    { name: "Rome", city: "Rome", region: "Italy", abbreviation: "CET", offset: 60 },
    { name: "Amsterdam", city: "Amsterdam", region: "Netherlands", abbreviation: "CET", offset: 60 },
    { name: "Zürich", city: "Zürich", region: "Switzerland", abbreviation: "CET", offset: 60 },
    { name: "Istanbul", city: "Istanbul", region: "Turkey", abbreviation: "TRT", offset: 180 },
    
    // Asia
    { name: "Tokyo", city: "Tokyo", region: "Japan", abbreviation: "JST", offset: 540 },
    { name: "Seoul", city: "Seoul", region: "South Korea", abbreviation: "KST", offset: 540 },
    { name: "Shanghai", city: "Shanghai", region: "China", abbreviation: "CST", offset: 480 },
    { name: "Hong Kong", city: "Hong Kong", region: "China", abbreviation: "HKT", offset: 480 },
    { name: "Singapore", city: "Singapore", region: "Singapore", abbreviation: "SGT", offset: 480 },
    { name: "Bangkok", city: "Bangkok", region: "Thailand", abbreviation: "ICT", offset: 420 },
    { name: "Mumbai", city: "Mumbai", region: "India", abbreviation: "IST", offset: 330 },
    { name: "Dubai", city: "Dubai", region: "United Arab Emirates", abbreviation: "GST", offset: 240 },
    { name: "Tel Aviv", city: "Tel Aviv", region: "Israel", abbreviation: "IST", offset: 120 },
    
    // Oceania
    { name: "Sydney", city: "Sydney", region: "Australia", abbreviation: "AEST", offset: 600 },
    { name: "Melbourne", city: "Melbourne", region: "Australia", abbreviation: "AEST", offset: 600 },
    { name: "Auckland", city: "Auckland", region: "New Zealand", abbreviation: "NZST", offset: 720 },
    
    // South America
    { name: "São Paulo", city: "São Paulo", region: "Brazil", abbreviation: "BRT", offset: -180 },
    { name: "Buenos Aires", city: "Buenos Aires", region: "Argentina", abbreviation: "ART", offset: -180 },
    { name: "Santiago", city: "Santiago", region: "Chile", abbreviation: "CLT", offset: -240 },
    
    // Africa
    { name: "Cairo", city: "Cairo", region: "Egypt", abbreviation: "EET", offset: 120 },
    { name: "Johannesburg", city: "Johannesburg", region: "South Africa", abbreviation: "SAST", offset: 120 },
    { name: "Lagos", city: "Lagos", region: "Nigeria", abbreviation: "WAT", offset: 60 },
    { name: "Nairobi", city: "Nairobi", region: "Kenya", abbreviation: "EAT", offset: 180 },
  ];
}

export function formatTimezoneOffset(offsetMinutes: number): string {
  const sign = offsetMinutes >= 0 ? "+" : "-";
  const absOffset = Math.abs(offsetMinutes);
  const hours = Math.floor(absOffset / 60);
  const minutes = absOffset % 60;
  
  return `GMT${sign}${hours}${minutes > 0 ? `:${minutes}` : ""}`;
}
