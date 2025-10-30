import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Phone, MapPin, Send, MessageCircle, HelpCircle, Building2, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { withRetry, handleSupabaseError } from "@/lib/networkUtils";
import { contactSchema, paymentSchema, type ContactFormData, type PaymentFormData } from "@/lib/validations";

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Contact form with validation
  const contactForm = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  // Payment forms with validation
  const mpesaForm = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      amount: 0,
      email: "",
      phone: "",
    },
  });

  const cardForm = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      amount: 0,
      email: "",
      phone: "",
    },
  });

  const handleSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);

    try {
      await withRetry(
        async () => {
          const { error } = await supabase.functions.invoke('send-contact-email', {
            body: data
          });
          if (error) throw error;
        },
        {
          maxRetries: 2,
          onRetry: (attempt) => {
            console.log(`Retrying contact form submission (attempt ${attempt})...`);
          }
        }
      );

      toast({
        title: "Message Sent Successfully",
        description: "Thank you for contacting us! We'll get back to you within 24 hours.",
      });

      contactForm.reset();
    } catch (error) {
      handleSupabaseError(error, "contact form submission");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMpesaPayment = async (data: PaymentFormData) => {
    try {
      const response = await withRetry(
        async () => {
          const { data: response, error } = await supabase.functions.invoke('mpesa-payment', {
            body: {
              amount: data.amount,
              phoneNumber: data.phone,
              description: "AfyaAlert Service Payment"
            }
          });
          if (error) throw error;
          return response;
        },
        {
          maxRetries: 2,
          onRetry: (attempt) => {
            console.log(`Retrying M-Pesa payment (attempt ${attempt})...`);
          }
        }
      );

      toast({
        title: "Payment Request Sent",
        description: response.instructions,
      });

      mpesaForm.reset();
    } catch (error) {
      handleSupabaseError(error, "M-Pesa payment");
    }
  };

  const handleCardPayment = async (data: PaymentFormData) => {
    try {
      const response = await withRetry(
        async () => {
          const { data: response, error } = await supabase.functions.invoke('paystack-payment', {
            body: {
              email: data.email,
              amount: Math.round(data.amount * 100),
              metadata: {
                description: "AfyaAlert Service Payment",
                payment_method: "card"
              }
            }
          });
          if (error) throw error;
          return response;
        },
        {
          maxRetries: 2,
          onRetry: (attempt) => {
            console.log(`Retrying Paystack payment (attempt ${attempt})...`);
          }
        }
      );

      if (response?.authorization_url) {
        window.open(response.authorization_url, '_blank');
        toast({
          title: "Redirecting to Secure Checkout",
          description: "Complete your payment in the new tab.",
        });
        cardForm.reset();
      } else {
        throw new Error("Failed to create payment session");
      }
    } catch (error) {
      handleSupabaseError(error, "card payment");
    }
  };

  const contactMethods = [
    {
      icon: Mail,
      title: "Email Us",
      description: "Send us an email anytime",
      contact: "nakhaimaisaac068@gmail.com",
      action: "mailto:nakhaimaisaac068@gmail.com",
    },
    {
      icon: Phone,
      title: "Call Us - Main",
      description: "Primary contact number",
      contact: "0718098165",
      action: "tel:0718098165",
    },
    {
      icon: Phone,
      title: "Call Us - Alt 1",
      description: "Alternative contact number",
      contact: "0795077642",
      action: "tel:0795077642",
    },
    {
      icon: Phone,
      title: "Call Us - Alt 2", 
      description: "Alternative contact number",
      contact: "0742441936",
      action: "tel:0742441936",
    },
    {
      icon: MapPin,
      title: "Visit Us",
      description: "Our office location",
      contact: "Nairobi, Kenya",
      action: "#",
    },
  ];

  const faqs = [
    {
      icon: HelpCircle,
      question: "How do I search for medicines?",
      answer: "Use our search page to enter the medicine name and select your location to find the best prices and availability.",
    },
    {
      icon: Building2,
      question: "How can my pharmacy join?",
      answer: "Visit our Partner Pharmacies page and click 'Join as a Partner Pharmacy' to submit your application.",
    },
    {
      icon: MessageCircle,
      question: "Is the service free?",
      answer: "Yes! AfyaAlert is completely free for patients searching for medicines. We earn through pharmacy partnerships.",
    },
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
          <h1 className="text-3xl font-bold lg:text-4xl">Contact Us</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We're here to help! Reach out with any questions, feedback, or partnership inquiries.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="shadow-elevated">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Send className="mr-2 h-5 w-5" />
                  Send us a Message
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...contactForm}>
                  <form onSubmit={contactForm.handleSubmit(handleSubmit)} className="space-y-6">
                    <FormField
                      control={contactForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Your full name"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={contactForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address *</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="your.email@example.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={contactForm.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message *</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Tell us how we can help you..."
                              rows={5}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="bg-accent/50 p-4 rounded-lg">
                      <p className="text-sm">
                        <strong>Response Time:</strong> We typically respond within 24 hours during business days. 
                        For urgent pharmacy-related issues, please call us directly.
                      </p>
                    </div>

                    <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                      <Send className="mr-2 h-4 w-4" />
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Information & FAQs */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-8"
          >
            {/* Contact Methods */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Get in Touch</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {contactMethods.map((method, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-primary">
                      <method.icon className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{method.title}</h3>
                      <p className="text-sm text-muted-foreground mb-1">
                        {method.description}
                      </p>
                      <a
                        href={method.action}
                        className="text-sm font-medium text-primary hover:underline"
                      >
                        {method.contact}
                      </a>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* FAQ Section */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {faqs.map((faq, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-start space-x-3">
                      <faq.icon className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-sm">{faq.question}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                    {index < faqs.length - 1 && <hr className="border-muted" />}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* M-Pesa Payment */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="mr-2 h-5 w-5" />
                  M-Pesa Payment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Make payments directly to our M-Pesa: <span className="font-semibold">0718098165</span>
                </p>
                <Form {...mpesaForm}>
                  <form onSubmit={mpesaForm.handleSubmit(handleMpesaPayment)} className="space-y-3">
                    <FormField
                      control={mpesaForm.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Amount (KES)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Enter amount"
                              min="1"
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={mpesaForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your Phone Number</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="07XXXXXXXX"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit" className="w-full">
                      <CreditCard className="mr-2 h-4 w-4" />
                      Pay via M-Pesa
                    </Button>
                  </form>
                </Form>
                <div className="mt-4 p-3 bg-accent/50 rounded-lg">
                  <p className="text-xs text-muted-foreground">
                    You will receive an M-Pesa prompt on your phone to complete the payment.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Card Payment */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="mr-2 h-5 w-5" />
                  Card Payment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Pay securely with your card via Paystack.
                </p>
                <Form {...cardForm}>
                  <form onSubmit={cardForm.handleSubmit(handleCardPayment)} className="space-y-3">
                    <FormField
                      control={cardForm.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Amount (KES)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Enter amount"
                              min="1"
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={cardForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="your@email.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit" className="w-full">
                      <CreditCard className="mr-2 h-4 w-4" />
                      Pay via Card
                    </Button>
                  </form>
                </Form>
                <div className="mt-4 p-3 bg-accent/50 rounded-lg">
                  <p className="text-xs text-muted-foreground">
                    Secure payment processing via Paystack. You'll be redirected to complete your payment.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;