import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pill, Package, DollarSign, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";

interface Medicine {
  id: string;
  name: string;
  strength: string;
  price: number;
  availability: boolean;
  description?: string;
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

  // Mock data for demonstration - in real app, fetch from API
  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        const mockMedicines: Medicine[] = [
          {
            id: "1",
            name: "Paracetamol",
            strength: "500mg",
            price: 150,
            availability: true,
            description: "Pain relief and fever reducer"
          },
          {
            id: "2",
            name: "Amoxicillin",
            strength: "250mg",
            price: 450,
            availability: true,
            description: "Antibiotic for bacterial infections"
          },
          {
            id: "3",
            name: "Ibuprofen",
            strength: "400mg",
            price: 200,
            availability: false,
            description: "Anti-inflammatory pain reliever"
          },
          {
            id: "4",
            name: "Cetirizine",
            strength: "10mg",
            price: 180,
            availability: true,
            description: "Antihistamine for allergies"
          },
          {
            id: "5",
            name: "Metformin",
            strength: "500mg",
            price: 320,
            availability: true,
            description: "Diabetes medication"
          }
        ];
        setMedicines(mockMedicines);
        setLoading(false);
      }, 1000);
    }
  }, [isOpen]);

  const handleReserve = (medicineId: string, medicineName: string) => {
    // In real app, this would handle reservation logic
    alert(`Reservation request sent for ${medicineName}`);
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
                  key={medicine.id}
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
                      {medicine.description && (
                        <p className="text-sm text-muted-foreground">
                          {medicine.description}
                        </p>
                      )}
                      
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
                          onClick={() => handleReserve(medicine.id, medicine.name)}
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