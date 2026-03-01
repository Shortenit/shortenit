"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, MousePointer2, Link as LinkIcon, Monitor, Globe, Smartphone, Chrome, Calendar, MapPin } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { 
    PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, AreaChart, Area 
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


import { api } from "@/lib/api";
import { AnalyticsData as ApiAnalyticsResponse } from "@/lib/types";

interface AnalyticsViewState {
    shortCode: string;
    originalUrl: string;
    totalClicks: number;
    clicksByCountry: Array<{ country: string; count: number; percentage: number }>;
    clicksByCity: Array<{ city: string; country: string; count: number; percentage: number }>;
    clicksByDevice: Array<{ device: string; count: number; percentage?: number }>;
    clicksByBrowser: Array<{ browser: string; count: number; percentage: number }>;
    clicksByDate: Array<{ date: string; count: number }>;
    clicksByHour: Array<{ hour: string; count: number }>;

}

// Interface matching the new API response structure


const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function LinkAnalytics() {
    const params = useParams();
    const [analytics, setAnalytics] = useState<AnalyticsViewState | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (params.shortCode) {
            fetchAnalytics(params.shortCode as string);
        }
    }, [params.shortCode]);

    const fetchAnalytics = async (code: string) => {
        try {
            const data = await api.analytics.get(code);
            
            // Map API response to Component State Interface
            const mappedData: AnalyticsViewState = {
                shortCode: data.code,
                originalUrl: data.originalUrl,
                totalClicks: data.totalClicks,
                clicksByCountry: data.topCountries?.map(c => ({ 
                    country: c.country, 
                    count: c.clicks,
                    percentage: c.percentage 
                })) || [],
                clicksByCity: data.topCities?.map(c => ({
                    city: c.city,
                    country: c.country,
                    count: c.clicks,
                    percentage: c.percentage
                })) || [],
                clicksByDevice: [
                    { device: 'Mobile', count: data.deviceStats?.mobile || 0, percentage: data.deviceStats?.mobilePercentage },
                    { device: 'Desktop', count: data.deviceStats?.desktop || 0, percentage: data.deviceStats?.desktopPercentage },
                    { device: 'Tablet', count: data.deviceStats?.tablet || 0, percentage: data.deviceStats?.tabletPercentage },
                    { device: 'Unknown', count: data.deviceStats?.unknown || 0, percentage: 0 },
                ].filter(d => d.count > 0),
                clicksByBrowser: data.topBrowsers?.map(b => ({ 
                    browser: b.browser, 
                    count: b.clicks,
                    percentage: b.percentage 
                })) || [],
                clicksByDate: Object.entries(data.clicksByDate || {}).map(([date, count]) => ({
                    date,
                    count
                })).sort((a, b) => a.date.localeCompare(b.date)),
                clicksByHour: Object.entries(data.clicksByHour || {}).map(([hour, count]) => ({
                    hour: `${hour}:00`,
                    count
                })).sort((a, b) => parseInt(a.hour) - parseInt(b.hour)),

            };

            setAnalytics(mappedData);
        } catch (error: any) {
            console.error("Failed to fetch analytics", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center bg-background h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error || !analytics) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-4 h-full bg-background">
                <h1 className="text-2xl font-bold mb-4">{error || "Analytics not found"}</h1>
                <Link href="/analytics">
                    <Button variant="outline">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Analytics
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-auto p-4 md:p-8 bg-background font-sans h-full">
                <div className="max-w-6xl mx-auto space-y-8">
                    <div className="flex items-center justify-between">
                         <div className="flex items-center gap-4">
                            <Link href="/analytics">
                                <Button variant="ghost" size="icon">
                                    <ArrowLeft className="w-4 h-4" />
                                </Button>
                            </Link>
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Link Analytics</h1>
                                <div className="flex items-center gap-2 text-muted-foreground mt-1">
                                    <LinkIcon className="w-3 h-3" />
                                    <span className="text-sm truncate max-w-xs md:max-w-md">{analytics.originalUrl}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-4 mb-2">
                                    <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                                        <MousePointer2 className="w-5 h-5" />
                                    </div>
                                    <span className="text-sm font-medium text-muted-foreground">Total Clicks</span>
                                </div>
                                <div className="text-3xl font-bold">{analytics.totalClicks}</div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-4 mb-2">
                                    <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
                                        <LinkIcon className="w-5 h-5" />
                                    </div>
                                    <span className="text-sm font-medium text-muted-foreground">Short Code</span>
                                </div>
                                <div className="text-3xl font-bold font-mono">{analytics.shortCode}</div>
                            </CardContent>
                        </Card>

                        <Card>
                             <CardContent className="pt-6">
                                <div className="flex items-center gap-4 mb-2">
                                    <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500">
                                        <Monitor className="w-5 h-5" />
                                    </div>
                                    <span className="text-sm font-medium text-muted-foreground">Device Types</span>
                                </div>
                                <div className="text-3xl font-bold">{analytics.clicksByDevice.length}</div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Click Trends Chart */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Calendar className="w-5 h-5" />
                                Click Trends
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Tabs defaultValue="date" className="w-full">
                                <TabsList className="mb-4">
                                    <TabsTrigger value="date">By Date</TabsTrigger>
                                    <TabsTrigger value="hour">By Hour</TabsTrigger>
                                </TabsList>
                                <TabsContent value="date" className="h-[300px]">
                                    {analytics.clicksByDate.length > 0 ? (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={analytics.clicksByDate}>
                                                <defs>
                                                    <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" opacity={0.3} vertical={false} />
                                                <XAxis 
                                                    dataKey="date" 
                                                    tick={{ fontSize: 12 }} 
                                                    tickFormatter={(value) => new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                />
                                                <YAxis allowDecimals={false} />
                                                <Tooltip 
                                                    contentStyle={{ 
                                                        backgroundColor: 'hsl(var(--popover))', 
                                                        borderColor: 'hsl(var(--border))',
                                                        borderRadius: 'var(--radius)',
                                                        color: 'hsl(var(--popover-foreground))'
                                                    }}
                                                    labelFormatter={(value) => new Date(value).toLocaleDateString()}
                                                />
                                                <Area type="monotone" dataKey="count" stroke="#3b82f6" fillOpacity={1} fill="url(#colorClicks)" />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <div className="h-full flex items-center justify-center text-muted-foreground">No data available</div>
                                    )}
                                </TabsContent>
                                <TabsContent value="hour" className="h-[300px]">
                                    {analytics.clicksByHour.length > 0 ? (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={analytics.clicksByHour}>
                                                <CartesianGrid strokeDasharray="3 3" opacity={0.3} vertical={false} />
                                                <XAxis dataKey="hour" tick={{ fontSize: 12 }} />
                                                <YAxis allowDecimals={false} />
                                                <Tooltip 
                                                    cursor={{ fill: 'transparent' }}
                                                    contentStyle={{ 
                                                        backgroundColor: 'hsl(var(--popover))', 
                                                        borderColor: 'hsl(var(--border))',
                                                        borderRadius: 'var(--radius)',
                                                        color: 'hsl(var(--popover-foreground))'
                                                    }}
                                                />
                                                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <div className="h-full flex items-center justify-center text-muted-foreground">No data available</div>
                                    )}
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Smartphone className="w-5 h-5" />
                                    Devices
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[300px] w-full">
                                    {analytics.clicksByDevice.length > 0 ? (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={analytics.clicksByDevice}
                                                    dataKey="count"
                                                    nameKey="device"
                                                    cx="50%"
                                                    cy="50%"
                                                    outerRadius={80}
                                                    label={({ percent }) => `${((percent || 0) * 100).toFixed(0)}%`}
                                                >
                                                    {analytics.clicksByDevice.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip 
                                                    contentStyle={{ 
                                                        backgroundColor: 'hsl(var(--popover))', 
                                                        borderColor: 'hsl(var(--border))',
                                                        borderRadius: 'var(--radius)',
                                                        color: 'hsl(var(--popover-foreground))'
                                                    }} 
                                                />
                                                <Legend />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <div className="h-full flex items-center justify-center text-muted-foreground">No data available</div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Chrome className="w-5 h-5" />
                                    Browsers
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[300px] w-full">
                                    {analytics.clicksByBrowser.length > 0 ? (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={analytics.clicksByBrowser} layout="vertical">
                                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} opacity={0.3} />
                                                <XAxis type="number" allowDecimals={false} />
                                                <YAxis dataKey="browser" type="category" width={100} tick={{ fontSize: 12 }} />
                                                <Tooltip 
                                                    cursor={{ fill: 'transparent' }}
                                                    contentStyle={{ 
                                                        backgroundColor: 'hsl(var(--popover))', 
                                                        borderColor: 'hsl(var(--border))',
                                                        borderRadius: 'var(--radius)',
                                                        color: 'hsl(var(--popover-foreground))'
                                                    }}
                                                />
                                                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} barSize={20} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <div className="h-full flex items-center justify-center text-muted-foreground">No data available</div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <MapPin className="w-5 h-5" />
                                    Top Locations
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {analytics.clicksByCity.length > 0 ? (
                                    <div className="space-y-4">
                                        {analytics.clicksByCity.slice(0, 5).map((city, index) => (
                                            <div key={index} className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-primary" />
                                                    <span className="font-medium">{city.city}, {city.country}</span>
                                                </div>
                                                <div className="flex items-center gap-4 text-sm">
                                                    <span className="text-muted-foreground">{city.count} clicks</span>
                                                    <span className="font-mono">{city.percentage.toFixed(1)}%</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="h-32 flex items-center justify-center text-muted-foreground">No location data available</div>
                                )}
                            </CardContent>
                        </Card>
                    </div>


                </div>
            </div>
    );
}
