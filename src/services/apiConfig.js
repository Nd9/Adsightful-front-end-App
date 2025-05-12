// API key configuration
// IMPORTANT: In production, use environment variables and never commit API keys to your repository

console.log("API Config loading...");

// OpenAI API key - use environment variable
const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY || "set-your-api-key-here";

// Set the environment variable for compatibility with existing code
if (!process.env.REACT_APP_OPENAI_API_KEY) {
  console.log("Please set your OpenAI API key in environment variables");
  console.log("OpenAI API key reference length:", OPENAI_API_KEY.length);
}

// Export configuration
export default {
  isConfigured: !!OPENAI_API_KEY && OPENAI_API_KEY !== "set-your-api-key-here",
  apiKey: OPENAI_API_KEY
};