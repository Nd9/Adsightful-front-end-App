# Adsightful React Application

A powerful AI-driven advertising platform that helps users create targeted ad campaigns with audience segmentation, creative generation, and performance tracking.

## Features

- User authentication with company profile
- Audience research based on company website
- AI-powered audience segmentation and persona creation
- Platform-specific advertising strategy generation
- Creative asset generation using OpenAI's DALL-E
- Campaign performance tracking and insights
- Persistent storage of user data with Neon Database

## Getting Started

### Prerequisites

- Node.js 14.x or higher
- npm or yarn
- Neon PostgreSQL Database (for persistent storage)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/your-username/adsightful-react.git
   cd adsightful-react
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with your API keys:
   ```
   # OpenAI API Key
   REACT_APP_OPENAI_API_KEY=your_openai_api_key_here
   
   # Neon Database URL
   REACT_APP_NEON_DATABASE_URL=postgresql://username:password@your-neon-database-url/dbname
   ```

4. Start the development server
   ```bash
   npm start
   ```

## OpenAI Integration

The platform uses OpenAI's DALL-E model to generate ad creatives based on audience strategies. To enable this feature:

1. Create an account at [OpenAI](https://platform.openai.com/)
2. Generate an API key in your account dashboard
3. Add the API key to your `.env` file as `REACT_APP_OPENAI_API_KEY`

## Neon Database Integration

The application uses Neon PostgreSQL database to store user information:

1. Create an account at [Neon](https://neon.tech)
2. Create a new project in your dashboard
3. Get your connection string from the connection details
4. Add the connection string to your `.env` file as `REACT_APP_NEON_DATABASE_URL`

## Usage

1. First time users will be prompted to enter their email, company name, and company URL
2. Navigate to the Audience Research Agent to analyze your company's target audience
3. Save audience strategies to your profile
4. Use the Creative Asset Library to generate platform-specific ad creatives based on your audience strategies
5. Download and use the generated creatives in your marketing campaigns

## License

[MIT](LICENSE)
