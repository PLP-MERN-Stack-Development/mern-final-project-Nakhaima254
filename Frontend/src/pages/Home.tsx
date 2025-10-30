import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Shield, Users, Clock, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import heroImage from "@/assets/hero-image.jpg";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const features = [
    {
      icon: Shield,
      title: "Verified Pharmacies",
      description: "All partner pharmacies are verified by the Pharmacy and Poisons Board",
    },
    {
      icon: Clock,
      title: "Real-time Availability",
      description: "Get up-to-date information on medicine availability and pricing",
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Built for Kenyans, by Kenyans to improve healthcare access",
    },
  ];

  const stats = [
    { label: "Partner Pharmacies", value: "500+" },
    { label: "Medicines Tracked", value: "10K+" },
    { label: "Cities Covered", value: "47" },
    { label: "Users Served", value: "50K+" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/10">
        <div className="container mx-auto px-4 py-16 lg:py-24">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-8">
            {/* Hero Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col justify-center space-y-8"
            >
              <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                  Find{" "}
                  <span className="bg-gradient-primary bg-clip-text text-transparent">
                    affordable medicines
                  </span>{" "}
                  near you
                </h1>
                <p className="text-xl text-muted-foreground max-w-lg">
                  Compare prices, check availability, and locate verified pharmacies 
                  across Kenya. Healthcare transparency at your fingertips.
                </p>
              </div>

              {/* Search Form */}
              <form onSubmit={handleSearch} className="flex space-x-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search for medicines (e.g. Paracetamol, Amoxicillin)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12"
                  />
                </div>
                <Button type="submit" variant="hero" size="lg">
                  Search Now
                </Button>
              </form>

              {/* CTA Buttons */}
              <div className="flex flex-col space-y-3 sm:flex-row sm:space-x-4 sm:space-y-0">
                <Button asChild variant="default" size="lg">
                  <Link to="/auth">
                    Browse Medicines
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/pharmacies">Partner with Us</Link>
                </Button>
              </div>
            </motion.div>

            {/* Hero Image */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-elevated">
                <img
                  src={heroImage}
                  alt="Modern Kenyan pharmacy with digital health technology"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 gap-8 lg:grid-cols-4"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-primary lg:text-4xl">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground lg:text-base">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-4 mb-12"
          >
            <h2 className="text-3xl font-bold lg:text-4xl">
              Why Choose AfyaAlert?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We're committed to making healthcare accessible and transparent for all Kenyans
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full shadow-card hover:shadow-elevated transition-shadow duration-300">
                  <CardContent className="p-6 text-center space-y-4">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-primary">
                      <feature.icon className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-primary">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-primary-foreground lg:text-4xl">
                Join thousands of Kenyans finding affordable medicines
              </h2>
              <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
                Start your search today and discover transparent pricing across verified pharmacies
              </p>
            </div>
            
            <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0 justify-center">
              <Button asChild variant="secondary" size="xl">
                <Link to="/auth">
                  <Search className="mr-2 h-5 w-5" />
                  Start Searching
                </Link>
              </Button>
              <Button asChild variant="default" size="xl" className="bg-primary-foreground text-primary hover:bg-foreground hover:text-background">
                <Link to="/about">Learn More</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;