import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Search, Loader2, CheckCircle2, XCircle, Brain } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import ImageUpload from "@/components/ImageUpload";
import { getAllPersons } from "@/lib/database";
import { detectFace, compareFaces, distanceToSimilarity, loadModels } from "@/lib/faceDetection";
import { MatchResult } from "@/lib/types";

const MATCH_THRESHOLD = 55;

export default function SearchPage() {
  const [imageDataUrl, setImageDataUrl] = useState("");
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<MatchResult[] | null>(null);

  const handleSearch = async () => {
    if (!imageDataUrl) {
      toast.error("Please upload an image to search");
      return;
    }

    setSearching(true);
    setResults(null);

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
      if (!descriptor) {
        toast.error("No face detected in the uploaded image");
        setSearching(false);
        return;
      }

      const persons = getAllPersons().filter((p) => p.faceDescriptor);
      if (persons.length === 0) {
        toast.warning("No persons with face data in database");
        setSearching(false);
        return;
      }

      const matches: MatchResult[] = persons
        .map((person) => {
          const distance = compareFaces(descriptor, person.faceDescriptor!);
          const similarity = distanceToSimilarity(distance);
          return { person, distance, similarity };
        })
        .filter((m) => m.similarity >= MATCH_THRESHOLD)
        .sort((a, b) => b.similarity - a.similarity);

      setResults(matches);

      if (matches.length > 0) {
        toast.success("Match found!");
      } else {
        toast.info("Not Match");
      }
    } catch (err) {
      toast.error("Error during face search");
      console.error(err);
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="container px-4 py-8 max-w-3xl space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Search className="w-5 h-5 text-primary" />
              Face Match
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ImageUpload
              onImageSelected={setImageDataUrl}
              currentImage={imageDataUrl || null}
              label="Upload Image to Match"
            />
            <Button
              onClick={handleSearch}
              disabled={searching || !imageDataUrl}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {searching ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Analyzing Face...</>
              ) : (
                <><Brain className="w-4 h-4 mr-2" />Search Database</>
              )}
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      <AnimatePresence>
        {results !== null && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {results.length === 0 ? (
              <Card className="bg-card border-border">
                <CardContent className="p-8 text-center space-y-3">
                  <XCircle className="w-12 h-12 text-destructive mx-auto" />
                  <h3 className="text-2xl font-bold text-destructive">Not Match</h3>
                  <p className="text-sm text-muted-foreground">
                    The uploaded face did not match any records in the database.
                  </p>
                </CardContent>
              </Card>
            ) : (
              results.map((match, i) => (
                <motion.div
                  key={match.person.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="border border-accent">
                    <CardContent className="p-4 flex gap-4">
                      <img
                        src={match.person.imageDataUrl}
                        alt={match.person.name}
                        className="w-24 h-24 rounded object-cover border border-border"
                      />
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-lg">{match.person.name}</h3>
                          <div className="flex items-center gap-1 px-3 py-1 rounded bg-accent/15 text-accent text-sm font-bold">
                            <CheckCircle2 className="w-4 h-4" />
                            Match — {match.similarity.toFixed(1)}%
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground space-y-0.5">
                          <p>Age: {match.person.age} | Gender: {match.person.gender} | Blood: {match.person.bloodGroup || "N/A"}</p>
                          <p>Height: {match.person.height || "N/A"} | Weight: {match.person.weight || "N/A"}</p>
                          <p>Last Seen: {match.person.lastSeen || "N/A"} ({match.person.lastSeenDate || "N/A"})</p>
                          <p>Status: <span className="uppercase font-semibold">{match.person.status}</span></p>
                        </div>
                        <Progress value={match.similarity} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
