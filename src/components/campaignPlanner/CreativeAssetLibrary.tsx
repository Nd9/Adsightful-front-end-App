import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faImage, 
  faPalette, 
  faFileUpload, 
  faMagic,
  faFont,
  faTrash,
  faPlus,
  faCopy,
  faDownload,
  faCheck,
  faRobot,
  faWandMagicSparkles,
  faSpinner,
  faLayerGroup
} from '@fortawesome/free-solid-svg-icons';

// Define the interface for brand assets
interface BrandAssets {
  logo: string | null;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    background: string;
  };
  tone: {
    voice: string;
    personality: string[];
    keywords: string[];
  };
  creativeAssets: Array<{
    id: string;
    type: 'image' | 'video';
    url: string;
    name: string;
    tags: string[];
    aiGenerated: boolean;
    dateCreated: string;
  }>;
}

interface CreativeAssetLibraryProps {
  brandAssets?: BrandAssets;
  updateBrandAssets?: (assets: BrandAssets) => void;
}

// Default brand assets
const DEFAULT_BRAND_ASSETS: BrandAssets = {
  logo: null,
  colors: {
    primary: '#3b82f6',
    secondary: '#10b981',
    accent: '#f97316',
    text: '#1f2937',
    background: '#ffffff'
  },
  tone: {
    voice: 'Professional',
    personality: ['Trustworthy', 'Innovative', 'Friendly'],
    keywords: ['quality', 'solution', 'innovative', 'trusted']
  },
  creativeAssets: []
};

// Voice options for brand tone
const VOICE_OPTIONS = [
  'Professional',
  'Casual', 
  'Friendly', 
  'Authoritative', 
  'Playful', 
  'Inspirational', 
  'Technical'
];

// Personality trait options
const PERSONALITY_OPTIONS = [
  'Trustworthy', 
  'Innovative', 
  'Friendly', 
  'Expert', 
  'Passionate', 
  'Reliable', 
  'Creative',
  'Bold',
  'Thoughtful',
  'Sophisticated'
];

const CreativeAssetLibrary: React.FC<CreativeAssetLibraryProps> = ({ 
  brandAssets = DEFAULT_BRAND_ASSETS,
  updateBrandAssets = () => {}
}) => {
  // Local state for the component
  const [assets, setAssets] = useState<BrandAssets>(brandAssets || DEFAULT_BRAND_ASSETS);
  const [activeTab, setActiveTab] = useState<'brand' | 'assets' | 'ai-generation'>('brand');
  const [uploadingAsset, setUploadingAsset] = useState(false);
  const [generatingAsset, setGeneratingAsset] = useState(false);
  const [newAssetName, setNewAssetName] = useState('');
  const [newAssetTags, setNewAssetTags] = useState('');
  const [keyword, setKeyword] = useState('');
  const [copied, setCopied] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState('');
  const [creativeForm, setCreativeForm] = useState({
    targetAudience: '',
    prompt: '',
    messageText: '',
    callToAction: '',
    platform: '',
    dimensions: '',
    variations: 1,
    includelogo: true,
    includeBrandColors: true
  });
  const [generatedPreviews, setGeneratedPreviews] = useState<{ id: string; url: string }[]>([]);
  const [generatingAiCreatives, setGeneratingAiCreatives] = useState(false);
  
  // Refs
  const logoInputRef = useRef<HTMLInputElement>(null);
  const assetInputRef = useRef<HTMLInputElement>(null);

  // Handle logo upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!assets) return;
    
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (event.target?.result) {
          const newAssets = {
            ...assets,
            logo: event.target.result as string
          };
          setAssets(newAssets);
          updateBrandAssets(newAssets);
        }
      };
      
      reader.readAsDataURL(file);
    }
  };

  // Handle creative asset upload
  const handleAssetUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!assets) return;
    
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (event.target?.result) {
          const type = file.type.startsWith('image/') ? 'image' : 'video';
          const newAsset = {
            id: Date.now().toString(),
            type,
            url: event.target.result as string,
            name: newAssetName || file.name,
            tags: newAssetTags.split(',').map(tag => tag.trim()).filter(tag => tag),
            aiGenerated: false,
            dateCreated: new Date().toISOString()
          };
          
          const newAssets = {
            ...assets,
            creativeAssets: [...(assets.creativeAssets || []), newAsset]
          };
          
          setAssets(newAssets);
          updateBrandAssets(newAssets);
          setUploadingAsset(false);
          setNewAssetName('');
          setNewAssetTags('');
        }
      };
      
      reader.readAsDataURL(file);
    }
  };

  // Handle color change
  const handleColorChange = (colorKey: keyof BrandAssets['colors'], value: string) => {
    if (!assets || !assets.colors) return;
    
    const newAssets = {
      ...assets,
      colors: {
        ...assets.colors,
        [colorKey]: value
      }
    };
    setAssets(newAssets);
    updateBrandAssets(newAssets);
  };

  // Handle voice selection
  const handleVoiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!assets || !assets.tone) return;
    
    const newAssets = {
      ...assets,
      tone: {
        ...assets.tone,
        voice: e.target.value
      }
    };
    setAssets(newAssets);
    updateBrandAssets(newAssets);
  };

  // Handle personality trait toggle
  const togglePersonalityTrait = (trait: string) => {
    if (!assets || !assets.tone || !assets.tone.personality) return;
    
    const traits = assets.tone.personality;
    const newTraits = traits.includes(trait)
      ? traits.filter(t => t !== trait)
      : [...traits, trait];
    
    const newAssets = {
      ...assets,
      tone: {
        ...assets.tone,
        personality: newTraits
      }
    };
    setAssets(newAssets);
    updateBrandAssets(newAssets);
  };

  // Add keyword
  const addKeyword = () => {
    if (!keyword || !assets || !assets.tone || !assets.tone.keywords) return;
    
    if (!assets.tone.keywords.includes(keyword)) {
      const newAssets = {
        ...assets,
        tone: {
          ...assets.tone,
          keywords: [...assets.tone.keywords, keyword]
        }
      };
      setAssets(newAssets);
      updateBrandAssets(newAssets);
      setKeyword('');
    }
  };

  // Remove keyword
  const removeKeyword = (word: string) => {
    if (!assets || !assets.tone || !assets.tone.keywords) return;
    
    const newAssets = {
      ...assets,
      tone: {
        ...assets.tone,
        keywords: assets.tone.keywords.filter(k => k !== word)
      }
    };
    setAssets(newAssets);
    updateBrandAssets(newAssets);
  };

  // Simulate AI generation of creative assets
  const generateAIAsset = () => {
    if (!assets) return;
    
    setGeneratingAsset(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const mockAsset = {
        id: `ai-${Date.now()}`,
        type: 'image' as const,
        url: 'https://via.placeholder.com/800x600/3b82f6/ffffff?text=AI+Generated+Asset',
        name: `AI Generated Asset ${Math.floor(Math.random() * 1000)}`,
        tags: ['ai-generated', ...(assets.tone?.personality?.slice(0, 2) || [])],
        aiGenerated: true,
        dateCreated: new Date().toISOString()
      };
      
      const newAssets = {
        ...assets,
        creativeAssets: [...(assets.creativeAssets || []), mockAsset]
      };
      
      setAssets(newAssets);
      updateBrandAssets(newAssets);
      setGeneratingAsset(false);
    }, 2000);
  };

  // Delete an asset
  const deleteAsset = (id: string) => {
    if (!assets || !assets.creativeAssets) return;
    
    const newAssets = {
      ...assets,
      creativeAssets: assets.creativeAssets.filter(asset => asset.id !== id)
    };
    setAssets(newAssets);
    updateBrandAssets(newAssets);
  };

  // Copy brand guidelines to clipboard
  const copyBrandGuidelines = () => {
    if (!assets?.colors || !assets?.tone) return;
    
    const guidelines = `
Brand Guidelines:
----------------
Primary Color: ${assets.colors.primary || '#3b82f6'}
Secondary Color: ${assets.colors.secondary || '#10b981'}
Accent Color: ${assets.colors.accent || '#f97316'}
Text Color: ${assets.colors.text || '#1f2937'}
Background Color: ${assets.colors.background || '#ffffff'}

Brand Voice: ${assets.tone.voice || 'Professional'}
Personality: ${assets.tone.personality?.join(', ') || 'N/A'}
Key Terms: ${assets.tone.keywords?.join(', ') || 'N/A'}
    `;
    
    navigator.clipboard.writeText(guidelines);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Update form field
  const updateFormField = (field: keyof typeof creativeForm, value: any) => {
    setCreativeForm({
      ...creativeForm,
      [field]: value
    });
  };

  // Select audience persona
  const handleSelectPersona = (personaId: string) => {
    setSelectedPersona(personaId);
    
    // Get the selected persona details
    const persona = PREDEFINED_PERSONAS.find(p => p.id === personaId);
    if (persona) {
      // Update the form with persona information
      setCreativeForm({
        ...creativeForm,
        targetAudience: persona.name,
        prompt: `Create an advertisement targeting ${persona.name} (${persona.description}). Incorporate interests like ${persona.interests.join(', ')} and behaviors such as ${persona.behaviors.join(', ')}.`
      });
    }
  };

  // Generate AI Creatives
  const generateAICreatives = () => {
    if (!assets) return;
    
    setGeneratingAiCreatives(true);
    setGeneratedPreviews([]);
    
    // This would be an API call in production
    // Mock the generation process with a timeout
    setTimeout(() => {
      // Create mock generated images
      const mockImages = Array.from({ length: creativeForm.variations }).map((_, index) => ({
        id: `gen-${Date.now()}-${index}`,
        url: `https://placehold.co/${creativeForm.dimensions.replace('x', '/')}?text=AI+Generated+Ad+${index + 1}`
      }));
      
      setGeneratedPreviews(mockImages);
      setGeneratingAiCreatives(false);
    }, 3000);
  };

  // Save AI Generated Creative
  const saveAICreative = (previewId: string) => {
    if (!assets) return;
    
    const preview = generatedPreviews.find(p => p.id === previewId);
    if (!preview) return;
    
    // Create a new asset from the preview
    const newAsset = {
      id: Date.now().toString(),
      type: 'image' as 'image' | 'video',
      url: preview.url,
      name: `AI Generated - ${creativeForm.platform} - ${new Date().toLocaleDateString()}`,
      tags: ['ai-generated', creativeForm.platform, creativeForm.targetAudience, ...creativeForm.dimensions.split('x')],
      aiGenerated: true,
      dateCreated: new Date().toISOString()
    };
    
    // Update assets with the new AI-generated creative
    const newAssets = {
      ...assets,
      creativeAssets: [...(assets.creativeAssets || []), newAsset]
    };
    
    setAssets(newAssets);
    updateBrandAssets(newAssets);
  };

  // Generate message suggestions based on brand tone and target audience
  const generateMessageSuggestions = () => {
    if (!creativeForm.targetAudience) return [];
    
    const voice = assets?.tone?.voice || 'Professional';
    const keywords = assets?.tone?.keywords || [];
    
    // This would be an AI API call in production
    // Return mock suggestions based on voice and target audience
    if (voice === 'Professional') {
      return [
        `Discover how our ${keywords[0] || 'solution'} can transform your experience.`,
        `Trust our ${keywords[1] || 'expertise'} to deliver exceptional results.`,
        `Experience the difference with our ${keywords[2] || 'service'}.`
      ];
    } else if (voice === 'Casual') {
      return [
        `Hey there! Check out our amazing ${keywords[0] || 'product'}!`,
        `You're going to love what we've made for you!`,
        `Ready for something awesome? Try our ${keywords[1] || 'solution'}!`
      ];
    } else {
      return [
        `Introducing the next generation of ${keywords[0] || 'solutions'}.`,
        `Transform your experience with our ${keywords[1] || 'product'}.`,
        `Elevate your results with our ${keywords[2] || 'service'}.`
      ];
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Creative Asset Library</h2>
        <p className="text-gray-600 mt-2">
          Manage your brand assets and creative materials
        </p>
      </div>

      {/* Tabs */}
      <div className="flex mb-6">
        <button
          className={`px-4 py-2 font-medium rounded-t-lg ${
            activeTab === 'brand'
              ? 'bg-white text-blue-600 border-t border-l border-r border-gray-200'
              : 'bg-gray-100 text-gray-600'
          }`}
          onClick={() => setActiveTab('brand')}
        >
          Brand Guidelines
        </button>
        <button
          className={`px-4 py-2 font-medium rounded-t-lg ${
            activeTab === 'assets'
              ? 'bg-white text-blue-600 border-t border-l border-r border-gray-200'
              : 'bg-gray-100 text-gray-600'
          }`}
          onClick={() => setActiveTab('assets')}
        >
          Creative Assets
        </button>
        <button
          className={`px-4 py-2 font-medium rounded-t-lg ${
            activeTab === 'ai-generation'
              ? 'bg-white text-blue-600 border-t border-l border-r border-gray-200'
              : 'bg-gray-100 text-gray-600'
          }`}
          onClick={() => setActiveTab('ai-generation')}
        >
          <FontAwesomeIcon icon={faWandMagicSparkles} className="mr-2" />
          AI Creative Generation
        </button>
      </div>

      {/* Tab Content */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        {activeTab === 'brand' ? (
          <div className="space-y-8">
            {/* Brand Logo */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                <FontAwesomeIcon icon={faImage} className="h-5 w-5 text-blue-500 mr-2" />
                Brand Logo
              </h3>
              <div className="flex items-start space-x-6">
                <div className="w-40 h-40 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                  {assets.logo ? (
                    <img 
                      src={assets.logo} 
                      alt="Brand Logo" 
                      className="max-w-full max-h-full object-contain" 
                    />
                  ) : (
                    <div className="text-center p-4">
                      <FontAwesomeIcon icon={faImage} className="h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">No logo uploaded</p>
                    </div>
                  )}
                </div>
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    ref={logoInputRef}
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => logoInputRef.current?.click()}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <FontAwesomeIcon icon={faFileUpload} className="mr-2" />
                    Upload Logo
                  </button>
                  <p className="mt-2 text-sm text-gray-500">
                    Upload your company logo (recommended size: 400x400px)
                  </p>
                </div>
              </div>
            </div>

            {/* Brand Colors */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                <FontAwesomeIcon icon={faPalette} className="h-5 w-5 text-blue-500 mr-2" />
                Brand Colors
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Primary Color
                  </label>
                  <div className="flex">
                    <input
                      type="color"
                      value={assets?.colors?.primary || '#3b82f6'}
                      onChange={(e) => handleColorChange('primary', e.target.value)}
                      className="h-10 w-10 border border-gray-300 rounded-l-md"
                    />
                    <input
                      type="text"
                      value={assets?.colors?.primary || '#3b82f6'}
                      onChange={(e) => handleColorChange('primary', e.target.value)}
                      className="flex-1 rounded-r-md border border-gray-300 px-3 py-2 text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Secondary Color
                  </label>
                  <div className="flex">
                    <input
                      type="color"
                      value={assets?.colors?.secondary || '#10b981'}
                      onChange={(e) => handleColorChange('secondary', e.target.value)}
                      className="h-10 w-10 border border-gray-300 rounded-l-md"
                    />
                    <input
                      type="text"
                      value={assets?.colors?.secondary || '#10b981'}
                      onChange={(e) => handleColorChange('secondary', e.target.value)}
                      className="flex-1 rounded-r-md border border-gray-300 px-3 py-2 text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Accent Color
                  </label>
                  <div className="flex">
                    <input
                      type="color"
                      value={assets?.colors?.accent || '#f97316'}
                      onChange={(e) => handleColorChange('accent', e.target.value)}
                      className="h-10 w-10 border border-gray-300 rounded-l-md"
                    />
                    <input
                      type="text"
                      value={assets?.colors?.accent || '#f97316'}
                      onChange={(e) => handleColorChange('accent', e.target.value)}
                      className="flex-1 rounded-r-md border border-gray-300 px-3 py-2 text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Text Color
                  </label>
                  <div className="flex">
                    <input
                      type="color"
                      value={assets?.colors?.text || '#1f2937'}
                      onChange={(e) => handleColorChange('text', e.target.value)}
                      className="h-10 w-10 border border-gray-300 rounded-l-md"
                    />
                    <input
                      type="text"
                      value={assets?.colors?.text || '#1f2937'}
                      onChange={(e) => handleColorChange('text', e.target.value)}
                      className="flex-1 rounded-r-md border border-gray-300 px-3 py-2 text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Background Color
                  </label>
                  <div className="flex">
                    <input
                      type="color"
                      value={assets?.colors?.background || '#ffffff'}
                      onChange={(e) => handleColorChange('background', e.target.value)}
                      className="h-10 w-10 border border-gray-300 rounded-l-md"
                    />
                    <input
                      type="text"
                      value={assets?.colors?.background || '#ffffff'}
                      onChange={(e) => handleColorChange('background', e.target.value)}
                      className="flex-1 rounded-r-md border border-gray-300 px-3 py-2 text-sm"
                    />
                  </div>
                </div>
              </div>
              
              {/* Color Preview */}
              <div className="mt-4 p-4 rounded-lg" style={{ backgroundColor: assets?.colors?.background || '#ffffff' }}>
                <div className="flex flex-wrap gap-4">
                  <div className="p-4 rounded-lg" style={{ backgroundColor: assets?.colors?.primary || '#3b82f6' }}>
                    <span className="font-medium" style={{ color: '#ffffff' }}>Primary</span>
                  </div>
                  <div className="p-4 rounded-lg" style={{ backgroundColor: assets?.colors?.secondary || '#10b981' }}>
                    <span className="font-medium" style={{ color: '#ffffff' }}>Secondary</span>
                  </div>
                  <div className="p-4 rounded-lg" style={{ backgroundColor: assets?.colors?.accent || '#f97316' }}>
                    <span className="font-medium" style={{ color: '#ffffff' }}>Accent</span>
                  </div>
                  <div className="p-4 rounded-lg border border-gray-200" style={{ color: assets?.colors?.text || '#1f2937' }}>
                    <span className="font-medium">Text Sample</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Brand Tone */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                <FontAwesomeIcon icon={faFont} className="h-5 w-5 text-blue-500 mr-2" />
                Brand Tone & Voice
              </h3>
              
              {/* Voice */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Brand Voice
                </label>
                <select
                  value={assets?.tone?.voice || 'Professional'}
                  onChange={handleVoiceChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  {VOICE_OPTIONS.map(voice => (
                    <option key={voice} value={voice}>
                      {voice}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Personality */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Brand Personality (Select up to 5)
                </label>
                <div className="flex flex-wrap gap-2">
                  {PERSONALITY_OPTIONS.map(trait => (
                    <button
                      key={trait}
                      onClick={() => togglePersonalityTrait(trait)}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        assets?.tone?.personality?.includes(trait)
                          ? 'bg-blue-100 text-blue-800 border border-blue-200'
                          : 'bg-gray-100 text-gray-800 border border-gray-200'
                      }`}
                      disabled={
                        !assets?.tone?.personality?.includes(trait) &&
                        (assets?.tone?.personality?.length || 0) >= 5
                      }
                    >
                      {trait}
                      {assets?.tone?.personality?.includes(trait) && (
                        <FontAwesomeIcon icon={faCheck} className="ml-1 h-3 w-3" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Keywords */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Brand Keywords
                </label>
                <div className="flex">
                  <input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="Add keyword"
                    className="flex-1 rounded-l-md border border-gray-300 px-3 py-2 text-sm"
                  />
                  <button
                    onClick={addKeyword}
                    disabled={!keyword}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-r-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-300"
                  >
                    <FontAwesomeIcon icon={faPlus} />
                  </button>
                </div>
                
                <div className="mt-2 flex flex-wrap gap-2">
                  {assets?.tone?.keywords?.map(word => (
                    <span
                      key={word}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                    >
                      {word}
                      <button 
                        onClick={() => removeKeyword(word)} 
                        className="ml-1.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-gray-400 hover:bg-gray-200 hover:text-gray-500"
                      >
                        <FontAwesomeIcon icon={faTrash} className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Export Button */}
              <div className="mt-4">
                <button
                  onClick={copyBrandGuidelines}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <FontAwesomeIcon icon={copied ? faCheck : faCopy} className="mr-2" />
                  {copied ? 'Copied!' : 'Copy Brand Guidelines'}
                </button>
              </div>
            </div>
          </div>
        ) : activeTab === 'assets' ? (
          <div className="space-y-6">
            {/* Creative Assets */}
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <FontAwesomeIcon icon={faImage} className="h-5 w-5 text-blue-500 mr-2" />
                Creative Assets
              </h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => setUploadingAsset(true)}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <FontAwesomeIcon icon={faFileUpload} className="mr-2" />
                  Upload Asset
                </button>
                <button
                  onClick={generateAIAsset}
                  disabled={generatingAsset}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  <FontAwesomeIcon icon={faMagic} className="mr-2" />
                  {generatingAsset ? 'Generating...' : 'Generate with AI'}
                </button>
              </div>
            </div>

            {/* Upload Form */}
            {uploadingAsset && (
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="font-medium text-gray-900 mb-3">Upload New Asset</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Asset Name
                    </label>
                    <input
                      type="text"
                      value={newAssetName}
                      onChange={(e) => setNewAssetName(e.target.value)}
                      placeholder="Enter asset name"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tags (comma separated)
                    </label>
                    <input
                      type="text"
                      value={newAssetTags}
                      onChange={(e) => setNewAssetTags(e.target.value)}
                      placeholder="e.g. banner, promotion, summer"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => setUploadingAsset(false)}
                      className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                    >
                      Cancel
                    </button>
                    <input
                      type="file"
                      accept="image/*,video/*"
                      ref={assetInputRef}
                      onChange={handleAssetUpload}
                      className="hidden"
                    />
                    <button
                      onClick={() => assetInputRef.current?.click()}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <FontAwesomeIcon icon={faFileUpload} className="mr-2" />
                      Select File
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Asset Gallery */}
            {assets?.creativeAssets?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {assets.creativeAssets.map(asset => (
                  <div key={asset.id} className="border rounded-lg overflow-hidden bg-white shadow-sm">
                    <div className="relative h-44 bg-gray-100">
                      {asset.type === 'image' ? (
                        <img
                          src={asset.url}
                          alt={asset.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <video
                          src={asset.url}
                          className="w-full h-full object-cover"
                          controls
                        />
                      )}
                      {asset.aiGenerated && (
                        <div className="absolute top-2 right-2 bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full flex items-center">
                          <FontAwesomeIcon icon={faRobot} className="mr-1" />
                          AI Generated
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium text-gray-900 truncate">{asset.name}</h4>
                        <button
                          onClick={() => deleteAsset(asset.id)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {asset.tags?.map(tag => (
                          <span
                            key={tag}
                            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="mt-2 text-xs text-gray-500">
                        {new Date(asset.dateCreated).toLocaleDateString()}
                      </div>
                      <div className="mt-2">
                        <button
                          className="text-sm text-blue-600 hover:text-blue-800"
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = asset.url;
                            link.download = asset.name;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                          }}
                        >
                          <FontAwesomeIcon icon={faDownload} className="mr-1" />
                          Download
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <FontAwesomeIcon icon={faImage} className="h-12 w-12 text-gray-400 mb-3" />
                <h3 className="text-lg font-medium text-gray-900">No creative assets yet</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Upload your brand assets or generate them with AI
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <FontAwesomeIcon icon={faWandMagicSparkles} className="h-5 w-5 text-purple-500 mr-2" />
              AI Creative Generation
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Generation Controls */}
              <div className="lg:col-span-1 space-y-6 bg-gray-50 p-4 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Target Audience</h4>
                  
                  {/* Audience Persona Selection */}
                  <div className="space-y-2 mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Select Audience Persona
                    </label>
                    <div className="grid grid-cols-1 gap-2">
                      {PREDEFINED_PERSONAS.map((persona) => (
                        <button
                          key={persona.id}
                          onClick={() => handleSelectPersona(persona.id)}
                          className={`text-left p-3 rounded-md border ${
                            selectedPersona === persona.id 
                              ? 'border-purple-500 bg-purple-50' 
                              : 'border-gray-200 hover:bg-gray-100'
                          }`}
                        >
                          <div className="font-medium">{persona.name}</div>
                          <div className="text-sm text-gray-500 mt-1">{persona.description}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Custom Audience Input */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Or Enter Custom Audience Details
                    </label>
                    <textarea
                      value={creativeForm.targetAudience}
                      onChange={(e) => updateFormField('targetAudience', e.target.value)}
                      placeholder="Describe your target audience..."
                      className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                      rows={3}
                    />
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Message</h4>
                  
                  {/* Message Suggestions */}
                  {creativeForm.targetAudience && (
                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Suggestions Based on Brand Tone
                      </label>
                      <div className="space-y-2">
                        {generateMessageSuggestions().map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => updateFormField('messageText', suggestion)}
                            className="w-full text-left p-2 text-sm border border-gray-200 rounded-md hover:bg-gray-100"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Message Input */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Custom Message
                    </label>
                    <textarea
                      value={creativeForm.messageText}
                      onChange={(e) => updateFormField('messageText', e.target.value)}
                      placeholder="Enter the main message for your creative..."
                      className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                      rows={3}
                    />
                  </div>
                  
                  {/* Call to Action */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Call to Action
                    </label>
                    <select
                      value={creativeForm.callToAction}
                      onChange={(e) => updateFormField('callToAction', e.target.value)}
                      className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    >
                      {CTA_OPTIONS.map((cta) => (
                        <option key={cta} value={cta}>{cta}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Creative Settings</h4>
                  
                  {/* Platform Selection */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Platform
                    </label>
                    <select
                      value={creativeForm.platform}
                      onChange={(e) => updateFormField('platform', e.target.value)}
                      className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    >
                      {PLATFORM_OPTIONS.map((platform) => (
                        <option key={platform.id} value={platform.id}>{platform.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Dimensions */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Creative Dimensions
                    </label>
                    <select
                      value={creativeForm.dimensions}
                      onChange={(e) => updateFormField('dimensions', e.target.value)}
                      className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    >
                      {DIMENSION_OPTIONS.map((dimension) => (
                        <option key={dimension.id} value={dimension.id}>{dimension.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Variations */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Number of Variations
                    </label>
                    <select
                      value={creativeForm.variations}
                      onChange={(e) => updateFormField('variations', parseInt(e.target.value))}
                      className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    >
                      {[1, 2, 3, 4, 5].map((num) => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Brand Elements */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Brand Elements
                    </label>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={creativeForm.includelogo}
                          onChange={(e) => updateFormField('includelogo', e.target.checked)}
                          id="include-logo"
                          className="h-4 w-4 text-blue-600 rounded"
                        />
                        <label htmlFor="include-logo" className="ml-2 text-sm text-gray-700">
                          Include Brand Logo
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={creativeForm.includeBrandColors}
                          onChange={(e) => updateFormField('includeBrandColors', e.target.checked)}
                          id="include-colors"
                          className="h-4 w-4 text-blue-600 rounded"
                        />
                        <label htmlFor="include-colors" className="ml-2 text-sm text-gray-700">
                          Use Brand Colors
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Generate Button */}
                <div>
                  <button
                    onClick={generateAICreatives}
                    disabled={generatingAiCreatives || !creativeForm.targetAudience || !creativeForm.messageText}
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:bg-purple-300"
                  >
                    {generatingAiCreatives ? (
                      <>
                        <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faWandMagicSparkles} className="mr-2" />
                        Generate Creatives
                      </>
                    )}
                  </button>
                </div>
              </div>
              
              {/* Right Column: Preview and Results */}
              <div className="lg:col-span-2 space-y-4">
                {/* Preview Section */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3">Preview</h4>
                  
                  {creativeForm.targetAudience && creativeForm.messageText ? (
                    <div className="border border-gray-200 rounded-lg bg-white p-4">
                      <div className="text-sm text-gray-500 mb-2">Preview of generated content:</div>
                      <div className="space-y-2">
                        <div><strong>Platform:</strong> {PLATFORM_OPTIONS.find(p => p.id === creativeForm.platform)?.name}</div>
                        <div><strong>Audience:</strong> {creativeForm.targetAudience}</div>
                        <div><strong>Message:</strong> {creativeForm.messageText}</div>
                        <div><strong>Call to Action:</strong> {creativeForm.callToAction}</div>
                        <div><strong>Dimensions:</strong> {creativeForm.dimensions}</div>
                        <div><strong>Variations:</strong> {creativeForm.variations}</div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-10 text-gray-500">
                      <FontAwesomeIcon icon={faImage} className="h-10 w-10 mx-auto mb-2" />
                      <p>Complete the form on the left to see a preview</p>
                    </div>
                  )}
                </div>
                
                {/* Generated Results */}
                {generatedPreviews.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Generated Creatives</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {generatedPreviews.map((preview) => (
                        <div key={preview.id} className="border rounded-lg overflow-hidden bg-white shadow-sm">
                          <div className="relative h-60 bg-gray-100">
                            <img
                              src={preview.url}
                              alt="AI Generated Creative"
                              className="w-full h-full object-contain"
                            />
                            <div className="absolute top-2 right-2 bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full flex items-center">
                              <FontAwesomeIcon icon={faRobot} className="mr-1" />
                              AI Generated
                            </div>
                          </div>
                          <div className="p-3">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-500">{creativeForm.dimensions}</span>
                              <span className="text-sm font-medium text-purple-600">{creativeForm.platform}</span>
                            </div>
                            <div className="mt-3 flex space-x-2">
                              <button
                                onClick={() => saveAICreative(preview.id)}
                                className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                              >
                                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                                Add to Library
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Bulk Actions */}
                    {generatedPreviews.length > 1 && (
                      <div className="mt-4 flex justify-end">
                        <button
                          onClick={() => {
                            generatedPreviews.forEach(preview => saveAICreative(preview.id));
                            setGeneratedPreviews([]);
                          }}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-purple-700 bg-purple-100 hover:bg-purple-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                        >
                          <FontAwesomeIcon icon={faLayerGroup} className="mr-2" />
                          Save All to Library
                        </button>
                      </div>
                    )}
                  </div>
                )}
                
                {generatingAiCreatives && generatedPreviews.length === 0 && (
                  <div className="text-center py-16">
                    <FontAwesomeIcon icon={faSpinner} className="animate-spin h-10 w-10 text-purple-500 mb-4" />
                    <p className="text-gray-500">Generating creative assets...</p>
                    <p className="text-sm text-gray-400 mt-2">This may take a few moments</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreativeAssetLibrary; 