# Deploying to Vercel

Follow these steps to deploy your Adsightful React application to Vercel:

## Prerequisites

1. Create a [Vercel account](https://vercel.com/signup) if you don't have one already
2. Install the Vercel CLI: `npm install -g vercel`

## Deployment Steps

### Option 1: Deploy via CLI (Recommended)

1. Log in to Vercel from the terminal:
   ```
   vercel login
   ```

2. Deploy your project:
   ```
   vercel
   ```
   
3. Follow the prompts in the CLI. When asked about environment variables, add:
   - Name: `REACT_APP_OPENAI_API_KEY`
   - Value: `your-openai-api-key-here`

4. After deployment, your app will be available at the URL provided by Vercel (typically `https://your-project-name.vercel.app`)

### Option 2: Deploy via GitHub Integration

1. Push your code to a GitHub repository:
   ```
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/your-username/your-repo-name.git
   git push -u origin main
   ```

2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "New Project" 
4. Import your GitHub repository
5. Configure the project:
   - Framework Preset: Create React App
   - Environment Variables: Add `REACT_APP_OPENAI_API_KEY` with your API key
   
6. Click "Deploy"

## Verifying Your Deployment

After deployment, verify that:

1. The application loads correctly
2. The OpenAI integration works properly
3. All features (audience research, creative assets, etc.) function as expected

## Troubleshooting

If you encounter issues:

1. Check Vercel build logs for errors
2. Verify that your environment variables are properly set
3. Make sure your API key is valid and has proper permissions

For additional help, refer to [Vercel documentation](https://vercel.com/docs) or contact your development team. 