-- Create database tables for medical image analysis
-- This script will be executed automatically

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Medical analyses table
CREATE TABLE IF NOT EXISTS medical_analyses (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    file_name TEXT NOT NULL,
    file_type TEXT NOT NULL,
    file_size INTEGER,
    image_url TEXT,
    
    -- Analysis results
    analysis_type TEXT NOT NULL,
    status TEXT DEFAULT 'processing',
    confidence REAL,
    
    -- PMSFCA specific results
    pmsfca_results JSONB,
    
    -- AI analysis results
    ai_analysis TEXT,
    ai_confidence REAL,
    
    -- Tissue classification results
    white_matter JSONB,
    grey_matter JSONB,
    csf_matter JSONB,
    
    -- Metadata
    processing_time INTEGER,
    error_message TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Relations
    user_id TEXT REFERENCES users(id)
);

-- Analysis sessions table
CREATE TABLE IF NOT EXISTS analysis_sessions (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    session_id TEXT UNIQUE NOT NULL,
    
    -- Session data
    uploaded_files JSONB DEFAULT '[]'::jsonb,
    current_step TEXT DEFAULT 'upload',
    
    -- Results
    analyses TEXT[] DEFAULT '{}',
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '24 hours')
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_medical_analyses_user_id ON medical_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_medical_analyses_status ON medical_analyses(status);
CREATE INDEX IF NOT EXISTS idx_medical_analyses_analysis_type ON medical_analyses(analysis_type);
CREATE INDEX IF NOT EXISTS idx_analysis_sessions_session_id ON analysis_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_analysis_sessions_expires_at ON analysis_sessions(expires_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_medical_analyses_updated_at BEFORE UPDATE ON medical_analyses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_analysis_sessions_updated_at BEFORE UPDATE ON analysis_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
