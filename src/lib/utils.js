import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatAMPM(hour, use24Hour = false) {
  if (use24Hour) {
    return `${hour.toString().padStart(2, "0")}:00`;
  }

  const isPM = hour >= 12;
  const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${formattedHour}:00 ${isPM ? "PM" : "AM"}`;
}

/**
 * Get time in a specific timezone
 * @param {string|number} timezoneOrOffset - IANA timezone string (e.g., "America/New_York") or offset in minutes
 * @param {boolean} use24Hour - Whether to use 24-hour format
 * @returns {{time: string, date: string, isWorkingHours: boolean}}
 */
export function getTimeInTimezone(timezoneOrOffset, use24Hour = false) {
  let now;

  // Check if it's an IANA timezone string or a numeric offset
  if (typeof timezoneOrOffset === "string" && timezoneOrOffset.includes("/")) {
    // Use IANA timezone string with dayjs timezone plugin
    now = dayjs().tz(timezoneOrOffset);
  } else {
    // Fallback to numeric offset (in minutes)
    now = dayjs().utcOffset(timezoneOrOffset);
  }

  // Clean time format without seconds (HH:mm) - live effect shown via animation
  const time = use24Hour ? now.format("HH:mm") : now.format("h:mm A");

  const date = now.format("ddd, MMM D, YYYY");

  const hour = now.hour();
  const isWorkingHours = hour >= 9 && hour < 17;

  return { time, date, isWorkingHours };
}

/**
 * Get working hours progress percentage
 * @param {string|number} timezoneOrOffset - IANA timezone string or offset in minutes
 * @param {number} workingHoursStart - Start hour (0-23)
 * @param {number} workingHoursEnd - End hour (0-23)
 * @returns {number} Percentage of working hours elapsed
 */
export function getWorkingHoursPercent(
  timezoneOrOffset,
  workingHoursStart,
  workingHoursEnd,
) {
  let now;

  // Check if it's an IANA timezone string or a numeric offset
  if (typeof timezoneOrOffset === "string" && timezoneOrOffset.includes("/")) {
    now = dayjs().tz(timezoneOrOffset);
  } else {
    now = dayjs().utcOffset(timezoneOrOffset);
  }

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

/**
 * Get all timezones dynamically using the Intl API
 * @returns {Array<{name: string, city: string, region: string, country: string, abbreviation: string, offset: number, timezone: string}>}
 */
export function getCommonTimezones() {
  // Mapping of IANA timezone identifiers to country names for searchability
  const timezoneToCountry = {
    // Asia
    "Asia/Dhaka": "Bangladesh",
    "Asia/Tokyo": "Japan",
    "Asia/Seoul": "South Korea",
    "Asia/Shanghai": "China",
    "Asia/Hong_Kong": "China",
    "Asia/Singapore": "Singapore",
    "Asia/Bangkok": "Thailand",
    "Asia/Ho_Chi_Minh": "Vietnam",
    "Asia/Jakarta": "Indonesia",
    "Asia/Kolkata": "India",
    "Asia/Mumbai": "India",
    "Asia/Delhi": "India",
    "Asia/Karachi": "Pakistan",
    "Asia/Dubai": "United Arab Emirates",
    "Asia/Riyadh": "Saudi Arabia",
    "Asia/Jerusalem": "Israel",
    "Asia/Tel_Aviv": "Israel",
    "Asia/Istanbul": "Turkey",
    "Asia/Manila": "Philippines",
    "Asia/Kuala_Lumpur": "Malaysia",
    "Asia/Taipei": "Taiwan",
    "Asia/Colombo": "Sri Lanka",
    "Asia/Kathmandu": "Nepal",
    "Asia/Yangon": "Myanmar",
    "Asia/Almaty": "Kazakhstan",
    "Asia/Tashkent": "Uzbekistan",
    "Asia/Baku": "Azerbaijan",
    "Asia/Tbilisi": "Georgia",
    "Asia/Yerevan": "Armenia",
    "Asia/Beirut": "Lebanon",
    "Asia/Damascus": "Syria",
    "Asia/Amman": "Jordan",
    "Asia/Baghdad": "Iraq",
    "Asia/Tehran": "Iran",
    "Asia/Kabul": "Afghanistan",
    "Asia/Muscat": "Oman",
    "Asia/Qatar": "Qatar",
    "Asia/Kuwait": "Kuwait",
    "Asia/Bahrain": "Bahrain",
    // Europe
    "Europe/London": "United Kingdom",
    "Europe/Paris": "France",
    "Europe/Berlin": "Germany",
    "Europe/Madrid": "Spain",
    "Europe/Rome": "Italy",
    "Europe/Amsterdam": "Netherlands",
    "Europe/Brussels": "Belgium",
    "Europe/Vienna": "Austria",
    "Europe/Zurich": "Switzerland",
    "Europe/Stockholm": "Sweden",
    "Europe/Oslo": "Norway",
    "Europe/Copenhagen": "Denmark",
    "Europe/Helsinki": "Finland",
    "Europe/Warsaw": "Poland",
    "Europe/Prague": "Czech Republic",
    "Europe/Budapest": "Hungary",
    "Europe/Bucharest": "Romania",
    "Europe/Sofia": "Bulgaria",
    "Europe/Athens": "Greece",
    "Europe/Istanbul": "Turkey",
    "Europe/Moscow": "Russia",
    "Europe/Kiev": "Ukraine",
    "Europe/Lisbon": "Portugal",
    "Europe/Dublin": "Ireland",
    "Europe/Zagreb": "Croatia",
    "Europe/Belgrade": "Serbia",
    "Europe/Bratislava": "Slovakia",
    "Europe/Ljubljana": "Slovenia",
    "Europe/Sarajevo": "Bosnia and Herzegovina",
    "Europe/Tallinn": "Estonia",
    "Europe/Riga": "Latvia",
    "Europe/Vilnius": "Lithuania",
    "Europe/Minsk": "Belarus",
    "Europe/Chisinau": "Moldova",
    // Americas
    "America/New_York": "United States",
    "America/Los_Angeles": "United States",
    "America/Chicago": "United States",
    "America/Denver": "United States",
    "America/Phoenix": "United States",
    "America/Houston": "United States",
    "America/Detroit": "United States",
    "America/Atlanta": "United States",
    "America/Seattle": "United States",
    "America/Miami": "United States",
    "America/Boston": "United States",
    "America/Toronto": "Canada",
    "America/Vancouver": "Canada",
    "America/Montreal": "Canada",
    "America/Edmonton": "Canada",
    "America/Calgary": "Canada",
    "America/Winnipeg": "Canada",
    "America/Halifax": "Canada",
    "America/Mexico_City": "Mexico",
    "America/Cancun": "Mexico",
    "America/Tijuana": "Mexico",
    "America/Sao_Paulo": "Brazil",
    "America/Rio_de_Janeiro": "Brazil",
    "America/Brasilia": "Brazil",
    "America/Buenos_Aires": "Argentina",
    "America/Santiago": "Chile",
    "America/Lima": "Peru",
    "America/Bogota": "Colombia",
    "America/Caracas": "Venezuela",
    "America/Panama": "Panama",
    "America/Havana": "Cuba",
    "America/Jamaica": "Jamaica",
    "America/Puerto_Rico": "Puerto Rico",
    "America/Costa_Rica": "Costa Rica",
    "America/Guatemala": "Guatemala",
    "America/Montevideo": "Uruguay",
    "America/Asuncion": "Paraguay",
    "America/La_Paz": "Bolivia",
    "America/Quito": "Ecuador",
    // Oceania
    "Australia/Sydney": "Australia",
    "Australia/Melbourne": "Australia",
    "Australia/Brisbane": "Australia",
    "Australia/Perth": "Australia",
    "Australia/Adelaide": "Australia",
    "Australia/Darwin": "Australia",
    "Australia/Hobart": "Australia",
    "Pacific/Auckland": "New Zealand",
    "Pacific/Wellington": "New Zealand",
    "Pacific/Fiji": "Fiji",
    "Pacific/Honolulu": "United States",
    "Pacific/Guam": "United States",
    // Africa
    "Africa/Cairo": "Egypt",
    "Africa/Johannesburg": "South Africa",
    "Africa/Lagos": "Nigeria",
    "Africa/Nairobi": "Kenya",
    "Africa/Casablanca": "Morocco",
    "Africa/Algiers": "Algeria",
    "Africa/Tunis": "Tunisia",
    "Africa/Accra": "Ghana",
    "Africa/Addis_Ababa": "Ethiopia",
    "Africa/Dar_es_Salaam": "Tanzania",
    "Africa/Kampala": "Uganda",
    "Africa/Khartoum": "Sudan",
    "Africa/Tripoli": "Libya",
    "Africa/Abidjan": "Ivory Coast",
    "Africa/Dakar": "Senegal",
  };

  // Mapping of IANA timezone to alternative city names for searchability
  const cityAliases = {
    "Asia/Kolkata": [
      "Calcutta",
      "Delhi",
      "Bangalore",
      "Hyderabad",
      "Ahmedabad",
      "Pune",
      "Jaipur",
      "India",
    ],
    "Asia/Mumbai": ["Bombay"],
    "Asia/Ho_Chi_Minh": ["Saigon"],
    "Asia/Yangon": ["Rangoon"],
    "Europe/Kiev": ["Kyiv"],
    "Europe/Istanbul": ["Constantinople"],
    "Asia/Shanghai": [
      "Beijing",
      "Peking",
      "Guangzhou",
      "Shenzhen",
      "Chengdu",
      "Wuhan",
      "Xi'an",
    ],
    "America/New_York": ["Manhattan", "Brooklyn", "Queens", "USA", "US"],
    "America/Los_Angeles": [
      "Hollywood",
      "San Francisco",
      "San Diego",
      "USA",
      "US",
    ],
    "America/Chicago": ["USA", "US"],
    "Europe/London": ["UK", "Britain", "England"],
    "America/Sao_Paulo": ["Rio", "Brasil"],
    "Asia/Tokyo": ["Osaka", "Yokohama", "Nagoya", "Kyoto"],
    "Australia/Sydney": ["Canberra"],
    "Asia/Dubai": ["Abu Dhabi", "UAE"],
    "Asia/Singapore": ["SG"],
    "Asia/Bangkok": ["Phuket"],
    "Asia/Jakarta": ["Bali", "Surabaya"],
    "Asia/Manila": ["Cebu"],
    "America/Toronto": ["Ottawa", "Montreal"],
    "America/Mexico_City": ["Guadalajara", "Monterrey"],
    "Europe/Paris": ["Lyon", "Marseille"],
    "Europe/Berlin": ["Munich", "Frankfurt", "Hamburg", "Cologne"],
    "Europe/Rome": ["Milan", "Naples", "Turin", "Florence", "Venice"],
    "Europe/Madrid": ["Barcelona", "Valencia", "Seville"],
    "Africa/Cairo": ["Alexandria", "Giza"],
    "Africa/Lagos": ["Abuja", "Kano", "Ibadan"],
    "Africa/Johannesburg": ["Cape Town", "Durban", "Pretoria"],
    "America/Buenos_Aires": ["Cordoba", "Rosario"],
    "Asia/Seoul": ["Busan", "Incheon"],
    "Asia/Dhaka": ["Chittagong", "Khulna", "Sylhet", "BD"],
    "Asia/Karachi": ["Lahore", "Islamabad", "Faisalabad"],
    "Pacific/Auckland": ["Wellington", "Christchurch", "NZ"],
  };

  try {
    // Get all supported IANA timezone identifiers from the browser
    const allTimezones = Intl.supportedValuesOf("timeZone");

    return allTimezones.map((tz) => {
      // Parse the IANA string to extract region and city
      // Format is typically "Region/City" or "Region/Subregion/City"
      const parts = tz.split("/");
      const city = parts[parts.length - 1].replace(/_/g, " ");
      const region = parts.slice(0, -1).join("/").replace(/_/g, " ");

      // Get the current offset for this timezone
      const now = dayjs().tz(tz);
      const offsetMinutes = now.utcOffset();

      // Get timezone abbreviation dynamically
      const formatter = new Intl.DateTimeFormat("en", {
        timeZone: tz,
        timeZoneName: "short",
      });
      const parts2 = formatter.formatToParts(new Date());
      const abbreviation =
        parts2.find((p) => p.type === "timeZoneName")?.value || "";

      // Get country from mapping, or derive from region for unmapped timezones
      const country =
        timezoneToCountry[tz] || region.split("/")[0] || "Unknown";

      // Get aliases for this timezone to enable alternative name searches
      const aliases = cityAliases[tz] || [];

      // Create searchable text that includes all alternative names
      const searchableText = [city, country, region, ...aliases]
        .join(" ")
        .toLowerCase();

      return {
        name: city,
        city: city,
        region: region || "UTC",
        country: country,
        aliases: aliases, // Alternative city names for search
        searchableText: searchableText, // Pre-computed for faster search
        abbreviation: abbreviation,
        offset: offsetMinutes,
        timezone: tz, // IANA timezone string for accurate calculations
      };
    });
  } catch (error) {
    // Fallback for browsers that don't support Intl.supportedValuesOf
    console.warn(
      "Intl.supportedValuesOf not supported, using fallback timezones",
    );
    return [
      {
        name: "New York",
        city: "New York",
        region: "America",
        abbreviation: "EST",
        offset: -300,
        timezone: "America/New_York",
      },
      {
        name: "Los Angeles",
        city: "Los Angeles",
        region: "America",
        abbreviation: "PST",
        offset: -480,
        timezone: "America/Los_Angeles",
      },
      {
        name: "Chicago",
        city: "Chicago",
        region: "America",
        abbreviation: "CST",
        offset: -360,
        timezone: "America/Chicago",
      },
      {
        name: "London",
        city: "London",
        region: "Europe",
        abbreviation: "GMT",
        offset: 0,
        timezone: "Europe/London",
      },
      {
        name: "Paris",
        city: "Paris",
        region: "Europe",
        abbreviation: "CET",
        offset: 60,
        timezone: "Europe/Paris",
      },
      {
        name: "Berlin",
        city: "Berlin",
        region: "Europe",
        abbreviation: "CET",
        offset: 60,
        timezone: "Europe/Berlin",
      },
      {
        name: "Tokyo",
        city: "Tokyo",
        region: "Asia",
        abbreviation: "JST",
        offset: 540,
        timezone: "Asia/Tokyo",
      },
      {
        name: "Sydney",
        city: "Sydney",
        region: "Australia",
        abbreviation: "AEST",
        offset: 600,
        timezone: "Australia/Sydney",
      },
      {
        name: "Dubai",
        city: "Dubai",
        region: "Asia",
        abbreviation: "GST",
        offset: 240,
        timezone: "Asia/Dubai",
      },
      {
        name: "Singapore",
        city: "Singapore",
        region: "Asia",
        abbreviation: "SGT",
        offset: 480,
        timezone: "Asia/Singapore",
      },
    ];
  }
}

export function formatTimezoneOffset(offsetMinutes) {
  const sign = offsetMinutes >= 0 ? "+" : "-";
  const absOffset = Math.abs(offsetMinutes);
  const hours = Math.floor(absOffset / 60);
  const minutes = absOffset % 60;

  return `GMT${sign}${hours}${minutes > 0 ? `:${minutes}` : ""}`;
}
