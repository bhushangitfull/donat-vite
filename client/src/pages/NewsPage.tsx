import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChevronLeft, Share2, Search, FileText, Calendar } from 'lucide-react';
import { getNewsPosts } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

interface NewsPost {
  id: string;
  title: string;
  content: string;
  category: string;
  imageUrl: string;
  authorName: string;
  authorImageUrl?: string;
  publishedAt: { seconds: number; nanoseconds: number };
}

interface NewsPageProps {
  id?: string;
}

const NewsPage = ({ id }: NewsPageProps) => {
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<NewsPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPosts, setFilteredPosts] = useState<NewsPost[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  useEffect(() => {
    fetchNewsPosts();
    // Set page title
    document.title = id ? 'News Article | Hope Foundation' : 'News | Hope Foundation';
    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    if (posts.length > 0) {
      filterPosts();
    }
  }, [searchQuery, activeCategory, posts]);

  const fetchNewsPosts = async () => {
    try {
      setLoading(true);
      const fetchedPosts = await getNewsPosts();
      
      // Sort posts by published date (newest first)
      const sortedPosts = fetchedPosts.sort((a: NewsPost, b: NewsPost) => {
        const dateA = new Date(a.publishedAt.seconds * 1000);
        const dateB = new Date(b.publishedAt.seconds * 1000);
        return dateB.getTime() - dateA.getTime();
      });
      
      setPosts(sortedPosts);
      setFilteredPosts(sortedPosts);
      
      // If an ID is provided, find the corresponding post
      if (id) {
        const post = sortedPosts.find((post: NewsPost) => post.id === id);
        if (post) {
          setSelectedPost(post);
          document.title = `${post.title} | Hope Foundation`;
        } else {
          toast({
            title: "Article not found",
            description: "The requested article could not be found.",
            variant: "destructive",
          });
          setLocation('/news');
        }
      }
    } catch (error) {
      console.error("Error fetching news posts:", error);
      toast({
        title: "Error loading news",
        description: "Failed to load news articles. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterPosts = () => {
    let filtered = [...posts];
    
    // Filter by search query
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        post => 
          post.title.toLowerCase().includes(query) || 
          post.content.toLowerCase().includes(query) ||
          post.category.toLowerCase().includes(query)
      );
    }
    
    // Filter by category
    if (activeCategory !== 'all') {
      filtered = filtered.filter(post => post.category === activeCategory);
    }
    
    setFilteredPosts(filtered);
  };

  const formatPublishedDate = (date: { seconds: number; nanoseconds: number }) => {
    const publishedDate = new Date(date.seconds * 1000);
    return format(publishedDate, 'MMMM d, yyyy');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  };

  const handleShare = () => {
    if (navigator.share && selectedPost) {
      navigator.share({
        title: selectedPost.title,
        text: `Check out this article: ${selectedPost.title}`,
        url: window.location.href,
      }).catch((error) => {
        console.error('Error sharing:', error);
      });
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied",
        description: "The article link has been copied to your clipboard.",
      });
    }
  };

  // Create placeholder news if none are found
  const placeholderNews: NewsPost[] = [
    {
      id: "1",
      title: "Urban Reforestation Project Completes First Phase",
      content: "Over 500 trees planted across downtown neighborhoods thanks to our amazing volunteers and donors.\n\nThe first phase of our urban reforestation project has been completed successfully, with over 500 trees planted across downtown neighborhoods. This achievement was made possible by the dedicated efforts of our volunteers and the generous support of our donors.\n\nThe project, which began six months ago, aims to increase the tree canopy in urban areas, improve air quality, and create more green spaces for the community to enjoy. The trees selected for planting are native species that are well-adapted to the local climate and will provide habitat for local wildlife.\n\n\"We're thrilled with the progress we've made so far,\" said Emma Rodriguez, the project coordinator. \"The community response has been overwhelming, with residents volunteering their time and local businesses providing supplies and refreshments for our planting events.\"\n\nThe next phase of the project will focus on tree care and maintenance, ensuring that the newly planted trees thrive in their urban environment. Educational workshops will be held to teach residents about proper tree care, including watering, mulching, and pruning techniques.\n\nIf you're interested in getting involved with the urban reforestation project, there are several ways to contribute. You can volunteer your time for tree planting and maintenance, donate to support the purchase of more trees and supplies, or even adopt a tree to care for in your neighborhood.\n\nFor more information on how to get involved, visit our website or contact our volunteer coordinator.",
      category: "News",
      imageUrl: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      authorName: "Emma Rodriguez",
      authorImageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      publishedAt: { seconds: Date.now() / 1000 - 86400 * 7, nanoseconds: 0 }
    },
    {
      id: "2",
      title: "Scholarship Program Helps 30 Students Achieve College Dreams",
      content: "Our annual scholarship fund awarded $150,000 to deserving students from underserved communities.\n\nThirty students from underserved communities are heading to college this fall with financial support from our annual scholarship program. The program awarded a total of $150,000 in scholarships, ranging from $3,000 to $10,000 per student, based on academic achievement, community involvement, and financial need.\n\nThe scholarship recipients come from diverse backgrounds and will be pursuing degrees in various fields, including education, healthcare, engineering, and the arts. Many of them are the first in their families to attend college.\n\n\"This scholarship means everything to me,\" said Maria Gonzalez, one of the recipients who will be studying nursing at State University. \"Without this financial support, I wouldn't be able to pursue my dream of becoming a nurse and giving back to my community.\"\n\nThe scholarship program is funded by generous donations from community members, local businesses, and corporate sponsors. In addition to financial support, scholarship recipients are paired with mentors who provide guidance and support throughout their college journey.\n\n\"We believe that education is the key to breaking the cycle of poverty,\" said Michael Chen, the scholarship program director. \"By investing in these bright young minds, we're not only changing their lives but also strengthening our community for the future.\"\n\nApplications for next year's scholarship program will open in January. Eligible students must have a minimum GPA of 3.0, demonstrate financial need, and show a commitment to community service.\n\nIf you'd like to support the scholarship program, there are several ways to contribute, including making a one-time or recurring donation, sponsoring a specific student, or volunteering as a mentor.",
      category: "Success Story",
      imageUrl: "https://images.unsplash.com/photo-1608555855762-2b657eb1c348?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      authorName: "Michael Chen",
      authorImageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      publishedAt: { seconds: Date.now() / 1000 - 86400 * 21, nanoseconds: 0 }
    },
    {
      id: "3",
      title: "New Community Center Opening in Westside",
      content: "Join us for the grand opening of our new community center offering resources, classes, and support services.\n\nWe're excited to announce the grand opening of our new community center in the Westside neighborhood. The center, which will open its doors on May 15, will serve as a hub for community resources, educational programs, and support services.\n\nThe 15,000-square-foot facility features classrooms for adult education and after-school programs, a computer lab, a fully equipped kitchen for cooking classes and community meals, a multipurpose room for events and workshops, and offices for counseling and case management services.\n\n\"This center is the culmination of years of planning and collaboration with community members,\" said Sarah Johnson, the center's director. \"We've designed programs and services based on the needs and interests expressed by residents during our community listening sessions.\"\n\nThe center will offer a variety of programs, including:\n\n- Adult education classes (GED preparation, ESL, computer skills)\n- Youth enrichment activities (homework help, STEM programs, arts and crafts)\n- Job readiness training and career counseling\n- Health and wellness workshops\n- Financial literacy classes\n- Community events and cultural celebrations\n\nThe grand opening celebration will take place on May 15 from 10:00 AM to 4:00 PM and will feature facility tours, program demonstrations, refreshments, and activities for all ages. Community members are encouraged to attend to learn about the programs and services available.\n\n\"We want this to be a place where everyone in the community feels welcome and supported,\" said Johnson. \"Whether you're looking to improve your job skills, get help with a specific need, or simply connect with your neighbors, the community center is here for you.\"\n\nThe community center was made possible through a combination of grants, corporate sponsorships, and individual donations. Ongoing programs will be funded through a mix of grants, program fees (with scholarships available), and community support.",
      category: "Announcement",
      imageUrl: "https://images.unsplash.com/photo-1560252829-804f1aedf1be?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      authorName: "Sarah Johnson",
      authorImageUrl: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      publishedAt: { seconds: Date.now() / 1000 - 86400 * 35, nanoseconds: 0 }
    }
  ];

  const displayPosts = posts.length > 0 ? posts : (loading ? [] : placeholderNews);
  const displayFilteredPosts = filteredPosts.length > 0 ? filteredPosts : (loading ? [] : placeholderNews);
  
  // Get unique categories
  const categories = ['all', ...new Set(displayPosts.map(post => post.category))];
  
  // If we're looking at a specific post
  if (id) {
    const post = selectedPost || (loading ? null : placeholderNews.find(p => p.id === id));
    
    if (loading) {
      return (
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Button variant="ghost" onClick={() => setLocation('/news')} className="mb-4">
              <ChevronLeft className="mr-2 h-4 w-4" /> Back to News
            </Button>
            <Skeleton className="h-12 w-3/4 mb-4" />
            <Skeleton className="h-6 w-48 mb-8" />
            <Skeleton className="h-96 w-full mb-8" />
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-6 w-3/4 mb-8" />
          </div>
        </div>
      );
    }
    
    if (!post) {
      return (
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Article Not Found</h2>
          <p className="text-lg text-gray-600 mb-8">Sorry, the article you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => setLocation('/news')}>
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to News
          </Button>
        </div>
      );
    }
    
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6">
        <div className="mb-8">
          <Button variant="ghost" onClick={() => setLocation('/news')} className="mb-4">
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to News
          </Button>
          
          <article className="bg-white rounded-lg shadow-md overflow-hidden">
            {post.imageUrl && (
              <div className="w-full h-80">
                <img 
                  src={post.imageUrl} 
                  alt={post.title} 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <div className="p-6 md:p-8">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  {post.category}
                </Badge>
                <span className="text-gray-500">•</span>
                <time dateTime={new Date(post.publishedAt.seconds * 1000).toISOString()} className="text-sm text-gray-500">
                  {formatPublishedDate(post.publishedAt)}
                </time>
                <span className="text-gray-500">•</span>
                <span className="text-sm text-gray-500">
                  {Math.ceil(post.content.length / 500)} min read
                </span>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-6">{post.title}</h1>
              
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={post.authorImageUrl} alt={post.authorName} />
                    <AvatarFallback>{getInitials(post.authorName)}</AvatarFallback>
                  </Avatar>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{post.authorName}</p>
                    <p className="text-sm text-gray-500">Staff Writer</p>
                  </div>
                </div>
                <Button variant="outline" onClick={handleShare}>
                  <Share2 className="mr-2 h-4 w-4" /> Share
                </Button>
              </div>
              
              <div className="prose max-w-none">
                <p className="whitespace-pre-line">{post.content}</p>
              </div>
              
              <Separator className="my-8" />
              
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold">Tags</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="outline">{post.category}</Badge>
                    <Badge variant="outline">Community</Badge>
                    <Badge variant="outline">Hope Foundation</Badge>
                  </div>
                </div>
                <Button onClick={handleShare}>
                  <Share2 className="mr-2 h-4 w-4" /> Share This Article
                </Button>
              </div>
            </div>
          </article>
          
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {displayPosts
                .filter(p => p.id !== post.id && p.category === post.category)
                .slice(0, 3)
                .map((relatedPost) => (
                  <Card key={relatedPost.id} className="overflow-hidden">
                    {relatedPost.imageUrl && (
                      <div className="h-40 overflow-hidden">
                        <img 
                          src={relatedPost.imageUrl} 
                          alt={relatedPost.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <CardContent className="p-4">
                      <Badge variant="secondary" className="mb-2 bg-blue-100 text-blue-800">
                        {relatedPost.category}
                      </Badge>
                      <h3 className="text-lg font-semibold mb-2">
                        <a 
                          href={`/news/${relatedPost.id}`} 
                          className="hover:text-primary transition-colors"
                        >
                          {relatedPost.title}
                        </a>
                      </h3>
                      <p className="text-sm text-gray-500 mb-2">
                        {formatPublishedDate(relatedPost.publishedAt)}
                      </p>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // News listing page
  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">Latest News</h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Stay updated on our latest activities, success stories, and announcements.
          </p>
        </div>

        <div className="mb-8 flex flex-col md:flex-row justify-between gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full md:w-80"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(category)}
              >
                {category === 'all' ? 'All Categories' : category}
              </Button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array(6).fill(0).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardContent className="p-6">
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-6 w-full mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-4" />
                  <div className="flex items-center">
                    <Skeleton className="h-10 w-10 rounded-full mr-3" />
                    <div>
                      <Skeleton className="h-4 w-32 mb-1" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <Card key={post.id} className="flex flex-col overflow-hidden">
                  <div className="flex-shrink-0 h-48">
                    <img 
                      className="h-full w-full object-cover" 
                      src={post.imageUrl} 
                      alt={post.title} 
                    />
                  </div>
                  <CardContent className="flex-1 p-6 flex flex-col justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-primary">
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                          {post.category}
                        </Badge>
                      </p>
                      <a href={`/news/${post.id}`} className="block mt-2">
                        <p className="text-xl font-semibold text-gray-900 hover:text-primary transition-colors">
                          {post.title}
                        </p>
                        <p className="mt-3 text-base text-gray-500">
                          {post.content.length > 100 
                            ? `${post.content.substring(0, 100)}...` 
                            : post.content}
                        </p>
                      </a>
                    </div>
                    <div className="mt-6 flex items-center">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={post.authorImageUrl} alt={post.authorName} />
                        <AvatarFallback>{getInitials(post.authorName)}</AvatarFallback>
                      </Avatar>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                          {post.authorName}
                        </p>
                        <div className="flex space-x-1 text-sm text-gray-500">
                          <time dateTime={new Date(post.publishedAt.seconds * 1000).toISOString()}>
                            {formatPublishedDate(post.publishedAt)}
                          </time>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-lg shadow">
              <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-1">No articles found</h3>
              <p className="text-gray-500 mb-6">
                {searchQuery ? 
                  `No articles match your search for "${searchQuery}"` : 
                  'No articles are available in this category.'
                }
              </p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                }}
              >
                Clear Filters
              </Button>
            </div>
          )
        )}

        {!loading && filteredPosts.length > 0 && filteredPosts.length < displayPosts.length && (
          <div className="mt-8 text-center">
            <p className="text-gray-500 mb-4">
              Showing {filteredPosts.length} of {displayPosts.length} articles
            </p>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('all');
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Subscribe to Our Newsletter</h2>
          <p className="max-w-2xl mx-auto text-lg text-gray-500 mb-8">
            Get the latest news and updates delivered directly to your inbox.
          </p>
          <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
            <Input
              type="email"
              placeholder="Your email address"
              className="flex-grow"
            />
            <Button>Subscribe</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsPage;
