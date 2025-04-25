import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  addEvent, 
  getEvents, 
  updateEvent, 
  deleteEvent, 
  uploadImage 
} from '@/lib/firebase';
import { Calendar, Upload, Trash2, Edit, Plus } from 'lucide-react';
import { format } from 'date-fns';

interface Event {
  id: string;
  title: string;
  description: string;
  date: { seconds: number; nanoseconds: number };
  location: string;
  imageUrl: string;
}

const EventForm = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  
  const { toast } = useToast();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const fetchedEvents = await getEvents();
      
      // Sort events by date (newest first)
      const sortedEvents = fetchedEvents.sort((a: Event, b: Event) => {
        const dateA = new Date(a.date.seconds * 1000);
        const dateB = new Date(b.date.seconds * 1000);
        return dateB.getTime() - dateA.getTime();
      });
      
      setEvents(sortedEvents);
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

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDate('');
    setLocation('');
    setImage(null);
    setImageUrl('');
    setImagePreview('');
    setEditing(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      
      // Create image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditEvent = (event: Event) => {
    setEditing(event.id);
    setTitle(event.title);
    setDescription(event.description);
    
    // Convert timestamp to date string
    const eventDate = new Date(event.date.seconds * 1000);
    setDate(format(eventDate, 'yyyy-MM-dd'));
    
    setLocation(event.location);
    setImageUrl(event.imageUrl || '');
    setImagePreview(event.imageUrl || '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || !date || !location) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setSubmitting(true);
      
      // Convert date string to Date object
      const eventDate = new Date(date);
      
      let finalImageUrl = imageUrl;
      
      // Upload image if a new one is selected
      if (image) {
        finalImageUrl = await uploadImage(image, 'events');
      }
      
      const eventData = {
        title,
        description,
        date: eventDate,
        location,
        imageUrl: finalImageUrl,
      };
      
      if (editing) {
        await updateEvent(editing, eventData);
        toast({
          title: "Event updated",
          description: "The event has been updated successfully",
        });
      } else {
        await addEvent(eventData);
        toast({
          title: "Event created",
          description: "New event has been created successfully",
        });
      }
      
      resetForm();
      fetchEvents();
    } catch (error) {
      console.error("Error saving event:", error);
      toast({
        title: "Error saving event",
        description: "Failed to save the event. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (confirm("Are you sure you want to delete this event?")) {
      try {
        await deleteEvent(id);
        toast({
          title: "Event deleted",
          description: "The event has been deleted successfully",
        });
        fetchEvents();
      } catch (error) {
        console.error("Error deleting event:", error);
        toast({
          title: "Error deleting event",
          description: "Failed to delete the event. Please try again later.",
          variant: "destructive",
        });
      }
    }
  };

  const formatEventDate = (date: { seconds: number; nanoseconds: number }) => {
    const eventDate = new Date(date.seconds * 1000);
    return format(eventDate, 'MMMM d, yyyy');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          {editing ? 'Edit Event' : 'Create New Event'}
        </h2>
        {editing && (
          <Button variant="outline" onClick={resetForm}>
            Cancel Editing
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Event Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Event Title*</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter event title"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description*</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the event"
                rows={4}
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Event Date*</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Location*</Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Event location"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="image">Event Image</Label>
              <div className="flex items-center space-x-4">
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="flex-1"
                />
                <Upload className="h-5 w-5 text-gray-400" />
              </div>
              
              {imagePreview && (
                <div className="mt-2">
                  <p className="text-sm text-gray-500 mb-2">Image Preview:</p>
                  <div className="relative w-full h-48 overflow-hidden rounded-md">
                    <img
                      src={imagePreview}
                      alt="Event Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
            
            <div className="pt-4">
              <Button 
                type="submit" 
                className="w-full md:w-auto"
                disabled={submitting}
              >
                {submitting 
                  ? (editing ? "Updating..." : "Creating...") 
                  : (editing ? "Update Event" : "Create Event")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Separator />
      
      <h3 className="text-xl font-semibold text-gray-900">Existing Events</h3>
      
      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p>No events found. Create your first event above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((event) => (
            <Card key={event.id} className="overflow-hidden">
              {event.imageUrl && (
                <div className="h-40 overflow-hidden">
                  <img 
                    src={event.imageUrl} 
                    alt={event.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <CardContent className="p-4">
                <h4 className="text-lg font-semibold mb-2">{event.title}</h4>
                <p className="text-sm text-gray-500 mb-2">
                  {formatEventDate(event.date)} | {event.location}
                </p>
                <p className="text-sm mb-4">
                  {event.description.substring(0, 100)}
                  {event.description.length > 100 ? '...' : ''}
                </p>
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleEditEvent(event)}
                  >
                    <Edit className="h-4 w-4 mr-1" /> Edit
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive"
                    onClick={() => handleDeleteEvent(event.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" /> Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {!editing && events.length > 0 && (
        <Button 
          className="mt-4 flex items-center"
          onClick={resetForm}
        >
          <Plus className="h-4 w-4 mr-2" /> Add Another Event
        </Button>
      )}
    </div>
  );
};

export default EventForm;
