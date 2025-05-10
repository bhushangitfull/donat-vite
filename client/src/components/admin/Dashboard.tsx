import { useState } from "react";
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import EventForm from './EventForm';
import { useQuery } from "@tanstack/react-query";
import NewsForm from './NewsForm';
import MenuForm from './MenuForm';
import {
  Calendar,
  Newspaper,
  Settings,
  Menu,
  LayoutDashboard,
  LogOut,
  User,
} from "lucide-react";
import {
  getEventsCount,
  getNewsPostsCount,
  getSubscribersCount,
} from "@/lib/firebase";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { user, logout } = useAuth();
  const { toast } = useToast();

  const {
    data: eventsCountData,
  } = useQuery({ queryKey: ["eventsCount"], queryFn: getEventsCount });
  const [, setLocation] = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      setLocation('/admin');
      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
      });
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const {
    data: newsCountData,
    isError: newsError,
    isLoading: newsLoading,
  } = useQuery({ queryKey: ["newsCount"], queryFn: getNewsPostsCount });

  const {
    data: subscribersCountData,
    isError: subscribersError,
    isLoading: subscribersLoading,
  } = useQuery({ queryKey: ["subscribersCount"], queryFn: getSubscribersCount });

  const stats = [
    {
      title: "Total Events",
      value: eventsCountData,
      icon: <Calendar className="h-6 w-6 text-blue-500" />,
    },
    {
      title: "Published Articles",
      value: newsLoading
        ? "..."
        : newsError
          ? "Error"
          : newsCountData,
      icon: <Newspaper className="h-6 w-6 text-green-500" />,
    },
    { title: "Subscribers", value: subscribersLoading ? "..." : subscribersError ? "Error" : subscribersCountData, icon: <User className="h-6 w-6 text-purple-500" /> },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-700">
              {user?.email}
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="hidden md:flex md:flex-col md:w-64 md:border-r bg-gray-50">
          <div className="flex flex-col flex-grow pt-5 overflow-y-auto">
            <div className="flex-grow flex flex-col">
              <nav className="flex-1 px-2 space-y-1">
                <Button
                  variant={activeTab === "overview" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("overview")}
                >
                  <LayoutDashboard className="h-5 w-5 mr-2" />
                  Overview
                </Button>
                <Button
                  variant={activeTab === "events" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("events")}
                >
                  <Calendar className="h-5 w-5 mr-2" />
                  Events
                </Button>
                <Button
                  variant={activeTab === "news" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("news")}
                >
                  <Newspaper className="h-5 w-5 mr-2" />
                  News
                </Button>
                <Button
                  variant={activeTab === "menu" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("menu")}
                >
                  <Menu className="h-5 w-5 mr-2" />
                  Menu
                </Button>
              </nav>
              <div className="text-sm text-gray-700">
              {user?.email}
            </div>
            </div>
          </div>
        </div>

        {/* Mobile tabs for smaller screens */}
        <div className="md:hidden w-full border-b bg-white px-4">
          <Tabs
            defaultValue="overview"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="overview" className="flex flex-col items-center space-x-0">
                <LayoutDashboard className="h-5 w-5" />
                <span className="text-xs">Overview</span>
              </TabsTrigger>
              <TabsTrigger value="events" className="flex flex-col items-center space-x-0">
                <Calendar className="h-5 w-5" />
                <span className="text-xs">Events</span>
              </TabsTrigger>
              <TabsTrigger value="news" className="flex flex-col items-center space-x-0">
                <Newspaper className="h-5 w-5" />
                <span className="text-xs">News</span>
              </TabsTrigger>
              <TabsTrigger value="menu" className="flex flex-col items-center space-x-0">
                <Menu className="h-5 w-5" />
                <span className="text-xs">Menu</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-100">
        {activeTab === 'overview' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Dashboard Overview
              </h2>

              {/* Stats cards */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, index) => (
                  <Card key={index}>
                    <CardContent className="p-6 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                        <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-full">{stat.icon}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Quick actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button onClick={() => setActiveTab('events')}>
                      <Calendar className="h-5 w-5 mr-2" />
                      Add New Event
                    </Button>
                    <Button onClick={() => setActiveTab('news')}>
                      <Newspaper className="h-5 w-5 mr-2" />
                      Create News Post
                    </Button>
                    <Button onClick={() => setActiveTab('menu')}>
                      <Menu className="h-5 w-5 mr-2" />
                      Edit Navigation
                    </Button>
                  </div>
                </CardContent>
              </Card>
              <div className="md:hidden" >
              {/* View website */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg font-medium">View Your Website</p>
                      <p className="text-sm text-gray-500">
                        See how your changes look on the live site
                      </p>
                    </div>
                    <Link href="/" className="inline-block">
                      <Button variant="outline">Visit Website</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
              </div>
            </div>
          )}
          {activeTab === 'events' && <EventForm />}
          {activeTab === 'news' && <NewsForm />}
          {activeTab === 'menu' && <MenuForm />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;