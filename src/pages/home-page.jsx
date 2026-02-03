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

export default function HomePage() {
  const { user, subscription, upgradeMutation } = useAuth();
  const { showAlert, AlertComponent } = useSweetAlert();
  const { t } = useTranslation();
  const [use24Hour, setUse24Hour] = useState(true);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editingTimezone, setEditingTimezone] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [toDeleteTimezone, setToDeleteTimezone] = useState(null);
  const [timezones, setTimezones] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const isPremium = user?.isPremium || subscription?.plan === "premium";
  const isAtFreeLimit = !isPremium && timezones.length >= 3;

  // Load timezones from backend on mount
  useEffect(() => {
    const loadTimezones = async () => {
      try {
        const token = localStorage.getItem('accessToken');
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
          const flatTimezones = response.data.flatMap(group => 
            (group.item || []).map(item => ({
              id: item.id,
              name: item.name,
              city: item.city,
              region: item.region,
              abbreviation: item.abbreviation,
              offset: item.offset,
              workingHoursStart: item.workingHoursStart ?? 9,
              workingHoursEnd: item.workingHoursEnd ?? 17,
              label: item.label,
              groupId: item.groupId,
              groupName: group.name || 'General',
              createdAt: item.createdAt,
              updatedAt: item.updatedAt,
            }))
          );
          
          setTimezones(flatTimezones);
          // Cache in localStorage as backup
          localStorage.setItem(TIMEZONES_KEY, JSON.stringify(flatTimezones));
        }
      } catch (e) {
        console.error("Failed to load timezones from backend", e);
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
  }, []);

  // Save timezones to localStorage whenever they change
  const saveTimezones = (newTimezones) => {
    try {
      localStorage.setItem(TIMEZONES_KEY, JSON.stringify(newTimezones));
      setTimezones(newTimezones);
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
        description: "You've reached the limit of 3 timezones. Upgrade to premium for unlimited timezones.",
      });
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
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

      const response = await timezoneService.create(timezone, token);
      
      if (response.success && response.data) {
        // Re-fetch to get updated grouped data
        const allTimezones = await timezoneService.getAll(token);
        if (allTimezones.success && allTimezones.data) {
          const flatTimezones = allTimezones.data.flatMap(group => 
            (group.item || []).map(item => ({
              id: item.id,
              name: item.name,
              city: item.city,
              region: item.region,
              abbreviation: item.abbreviation,
              offset: item.offset,
              workingHoursStart: item.workingHoursStart ?? 9,
              workingHoursEnd: item.workingHoursEnd ?? 17,
              label: item.label,
              groupId: item.groupId,
              groupName: group.name || 'General',
              createdAt: item.createdAt,
              updatedAt: item.updatedAt,
            }))
          );
          setTimezones(flatTimezones);
          localStorage.setItem(TIMEZONES_KEY, JSON.stringify(flatTimezones));
        }
        
        showAlert({
          type: "success",
          title: "Timezone added",
          description: "The timezone has been added successfully.",
        });
        setAddDialogOpen(false);
      }
    } catch (error) {
      console.error('Failed to add timezone', error);
      showAlert({
        type: "error",
        title: "Failed to add timezone",
        description: error.message || "Could not add timezone.",
      });
    }
  };

  const handleEditTimezone = async (id, timezone) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        // Fallback to local-only mode
        const updated = timezones.map((tz) =>
          tz.id === id ? { ...tz, ...timezone } : tz
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

      const response = await timezoneService.update(id, timezone, token);
      
      if (response.success) {
        // Re-fetch to get updated grouped data
        const allTimezones = await timezoneService.getAll(token);
        if (allTimezones.success && allTimezones.data) {
          const flatTimezones = allTimezones.data.flatMap(group => 
            (group.item || []).map(item => ({
              id: item.id,
              name: item.name,
              city: item.city,
              region: item.region,
              abbreviation: item.abbreviation,
              offset: item.offset,
              workingHoursStart: item.workingHoursStart ?? 9,
              workingHoursEnd: item.workingHoursEnd ?? 17,
              label: item.label,
              groupId: item.groupId,
              groupName: group.name || 'General',
              createdAt: item.createdAt,
              updatedAt: item.updatedAt,
            }))
          );
          setTimezones(flatTimezones);
          localStorage.setItem(TIMEZONES_KEY, JSON.stringify(flatTimezones));
        }
        
        showAlert({
          type: "success",
          title: "Timezone updated",
          description: "The timezone has been updated successfully.",
        });
        setAddDialogOpen(false);
      }
    } catch (error) {
      console.error('Failed to update timezone', error);
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
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          // Fallback to local-only mode
          const updated = timezones.filter((tz) => tz.id !== toDeleteTimezone.id);
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

        const response = await timezoneService.delete(toDeleteTimezone.id, token);
        
        if (response.success) {
          // Re-fetch to get updated grouped data
          const allTimezones = await timezoneService.getAll(token);
          if (allTimezones.success && allTimezones.data) {
            const flatTimezones = allTimezones.data.flatMap(group => 
              (group.item || []).map(item => ({
                id: item.id,
                name: item.name,
                city: item.city,
                region: item.region,
                abbreviation: item.abbreviation,
                offset: item.offset,
                workingHoursStart: item.workingHoursStart ?? 9,
                workingHoursEnd: item.workingHoursEnd ?? 17,
                label: item.label,
                groupId: item.groupId,
                groupName: group.name || 'General',
                createdAt: item.createdAt,
                updatedAt: item.updatedAt,
              }))
            );
            setTimezones(flatTimezones);
            localStorage.setItem(TIMEZONES_KEY, JSON.stringify(flatTimezones));
          }
          
          showAlert({
            type: "success",
            title: "Timezone deleted",
            description: "The timezone has been deleted successfully.",
          });
          setDeleteConfirmOpen(false);
          setToDeleteTimezone(null);
        }
      } catch (error) {
        console.error('Failed to delete timezone', error);
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
    
    timezones.forEach(timezone => {
      const group = timezone.groupName || 'General';
      if (!grouped[group]) {
        grouped[group] = [];
      }
      grouped[group].push(timezone);
    });

    return grouped;
  };

  const groupedTimezones = groupTimezonesByGroupName();

  const handleUpgrade = () => {
    const apiBase = import.meta.env.VITE_API_BASE_URL || "";
    upgradeMutation.mutate({
      returnUrl: `${apiBase}/docs`,
      cancelUrl: `${apiBase}/docs`,
    });
  };

  const handleAddOrUpgrade = () => {
    if (isAtFreeLimit) {
      // Scroll to premium upgrade section
      const upgradeSection = document.getElementById("upgrade");
      if (upgradeSection) {
        upgradeSection.scrollIntoView({ behavior: "smooth", block: "center" });
      }
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
            <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
              <Button
                onClick={handleAddOrUpgrade}
                disabled={isLoading}
                className={isAtFreeLimit 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                  : ""
                }
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : isAtFreeLimit ? (
                  <>
                    <Crown className="mr-2 h-4 w-4" />
                    Upgrade to Premium
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4 " />
                    {t("home.addTimezone")}
                  </>
                )}
              </Button>
              <div className="inline-flex items-center">
                <span className="mr-3 text-sm font-medium text-gray-700 dark:text-slate-300">
                  24h
                </span>
                <Switch
                  checked={!use24Hour}
                  onCheckedChange={(checked) => setUse24Hour(!checked)}
                  id="timeFormatToggle"
                />
                <span className="ml-3 text-sm font-medium text-gray-700 dark:text-slate-300">
                  12h
                </span>
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

          {/* Empty state */}
          {timezones && timezones.length === 0 && !isLoading && (
            <div className="bg-white dark:bg-slate-900 p-8 rounded-lg shadow-sm border border-gray-200 dark:border-slate-800 text-center">
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
            <div className="mb-5 lg:mb-6 space-y-8">
              {Object.entries(groupedTimezones).map(([groupName, zones]) => (
                <div key={groupName} className="space-y-4">
                  {/* Group Header */}
                  <div className="border-b-2 border-gray-300 dark:border-slate-700 pb-3">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-slate-200">
                      {groupName}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
                      {zones.length} {zones.length === 1 ? 'timezone' : 'timezones'}
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

          {/* Time comparison chart */}
          {timezones && timezones.length > 0 && (
            <TimeComparisonChart timezones={timezones} use24Hour={use24Hour} />
          )}

          {/* Premium upgrade */}
          {user && timezones && timezones.length >= 3 && (
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
