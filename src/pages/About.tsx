import { Heart, Shield, Users, Target, Award, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

const About = () => {
  const values = [
    {
      icon: Heart,
      title: "Healthcare Access",
      description: "We believe everyone deserves access to affordable, quality healthcare and medicines.",
    },
    {
      icon: Shield,
      title: "Transparency",
      description: "Clear, honest pricing and verified pharmacy information you can trust.",
    },
    {
      icon: Users,
      title: "Community First",
      description: "Built by Kenyans for Kenyans, understanding local healthcare challenges.",
    },
  ];

  const milestones = [
    {
      year: "2024",
      title: "Platform Launch",
      description: "AfyaAlert goes live with 50+ verified pharmacies",
    },
    {
      year: "2024",
      title: "Nationwide Expansion",
      description: "Coverage extended to all 47 counties in Kenya",
    },
    {
      year: "2024",
      title: "Mobile App",
      description: "Mobile application for easier access on the go",
    },
    {
      year: "Future",
      title: "Regional Growth",
      description: "Expansion to neighboring East African countries",
    },
  ];

  const impacts = [
    { label: "Average Savings", value: "30%", description: "on medicine costs" },
    { label: "Time Saved", value: "2 hours", description: "per pharmacy search" },
    { label: "Pharmacies Verified", value: "500+", description: "across Kenya" },
    { label: "Users Helped", value: "50K+", description: "find medicines" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-6 max-w-4xl mx-auto"
          >
            <h1 className="text-4xl font-bold lg:text-5xl">
              About{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                AfyaAlert
              </span>
            </h1>
            <p className="text-xl text-muted-foreground">
              We're on a mission to make healthcare accessible and affordable for every Kenyan 
              through transparent medicine pricing and verified pharmacy networks.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 gap-12 lg:grid-cols-2 items-center"
          >
            <div className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold">Our Mission</h2>
                <p className="text-lg text-muted-foreground">
                  To eliminate the guesswork in finding affordable medicines by providing 
                  real-time pricing information and connecting Kenyans with verified pharmacies 
                  in their area.
                </p>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">The Problem We Solve</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Medicine prices vary significantly across pharmacies
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Lack of transparency in pharmaceutical pricing
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Difficulty finding medicine availability in real-time
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Limited trust in pharmacy verification
                  </li>
                </ul>
              </div>
            </div>

            <div className="relative">
              <Card className="shadow-elevated">
                <CardContent className="p-8">
                  <div className="text-center space-y-4">
                    <Target className="h-16 w-16 mx-auto text-primary" />
                    <h3 className="text-2xl font-bold">Our Vision</h3>
                    <p className="text-muted-foreground">
                      A Kenya where everyone has access to transparent, affordable healthcare 
                      information and can make informed decisions about their medicine purchases.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-12"
          >
            <div className="space-y-4">
              <h2 className="text-3xl font-bold">Our Values</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                The principles that guide everything we do
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {values.map((value, index) => (
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
                        <value.icon className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <h3 className="text-xl font-semibold">{value.title}</h3>
                      <p className="text-muted-foreground">{value.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-12"
          >
            <div className="space-y-4">
              <h2 className="text-3xl font-bold">Our Impact</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Real results that matter to real people
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
              {impacts.map((impact, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center"
                >
                  <Card className="shadow-card">
                    <CardContent className="p-6">
                      <div className="text-3xl font-bold text-primary lg:text-4xl">
                        {impact.value}
                      </div>
                      <div className="text-sm font-medium">{impact.label}</div>
                      <div className="text-xs text-muted-foreground">{impact.description}</div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-12"
          >
            <div className="space-y-4">
              <h2 className="text-3xl font-bold">Our Journey</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Key milestones in our mission to transform healthcare access in Kenya
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="space-y-8">
                {milestones.map((milestone, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className={`flex items-center gap-6 ${
                      index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                    }`}
                  >
                    <div className="flex-1">
                      <Card className="shadow-card">
                        <CardContent className="p-6">
                          <div className="space-y-2">
                            <div className="text-sm font-semibold text-primary">
                              {milestone.year}
                            </div>
                            <h3 className="text-lg font-semibold">{milestone.title}</h3>
                            <p className="text-muted-foreground">{milestone.description}</p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    <div className="hidden md:flex h-12 w-12 items-center justify-center rounded-full bg-gradient-primary flex-shrink-0">
                      <Award className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div className="flex-1 hidden md:block" />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-12"
          >
            <div className="space-y-4">
              <h2 className="text-3xl font-bold">Our Commitment</h2>
              <div className="max-w-3xl mx-auto space-y-6">
                <p className="text-lg text-muted-foreground">
                  AfyaAlert is more than just a platform—it's a commitment to every Kenyan's 
                  right to accessible healthcare. We work closely with the Pharmacy and Poisons 
                  Board to ensure all our partner pharmacies meet the highest standards.
                </p>
                <p className="text-lg text-muted-foreground">
                  Together, we're building a more transparent, efficient, and equitable 
                  healthcare system for Kenya.
                </p>
              </div>
            </div>

            <Card className="max-w-2xl mx-auto shadow-elevated">
              <CardContent className="p-8 text-center space-y-4">
                <TrendingUp className="h-12 w-12 mx-auto text-primary" />
                <h3 className="text-xl font-semibold">Join Our Mission</h3>
                <p className="text-muted-foreground">
                  Whether you're a pharmacy owner, healthcare professional, or someone who 
                  believes in accessible healthcare, there's a place for you in the AfyaAlert community.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;