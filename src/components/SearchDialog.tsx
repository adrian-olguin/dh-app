import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { BookmarkButton } from "@/components/BookmarkButton";
import { Search, Calendar, Video, Headphones, BookOpen, X, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Mock data for demonstration
const mockMessages = [
  { id: 1, title: "Finding Peace in Difficult Times", type: "video", date: "2024-01-15", topic: "Faith", duration: "28:45" },
  { id: 2, title: "The Power of Prayer", type: "video", date: "2024-01-08", topic: "Prayer", duration: "32:10" },
  { id: 3, title: "Walking in Love", type: "video", date: "2024-01-01", topic: "Love", duration: "25:30" },
];

const mockDevotionals = [
  { id: 1, title: "Hope for Today", type: "devotional", date: "2024-01-15", topic: "Hope", verse: "Psalm 46:1" },
  { id: 2, title: "God's Faithfulness", type: "devotional", date: "2024-01-14", topic: "Faith", verse: "Lamentations 3:22-23" },
  { id: 3, title: "Peace in the Storm", type: "devotional", date: "2024-01-13", topic: "Peace", verse: "Philippians 4:6-7" },
];

const mockAudioEpisodes = [
  { id: 1, title: "Daily Hope - Morning Encouragement", type: "audio", date: "2024-01-15", topic: "Encouragement", duration: "15:20" },
  { id: 2, title: "Overcoming Anxiety", type: "audio", date: "2024-01-14", topic: "Peace", duration: "18:45" },
  { id: 3, title: "The Gift of Gratitude", type: "audio", date: "2024-01-13", topic: "Gratitude", duration: "16:30" },
];

export const SearchDialog = ({ open, onOpenChange }: SearchDialogProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<string>("all");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [activeTab, setActiveTab] = useState("all");

  const topics = ["all", "Faith", "Hope", "Love", "Prayer", "Peace", "Encouragement", "Gratitude"];

  const filterResults = (items: any[]) => {
    return items.filter(item => {
      const matchesQuery = searchQuery === "" || 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.verse && item.verse.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesTopic = selectedTopic === "all" || item.topic === selectedTopic;
      
      const matchesDate = !selectedDate || 
        format(new Date(item.date), "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd");
      
      return matchesQuery && matchesTopic && matchesDate;
    });
  };

  const allResults = [
    ...filterResults(mockMessages),
    ...filterResults(mockDevotionals),
    ...filterResults(mockAudioEpisodes),
  ];

  const renderResultCard = (item: any) => {
    const Icon = item.type === "video" ? Video : item.type === "audio" ? Headphones : BookOpen;
    const contentType = item.type === "video" ? "message" : item.type;
    
    return (
      <Card key={`${item.type}-${item.id}`} className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Icon className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between mb-1">
                <h3 className="font-semibold text-foreground">{item.title}</h3>
                <BookmarkButton
                  contentType={contentType}
                  contentId={item.id.toString()}
                  title={item.title}
                />
              </div>
              <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                <span className="capitalize">{item.type}</span>
                <span>•</span>
                <span>{format(new Date(item.date), "MMM d, yyyy")}</span>
                <span>•</span>
                <span className="text-primary">{item.topic}</span>
                {item.duration && (
                  <>
                    <span>•</span>
                    <span>{item.duration}</span>
                  </>
                )}
                {item.verse && (
                  <>
                    <span>•</span>
                    <span>{item.verse}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedTopic("all");
    setSelectedDate(undefined);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Search Content
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            <Select value={selectedTopic} onValueChange={setSelectedTopic}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Topic" />
              </SelectTrigger>
              <SelectContent>
                {topics.map((topic) => (
                  <SelectItem key={topic} value={topic}>
                    {topic === "all" ? "All Topics" : topic}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "gap-2",
                    selectedDate && "text-primary"
                  )}
                >
                  <CalendarIcon className="w-4 h-4" />
                  {selectedDate ? format(selectedDate, "MMM d, yyyy") : "Select Date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date > new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            {(searchQuery || selectedTopic !== "all" || selectedDate) && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-2">
                <X className="w-4 h-4" />
                Clear Filters
              </Button>
            )}
          </div>

          {/* Results Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden flex flex-col">
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="all">All ({allResults.length})</TabsTrigger>
              <TabsTrigger value="videos">Videos ({filterResults(mockMessages).length})</TabsTrigger>
              <TabsTrigger value="devotionals">Devotionals ({filterResults(mockDevotionals).length})</TabsTrigger>
              <TabsTrigger value="audio">Audio ({filterResults(mockAudioEpisodes).length})</TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-y-auto mt-4">
              <TabsContent value="all" className="space-y-3 mt-0">
                {allResults.length > 0 ? (
                  allResults.map(renderResultCard)
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No results found. Try adjusting your filters.
                  </div>
                )}
              </TabsContent>

              <TabsContent value="videos" className="space-y-3 mt-0">
                {filterResults(mockMessages).length > 0 ? (
                  filterResults(mockMessages).map(renderResultCard)
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No video messages found.
                  </div>
                )}
              </TabsContent>

              <TabsContent value="devotionals" className="space-y-3 mt-0">
                {filterResults(mockDevotionals).length > 0 ? (
                  filterResults(mockDevotionals).map(renderResultCard)
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No devotionals found.
                  </div>
                )}
              </TabsContent>

              <TabsContent value="audio" className="space-y-3 mt-0">
                {filterResults(mockAudioEpisodes).length > 0 ? (
                  filterResults(mockAudioEpisodes).map(renderResultCard)
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No audio episodes found.
                  </div>
                )}
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};
