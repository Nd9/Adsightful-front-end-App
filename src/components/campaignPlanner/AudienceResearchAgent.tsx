import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, 
  faSpinner, 
  faExclamationTriangle,
  faUser,
  faHeartPulse,
  faHashtag,
  faLightbulb,
  faChartLine,
  faSquarePollVertical,
  faBullhorn,
  faEdit,
  faLaptop,
  faArrowLeft,
  faCheckCircle,
  faListCheck,
  faCoins,
  faChartPie,
  faLayerGroup,
  faThumbsUp
} from '@fortawesome/free-solid-svg-icons';
import {
  faFacebook,
  faLinkedin,
  faGoogle,
  faInstagram,
  faYoutube
} from '@fortawesome/free-brands-svg-icons';
import { runAudienceResearch } from '../../services/audienceResearch';
import { AudienceBrief, Persona, FunnelMapping, ChannelStrategy } from '../../types/audience';
import { generateChannelStrategy as generateChannelStrategyAPI } from '../../services/channelStrategy';
import Card from '../common/Card';
import Button from '../common/Button';
import { authService } from '../../services/auth';
import { audienceStrategyService } from '../../services/audienceStrategy';

const AudienceResearchAgent: React.FC = () => {
  // State for input fields
  const [url, setUrl] = useState('');
  const [rawText, setRawText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AudienceBrief | null>(null);
  const [activeTab, setActiveTab] = useState<'url' | 'text'>('url');
  const [activePersonaIndex, setActivePersonaIndex] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [activeDataView, setActiveDataView] = useState<'profile' | 'channels' | 'funnel' | 'strategy'>('profile');
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
  const [isGeneratingStrategy, setIsGeneratingStrategy] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [strategyName, setStrategyName] = useState('');
  const [strategyDescription, setStrategyDescription] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Load company URL from auth service when component mounts
  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user && user.companyUrl && !url) {
      setUrl(user.companyUrl);
    }
  }, [url]);

  // Toggle between URL and text input
  const toggleTab = (tab: 'url' | 'text') => {
    setActiveTab(tab);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Validate inputs
      if (activeTab === 'url' && !url) {
        throw new Error('Please enter a valid URL');
      }
      
      if (activeTab === 'text' && !rawText) {
        throw new Error('Please enter some product or website text');
      }
      
      // Call the audience research service
      const brief = await runAudienceResearch({
        url: activeTab === 'url' ? url : undefined,
        rawText: activeTab === 'text' ? rawText : undefined
      });
      
      setResult(brief);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Generate a channel-specific advertising strategy
  const generateChannelStrategy = async (channel: string, persona: Persona) => {
    setIsGeneratingStrategy(true);
    setSelectedChannel(channel);
    setActiveDataView('strategy');
    setError(null);

    try {
      // Use the service to generate the channel strategy
      const strategy = await generateChannelStrategyAPI(channel, persona);
      
      // Update the result with the new strategy
      if (result) {
        const updatedResult = { ...result };
        if (!updatedResult.channelStrategies) {
          updatedResult.channelStrategies = {};
        }
        updatedResult.channelStrategies[channel] = strategy;
        setResult(updatedResult);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate channel strategy');
      console.error('Error generating channel strategy:', err);
    } finally {
      setIsGeneratingStrategy(false);
    }
  };

  // Render a persona card
  const renderPersonaCard = (persona: Persona, index: number) => {
    const isActive = index === activePersonaIndex;
    
    return (
      <div 
        key={`persona-${index}`}
        className={`p-4 mb-4 rounded-lg cursor-pointer transition-all ${
          isActive ? 'bg-blue-50 border-2 border-blue-500' : 'bg-white border border-gray-200 hover:border-blue-300'
        }`}
        onClick={() => setActivePersonaIndex(index)}
      >
        <div className="flex items-center mb-3">
          <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
            <FontAwesomeIcon icon={faUser} className="text-blue-500" />
          </div>
          <div>
            <h3 className="font-medium text-gray-800">{persona.name}</h3>
            <p className="text-sm text-gray-500">{persona.role}, {persona.ageRange}</p>
          </div>
        </div>
      </div>
    );
  };

  // Render the persona profile view
  const renderPersonaProfile = (persona: Persona) => {
    const profileSections = [
      { title: 'Pain Points', data: persona.painPoints, icon: faHeartPulse, color: 'red' },
      { title: 'Motivations', data: persona.motivations, icon: faLightbulb, color: 'green' },
      { title: 'Psychographics', data: persona.psychographics, icon: faSquarePollVertical, color: 'purple' },
      { title: 'Interests', data: persona.interests, icon: faHashtag, color: 'blue' },
      { title: 'Behaviors', data: persona.behaviors, icon: faChartLine, color: 'indigo' }
    ];
    
    return (
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {profileSections.map((section, index) => (
            <div key={`section-${index}`} className="mb-6">
              <h4 className="font-medium text-gray-700 mb-3 flex items-center">
                <FontAwesomeIcon icon={section.icon} className={`text-${section.color}-500 mr-2`} />
                {section.title}
              </h4>
              <ul className="space-y-2">
                {section.data.map((item, idx) => (
                  <li key={`${section.title}-${idx}`} className="flex items-start">
                    <span className={`h-5 w-5 bg-${section.color}-100 rounded-full flex items-center justify-center mr-2 mt-0.5 flex-shrink-0`}>
                      <span className={`h-2 w-2 bg-${section.color}-500 rounded-full`}></span>
                    </span>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const getChannelIcon = (channel: string) => {
    const lowerChannel = channel.toLowerCase();
    if (lowerChannel.includes('facebook')) return <FontAwesomeIcon icon={faFacebook} />;
    if (lowerChannel.includes('linkedin')) return <FontAwesomeIcon icon={faLinkedin} />;
    if (lowerChannel.includes('google')) return <FontAwesomeIcon icon={faGoogle} />;
    if (lowerChannel.includes('instagram')) return <FontAwesomeIcon icon={faInstagram} />;
    if (lowerChannel.includes('youtube')) return <FontAwesomeIcon icon={faYoutube} />;
    if (lowerChannel.includes('programmatic')) return <FontAwesomeIcon icon={faChartLine} />;
    if (lowerChannel.includes('native')) return <FontAwesomeIcon icon={faBullhorn} />;
    return <FontAwesomeIcon icon={faLaptop} />;
  };

  // Render the persona channels view with clickable channels
  const renderPersonaChannels = (persona: Persona) => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium text-gray-700 mb-3 flex items-center">
            <FontAwesomeIcon icon={faBullhorn} className="text-blue-500 mr-2" />
            Target Advertising Channels
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {persona.targetChannels.map((channel, idx) => (
              <div 
                key={`channel-${idx}`} 
                className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center cursor-pointer hover:bg-blue-100 transition-colors"
                onClick={() => generateChannelStrategy(channel, persona)}
              >
                <span className="text-blue-500 mr-2">
                  {getChannelIcon(channel)}
                </span>
                <span className="text-blue-700 text-sm font-medium">{channel}</span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-sm text-gray-500 italic">Click on a channel to generate a detailed advertising strategy</p>
        </div>
        
        <div>
          <h4 className="font-medium text-gray-700 mb-3 flex items-center">
            <FontAwesomeIcon icon={faSearch} className="text-indigo-500 mr-2" />
            Search Keywords
          </h4>
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="flex flex-wrap gap-2">
              {persona.searchKeywords.map((keyword, idx) => (
                <span key={`keyword-${idx}`} className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-1 rounded">
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render the channel-specific advertising strategy
  const renderChannelStrategy = (strategy: ChannelStrategy) => {
    return (
      <div>
        <div className="mb-4 flex items-center">
          <button 
            className="text-blue-600 flex items-center hover:text-blue-800 mr-3"
            onClick={() => {
              setActiveDataView('channels');
              setSelectedChannel(null);
            }}
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-1" />
            Back to Channels
          </button>
          <h3 className="text-xl font-medium text-gray-800">
            {strategy.channel} Strategy
          </h3>
        </div>
        
        <div className="mb-8 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
          <h4 className="font-medium text-gray-800 mb-2 flex items-center">
            <FontAwesomeIcon icon={faLayerGroup} className="text-blue-600 mr-2" />
            Audience Segmentation
          </h4>
          <ul className="space-y-2">
            {strategy.audienceSegmentation.map((segment, idx) => (
              <li key={`segment-${idx}`} className="flex items-start">
                <span className="h-5 w-5 bg-blue-100 rounded-full flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                  <span className="h-2 w-2 bg-blue-500 rounded-full"></span>
                </span>
                <span className="text-gray-700">{segment}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="mb-8">
          <h4 className="font-medium text-gray-800 mb-3 flex items-center">
            <FontAwesomeIcon icon={faListCheck} className="text-green-600 mr-2" />
            Targeting Recommendations
          </h4>
          <ul className="space-y-2 bg-gray-50 p-4 rounded-lg border border-gray-200">
            {strategy.targetingRecommendations.map((recommendation, idx) => (
              <li key={`targeting-${idx}`} className="flex items-start">
                <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{recommendation}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <h4 className="font-medium text-gray-800 mb-3 flex items-center">
              <FontAwesomeIcon icon={faLightbulb} className="text-yellow-500 mr-2" />
              Creative Approach
            </h4>
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-gray-700">{strategy.creativeApproach}</p>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-800 mb-3 flex items-center">
              <FontAwesomeIcon icon={faCoins} className="text-amber-600 mr-2" />
              Budget Allocation
            </h4>
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-gray-700">{strategy.budgetAllocation}</p>
            </div>
          </div>
        </div>
        
        <div className="mb-8">
          <h4 className="font-medium text-gray-800 mb-3 flex items-center">
            <FontAwesomeIcon icon={faChartPie} className="text-purple-600 mr-2" />
            Key Performance Indicators
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {strategy.kpis.map((kpi, idx) => (
              <div key={`kpi-${idx}`} className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                <p className="text-gray-700 text-sm">{kpi}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="font-medium text-gray-800 mb-3 flex items-center">
            <FontAwesomeIcon icon={faThumbsUp} className="text-indigo-600 mr-2" />
            Best Practices
          </h4>
          <ul className="space-y-2 bg-indigo-50 p-4 rounded-lg border border-indigo-200">
            {strategy.bestPractices.map((practice, idx) => (
              <li key={`practice-${idx}`} className="flex items-start">
                <FontAwesomeIcon icon={faCheckCircle} className="text-indigo-500 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{practice}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  // Render the funnel mapping for the active persona
  const renderFunnelMapping = (funnel: FunnelMapping) => {
    const stages = [
      { name: 'Awareness', objection: funnel.awarenessObjection, ctas: funnel.ctas.awareness, color: 'blue' },
      { name: 'Consideration', objection: funnel.considerationObjection, ctas: funnel.ctas.consideration, color: 'indigo' },
      { name: 'Decision', objection: funnel.decisionObjection, ctas: funnel.ctas.decision, color: 'purple' }
    ];
    
    return (
      <div>
        <h4 className="font-medium text-lg mb-4 flex items-center">
          <FontAwesomeIcon icon={faChartLine} className="text-gray-600 mr-2" />
          Marketing Funnel Journey
        </h4>
        
        <div className="space-y-6">
          {stages.map((stage, idx) => (
            <div key={`stage-${idx}`} className="relative">
              {idx > 0 && (
                <div className="absolute -top-3 left-6 h-6 w-0.5 bg-gray-300"></div>
              )}
              <div className={`bg-${stage.color}-50 border border-${stage.color}-200 rounded-lg p-4`}>
                <div className="flex items-center mb-2">
                  <div className={`h-8 w-8 bg-${stage.color}-100 rounded-full flex items-center justify-center mr-2`}>
                    <span className="font-bold text-sm text-gray-700">{idx + 1}</span>
                  </div>
                  <h4 className={`font-medium text-${stage.color}-700`}>{stage.name}</h4>
                </div>
                
                <div className="ml-10">
                  <p className="text-gray-700 mb-3">
                    <strong>Objection:</strong> {stage.objection}
                  </p>
                  
                  <div>
                    <strong className="text-sm text-gray-600 mb-2 block">Recommended CTAs:</strong>
                    <ul className="space-y-1">
                      {stage.ctas.map((cta, ctaIdx) => (
                        <li key={`cta-${ctaIdx}`} className="text-sm bg-white p-2 rounded border border-gray-200 flex items-center">
                          <FontAwesomeIcon icon={faLaptop} className="text-gray-400 mr-2 h-3 w-3" />
                          {cta}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Function to handle saving an audience strategy
  const handleSaveStrategy = () => {
    setSaveModalOpen(true);
    setStrategyName(`Audience Strategy - ${new Date().toLocaleDateString()}`);
    setStrategyDescription('');
  };

  // Function to handle the actual saving
  const saveStrategy = () => {
    if (!result || !authService.getCurrentUser()) return;

    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const user = authService.getCurrentUser();
      if (!user) throw new Error('User not authenticated');

      // Save the strategy to our service
      const savedStrategy = audienceStrategyService.saveStrategy(
        user.id,
        strategyName,
        strategyDescription,
        result
      );

      // Add reference to the user's saved strategies
      authService.saveAudienceStrategy(savedStrategy.id);

      // Show success message and close modal after a delay
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveModalOpen(false);
        setSaveSuccess(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to save strategy:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // Function to close the save modal
  const closeSaveModal = () => {
    setSaveModalOpen(false);
    setSaveSuccess(false);
  };

  // Render the save strategy modal
  const renderSaveModal = () => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Save Audience Strategy</h3>
            <button
              onClick={closeSaveModal}
              className="text-gray-400 hover:text-gray-500"
            >
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {saveSuccess ? (
            <div className="p-4 bg-green-50 text-green-700 rounded-md mb-4">
              Strategy saved successfully!
            </div>
          ) : (
            <>
              <div className="mb-4">
                <label htmlFor="strategy-name" className="block text-sm font-medium text-gray-700 mb-1">
                  Strategy Name
                </label>
                <input
                  type="text"
                  id="strategy-name"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={strategyName}
                  onChange={(e) => setStrategyName(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label htmlFor="strategy-description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description (optional)
                </label>
                <textarea
                  id="strategy-description"
                  rows={3}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={strategyDescription}
                  onChange={(e) => setStrategyDescription(e.target.value)}
                ></textarea>
              </div>

              <p className="text-sm text-gray-500 mb-4">
                This strategy will be saved to your profile and can be used in the Creative Assets Library to generate targeted ads.
              </p>

              <div className="flex justify-end">
                <button
                  onClick={closeSaveModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md mr-2 hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={saveStrategy}
                  disabled={!strategyName || isSaving}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Save Strategy'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-full">
      <h2 className="text-2xl font-bold mb-6">Audience Research Agent</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input section */}
        <div className="lg:col-span-1">
          <Card>
            <div className="mb-4">
              <div className="flex border-b">
                <button
                  className={`px-4 py-2 font-medium text-sm ${activeTab === 'url' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                  onClick={() => toggleTab('url')}
                >
                  Website URL
                </button>
                <button
                  className={`px-4 py-2 font-medium text-sm ${activeTab === 'text' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                  onClick={() => toggleTab('text')}
                >
                  Raw Text
                </button>
              </div>
            </div>
            
            <form onSubmit={handleSubmit}>
              {activeTab === 'url' ? (
                <div className="mb-4">
                  <label htmlFor="website-url" className="block text-sm font-medium text-gray-700 mb-1">
                    Enter a landing page URL
                  </label>
                  <input
                    type="url"
                    id="website-url"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://example.com"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    disabled={isLoading}
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    {authService.getCurrentUser()?.companyUrl === url 
                      ? "Using your company's website to analyze audience" 
                      : "We'll analyze the landing page to extract buyer personas"}
                  </p>
                </div>
              ) : (
                <div className="mb-4">
                  <label htmlFor="raw-text" className="block text-sm font-medium text-gray-700 mb-1">
                    Paste product description or website content
                  </label>
                  <textarea
                    id="raw-text"
                    rows={6}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter product or website content here..."
                    value={rawText}
                    onChange={(e) => setRawText(e.target.value)}
                    disabled={isLoading}
                  ></textarea>
                  <p className="mt-1 text-sm text-gray-500">
                    Include features, benefits, target audience information
                  </p>
                </div>
              )}
              
              <Button
                type="submit"
                fullWidth
                disabled={isLoading}
                className="flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
                    Analyzing Audience...
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faSearch} className="mr-2" />
                    Generate Audience Brief
                  </>
                )}
              </Button>
              
              {error && (
                <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md flex items-start">
                  <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2 mt-1 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}
            </form>
            
            {/* Product summary section */}
            {result && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-gray-800">Product Summary</h3>
                  <button 
                    className="text-blue-600 text-sm flex items-center hover:text-blue-800"
                    onClick={() => setEditMode(!editMode)}
                  >
                    <FontAwesomeIcon icon={faEdit} className="mr-1" />
                    {editMode ? 'Save' : 'Edit'}
                  </button>
                </div>
                {editMode ? (
                  <textarea
                    className="w-full mt-2 p-2 border border-gray-300 rounded-md"
                    rows={4}
                    value={result.productSummary}
                    onChange={(e) => setResult({...result, productSummary: e.target.value})}
                  ></textarea>
                ) : (
                  <p className="mt-2 text-gray-600">{result.productSummary}</p>
                )}
              </div>
            )}
            
            {/* Persona cards for selection */}
            {result && result.personas.length > 0 && (
              <div className="mt-6">
                <h3 className="font-medium text-gray-800 mb-3">Buyer Personas</h3>
                <div className="space-y-2">
                  {result.personas.map((persona, index) => (
                    renderPersonaCard(persona, index)
                  ))}
                </div>
              </div>
            )}
          </Card>
        </div>
        
        {/* Detailed persona and funnel section */}
        <div className="lg:col-span-2">
          {result && result.personas.length > 0 && (
            <Card>
              <div className="mb-4 pb-3 border-b border-gray-200">
                <h3 className="text-xl font-medium text-gray-800">
                  {result.personas[activePersonaIndex].name}
                </h3>
                <p className="text-gray-600">
                  {result.personas[activePersonaIndex].role}, {result.personas[activePersonaIndex].ageRange}
                </p>
              </div>
              
              {/* Tab navigation */}
              <div className="border-b border-gray-200 mb-6">
                <nav className="flex -mb-px">
                  <button 
                    onClick={() => setActiveDataView('profile')} 
                    className={`py-2 px-4 border-b-2 font-medium text-sm ${
                      activeDataView === 'profile' 
                        ? 'border-blue-500 text-blue-600' 
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Persona Profile
                  </button>
                  <button 
                    onClick={() => {
                      setActiveDataView('channels');
                      setSelectedChannel(null);
                    }} 
                    className={`ml-8 py-2 px-4 border-b-2 font-medium text-sm ${
                      (activeDataView === 'channels' || activeDataView === 'strategy')
                        ? 'border-blue-500 text-blue-600' 
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Channels & Keywords
                  </button>
                  <button 
                    onClick={() => setActiveDataView('funnel')} 
                    className={`ml-8 py-2 px-4 border-b-2 font-medium text-sm ${
                      activeDataView === 'funnel' 
                        ? 'border-blue-500 text-blue-600' 
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Funnel Journey
                  </button>
                </nav>
              </div>
              
              {/* Content based on active tab */}
              {activeDataView === 'profile' && renderPersonaProfile(result.personas[activePersonaIndex])}
              {activeDataView === 'channels' && renderPersonaChannels(result.personas[activePersonaIndex])}
              {activeDataView === 'funnel' && renderFunnelMapping(result.funnel[activePersonaIndex])}
              {activeDataView === 'strategy' && selectedChannel && result.channelStrategies && result.channelStrategies[selectedChannel] && (
                renderChannelStrategy(result.channelStrategies[selectedChannel])
              )}
              {activeDataView === 'strategy' && isGeneratingStrategy && (
                <div className="flex flex-col items-center justify-center p-12">
                  <FontAwesomeIcon icon={faSpinner} className="animate-spin text-blue-500 text-3xl mb-4" />
                  <p className="text-gray-700">Generating detailed strategy for {selectedChannel}...</p>
                </div>
              )}
              
              {/* Export section */}
              <div className="mt-8 pt-4 border-t border-gray-200 flex justify-end">
                <Button
                  onClick={() => {
                    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(result, null, 2));
                    const downloadAnchorNode = document.createElement('a');
                    downloadAnchorNode.setAttribute('href', dataStr);
                    downloadAnchorNode.setAttribute('download', 'audience_brief.json');
                    document.body.appendChild(downloadAnchorNode);
                    downloadAnchorNode.click();
                    downloadAnchorNode.remove();
                  }}
                  className="mr-2"
                  variant="secondary"
                >
                  Export as JSON
                </Button>
                {authService.isAuthenticated() && (
                  <Button
                    onClick={handleSaveStrategy}
                    className="mr-2"
                  >
                    Save to Profile
                  </Button>
                )}
                <Button
                  onClick={() => {
                    // Here you would implement saving to your campaign data
                    alert('Audience brief saved to campaign!');
                  }}
                >
                  Save to Campaign
                </Button>
              </div>
            </Card>
          )}
          
          {/* Empty state */}
          {(!result || result.personas.length === 0) && !isLoading && (
            <Card className="h-full flex flex-col items-center justify-center text-center p-8">
              <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <FontAwesomeIcon icon={faUser} className="text-blue-500 h-8 w-8" />
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">No audience brief generated yet</h3>
              <p className="text-gray-500 max-w-md mb-6">
                Enter a URL or paste content from your landing page to generate detailed buyer personas and funnel mapping.
              </p>
              <p className="text-sm text-gray-400">
                The AI will analyze your content and generate:
              </p>
              <ul className="text-sm text-gray-500 mt-2">
                <li>• 3 detailed buyer personas</li>
                <li>• Psychographics & interests</li>
                <li>• Target channels & behaviors</li>
                <li>• Search keywords & marketing funnel</li>
              </ul>
            </Card>
          )}
        </div>
      </div>

      {/* Save Strategy Modal */}
      {saveModalOpen && renderSaveModal()}
    </div>
  );
};

export default AudienceResearchAgent; 