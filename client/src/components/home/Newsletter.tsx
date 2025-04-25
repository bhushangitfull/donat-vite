import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { addSubscriber } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      await addSubscriber(email);
      toast({
        title: "Subscribed!",
        description: "Thank you for subscribing to our newsletter",
      });
      setEmail('');
    } catch (error) {
      console.error("Error subscribing:", error);
      toast({
        title: "Subscription failed",
        description: "Failed to subscribe. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Stay Connected</h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Subscribe to our newsletter to receive updates on our work, upcoming events, and ways to get involved.
          </p>
        </div>
        <div className="mt-10 max-w-xl mx-auto">
          <form onSubmit={handleSubmit} className="sm:flex">
            <label htmlFor="email-address" className="sr-only">Email address</label>
            <Input
              id="email-address"
              name="email-address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
              className="w-full px-5 py-3 placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm rounded-md"
              placeholder="Enter your email"
            />
            <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3 sm:flex-shrink-0">
              <Button 
                type="submit" 
                className="w-full flex items-center justify-center px-5 py-3 bg-primary hover:bg-blue-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Subscribing..." : "Subscribe"}
              </Button>
            </div>
          </form>
          <p className="mt-3 text-sm text-gray-500">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Newsletter;
