import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  CheckCircle2
} from 'lucide-react';

const ContactPage = () => {
  useEffect(() => {
    // Set page title
    document.title = 'Contact Us | Hope Foundation';
    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, []);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !message) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setSubmitting(true);
      
      // In a real application, you would send the form data to your server
      // For now, we'll simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Message sent",
        description: "Thank you for contacting us. We'll respond as soon as possible.",
      });
      
      setSubmitted(true);
      resetForm();
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error sending message",
        description: "Failed to send your message. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
  };

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-primary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold sm:text-5xl lg:text-6xl mb-6">Contact Us</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Have questions or want to get involved? We'd love to hear from you.
          </p>
        </div>
      </div>

      {/* Contact Information */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6 flex flex-col items-center text-center">
                <Mail className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">Email Us</h3>
                <p className="text-gray-600 mb-2">For general inquiries:</p>
                <a href="mailto:info@hopefoundation.org" className="text-primary hover:underline">
                  info@hopefoundation.org
                </a>
                <p className="text-gray-600 mt-2 mb-2">For volunteer opportunities:</p>
                <a href="mailto:volunteer@hopefoundation.org" className="text-primary hover:underline">
                  volunteer@hopefoundation.org
                </a>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 flex flex-col items-center text-center">
                <Phone className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">Call Us</h3>
                <p className="text-gray-600 mb-2">Main Office:</p>
                <a href="tel:5551234567" className="text-primary hover:underline">
                  (555) 123-4567
                </a>
                <p className="text-gray-600 mt-2 mb-2">Community Center:</p>
                <a href="tel:5557891234" className="text-primary hover:underline">
                  (555) 789-1234
                </a>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 flex flex-col items-center text-center">
                <MapPin className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">Visit Us</h3>
                <p className="text-gray-600 mb-2">Main Office:</p>
                <p className="text-gray-800">
                  123 Community St, Anytown, USA
                </p>
                <p className="text-gray-600 mt-2 mb-2">Community Center:</p>
                <p className="text-gray-800">
                  456 Hope Ave, Anytown, USA
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Contact Form Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">Send Us a Message</CardTitle>
              </CardHeader>
              <CardContent>
                {submitted ? (
                  <div className="text-center py-8">
                    <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Message Sent!</h3>
                    <p className="text-gray-600 mb-6">
                      Thank you for contacting us. We'll respond to your message as soon as possible.
                    </p>
                    <Button onClick={() => setSubmitted(false)}>
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Your Name*</Label>
                        <Input
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="John Doe"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address*</Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="john.doe@example.com"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="How can we help you?"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="message">Message*</Label>
                      <Textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Write your message here..."
                        rows={6}
                        required
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={submitting}
                    >
                      {submitting ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Find answers to common questions about our organization.
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2">How can I volunteer with Hope Foundation?</h3>
                <p className="text-gray-600">
                  You can volunteer by filling out our volunteer application form online, attending an orientation session, or contacting our volunteer coordinator directly at volunteer@hopefoundation.org.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2">Are donations to Hope Foundation tax-deductible?</h3>
                <p className="text-gray-600">
                  Yes, Hope Foundation is a registered 501(c)(3) nonprofit organization, and all donations are tax-deductible to the extent allowed by law. We provide receipts for all donations.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2">How can my organization partner with Hope Foundation?</h3>
                <p className="text-gray-600">
                  We welcome partnerships with businesses, schools, and other nonprofits. Please contact our development director at partnerships@hopefoundation.org to discuss collaboration opportunities.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2">What areas does Hope Foundation serve?</h3>
                <p className="text-gray-600">
                  While our primary focus is on the Anytown area, our programs and impact extend throughout the region. Some of our initiatives have even inspired similar efforts nationally.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Social Media Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Connect With Us</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Follow us on social media for updates, stories, and more.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <Facebook className="h-12 w-12 text-blue-600 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Facebook</h3>
                <p className="text-gray-600 mb-4">
                  Join our community of supporters and stay updated on events.
                </p>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Follow Us
                </Button>
              </CardContent>
            </Card>
            
            <Card className="bg-pink-50 border-pink-200">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <Instagram className="h-12 w-12 text-pink-600 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Instagram</h3>
                <p className="text-gray-600 mb-4">
                  See photos and stories from our programs and events.
                </p>
                <Button className="bg-pink-600 hover:bg-pink-700">
                  Follow Us
                </Button>
              </CardContent>
            </Card>
            
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <Twitter className="h-12 w-12 text-blue-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Twitter</h3>
                <p className="text-gray-600 mb-4">
                  Get the latest news and updates from our organization.
                </p>
                <Button className="bg-blue-400 hover:bg-blue-500">
                  Follow Us
                </Button>
              </CardContent>
            </Card>
            
            <Card className="bg-red-50 border-red-200">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <Youtube className="h-12 w-12 text-red-600 mb-4" />
                <h3 className="text-lg font-semibold mb-2">YouTube</h3>
                <p className="text-gray-600 mb-4">
                  Watch videos about our impact and mission in action.
                </p>
                <Button className="bg-red-600 hover:bg-red-700">
                  Subscribe
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="bg-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Subscribe to Our Newsletter</h2>
          <p className="text-xl max-w-3xl mx-auto mb-8">
            Stay informed about our work, upcoming events, and ways to get involved.
          </p>
          <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
            <Input
              type="email"
              placeholder="Your email address"
              className="bg-white text-gray-900 flex-grow"
            />
            <Button className="bg-white text-primary hover:bg-gray-100">
              Subscribe
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
