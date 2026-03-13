import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Save, Loader2, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ImageUpload from "@/components/ImageUpload";
import { addPerson } from "@/lib/database";
import { detectFace, loadModels } from "@/lib/faceDetection";
import { MissingPerson } from "@/lib/types";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [imageDataUrl, setImageDataUrl] = useState<string>("");
  const [processing, setProcessing] = useState(false);
  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "male",
    lastSeen: "",
    lastSeenDate: "",
    description: "",
    contactInfo: "",
    bloodGroup: "",
    height: "",
    weight: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageDataUrl) {
      toast.error("Please upload an image");
      return;
    }
    if (!form.name || !form.age) {
      toast.error("Please fill in required fields");
      return;
    }

    setProcessing(true);
    try {
      await loadModels();

      const img = new Image();
      img.crossOrigin = "anonymous";
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = reject;
        img.src = imageDataUrl;
      });

      const descriptor = await detectFace(img);

      const person: MissingPerson = {
        id: crypto.randomUUID(),
        name: form.name,
        age: parseInt(form.age),
        gender: form.gender,
        lastSeen: form.lastSeen,
        lastSeenDate: form.lastSeenDate,
        description: form.description,
        imageDataUrl,
        faceDescriptor: descriptor ? Array.from(descriptor) : null,
        dateReported: new Date().toISOString(),
        status: "missing",
        contactInfo: form.contactInfo,
        bloodGroup: form.bloodGroup,
        height: form.height,
        weight: form.weight,
      };

      addPerson(person);

      if (!descriptor) {
        toast.warning("Person reported but no face was detected. Face matching may not work.");
      } else {
        toast.success("Missing person reported successfully with face data!");
      }

      navigate("/database");
    } catch (err) {
      toast.error("Error processing image");
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  const fieldClass = "bg-input border-border";
  const labelClass = "text-sm font-semibold text-muted-foreground uppercase tracking-wide";

  return (
    <div className="container px-4 py-8 max-w-2xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Report Missing Person
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <ImageUpload
                onImageSelected={setImageDataUrl}
                currentImage={imageDataUrl || null}
                label="Person's Photo"
              />

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className={labelClass}>Full Name *</label>
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Enter full name" className={fieldClass} />
                </div>
                <div className="space-y-1.5">
                  <label className={labelClass}>Age *</label>
                  <Input type="number" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} placeholder="Age" className={fieldClass} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className={labelClass}>Gender</label>
                  <Select value={form.gender} onValueChange={(v) => setForm({ ...form, gender: v })}>
                    <SelectTrigger className={fieldClass}><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <label className={labelClass}>Blood Group</label>
                  <Select value={form.bloodGroup} onValueChange={(v) => setForm({ ...form, bloodGroup: v })}>
                    <SelectTrigger className={fieldClass}><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      {["A+","A-","B+","B-","AB+","AB-","O+","O-"].map(bg => (
                        <SelectItem key={bg} value={bg}>{bg}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className={labelClass}>Height</label>
                  <Input value={form.height} onChange={(e) => setForm({ ...form, height: e.target.value })} placeholder="e.g. 170 cm" className={fieldClass} />
                </div>
                <div className="space-y-1.5">
                  <label className={labelClass}>Weight</label>
                  <Input value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} placeholder="e.g. 65 kg" className={fieldClass} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className={labelClass}>Last Seen Location</label>
                  <Input value={form.lastSeen} onChange={(e) => setForm({ ...form, lastSeen: e.target.value })} placeholder="Location" className={fieldClass} />
                </div>
                <div className="space-y-1.5">
                  <label className={labelClass}>Last Seen Date</label>
                  <Input type="date" value={form.lastSeenDate} onChange={(e) => setForm({ ...form, lastSeenDate: e.target.value })} className={fieldClass} />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className={labelClass}>Contact Information</label>
                <Input value={form.contactInfo} onChange={(e) => setForm({ ...form, contactInfo: e.target.value })} placeholder="Phone or email" className={fieldClass} />
              </div>

              <div className="space-y-1.5">
                <label className={labelClass}>Description</label>
                <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Physical description, clothing, etc." className={`${fieldClass} min-h-[80px]`} />
              </div>

              <Button type="submit" disabled={processing} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                {processing ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Processing...</>
                ) : (
                  <><Save className="w-4 h-4 mr-2" />Submit</>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
