import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { apiRequest } from '@/lib/queryClient';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { DollarSign, Heart } from 'lucide-react';

interface DonationFormProps {
  clientSecret: string;
}

const DonationForm = ({ clientSecret }: DonationFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  
  const [processing, setProcessing] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [purpose, setPurpose] = useState('General Fund');

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }
    
    if (!name || !email) {
      toast({
        title: "Missing information",
        description: "Please provide your name and email address",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setProcessing(true);
      
      // Confirm the payment with Stripe
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/donation-success`,
          payment_method_data: {
            billing_details: {
              name,
              email,
            },
          },
        },
        redirect: 'if_required',
      });
      
      if (error) {
        toast({
          title: "Payment failed",
          description: error.message || "Your payment could not be processed. Please try again.",
          variant: "destructive",
        });
        return;
      }
      
      if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Record the donation details in the database
        await apiRequest('POST', '/api/record-donation', {
          name,
          email,
          message,
          isRecurring,
          purpose,
          amount: paymentIntent.amount / 100,
          stripePaymentId: paymentIntent.id,
        });
        
        toast({
          title: "Thank you for your donation!",
          description: "Your contribution will help us make a difference in our community.",
        });
        
        // Redirect to success page
        window.location.href = `${window.location.origin}/donation-success`;
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment error",
        description: "There was an error processing your payment. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center">
          <Heart className="mr-2 h-6 w-6 text-primary" /> Make a Donation
        </CardTitle>
        <CardDescription>
          Your generosity helps us continue our mission of community support and development.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handlePaymentSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name*</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
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
                  placeholder="your.email@example.com"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="message">Message (Optional)</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Share why you're donating or any special instructions"
                rows={3}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="recurring" 
                checked={isRecurring}
                onCheckedChange={(checked) => setIsRecurring(checked === true)}
              />
              <Label
                htmlFor="recurring"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Make this a monthly donation
              </Label>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="purpose">Donation Purpose (Optional)</Label>
              <Select value={purpose} onValueChange={setPurpose}>
                <SelectTrigger id="purpose">
                  <SelectValue placeholder="Select a purpose" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="General Fund">General Fund</SelectItem>
                  <SelectItem value="Education Programs">Education Programs</SelectItem>
                  <SelectItem value="Food Security">Food Security</SelectItem>
                  <SelectItem value="Community Gardens">Community Gardens</SelectItem>
                  <SelectItem value="Youth Development">Youth Development</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="pt-2 space-y-2">
              <Label className="text-base font-medium">Payment Information</Label>
              <div className="p-4 border rounded-md bg-gray-50">
                <PaymentElement />
              </div>
            </div>
          </div>
          
          <Button 
            type="submit" 
            disabled={!stripe || processing}
            className="w-full py-6 text-lg"
          >
            {processing ? (
              <span className="flex items-center">
                <span className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                Processing...
              </span>
            ) : (
              <span className="flex items-center">
                <DollarSign className="mr-2 h-5 w-5" /> Complete Donation
              </span>
            )}
          </Button>
          
          <div className="text-center text-sm text-gray-500 pt-2">
            <p>Your donation is tax-deductible to the extent allowed by law.</p>
            <p className="mt-1">All transactions are secure and encrypted.</p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default DonationForm;
