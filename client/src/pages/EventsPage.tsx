import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Calendar, ChevronLeft, MapPin, Share2, Clock, Users } from 'lucide-react';
import { getEvents } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface Event {
  id: string;
  title: string;
  description: string;
  date: { seconds: number; nanoseconds: number };
  location: string;
  imageUrl: string;
}

interface EventsPageProps {
  id?: string;
}

const EventsPage = ({ id }: EventsPageProps) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  useEffect(() => {
    fetchEvents();
    // Set page title
    document.title = id ? 'Event Details | Hope Foundation' : 'Events | Hope Foundation';
    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, [id]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const fetchedEvents = await getEvents();
      
      // Sort events by date (ascending for upcoming events)
      const sortedEvents = fetchedEvents.sort((a: Event, b: Event) => {
        const dateA = new Date(a.date.seconds * 1000);
        const dateB = new Date(b.date.seconds * 1000);
        return dateA.getTime() - dateB.getTime();
      });
      
      setEvents(sortedEvents);
      
      // If an ID is provided, find the corresponding event
      if (id) {
        const event = sortedEvents.find((event: Event) => event.id === id);
        if (event) {
          setSelectedEvent(event);
          document.title = `${event.title} | Hope Foundation`;
        } else {
          toast({
            title: "Event not found",
            description: "The requested event could not be found.",
            variant: "destructive",
          });
          setLocation('/events');
        }
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      toast({
        title: "Error loading events",
        description: "Failed to load events. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatEventDate = (date: { seconds: number; nanoseconds: number }) => {
    const eventDate = new Date(date.seconds * 1000);
    return format(eventDate, 'MMMM d, yyyy');
  };

  const formatEventTime = (date: { seconds: number; nanoseconds: number }) => {
    const eventDate = new Date(date.seconds * 1000);
    return format(eventDate, 'h:mm a');
  };

  const handleShare = () => {
    if (navigator.share && selectedEvent) {
      navigator.share({
        title: selectedEvent.title,
        text: `Check out this event: ${selectedEvent.title}`,
        url: window.location.href,
      }).catch((error) => {
        console.error('Error sharing:', error);
      });
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied",
        description: "The event link has been copied to your clipboard.",
      });
    }
  };

  // Create placeholder events if none are found
  const placeholderEvents: Event[] = [
    {
      id: "1",
      title: "Community Garden Cleanup",
      description: "Help us restore the downtown community garden and prepare for summer planting. Tools and refreshments provided. Join us as we work together to create a beautiful and productive space for the community to enjoy. No experience necessary - just bring your enthusiasm and a willingness to get your hands dirty! We'll have experienced gardeners on hand to provide guidance and support throughout the event.",
      date: { seconds: Date.now() / 1000 + 86400 * 7, nanoseconds: 0 },
      location: "Central Park, Downtown",
      imageUrl: "https://images.unsplash.com/photo-1546015452-af9d0e235665?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "2",
      title: "Summer Food Drive",
      description: "Help us collect non-perishable food items for local families in need. Drop-off locations throughout the city. We're accepting canned goods, pasta, rice, cereal, and other non-perishable items. All donations will be distributed to local food banks and directly to families in need through our community outreach program. If you can't make it to a drop-off location, we also offer pickup services - just contact our volunteer coordinator to arrange a time.",
      date: { seconds: Date.now() / 1000 + 86400 * 14, nanoseconds: 0 },
      location: "Multiple Locations",
      imageUrl: "https://images.unsplash.com/photo-1593113630400-ea4288922497?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "3",
      title: "Hope 5K Charity Run",
      description: "Join our annual charity run to raise funds for youth education programs. All fitness levels welcome. The route will take participants through scenic Riverview Park with beautiful views along the river. Registration includes a t-shirt, finisher medal, and post-race celebration with refreshments. You can participate as an individual or form a team. Can't make it in person? Register for our virtual option and complete the run on your own time and route.",
      date: { seconds: Date.now() / 1000 + 86400 * 28, nanoseconds: 0 },
      location: "Riverview Park",
      imageUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
    }
  ];

  const displayEvents = events.length > 0 ? events : (loading ? [] : placeholderEvents);
  
  // If we're looking at a specific event
  if (id) {
    const event = selectedEvent || (loading ? null : placeholderEvents.find(e => e.id === id));
    
    if (loading) {
      return (
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Button variant="ghost" onClick={() => setLocation('/events')} className="mb-4">
              <ChevronLeft className="mr-2 h-4 w-4" /> Back to Events
            </Button>
            <Skeleton className="h-12 w-3/4 mb-4" />
            <Skeleton className="h-6 w-48 mb-8" />
            <Skeleton className="h-96 w-full mb-8" />
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-6 w-3/4 mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </div>
      );
    }
    
    if (!event) {
      return (
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Event Not Found</h2>
          <p className="text-lg text-gray-600 mb-8">Sorry, the event you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => setLocation('/events')}>
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to Events
          </Button>
        </div>
      );
    }
    
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Button variant="ghost" onClick={() => setLocation('/events')} className="mb-4">
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to Events
          </Button>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {event.imageUrl && (
              <div className="w-full h-96">
                <img 
                  src={event.imageUrl} 
                  alt={event.title} 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <div className="p-6 md:p-8">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div>
                  <Badge variant="secondary" className="mb-2 bg-blue-100 text-blue-800">
                    {formatEventDate(event.date)}
                  </Badge>
                  <h1 className="text-3xl font-bold text-gray-900">{event.title}</h1>
                </div>
                <Button variant="outline" onClick={handleShare}>
                  <Share2 className="mr-2 h-4 w-4" /> Share
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card>
                  <CardContent className="p-4 flex items-center">
                    <Calendar className="h-10 w-10 text-primary mr-4" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Date & Time</p>
                      <p className="font-medium">{formatEventDate(event.date)}</p>
                      <p className="text-sm">{formatEventTime(event.date)}</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4 flex items-center">
                    <MapPin className="h-10 w-10 text-primary mr-4" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Location</p>
                      <p className="font-medium">{event.location}</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4 flex items-center">
                    <Users className="h-10 w-10 text-primary mr-4" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Organizer</p>
                      <p className="font-medium">Hope Foundation</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="prose max-w-none">
                <h2 className="text-xl font-semibold mb-4">About This Event</h2>
                <p className="whitespace-pre-line">{event.description}</p>
              </div>
              
              <div className="mt-8 flex flex-wrap gap-4">
                <Button size="lg" className="bg-primary hover:bg-blue-700">
                  Register to Attend
                </Button>
                <Button size="lg" variant="outline">
                  Volunteer for This Event
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Events listing page
  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">Upcoming Events</h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Join us at our events to make a direct impact in the community.
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            // Loading skeletons
            Array(6).fill(0).map((_, i) => (
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
            displayEvents.length > 0 ? (
              displayEvents.map((event) => (
                <Card key={event.id} className="flex flex-col overflow-hidden">
                  <div className="flex-shrink-0 h-48">
                    <img 
                      className="h-full w-full object-cover" 
                      src={event.imageUrl} 
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
                      <a href={`/events/${event.id}`} className="block mt-2">
                        <p className="text-xl font-semibold text-gray-900 hover:text-primary transition-colors">
                          {event.title}
                        </p>
                        <p className="mt-3 text-base text-gray-500">
                          {event.description.length > 120 
                            ? `${event.description.substring(0, 120)}...` 
                            : event.description}
                        </p>
                      </a>
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
                        <Button 
                          variant="link" 
                          className="text-primary hover:text-blue-700"
                          onClick={() => setLocation(`/events/${event.id}`)}
                        >
                          Learn more <ChevronLeft className="ml-1 h-4 w-4 rotate-180" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-1">No Upcoming Events</h3>
                <p className="text-gray-500">Check back soon for new events or subscribe to our newsletter.</p>
              </div>
            )
          )}
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Want to get involved?</h2>
          <p className="max-w-2xl mx-auto text-lg text-gray-500 mb-8">
            Whether you're interested in volunteering, sponsoring an event, or suggesting ideas for future events, we'd love to hear from you.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button className="bg-primary hover:bg-blue-700">
              Become a Volunteer
            </Button>
            <Button variant="outline" className='hover: text-black'>
              Contact Us
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventsPage;
