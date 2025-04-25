import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { 
  getMenuItems, 
  updateMenuItem, 
  addMenuItem, 
  deleteMenuItem 
} from '@/lib/firebase';
import { Menu as MenuIcon, Trash2, Edit, Plus, ArrowUpDown } from 'lucide-react';

interface MenuItem {
  id: string;
  title: string;
  path: string;
  order: number;
  isActive: boolean;
}

const MenuForm = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  
  // Form state
  const [title, setTitle] = useState('');
  const [path, setPath] = useState('');
  const [order, setOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);
  
  const { toast } = useToast();

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const fetchedItems = await getMenuItems();
      
      // Sort items by order
      const sortedItems = fetchedItems.sort((a: MenuItem, b: MenuItem) => a.order - b.order);
      
      setMenuItems(sortedItems);
    } catch (error) {
      console.error("Error fetching menu items:", error);
      toast({
        title: "Error loading menu",
        description: "Failed to load menu items. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setPath('');
    setOrder(menuItems.length > 0 ? Math.max(...menuItems.map(item => item.order)) + 1 : 1);
    setIsActive(true);
    setEditing(null);
  };

  const handleEditMenuItem = (item: MenuItem) => {
    setEditing(item.id);
    setTitle(item.title);
    setPath(item.path);
    setOrder(item.order);
    setIsActive(item.isActive);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !path) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setSubmitting(true);
      
      const itemData = {
        title,
        path,
        order,
        isActive,
      };
      
      if (editing) {
        await updateMenuItem(editing, itemData);
        toast({
          title: "Menu item updated",
          description: "The menu item has been updated successfully",
        });
      } else {
        await addMenuItem(itemData);
        toast({
          title: "Menu item created",
          description: "New menu item has been created successfully",
        });
      }
      
      resetForm();
      fetchMenuItems();
    } catch (error) {
      console.error("Error saving menu item:", error);
      toast({
        title: "Error saving menu item",
        description: "Failed to save the menu item. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteMenuItem = async (id: string) => {
    if (confirm("Are you sure you want to delete this menu item?")) {
      try {
        await deleteMenuItem(id);
        toast({
          title: "Menu item deleted",
          description: "The menu item has been deleted successfully",
        });
        fetchMenuItems();
      } catch (error) {
        console.error("Error deleting menu item:", error);
        toast({
          title: "Error deleting menu item",
          description: "Failed to delete the menu item. Please try again later.",
          variant: "destructive",
        });
      }
    }
  };

  const handleMoveItem = async (id: string, direction: 'up' | 'down') => {
    const itemIndex = menuItems.findIndex(item => item.id === id);
    if (
      (direction === 'up' && itemIndex === 0) || 
      (direction === 'down' && itemIndex === menuItems.length - 1)
    ) {
      return;
    }

    const swapIndex = direction === 'up' ? itemIndex - 1 : itemIndex + 1;
    
    try {
      const updatedItems = [...menuItems];
      const currentItem = { ...updatedItems[itemIndex] };
      const swapItem = { ...updatedItems[swapIndex] };
      
      // Swap orders
      const tempOrder = currentItem.order;
      currentItem.order = swapItem.order;
      swapItem.order = tempOrder;
      
      // Update in Firebase
      await updateMenuItem(currentItem.id, { order: currentItem.order });
      await updateMenuItem(swapItem.id, { order: swapItem.order });
      
      // Update local state
      updatedItems[itemIndex] = currentItem;
      updatedItems[swapIndex] = swapItem;
      
      setMenuItems(updatedItems.sort((a, b) => a.order - b.order));
      
      toast({
        title: "Menu order updated",
        description: "The menu item order has been updated successfully",
      });
    } catch (error) {
      console.error("Error updating menu order:", error);
      toast({
        title: "Error updating menu order",
        description: "Failed to update the menu order. Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          {editing ? 'Edit Menu Item' : 'Add Menu Item'}
        </h2>
        {editing && (
          <Button variant="outline" onClick={resetForm}>
            Cancel Editing
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Menu Item Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title*</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter menu item title"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="path">Path/URL*</Label>
              <Input
                id="path"
                value={path}
                onChange={(e) => setPath(e.target.value)}
                placeholder="/about"
                required
              />
              <p className="text-xs text-gray-500">
                Start with / for internal links (e.g., /about) or include full URL for external links (e.g., https://example.com)
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="order">Display Order</Label>
              <Input
                id="order"
                type="number"
                value={order}
                onChange={(e) => setOrder(parseInt(e.target.value))}
                placeholder="1"
                min="1"
              />
              <p className="text-xs text-gray-500">
                Lower numbers appear first in the menu
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={isActive}
                onCheckedChange={setIsActive}
              />
              <Label htmlFor="isActive">Active</Label>
              <p className="text-xs text-gray-500 ml-2">
                Inactive items will not appear in the menu
              </p>
            </div>
            
            <div className="pt-4">
              <Button 
                type="submit" 
                className="w-full md:w-auto"
                disabled={submitting}
              >
                {submitting 
                  ? (editing ? "Updating..." : "Creating...") 
                  : (editing ? "Update Menu Item" : "Add Menu Item")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Separator />
      
      <h3 className="text-xl font-semibold text-gray-900">Current Menu Items</h3>
      
      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : menuItems.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <MenuIcon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p>No menu items found. Create your first menu item above.</p>
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {menuItems.map((item, index) => (
                <div key={item.id} className={`p-4 flex items-center justify-between ${!item.isActive ? 'opacity-60' : ''}`}>
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0 bg-gray-100 h-10 w-10 rounded-full flex items-center justify-center">
                      <MenuIcon className="h-5 w-5 text-gray-500" />
                    </div>
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-gray-500">{item.path}</p>
                    </div>
                    {!item.isActive && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        Hidden
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex flex-col">
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={() => handleMoveItem(item.id, 'up')}
                        disabled={index === 0}
                        className="h-7 w-7"
                      >
                        <ArrowUpDown className="h-4 w-4 rotate-90" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={() => handleMoveItem(item.id, 'down')}
                        disabled={index === menuItems.length - 1}
                        className="h-7 w-7"
                      >
                        <ArrowUpDown className="h-4 w-4 -rotate-90" />
                      </Button>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleEditMenuItem(item)}
                    >
                      <Edit className="h-4 w-4 mr-1" /> Edit
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => handleDeleteMenuItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" /> Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      {!editing && menuItems.length > 0 && (
        <Button 
          className="mt-4 flex items-center"
          onClick={resetForm}
        >
          <Plus className="h-4 w-4 mr-2" /> Add Another Menu Item
        </Button>
      )}
    </div>
  );
};

export default MenuForm;
