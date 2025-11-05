import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, LogOut, User } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/SearchBar";
import { ImageGrid } from "@/components/ImageGrid";
import { TopSearches } from "@/components/TopSearches";
import { SearchHistory } from "@/components/SearchHistory";
import { SelectionCounter } from "@/components/SelectionCounter";
import { toast } from "sonner";
import axios from "axios";

const Index = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ email: string; name: string; image?: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [images, setImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [searchHistory, setSearchHistory] = useState<{ term: string; timestamp: Date }[]>([]);
  const [topSearches, setTopSearches] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [currentSearchTerm, setCurrentSearchTerm] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const email = params.get("email");
    const name = params.get("name");
    const image = params.get("profilePic")
    let userLoggedIn = false;

    if (email && name) {
      const user = { email, name, image };
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("isLoggedIn", "true");
      setUser(user);
      window.history.replaceState({}, document.title, "/");
      userLoggedIn = true;
    } else {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        if (parsedUser.email === "guest@example.com") {
          localStorage.setItem("isLoggedIn", "false");
        } else {
          localStorage.setItem("isLoggedIn", "true");
        }
        userLoggedIn = true;
      } else {
        navigate("/auth");
      }
    }

    if (userLoggedIn) {
      fetchInitialImages();
      fetchTopSearches();
      fetchSearchHistory();
    }
  }, [navigate]);

  const fetchSearchHistory = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/history", { withCredentials: true });
      const { terms, time_stamp } = response.data;
      const history = terms.map((term: string, index: number) => ({
        term,
        timestamp: time_stamp[index],
      }));
      setSearchHistory(history);
    } catch (error) {
      console.error("Failed to fetch search history:", error);
    }
  };

  const fetchTopSearches = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/top-searches", { withCredentials: true });
      setTopSearches(response.data);
    } catch (error) {
      console.error("Failed to fetch top searches:", error);
    }
  };

  const handleSearch = async (isNewSearch = true) => {
    const term = isNewSearch ? searchQuery : currentSearchTerm;
    if (!term.trim()) return;

    const newPage = isNewSearch ? 1 : page + 1;
    if (isNewSearch) {
      setPage(1);
      setImages([]);
      setCurrentSearchTerm(searchQuery);
      const newHistory = [{ term: searchQuery, timestamp: new Date() }, ...searchHistory.filter(h => h.term !== searchQuery)].slice(0, 20);
      setSearchHistory(newHistory);
    } else {
      setPage(newPage);
    }
    if (term != "random") {
      
      toast.success(`Searching for "${term}"...`);
    }

    try {
      const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
      const apiUrl = isLoggedIn
        ? `http://localhost:8080/api/search?term=${term}&page=${newPage}`
        : `http://localhost:8080/api/search-guest?page=${newPage}`;

      const response = await axios.get(apiUrl, { withCredentials: true });
      console.log(response.data);
      if (isNewSearch) {
        setImages(response.data.results);
      } else {
        setImages(prevImages => [...prevImages, ...response.data.results]);
      }
    } catch (error) {
      console.error("Search failed:", error);
      toast.error("Search failed. Please try again.");
    }
  };

  const handleTopSearchClick = (search: string) => {
    setSearchQuery(search);
    handleSearch(true);
  };

  const toggleImageSelection = (id: string) => {
    setSelectedImages(prev =>
      prev.includes(id) ? prev.filter(imgId => imgId !== id) : [...prev, id]
    );
  };



  const handleNextPage = () => {
    handleSearch(false); // false indicates it's not a new search
  };

  const fetchInitialImages = async () => {
    setCurrentSearchTerm("random");
    try {
      const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
      const apiUrl = isLoggedIn
        ? `http://localhost:8080/api/search?term=random&page=1`
        : `http://localhost:8080/api/search-guest?page=1`;

      const response = await axios.get(apiUrl, { withCredentials: true });
      setImages(response.data.results);
    } catch (error) {
      console.error("Failed to fetch initial images:", error);
      toast.error("Failed to load initial images.");
    }
  };

  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:8080/api/logout", { withCredentials: true });
      localStorage.removeItem("user");
      localStorage.setItem("isLoggedIn", "false");
      toast.success("You have been signed out.");
      navigate("/auth");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-lg border-b border-border/50 shadow-sm">
        <div className="container mx-auto px-4 py-3">
          {/* Top row for mobile: Logo and Profile Icon */}
          <div className="flex items-center justify-between sm:hidden mb-4">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                ImageSearch
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.image || "https://github.com/shadcn.png"} alt="avatar"/>
                      <AvatarFallback className="bg-muted">
                        <User className="h-6 w-6 text-foreground" />
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{localStorage.getItem("isLoggedIn") === "false" ? "Guest" : user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => toast.info("Settings not implemented yet!")} className="focus:bg-accent focus:text-accent-foreground">
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="focus:bg-accent focus:text-accent-foreground">
                    <LogOut className="w-4 h-4 mr-2" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Main row for larger screens: Logo, Search Bar, Profile Icon */}
          <div className="hidden sm:flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                ImageSearch
              </h1>
            </div>
            <div className={`w-full sm:flex-1 max-w-xl sm:mx-auto ${localStorage.getItem("isLoggedIn") === "false" ? "pointer-events-none opacity-50" : ""}`}>
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                onSearch={() => handleSearch(true)}
              />
            </div>
            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.image || "https://github.com/shadcn.png"} alt="avatar"/>
                      <AvatarFallback className="bg-muted">
                        <User className="h-6 w-6 text-foreground" />
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{localStorage.getItem("isLoggedIn") === "false" ? "Guest" : user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => toast.info("Settings not implemented yet!")} className="focus:bg-accent focus:text-accent-foreground">
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="focus:bg-accent focus:text-accent-foreground">
                    <LogOut className="w-4 h-4 mr-2" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Search bar for mobile (hidden on sm and above) */}
          <div className={`sm:hidden ${localStorage.getItem("isLoggedIn") === "false" ? "pointer-events-none opacity-50" : ""}`}>
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onSearch={() => handleSearch(true)}
            />
          </div>
        </div>
      </header>

                  {topSearches && topSearches.length > 0 && (
                    <TopSearches searches={topSearches} onSearchClick={handleTopSearchClick} />
                  )}
            
                  <main className="container mx-auto px-4 py-8 space-y-6">
                    {searchHistory && searchHistory.length > 0 && (
                      <SearchHistory
                        history={searchHistory}
                        onSearchClick={handleTopSearchClick}
                        onClear={() => {
                          axios.post("http://localhost:8080/api/history/clear", {}, { withCredentials: true });
                          setSearchHistory([]);
                        }}
                      />
                    )}
        <ImageGrid
          images={images}
          selectedImages={selectedImages}
          onToggleSelect={toggleImageSelection}
        />

        {images.length > 0 && (
          <div className="flex justify-center mt-8">
            <Button onClick={handleNextPage} className="bg-primary text-primary-foreground shadow-md hover:bg-primary/90">Next Page</Button>
          </div>
        )}
      </main>

      <SelectionCounter
        count={selectedImages.length}
        onClear={() => setSelectedImages([])}
      />


    </div>
  );
};

export default Index;
