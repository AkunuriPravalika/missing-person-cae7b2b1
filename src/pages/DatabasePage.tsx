import { useState } from "react";
import { motion } from "framer-motion";
import { Users, Trash2, AlertTriangle, CheckCircle2, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getAllPersons, deletePerson, updatePersonStatus } from "@/lib/database";
import { MissingPerson } from "@/lib/types";
import { toast } from "sonner";

const statusConfig = {
  missing: { icon: AlertTriangle, label: "Missing", className: "bg-warning/15 text-warning border-warning/30" },
  found: { icon: CheckCircle2, label: "Found", className: "bg-accent/15 text-accent border-accent/30" },
  investigating: { icon: Eye, label: "Investigating", className: "bg-info/15 text-info border-info/30" },
};

export default function DatabasePage() {
  const [persons, setPersons] = useState<MissingPerson[]>(getAllPersons());

  const handleDelete = (id: string) => {
    deletePerson(id);
    setPersons(getAllPersons());
    toast.success("Record deleted");
  };

  const handleStatusChange = (id: string, status: MissingPerson["status"]) => {
    updatePersonStatus(id, status);
    setPersons(getAllPersons());
    toast.success(`Status updated to ${status}`);
  };

  return (
    <div className="container px-4 py-8 space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Users className="w-6 h-6 text-primary" />
            Missing Persons Database
          </h2>
          <span className="text-sm font-mono-tech text-muted-foreground">
            {persons.length} RECORDS
          </span>
        </div>

        {persons.length === 0 ? (
          <Card className="bg-card border-border">
            <CardContent className="p-12 text-center space-y-3">
              <Users className="w-12 h-12 text-muted-foreground mx-auto" />
              <h3 className="text-lg font-bold">No Records</h3>
              <p className="text-sm text-muted-foreground">
                Register a missing person to get started.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {persons.map((person, i) => {
              const sc = statusConfig[person.status];
              return (
                <motion.div
                  key={person.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className="bg-card border-border overflow-hidden">
                    <div className="flex">
                      <img
                        src={person.imageDataUrl}
                        alt={person.name}
                        className="w-32 h-full object-cover border-r border-border"
                      />
                      <CardContent className="p-4 flex-1 space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-bold text-lg leading-tight">{person.name}</h3>
                            <p className="text-xs text-muted-foreground">
                              Age {person.age} · {person.gender}
                            </p>
                          </div>
                          <Badge variant="outline" className={sc.className}>
                            <sc.icon className="w-3 h-3 mr-1" />
                            {sc.label}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Last seen: {person.lastSeen || "N/A"}
                        </p>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {person.description || "No description"}
                        </p>
                        <p className="text-[10px] font-mono-tech text-muted-foreground">
                          Face data: {person.faceDescriptor ? "✓" : "✗"} · Reported:{" "}
                          {new Date(person.dateReported).toLocaleDateString()}
                        </p>
                        <div className="flex gap-1.5 pt-1">
                          {(["missing", "investigating", "found"] as const).map((s) => (
                            <Button
                              key={s}
                              variant={person.status === s ? "default" : "outline"}
                              size="sm"
                              className="text-[10px] h-6 px-2"
                              onClick={() => handleStatusChange(person.id, s)}
                            >
                              {s}
                            </Button>
                          ))}
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-[10px] h-6 px-2 text-destructive border-destructive/30 hover:bg-destructive/10 ml-auto"
                            onClick={() => handleDelete(person.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
}
