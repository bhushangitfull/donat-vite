import { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface DbEvent {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  imageUrl: string | null | undefined;
  createdAt: string;
}

const Events = () => {
  const { toast } = useToast();

  // Fetch events from API
  const { data: events = [], isLoading } = useQuery({
    queryKey: ['/api/events'],
    queryFn: async () => {
      try {
        const response = await apiRequest('GET', '/api/events');
        const fetchedEvents: DbEvent[] = await response.json();
        
        // Sort events by date (ascending)
        const sortedEvents = [...fetchedEvents].sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return dateA.getTime() - dateB.getTime();
        });
        
        // Get only upcoming events (events that haven't happened yet)
        const upcomingEvents = sortedEvents.filter((event) => {
          const eventDate = new Date(event.date);
          return eventDate >= new Date();
        });
        
        // Limit to 3 events for homepage
        return upcomingEvents.slice(0, 3);
      } catch (error) {
        console.error("Error fetching events:", error);
        toast({
          title: "Error loading events",
          description: "Failed to load upcoming events. Please try again later.",
          variant: "destructive",
        });
        return [];
      }
    }
  });

  // Create placeholder events if none are found
  const placeholderEvents: DbEvent[] = [
    {
      id: 1,
      title: "Community Garden Cleanup",
      description: "Help us restore the downtown community garden and prepare for summer planting. Tools and refreshments provided.",
      date: new Date(Date.now() + 86400000 * 7).toISOString(),
      location: "Central Park, Downtown",
      imageUrl: "https://images.unsplash.com/photo-1546015452-af9d0e235665?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      createdAt: new Date().toISOString()
    },
    {
      id: 2,
      title: "Summer Food Drive",
      description: "Help us collect non-perishable food items for local families in need. Drop-off locations throughout the city.",
      date: new Date(Date.now() + 86400000 * 14).toISOString(),
      location: "Multiple Locations",
      imageUrl: "https://images.unsplash.com/photo-1593113630400-ea4288922497?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      createdAt: new Date().toISOString()
    },
    {
      id: 3,
      title: "Hope 5K Charity Run",
      description: "Join our annual charity run to raise funds for youth education programs. All fitness levels welcome.",
      date: new Date(Date.now() + 86400000 * 28).toISOString(),
      location: "Riverview Park",
      imageUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      createdAt: new Date().toISOString()
    }
  ];

  const displayEvents = events.length > 0 ? events : (isLoading ? [] : placeholderEvents);

  const formatEventDate = (dateString: string) => {
    const eventDate = new Date(dateString);
    return format(eventDate, 'MMM d, yyyy');
  };

  return (
    <div id="events" className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Upcoming Events</h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Join us at our events to make a direct impact in the community.
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            // Loading skeletons
            Array(3).fill(0).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardContent className="p-6">
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-6 w-full mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-4" />
                  <div className="flex items-center">
                    <Skeleton className="h-4 w-4 rounded-full mr-3" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-16 ml-auto" />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            displayEvents.map((event) => (
              <Card key={event.id} className="flex flex-col overflow-hidden">
                <div className="flex-shrink-0 h-48">
                  <img 
                    className="h-full w-full object-cover" 
                    src={event.imageUrl || 'https://images.unsplash.com/photo-1546015452-af9d0e235665?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'} 
                    alt={event.title} 
                  />
                </div>
                <CardContent className="flex-1 p-6 flex flex-col justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-primary">
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                        {formatEventDate(event.date)}
                      </Badge>
                    </p>
                    <Link href={`/events/${event.id}`} className="block mt-2">
                      <p className="text-xl font-semibold text-gray-900 hover:text-primary transition-colors">
                        {event.title}
                      </p>
                      <p className="mt-3 text-base text-gray-500">
                        {event.description.length > 120 
                          ? `${event.description.substring(0, 120)}...` 
                          : event.description}
                      </p>
                    </Link>
                  </div>
                  <div className="mt-6 flex items-center">
                    <div className="flex-shrink-0">
                      <MapPin className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-gray-500">
                        {event.location}
                      </p>
                    </div>
                    <div className="ml-auto">
                      <Link href={`/events/${event.id}`}>
                        <Button variant="link" className="text-primary hover:text-blue-700">
                          Learn more <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <div className="mt-10 text-center">
          <Link href="/events">
            <Button className="bg-primary hover:bg-blue-700">
              View All Events
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Events;
