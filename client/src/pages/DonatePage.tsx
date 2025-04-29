import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Heart, DollarSign } from 'lucide-react';




interface Window { Razorpay: any; }

const DonatePage = () => {
  const [amount, setAmount] = useState(50);
  const [orderId, setOrderId] = useState<string | null>(null);
  const { toast } = useToast();



  useEffect(() => {
    // Set page title
    document.title = 'Donate | Hope Foundation';
    // Scroll to top on page load
    window.scrollTo(0, 0);
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

  const loadRazorpay = async () => {
    return new Promise<void>((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);
  
      script.onload = () => {
        resolve();
      };
    });
  
  };

  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);

  useEffect(() => {
    loadRazorpay();
  }, []);

  const handlePayment = async (amount: number) => {
    if (!isRazorpayLoaded) {
      return;
    }
    if (!orderId) {
        return;
      }

    const response = await fetch("/api/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: amount }),
    });

    const { orderId } = await response.json();

    const options = {
      key: process.env.VITE_RAZORPAY_KEY_ID, // Replace with your actual key
      amount: Math.round(amount * 100), // Convert to paise
      currency: "INR", // Or your desired currency
      order_id: orderId,
      handler: function (response: any) {
        toast({ description: "Payment Success!" });
      },
      prefill: { name: "User name", email: "user@example.com", contact: "9999999999" },
      notes: { address: "Razorpay Corporate Office" },
      theme: { color: "#3399cc" },
    };

    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  };

  

  useEffect(() => {
    let isMounted = true;
    loadRazorpay().then(() => {
      if (isMounted) {
        setIsRazorpayLoaded(true);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  // Impact statistics
  const impactStats = [
    { amount: "$25", impact: "Provides meals for 10 individuals at our community kitchen" },
    { amount: "$50", impact: "Supplies educational materials for 5 students in our tutoring program" },
    { amount: "$100", impact: "Funds a workshop for 15 participants on financial literacy" },
    { amount: "$250", impact: "Enables planting of 20 trees in urban neighborhoods" },
    { amount: "$500", impact: "Supports a community garden project for six months" },
    { amount: "$1000", impact: "Underwrites a scholarship for one deserving student" }
  ];

  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero section */}
        <div className="text-center mb-12">
          <Heart className="h-16 w-16 text-primary mx-auto mb-4" />
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">Make a Donation</h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Your generosity powers our mission. Every donation, regardless of size, 
            makes a meaningful impact in our community.
          </p>
        </div>

       
          <div className="max-w-3xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Choose Donation Amount</CardTitle>
                <CardDescription>
                  Select from our suggested amounts or enter a custom amount
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="one-time" className="mb-6">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="one-time">One-Time Donation</TabsTrigger>
                    <TabsTrigger value="monthly">Monthly Donation</TabsTrigger>
                  </TabsList>
                  <TabsContent value="one-time" className="pt-4">
                    <p className="text-gray-500 mb-4">
                      Make a one-time contribution to support our programs and community initiatives.
                    </p>
                  </TabsContent>
                  <TabsContent value="monthly" className="pt-4">
                    <p className="text-gray-500 mb-4">
                      Become a sustaining donor with a monthly contribution. Your recurring support helps us plan for
                      long-term programs and ensures consistent resources for our community.
                    </p>
                  </TabsContent>
                </Tabs>

                <div className="grid grid-cols-3 gap-3 mb-6">
                  {[25, 50, 100, 250, 500, 1000].map((donationAmount) => (
                    <Button
                      key={donationAmount}
                      variant={amount === donationAmount ? "default" : "outline"}
                      className={`h-14 text-lg ${
                        amount === donationAmount
                          ? 'bg-primary text-white'
                          : 'bg-white text-gray-900'
                      }`}
                      onClick={() => handleAmountSelect(donationAmount)}
                    >
                      ${donationAmount}
                    </Button>
                  ))}
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Custom Amount
                  </label>
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
                  onClick={() => handlePayment(amount)}
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

        {/* Additional Ways to Give */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Other Ways to Give</h2>
          <p className="max-w-2xl mx-auto text-lg text-gray-500">
            Beyond online donations, there are many ways to support our mission.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Monthly Giving</h3>
              <p className="text-gray-600 mb-4">
                Join our sustaining donors program and make a recurring impact throughout the year.
              </p>
              <Button variant="outline">Learn More</Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Corporate Matching</h3>
              <p className="text-gray-600 mb-4">
                Many employers match charitable contributions. Check if your company has a matching gift program.
              </p>
              <Button variant="outline">Learn More</Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Planned Giving</h3>
              <p className="text-gray-600 mb-4">
                Include Hope Foundation in your estate planning and leave a lasting legacy.
              </p>
              <Button variant="outline">Learn More</Button>
            </CardContent>
          </Card>
        </div>

        {/* Donor Recognition */}
        <div className="mt-20 bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Valued Supporters</h2>
          <p className="text-lg text-gray-600 mb-8">
            We're grateful to the individuals, businesses, and foundations whose generosity makes our work possible.
          </p>
          <Button className="bg-primary hover:bg-blue-700">View Donor Wall</Button>
        </div>

        {/* FAQs */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Donation FAQs</h2>
          <div className="max-w-3xl mx-auto space-y-4">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-2">Is my donation tax-deductible?</h3>
                <p className="text-gray-600">
                  Yes, Hope Foundation is a registered 501(c)(3) nonprofit organization. Your donation is tax-deductible to the fullest extent allowed by law.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-2">Can I specify where my donation goes?</h3>
                <p className="text-gray-600">
                  Yes, you can designate your gift for a specific program or initiative. If you'd like to do so, please include a note with your donation or contact us directly.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-2">How is my donation used?</h3>
                <p className="text-gray-600">
                  Your donation directly supports our community programs, including education initiatives, food security programs, community gardens, and youth development projects.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-2">Is my payment information secure?</h3> 
                <p className="text-gray-600">
                  Absolutely. We use a PCI-compliant payment processor, to handle all transactions securely. Your financial information is never stored on our servers.
                </p>
              </CardContent>
            </Card>
          </div> 
        </div>

        {/* Contact */}
        <div className="mt-20 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Have Questions?</h2>
          <p className="text-lg text-gray-600 mb-8">
            Our team is here to help with any questions about donating to Hope Foundation.
          </p>
          <Button variant="outline" className="mx-auto">Contact Us</Button>
        </div>
      </div>
    </div>
  );
};

export default DonatePage;
