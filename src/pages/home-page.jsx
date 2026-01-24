import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
// types removed for plain JSX
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Plus, Clock, Loader2, AlertCircle } from "lucide-react";

export default function HomePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [use24Hour, setUse24Hour] = useState(true);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editingTimezone, setEditingTimezone] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [toDeleteTimezone, setToDeleteTimezone] = useState(null);

  // Fetch timezones
  const { data: timezones, isLoading, error } = useQuery({
    queryKey: ["/api/timezones"],
    refetchInterval: 60000, // Refresh every minute
  });

  // Add timezone mutation
  const addTimezoneMutation = useMutation({
    mutationFn: async (timezone) => {
      const res = await apiRequest("POST", "/api/timezones", timezone);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/timezones"] });
      toast({
        title: "Timezone added",
        description: "The timezone has been added successfully.",
      });
    },
    onError: (error) => {
      if (error.message?.includes("PREMIUM_REQUIRED")) {
        toast({
          title: "Premium required",
          description: "You've reached the limit of 3 timezones. Upgrade to premium for unlimited timezones.",
          variant: "destructive",
        });
        return;
      }
      
      toast({
        title: "Failed to add timezone",
        description: error.message || "An error occurred while adding the timezone.",
        variant: "destructive",
      });
    },
  });

  // Edit timezone mutation
  const editTimezoneMutation = useMutation({
    mutationFn: async ({ id, timezone }) => {
      const res = await apiRequest("PUT", `/api/timezones/${id}`, timezone);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/timezones"] });
      toast({
        title: "Timezone updated",
        description: "The timezone has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to update timezone",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete timezone mutation
  const deleteTimezoneMutation = useMutation({
    mutationFn: async (id) => {
      await apiRequest("DELETE", `/api/timezones/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/timezones"] });
      toast({
        title: "Timezone deleted",
        description: "The timezone has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete timezone",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleAddTimezone = (timezone) => {
    addTimezoneMutation.mutate(timezone);
  };

  const handleEditTimezone = (id, timezone) => {
    editTimezoneMutation.mutate({ id, timezone });
  };

  const handleDeleteTimezone = (timezone) => {
    setToDeleteTimezone(timezone);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (toDeleteTimezone) {
      deleteTimezoneMutation.mutate(toDeleteTimezone.id);
      setDeleteConfirmOpen(false);
      setToDeleteTimezone(null);
    }
  };

  const handleEditClick = (timezone) => {
    setEditingTimezone(timezone);
    setAddDialogOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col animate-gradient-x bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950 transition-colors duration-500">
      <Header />
      
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Dashboard Header */}
          <div className="border-b border-gray-200 dark:border-slate-800 pb-5 mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">My Timezones</h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-slate-400 font-medium">
                Manage and compare your team's timezones with style
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
              <Button
                onClick={() => {
                  setEditingTimezone(null);
                  setAddDialogOpen(true);
                }}
                disabled={addTimezoneMutation.isPending}
              >
                {addTimezoneMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="mr-2 h-4 w-4" />
                )}
                Add Timezone
              </Button>
              <div className="inline-flex items-center">
                <span className="mr-3 text-sm font-medium text-gray-700 dark:text-slate-300">24h</span>
                <Switch
                  checked={!use24Hour}
                  onCheckedChange={(checked) => setUse24Hour(!checked)}
                  id="timeFormatToggle"
                />
                <span className="ml-3 text-sm font-medium text-gray-700 dark:text-slate-300">12h</span>
              </div>
            </div>
          </div>
          
          {/* Error state */}
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                Failed to load timezones. Please try again later.
              </AlertDescription>
            </Alert>
          )}
          
          {/* Loading state */}
          {isLoading && (
            <div className="flex justify-center items-center h-60">
              <div className="flex flex-col items-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <p className="text-gray-500 dark:text-slate-400">Loading timezones...</p>
              </div>
            </div>
          )}
          
          {/* Empty state */}
          {timezones && timezones.length === 0 && !isLoading && (
            <div className="bg-white dark:bg-slate-900 p-8 rounded-lg shadow-sm border border-gray-200 dark:border-slate-800 text-center">
              <Clock className="h-12 w-12 mx-auto text-gray-400 dark:text-slate-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-2">No timezones added</h3>
              <p className="text-gray-500 dark:text-slate-400 mb-4">
                Add your first timezone to get started with TimeSync
              </p>
              <Button
                onClick={() => {
                  setEditingTimezone(null);
                  setAddDialogOpen(true);
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Timezone
              </Button>
            </div>
          )}
          
          {/* Timezone cards */}
          {timezones && timezones.length > 0 && (
            <div className="mb-8">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                {timezones.map((timezone) => (
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
          )}
          
          {/* Time comparison chart */}
          {timezones && timezones.length > 0 && (
            <TimeComparisonChart timezones={timezones} use24Hour={use24Hour} />
          )}
          
          {/* Premium upgrade */}
          {user && !user.isPremium && timezones && timezones.length >= 3 && (
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
              Are you sure you want to delete {toDeleteTimezone?.name}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              {deleteTimezoneMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
