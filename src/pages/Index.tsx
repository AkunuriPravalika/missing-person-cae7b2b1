import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Shield,
  Upload,
  Search,
  Users,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Eye,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ModelStatus from "@/components/ModelStatus";
import { getAllPersons } from "@/lib/database";

const Index = () => {
  const persons = getAllPersons();
  const missing = persons.filter((p) => p.status === "missing").length;
  const found = persons.filter((p) => p.status === "found").length;
  const investigating = persons.filter((p) => p.status === "investigating").length;

  const stats = [
    { label: "Total Cases", value: persons.length, icon: Users, color: "text-primary" },
    { label: "Missing", value: missing, icon: AlertTriangle, color: "text-warning" },
    { label: "Found", value: found, icon: CheckCircle2, color: "text-accent" },
    { label: "Investigating", value: investigating, icon: Eye, color: "text-info" },
  ];

  const actions = [
    {
      to: "/register",
      icon: Upload,
      title: "Register Missing Person",
      desc: "Upload photo and details to the database",
    },
    {
      to: "/search",
      icon: Search,
      title: "Face Search",
      desc: "Match a photo against the database",
    },
    {
      to: "/database",
      icon: Users,
      title: "View Database",
      desc: "Browse all registered cases",
    },
  ];

  return (
    <div className="container px-4 py-8 space-y-8">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20">
          <Activity className="w-3 h-3 text-primary" />
          <span className="text-xs font-mono-tech text-primary tracking-widest">
            SYSTEM ONLINE
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          Smart Missing Person
          <br />
          <span className="text-gradient-primary">Detection System</span>
        </h1>
        <p className="text-muted-foreground max-w-lg mx-auto">
          AI-powered face detection and matching to help locate missing persons
          faster and more accurately.
        </p>
        <ModelStatus />
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {stats.map((stat) => (
          <Card key={stat.label} className="bg-card border-border">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded bg-secondary flex items-center justify-center">
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold font-mono-tech">{stat.value}</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  {stat.label}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="grid md:grid-cols-3 gap-4"
      >
        {actions.map((action) => (
          <Link key={action.to} to={action.to}>
            <Card className="bg-card border-border hover:border-primary/40 transition-all group cursor-pointer h-full">
              <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                <div className="w-14 h-14 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:glow-primary transition-shadow">
                  <action.icon className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{action.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {action.desc}
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </motion.div>

      {/* How it works */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              How It Works
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-6 gap-3">
              {[
                "Upload Image",
                "Detect Face",
                "Extract Features",
                "Store in DB",
                "Compare Faces",
                "Show Match",
              ].map((step, i) => (
                <div
                  key={step}
                  className="flex flex-col items-center text-center gap-2"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center font-mono-tech text-sm text-primary font-bold">
                    {i + 1}
                  </div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Index;
