import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pill, Package, DollarSign, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import { apiClient } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface Medicine {
  _id: string;
  name: string;
  strength: string;
  price: number;
  availability: boolean;
  pharmacy: {
    name: string;
    location: string;
  };
}

interface MedicinesModalProps {
  isOpen: boolean;
  onClose: () => void;
  pharmacyName: string;
  pharmacyId: string;
}

const MedicinesModal = ({ isOpen, onClose, pharmacyName, pharmacyId }: MedicinesModalProps) => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      const fetchMedicines = async () => {
        setLoading(true);
        try {
          const response = await apiClient.getMedicinesByPharmacy(pharmacyId);
          setMedicines(response.data);
        } catch (error: any) {
          console.error('Error fetching medicines:', error);
          toast({
            title: "Error Loading Medicines",
            description: error.message || "Failed to load medicines for this pharmacy.",
            variant: "destructive",
          });
        } finally {
          setLoading(false);
        }
      };

      fetchMedicines();
    }
  }, [isOpen, pharmacyId, toast]);

  const handleReserve = async (medicine: Medicine) => {
    try {
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to reserve medicines.",
          variant: "destructive",
        });
        return;
      }

      await apiClient.createReservation({ medicine: medicine._id });

      toast({
        title: "Reservation Confirmed",
        description: `${medicine.name} has been reserved at ${medicine.pharmacy?.name}. Please collect within 24 hours.`,
      });
    } catch (error: any) {
      toast({
        title: "Reservation Error",
        description: error.message || "Failed to create reservation. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            Available Medicines - {pharmacyName}
          </DialogTitle>
          <DialogDescription>
            Browse available medicines and reserve what you need.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2">Loading medicines...</span>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {medicines.map((medicine, index) => (
                <motion.div
                  key={medicine._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="shadow-card hover:shadow-elevated transition-shadow duration-300">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Pill className="h-4 w-4 text-primary" />
                            {medicine.name}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground">
                            Strength: {medicine.strength}
                          </p>
                        </div>
                        <Badge
                          variant={medicine.availability ? "default" : "secondary"}
                          className={medicine.availability ? "bg-success text-success-foreground" : ""}
                        >
                          {medicine.availability ? "Available" : "Out of Stock"}
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span className="font-semibold text-lg">
                            KSh {medicine.price.toLocaleString()}
                          </span>
                        </div>

                        <Button
                          size="sm"
                          disabled={!medicine.availability}
                          onClick={() => handleReserve(medicine)}
                          className="flex items-center gap-1"
                        >
                          <ShoppingCart className="h-4 w-4" />
                          Reserve
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
            
            {medicines.length === 0 && !loading && (
              <div className="text-center py-8">
                <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No medicines available at this pharmacy.</p>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MedicinesModal;