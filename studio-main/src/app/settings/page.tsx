"use client";

import { useEffect, useState } from "react";
import { Moon, Sun, Cog, Info, Weight, TestTube } from "lucide-react";
import { useTheme } from "next-themes";
import { useSettingsStore } from "@/store/settings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { units, setUnits } = useSettingsStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; // or a skeleton loader
  }

  return (
    <div className="container mx-auto max-w-2xl py-12">
      <div className="mb-8">
        <h1 className="font-headline text-3xl font-bold flex items-center gap-2">
          <Cog className="h-8 w-8 text-primary" />
          Settings
        </h1>
      </div>
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <Label htmlFor="dark-mode" className="flex items-center gap-2">
                {theme === 'dark' ? <Moon /> : <Sun />}
                Dark Mode
              </Label>
              <Switch
                id="dark-mode"
                checked={theme === 'dark'}
                onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Weight className="h-5 w-5" />
              Units
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              defaultValue={units}
              onValueChange={(value) => setUnits(value as 'grams' | 'ounces')}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="grams" id="grams" />
                <Label htmlFor="grams">Grams (g)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="ounces" id="ounces" />
                <Label htmlFor="ounces">Ounces (oz)</Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              About NutriSnap
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger>What is NutriSnap?</AccordionTrigger>
                <AccordionContent>
                  NutriSnap is a smart food image analysis app that helps you understand the nutritional content of your meals. Just snap a photo, and get instant insights!
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>How does it work?</AccordionTrigger>
                <AccordionContent>
                  We use advanced AI to identify food items from your images. Once identified, we provide an estimated nutritional breakdown to help you make informed dietary choices.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Version</AccordionTrigger>
                <AccordionContent>
                  You are using NutriSnap version 1.0.0.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
