import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useTranslation } from "react-i18next";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { TimezoneCard } from "@/components/ui/timezone-card";
import { TimeComparisonChart } from "@/components/ui/time-comparison-chart";
import { PremiumUpgrade } from "@/components/ui/premium-upgrade";
import { AddTimezoneDialog } from "@/components/ui/add-timezone-dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useSweetAlert } from "@/components/ui/sweet-alert";
import { timezoneService } from "@/lib/timezone-service";
import { Plus, Clock, Loader2, AlertCircle, Crown, Zap } from "lucide-react";

const TIMEZONES_KEY = "timezones_v1";

/**
 * Check if error is an authentication error (401/403) and handle auto-logout
 * @param {Error} error - The error object
 * @param {Function} signOut - The signOut function from auth context
 * @returns {boolean} - True if auth error was handled
 */
function handleAuthError(error, signOut) {
  const errorMsg = error?.message || "";
  const statusCode = error?.status;

  const isAuthError =
    statusCode === 401 ||
    statusCode === 403 ||
    errorMsg.toLowerCase().includes("401") ||
    errorMsg.toLowerCase().includes("403") ||
    errorMsg.toLowerCase().includes("unauthorized") ||
    errorMsg.toLowerCase().includes("invalid or expired access token") ||
    errorMsg.toLowerCase().includes("invalid token") ||
    errorMsg.toLowerCase().includes("token expired");

  if (isAuthError) {
    console.warn("Authentication error detected - logging out", error);
    signOut();
    return true;
  }
  return false;
}

/**
 * Derive IANA timezone string from city name by searching supported timezones
 * @param {string} region - Region name (e.g., "Asia")
 * @param {string} city - City name (e.g., "Dhaka")
 * @returns {string|null} IANA timezone string or null if not found
 */
function deriveIANATimezone(region, city) {
  try {
    const allTimezones = Intl.supportedValuesOf("timeZone");
    const normalizedCity = city?.replace(/\s+/g, "_");
    const normalizedRegion = region?.replace(/\s+/g, "_");

    // Try exact match with region/city
    if (normalizedRegion && normalizedCity) {
      const exactMatch = allTimezones.find(
        (tz) =>
          tz.toLowerCase() ===
          `${normalizedRegion}/${normalizedCity}`.toLowerCase(),
      );
      if (exactMatch) return exactMatch;
    }

    // Try to find by city name only
    if (normalizedCity) {
      const cityMatch = allTimezones.find((tz) =>
        tz.toLowerCase().endsWith(`/${normalizedCity.toLowerCase()}`),
      );
      if (cityMatch) return cityMatch;
    }

    return null;
  } catch {
    return null;
  }
}

export default function HomePage() {
  const { user, subscription, upgradeMutation, signOut } = useAuth();
  const { showAlert, AlertComponent } = useSweetAlert();
  const { t } = useTranslation();
  const [use24Hour, setUse24Hour] = useState(() => {
    const saved = localStorage.getItem("timeFormat");
    return saved === "12h" ? false : true;
  });
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editingTimezone, setEditingTimezone] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [toDeleteTimezone, setToDeleteTimezone] = useState(null);
  const [timezones, setTimezones] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const isPremium = user?.isPremium || subscription?.plan === "PREMIUM_ANNUAL";
  const isAtFreeLimit = !isPremium && timezones.length >= 3;

  // Save time format preference
  useEffect(() => {
    localStorage.setItem("timeFormat", use24Hour ? "24h" : "12h");
  }, [use24Hour]);

  // Load timezones from backend on mount
  useEffect(() => {
    const loadTimezones = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          // Try localStorage fallback if no token
          const saved = localStorage.getItem(TIMEZONES_KEY);
          if (saved) {
            setTimezones(JSON.parse(saved));
          }
          setIsLoading(false);
          return;
        }

        const response = await timezoneService.getAll(token);

        if (response.success && response.data) {
          // Transform grouped backend data to flat array with groupName
          const flatTimezones = response.data.flatMap((group) =>
            (group.item || []).map((item) => {
              // Derive IANA timezone string from region and city for frontend use
              const derivedTimezone = deriveIANATimezone(
                item.region,
                item.city,
              );
              return {
                id: item.id,
                name: item.name,
                city: item.city,
                region: item.region,
                abbreviation: item.abbreviation,
                offset: item.offset,
                timezone: derivedTimezone, // Derived IANA string for accurate calculations
                workingHoursStart: item.workingHoursStart ?? 9,
                workingHoursEnd: item.workingHoursEnd ?? 17,
                label: item.label,
                groupId: item.groupId,
                groupName:
                  group.name && group.name !== "Ungrouped"
                    ? group.name
                    : "General",
                createdAt: item.createdAt,
                updatedAt: item.updatedAt,
              };
            }),
          );

          setTimezones(flatTimezones);
          // Cache in localStorage as backup
          localStorage.setItem(TIMEZONES_KEY, JSON.stringify(flatTimezones));
        }
      } catch (e) {
        console.error("Failed to load timezones from backend", e);

        // Check if it's an auth error and handle auto-logout
        if (handleAuthError(e, signOut)) {
          setIsLoading(false);
          return;
        }

        // Fallback to localStorage
        try {
          const saved = localStorage.getItem(TIMEZONES_KEY);
          if (saved) {
            setTimezones(JSON.parse(saved));
          }
        } catch (err) {
          console.error("Failed to load from localStorage", err);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadTimezones();
  }, [signOut]);

  // Save timezones to localStorage whenever they change
  const saveTimezones = (newTimezones) => {
    try {
      localStorage.setItem(TIMEZONES_KEY, JSON.stringify(newTimezones));
      setTimezones(newTimezones);
      // Dispatch custom event to notify other components
      window.dispatchEvent(new Event("timezonesUpdated"));
    } catch (e) {
      console.error("Failed to save timezones to localStorage", e);
      showAlert({
        type: "error",
        title: "Failed to save",
        description: "Could not save timezones to localStorage.",
      });
    }
  };

  const handleAddTimezone = async (timezone) => {
    // Check if user has reached free plan limit
    if (isAtFreeLimit) {
      showAlert({
        type: "warning",
        title: "Premium required",
        description:
          "You've reached the limit of 3 timezones. Upgrade to premium for unlimited timezones.",
      });
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        // Fallback to local-only mode
        const newTimezone = {
          id: `tz-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          ...timezone,
          createdAt: new Date().toISOString(),
        };
        const updated = [...timezones, newTimezone];
        saveTimezones(updated);
        showAlert({
          type: "success",
          title: "Timezone added",
          description: "The timezone has been added successfully.",
        });
        setAddDialogOpen(false);
        return;
      }

      // Optimistic update - add to UI immediately
      const tempId = `temp-${Date.now()}`;
      const optimisticTimezone = {
        id: tempId,
        ...timezone,
        groupName: timezone.groupName || "General",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const optimisticTimezones = [...timezones, optimisticTimezone];
      setTimezones(optimisticTimezones);
      localStorage.setItem(TIMEZONES_KEY, JSON.stringify(optimisticTimezones));

      // Close dialog and show success immediately (optimistic)
      setAddDialogOpen(false);
      showAlert({
        type: "success",
        title: "Timezone added",
        description: "The timezone has been added successfully.",
      });

      // Strip the 'timezone' field before sending to API (backend doesn't support it)
      const { timezone: tzString, ...apiTimezoneData } = timezone;
      const response = await timezoneService.create(apiTimezoneData, token);

      if (response.success && response.data) {
        // Replace temp with real data from server
        const serverTimezone = {
          id: response.data.id,
          name: response.data.name,
          city: response.data.city,
          region: response.data.region,
          abbreviation: response.data.abbreviation,
          offset: response.data.offset,
          timezone: timezone.timezone, // Keep the frontend-derived IANA string
          workingHoursStart: response.data.workingHoursStart ?? 9,
          workingHoursEnd: response.data.workingHoursEnd ?? 17,
          label: response.data.label,
          groupId: response.data.groupId,
          groupName: response.data.groupName || timezone.groupName || "General",
          createdAt: response.data.createdAt,
          updatedAt: response.data.updatedAt,
        };

        const finalTimezones = optimisticTimezones.map((tz) =>
          tz.id === tempId ? serverTimezone : tz,
        );
        setTimezones(finalTimezones);
        localStorage.setItem(TIMEZONES_KEY, JSON.stringify(finalTimezones));
      }
    } catch (error) {
      console.error("Failed to add timezone", error);

      // Check if it's an auth error and handle auto-logout
      if (handleAuthError(error, signOut)) {
        return;
      }

      // Rollback optimistic update on error
      const rollbackTimezones = timezones.filter(
        (tz) => !tz.id.startsWith("temp-"),
      );
      setTimezones(rollbackTimezones);
      localStorage.setItem(TIMEZONES_KEY, JSON.stringify(rollbackTimezones));

      showAlert({
        type: "error",
        title: "Failed to add timezone",
        description: error.message || "Could not add timezone.",
      });
    }
  };

  const handleEditTimezone = async (id, timezone) => {
    const previousTimezones = [...timezones]; // For rollback

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        // Fallback to local-only mode
        const updated = timezones.map((tz) =>
          tz.id === id ? { ...tz, ...timezone } : tz,
        );
        saveTimezones(updated);
        showAlert({
          type: "success",
          title: "Timezone updated",
          description: "The timezone has been updated successfully.",
        });
        setAddDialogOpen(false);
        return;
      }

      // Optimistic update - update UI immediately
      const optimisticTimezones = timezones.map((tz) =>
        tz.id === id
          ? { ...tz, ...timezone, updatedAt: new Date().toISOString() }
          : tz,
      );
      setTimezones(optimisticTimezones);
      localStorage.setItem(TIMEZONES_KEY, JSON.stringify(optimisticTimezones));

      // Close dialog and show success immediately (optimistic)
      setAddDialogOpen(false);
      showAlert({
        type: "success",
        title: "Timezone updated",
        description: "The timezone has been updated successfully.",
      });

      // Strip the 'timezone' field before sending to API (backend doesn't support it)
      const { timezone: tzString, ...apiTimezoneData } = timezone;
      const response = await timezoneService.update(id, apiTimezoneData, token);

      if (response.success) {
        // Keep optimistic update, just update timestamp from server if available
        if (response.data?.updatedAt) {
          const finalTimezones = optimisticTimezones.map((tz) =>
            tz.id === id ? { ...tz, updatedAt: response.data.updatedAt } : tz,
          );
          setTimezones(finalTimezones);
          localStorage.setItem(TIMEZONES_KEY, JSON.stringify(finalTimezones));
        }
      }
    } catch (error) {
      console.error("Failed to update timezone", error);

      // Check if it's an auth error and handle auto-logout
      if (handleAuthError(error, signOut)) {
        return;
      }

      // Rollback to previous state
      setTimezones(previousTimezones);
      localStorage.setItem(TIMEZONES_KEY, JSON.stringify(previousTimezones));

      showAlert({
        type: "error",
        title: "Failed to update timezone",
        description: error.message || "Could not update timezone.",
      });
    }
  };

  const handleDeleteTimezone = (timezone) => {
    setToDeleteTimezone(timezone);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (toDeleteTimezone) {
      const previousTimezones = [...timezones]; // For rollback

      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          // Fallback to local-only mode
          const updated = timezones.filter(
            (tz) => tz.id !== toDeleteTimezone.id,
          );
          saveTimezones(updated);
          showAlert({
            type: "success",
            title: "Timezone deleted",
            description: "The timezone has been deleted successfully.",
          });
          setDeleteConfirmOpen(false);
          setToDeleteTimezone(null);
          return;
        }

        // Optimistic update - remove from UI immediately
        const optimisticTimezones = timezones.filter(
          (tz) => tz.id !== toDeleteTimezone.id,
        );
        setTimezones(optimisticTimezones);
        localStorage.setItem(
          TIMEZONES_KEY,
          JSON.stringify(optimisticTimezones),
        );
        setDeleteConfirmOpen(false);
        setToDeleteTimezone(null);
        showAlert({
          type: "success",
          title: "Timezone deleted",
          description: "The timezone has been deleted successfully.",
        });

        await timezoneService.delete(toDeleteTimezone.id, token);
      } catch (error) {
        console.error("Failed to delete timezone", error);

        // Check if it's an auth error and handle auto-logout
        if (handleAuthError(error, signOut)) {
          return;
        }

        // Rollback to previous state
        setTimezones(previousTimezones);
        localStorage.setItem(TIMEZONES_KEY, JSON.stringify(previousTimezones));

        showAlert({
          type: "error",
          title: "Failed to delete timezone",
          description: error.message || "Could not delete timezone.",
        });
      }
    }
  };

  const handleEditClick = (timezone) => {
    setEditingTimezone(timezone);
    setAddDialogOpen(true);
  };

  // Group timezones by groupName
  const groupTimezonesByGroupName = () => {
    const grouped = {};

    timezones.forEach((timezone) => {
      const group = timezone.groupName || "General";
      if (!grouped[group]) {
        grouped[group] = [];
      }
      grouped[group].push(timezone);
    });

    return grouped;
  };

  const groupedTimezones = groupTimezonesByGroupName();

  // const handleUpgrade = () => {
  //   const apiBase = import.meta.env.VITE_API_BASE_URL || "";
  //   upgradeMutation.mutate({
  //     returnUrl: `${apiBase}/docs`,
  //     cancelUrl: `${apiBase}/docs`,
  //   });
  // };

  const handleAddOrUpgrade = () => {
    if (isAtFreeLimit) {
      // Directly trigger upgrade instead of just scrolling
      const returnUrl = `${window.location.origin}/subscription/success`;
      const cancelUrl = `${window.location.origin}/subscription/cancel`;
      upgradeMutation.mutate({ returnUrl, cancelUrl });
    } else {
      setEditingTimezone(null);
      setAddDialogOpen(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col animate-gradient-x bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950 transition-colors duration-500">
      <Header />

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          {/* Dashboard Header */}
          <div className="border-b border-gray-200 dark:border-slate-800 pb-5 mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                {t("home.title")}
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-slate-400 font-medium">
                {t("home.subtitle")}
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center">
              {/* Timezone Controls Container - pixel-perfect match */}
              <div className="flex items-center bg-slate-100 dark:bg-[#192338] rounded-[14px] p-[3px] dark:shadow-xl border border-slate-200 dark:border-transparent">
                {/* Upgrade to Premium / Add Timezone Button */}
                <button
                  onClick={handleAddOrUpgrade}
                  disabled={
                    isLoading || (isAtFreeLimit && upgradeMutation.isPending)
                  }
                  className="flex items-center gap-2 px-4 py-2 rounded-[10px] font-medium text-sm transition-all duration-300 bg-gradient-to-r from-[#2970f5] to-[#1d5bd6] text-white hover:from-[#3a7ef7] hover:to-[#2568e0] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : isAtFreeLimit ? (
                    upgradeMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <svg
                          className="h-4 w-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" />
                        </svg>
                        <span>Upgrade to Premium</span>
                      </>
                    )
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      <span>{t("home.addTimezone")}</span>
                    </>
                  )}
                </button>

                {/* Vertical Divider */}
                <div className="w-[1px] h-5 bg-slate-300 dark:bg-[#3d4f6f] mx-4" />

                {/* 24h/12h Toggle with Switch */}
                <div className="flex items-center gap-2 mr-2">
                  <span
                    className={`text-sm font-medium transition-colors duration-200 ${use24Hour ? "text-slate-900 dark:text-white" : "text-slate-400 dark:text-[#7b8ba5]"}`}
                  >
                    24h
                  </span>

                  {/* Toggle Switch */}
                  <button
                    onClick={() => setUse24Hour(!use24Hour)}
                    className="relative w-11 h-[22px] rounded-full bg-slate-300 dark:bg-[#2d3f5e] transition-colors duration-300 focus:outline-none"
                  >
                    <span
                      className={`absolute top-[3px] w-4 h-4 rounded-full bg-[#3b7df5] shadow transition-all duration-300 ${
                        use24Hour ? "left-[3px]" : "left-[25px]"
                      }`}
                    />
                  </button>

                  <span
                    className={`text-sm font-medium transition-colors duration-200 ${!use24Hour ? "text-slate-900 dark:text-white" : "text-slate-400 dark:text-[#7b8ba5]"}`}
                  >
                    12h
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Loading state */}
          {isLoading && (
            <div className="flex justify-center items-center h-60">
              <div className="flex flex-col items-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <p className="text-gray-500 dark:text-slate-400">
                  Loading timezones...
                </p>
              </div>
            </div>
          )}

          {/* Time comparison chart */}
          {timezones && timezones.length > 0 && (
            <TimeComparisonChart timezones={timezones} use24Hour={use24Hour} />
          )}

          {/* Empty state */}
          {timezones && timezones.length === 0 && !isLoading && (
            <div className="bg-white dark:bg-slate-900 mb-10 p-8 rounded-lg shadow-sm border border-gray-200 dark:border-slate-800 text-center">
              <Clock className="h-12 w-12 mx-auto text-gray-400 dark:text-slate-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-2">
                No timezones added
              </h3>
              <p className="text-gray-500 dark:text-slate-400 mb-4">
                Add your first timezone to get started with TimeSync
              </p>
              <Button
                onClick={() => {
                  setEditingTimezone(null);
                  setAddDialogOpen(true);
                }}
              >
                <Plus className="mr-2 h-4 w-4  " />
                {t("home.addTimezone")}
              </Button>
            </div>
          )}

          {/* Grouped Timezone cards */}
          {timezones && timezones.length > 0 && (
            <div className="mb-5 lg:mb-6 lg:space-y-8 space-y-4">
              {Object.entries(groupedTimezones).map(([groupName, zones]) => (
                <div key={groupName} className="space-y-4">
                  {/* Group Header */}
                  <div className=" border-gray-300 dark:border-slate-700">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-slate-200">
                      {groupName}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
                      {zones.length}{" "}
                      {zones.length === 1 ? "timezone" : "timezones"}
                    </p>
                  </div>

                  {/* Responsive Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                    {zones.map((timezone) => (
                      <TimezoneCard
                        key={timezone.id}
                        timezone={timezone}
                        use24Hour={use24Hour}
                        onEdit={handleEditClick}
                        onDelete={handleDeleteTimezone}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Premium upgrade: show to all non-premium users regardless of timezone count */}
          {user && !isPremium && (
            <div id="upgrade">
              <PremiumUpgrade timezoneCount={timezones.length} />
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Add/Edit Timezone Dialog */}
      <AddTimezoneDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onAddTimezone={handleAddTimezone}
        onEditTimezone={handleEditTimezone}
        editingTimezone={editingTimezone}
        use24Hour={use24Hour}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Timezone</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {toDeleteTimezone?.name}? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-slate-100 dark:bg-slate-800 text-gray-900 dark:text-slate-100 border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white border-0"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Sweet Alert Component */}
      {AlertComponent}
    </div>
  );
}
