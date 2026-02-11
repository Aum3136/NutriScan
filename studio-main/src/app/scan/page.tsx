"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Camera, FileImage, Loader2, Send } from "lucide-react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useHistoryStore } from "@/store/history";
import { analyzeImage } from "@/lib/actions";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const formSchema = z.object({
  image: z
    .custom<FileList>()
    .refine((files) => files?.length > 0, "An image is required.")
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      ".jpg, .jpeg, .png and .webp files are accepted."
    ),
});

type FormValues = z.infer<typeof formSchema>;

export default function ScanPage() {
  const router = useRouter();
  const { toast } = useToast();
  const addScan = useHistoryStore((state) => state.addScan);
  const [preview, setPreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const { register, handleSubmit, formState: { errors }, watch } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const imageFile = watch("image");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit: SubmitHandler<FormValues> = async () => {
    if (!preview) {
      toast({
        title: "Error",
        description: "No image to analyze.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const result = await analyzeImage(preview);
      if (result.error) {
        throw new Error(result.error);
      }
      if (result.scan) {
        addScan(result.scan);
        router.push(`/analysis/${result.scan.id}`);
      }
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="container mx-auto max-w-2xl py-12">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Scan Your Food
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex justify-center">
              <label htmlFor="image-upload" className="group relative cursor-pointer">
                <div className="w-64 h-64 md:w-80 md:h-80 rounded-full border-4 border-dashed border-primary/50 flex flex-col items-center justify-center transition-colors group-hover:border-primary group-hover:bg-primary/10">
                  {preview ? (
                    <Image
                      src={preview}
                      alt="Food preview"
                      width={320}
                      height={320}
                      className="rounded-full object-cover w-full h-full"
                    />
                  ) : (
                    <>
                      <Camera className="h-16 w-16 text-primary/70 transition-colors group-hover:text-primary" />
                      <p className="mt-2 text-sm text-muted-foreground">Tap to upload an image</p>
                    </>
                  )}
                </div>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  {...register("image", { onChange: handleFileChange })}
                />
              </label>
            </div>

            {errors.image && (
              <p className="text-center text-sm text-destructive">{typeof errors.image.message === 'string' && errors.image.message}</p>
            )}

            <div className="flex justify-center">
              {preview ? (
                <Button type="submit" size="lg" disabled={isAnalyzing}>
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-5 w-5" />
                      Analyze Image
                    </>
                  )}
                </Button>
              ) : (
                <Button type="button" size="lg" onClick={() => document.getElementById('image-upload')?.click()}>
                  <FileImage className="mr-2 h-5 w-5" />
                  Select Image
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
