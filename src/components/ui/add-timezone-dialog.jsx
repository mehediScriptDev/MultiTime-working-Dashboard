import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  getCommonTimezones,
  getTimeInTimezone,
  formatTimezoneOffset,
} from "@/lib/utils";
import { Search, Globe, Clock, Users, Tag } from "lucide-react";

export function AddTimezoneDialog({
  open,
  onOpenChange,
  onAddTimezone,
  onEditTimezone,
  editingTimezone,
  use24Hour,
}) {
  const { t } = useTranslation();
  const commonTimezones = getCommonTimezones();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTimezone, setSelectedTimezone] = useState(null);
  const [label, setLabel] = useState("");
  const [groupName, setGroupName] = useState("");
  const [workingHoursStart, setWorkingHoursStart] = useState(9);
  const [workingHoursEnd, setWorkingHoursEnd] = useState(17);

  useEffect(() => {
    // Debug: track open state for flaky dialog close issues
    // eslint-disable-next-line no-console
    console.log("AddTimezoneDialog: open prop =", open);
  }, [open]);

  useEffect(() => {
    if (editingTimezone) {
      // Find the corresponding common timezone or create a custom one
      const matchingTimezone = commonTimezones.find(
        (tz) =>
          tz.name === editingTimezone.name &&
          tz.offset === editingTimezone.offset,
      );

      setSelectedTimezone(
        matchingTimezone || {
          name: editingTimezone.name,
          city: editingTimezone.city,
          region: editingTimezone.region || "",
          abbreviation: editingTimezone.abbreviation,
          offset: editingTimezone.offset,
        },
      );

      setLabel(editingTimezone.label || "");
      setGroupName(editingTimezone.groupName || "");
      setWorkingHoursStart(editingTimezone.workingHoursStart);
      setWorkingHoursEnd(editingTimezone.workingHoursEnd);
    } else {
      // Reset form for adding new timezone
      setSelectedTimezone(null);
      setLabel("");
      setGroupName("");
      setWorkingHoursStart(9);
      setWorkingHoursEnd(17);
    }
  }, [editingTimezone, open]);

  const handleSubmit = () => {
    if (!selectedTimezone) return;

    const timezoneData = {
      name: selectedTimezone.name,
      city: selectedTimezone.city,
      region: selectedTimezone.region,
      abbreviation: selectedTimezone.abbreviation,
      offset: selectedTimezone.offset,
      workingHoursStart,
      workingHoursEnd,
      label: label || null,
      groupName: groupName || null,
    };

    if (editingTimezone) {
      onEditTimezone(editingTimezone.id, timezoneData);
    } else {
      onAddTimezone(timezoneData);
    }

    onOpenChange(false);
  };

  const filteredTimezones = commonTimezones.filter(
    (tz) =>
      tz.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tz.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tz.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
      formatTimezoneOffset(tz.offset)
        .toLowerCase()
        .includes(searchQuery.toLowerCase()),
  );

  // Generate time options for select
  const timeOptions = Array.from({ length: 24 }, (_, i) => i);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[580px] w-[95%] sm:w-11/12 max-h-[85vh] sm:max-h-[90vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl rounded-2xl overflow-hidden p-0 flex flex-col">
        {/* Header - Light mode friendly */}
        <div className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border-b border-slate-200 dark:border-slate-700 px-4 sm:px-6 py-4 sm:py-5 flex-shrink-0">
          <DialogTitle className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800 dark:text-white tracking-tight flex items-center gap-2 sm:gap-3">
            <img
              src="/Logo.png"
              className="h-9 w-9"
              alt="TimeSync"
            />
            {editingTimezone
              ? t("dialog.editTimezone")
              : t("dialog.addTimezone")}
          </DialogTitle>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1.5 sm:mt-2 font-medium">
            {editingTimezone
              ? t("dialog.editDescription")
              : t("dialog.addDescription")}
          </p>
        </div>

        {/* Scrollable Content - Hidden Scrollbar */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <div className="px-4 sm:px-6 md:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6">
            {/* Search */}
            <div className="space-y-2">
              <Label
                htmlFor="timezone-search"
                className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2"
              >
                <Search className="h-4 w-4" />
                {t("dialog.searchPlaceholder")}
              </Label>
              <div className="relative group">
                <Input
                  id="timezone-search"
                  placeholder="e.g. London, Paris, United States..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-11 h-11 sm:h-12 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:border-blue-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm sm:text-base"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors pointer-events-none" />
              </div>
            </div>

            {/* Timezone List */}
            <div className="rounded-xl border-2 border-slate-200 dark:border-slate-700 overflow-hidden bg-slate-50/50 dark:bg-slate-800/50">
              <ScrollArea className="h-[180px] sm:h-[200px]">
                <div className="p-2 space-y-1">
                  {filteredTimezones.map((timezone, index) => {
                    const { time } = getTimeInTimezone(
                      timezone.offset,
                      use24Hour,
                    );
                    const isSelected =
                      selectedTimezone?.name === timezone.name &&
                      selectedTimezone?.offset === timezone.offset;

                    return (
                      <div
                        key={index}
                        className={`py-3 px-4 hover:bg-white dark:hover:bg-slate-700 cursor-pointer rounded-lg flex items-center justify-between transition-all group ${
                          isSelected
                            ? "bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500"
                            : "border-2 border-transparent"
                        }`}
                        onClick={() => setSelectedTimezone(timezone)}
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div
                            className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${isSelected ? "bg-blue-500" : "bg-slate-300 dark:bg-slate-600"}`}
                          />
                          <div className="min-w-0 flex-1">
                            <div
                              className={`text-sm font-semibold truncate ${isSelected ? "text-blue-600 dark:text-blue-400" : "text-slate-900 dark:text-slate-100"}`}
                            >
                              {timezone.city}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                              {timezone.region} •{" "}
                              {formatTimezoneOffset(timezone.offset)}
                            </div>
                          </div>
                        </div>
                        <div
                          className={`text-sm font-bold flex-shrink-0 ml-3 ${isSelected ? "text-blue-600 dark:text-blue-400" : "text-slate-600 dark:text-slate-400"}`}
                        >
                          {time}
                        </div>
                      </div>
                    );
                  })}
                  {filteredTimezones.length === 0 && (
                    <div className="p-12 text-center">
                      <Globe className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600 mb-3" />
                      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        No timezones found matching your search
                      </p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>

            {/* Configuration Section */}
            {selectedTimezone && (
              <div className="space-y-4 sm:space-y-5 animate-in fade-in slide-in-from-top-2 duration-300">
                {/* Selected Timezone Info */}
                <div className="bg-blue-100 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-3 sm:p-4">
                  <div className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
                    <Globe className="sm:h-5 sm:w-5 h-4 w-4" />
                    <span className="font-semibold text-sm">Selected:</span>
                    <span className="font-semibold text-sm">
                      {selectedTimezone.city}, {selectedTimezone.region}
                    </span>
                  </div>
                </div>

                {/* Label and Group */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="timezone-label"
                      className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2"
                    >
                      <Tag className="h-4 w-4" />
                      Label (Optional)
                    </Label>
                    <Input
                      id="timezone-label"
                      placeholder="e.g. Office, Home"
                      value={label}
                      onChange={(e) => setLabel(e.target.value)}
                      className="h-11 sm:h-12 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:border-blue-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="timezone-group"
                      className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2"
                    >
                      <Users className="h-4 w-4" />
                      Group (Optional)
                    </Label>
                    <Input
                      id="timezone-group"
                      placeholder="e.g. Dev Team, Sales"
                      value={groupName}
                      onChange={(e) => setGroupName(e.target.value)}
                      className="h-11 sm:h-12 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:border-blue-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                  </div>
                </div>

                {/* Working Hours */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Working Hours
                  </Label>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Select
                      value={workingHoursStart.toString()}
                      onValueChange={(val) =>
                        setWorkingHoursStart(parseInt(val))
                      }
                    >
                      <SelectTrigger className="h-11 sm:h-12 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/20">
                        <SelectValue placeholder="Start" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-2 border-slate-200 dark:border-slate-700 shadow-xl">
                        {timeOptions.slice(0, -1).map((hour) => (
                          <SelectItem
                            key={hour}
                            value={hour.toString()}
                            className="rounded-lg"
                          >
                            {use24Hour
                              ? `${hour.toString().padStart(2, "0")}:00`
                              : `${hour % 12 === 0 ? 12 : hour % 12}:00 ${hour >= 12 ? "PM" : "AM"}`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <span className="text-slate-400 font-bold text-lg">→</span>
                    <Select
                      value={workingHoursEnd.toString()}
                      onValueChange={(val) => setWorkingHoursEnd(parseInt(val))}
                    >
                      <SelectTrigger className="h-11 sm:h-12 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/20">
                        <SelectValue placeholder="End" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-2 border-slate-200 dark:border-slate-700 shadow-xl">
                        {timeOptions.slice(1).map((hour) => (
                          <SelectItem
                            key={hour}
                            value={hour.toString()}
                            className="rounded-lg"
                          >
                            {use24Hour
                              ? `${hour.toString().padStart(2, "0")}:00`
                              : `${hour % 12 === 0 ? 12 : hour % 12}:00 ${hour >= 12 ? "PM" : "AM"}`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer - Always Visible */}
        <DialogFooter className="flex-shrink-0 px-4 sm:px-6 py-3 sm:py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 flex-row gap-2 sm:gap-3">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="flex-1 sm:flex-none rounded-xl h-10 sm:h-11 px-4 sm:px-6 font-semibold text-sm sm:text-base text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!selectedTimezone}
            className="flex-1 sm:flex-none rounded-xl h-10 sm:h-11 px-4 sm:px-6 font-semibold text-sm sm:text-base bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {editingTimezone ? "Save" : "Add Timezone"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
