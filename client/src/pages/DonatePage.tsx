import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Heart, DollarSign } from 'lucide-react';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const DonatePage = () => {
  const [amount, setAmount] = useState(50);
  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);
  const { toast } = useToast();

  const initiatePayment = (amount: number, orderId: string) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: Math.round(amount * 100),
      currency: 'INR',
      order_id: orderId,
      handler: function (response: any) {
        console.log('Payment successful:', response);
        toast({ description: 'Payment Successful!' });
      },
      prefill: {
        name: 'User Name',
        email: 'user@example.com',
        contact: '9999999999',
      },
      notes: {
        address: 'Hope Foundation Office',
      },
      theme: {
        color: '#3399cc',
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  useEffect(() => {
    document.title = 'Donate | Hope Foundation';
    window.scrollTo(0, 0);

    const loadRazorpay = () => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => setIsRazorpayLoaded(true);
      document.body.appendChild(script);
    };

    loadRazorpay();
  }, []);

  const handleAmountSelect = (selectedAmount: number) => {
    setAmount(selectedAmount);
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, '');
    if (value === '') {
      setAmount(0);
      return;
    }
    setAmount(parseFloat(value));
  };

  const handlePayment = async () => {
    try {
      const res = await fetch('/api/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Backend error:", text);
        throw new Error('Failed to create Razorpay order');
      }

      const data = await res.json();
      console.log("Received order from backend:", data);

      const orderId = data.orderId;
      if (!orderId) {
        throw new Error("Order ID missing in backend response");
      }

      initiatePayment(amount, orderId); // Fixed: no arguments in original call
    } catch (error) {
      console.error("Error initiating payment:", error);
      toast({ description: 'Payment failed to initiate' });
    }
  };


  const impactStats = [
    { amount: '$25', impact: 'Provides meals for 10 individuals at our community kitchen' },
    { amount: '$50', impact: 'Supplies educational materials for 5 students' },
    { amount: '$100', impact: 'Funds a workshop on financial literacy' },
    { amount: '$250', impact: 'Enables planting of 20 trees' },
    { amount: '$500', impact: 'Supports a community garden for 6 months' },
    { amount: '$1000', impact: 'Underwrites a scholarship for one student' },
  ];

  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Heart className="h-16 w-16 text-primary mx-auto mb-4" />
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">Make a Donation</h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Your generosity powers our mission.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Choose Donation Amount</CardTitle>
              <CardDescription>Select a suggested amount or enter a custom one.</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="one-time" className="mb-6">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="one-time">One-Time</TabsTrigger>
                  <TabsTrigger value="monthly">Monthly</TabsTrigger>
                </TabsList>
                <TabsContent value="one-time" className="pt-4 text-gray-500">
                  One-time support for our programs.
                </TabsContent>
                <TabsContent value="monthly" className="pt-4 text-gray-500">
                  Recurring monthly support helps us plan long-term.
                </TabsContent>
              </Tabs>

              <div className="grid grid-cols-3 gap-3 mb-6">
                {[25, 50, 100, 250, 500, 1000].map((donationAmount) => (
                  <Button
                    key={donationAmount}
                    variant={amount === donationAmount ? 'default' : 'outline'}
                    className={`h-14 text-lg ${
                      amount === donationAmount ? 'bg-primary text-white' : 'bg-white text-gray-900'
                    }`}
                    onClick={() => handleAmountSelect(donationAmount)}
                  >
                    ${donationAmount}
                  </Button>
                ))}
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Custom Amount</label>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <Input
                    type="text"
                    value={amount === 0 ? '' : amount}
                    onChange={handleCustomAmountChange}
                    className="pl-7"
                    placeholder="Enter custom amount"
                  />
                </div>
              </div>

              <Button
                className="w-full py-6 text-lg"
                onClick={handlePayment}
                disabled={!amount || amount < 1 || !isRazorpayLoaded}
              >
                <DollarSign className="mr-2 h-5 w-5" /> Proceed to Donate
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Impact Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Your Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {impactStats.map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold text-primary mb-2">{stat.amount}</h3>
                  <p className="text-gray-700">{stat.impact}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Separator className="my-16" />
      </div>
    </div>
  );
};

export default DonatePage;