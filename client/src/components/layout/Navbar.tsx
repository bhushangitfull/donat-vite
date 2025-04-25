import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { getMenuItems } from '@/lib/firebase';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/contexts/AuthContext';

// Define the MenuItem interface
interface MenuItem {
  id: string;
  title: string;
  path: string;
  order: number;
  isActive: boolean;
}

const Navbar = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [location] = useLocation();
  const { toast } = useToast();
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setLoading(true);
        const items = await getMenuItems();
        // Filter active items and ensure type safety
        const activeItems = items.filter((item: any) => {
          // Validate that the item has all required properties
          return item && 
            typeof item.id === 'string' && 
            typeof item.title === 'string' && 
            typeof item.path === 'string' && 
            typeof item.order === 'number' && 
            typeof item.isActive === 'boolean' && 
            item.isActive === true;
        }) as MenuItem[];
        
        setMenuItems(activeItems);
      } catch (error) {
        toast({
          title: "Error loading menu",
          description: "Failed to load navigation menu",
          variant: "destructive",
        });
        
        // Set default menu items on error
        const defaultItems = [
          { id: "1", title: "Home", path: "/", order: 1, isActive: true },
          { id: "2", title: "About", path: "/about", order: 2, isActive: true },
          { id: "3", title: "Events", path: "/events", order: 3, isActive: true },
          { id: "4", title: "News", path: "/news", order: 4, isActive: true },
          { id: "5", title: "Contact", path: "/contact", order: 5, isActive: true },
        ];
        setMenuItems(defaultItems);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, [toast]);

  // Default menu items if none are found in the database
  if (menuItems.length === 0 && !loading) {
    const defaultItems = [
      { id: "1", title: "Home", path: "/", order: 1, isActive: true },
      { id: "2", title: "About", path: "/about", order: 2, isActive: true },
      { id: "3", title: "Events", path: "/events", order: 3, isActive: true },
      { id: "4", title: "News", path: "/news", order: 4, isActive: true },
      { id: "5", title: "Contact", path: "/contact", order: 5, isActive: true },
    ];
    setMenuItems(defaultItems);
  }

  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-white/90 backdrop-blur-sm shadow-md' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center">
                <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">HOPE</span>
                <span className="ml-1 text-lg font-medium text-gray-800">Foundation</span>
              </Link>
            </div>
            <div className="hidden sm:ml-10 sm:flex sm:space-x-10">
              {menuItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.path}
                  className={`${
                    location === item.path
                      ? 'text-green-600 font-semibold'
                      : 'text-gray-800 hover:text-green-600'
                  } inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors duration-200`}
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center gap-3">
            <Link href="/donate">
              <Button className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white border-none">
                Donate Now
              </Button>
            </Link>
            {isAdmin ? (
              <Link href="/admin">
                <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
                  Admin Dashboard
                </Button>
              </Link>
            ) : (
              <Link href="/admin">
                <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
                  Admin Login
                </Button>
              </Link>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-gray-800">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open main menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <div className="pt-6 flex flex-col gap-6">
                  <div className="space-y-3">
                    {menuItems.map((item) => (
                      <Link
                        key={item.id}
                        href={item.path}
                        className={`${
                          location === item.path
                            ? 'bg-green-50 border-green-600 text-green-600 font-semibold'
                            : 'border-transparent text-gray-700 hover:bg-gray-50 hover:border-green-300 hover:text-green-600'
                        } block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors duration-200`}
                      >
                        {item.title}
                      </Link>
                    ))}
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <Link href="/donate">
                      <Button className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white border-none">
                        Donate Now
                      </Button>
                    </Link>
                    <div className="mt-3">
                      {isAdmin ? (
                        <Link href="/admin">
                          <Button variant="outline" className="w-full border-green-600 text-green-600 hover:bg-green-50">
                            Admin Dashboard
                          </Button>
                        </Link>
                      ) : (
                        <Link href="/admin">
                          <Button variant="outline" className="w-full border-green-600 text-green-600 hover:bg-green-50">
                            Admin Login
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
