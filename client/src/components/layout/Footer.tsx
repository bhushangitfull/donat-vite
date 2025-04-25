import { useState } from 'react';
import { Link } from 'wouter';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { addSubscriber } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubscribe = async (e: React.FormEvent) => {
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
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2">
            <Link href="/" className="flex items-center mb-5">
              <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">HOPE</span>
              <span className="ml-1 text-lg font-medium text-gray-800">Foundation</span>
            </Link>
            <p className="text-gray-600 mb-6 max-w-md">
              Dedicated to environmental conservation, community empowerment, and sustainable development across the globe.
            </p>
            
            <h3 className="text-sm font-semibold text-gray-900 uppercase mb-4">
              Subscribe to our newsletter
            </h3>
            <form className="flex flex-col sm:flex-row gap-2 max-w-md" onSubmit={handleSubscribe}>
              <div className="flex-grow">
                <Input
                  type="email"
                  name="email-address"
                  id="email-address-footer"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border-gray-300 focus:border-green-500 focus:ring-green-500 rounded-md"
                  placeholder="Enter your email"
                />
              </div>
              <Button 
                type="submit" 
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white border-none"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Subscribing..." : "Subscribe"}
              </Button>
            </form>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase mb-4">
              About
            </h3>
            <ul role="list" className="space-y-3">
              <li>
                <Link href="/about" className="text-gray-600 hover:text-green-600 transition-colors">
                  Our Mission
                </Link>
              </li>
              <li>
                <Link href="/about#team" className="text-gray-600 hover:text-green-600 transition-colors">
                  Team
                </Link>
              </li>
              <li>
                <Link href="/about#careers" className="text-gray-600 hover:text-green-600 transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/about#reports" className="text-gray-600 hover:text-green-600 transition-colors">
                  Annual Reports
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase mb-4">
              Programs
            </h3>
            <ul role="list" className="space-y-3">
              <li>
                <Link href="/programs/gardens" className="text-gray-600 hover:text-green-600 transition-colors">
                  Community Gardens
                </Link>
              </li>
              <li>
                <Link href="/programs/education" className="text-gray-600 hover:text-green-600 transition-colors">
                  Youth Education
                </Link>
              </li>
              <li>
                <Link href="/programs/food" className="text-gray-600 hover:text-green-600 transition-colors">
                  Food Security
                </Link>
              </li>
              <li>
                <Link href="/programs/sustainability" className="text-gray-600 hover:text-green-600 transition-colors">
                  Sustainability
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase mb-4">
              Get Involved
            </h3>
            <ul role="list" className="space-y-3">
              <li>
                <Link href="/volunteer" className="text-gray-600 hover:text-green-600 transition-colors">
                  Volunteer
                </Link>
              </li>
              <li>
                <Link href="/donate" className="text-gray-600 hover:text-green-600 transition-colors">
                  Donate
                </Link>
              </li>
              <li>
                <Link href="/partners" className="text-gray-600 hover:text-green-600 transition-colors">
                  Partner With Us
                </Link>
              </li>
              <li>
                <Link href="/news" className="text-gray-600 hover:text-green-600 transition-colors">
                  News & Blog
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Hope Foundation. All rights reserved.
          </p>
          
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="https://facebook.com" className="text-gray-400 hover:text-green-600 transition-colors">
              <span className="sr-only">Facebook</span>
              <FaFacebook className="h-5 w-5" />
            </a>
            <a href="https://instagram.com" className="text-gray-400 hover:text-green-600 transition-colors">
              <span className="sr-only">Instagram</span>
              <FaInstagram className="h-5 w-5" />
            </a>
            <a href="https://twitter.com" className="text-gray-400 hover:text-green-600 transition-colors">
              <span className="sr-only">Twitter</span>
              <FaTwitter className="h-5 w-5" />
            </a>
            <a href="https://youtube.com" className="text-gray-400 hover:text-green-600 transition-colors">
              <span className="sr-only">YouTube</span>
              <FaYoutube className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
