import Image from "next/image";
import Link from "next/link";
import { ScanLine, Lightbulb, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { suggestScanTips } from "@/ai/flows/suggest-scan-tips";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

async function QuickTips() {
  try {
    const { tips } = await suggestScanTips();

    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="text-accent" />
            Quick Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc space-y-2 pl-5">
            {tips.map((tip, index) => (
              <li key={index}>{tip}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    );
  } catch (error) {
    console.error("Error fetching scan tips:", error);
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Could not load AI tips</AlertTitle>
        <AlertDescription>
          There was an issue fetching tips from the AI. This usually happens when the
          API key is missing or invalid. Please check your environment variables.
        </AlertDescription>
      </Alert>
    );
  }
}

export default function Home() {
  const heroImage = PlaceHolderImages.find((img) => img.id === "hero-food");

  return (
    <div className="flex flex-1 flex-col">
      <section className="relative w-full overflow-hidden">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:gap-16">
            <div className="flex flex-col justify-center space-y-4 py-12 md:py-24 lg:py-32">
              <div className="space-y-4">
                <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Snap, Analyze, and Track Your Meals
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  NutriSnap makes understanding your food's nutrition as simple as
                  taking a picture. Get instant insights and take control of your diet.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button asChild size="lg" className="font-semibold">
                  <Link href="/scan">
                    <ScanLine className="mr-2 h-5 w-5" />
                    Scan Food Now
                  </Link>
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-center py-12">
              {heroImage && (
                <Image
                  src={heroImage.imageUrl}
                  width={600}
                  height={400}
                  alt={heroImage.description}
                  data-ai-hint={heroImage.imageHint}
                  className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full"
                />
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="w-full bg-secondary/50 py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-2xl">
            <QuickTips />
          </div>
        </div>
      </section>
    </div>
  );
}
