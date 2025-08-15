"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Brain,
  ArrowLeft,
  Download,
  Share2,
  Calendar,
  FileImage,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
} from "lucide-react"
import Link from "next/link"

// Mock data - in a real app, this would come from your database or API
const mockResults = [
  {
    id: "1",
    fileName: "chest_xray_001.jpg",
    fileType: "image/jpeg",
    timestamp: "2024-01-15T10:30:00Z",
    imageUrl: "/placeholder-hl5i1.png",
    analysis: `**Image Type**: Chest X-ray (Posteroanterior view)

**Anatomical Region**: Thoracic cavity including lungs, heart, and ribcage

**Key Observations**:
- Clear lung fields bilaterally with normal vascular markings
- Heart size appears within normal limits
- No obvious consolidation, pneumothorax, or pleural effusion
- Bony structures appear intact
- Diaphragm contours are well-defined

**Potential Concerns**: 
- No acute abnormalities detected
- Minor age-related changes in lung parenchyma

**Recommendations**:
- Routine follow-up as clinically indicated
- Consider comparison with previous imaging if available
- Clinical correlation recommended for any symptoms`,
    confidence: 0.92,
    status: "completed",
    findings: ["Normal lung fields", "Heart size normal", "No acute abnormalities"],
    riskLevel: "low",
  },
  {
    id: "2",
    fileName: "brain_mri_002.dcm",
    fileType: "application/dicom",
    timestamp: "2024-01-15T10:35:00Z",
    imageUrl: "/brain-mri-scan.png",
    analysis: `**Image Type**: Brain MRI (T1-weighted axial sequence)

**Anatomical Region**: Brain parenchyma, ventricular system, and surrounding structures

**Key Observations**:
- Normal brain parenchymal signal intensity
- Ventricular system appears normal in size and configuration
- No evidence of mass lesions or abnormal enhancement
- Gray-white matter differentiation is preserved
- No midline shift detected

**Potential Concerns**:
- Small hyperintense focus in left frontal white matter - likely nonspecific
- Age-appropriate cerebral volume loss

**Recommendations**:
- Clinical correlation recommended
- Consider follow-up imaging in 6-12 months if clinically indicated
- Neurological consultation if symptomatic`,
    confidence: 0.88,
    status: "completed",
    findings: ["Normal brain parenchyma", "Small white matter focus", "Age-appropriate changes"],
    riskLevel: "medium",
  },
]

export default function ResultsPage() {
  const [selectedResult, setSelectedResult] = useState(mockResults[0])

  const getRiskBadgeColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case "low":
        return <CheckCircle className="w-4 h-4" />
      case "medium":
        return <Clock className="w-4 h-4" />
      case "high":
        return <AlertTriangle className="w-4 h-4" />
      default:
        return <Activity className="w-4 h-4" />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/upload" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm text-muted-foreground">Back to Upload</span>
              </Link>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                  MedAnalyze
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">
                Analysis Results
              </Badge>
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2" style={{ fontFamily: "var(--font-heading)" }}>
              Analysis Results Dashboard
            </h1>
            <p className="text-muted-foreground">Comprehensive AI-powered analysis results for your medical images</p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                    <FileImage className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{mockResults.length}</p>
                    <p className="text-sm text-muted-foreground">Images Analyzed</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {mockResults.filter((r) => r.riskLevel === "low").length}
                    </p>
                    <p className="text-sm text-muted-foreground">Low Risk</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {mockResults.filter((r) => r.riskLevel === "medium").length}
                    </p>
                    <p className="text-sm text-muted-foreground">Medium Risk</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                    <Activity className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {Math.round((mockResults.reduce((acc, r) => acc + r.confidence, 0) / mockResults.length) * 100)}%
                    </p>
                    <p className="text-sm text-muted-foreground">Avg Confidence</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Results List */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileImage className="w-5 h-5" />
                    Analysis Results
                  </CardTitle>
                  <CardDescription>Select an image to view detailed analysis</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-2">
                    {mockResults.map((result) => (
                      <div
                        key={result.id}
                        className={`p-4 cursor-pointer transition-colors border-l-4 ${
                          selectedResult.id === result.id
                            ? "bg-accent/5 border-l-accent"
                            : "hover:bg-muted/50 border-l-transparent"
                        }`}
                        onClick={() => setSelectedResult(result)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={result.imageUrl || "/placeholder.svg"}
                              alt={result.fileName}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">{result.fileName}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="secondary" className={`text-xs ${getRiskBadgeColor(result.riskLevel)}`}>
                                {getRiskIcon(result.riskLevel)}
                                <span className="ml-1 capitalize">{result.riskLevel} Risk</span>
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                              <Calendar className="w-3 h-3" />
                              {new Date(result.timestamp).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Results */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Brain className="w-5 h-5 text-accent" />
                        {selectedResult.fileName}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-4 mt-2">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(selectedResult.timestamp).toLocaleString()}
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          {Math.round(selectedResult.confidence * 100)}% confidence
                        </Badge>
                      </CardDescription>
                    </div>
                    <Badge variant="secondary" className={getRiskBadgeColor(selectedResult.riskLevel)}>
                      {getRiskIcon(selectedResult.riskLevel)}
                      <span className="ml-1 capitalize">{selectedResult.riskLevel} Risk</span>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="analysis" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="analysis">Analysis</TabsTrigger>
                      <TabsTrigger value="image">Image</TabsTrigger>
                      <TabsTrigger value="findings">Key Findings</TabsTrigger>
                    </TabsList>

                    <TabsContent value="analysis" className="mt-6">
                      <div className="prose prose-sm max-w-none">
                        <div className="bg-background/50 p-4 rounded-lg border whitespace-pre-wrap text-sm text-foreground">
                          {selectedResult.analysis}
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="image" className="mt-6">
                      <div className="flex justify-center">
                        <div className="max-w-md w-full">
                          <img
                            src={selectedResult.imageUrl || "/placeholder.svg"}
                            alt={selectedResult.fileName}
                            className="w-full h-auto rounded-lg border shadow-sm"
                          />
                          <div className="mt-4 text-center">
                            <p className="text-sm text-muted-foreground">
                              {selectedResult.fileName} • {selectedResult.fileType}
                            </p>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="findings" className="mt-6">
                      <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-foreground">Key Findings Summary</h4>
                        <div className="space-y-2">
                          {selectedResult.findings.map((finding, index) => (
                            <div key={index} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                              <span className="text-sm text-foreground">{finding}</span>
                            </div>
                          ))}
                        </div>

                        <div className="mt-6 p-4 bg-accent/5 border border-accent/20 rounded-lg">
                          <div className="flex items-start gap-3">
                            <User className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                            <div>
                              <h5 className="text-sm font-semibold text-foreground mb-1">Clinical Recommendation</h5>
                              <p className="text-sm text-muted-foreground">
                                This AI analysis is for screening purposes only. Please consult with a qualified
                                healthcare professional for proper medical diagnosis and treatment recommendations.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
