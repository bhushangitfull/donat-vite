import { useEffect } from 'react';
import Hero from '@/components/home/Hero';
import Mission from '@/components/home/Mission';
import Events from '@/components/home/Events';
import Impact from '@/components/home/Impact';
import News from '@/components/home/News';
import Donate from '@/components/home/Donate';
import Newsletter from '@/components/home/Newsletter';

const HomePage = () => {
  useEffect(() => {
    // Set page title
    document.title = 'Hope Foundation | Creating Change Together';
    
    // Scroll to top on page load
    window.scrollTo(0, 0);
    
    // Handle anchor links if present in URL
    const hash = window.location.hash;
    if (hash) {
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, []);

  return (
    <div>
      <Hero />
      <Events />
      <News />
      <Donate />
      <Newsletter />
    </div>
  );
};

export default HomePage;
