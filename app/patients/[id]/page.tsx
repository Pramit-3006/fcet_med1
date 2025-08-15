import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, User, Calendar, Phone, Mail, MapPin, FileText, Edit } from "lucide-react"
import Link from "next/link"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function PatientDetailPage({ params }: PageProps) {
  const { id } = await params
  const supabase = createClient()

  // Fetch patient details - using mock data since Supabase tables may not exist yet
  const mockPatient = {
    id: id,
    first_name: "John",
    last_name: "Doe",
    medical_record_number: "MRN-001",
    date_of_birth: "1980-01-15",
    gender: "male",
    phone: "+1 (555) 123-4567",
    email: "john.doe@email.com",
    address: "123 Main St, City, State 12345",
  }

  const mockAnalysisResults = [
    {
      id: "1",
      image_type: "Chest X-Ray",
      analysis_text:
        "Normal chest X-ray with clear lung fields. No signs of pneumonia, pleural effusion, or other abnormalities detected.",
      confidence_score: 0.95,
      created_at: new Date().toISOString(),
    },
  ]

  const mockMedicalRecords = [
    {
      id: "1",
      record_type: "Annual Checkup",
      diagnosis: "Routine examination - Normal",
      notes: "Patient reports feeling well. Vital signs within normal limits.",
      created_at: new Date().toISOString(),
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center mb-8">
          <Link href="/patients">
            <Button variant="ghost" size="sm" className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Patients
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">
              {mockPatient.first_name} {mockPatient.last_name}
            </h1>
            <p className="text-gray-600 mt-2">Patient Details and Medical History</p>
          </div>
          <Button className="bg-violet-600 hover:bg-violet-700">
            <Edit className="h-4 w-4 mr-2" />
            Edit Patient
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Patient Information */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="bg-violet-100 p-3 rounded-full">
                    <User className="h-6 w-6 text-violet-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Patient Information</CardTitle>
                    <CardDescription>Basic details and contact information</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">MRN</span>
                  <Badge variant="outline">{mockPatient.medical_record_number}</Badge>
                </div>

                <div className="flex items-center space-x-3">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium">Date of Birth</p>
                    <p className="text-sm text-gray-600">{new Date(mockPatient.date_of_birth).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Gender</span>
                  <span className="text-sm text-gray-900 capitalize">{mockPatient.gender}</span>
                </div>

                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium">Phone</p>
                    <p className="text-sm text-gray-600">{mockPatient.phone}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-gray-600">{mockPatient.email}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium">Address</p>
                    <p className="text-sm text-gray-600">{mockPatient.address}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Medical Records and Analysis Results */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Analysis Results */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Recent Analysis Results
                </CardTitle>
                <CardDescription>Latest medical image analysis results</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockAnalysisResults.map((result) => (
                    <div key={result.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{result.image_type}</h4>
                        <Badge variant="outline" className="text-xs">
                          {new Date(result.created_at).toLocaleDateString()}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{result.analysis_text}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          Confidence: {Math.round(result.confidence_score * 100)}%
                        </span>
                        <Link href={`/results?id=${result.id}`}>
                          <Button variant="outline" size="sm">
                            View Full Report
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Medical Records */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Medical Records
                </CardTitle>
                <CardDescription>Patient medical history and records</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockMedicalRecords.map((record) => (
                    <div key={record.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{record.record_type}</h4>
                        <Badge variant="outline" className="text-xs">
                          {new Date(record.created_at).toLocaleDateString()}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        <strong>Diagnosis:</strong> {record.diagnosis}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Notes:</strong> {record.notes}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
