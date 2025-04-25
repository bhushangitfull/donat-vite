import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  addNewsPost, 
  getNewsPosts, 
  updateNewsPost, 
  deleteNewsPost, 
  uploadImage 
} from '@/lib/firebase';
import { Newspaper, Upload, Trash2, Edit, Plus } from 'lucide-react';
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

const NewsForm = () => {
  const [newsPosts, setNewsPosts] = useState<NewsPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  
  // Form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('News');
  const [authorName, setAuthorName] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [authorImage, setAuthorImage] = useState<File | null>(null);
  const [authorImageUrl, setAuthorImageUrl] = useState('');
  const [authorImagePreview, setAuthorImagePreview] = useState('');
  
  const { toast } = useToast();

  useEffect(() => {
    fetchNewsPosts();
  }, []);

  const fetchNewsPosts = async () => {
    try {
      setLoading(true);
      const fetchedPosts = await getNewsPosts();
      
      // Sort posts by publish date (newest first)
      const sortedPosts = fetchedPosts.sort((a: NewsPost, b: NewsPost) => {
        const dateA = new Date(a.publishedAt.seconds * 1000);
        const dateB = new Date(b.publishedAt.seconds * 1000);
        return dateB.getTime() - dateA.getTime();
      });
      
      setNewsPosts(sortedPosts);
    } catch (error) {
      console.error("Error fetching news posts:", error);
      toast({
        title: "Error loading news",
        description: "Failed to load news posts. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setContent('');
    setCategory('News');
    setAuthorName('');
    setImage(null);
    setImageUrl('');
    setImagePreview('');
    setAuthorImage(null);
    setAuthorImageUrl('');
    setAuthorImagePreview('');
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

  const handleAuthorImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAuthorImage(file);
      
      // Create image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAuthorImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditNewsPost = (post: NewsPost) => {
    setEditing(post.id);
    setTitle(post.title);
    setContent(post.content);
    setCategory(post.category);
    setAuthorName(post.authorName);
    setImageUrl(post.imageUrl || '');
    setImagePreview(post.imageUrl || '');
    setAuthorImageUrl(post.authorImageUrl || '');
    setAuthorImagePreview(post.authorImageUrl || '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !content || !category || !authorName) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setSubmitting(true);
      
      let finalImageUrl = imageUrl;
      let finalAuthorImageUrl = authorImageUrl;
      
      // Upload images if new ones are selected
      if (image) {
        finalImageUrl = await uploadImage(image, 'news');
      }
      
      if (authorImage) {
        finalAuthorImageUrl = await uploadImage(authorImage, 'authors');
      }
      
      const postData = {
        title,
        content,
        category,
        authorName,
        imageUrl: finalImageUrl,
        authorImageUrl: finalAuthorImageUrl,
      };
      
      if (editing) {
        await updateNewsPost(editing, postData);
        toast({
          title: "News post updated",
          description: "The news post has been updated successfully",
        });
      } else {
        await addNewsPost(postData);
        toast({
          title: "News post created",
          description: "New news post has been created successfully",
        });
      }
      
      resetForm();
      fetchNewsPosts();
    } catch (error) {
      console.error("Error saving news post:", error);
      toast({
        title: "Error saving news post",
        description: "Failed to save the news post. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteNewsPost = async (id: string) => {
    if (confirm("Are you sure you want to delete this news post?")) {
      try {
        await deleteNewsPost(id);
        toast({
          title: "News post deleted",
          description: "The news post has been deleted successfully",
        });
        fetchNewsPosts();
      } catch (error) {
        console.error("Error deleting news post:", error);
        toast({
          title: "Error deleting news post",
          description: "Failed to delete the news post. Please try again later.",
          variant: "destructive",
        });
      }
    }
  };

  const formatPublishedDate = (date: { seconds: number; nanoseconds: number }) => {
    const publishedDate = new Date(date.seconds * 1000);
    return format(publishedDate, 'MMMM d, yyyy');
  };

  const categories = ['News', 'Success Story', 'Announcement', 'Event Recap', 'Community Spotlight'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          {editing ? 'Edit News Post' : 'Create News Post'}
        </h2>
        {editing && (
          <Button variant="outline" onClick={resetForm}>
            Cancel Editing
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Post Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Post Title*</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter post title"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="content">Content*</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your post content here"
                rows={6}
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category*</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="authorName">Author Name*</Label>
                <Input
                  id="authorName"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="Enter author name"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="image">Featured Image</Label>
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
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="authorImage">Author Image</Label>
              <div className="flex items-center space-x-4">
                <Input
                  id="authorImage"
                  type="file"
                  accept="image/*"
                  onChange={handleAuthorImageChange}
                  className="flex-1"
                />
                <Upload className="h-5 w-5 text-gray-400" />
              </div>
              
              {authorImagePreview && (
                <div className="mt-2">
                  <p className="text-sm text-gray-500 mb-2">Author Image Preview:</p>
                  <div className="relative w-20 h-20 overflow-hidden rounded-full">
                    <img
                      src={authorImagePreview}
                      alt="Author Preview"
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
                  : (editing ? "Update Post" : "Create Post")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Separator />
      
      <h3 className="text-xl font-semibold text-gray-900">Published Posts</h3>
      
      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : newsPosts.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Newspaper className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p>No news posts found. Create your first post above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {newsPosts.map((post) => (
            <Card key={post.id} className="overflow-hidden">
              {post.imageUrl && (
                <div className="h-40 overflow-hidden">
                  <img 
                    src={post.imageUrl} 
                    alt={post.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <CardContent className="p-4">
                <div className="mb-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {post.category}
                  </span>
                </div>
                <h4 className="text-lg font-semibold mb-2">{post.title}</h4>
                <div className="flex items-center mb-2">
                  {post.authorImageUrl ? (
                    <img 
                      src={post.authorImageUrl} 
                      alt={post.authorName}
                      className="h-8 w-8 rounded-full mr-2"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-gray-200 mr-2 flex items-center justify-center text-xs font-medium">
                      {post.authorName.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium">{post.authorName}</p>
                    <p className="text-xs text-gray-500">{formatPublishedDate(post.publishedAt)}</p>
                  </div>
                </div>
                <p className="text-sm mb-4">
                  {post.content.substring(0, 100)}
                  {post.content.length > 100 ? '...' : ''}
                </p>
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleEditNewsPost(post)}
                  >
                    <Edit className="h-4 w-4 mr-1" /> Edit
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive"
                    onClick={() => handleDeleteNewsPost(post.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" /> Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {!editing && newsPosts.length > 0 && (
        <Button 
          className="mt-4 flex items-center"
          onClick={resetForm}
        >
          <Plus className="h-4 w-4 mr-2" /> Add Another Post
        </Button>
      )}
    </div>
  );
};

export default NewsForm;
