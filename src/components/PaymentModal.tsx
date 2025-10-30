import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Smartphone, Building2, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  description: string;
}

const PaymentModal = ({ isOpen, onClose, amount, description }: PaymentModalProps) => {
  const { toast } = useToast();
  const [paymentMethod, setPaymentMethod] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    bankCode: "",
    pin: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePayment = async () => {
    if (!paymentMethod) {
      toast({
        title: "Payment Method Required",
        description: "Please select a payment method",
        variant: "destructive"
      });
      return;
    }

    if (!formData.email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('paystack-payment', {
        body: {
          email: formData.email,
          amount: amount * 100, // Paystack expects amount in kobo
          metadata: {
            description,
            payment_method: paymentMethod,
            phone: formData.phone,
            bank_code: formData.bankCode
          }
        }
      });

      if (error) throw error;

      if (data?.authorization_url) {
        // Open Paystack checkout in a new tab
        window.open(data.authorization_url, '_blank');
        toast({
          title: "Payment Initiated",
          description: "Complete your payment in the new tab",
        });
        onClose();
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Error",
        description: error.message || "Failed to initiate payment",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const paymentMethods = [
    {
      id: "mobile_money",
      label: "Mobile Money",
      icon: Smartphone,
      description: "Pay with M-Pesa, Airtel Money, or T-Kash"
    },
    {
      id: "bank_transfer",
      label: "Bank Transfer",
      icon: Building2,
      description: "Direct bank account transfer"
    },
    {
      id: "card",
      label: "Card Payment",
      icon: CreditCard,
      description: "Pay with Visa, Mastercard, or Verve"
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Complete Payment
          </DialogTitle>
          <DialogDescription>
            Choose a method and enter details to proceed to a secure Paystack checkout.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Payment Summary */}
          <Card className="bg-accent/50">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Amount to Pay:</span>
                <span className="text-xl font-bold">KSh {amount.toLocaleString()}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">{description}</p>
            </CardContent>
          </Card>

          {/* Payment Method Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Select Payment Method</label>
            <div className="grid gap-3">
              {paymentMethods.map((method) => (
                <motion.div
                  key={method.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card 
                    className={`cursor-pointer transition-colors ${
                      paymentMethod === method.id 
                        ? 'border-primary bg-primary/5' 
                        : 'hover:bg-accent/50'
                    }`}
                    onClick={() => setPaymentMethod(method.id)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center gap-3">
                        <method.icon className="h-5 w-5 text-primary" />
                        <div className="flex-1">
                          <div className="font-medium">{method.label}</div>
                          <div className="text-sm text-muted-foreground">{method.description}</div>
                        </div>
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          paymentMethod === method.id 
                            ? 'border-primary bg-primary' 
                            : 'border-muted'
                        }`}>
                          {paymentMethod === method.id && (
                            <div className="w-2 h-2 rounded-full bg-white m-0.5" />
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Payment Form */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Email Address *</label>
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="your@email.com"
                required
              />
            </div>

            {paymentMethod === "mobile_money" && (
              <div>
                <label className="text-sm font-medium">Phone Number</label>
                <Input
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+254XXXXXXXXX"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Enter your mobile money number
                </p>
              </div>
            )}

            {paymentMethod === "bank_transfer" && (
              <div>
                <label className="text-sm font-medium">Select Bank</label>
                <Select value={formData.bankCode} onValueChange={(value) => 
                  setFormData({ ...formData, bankCode: value })
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose your bank" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="044">Access Bank</SelectItem>
                    <SelectItem value="014">Afriland First Bank</SelectItem>
                    <SelectItem value="023">Citibank Nigeria</SelectItem>
                    <SelectItem value="050">Ecobank Nigeria</SelectItem>
                    <SelectItem value="011">First Bank of Nigeria</SelectItem>
                    <SelectItem value="058">Guaranty Trust Bank</SelectItem>
                    <SelectItem value="030">Heritage Bank</SelectItem>
                    <SelectItem value="082">Keystone Bank</SelectItem>
                    <SelectItem value="076">Polaris Bank</SelectItem>
                    <SelectItem value="221">Stanbic IBTC Bank</SelectItem>
                    <SelectItem value="068">Standard Chartered Bank</SelectItem>
                    <SelectItem value="232">Sterling Bank</SelectItem>
                    <SelectItem value="033">United Bank For Africa</SelectItem>
                    <SelectItem value="032">Union Bank of Nigeria</SelectItem>
                    <SelectItem value="035">Wema Bank</SelectItem>
                    <SelectItem value="057">Zenith Bank</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <Button 
            onClick={handlePayment}
            disabled={loading || !paymentMethod}
            className="w-full"
            size="lg"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Processing...
              </div>
            ) : (
              `Pay KSh ${amount.toLocaleString()}`
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            Secured by Paystack. Your payment information is encrypted and secure.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;