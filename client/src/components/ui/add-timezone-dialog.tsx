import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getCommonTimezones, getTimeInTimezone, formatTimezoneOffset } from "@/lib/utils";
import { Timezone, InsertTimezone } from "@shared/schema";
import { Search } from "lucide-react";
import { Globe } from "lucide-react";

interface AddTimezoneDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddTimezone: (timezone: Omit<InsertTimezone, "userId">) => void;
  onEditTimezone: (id: number, timezone: Partial<InsertTimezone>) => void;
  editingTimezone: Timezone | null;
  use24Hour: boolean;
}

export function AddTimezoneDialog({
  open,
  onOpenChange,
  onAddTimezone,
  onEditTimezone,
  editingTimezone,
  use24Hour,
}: AddTimezoneDialogProps) {
  const commonTimezones = getCommonTimezones();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTimezone, setSelectedTimezone] = useState<
    (typeof commonTimezones)[0] | null
  >(null);
  const [label, setLabel] = useState("");
  const [workingHoursStart, setWorkingHoursStart] = useState(9);
  const [workingHoursEnd, setWorkingHoursEnd] = useState(17);

  useEffect(() => {
    if (editingTimezone) {
      // Find the corresponding common timezone or create a custom one
      const matchingTimezone = commonTimezones.find(
        (tz) => tz.name === editingTimezone.name && tz.offset === editingTimezone.offset
      );
      
      setSelectedTimezone(
        matchingTimezone || {
          name: editingTimezone.name,
          city: editingTimezone.city,
          region: editingTimezone.region || "",
          abbreviation: editingTimezone.abbreviation,
          offset: editingTimezone.offset,
        }
      );
      
      setLabel(editingTimezone.label || "");
      setWorkingHoursStart(editingTimezone.workingHoursStart);
      setWorkingHoursEnd(editingTimezone.workingHoursEnd);
    } else {
      // Reset form for adding new timezone
      setSelectedTimezone(null);
      setLabel("");
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
      formatTimezoneOffset(tz.offset).toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Generate time options for select
  const timeOptions = Array.from({ length: 24 }, (_, i) => i);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] bg-white dark:bg-slate-900 border-none shadow-2xl rounded-3xl overflow-hidden p-0">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8">
          <DialogTitle className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
              <Globe className="h-6 w-6 text-white" />
            </div>
            {editingTimezone ? "Edit Timezone" : "Add Timezone"}
          </DialogTitle>
          <p className="text-blue-100 text-sm mt-2 font-medium">
            {editingTimezone ? "Update details for this location" : "Track time and working hours for a new location"}
          </p>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-3">
            <Label htmlFor="timezone-search" className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Search for a city or country</Label>
            <div className="relative group">
              <Input
                id="timezone-search"
                placeholder="e.g. London, Paris, United States..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus-visible:ring-blue-500/30 transition-all text-base"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden bg-slate-50/30 dark:bg-slate-800/20">
            <ScrollArea className="h-[240px]">
              <div className="p-2 space-y-1">
                {filteredTimezones.map((timezone, index) => {
                  const { time } = getTimeInTimezone(timezone.offset, use24Hour);
                  const isSelected = selectedTimezone?.name === timezone.name && 
                                    selectedTimezone?.offset === timezone.offset;

                  return (
                    <div
                      key={index}
                      className={`py-3 px-4 hover:bg-white dark:hover:bg-slate-700 cursor-pointer rounded-xl flex items-center justify-between transition-all group ${
                        isSelected ? "bg-white dark:bg-slate-700 shadow-md ring-1 ring-blue-500/20" : ""
                      }`}
                      onClick={() => setSelectedTimezone(timezone)}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${isSelected ? 'bg-blue-500 animate-pulse' : 'bg-slate-300 dark:bg-slate-600'}`} />
                        <div>
                          <div className={`text-sm font-bold ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-200'}`}>{timezone.name}</div>
                          <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mt-0.5">
                            {timezone.region} • {formatTimezoneOffset(timezone.offset)}
                          </div>
                        </div>
                      </div>
                      <div className={`text-sm font-black ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'}`}>{time}</div>
                    </div>
                  );
                })}
                {filteredTimezones.length === 0 && (
                  <div className="p-8 text-center">
                    <Globe className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-700 animate-pulse" />
                    <p className="mt-4 text-sm font-medium text-slate-500">No results found for your search.</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          {selectedTimezone && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="space-y-3">
                <Label htmlFor="timezone-label" className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Label (optional)</Label>
                <Input
                  id="timezone-label"
                  placeholder="e.g. Sales Team"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  className="h-12 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus-visible:ring-blue-500/30"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Working Hours</Label>
                <div className="flex items-center gap-2">
                  <Select
                    value={workingHoursStart.toString()}
                    onValueChange={(val) => setWorkingHoursStart(parseInt(val))}
                  >
                    <SelectTrigger className="h-12 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-blue-500/30">
                      <SelectValue placeholder="Start" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-100 dark:border-slate-800 shadow-xl">
                      {timeOptions.slice(0, -1).map((hour) => (
                        <SelectItem key={hour} value={hour.toString()} className="rounded-lg">
                          {use24Hour ? `${hour.toString().padStart(2, "0")}:00` : `${hour % 12 === 0 ? 12 : hour % 12}:00 ${hour >= 12 ? 'PM' : 'AM'}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <span className="text-slate-400 font-bold">→</span>
                  <Select
                    value={workingHoursEnd.toString()}
                    onValueChange={(val) => setWorkingHoursEnd(parseInt(val))}
                  >
                    <SelectTrigger className="h-12 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-blue-500/30">
                      <SelectValue placeholder="End" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-100 dark:border-slate-800 shadow-xl">
                      {timeOptions.slice(1).map((hour) => (
                        <SelectItem key={hour} value={hour.toString()} className="rounded-lg">
                          {use24Hour ? `${hour.toString().padStart(2, "0")}:00` : `${hour % 12 === 0 ? 12 : hour % 12}:00 ${hour >= 12 ? 'PM' : 'AM'}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="p-6 bg-slate-50/50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800">
          <Button variant="ghost" onClick={() => onOpenChange(false)} className="rounded-xl font-bold text-slate-500 hover:text-slate-900 transition-colors">
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
