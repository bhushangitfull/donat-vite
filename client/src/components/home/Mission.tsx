import { 
  HandHelpingIcon,
  Sprout, 
  Users
} from 'lucide-react';

interface MissionPoint {
  icon: React.ReactNode;
  title: string;
  description: string;
  bgColor: string;
}

const Mission = () => {
  const missionPoints: MissionPoint[] = [
    {
      icon: <HandHelpingIcon className="h-6 w-6 text-white" />,
      title: "Community Support",
      description: "We provide resources, programs, and services that address critical needs in our community.",
      bgColor: "bg-primary"
    },
    {
      icon: <Sprout className="h-6 w-6 text-white" />,
      title: "Sustainable Solutions",
      description: "We develop long-term solutions that empower individuals and communities to thrive independently.",
      bgColor: "bg-secondary"
    },
    {
      icon: <Users className="h-6 w-6 text-white" />,
      title: "Volunteer Engagement",
      description: "We connect passionate volunteers with meaningful opportunities to make a difference.",
      bgColor: "bg-accent"
    }
  ];

  return (
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-primary font-semibold tracking-wide uppercase">
            Our Mission
          </h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Empowering Communities, Building Futures
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Hope Foundation is dedicated to addressing local needs through collective action, 
            fostering community resilience, and creating lasting positive change.
          </p>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {missionPoints.map((point, index) => (
              <div key={index} className="pt-6">
                <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className={`inline-flex items-center justify-center p-3 ${point.bgColor} rounded-md shadow-lg`}>
                        {point.icon}
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                      {point.title}
                    </h3>
                    <p className="mt-5 text-base text-gray-500">
                      {point.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mission;
