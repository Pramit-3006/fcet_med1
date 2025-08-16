"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, User, Calendar, Phone, Mail, MapPin, FileText, Edit, Brain, Zap, Download } from "lucide-react"
import Link from "next/link"

interface PageProps {
  params: Promise<{ id: string }>
}

export default function PatientDetailPage({ params }: PageProps) {
  const [patientId, setPatientId] = useState<string>("")
  const [patient, setPatient] = useState<any>(null)
  const [medicalRecords, setMedicalRecords] = useState<any[]>([])
  const [aiReports, setAiReports] = useState<any[]>([])
  const [enhancedImages, setEnhancedImages] = useState<any[]>([])

  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params
      setPatientId(resolvedParams.id)
    }
    resolveParams()
  }, [params])

  useEffect(() => {
    if (patientId) {
      const storedPatients = JSON.parse(localStorage.getItem("patients") || "[]")
      const foundPatient = storedPatients.find((p: any) => p.id === patientId)

      if (foundPatient) {
        setPatient(foundPatient)
      } else {
        // Mock patient data if not found
        setPatient({
          id: patientId,
          name: "John Doe",
          medical_record_number: "MRN-001",
          date_of_birth: "1980-01-15",
          gender: "male",
          phone: "+1 (555) 123-4567",
          email: "john.doe@email.com",
          address: "123 Main St, City, State 12345",
        })
      }

      // Load medical records from localStorage
      const storedRecords = JSON.parse(localStorage.getItem("medical_records") || "[]")
      const patientRecords = storedRecords.filter((record: any) => record.patient_id === patientId)

      // Separate AI reports and enhanced images
      const aiAnalysisRecords = patientRecords.filter((record: any) => record.type === "ai_analysis")
      const enhancementRecords = patientRecords.filter((record: any) => record.type === "image_enhancement")
      const otherRecords = patientRecords.filter(
        (record: any) => !record.type || (record.type !== "ai_analysis" && record.type !== "image_enhancement"),
      )

      setAiReports(aiAnalysisRecords)
      setEnhancedImages(enhancementRecords)
      setMedicalRecords(otherRecords)
    }
  }, [patientId])

  const downloadEnhancedImage = (imageData: string, fileName: string) => {
    const link = document.createElement("a")
    link.download = fileName || "enhanced-image.png"
    link.href = imageData
    link.click()
  }

  if (!patient) {
    return <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">Loading...</div>
  }

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
            <h1 className="text-3xl font-bold text-gray-900">{patient.name}</h1>
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
                  <Badge variant="outline">{patient.medical_record_number}</Badge>
                </div>

                <div className="flex items-center space-x-3">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium">Date of Birth</p>
                    <p className="text-sm text-gray-600">{new Date(patient.date_of_birth).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Gender</span>
                  <span className="text-sm text-gray-900 capitalize">{patient.gender}</span>
                </div>

                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium">Phone</p>
                    <p className="text-sm text-gray-600">{patient.phone}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-gray-600">{patient.email}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium">Address</p>
                    <p className="text-sm text-gray-600">{patient.address}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
                <CardDescription>Analyze or enhance images for this patient</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href={`/upload?patientId=${patientId}`}>
                  <Button className="w-full bg-violet-600 hover:bg-violet-700">
                    <Brain className="h-4 w-4 mr-2" />
                    AI Image Analysis
                  </Button>
                </Link>
                <Link href={`/enhance?patientId=${patientId}`}>
                  <Button variant="outline" className="w-full bg-transparent">
                    <Zap className="h-4 w-4 mr-2" />
                    Enhance Images
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Medical Records and Analysis Results */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="ai-reports" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="ai-reports" className="flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  AI Reports ({aiReports.length})
                </TabsTrigger>
                <TabsTrigger value="enhanced-images" className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Enhanced Images ({enhancedImages.length})
                </TabsTrigger>
                <TabsTrigger value="medical-records" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Medical Records ({medicalRecords.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="ai-reports">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Brain className="h-5 w-5 mr-2" />
                      AI Analysis Reports
                    </CardTitle>
                    <CardDescription>Medical image analysis results powered by AI</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {aiReports.length > 0 ? (
                      <div className="space-y-4">
                        {aiReports.map((report) => (
                          <div key={report.id} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium">{report.fileName}</h4>
                              <Badge variant="outline" className="text-xs">
                                {new Date(report.timestamp).toLocaleDateString()}
                              </Badge>
                            </div>
                            {report.imageData && (
                              <div className="mb-3">
                                <img
                                  src={report.imageData || "/placeholder.svg"}
                                  alt="Analyzed medical image"
                                  className="w-32 h-32 object-cover rounded border"
                                />
                              </div>
                            )}
                            <p className="text-sm text-gray-600 mb-2">{report.analysis}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-500">
                                Confidence: {Math.round(report.confidence * 100)}%
                              </span>
                              <Badge variant="secondary" className="text-xs">
                                {report.fileType}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-8">
                        No AI analysis reports available for this patient.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="enhanced-images">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Zap className="h-5 w-5 mr-2" />
                      Enhanced Images
                    </CardTitle>
                    <CardDescription>Medical images enhanced using FCET technology</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {enhancedImages.length > 0 ? (
                      <div className="space-y-6">
                        {enhancedImages.map((enhancement) => (
                          <div key={enhancement.id} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="font-medium">Image Enhancement</h4>
                              <Badge variant="outline" className="text-xs">
                                {new Date(enhancement.timestamp).toLocaleDateString()}
                              </Badge>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div>
                                <h5 className="text-sm font-medium mb-2">Original</h5>
                                <img
                                  src={enhancement.originalImage || "/placeholder.svg"}
                                  alt="Original medical image"
                                  className="w-full h-48 object-cover rounded border"
                                />
                              </div>
                              <div>
                                <h5 className="text-sm font-medium mb-2">Enhanced</h5>
                                <img
                                  src={enhancement.enhancedImage || "/placeholder.svg"}
                                  alt="Enhanced medical image"
                                  className="w-full h-48 object-cover rounded border"
                                />
                              </div>
                            </div>

                            {enhancement.metrics && (
                              <div className="bg-gray-50 p-3 rounded mb-3">
                                <h5 className="text-sm font-medium mb-2">Enhancement Metrics</h5>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                                  <div>
                                    <span className="text-gray-500">Resolution:</span>
                                    <br />
                                    <span className="font-medium">
                                      {enhancement.metrics.original_resolution} →{" "}
                                      {enhancement.metrics.enhanced_resolution}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-gray-500">Enhancement:</span>
                                    <br />
                                    <span className="font-medium">{enhancement.metrics.enhancement_factor}</span>
                                  </div>
                                  <div>
                                    <span className="text-gray-500">Quality Score:</span>
                                    <br />
                                    <span className="font-medium">{enhancement.metrics.quality_score.toFixed(1)}%</span>
                                  </div>
                                  <div>
                                    <span className="text-gray-500">Processing Time:</span>
                                    <br />
                                    <span className="font-medium">{enhancement.metrics.processing_time}</span>
                                  </div>
                                </div>
                              </div>
                            )}

                            <div className="flex justify-end">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  downloadEnhancedImage(enhancement.enhancedImage, `enhanced-${enhancement.id}.png`)
                                }
                              >
                                <Download className="h-4 w-4 mr-2" />
                                Download Enhanced
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-8">No enhanced images available for this patient.</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="medical-records">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FileText className="h-5 w-5 mr-2" />
                      Medical Records
                    </CardTitle>
                    <CardDescription>Patient medical history and records</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {medicalRecords.length > 0 ? (
                      <div className="space-y-4">
                        {medicalRecords.map((record) => (
                          <div key={record.id} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium">{record.record_type || "Medical Record"}</h4>
                              <Badge variant="outline" className="text-xs">
                                {new Date(record.created_at || record.timestamp).toLocaleDateString()}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                              <strong>Diagnosis:</strong> {record.diagnosis || "N/A"}
                            </p>
                            <p className="text-sm text-gray-600">
                              <strong>Notes:</strong> {record.notes || "No additional notes"}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-8">No medical records available for this patient.</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
