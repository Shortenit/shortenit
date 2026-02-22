"use client";

import { Card } from "@/components/ui/card";

interface MetricsProps {
  totalLinks: number;
  totalClicks: number;
  averageClicks: number;
  topLink: {
    shortCode: string;
    clicks: number;
  } | null;
}

export default function AnalyticsMetrics({
  totalLinks,
  totalClicks,
  averageClicks,
  topLink,
}: MetricsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="p-6">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Total Links</p>
          <p className="text-3xl font-bold">{totalLinks}</p>
        </div>
      </Card>

      <Card className="p-6">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Total Clicks</p>
          <p className="text-3xl font-bold">{totalClicks}</p>
        </div>
      </Card>

      <Card className="p-6">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Avg Clicks/Link</p>
          <p className="text-3xl font-bold">{averageClicks.toFixed(1)}</p>
        </div>
      </Card>

      <Card className="p-6">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Top Link</p>
          <p className="text-xl font-bold truncate">
            {topLink?.shortCode || "-"}
          </p>
          <p className="text-sm text-muted-foreground">
            {topLink?.clicks || 0} clicks
          </p>
        </div>
      </Card>
    </div>
  );
}
