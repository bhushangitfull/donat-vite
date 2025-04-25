import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChevronRight } from 'lucide-react';
import { getNewsPosts } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

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

const News = () => {
  const [news, setNews] = useState<NewsPost[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const fetchedNews = await getNewsPosts();
        
        // Sort by published date (newest first)
        const sortedNews = fetchedNews.sort((a: NewsPost, b: NewsPost) => {
          const dateA = new Date(a.publishedAt.seconds * 1000);
          const dateB = new Date(b.publishedAt.seconds * 1000);
          return dateB.getTime() - dateA.getTime();
        });
        
        // Limit to 3 news posts for homepage
        setNews(sortedNews.slice(0, 3));
      } catch (error) {
        console.error("Error fetching news:", error);
        toast({
          title: "Error loading news",
          description: "Failed to load latest news. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [toast]);

  // Create placeholder news if none are found
  const placeholderNews: NewsPost[] = [
    {
      id: "1",
      title: "Urban Reforestation Project Completes First Phase",
      content: "Over 500 trees planted across downtown neighborhoods thanks to our amazing volunteers and donors.",
      category: "News",
      imageUrl: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      authorName: "Emma Rodriguez",
      authorImageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      publishedAt: { seconds: Date.now() / 1000 - 86400 * 7, nanoseconds: 0 }
    },
    {
      id: "2",
      title: "Scholarship Program Helps 30 Students Achieve College Dreams",
      content: "Our annual scholarship fund awarded $150,000 to deserving students from underserved communities.",
      category: "Success Story",
      imageUrl: "https://images.unsplash.com/photo-1608555855762-2b657eb1c348?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      authorName: "Michael Chen",
      authorImageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      publishedAt: { seconds: Date.now() / 1000 - 86400 * 21, nanoseconds: 0 }
    },
    {
      id: "3",
      title: "New Community Center Opening in Westside",
      content: "Join us for the grand opening of our new community center offering resources, classes, and support services.",
      category: "Announcement",
      imageUrl: "https://images.unsplash.com/photo-1560252829-804f1aedf1be?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      authorName: "Sarah Johnson",
      authorImageUrl: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      publishedAt: { seconds: Date.now() / 1000 - 86400 * 35, nanoseconds: 0 }
    }
  ];

  const displayNews = news.length > 0 ? news : (loading ? [] : placeholderNews);

  const formatPublishedDate = (date: { seconds: number; nanoseconds: number }) => {
    const publishedDate = new Date(date.seconds * 1000);
    return format(publishedDate, 'MMM d, yyyy');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  };

  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Latest News</h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Stay updated on our latest activities and success stories.
          </p>
        </div>

        <div className="mt-12 max-w-lg mx-auto grid gap-8 lg:grid-cols-3 lg:max-w-none">
          {loading ? (
            // Loading skeletons
            Array(3).fill(0).map((_, i) => (
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
            ))
          ) : (
            displayNews.map((post) => (
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
                    <Link href={`/news/${post.id}`} className="block mt-2">
                      <p className="text-xl font-semibold text-gray-900 hover:text-primary transition-colors">
                        {post.title}
                      </p>
                      <p className="mt-3 text-base text-gray-500">
                        {post.content.length > 100 
                          ? `${post.content.substring(0, 100)}...` 
                          : post.content}
                      </p>
                    </Link>
                  </div>
                  <div className="mt-6 flex items-center">
                    <Avatar className="h-10 w-10 rounded-full">
                      <AvatarImage 
                        src={post.authorImageUrl} 
                        alt={post.authorName} 
                      />
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
                        <span aria-hidden="true">&middot;</span>
                        <span>{Math.ceil(post.content.length / 500)} min read</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <div className="mt-10 text-center">
          <Link href="/news">
            <Button variant="outline" className="text-primary bg-white hover:bg-gray-50 shadow">
              View All News <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default News;
