import { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const Donate = () => {
  const [selectedAmount, setSelectedAmount] = useState('50');
  const [customAmount, setCustomAmount] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [purpose, setPurpose] = useState('General Fund');
  const { toast } = useToast();

  const handleAmountClick = (amount: string) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers and a single decimal point
    const value = e.target.value.replace(/[^0-9.]/g, '');
    
    // Prevent multiple decimal points
    const parts = value.split('.');
    const formattedValue = parts.length > 2 
      ? parts[0] + '.' + parts.slice(1).join('')
      : value;
    
    setCustomAmount(formattedValue);
    setSelectedAmount('custom');
  };

  return (
    <div id="donate" className="bg-primary py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
          <div>
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Make a Difference Today
            </h2>
            <p className="mt-4 text-lg leading-6 text-gray-100">
              Your donation helps us continue our mission of building stronger communities
              and supporting those in need. Every contribution, no matter the size,
              makes an impact.
            </p>
            <div className="mt-8">
              <div className="flex flex-col space-y-4">
                <div className="flex flex-wrap gap-4">
                  <div className="inline-flex items-center px-2.5 py-1.5 rounded-full text-sm font-medium bg-white text-primary">
                    Education Programs
                  </div>
                  <div className="inline-flex items-center px-2.5 py-1.5 rounded-full text-sm font-medium bg-white text-primary">
                    Community Gardens
                  </div>
                  <div className="inline-flex items-center px-2.5 py-1.5 rounded-full text-sm font-medium bg-white text-primary">
                    Food Security
                  </div>
                  <div className="inline-flex items-center px-2.5 py-1.5 rounded-full text-sm font-medium bg-white text-primary">
                    Youth Development
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-10">
              <h3 className="text-xl font-medium text-white">Join Our Monthly Donors Program</h3>
              <p className="mt-2 text-base text-gray-100">
                Become a sustaining donor with a monthly contribution and help us plan for
                long-term programs.
              </p>
            </div>
          </div>
          <div className="mt-12 lg:mt-0">
            <div className="bg-white rounded-lg shadow-xl overflow-hidden">
              <div className="px-6 py-8 sm:p-10">
                <div>
                  <h3 className="text-2xl font-medium text-gray-900">Make a Donation</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Support our work with a one-time or recurring donation.
                  </p>
                </div>
                <div className="mt-8">
                  <div className="flex flex-col space-y-4">
                    <div>
                      <label htmlFor="donationAmount" className="block text-sm font-medium text-gray-700">
                        Amount
                      </label>
                      <div className="mt-1 grid grid-cols-4 gap-3">
                        {['25', '50', '100', '250'].map((amount) => (
                          <div key={amount}>
                            <Button
                              type="button"
                              variant={selectedAmount === amount ? "default" : "outline"}
                              className={`w-full ${
                                selectedAmount === amount
                                  ? 'bg-primary text-white'
                                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                              }`}
                              onClick={() => handleAmountClick(amount)}
                            >
                              ${amount}
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label htmlFor="customAmount" className="block text-sm font-medium text-gray-700">
                        Custom Amount
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 sm:text-sm">$</span>
                        </div>
                        <Input
                          type="text"
                          name="customAmount"
                          id="customAmount"
                          value={customAmount}
                          onChange={handleCustomAmountChange}
                          className="pl-7 pr-12"
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="recurring" 
                        checked={isRecurring}
                        onCheckedChange={(checked) => setIsRecurring(checked === true)}
                      />
                      <label
                        htmlFor="recurring"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Make this a monthly donation
                      </label>
                    </div>
                    <div>
                      <label htmlFor="donationPurpose" className="block text-sm font-medium text-gray-700">
                        Donation Purpose (Optional)
                      </label>
                      <Select value={purpose} onValueChange={setPurpose}>
                        <SelectTrigger id="donationPurpose" className="w-full mt-1">
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
                  </div>
                  <div className="mt-6">
                    <Link href="/donate">
                      <Button className="w-full py-3 px-4 bg-primary hover:bg-blue-700">
                        Donate Now
                      </Button>
                    </Link>
                  </div>
                  <div className="mt-4 text-center text-sm text-gray-500">
                    <p>Secure payment processing. Tax-deductible to the extent allowed by law.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Donate;
