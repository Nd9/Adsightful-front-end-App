import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUsers, faTags, faPlus, faTimes, 
  faInfoCircle, faBullseye, faUserFriends
} from '@fortawesome/free-solid-svg-icons';
import Card from '../common/Card';
import Button from '../common/Button';
import InputField from '../common/InputField';
import Badge from '../common/Badge';

// Interface for the audience persona
interface AudiencePersona {
  id: string;
  name: string;
  description: string;
  interests: string[];
  behaviors: string[];
}

// Props for the AudienceSelection component
interface AudienceSelectionProps {
  audiencePersona: {
    name: string;
    ageRange: [number, number];
    gender: string[];
    interests: string[];
    behaviors: string[];
  };
  updateAudiencePersona: (audiencePersona: {
    name: string;
    ageRange: [number, number];
    gender: string[];
    interests: string[];
    behaviors: string[];
  }) => void;
  campaignData?: {
    audienceType: 'predefined' | 'custom';
    selectedPersonaId?: string;
    customAudience?: {
      interests: string[];
      behaviors: string[];
    };
  };
  updateCampaignData?: (data: {
    audienceType: 'predefined' | 'custom';
    selectedPersonaId?: string;
    customAudience?: {
      interests: string[];
      behaviors: string[];
    };
  }) => void;
}

// Predefined audience personas
export const PREDEFINED_PERSONAS: AudiencePersona[] = [
  {
    id: 'tech-enthusiasts',
    name: 'Tech Enthusiasts',
    description: 'Early adopters who are interested in the latest technology products and innovations',
    interests: ['Technology', 'Gadgets', 'Innovation', 'Startups'],
    behaviors: ['Researches products extensively', 'Follows tech news', 'High online spending']
  },
  {
    id: 'business-professionals',
    name: 'Business Professionals',
    description: 'Career-focused individuals looking for solutions to improve their work efficiency',
    interests: ['Business', 'Productivity', 'Networking', 'Professional Development'],
    behaviors: ['Researches work solutions', 'Active during business hours', 'Values efficiency']
  },
  {
    id: 'health-conscious',
    name: 'Health & Wellness Enthusiasts',
    description: 'People committed to healthy living and personal wellness',
    interests: ['Fitness', 'Nutrition', 'Wellness', 'Organic Products'],
    behaviors: ['Regular exercise', 'Health-conscious purchases', 'Research health topics']
  },
  {
    id: 'fashion-shoppers',
    name: 'Fashion Shoppers',
    description: 'Style-conscious consumers who follow fashion trends and make regular purchases',
    interests: ['Fashion', 'Shopping', 'Beauty', 'Lifestyle'],
    behaviors: ['Frequent online shopping', 'Brand conscious', 'Follows fashion influencers']
  },
  {
    id: 'parents',
    name: 'Modern Parents',
    description: 'Parents looking for products and information to support their families',
    interests: ['Parenting', 'Family Activities', "Children's Education", 'Family Health'],
    behaviors: ['Researches family products', 'Values safety and quality', 'Plans family activities']
  }
];

// Categories of interests for suggestions
const INTEREST_CATEGORIES = [
  { name: 'Technology', items: ['Smartphones', 'Computers', 'Smart Home', 'Wearables', 'VR/AR', 'AI', 'Robotics'] },
  { name: 'Entertainment', items: ['Movies', 'Music', 'Gaming', 'Streaming', 'Books', 'TV Shows', 'Concerts'] },
  { name: 'Lifestyle', items: ['Travel', 'Food', 'Fashion', 'Home Decor', 'Fitness', 'Wellness', 'Outdoor Activities'] },
  { name: 'Business', items: ['Entrepreneurship', 'Finance', 'Marketing', 'Management', 'E-commerce', 'Remote Work', 'Investing'] },
  { name: 'Education', items: ['Online Courses', 'Languages', 'Personal Development', 'Career Skills', 'Academic', 'Certifications'] }
];

// Categories of behaviors for suggestions
const BEHAVIOR_CATEGORIES = [
  { name: 'Shopping', items: ['Online Shoppers', 'Discount Seekers', 'Luxury Buyers', 'Comparison Shoppers', 'Brand Loyal'] },
  { name: 'Content Consumption', items: ['Video Watchers', 'Blog Readers', 'Podcast Listeners', 'Social Media Active', 'News Followers'] },
  { name: 'Tech Usage', items: ['Mobile-First', 'Desktop Users', 'Multi-Device', 'Early Adopters', 'Tech-Savvy'] },
  { name: 'Purchase Behavior', items: ['Researchers', 'Impulse Buyers', 'Seasonal Shoppers', 'Subscription Users', 'Frequent Purchasers'] }
];

const AudienceSelection: React.FC<AudienceSelectionProps> = ({ 
  audiencePersona, 
  updateAudiencePersona, 
  campaignData, 
  updateCampaignData 
}) => {
  // State for interests and behaviors input fields
  const [interestInput, setInterestInput] = useState('');
  const [behaviorInput, setBehaviorInput] = useState('');
  const [suggestedInterests, setSuggestedInterests] = useState<string[]>([]);
  const [suggestedBehaviors, setSuggestedBehaviors] = useState<string[]>([]);
  
  // Current interests and behaviors
  const [interests, setInterests] = useState<string[]>(
    audiencePersona?.interests || 
    campaignData?.customAudience?.interests || []
  );
  const [behaviors, setBehaviors] = useState<string[]>(
    audiencePersona?.behaviors || 
    campaignData?.customAudience?.behaviors || []
  );
  
  // Keep track of the audience type and selected persona
  const [audienceType, setAudienceType] = useState<'predefined' | 'custom'>(
    campaignData?.audienceType || 'predefined'
  );
  const [selectedPersonaId, setSelectedPersonaId] = useState<string | undefined>(
    campaignData?.selectedPersonaId
  );

  // Update campaign data when component state changes
  useEffect(() => {
    if (audienceType === 'predefined' && selectedPersonaId) {
      if (updateCampaignData) {
        updateCampaignData({
          audienceType,
          selectedPersonaId,
          customAudience: undefined
        });
      }
      // Also update the audiencePersona if using the new API
      if (updateAudiencePersona) {
        const selectedPersona = PREDEFINED_PERSONAS.find(p => p.id === selectedPersonaId);
        if (selectedPersona) {
          updateAudiencePersona({
            name: selectedPersona.name,
            ageRange: [18, 65],
            gender: [],
            interests: selectedPersona.interests,
            behaviors: selectedPersona.behaviors
          });
        }
      }
    } else if (audienceType === 'custom') {
      if (updateCampaignData) {
        updateCampaignData({
          audienceType,
          selectedPersonaId: undefined,
          customAudience: {
            interests,
            behaviors
          }
        });
      }
      // Also update the audiencePersona if using the new API
      if (updateAudiencePersona) {
        updateAudiencePersona({
          name: 'Custom Audience',
          ageRange: [18, 65],
          gender: [],
          interests,
          behaviors
        });
      }
    }
  }, [audienceType, selectedPersonaId, interests, behaviors, updateCampaignData, updateAudiencePersona]);

  // Handle selecting a predefined persona
  const handleSelectPersona = (personaId: string) => {
    setSelectedPersonaId(personaId);
    setAudienceType('predefined');
  };

  // Handle switching to custom audience creation
  const handleCustomAudience = () => {
    setAudienceType('custom');
    setSelectedPersonaId(undefined);
  };

  // Add interest to the list
  const handleAddInterest = () => {
    if (interestInput && !interests.includes(interestInput)) {
      setInterests([...interests, interestInput]);
      setInterestInput('');
    }
  };

  // Remove interest from the list
  const handleRemoveInterest = (interest: string) => {
    setInterests(interests.filter(item => item !== interest));
  };

  // Add behavior to the list
  const handleAddBehavior = () => {
    if (behaviorInput && !behaviors.includes(behaviorInput)) {
      setBehaviors([...behaviors, behaviorInput]);
      setBehaviorInput('');
    }
  };

  // Remove behavior from the list
  const handleRemoveBehavior = (behavior: string) => {
    setBehaviors(behaviors.filter(item => item !== behavior));
  };

  // Update suggested interests based on input
  const handleInterestInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInterestInput(value);
    
    if (value.length > 1) {
      const suggestions: string[] = [];
      INTEREST_CATEGORIES.forEach(category => {
        category.items.forEach(item => {
          if (item.toLowerCase().includes(value.toLowerCase()) && !interests.includes(item)) {
            suggestions.push(item);
          }
        });
      });
      setSuggestedInterests(suggestions.slice(0, 5));
    } else {
      setSuggestedInterests([]);
    }
  };

  // Update suggested behaviors based on input
  const handleBehaviorInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setBehaviorInput(value);
    
    if (value.length > 1) {
      const suggestions: string[] = [];
      BEHAVIOR_CATEGORIES.forEach(category => {
        category.items.forEach(item => {
          if (item.toLowerCase().includes(value.toLowerCase()) && !behaviors.includes(item)) {
            suggestions.push(item);
          }
        });
      });
      setSuggestedBehaviors(suggestions.slice(0, 5));
    } else {
      setSuggestedBehaviors([]);
    }
  };

  // Handle selecting a suggested interest
  const handleSelectSuggestedInterest = (interest: string) => {
    setInterests([...interests, interest]);
    setInterestInput('');
    setSuggestedInterests([]);
  };

  // Handle selecting a suggested behavior
  const handleSelectSuggestedBehavior = (behavior: string) => {
    setBehaviors([...behaviors, behavior]);
    setBehaviorInput('');
    setSuggestedBehaviors([]);
  };

  // Find the selected persona based on ID
  const selectedPersona = PREDEFINED_PERSONAS.find(persona => persona.id === selectedPersonaId);

  // Helper function to get audience preview content
  const getAudiencePreview = () => {
    if (audienceType === 'predefined' && selectedPersona) {
      return (
        <div>
          <h3 className="font-medium text-gray-900">{selectedPersona.name}</h3>
          <p className="text-sm text-gray-500 mb-3">{selectedPersona.description}</p>
          
          <div className="space-y-3">
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">Interests:</p>
              <div className="flex flex-wrap gap-1">
                {selectedPersona.interests.map((interest, index) => (
                  <Badge key={index} color="blue">{interest}</Badge>
                ))}
              </div>
            </div>
            
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">Behaviors:</p>
              <div className="flex flex-wrap gap-1">
                {selectedPersona.behaviors.map((behavior, index) => (
                  <Badge key={index} color="green">{behavior}</Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    } else if (audienceType === 'custom') {
      if (interests.length === 0 && behaviors.length === 0) {
        return (
          <div className="text-gray-400 text-center py-4">
            No audience data added yet. Add interests and behaviors to define your custom audience.
          </div>
        );
      }
      
      return (
        <div className="space-y-3">
          {interests.length > 0 && (
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">Interests:</p>
              <div className="flex flex-wrap gap-1">
                {interests.map((interest, index) => (
                  <Badge key={index} color="blue">{interest}</Badge>
                ))}
              </div>
            </div>
          )}
          
          {behaviors.length > 0 && (
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">Behaviors:</p>
              <div className="flex flex-wrap gap-1">
                {behaviors.map((behavior, index) => (
                  <Badge key={index} color="green">{behavior}</Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }
    
    return (
      <div className="text-gray-400 text-center py-4">
        Select an audience persona or create a custom audience to see a preview.
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Audience Type Selection */}
      <div>
        <div className="flex space-x-4 mb-4">
          <Button
            variant={audienceType === 'predefined' ? 'primary' : 'outline'}
            onClick={() => setAudienceType('predefined')}
            leftIcon={<FontAwesomeIcon icon={faUserFriends} />}
            className="flex-1 md:flex-none"
          >
            Use Predefined Persona
          </Button>
          <Button
            variant={audienceType === 'custom' ? 'primary' : 'outline'}
            onClick={() => handleCustomAudience()}
            leftIcon={<FontAwesomeIcon icon={faBullseye} />}
            className="flex-1 md:flex-none"
          >
            Create Custom Audience
          </Button>
        </div>
      </div>

      {/* Predefined Personas */}
      {audienceType === 'predefined' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {PREDEFINED_PERSONAS.map((persona) => (
              <Card 
                key={persona.id} 
                className={`cursor-pointer transition-all ${
                  selectedPersonaId === persona.id 
                    ? 'border-blue-500 ring-2 ring-blue-200' 
                    : 'hover:border-gray-300'
                }`}
                onClick={() => handleSelectPersona(persona.id)}
              >
                <div className="p-4">
                  <h3 className="font-medium text-gray-900">{persona.name}</h3>
                  <p className="text-sm text-gray-500 mt-1 mb-2">{persona.description}</p>
                  
                  <div className="flex flex-wrap gap-1 mb-2">
                    {persona.interests.slice(0, 3).map((interest, index) => (
                      <Badge key={index} color="blue">{interest}</Badge>
                    ))}
                    {persona.interests.length > 3 && (
                      <span className="text-xs text-gray-500">+{persona.interests.length - 3} more</span>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Custom Audience Builder */}
      {audienceType === 'custom' && (
        <div className="space-y-4">
          {/* Interests Section */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 flex items-center">
              Interests
              <div className="ml-2 group relative">
                <FontAwesomeIcon 
                  icon={faInfoCircle} 
                  className="h-4 w-4 text-gray-400 cursor-help" 
                />
                <div className="hidden group-hover:block absolute z-10 w-64 p-2 text-xs bg-gray-800 text-white rounded shadow-lg -ml-32">
                  Add topics and activities that your ideal audience is interested in
                </div>
              </div>
            </label>
            
            <div className="relative">
              <div className="flex rounded-md shadow-sm">
                <InputField
                  id="interestInput"
                  type="text"
                  value={interestInput}
                  onChange={handleInterestInputChange}
                  placeholder="e.g., Technology, Travel, Fashion"
                  leftIcon={<FontAwesomeIcon icon={faTags} />}
                  className="rounded-r-none"
                  isFullWidth
                />
                <Button
                  variant="secondary"
                  onClick={handleAddInterest}
                  className="rounded-l-none"
                  leftIcon={<FontAwesomeIcon icon={faPlus} />}
                >
                  Add
                </Button>
              </div>
              
              {/* Suggested interests */}
              {suggestedInterests.length > 0 && (
                <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg border border-gray-200">
                  <ul className="py-1 text-sm text-gray-700">
                    {suggestedInterests.map((interest, index) => (
                      <li 
                        key={index}
                        className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSelectSuggestedInterest(interest)}
                      >
                        {interest}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            {/* Selected interests */}
            {interests.length > 0 && (
              <div className="mt-2">
                <p className="text-xs font-medium text-gray-500 mb-1">Selected interests:</p>
                <div className="flex flex-wrap gap-2">
                  {interests.map((interest, index) => (
                    <div 
                      key={index} 
                      className="inline-flex items-center bg-blue-100 text-blue-800 text-xs rounded-full px-3 py-1"
                    >
                      <span>{interest}</span>
                      <button 
                        type="button" 
                        onClick={() => handleRemoveInterest(interest)}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        <FontAwesomeIcon icon={faTimes} className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Behaviors Section */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 flex items-center">
              Behaviors
              <div className="ml-2 group relative">
                <FontAwesomeIcon 
                  icon={faInfoCircle} 
                  className="h-4 w-4 text-gray-400 cursor-help" 
                />
                <div className="hidden group-hover:block absolute z-10 w-64 p-2 text-xs bg-gray-800 text-white rounded shadow-lg -ml-32">
                  Add actions and habits that characterize your audience
                </div>
              </div>
            </label>
            
            <div className="relative">
              <div className="flex rounded-md shadow-sm">
                <InputField
                  id="behaviorInput"
                  type="text"
                  value={behaviorInput}
                  onChange={handleBehaviorInputChange}
                  placeholder="e.g., Online Shoppers, Mobile Users"
                  leftIcon={<FontAwesomeIcon icon={faUsers} />}
                  className="rounded-r-none"
                  isFullWidth
                />
                <Button
                  variant="secondary"
                  onClick={handleAddBehavior}
                  className="rounded-l-none"
                  leftIcon={<FontAwesomeIcon icon={faPlus} />}
                >
                  Add
                </Button>
              </div>
              
              {/* Suggested behaviors */}
              {suggestedBehaviors.length > 0 && (
                <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg border border-gray-200">
                  <ul className="py-1 text-sm text-gray-700">
                    {suggestedBehaviors.map((behavior, index) => (
                      <li 
                        key={index}
                        className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSelectSuggestedBehavior(behavior)}
                      >
                        {behavior}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            {/* Selected behaviors */}
            {behaviors.length > 0 && (
              <div className="mt-2">
                <p className="text-xs font-medium text-gray-500 mb-1">Selected behaviors:</p>
                <div className="flex flex-wrap gap-2">
                  {behaviors.map((behavior, index) => (
                    <div 
                      key={index} 
                      className="inline-flex items-center bg-green-100 text-green-800 text-xs rounded-full px-3 py-1"
                    >
                      <span>{behavior}</span>
                      <button 
                        type="button" 
                        onClick={() => handleRemoveBehavior(behavior)}
                        className="ml-1 text-green-600 hover:text-green-800"
                      >
                        <FontAwesomeIcon icon={faTimes} className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Audience Preview */}
      <Card className="mt-4 border border-gray-200">
        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
            <FontAwesomeIcon icon={faUsers} className="mr-2 text-gray-400" />
            Audience Preview
          </h3>
          <div className="border-t border-gray-200 pt-3">
            {getAudiencePreview()}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AudienceSelection; 