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
import { Search } from "lucide-react";
import { Globe } from "lucide-react";

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
      <DialogContent className="sm:max-w-[550px] w-11/12 h-auto bg-white dark:bg-slate-900 border-none shadow-2xl rounded-xl overflow-hidden p-0">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 ">
          <DialogTitle className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
            <div className="p-2 rounded-xl backdrop-blur-md">
              {/* <Globe className="h-6 w-6 text-white" /> */}
              <img src="/logo.png" className="h-6 w-6" alt="Timezone Icon" />
            </div>
            {editingTimezone
              ? t("dialog.editTimezone")
              : t("dialog.addTimezone")}
          </DialogTitle>
          <p className="text-blue-100 text-sm mt-2 font-medium">
            {editingTimezone
              ? t("dialog.editDescription")
              : t("dialog.addDescription")}
          </p>
        </div>

        <div className="px-3 space-y-4 ">
          <div className="space-y-1.5">
            <Label
              htmlFor="timezone-search"
              className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400"
            >
              {t("dialog.searchPlaceholder")}
            </Label>
            <div className="relative group">
              <Input
                id="timezone-search"
                placeholder="e.g. London, Paris, United States..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12  h-10 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus-visible:ring-blue-500/30 transition-all text-base"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 lg:h-5 lg:w-5 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden bg-slate-50/30 dark:bg-slate-800/20">
            <ScrollArea className="sm:h-[240px] h-[200px]">
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
                      className={`py-3 px-4 hover:bg-white dark:hover:bg-slate-700 cursor-pointer rounded-xl flex items-center justify-between transition-all group ${
                        isSelected
                          ? "bg-white dark:bg-slate-700 shadow-md ring-1 ring-blue-500/20"
                          : ""
                      }`}
                      onClick={() => setSelectedTimezone(timezone)}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-2 h-2 rounded-full ${isSelected ? "bg-blue-500 animate-pulse" : "bg-slate-300 dark:bg-slate-600"}`}
                        />
                        <div>
                          <div
                            className={`text-sm font-bold ${isSelected ? "text-blue-600 dark:text-blue-400" : "text-slate-700 dark:text-slate-200"}`}
                          >
                            {timezone.name}
                          </div>
                          <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mt-0.5">
                            {timezone.region} •{" "}
                            {formatTimezoneOffset(timezone.offset)}
                          </div>
                        </div>
                      </div>
                      <div
                        className={`text-sm font-black ${isSelected ? "text-blue-600 dark:text-blue-400" : "text-slate-500 dark:text-slate-400"}`}
                      >
                        {time}
                      </div>
                    </div>
                  );
                })}
                {filteredTimezones.length === 0 && (
                  <div className="p-8 text-center">
                    <Globe className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-700 animate-pulse" />
                    <p className="mt-4 text-sm font-medium text-slate-500">
                      No results found for your search.
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          {selectedTimezone && (
            <div className="flex flex-col gap-2 lg:gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="flex justify-between items-center gap-6">
                <div className=" space-y-1.5 w-full">
                  <Label
                    htmlFor="timezone-label"
                    className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400"
                  >
                    Label
                  </Label>
                  <Input
                    id="timezone-label"
                    placeholder="e.g. Office"
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    className="lg:h-12 h-10 bg-slate-50 dark:bg-slate-800 w-full border-none rounded-xl focus-visible:ring-blue-500/30"
                  />
                </div>

                <div className=" space-y-1.5 w-full">
                  <Label
                    htmlFor="timezone-group"
                    className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400"
                  >
                    Group
                  </Label>
                  <Input
                    id="timezone-group"
                    placeholder="e.g. Dev Team"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    className="lg:h-12 h-10 bg-slate-50 dark:bg-slate-800 w-full border-none rounded-xl focus-visible:ring-blue-500/30"
                  />
                </div>
              </div>
              <div className="lg:space-y-3 space-y-2">
                {/* <Label className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                  {t("home.workingHours")}
                </Label> */}
                <div className="flex items-center gap-2">
                  <Select
                    value={workingHoursStart.toString()}
                    onValueChange={(val) => setWorkingHoursStart(parseInt(val))}
                  >
                    <SelectTrigger className="lg:h-12 h-10 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-blue-500/30">
                      <SelectValue placeholder="Start" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-100 dark:border-slate-800 shadow-xl">
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
                  <span className="text-slate-400 font-bold">→</span>
                  <Select
                    value={workingHoursEnd.toString()}
                    onValueChange={(val) => setWorkingHoursEnd(parseInt(val))}
                  >
                    <SelectTrigger className="lg:h-12 h-10 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-blue-500/30">
                      <SelectValue placeholder="End" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-100 dark:border-slate-800 shadow-xl">
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

        <DialogFooter className="px-6 py-3 bg-slate-50/50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="rounded-xl font-bold text-slate-500 hover:text-slate-900 transition-colors"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!selectedTimezone}
            className="rounded-xl px-8 font-bold bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/20 hover:scale-105 transition-transform"
          >
            {editingTimezone ? "Save Changes" : "Confirm Addition"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
