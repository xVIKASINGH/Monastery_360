"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

type Stats = {
  totalMonasteries: number;
  virtualTours: number;
  archives: number;
  upcomingEvents: number;
  monthlyVisitors: number[]; // last 12 months
};

const mockStats: Stats = {
  totalMonasteries: 214,
  virtualTours: 82,
  archives: 1470,
  upcomingEvents: 5,
  monthlyVisitors: [120, 150, 180, 210, 300, 500, 450, 400, 380, 420, 480, 520],
};

export default function TestingDashboard() {
  const stats = mockStats;

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold">Monastery360 — Testing Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Digitize and showcase monasteries of Sikkim — simple stats page for QA & testing</p>
        </div>
        <div className="flex items-center gap-3">
          <Input placeholder="Search monastery, location or id..." className="max-w-sm" />
          <Button>Search</Button>
        </div>
      </header>

      <main className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Summary cards */}
        <Card>
          <CardHeader>
            <CardTitle>Total Monasteries</CardTitle>
            <CardDescription>Monasteries recorded in the project</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-4xl font-bold">{stats.totalMonasteries}</div>
                <div className="text-sm text-muted-foreground">Verified & unverified entries</div>
              </div>
              <div>
                <Badge>Live</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Virtual Tours</CardTitle>
            <CardDescription>360° panoramas available</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-4xl font-bold">{stats.virtualTours}</div>
                <div className="text-sm text-muted-foreground">Tours with narration & hotspots</div>
              </div>
              <div>
                <Button variant="outline">Run tour QA</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Digital Archives</CardTitle>
            <CardDescription>Scanned manuscripts and murals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-4xl font-bold">{stats.archives}</div>
                <div className="text-sm text-muted-foreground">Items in the archive</div>
              </div>
              <div>
                <Button variant="ghost">Open Archive</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <section className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Monthly Visitors (last 12 months)</CardTitle>
            <CardDescription>Basic sparkline for quick testing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-40 w-full flex items-center justify-center">
              <svg viewBox="0 0 120 40" className="w-full h-full">
                <polyline
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  points={stats.monthlyVisitors
                    .map((v, i) => {
                      const x = (i / (stats.monthlyVisitors.length - 1)) * 120;
                      const max = Math.max(...stats.monthlyVisitors);
                      const min = Math.min(...stats.monthlyVisitors);
                      const normalized = (v - min) / (max - min || 1);
                      const y = 40 - normalized * 36; // padding
                      return `${x},${y}`;
                    })
                    .join(" ")}
                />
              </svg>
            </div>
            <div className="mt-4 flex justify-between text-sm text-muted-foreground">
              <div>Peak: {Math.max(...stats.monthlyVisitors)}</div>
              <div>Average: {Math.round(stats.monthlyVisitors.reduce((a, b) => a + b, 0) / stats.monthlyVisitors.length)}</div>
              <div>Events: {stats.upcomingEvents}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Testing utilities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              <Button onClick={() => alert("Triggering data sync (mock)...")}>Sync data (mock)</Button>
              <Button variant="outline" onClick={() => alert("Exporting sample report (mock)...")}>
                Export report
              </Button>
              <Button variant="ghost" onClick={() => alert("Clear cache (mock)...")}>
                Clear cache
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Map / Locations (Placeholder)</CardTitle>
            <CardDescription>Geo-tagged monasteries for QA</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-60 w-full rounded-md bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center text-sm text-muted-foreground">
              Map placeholder — integrate a map library (Leaflet / Mapbox / Google) in real app
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Uploads</CardTitle>
            <CardDescription>Latest media / scans</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-3">
              <li className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Rongbuk Monastery - Hall Panorama</div>
                  <div className="text-xs text-muted-foreground">Uploaded 2 hours ago</div>
                </div>
                <Badge>360°</Badge>
              </li>
              <li className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Handwritten Sutra (page 12)</div>
                  <div className="text-xs text-muted-foreground">Uploaded 1 day ago</div>
                </div>
                <Badge>Archive</Badge>
              </li>
              <li className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Festival poster: Losar 2026</div>
                  <div className="text-xs text-muted-foreground">Uploaded 3 days ago</div>
                </div>
                <Badge>Event</Badge>
              </li>
            </ul>
          </CardContent>
        </Card>
      </section>

      <footer className="mt-8 text-center text-sm text-muted-foreground">
        Monastery360 — testing dashboard • mock data only • build UI and wire to real APIs for production
      </footer>
    </div>
  );
}
