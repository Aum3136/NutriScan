"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Utensils, Flame, Wheat, Beef, Droplets, Scan, AlertTriangle } from "lucide-react";

import { useHistoryStore } from "@/store/history";
import type { Scan as ScanType } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CircularProgressBar } from "@/components/circular-progress-bar";
import { useSettingsStore } from "@/store/settings";

const portionOptions = [
  { label: "1 Piece", multiplier: 0.5 },
  { label: "1 Bowl / Small Plate", multiplier: 1 },
  { label: "Large Plate", multiplier: 1.5 },
  { label: "Full Meal", multiplier: 2 },
];

export default function AnalysisPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const { scans } = useHistoryStore();
  const { units } = useSettingsStore();

  const [scan, setScan] = useState<ScanType | null>(null);
  const [portionMultiplier, setPortionMultiplier] = useState(1);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const foundScan = scans.find((s) => s.id === id);
    if (foundScan) {
      setScan(foundScan);
    }
  }, [id, scans]);

  const adjustedNutrients = useMemo(() => {
    if (!scan) return null;
    const { nutritionalInfo } = scan;
    const ozMultiplier = units === 'ounces' ? 0.035274 : 1;
    return {
      calories: Math.round(nutritionalInfo.calories * portionMultiplier),
      protein: Math.round(nutritionalInfo.protein * portionMultiplier * ozMultiplier),
      carbs: Math.round(nutritionalInfo.carbs * portionMultiplier * ozMultiplier),
      fats: Math.round(nutritionalInfo.fats * portionMultiplier * ozMultiplier),
    };
  }, [scan, portionMultiplier, units]);

  if (!isMounted) {
    return null; // or a loading skeleton
  }

  if (!scan || !adjustedNutrients) {
    return (
      <div className="container mx-auto flex flex-col items-center justify-center gap-4 py-12 text-center">
        <AlertTriangle className="h-16 w-16 text-destructive" />
        <h1 className="text-2xl font-bold">Scan Not Found</h1>
        <p className="text-muted-foreground">The requested scan could not be found in your history.</p>
        <Button asChild>
          <Link href="/history">Go to History</Link>
        </Button>
      </div>
    );
  }

  const { foodName, imageUrl, nutritionalInfo } = scan;
  const totalMacros = nutritionalInfo.protein + nutritionalInfo.carbs + nutritionalInfo.fats;

  return (
    <div className="container mx-auto max-w-4xl py-12">
      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <Image
                src={imageUrl}
                alt={foodName}
                width={600}
                height={600}
                className="aspect-square w-full rounded-lg object-cover"
              />
            </CardContent>
          </Card>
           <Button asChild className="w-full" size="lg">
              <Link href="/scan">
                <Scan className="mr-2 h-5 w-5" />
                Scan Another Item
              </Link>
            </Button>
        </div>

        <div className="space-y-6">
          <h1 className="font-headline text-4xl font-bold capitalize">{foodName}</h1>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Utensils className="h-5 w-5 text-primary" />
                  Portion Size
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                onValueChange={(val) => setPortionMultiplier(Number(val))}
                defaultValue="1"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select portion size" />
                </SelectTrigger>
                <SelectContent>
                  {portionOptions.map((opt) => (
                    <SelectItem key={opt.label} value={String(opt.multiplier)}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Flame className="h-5 w-5 text-accent" />
                Calories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-5xl font-bold text-accent">{adjustedNutrients.calories}<span className="text-2xl font-medium text-muted-foreground"> kcal</span></p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Macro Nutrients</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-3 gap-4 text-center">
              <div className="flex flex-col items-center gap-2">
                <CircularProgressBar progress={(nutritionalInfo.protein / totalMacros) * 100} color="hsl(var(--chart-2))" />
                <h3 className="font-semibold">Protein</h3>
                <p className="text-lg font-bold">{adjustedNutrients.protein}{units === 'grams' ? 'g' : 'oz'}</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <CircularProgressBar progress={(nutritionalInfo.carbs / totalMacros) * 100} color="hsl(var(--chart-4))"/>
                <h3 className="font-semibold">Carbs</h3>
                <p className="text-lg font-bold">{adjustedNutrients.carbs}{units === 'grams' ? 'g' : 'oz'}</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <CircularProgressBar progress={(nutritionalInfo.fats / totalMacros) * 100} color="hsl(var(--chart-5))"/>
                <h3 className="font-semibold">Fats</h3>
                <p className="text-lg font-bold">{adjustedNutrients.fats}{units === 'grams' ? 'g' : 'oz'}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
