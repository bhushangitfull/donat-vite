import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { ArrowRight, Globe, Heart, Users } from 'lucide-react';

const gradientBg = {
    backgroundImage: 'linear-gradient(to right bottom, #90ee9090, #90ee9000)',
};

const heroPattern = {
    backgroundSize: '2.8em 2.8em',
    backgroundImage:
        'linear-gradient(to right, #90ee9040 1px, transparent 1px),linear-gradient(to bottom, #90ee9040 1px, transparent 1px)',
};

const Hero = () => {
  return (
    <div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Gradient background with pattern */}
      <div
        className="absolute inset-0 w-full h-full  opacity-95 -z-10"
        style={{ ...gradientBg, ...heroPattern }}
        
      ></div>
      
      <div className="relative max-w-7xl mx-auto py-16 md:py-24 px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
        <div className="md:w-1/2 z-10 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
            Creating a <span className="italic">Sustainable Future</span><br />Together
          </h1>
          <p className="text-lg md:text-xl text-black max-w-2xl mb-8">
            We're dedicated to environmental conservation, community empowerment, and sustainable development across the globe.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Link href="/events">
              <Button className="px-6 py-3 text-base font-medium rounded-md bg-white text-green-600 hover:bg-gray-100 transition-all shadow-md">
                Get Involved
                <span className="ml-2 relative top-px">→</span>
              </Button>
            </Link>
            <Link href="/donate">
              <Button variant="outline" className="px-6 py-3 text-base font-medium rounded-md border-2 border-white text-white hover:bg-white/10 transition-all">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="md:w-1/2 flex justify-center items-center">
          <div className="relative w-64 h-64 md:w-80 md:h-80">
            <img 
              src="https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?auto=format&fit=crop&w=800&q=80" 
              alt="Hope Foundation Logo" 
              className="rounded-full object-cover w-full h-full border-4 border-white/30 shadow-xl"
            />
            <div className="absolute -bottom-4 -right-4 bg-white rounded-full p-3 shadow-lg">
              <div className="text-xl font-bold text-green-600">BBS</div>
            </div>
          </div>
        </div>
      </div>
      
      
      {/* <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm py-6 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col items-center">
            <div className="text-3xl md:text-4xl font-bold text-gray-800">50+</div>
            <div className="text-sm text-gray-600">Projects Completed</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-3xl md:text-4xl font-bold text-gray-800">20K</div>
            <div className="text-sm text-gray-600">People Helped</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-3xl md:text-4xl font-bold text-gray-800">15</div>
            <div className="text-sm text-gray-600">Countries Reached</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-3xl md:text-4xl font-bold text-gray-800">$2M</div>
            <div className="text-sm text-gray-600">Funds Raised</div>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default Hero;
