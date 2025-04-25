import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Heart, 
  HandHelpingIcon, 
  Lightbulb, 
  Users, 
  Award, 
  Target,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Youtube
} from 'lucide-react';

const AboutPage = () => {
  useEffect(() => {
    // Set page title
    document.title = 'About Us | Hope Foundation';
    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, []);

  // Team members data
  const teamMembers = [
    {
      name: 'Emma Rodriguez',
      role: 'Executive Director',
      bio: 'Emma has over 15 years of experience in nonprofit leadership and community development.',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    {
      name: 'Michael Chen',
      role: 'Programs Director',
      bio: 'Michael oversees our educational programs and community initiatives with passion and dedication.',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    {
      name: 'Sarah Johnson',
      role: 'Development Director',
      bio: 'Sarah leads our fundraising efforts and donor relations to ensure sustainable growth.',
      image: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    {
      name: 'David Williams',
      role: 'Community Outreach Coordinator',
      bio: 'David connects with local organizations and volunteers to maximize our impact.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    }
  ];

  // Values data
  const values = [
    {
      icon: <Heart className="h-8 w-8 text-primary" />,
      title: 'Compassion',
      description: 'We approach our work with empathy and kindness, recognizing the dignity of every person we serve.'
    },
    {
      icon: <HandHelpingIcon className="h-8 w-8 text-primary" />,
      title: 'Service',
      description: 'We are dedicated to serving our community with excellence and meeting real needs.'
    },
    {
      icon: <Lightbulb className="h-8 w-8 text-primary" />,
      title: 'Innovation',
      description: 'We pursue creative solutions to complex problems, continuously improving our approaches.'
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: 'Inclusion',
      description: 'We believe in creating spaces where everyone belongs and can contribute meaningfully.'
    },
    {
      icon: <Award className="h-8 w-8 text-primary" />,
      title: 'Integrity',
      description: 'We operate with transparency, accountability, and the highest ethical standards.'
    },
    {
      icon: <Target className="h-8 w-8 text-primary" />,
      title: 'Impact',
      description: 'We focus on measurable outcomes that create lasting positive change in our community.'
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-primary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold sm:text-5xl lg:text-6xl mb-6">Our Story</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Hope Foundation was established in 2005 with a vision to create stronger, more resilient communities through collective action and support.
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-6">
                Hope Foundation is dedicated to addressing local needs through collective action, fostering community resilience, and creating lasting positive change.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                We believe that by bringing people together, providing resources and opportunities, and amplifying voices that are often unheard, we can build a more just, equitable, and vibrant community for all.
              </p>
              <p className="text-lg text-gray-600">
                Through our programs in education, community development, food security, and environmental sustainability, we work to empower individuals and strengthen the bonds that make our community thrive.
              </p>
            </div>
            <div className="mt-10 lg:mt-0">
              <img
                src="https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                alt="Team meeting discussing community projects"
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-16 bg-gray-50" id="values">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Our Core Values</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              These principles guide our work and define our approach to community service.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Impact Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Our Impact</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Since our founding, we've made a significant difference in our community.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-5xl font-bold text-primary mb-2">5K+</p>
              <p className="text-lg text-gray-600">Volunteers Engaged</p>
            </div>
            <div>
              <p className="text-5xl font-bold text-primary mb-2">200+</p>
              <p className="text-lg text-gray-600">Events Organized</p>
            </div>
            <div>
              <p className="text-5xl font-bold text-primary mb-2">10K+</p>
              <p className="text-lg text-gray-600">People Helped</p>
            </div>
            <div>
              <p className="text-5xl font-bold text-primary mb-2">$2M+</p>
              <p className="text-lg text-gray-600">Funds Raised</p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-16 bg-gray-50" id="team">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Our Team</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Meet the dedicated people who make our mission possible.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <Avatar className="w-32 h-32 mx-auto mb-4">
                    <AvatarImage src={member.image} alt={member.name} />
                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                  <p className="text-primary font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-lg text-gray-600 mb-6">
              Our team is supported by an amazing group of volunteers and community partners.
            </p>
            <Button className="bg-primary hover:bg-blue-700">
              Join Our Team
            </Button>
          </div>
        </div>
      </div>

      {/* History Timeline */}
      <div className="py-16 bg-white" id="history">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Our Journey</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              From our humble beginnings to where we are today.
            </p>
          </div>
          
          <div className="relative border-l border-gray-200 ml-3 md:ml-6 pl-6 md:pl-10 space-y-12">
            <div className="relative">
              <div className="absolute -left-7 md:-left-11 mt-1.5 w-5 h-5 rounded-full bg-primary"></div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">2005</h3>
                <p className="text-lg font-medium text-primary mb-2">Foundation Established</p>
                <p className="text-gray-600">
                  Hope Foundation was founded by a group of community leaders seeking to address local needs and create positive change.
                </p>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute -left-7 md:-left-11 mt-1.5 w-5 h-5 rounded-full bg-primary"></div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">2010</h3>
                <p className="text-lg font-medium text-primary mb-2">Community Center Opens</p>
                <p className="text-gray-600">
                  We opened our first community center, providing a hub for programs, resources, and community gatherings.
                </p>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute -left-7 md:-left-11 mt-1.5 w-5 h-5 rounded-full bg-primary"></div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">2015</h3>
                <p className="text-lg font-medium text-primary mb-2">Expanded Programs</p>
                <p className="text-gray-600">
                  Launched new initiatives in education, food security, and environmental sustainability to address evolving community needs.
                </p>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute -left-7 md:-left-11 mt-1.5 w-5 h-5 rounded-full bg-primary"></div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">2020</h3>
                <p className="text-lg font-medium text-primary mb-2">Community Response</p>
                <p className="text-gray-600">
                  Mobilized resources to support our community during crisis, providing emergency assistance and adapting programs to meet urgent needs.
                </p>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute -left-7 md:-left-11 mt-1.5 w-5 h-5 rounded-full bg-primary"></div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Today</h3>
                <p className="text-lg font-medium text-primary mb-2">Looking Forward</p>
                <p className="text-gray-600">
                  Continuing to grow and evolve, with a focus on sustainable impact, community partnership, and addressing the most pressing needs in our area.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Partners Section */}
      <div className="py-16 bg-gray-50" id="partners">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Our Partners</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              We collaborate with these organizations to maximize our impact.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <div key={item} className="flex items-center justify-center p-4 bg-white rounded-lg shadow-sm">
                <div className="h-16 w-32 bg-gray-200 rounded flex items-center justify-center text-gray-500 font-medium">
                  Partner Logo
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-lg text-gray-600 mb-6">
              Interested in partnering with us? We're always looking for new collaborations.
            </p>
            <Button className="bg-primary hover:bg-blue-700">
              Become a Partner
            </Button>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="py-16 bg-white" id="contact">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Contact Us</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Have questions or want to get involved? Reach out to us.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6 flex flex-col items-center text-center">
                <Mail className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">Email</h3>
                <p className="text-gray-600">info@hopefoundation.org</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 flex flex-col items-center text-center">
                <Phone className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">Phone</h3>
                <p className="text-gray-600">(555) 123-4567</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 flex flex-col items-center text-center">
                <MapPin className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">Visit</h3>
                <p className="text-gray-600">123 Community St, Anytown, USA</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-lg text-gray-600 mb-6">
              Follow us on social media for updates and announcements.
            </p>
            <div className="flex justify-center space-x-6">
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Facebook</span>
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Instagram</span>
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Twitter</span>
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">YouTube</span>
                <Youtube className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Make a Difference?</h2>
          <p className="text-xl max-w-3xl mx-auto mb-8">
            Join us in our mission to create positive change in our community. Whether through volunteering, donating, or partnering, your contribution matters.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button className="bg-white text-primary hover:bg-gray-100">
              Volunteer With Us
            </Button>
            <Button variant="outline" className="text-white border-white hover:bg-white/10">
              Donate Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
