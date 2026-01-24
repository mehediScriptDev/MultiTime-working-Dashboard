// Dummy data for development mode
export const DUMMY_TIMEZONES = [
  {
    id: "tz-1",
    name: "New York",
    timezone: "America/New_York",
    region: "United States",
    abbreviation: "EST",
    offset: -300, // EST offset in minutes
    workingHoursStart: 9,
    workingHoursEnd: 17,
    userId: "dev-user-1",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "tz-2",
    name: "London",
    timezone: "Europe/London",
    region: "United Kingdom",
    abbreviation: "GMT",
    offset: 0, // GMT offset in minutes
    workingHoursStart: 9,
    workingHoursEnd: 17,
    userId: "dev-user-1",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "tz-3",
    name: "Tokyo",
    timezone: "Asia/Tokyo",
    region: "Japan",
    abbreviation: "JST",
    offset: 540, // JST offset in minutes
    workingHoursStart: 9,
    workingHoursEnd: 17,
    userId: "dev-user-1",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "tz-4",
    name: "Sydney",
    timezone: "Australia/Sydney",
    region: "Australia",
    abbreviation: "AEDT",
    offset: 660, // AEDT offset in minutes
    workingHoursStart: 9,
    workingHoursEnd: 17,
    userId: "dev-user-1",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const DUMMY_USER = {
  id: "dev-user-1",
  email: "admin@example.com",
  username: "admin",
  isPremium: true,
  createdAt: new Date().toISOString(),
};
