import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Search as SearchIcon, MapPin, Filter, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { searchSchema, type SearchFormData } from "@/lib/validations";
import { supabase } from "@/integrations/supabase/client";
import { withRetry, handleSupabaseError } from "@/lib/networkUtils";
import { LoadingFallback, LoadingSkeleton } from "@/components/LoadingFallback";
import { ErrorFallback } from "@/components/ErrorFallback";

interface Medicine {
  id: string;
  name: string;
  strength: string;
  price: number;
  pharmacy_id: string;
  availability: boolean;
  pharmacies?: {
    name: string;
    location: string;
  };
}

const Search = () => {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [filteredMedicines, setFilteredMedicines] = useState<Medicine[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [allMedicines, setAllMedicines] = useState<Medicine[]>([]);
  const [autocompleteOpen, setAutocompleteOpen] = useState(false);
  const [locations, setLocations] = useState<string[]>([]);
  const [loadError, setLoadError] = useState<Error | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);

  // Search form with validation
  const searchForm = useForm<SearchFormData>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      query: searchParams.get("q") || "",
    },
  });

  useEffect(() => {
    // Load medicines from Supabase with retry logic
    const fetchMedicines = async () => {
      setInitialLoading(true);
      setLoadError(null);

      try {
        await withRetry(
          async () => {
            const { data, error } = await supabase
              .from('medicines')
              .select(`
                id,
                name,
                strength,
                price,
                availability,
                pharmacy_id,
                pharmacies (
                  name,
                  location
                )
              `)
              .eq('availability', true);

            if (error) throw error;

            const formattedMedicines = data.map(med => ({
              id: med.id,
              name: med.name,
              strength: med.strength,
              price: Number(med.price),
              pharmacy_id: med.pharmacy_id,
              availability: med.availability,
              pharmacies: med.pharmacies as any
            }));

            setMedicines(formattedMedicines);
            setAllMedicines(formattedMedicines);
            setFilteredMedicines(formattedMedicines);

            // Extract unique locations
            const uniqueLocations = [...new Set(formattedMedicines
              .map(m => m.pharmacies?.location)
              .filter(Boolean))] as string[];
            setLocations(uniqueLocations);
          },
          {
            maxRetries: 3,
            onRetry: (attempt) => {
              console.log(`Retrying medicine fetch (attempt ${attempt})...`);
            }
          }
        );
      } catch (error) {
        console.error('Error fetching medicines:', error);
        setLoadError(error as Error);
        handleSupabaseError(error, "medicine search");
      } finally {
        setInitialLoading(false);
      }
    };

    fetchMedicines();
  }, [toast]);

  useEffect(() => {
    // Filter medicines based on search query and location
    let filtered = medicines;
    const currentQuery = searchForm.getValues("query");

    if (currentQuery.trim()) {
      filtered = filtered.filter((medicine) =>
        medicine.name.toLowerCase().includes(currentQuery.toLowerCase())
      );
    }

    if (selectedLocation && selectedLocation !== "all") {
      filtered = filtered.filter((medicine) =>
        medicine.pharmacies?.location === selectedLocation
      );
    }

    setFilteredMedicines(filtered);
  }, [searchForm, selectedLocation, medicines]);

  const handleSearch = (data: SearchFormData) => {
    setIsLoading(true);
    
    try {
      const query = data.query.trim();
      
      if (!query) {
        toast({
          title: "Empty Search",
          description: "Please enter a medicine name to search.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Filter medicines based on validated search query and location
      let filtered = medicines.filter((medicine) =>
        medicine.name.toLowerCase().includes(query.toLowerCase())
      );

      if (selectedLocation && selectedLocation !== "all") {
        filtered = filtered.filter((medicine) =>
          medicine.pharmacies?.location === selectedLocation
        );
      }

      setFilteredMedicines(filtered);

      toast({
        title: "Search Complete",
        description: `Found ${filtered.length} result(s) for "${query}"`,
      });
    } catch (error) {
      toast({
        title: "Search Error",
        description: "Invalid search query. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReserve = async (medicine: Medicine) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to reserve medicines.",
          variant: "destructive",
        });
        return;
      }

      // Create reservation in database with retry logic
      await withRetry(
        async () => {
          const { error } = await supabase
            .from('reservations')
            .insert({
              user_id: user.id,
              medicine_id: medicine.id,
              pharmacy_id: medicine.pharmacy_id,
              status: 'pending'
            });

          if (error) throw error;
        },
        {
          maxRetries: 2,
          onRetry: (attempt) => {
            console.log(`Retrying reservation (attempt ${attempt})...`);
          }
        }
      );

      toast({
        title: "Reservation Confirmed",
        description: `${medicine.name} has been reserved at ${medicine.pharmacies?.name}. Please collect within 24 hours.`,
      });
    } catch (error) {
      handleSupabaseError(error, "medicine reservation");
    }
  };

  const getAvailabilityBadge = (availability: boolean) => {
    if (availability) {
      return (
        <Badge variant="default" className="bg-success text-success-foreground">
          <CheckCircle className="mr-1 h-3 w-3" />
          In Stock
        </Badge>
      );
    } else {
      return (
        <Badge variant="destructive">
          <AlertCircle className="mr-1 h-3 w-3" />
          Out of Stock
        </Badge>
      );
    }
  };

  // Get autocomplete suggestions
  const getAutocompleteSuggestions = (query: string) => {
    if (!query.trim()) return [];
    
    const uniqueMedicines = [...new Set(allMedicines.map(m => m.name))];
    return uniqueMedicines
      .filter(name => name.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 8);
  };

  // Show loading state on initial load
  if (initialLoading) {
    return (
      <div className="min-h-screen bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <h1 className="text-3xl font-bold lg:text-4xl">Search Medicines</h1>
              <p className="text-xl text-muted-foreground">
                Find the best prices and availability across Kenya
              </p>
            </div>
            <LoadingSkeleton count={6} />
          </div>
        </div>
      </div>
    );
  }

  // Show error state if initial load failed
  if (loadError) {
    return (
      <div className="min-h-screen bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <h1 className="text-3xl font-bold lg:text-4xl">Search Medicines</h1>
              <p className="text-xl text-muted-foreground">
                Find the best prices and availability across Kenya
              </p>
            </div>
            <ErrorFallback
              error={loadError}
              resetError={() => window.location.reload()}
              title="Unable to Load Medicines"
              description="We couldn't load the medicine database. Please check your connection and try again."
              actionLabel="Reload Page"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        {/* Search Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold lg:text-4xl">Search Medicines</h1>
            <p className="text-xl text-muted-foreground">
              Find the best prices and availability across Kenya
            </p>
          </div>

          {/* Search Form */}
          <Card className="shadow-card">
            <CardContent className="p-6">
              <Form {...searchForm}>
                <form onSubmit={searchForm.handleSubmit(handleSearch)}>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <FormField
                      control={searchForm.control}
                      name="query"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Popover open={autocompleteOpen} onOpenChange={setAutocompleteOpen}>
                              <PopoverTrigger asChild>
                                <div className="relative">
                                  <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                  <Input
                                    type="text"
                                    placeholder="Search medicine name..."
                                    className="pl-10"
                                    {...field}
                                    onChange={(e) => {
                                      field.onChange(e);
                                      setAutocompleteOpen(e.target.value.length > 0);
                                    }}
                                  />
                                </div>
                              </PopoverTrigger>
                              <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                                <Command>
                                  <CommandInput placeholder="Search medicines..." value={field.value} />
                                  <CommandList>
                                    <CommandEmpty>No medicines found.</CommandEmpty>
                                    <CommandGroup>
                                      {getAutocompleteSuggestions(field.value).map((suggestion) => (
                                        <CommandItem
                                          key={suggestion}
                                          value={suggestion}
                                          onSelect={(value) => {
                                            field.onChange(value);
                                            setAutocompleteOpen(false);
                                            searchForm.handleSubmit(handleSearch)();
                                          }}
                                        >
                                          <SearchIcon className="mr-2 h-4 w-4" />
                                          {suggestion}
                                        </CommandItem>
                                      ))}
                                    </CommandGroup>
                                  </CommandList>
                                </Command>
                              </PopoverContent>
                            </Popover>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                      <SelectTrigger>
                        <div className="flex items-center">
                          <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                          <SelectValue placeholder="Select location" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Locations</SelectItem>
                        {locations.map((location) => (
                          <SelectItem key={location} value={location}>
                            {location}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Button type="submit" disabled={isLoading}>
                      <Filter className="mr-2 h-4 w-4" />
                      {isLoading ? "Searching..." : "Search"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Results */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8"
        >
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-semibold">
              Search Results ({filteredMedicines.length})
            </h2>
          </div>

          <AnimatePresence>
            {filteredMedicines.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-12"
              >
                <div className="space-y-4">
                  <SearchIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="text-xl font-semibold">No medicines found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search terms or location filter
                  </p>
                </div>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredMedicines.map((medicine, index) => (
                  <motion.div
                    key={medicine.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <Card className="h-full shadow-card hover:shadow-elevated transition-shadow duration-300">
                      <CardHeader className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">{medicine.name}</CardTitle>
                            <p className="text-sm text-muted-foreground">
                              {medicine.strength}
                            </p>
                          </div>
                          {getAvailabilityBadge(medicine.availability)}
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        <div className="text-2xl font-bold text-primary">
                          KSh {medicine.price.toLocaleString()}
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center text-sm">
                            <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                            <span>{medicine.pharmacies?.name}</span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {medicine.pharmacies?.location}
                          </div>
                        </div>

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              className="w-full"
                              disabled={!medicine.availability}
                              variant={!medicine.availability ? "outline" : "default"}
                            >
                              {!medicine.availability ? "Out of Stock" : "Reserve Medicine"}
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Reserve Medicine</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <h4 className="font-semibold">{medicine.name} {medicine.strength}</h4>
                                <p className="text-sm text-muted-foreground">
                                  Price: KSh {medicine.price.toLocaleString()}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  Pharmacy: {medicine.pharmacies?.name}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  Location: {medicine.pharmacies?.location}
                                </p>
                              </div>
                              <div className="bg-accent/50 p-4 rounded-lg">
                                <p className="text-sm">
                                  <strong>Note:</strong> This is a demo reservation. 
                                  In the actual implementation, you would need to contact 
                                  the pharmacy directly or complete the reservation process.
                                </p>
                              </div>
                              <Button
                                className="w-full"
                                onClick={() => handleReserve(medicine)}
                              >
                                Confirm Reservation
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default Search;