import { 
  HandHelpingIcon, 
  Calendar, 
  Users, 
  Heart 
} from 'lucide-react';

interface ImpactStat {
  icon: React.ReactNode;
  value: string;
  label: string;
  bgColor: string;
}

const Impact = () => {
  const stats: ImpactStat[] = [
    {
      icon: <HandHelpingIcon className="h-8 w-8" />,
      value: "5K+",
      label: "Volunteers Engaged",
      bgColor: "bg-primary"
    },
    {
      icon: <Calendar className="h-8 w-8" />,
      value: "200+",
      label: "Events Organized",
      bgColor: "bg-secondary"
    },
    {
      icon: <Users className="h-8 w-8" />,
      value: "10K+",
      label: "People Helped",
      bgColor: "bg-accent"
    },
    {
      icon: <Heart className="h-8 w-8" />,
      value: "$2M+",
      label: "Funds Raised",
      bgColor: "bg-indigo-500"
    }
  ];

  return (
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base font-semibold text-primary tracking-wide uppercase">
            Our Impact
          </h2>
          <p className="mt-1 text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Making a Difference Together
          </p>
        </div>

        <div className="mt-10">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className={`flex items-center justify-center h-20 w-20 rounded-md ${stat.bgColor} text-white mx-auto`}>
                  {stat.icon}
                </div>
                <p className="mt-5 text-5xl font-extrabold text-gray-900">{stat.value}</p>
                <p className="mt-2 text-lg text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Impact;
