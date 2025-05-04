import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faImage, 
  faVideo, 
  faFileUpload, 
  faMagic,
  faLightbulb,
  faBullhorn,
  faCheckCircle,
  faPalette,
  faTimes
} from '@fortawesome/free-solid-svg-icons';

interface CreativeData {
  formats: string[];
  message: string;
  cta: string;
  uploadedSamples: string[];
}

interface CreativeGuidanceProps {
  creative: CreativeData;
  industry: string;
  updateCreative: (creative: CreativeData) => void;
}

// Available creative formats
const CREATIVE_FORMATS = [
  {
    id: 'single-image',
    name: 'Single Image',
    icon: faImage,
    description: 'Simple, eye-catching images with clear messaging',
    platforms: 'All platforms',
    color: 'blue'
  },
  {
    id: 'video',
    name: 'Video',
    icon: faVideo,
    description: 'Engaging videos that tell your brand story',
    platforms: 'All platforms (best for Facebook, Instagram, TikTok)',
    color: 'red'
  },
  {
    id: 'carousel',
    name: 'Carousel',
    icon: faImage,
    description: 'Multiple images or videos in a swipeable format',
    platforms: 'Facebook, Instagram, LinkedIn',
    color: 'purple'
  },
  {
    id: 'stories',
    name: 'Stories',
    icon: faVideo,
    description: 'Vertical, full-screen content with a 24-hour lifespan',
    platforms: 'Facebook, Instagram, Snapchat',
    color: 'green'
  },
  {
    id: 'text',
    name: 'Text Ads',
    icon: faBullhorn,
    description: 'Simple text-based ads with a clear message',
    platforms: 'Google, Bing, LinkedIn',
    color: 'gray'
  }
];

// Common calls-to-action by industry
const CTA_SUGGESTIONS: {[key: string]: string[]} = {
  'E-commerce': ['Shop Now', 'Buy Now', 'Add to Cart', 'View Collection', 'Limited Time Offer'],
  'Technology': ['Learn More', 'Get Started', 'Try for Free', 'Request Demo', 'Sign Up'],
  'Finance': ['Get a Quote', 'Learn More', 'Apply Now', 'Start Saving', 'Open an Account'],
  'Healthcare': ['Book Appointment', 'Learn More', 'Find a Doctor', 'Get Started', 'Contact Us'],
  'Education': ['Enroll Now', 'Learn More', 'Apply Today', 'Request Info', 'Start Learning'],
  'Travel': ['Book Now', 'View Deals', 'Plan Your Trip', 'Learn More', 'Reserve Today'],
  'Food & Beverage': ['Order Now', 'View Menu', 'Make a Reservation', 'Find a Location', 'Join Waitlist'],
  'default': ['Learn More', 'Get Started', 'Contact Us', 'Sign Up', 'Shop Now']
};

// Industry-specific messaging templates
const MESSAGE_TEMPLATES: {[key: string]: string[]} = {
  'E-commerce': [
    'Discover [ProductName]: [Value Proposition] at prices you\'ll love.',
    '[Product Benefit] without [Common Pain Point]. Shop our [Collection Name] today!',
    'New arrival: [ProductName]. [Key Feature] designed for [Target Audience].'
  ],
  'Technology': [
    '[Product Name]: [Key Benefit] for [Target Audience]. Start your free trial today.',
    'Introducing [Feature]: The simplest way to [Solve Problem].',
    '[X]% of businesses improved [Metric] with [Product]. See how it works.'
  ],
  'Finance': [
    'Save up to [X]% on [Service]. No hidden fees. Start today.',
    '[Service Name]: [Key Benefit] designed for [Target Audience].',
    'Take control of your [financial aspect] with our [Solution]. Learn more.'
  ],
  'default': [
    '[Company Name]: [Key Value Proposition] for [Target Audience].',
    'Introducing [Product/Service]: The better way to [Solve Problem].',
    'Join [Number]+ satisfied customers who [Benefit from Your Solution].'
  ]
};

const CreativeGuidance: React.FC<CreativeGuidanceProps> = ({ 
  creative, 
  industry, 
  updateCreative 
}) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // Toggle creative format selection
  const toggleFormat = (formatId: string) => {
    if (creative.formats.includes(formatId)) {
      updateCreative({
        ...creative,
        formats: creative.formats.filter(id => id !== formatId)
      });
    } else {
      updateCreative({
        ...creative,
        formats: [...creative.formats, formatId]
      });
    }
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFile(file);
      
      // In a real app, you would upload the file to a server
      // Here we're just storing the file name
      updateCreative({
        ...creative,
        uploadedSamples: [...creative.uploadedSamples, file.name]
      });
    }
  };

  // Remove uploaded sample
  const handleRemoveSample = (fileName: string) => {
    updateCreative({
      ...creative,
      uploadedSamples: creative.uploadedSamples.filter(name => name !== fileName)
    });
  };

  // Get CTA suggestions based on industry
  const getCtaSuggestions = () => {
    return CTA_SUGGESTIONS[industry] || CTA_SUGGESTIONS['default'];
  };

  // Get message templates based on industry
  const getMessageTemplates = () => {
    return MESSAGE_TEMPLATES[industry] || MESSAGE_TEMPLATES['default'];
  };

  // Apply a message template
  const applyMessageTemplate = (template: string) => {
    updateCreative({
      ...creative,
      message: template
    });
  };

  // Apply a CTA
  const applyCta = (cta: string) => {
    updateCreative({
      ...creative,
      cta: cta
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Creative Guidance</h2>
        <p className="text-gray-600 mt-2">
          Get AI recommendations for your ad creatives
        </p>
      </div>

      {/* Content Format Selection */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
          <FontAwesomeIcon icon={faPalette} className="h-5 w-5 text-blue-500 mr-2" />
          Recommended Content Formats
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {CREATIVE_FORMATS.map((format) => (
            <div
              key={format.id}
              onClick={() => toggleFormat(format.id)}
              className={`border rounded-lg p-3 cursor-pointer transition-all ${
                creative.formats.includes(format.id)
                  ? `border-${format.color}-500 bg-${format.color}-50`
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center">
                <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
                  creative.formats.includes(format.id)
                    ? `bg-${format.color}-100 text-${format.color}-600`
                    : 'bg-gray-100 text-gray-500'
                }`}>
                  <FontAwesomeIcon icon={format.icon} className="h-5 w-5" />
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-gray-900">{format.name}</h4>
                  <p className="text-xs text-gray-500">{format.platforms}</p>
                </div>
                {creative.formats.includes(format.id) && (
                  <FontAwesomeIcon icon={faCheckCircle} className={`ml-auto h-5 w-5 text-${format.color}-500`} />
                )}
              </div>
              <p className="mt-2 text-xs text-gray-600">{format.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Creative Samples Upload */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
        <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
          <FontAwesomeIcon icon={faFileUpload} className="h-5 w-5 text-blue-500 mr-2" />
          Upload Creative Samples (Optional)
        </h3>
        <p className="text-sm text-gray-600 mb-3">
          Upload examples of your current creatives or brand assets to get more tailored recommendations
        </p>
        
        <div className="flex items-center justify-center mt-2">
          <label className="w-full flex flex-col items-center px-4 py-6 bg-white rounded-lg shadow-sm border border-gray-300 border-dashed cursor-pointer hover:bg-gray-50">
            <FontAwesomeIcon icon={faFileUpload} className="h-8 w-8 text-gray-400" />
            <span className="mt-2 text-sm text-gray-600">
              Drag files here or click to upload
            </span>
            <span className="mt-1 text-xs text-gray-500">
              Supports: JPG, PNG, GIF, MP4 (Max 10MB)
            </span>
            <input 
              type="file" 
              className="hidden" 
              accept="image/*,video/*" 
              onChange={handleFileUpload}
            />
          </label>
        </div>
        
        {/* Uploaded Samples */}
        {creative.uploadedSamples.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Uploaded Samples:</h4>
            <div className="flex flex-wrap gap-2">
              {creative.uploadedSamples.map((sample, index) => (
                <div 
                  key={index} 
                  className="inline-flex items-center bg-blue-50 text-blue-700 text-xs rounded-full px-3 py-1"
                >
                  <span className="truncate max-w-xs">{sample}</span>
                  <button 
                    type="button" 
                    onClick={() => handleRemoveSample(sample)}
                    className="ml-1 text-blue-500 hover:text-blue-700"
                  >
                    <FontAwesomeIcon icon={faTimes} className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Messaging & CTA Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Messaging Templates */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
            <FontAwesomeIcon icon={faLightbulb} className="h-4 w-4 text-yellow-500 mr-2" />
            Messaging Templates
          </h3>
          
          <div className="space-y-3">
            {getMessageTemplates().map((template, index) => (
              <div 
                key={index}
                onClick={() => applyMessageTemplate(template)}
                className="p-2 border border-gray-200 rounded-md cursor-pointer hover:bg-gray-50 text-sm"
              >
                {template}
              </div>
            ))}
          </div>
          
          <div className="mt-4">
            <label htmlFor="message" className="block text-sm font-medium text-gray-700">
              Your Message
            </label>
            <textarea
              id="message"
              rows={3}
              value={creative.message}
              onChange={(e) => updateCreative({...creative, message: e.target.value})}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-1 block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="Enter your ad message or select a template above"
            />
          </div>
        </div>
        
        {/* CTA Recommendations */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
            <FontAwesomeIcon icon={faBullhorn} className="h-4 w-4 text-green-500 mr-2" />
            Recommended Call-to-Actions
          </h3>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {getCtaSuggestions().map((cta, index) => (
              <span 
                key={index}
                onClick={() => applyCta(cta)}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 cursor-pointer hover:bg-green-200"
              >
                {cta}
              </span>
            ))}
          </div>
          
          <div>
            <label htmlFor="cta" className="block text-sm font-medium text-gray-700">
              Your Call-to-Action
            </label>
            <input
              type="text"
              id="cta"
              value={creative.cta}
              onChange={(e) => updateCreative({...creative, cta: e.target.value})}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-1 block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="Enter your CTA or select from suggestions above"
            />
          </div>
        </div>
      </div>

      {/* AI Creative Recommendations */}
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <FontAwesomeIcon icon={faMagic} className="h-5 w-5 text-blue-600" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">AI Creative Recommendations</h3>
            <div className="mt-2 text-sm text-blue-700 space-y-3">
              <p>Based on your industry ({industry || 'not specified'}) and selections, here are our recommendations:</p>
              
              <div className="bg-white rounded-md p-3 border border-blue-200">
                <h4 className="text-xs font-medium text-blue-800 uppercase mb-1">Content Best Practices</h4>
                <ul className="text-xs text-blue-700 space-y-1 list-disc pl-4">
                  <li>Use high-quality images with good lighting and clear focus</li>
                  <li>Keep videos short and engaging - aim for 15-30 seconds</li>
                  <li>Include your brand logo or name in the first 3 seconds</li>
                  <li>Use captions or text overlays for videos (85% are watched without sound)</li>
                  <li>Test different creative variations to see what resonates best</li>
                </ul>
              </div>
              
              <div className="bg-white rounded-md p-3 border border-blue-200">
                <h4 className="text-xs font-medium text-blue-800 uppercase mb-1">Industry-Specific Tips</h4>
                <ul className="text-xs text-blue-700 space-y-1 list-disc pl-4">
                  {industry === 'E-commerce' && (
                    <>
                      <li>Showcase products from multiple angles</li>
                      <li>Include customer testimonials and reviews</li>
                      <li>Display shipping and return policies</li>
                      <li>Create a sense of urgency with limited-time offers</li>
                    </>
                  )}
                  {industry === 'Technology' && (
                    <>
                      <li>Focus on benefits rather than technical features</li>
                      <li>Use screen recordings to demonstrate your product</li>
                      <li>Include data points and statistics to build credibility</li>
                      <li>Show before/after scenarios to highlight value</li>
                    </>
                  )}
                  {industry === 'Finance' && (
                    <>
                      <li>Use simple graphics to explain complex concepts</li>
                      <li>Focus on security and trustworthiness</li>
                      <li>Include testimonials from satisfied customers</li>
                      <li>Use calculators or interactive elements to show value</li>
                    </>
                  )}
                  {(!industry || !['E-commerce', 'Technology', 'Finance'].includes(industry)) && (
                    <>
                      <li>Highlight your unique selling proposition clearly</li>
                      <li>Use authentic imagery that represents your target audience</li>
                      <li>Focus on solving customer pain points</li>
                      <li>Include clear calls-to-action in every creative</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreativeGuidance; 