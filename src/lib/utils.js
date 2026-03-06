import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { cityMapping } from "city-timezones";

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

// Module-level cache — built once per session, free on subsequent calls
let _cachedTimezones = null;

/**
 * Get all timezones from the city-timezones dataset (~7 300 world cities).
 * Sorted by population (largest first) so the most relevant cities appear at
 * the top of the unfiltered list. Results are cached after the first call.
 * @returns {Array<{name, city, region, country, province, abbreviation, offset, timezone, searchableText}>}
 */
export function getCommonTimezones() {
  if (_cachedTimezones) return _cachedTimezones;

  // Per-IANA-zone caches — avoids redundant Intl / dayjs work for zones
  // shared by many cities (e.g. hundreds of US cities share America/New_York)
  const abbrCache = new Map();
  const offsetCache = new Map();

  const getAbbr = (tz) => {
    if (!abbrCache.has(tz)) {
      try {
        const parts = new Intl.DateTimeFormat("en", {
          timeZone: tz,
          timeZoneName: "short",
        }).formatToParts(new Date());
        abbrCache.set(
          tz,
          parts.find((p) => p.type === "timeZoneName")?.value || "",
        );
      } catch {
        abbrCache.set(tz, "");
      }
    }
    return abbrCache.get(tz);
  };

  const getOffset = (tz) => {
    if (!offsetCache.has(tz)) {
      try {
        offsetCache.set(tz, dayjs().tz(tz).utcOffset());
      } catch {
        offsetCache.set(tz, 0);
      }
    }
    return offsetCache.get(tz);
  };

  // Sort once by population — used for both city entries and country picking
  const sorted = cityMapping
    .filter((c) => Boolean(c.timezone))
    .sort((a, b) => (b.pop || 0) - (a.pop || 0));

  // ── City entries ───────────────────────────────────────────────────────────
  const cityEntries = sorted.map((c) => {
    const tz = c.timezone;
    const region =
      tz.split("/").slice(0, -1).join("/").replace(/_/g, " ") || "UTC";
    const searchableText = [c.city, c.city_ascii, c.country, c.province, region, tz]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return {
      name: c.city,
      city: c.city,
      region,
      country: c.country || "",
      province: c.province || "",
      iso2: c.iso2 || "",
      abbreviation: getAbbr(tz),
      offset: getOffset(tz),
      timezone: tz,
      type: "city",
      searchableText,
    };
  });

  // ── Country aliases — lets users find countries by alternate / informal names
  const countryAliases = {
    "United States of America": ["usa", "us", "united states", "america", "u.s.a", "u.s"],
    "United Kingdom": ["uk", "britain", "great britain", "england", "scotland", "wales", "northern ireland", "u.k"],
    "Russia": ["russian federation", "ussr", "soviet"],
    "South Korea": ["korea", "republic of korea", "rok"],
    "North Korea": ["dprk", "democratic peoples republic of korea"],
    "China": ["prc", "peoples republic of china", "zhongguo"],
    "Taiwan": ["republic of china", "roc", "formosa"],
    "Vietnam": ["viet nam"],
    "Czech Republic": ["czechia", "czech"],
    "Myanmar": ["burma"],
    "Iran": ["persia", "islamic republic of iran"],
    "Syria": ["syrian arab republic"],
    "Bolivia": ["plurinational state of bolivia"],
    "Venezuela": ["bolivarian republic of venezuela"],
    "Tanzania": ["united republic of tanzania"],
    "Congo (Kinshasa)": ["drc", "democratic republic of congo", "zaire", "dr congo"],
    "Congo (Brazzaville)": ["republic of congo", "congo republic"],
    "Ivory Coast": ["cote divoire", "côte d'ivoire"],
    "Swaziland": ["eswatini"],
    "Macedonia": ["north macedonia", "northern macedonia"],
    "East Timor": ["timor leste", "timor-leste"],
    "Bosnia and Herzegovina": ["bosnia", "herzegovina", "bih"],
    "Trinidad and Tobago": ["trinidad", "tobago"],
    "Saint Kitts and Nevis": ["st kitts", "st. kitts"],
    "Saint Lucia": ["st lucia", "st. lucia"],
    "Saint Vincent and the Grenadines": ["st vincent", "st. vincent", "grenadines"],
    "Antigua and Barbuda": ["antigua", "barbuda"],
    "Papua New Guinea": ["png"],
    "New Zealand": ["nz", "aotearoa"],
    "Saudi Arabia": ["ksa", "kingdom of saudi arabia"],
    "United Arab Emirates": ["uae", "emirates"],
    "Hong Kong S.A.R.": ["hong kong", "hk"],
    "Macau S.A.R": ["macau", "macao"],
    "Palestine": ["palestinian territories", "west bank", "gaza"],
    "Vatican (Holy Sea)": ["vatican", "holy see", "holy sea"],
    "The Bahamas": ["bahamas"],
    "The Gambia": ["gambia"],
    "Federated States of Micronesia": ["micronesia", "fsm"],
    "Northern Mariana Islands": ["cnmi", "saipan"],
    "South Georgia and the Islands": ["south georgia"],
    "Svalbard and Jan Mayen Islands": ["svalbard"],
    "Kosovo": ["republic of kosovo"],
    "Somaliland": ["republic of somaliland"],
    "Northern Cyprus": ["trnc"],
    "Turks and Caicos Islands": ["turks and caicos", "tci"],
    "Cape Verde": ["cabo verde"],
    "Kyrgyzstan": ["kyrgyz republic", "kirghizia"],
    "Tajikistan": ["tajik"],
    "Turkmenistan": ["turkmen"],
    "Kazakhstan": ["kazakh"],
    "Uzbekistan": ["uzbek"],
    "Azerbaijan": ["azerbaijani"],
    "Armenia": ["republic of armenia"],
    "Georgia": ["republic of georgia"],
    "Moldova": ["republic of moldova"],
    "Belarus": ["byelorussia", "belorussia"],
    "Ukraine": ["ukr"],
    "Romania": ["roumania", "rumania"],
    "Bulgaria": ["republic of bulgaria"],
    "Serbia": ["republic of serbia"],
    "Montenegro": ["crna gora"],
    "Croatia": ["hrvatska"],
    "Slovenia": ["republika slovenija"],
    "Slovakia": ["slovak republic"],
    "Luxembourg": ["grand duchy of luxembourg"],
    "Netherlands": ["holland", "the netherlands"],
    "Belgium": ["belgique", "belgie"],
    "Switzerland": ["swiss confederation", "helvetia"],
    "Austria": ["republic of austria"],
    "Portugal": ["republic of portugal"],
    "Spain": ["españa", "espana", "kingdom of spain"],
    "France": ["french republic", "republique francaise"],
    "Germany": ["deutschland", "federal republic of germany"],
    "Italy": ["italia", "italian republic"],
    "Greece": ["hellenic republic", "hellas"],
    "Turkey": ["türkiye", "turkiye"],
    "Israel": ["state of israel"],
    "Jordan": ["hashemite kingdom of jordan"],
    "Lebanon": ["lebanese republic"],
    "Iraq": ["republic of iraq"],
    "Kuwait": ["state of kuwait"],
    "Qatar": ["state of qatar"],
    "Bahrain": ["kingdom of bahrain"],
    "Oman": ["sultanate of oman"],
    "Yemen": ["republic of yemen"],
    "Afghanistan": ["islamic emirate of afghanistan"],
    "Pakistan": ["islamic republic of pakistan"],
    "India": ["republic of india", "bharat"],
    "Nepal": ["federal democratic republic of nepal"],
    "Sri Lanka": ["ceylon"],
    "Bangladesh": ["peoples republic of bangladesh", "bangla"],
    "Thailand": ["kingdom of thailand", "siam"],
    "Cambodia": ["kingdom of cambodia", "khmer"],
    "Laos": ["lao", "lao pdr"],
    "Malaysia": ["federation of malaysia"],
    "Indonesia": ["republic of indonesia"],
    "Philippines": ["republic of the philippines", "pilipinas"],
    "Japan": ["nippon", "nihon"],
    "Mongolia": ["mongol uls"],
    "Kenya": ["republic of kenya"],
    "Ethiopia": ["federal democratic republic of ethiopia"],
    "Nigeria": ["federal republic of nigeria"],
    "Ghana": ["republic of ghana"],
    "Egypt": ["arab republic of egypt"],
    "Morocco": ["kingdom of morocco", "maroc"],
    "Algeria": ["peoples democratic republic of algeria", "algerie"],
    "Tunisia": ["republic of tunisia"],
    "Libya": ["state of libya"],
    "Sudan": ["republic of sudan"],
    "South Africa": ["rsa", "republic of south africa"],
    "Zimbabwe": ["republic of zimbabwe"],
    "Zambia": ["republic of zambia"],
    "Uganda": ["republic of uganda"],
    "Tanzania": ["united republic of tanzania"],
    "Rwanda": ["republic of rwanda"],
    "Mozambique": ["republic of mozambique"],
    "Madagascar": ["republic of madagascar"],
    "Cameroon": ["republic of cameroon"],
    "Senegal": ["republic of senegal"],
    "Mexico": ["mexican united states", "mejico"],
    "Colombia": ["republic of colombia"],
    "Peru": ["republic of peru"],
    "Chile": ["republic of chile"],
    "Argentina": ["argentine republic"],
    "Brazil": ["federative republic of brazil", "brasil"],
    "Ecuador": ["republic of ecuador"],
    "Bolivia": ["plurinational state of bolivia"],
    "Paraguay": ["republic of paraguay"],
    "Uruguay": ["oriental republic of uruguay"],
    "Guatemala": ["republic of guatemala"],
    "Honduras": ["republic of honduras"],
    "Nicaragua": ["republic of nicaragua"],
    "Costa Rica": ["republic of costa rica"],
    "Panama": ["republic of panama"],
    "Cuba": ["republic of cuba"],
    "Jamaica": ["commonwealth of jamaica"],
    "Haiti": ["republic of haiti"],
    "Dominican Republic": ["dr", "dominican rep"],
    "Puerto Rico": ["pr", "estado libre asociado"],
    "Canada": ["ca", "cdn"],
    "Australia": ["commonwealth of australia", "aus", "oz"],
    "Fiji": ["republic of fiji"],
    "Samoa": ["independent state of samoa"],
    "Tonga": ["kingdom of tonga"],
    "Vanuatu": ["republic of vanuatu"],
    "Brunei": ["brunei darussalam"],
    "Singapore": ["republic of singapore", "sg"],
  };

  // ── Country entries (one per country, using highest-pop city's timezone) ──
  const countryMap = new Map();
  sorted.forEach((c) => {
    if (c.country && !countryMap.has(c.country)) countryMap.set(c.country, c);
  });
  const countryEntries = [...countryMap.values()]
    .sort((a, b) => a.country.localeCompare(b.country))
    .map((c) => {
      const tz = c.timezone;
      const region =
        tz.split("/").slice(0, -1).join("/").replace(/_/g, " ") || "UTC";
      const aliases = countryAliases[c.country] || [];
      const searchableText = [c.country, c.iso2, c.iso3, ...aliases]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return {
        name: c.country,
        city: c.country,
        region,
        country: c.country,
        province: "",
        iso2: c.iso2 || "",
        abbreviation: getAbbr(tz),
        offset: getOffset(tz),
        timezone: tz,
        type: "country",
        searchableText,
      };
    });

  // Countries first (A-Z), then cities (population desc)
  _cachedTimezones = [...countryEntries, ...cityEntries];
  return _cachedTimezones;
}

// ── Legacy Intl-only path (kept only for the timezoneToCountry reference) ──
function _unusedIntlFallback() {
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

      const country =
        timezoneToCountry[tz] || region.split("/")[0] || "Unknown";
      const aliases = cityAliases[tz] || [];
      const searchableText = [city, country, region, ...aliases]
        .join(" ")
        .toLowerCase();
      return {
        name: city,
        city: city,
        region: region || "UTC",
        country,
        province: "",
        aliases,
        searchableText,
        abbreviation,
        offset: offsetMinutes,
        timezone: tz,
      };
    });
  } catch (error) {
    console.warn("Intl.supportedValuesOf not supported");
    return [
      { name: "New York", city: "New York", region: "America", country: "United States", province: "", abbreviation: "EST", offset: -300, timezone: "America/New_York", searchableText: "new york america united states" },
      { name: "Los Angeles", city: "Los Angeles", region: "America", country: "United States", province: "", abbreviation: "PST", offset: -480, timezone: "America/Los_Angeles", searchableText: "los angeles america united states" },
      { name: "London", city: "London", region: "Europe", country: "United Kingdom", province: "", abbreviation: "GMT", offset: 0, timezone: "Europe/London", searchableText: "london europe united kingdom" },
      { name: "Tokyo", city: "Tokyo", region: "Asia", country: "Japan", province: "", abbreviation: "JST", offset: 540, timezone: "Asia/Tokyo", searchableText: "tokyo asia japan" },
      { name: "Sydney", city: "Sydney", region: "Australia", country: "Australia", province: "", abbreviation: "AEST", offset: 600, timezone: "Australia/Sydney", searchableText: "sydney australia" },
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
