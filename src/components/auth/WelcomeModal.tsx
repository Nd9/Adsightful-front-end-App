import React, { useState } from 'react';
import { authService } from '../../services/auth';
import { databaseService } from '../../services/database';

interface WelcomeModalProps {
  onComplete: () => void;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ onComplete }) => {
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companyUrl, setCompanyUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Validate inputs
    if (!email || !companyName || !companyUrl) {
      setError('All fields are required');
      setIsLoading(false);
      return;
    }

    try {
      // Validate URL format
      let finalUrl = companyUrl;
      if (!finalUrl.match(/^(http|https):\/\/[^ "]+$/)) {
        if (!finalUrl.includes('.')) {
          setError('Please enter a valid URL including domain (e.g., company.com)');
          setIsLoading(false);
          return;
        }
        // Add https:// if missing
        finalUrl = finalUrl.startsWith('http') ? finalUrl : `https://${finalUrl}`;
        setCompanyUrl(finalUrl);
      }

      // Login/register the user in local storage
      await authService.login(email, companyName, finalUrl);
      
      // Save user information to the database
      try {
        const savedUser = await databaseService.saveUser({
          email,
          companyName,
          companyUrl: finalUrl
        });
        
        if (savedUser) {
          console.log('User information saved to database:', savedUser);
        } else {
          console.warn('Failed to save user information to database, but local login succeeded');
        }
      } catch (dbError) {
        console.error('Database error:', dbError);
        // Continue with local login even if database save fails
      }
      
      // Notify parent component that login is complete
      onComplete();
    } catch (err) {
      setError('Failed to process your information. Please try again.');
      console.error('Login failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Welcome to Adsightful</h2>
        
        <p className="text-gray-600 mb-6">
          Please provide your information to get started with our personalized advertising platform.
        </p>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="company-name" className="block text-sm font-medium text-gray-700 mb-1">
              Company Name
            </label>
            <input
              type="text"
              id="company-name"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Your Company Inc."
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="company-url" className="block text-sm font-medium text-gray-700 mb-1">
              Company Website
            </label>
            <input
              type="url"
              id="company-url"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://yourcompany.com"
              value={companyUrl}
              onChange={(e) => setCompanyUrl(e.target.value)}
              required
            />
            <p className="mt-1 text-sm text-gray-500">
              We'll use this to help generate audience insights specific to your company.
            </p>
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
              {error}
            </div>
          )}
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isLoading ? 'Processing...' : 'Get Started'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default WelcomeModal; 