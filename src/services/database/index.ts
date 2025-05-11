import { neon, neonConfig } from '@neondatabase/serverless';

// Configure Neon serverless connection
neonConfig.fetchConnectionCache = true;

// Create an interface for user data
export interface UserData {
  id?: string;
  email: string;
  companyName: string;
  companyUrl: string;
  createdAt?: string;
}

class DatabaseService {
  private connectionString: string;
  private sql: ReturnType<typeof neon>;

  constructor() {
    // Get connection string from environment variables
    this.connectionString = process.env.REACT_APP_NEON_DATABASE_URL || '';
    
    if (!this.connectionString) {
      console.error('Neon Database connection string not found in environment variables');
    }
    
    // Initialize SQL client
    this.sql = neon(this.connectionString);
    
    // Initialize database if needed
    this.initializeDatabase();
  }

  private async initializeDatabase() {
    try {
      // Create users table if it doesn't exist
      await this.sql`
        CREATE TABLE IF NOT EXISTS users (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          email TEXT NOT NULL UNIQUE,
          company_name TEXT NOT NULL,
          company_url TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `;
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Failed to initialize database:', error);
    }
  }

  /**
   * Save user information to the database
   */
  async saveUser(userData: UserData): Promise<UserData | null> {
    try {
      if (!this.connectionString) {
        console.error('Cannot save user: No database connection string available');
        return null;
      }

      // Check if user already exists
      const existingUser = await this.getUserByEmail(userData.email);
      
      if (existingUser) {
        // Update existing user
        const updated = await this.sql`
          UPDATE users
          SET 
            company_name = ${userData.companyName},
            company_url = ${userData.companyUrl}
          WHERE email = ${userData.email}
          RETURNING id, email, company_name, company_url, created_at
        `;
        
        if (updated.length > 0) {
          return {
            id: updated[0].id,
            email: updated[0].email,
            companyName: updated[0].company_name,
            companyUrl: updated[0].company_url,
            createdAt: updated[0].created_at
          };
        }
      } else {
        // Insert new user
        const inserted = await this.sql`
          INSERT INTO users (email, company_name, company_url)
          VALUES (${userData.email}, ${userData.companyName}, ${userData.companyUrl})
          RETURNING id, email, company_name, company_url, created_at
        `;
        
        if (inserted.length > 0) {
          return {
            id: inserted[0].id,
            email: inserted[0].email,
            companyName: inserted[0].company_name,
            companyUrl: inserted[0].company_url,
            createdAt: inserted[0].created_at
          };
        }
      }
      
      return null;
    } catch (error) {
      console.error('Failed to save user to database:', error);
      return null;
    }
  }

  /**
   * Get user by email
   */
  async getUserByEmail(email: string): Promise<UserData | null> {
    try {
      if (!this.connectionString) {
        console.error('Cannot get user: No database connection string available');
        return null;
      }

      const users = await this.sql`
        SELECT id, email, company_name, company_url, created_at
        FROM users
        WHERE email = ${email}
      `;
      
      if (users.length === 0) {
        return null;
      }
      
      return {
        id: users[0].id,
        email: users[0].email,
        companyName: users[0].company_name,
        companyUrl: users[0].company_url,
        createdAt: users[0].created_at
      };
    } catch (error) {
      console.error('Failed to get user from database:', error);
      return null;
    }
  }
}

// Export singleton instance
export const databaseService = new DatabaseService(); 