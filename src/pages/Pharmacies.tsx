import { useState } from "react";
import { Building2, Shield, ShieldCheck, Clock, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { withRetry, handleSupabaseError } from "@/lib/networkUtils";
import mockData from "@/data/mockData.json";
import MedicinesModal from "@/components/MedicinesModal";
import PaymentModal from "@/components/PaymentModal";

interface Pharmacy {
  id: string;
  name: string;
  licenseNumber: string;
  county: string;
  location: string;
  status: string;
  phone: string;
  email: string;
}

const Pharmacies = () => {
  const { toast } = useToast();
  const [pharmacies] = useState<Pharmacy[]>(mockData.pharmacies);
  const [medicinesModalOpen, setMedicinesModalOpen] = useState(false);
  const [selectedPharmacy, setSelectedPharmacy] = useState<Pharmacy | null>(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    pharmacyName: "",
    licenseNumber: "",
    email: "",
    phone: "",
    location: "",
    county: "",
    message: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePartnerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Send notification email with retry logic
      await withRetry(
        async () => {
          const { error } = await supabase.functions.invoke('send-contact-email', {
            body: {
              name: formData.pharmacyName,
              email: formData.email,
              phone: formData.phone,
              subject: "Pharmacy Partnership Application",
              category: "pharmacy",
              message: `Pharmacy Partnership Application:
              
Pharmacy Name: ${formData.pharmacyName}
License Number: ${formData.licenseNumber}
Email: ${formData.email}
Phone: ${formData.phone}
Location: ${formData.location}
County: ${formData.county}

Additional Information:
${formData.message || 'None provided'}`
            }
          });

          if (error) throw error;
        },
        {
          maxRetries: 2,
          onRetry: (attempt) => {
            console.log(`Retrying email submission (attempt ${attempt})...`);
          }
        }
      );

      toast({
        title: "Application Submitted",
        description: "Thank you for your interest! We'll review your application and get back to you within 2 business days.",
      });

      // Reset form
      setFormData({
        pharmacyName: "",
        licenseNumber: "",
        email: "",
        phone: "",
        location: "",
        county: "",
        message: "",
      });
    } catch (error) {
      handleSupabaseError(error, "pharmacy application submission");
    }
  };

  const handleViewMedicines = (pharmacy: Pharmacy) => {
    setSelectedPharmacy(pharmacy);
    setMedicinesModalOpen(true);
  };

  const handleShowPayment = () => {
    setPaymentModalOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Verified":
        return (
          <Badge variant="default" className="bg-success text-success-foreground">
            <ShieldCheck className="mr-1 h-3 w-3" />
            Verified
          </Badge>
        );
      case "Pending Verification":
        return (
          <Badge variant="default" className="bg-warning text-warning-foreground">
            <Clock className="mr-1 h-3 w-3" />
            Pending
          </Badge>
        );
      default:
        return null;
    }
  };

  const stats = [
    { label: "Partner Pharmacies", value: pharmacies.length.toString(), icon: Building2 },
    { label: "Verified Partners", value: pharmacies.filter(p => p.status === "Verified").length.toString(), icon: ShieldCheck },
    { label: "Counties Covered", value: "47", icon: MapPin },
    { label: "Average Rating", value: "4.8/5", icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-6 mb-12"
        >
          <div className="space-y-4">
            <h1 className="text-3xl font-bold lg:text-4xl">Partner Pharmacies</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Trusted pharmacy partners across Kenya, verified by the Pharmacy and Poisons Board
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <Card className="shadow-card">
                  <CardContent className="p-4">
                    <stat.icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <div className="text-2xl font-bold text-primary">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Partner CTA */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="hero" size="xl">
                <Building2 className="mr-2 h-5 w-5" />
                Join as a Partner Pharmacy
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Partner with AfyaAlert</DialogTitle>
                <DialogDescription>
                  Submit your details and we’ll review your pharmacy for certification.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handlePartnerSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium">Pharmacy Name *</label>
                    <Input
                      name="pharmacyName"
                      value={formData.pharmacyName}
                      onChange={handleInputChange}
                      placeholder="Your pharmacy name"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">PPB License Number *</label>
                    <Input
                      name="licenseNumber"
                      value={formData.licenseNumber}
                      onChange={handleInputChange}
                      placeholder="PPB/PH/XXX/XXXX"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email *</label>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="pharmacy@example.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Phone Number *</label>
                    <Input
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+254XXXXXXXXX"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Location *</label>
                    <Input
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="Street, area"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">County *</label>
                    <Input
                      name="county"
                      value={formData.county}
                      onChange={handleInputChange}
                      placeholder="County name"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Additional Information</label>
                  <Textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Tell us about your pharmacy, services offered, etc."
                    rows={3}
                  />
                </div>
                <div className="bg-accent/50 p-4 rounded-lg">
                  <p className="text-sm">
                    <strong>Requirements:</strong> Valid PPB license, physical pharmacy location, 
                    commitment to transparent pricing, and regular inventory updates.
                  </p>
                </div>
                <Button type="submit" className="w-full">
                  Submit Application
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </motion.div>

        {/* Pharmacy List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-semibold">All Partner Pharmacies</h2>
          
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {pharmacies.map((pharmacy, index) => (
              <motion.div
                key={pharmacy.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="shadow-card hover:shadow-elevated transition-shadow duration-300">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-xl">{pharmacy.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          License: {pharmacy.licenseNumber}
                        </p>
                      </div>
                      {getStatusBadge(pharmacy.status)}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>{pharmacy.location}, {pharmacy.county}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>{pharmacy.phone}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>{pharmacy.email}</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 pt-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleViewMedicines(pharmacy)}
                      >
                        View Medicines
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={handleShowPayment}
                      >
                        Payment
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Benefits Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 py-12 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl"
        >
          <div className="container mx-auto px-6 text-center">
            <h3 className="text-2xl font-bold mb-6">Why Partner with AfyaAlert?</h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="space-y-2">
                <Shield className="h-8 w-8 mx-auto text-primary" />
                <h4 className="font-semibold">Increased Visibility</h4>
                <p className="text-sm text-muted-foreground">
                  Reach thousands of customers searching for medicines
                </p>
              </div>
              <div className="space-y-2">
                <Building2 className="h-8 w-8 mx-auto text-primary" />
                <h4 className="font-semibold">Easy Management</h4>
                <p className="text-sm text-muted-foreground">
                  Simple tools to manage inventory and pricing
                </p>
              </div>
              <div className="space-y-2">
                <ShieldCheck className="h-8 w-8 mx-auto text-primary" />
                <h4 className="font-semibold">Trust & Credibility</h4>
                <p className="text-sm text-muted-foreground">
                  Official verification builds customer trust
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Modals */}
        {selectedPharmacy && (
          <MedicinesModal
            isOpen={medicinesModalOpen}
            onClose={() => setMedicinesModalOpen(false)}
            pharmacyName={selectedPharmacy.name}
            pharmacyId={selectedPharmacy.id}
          />
        )}

        <PaymentModal
          isOpen={paymentModalOpen}
          onClose={() => setPaymentModalOpen(false)}
          amount={1500}
          description="Pharmacy certification and partnership fee"
        />
      </div>
    </div>
  );
};

export default Pharmacies;