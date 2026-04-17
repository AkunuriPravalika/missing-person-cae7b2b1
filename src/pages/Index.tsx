import { motion } from "framer-motion";
import {
  Users,
  AlertTriangle,
  CheckCircle2,
  Eye,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { getAllPersons } from "@/lib/database";

const Index = () => {
  const persons = getAllPersons();
  const missing = persons.filter((p) => p.status === "missing").length;
  const found = persons.filter((p) => p.status === "found").length;
  const investigating = persons.filter((p) => p.status === "investigating").length;

  const stats = [
    { label: "Total Reports", value: persons.length, icon: Users, color: "text-primary" },
    { label: "Missing", value: missing, icon: AlertTriangle, color: "text-warning" },
    { label: "Found", value: found, icon: CheckCircle2, color: "text-accent" },
    { label: "Investigating", value: investigating, icon: Eye, color: "text-info" },
  ];

  return (
    <div className="container px-4 py-8 space-y-8">
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

    </div>
  );
};

export default Index;
