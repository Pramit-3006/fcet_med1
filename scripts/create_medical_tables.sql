-- Create patients table
CREATE TABLE IF NOT EXISTS patients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  date_of_birth DATE,
  gender VARCHAR(20),
  phone VARCHAR(20),
  email VARCHAR(255),
  address TEXT,
  medical_record_number VARCHAR(50) UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create medical_records table
CREATE TABLE IF NOT EXISTS medical_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  record_type VARCHAR(50) NOT NULL, -- 'diagnosis', 'treatment', 'lab_result', etc.
  title VARCHAR(200) NOT NULL,
  description TEXT,
  date_recorded DATE NOT NULL,
  provider_name VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create analysis_results table
CREATE TABLE IF NOT EXISTS analysis_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  image_name VARCHAR(255) NOT NULL,
  image_type VARCHAR(50),
  analysis_text TEXT,
  confidence_score DECIMAL(5,4),
  risk_level VARCHAR(20),
  key_findings TEXT[],
  recommendations TEXT[],
  analyzed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_patients_user_id ON patients(user_id);
CREATE INDEX IF NOT EXISTS idx_patients_mrn ON patients(medical_record_number);
CREATE INDEX IF NOT EXISTS idx_medical_records_patient_id ON medical_records(patient_id);
CREATE INDEX IF NOT EXISTS idx_analysis_results_patient_id ON analysis_results(patient_id);

-- Enable Row Level Security
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE analysis_results ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own patients" ON patients
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own patients" ON patients
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own patients" ON patients
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own patients" ON patients
  FOR DELETE USING (auth.uid() = user_id);

-- Medical records policies
CREATE POLICY "Users can view medical records of their patients" ON medical_records
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM patients 
      WHERE patients.id = medical_records.patient_id 
      AND patients.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert medical records for their patients" ON medical_records
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM patients 
      WHERE patients.id = medical_records.patient_id 
      AND patients.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update medical records of their patients" ON medical_records
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM patients 
      WHERE patients.id = medical_records.patient_id 
      AND patients.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete medical records of their patients" ON medical_records
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM patients 
      WHERE patients.id = medical_records.patient_id 
      AND patients.user_id = auth.uid()
    )
  );

-- Analysis results policies
CREATE POLICY "Users can view analysis results of their patients" ON analysis_results
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM patients 
      WHERE patients.id = analysis_results.patient_id 
      AND patients.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert analysis results for their patients" ON analysis_results
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM patients 
      WHERE patients.id = analysis_results.patient_id 
      AND patients.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update analysis results of their patients" ON analysis_results
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM patients 
      WHERE patients.id = analysis_results.patient_id 
      AND patients.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete analysis results of their patients" ON analysis_results
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM patients 
      WHERE patients.id = analysis_results.patient_id 
      AND patients.user_id = auth.uid()
    )
  );
