"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { History, Trash2, Inbox, ChevronRight } from "lucide-react";

import { useHistoryStore } from "@/store/history";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";

export default function HistoryPage() {
  const { scans, clearHistory } = useHistoryStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="container mx-auto max-w-3xl py-12">
        <div className="space-y-4">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-3xl py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-headline text-3xl font-bold flex items-center gap-2">
          <History className="h-8 w-8 text-primary" />
          Scan History
        </h1>
        {scans.length > 0 && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Clear History
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  all your scan history.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={clearHistory}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      {scans.length > 0 ? (
        <div className="space-y-4">
          {scans.map((scan) => (
            <Link key={scan.id} href={`/analysis/${scan.id}`} className="block">
              <Card className="hover:border-primary transition-colors">
                <CardContent className="p-4 flex items-center gap-4">
                  <Image
                    src={scan.imageUrl}
                    alt={scan.foodName}
                    width={80}
                    height={80}
                    className="rounded-md object-cover aspect-square"
                  />
                  <div className="flex-1">
                    <h2 className="font-semibold text-lg capitalize">
                      {scan.foodName}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Scanned{" "}
                      {formatDistanceToNow(new Date(scan.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <Inbox className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-2 text-xl font-semibold">No Scans Yet</h3>
          <p className="mt-1 text-muted-foreground">
            Start scanning your food to see your history here.
          </p>
          <div className="mt-6">
            <Button asChild>
              <Link href="/scan">Start Scanning</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
