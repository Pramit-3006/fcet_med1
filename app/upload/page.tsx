"use client"

import type React from "react"
import { useState, useCallback, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Brain, Upload, X, FileImage, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

interface UploadedFile {
  id: string
  file: File
  preview: string
  status: "uploading" | "completed" | "error" | "analyzing" | "analyzed"
  progress: number
  error?: string
  analysis?: AnalysisResult
}

interface AnalysisResult {
  id: string
  fileName: string
  fileType: string
  timestamp: string
  analysis: string
  confidence: number
  status: string
}

export default function UploadPage() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState<string>("")
  const [patients, setPatients] = useState<any[]>([])
  const searchParams = useSearchParams()

  const patientId = useMemo(() => searchParams.get("patientId"), [searchParams])

  const acceptedFormats = [".dcm", ".jpg", ".jpeg", ".png", ".tiff", ".bmp"]
  const maxFileSize = 50 * 1024 * 1024 // 50MB

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}")
    if (currentUser.id) {
      const storedPatients = JSON.parse(localStorage.getItem("patients") || "[]")
      const userPatients = storedPatients.filter((p: any) => p.user_id === currentUser.id)
      setPatients(userPatients)

      if (patientId && userPatients.find((p: any) => p.id === patientId)) {
        setSelectedPatient(patientId)
      }
    }
  }, [patientId])

  const validateFile = (file: File): string | null => {
    const extension = "." + file.name.split(".").pop()?.toLowerCase()
    if (!acceptedFormats.includes(extension)) {
      return `Unsupported format. Please use: ${acceptedFormats.join(", ")}`
    }
    if (file.size > maxFileSize) {
      return "File size must be less than 50MB"
    }
    return null
  }

  const simulateUpload = (fileId: string) => {
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 15
      if (progress >= 100) {
        progress = 100
        clearInterval(interval)
        setUploadedFiles((prev) =>
          prev.map((f) => (f.id === fileId ? { ...f, status: "completed", progress: 100 } : f)),
        )
      } else {
        setUploadedFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, progress } : f)))
      }
    }, 200)
  }

  const handleFiles = useCallback((files: FileList) => {
    Array.from(files).forEach((file) => {
      const error = validateFile(file)
      const fileId = Math.random().toString(36).substr(2, 9)

      if (error) {
        const errorFile: UploadedFile = {
          id: fileId,
          file,
          preview: "",
          status: "error",
          progress: 0,
          error,
        }
        setUploadedFiles((prev) => [...prev, errorFile])
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const newFile: UploadedFile = {
          id: fileId,
          file,
          preview: e.target?.result as string,
          status: "uploading",
          progress: 0,
        }
        setUploadedFiles((prev) => [...prev, newFile])
        simulateUpload(fileId)
      }
      reader.readAsDataURL(file)
    })
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)
      const files = e.dataTransfer.files
      handleFiles(files)
    },
    [handleFiles],
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (files) {
        handleFiles(files)
      }
    },
    [handleFiles],
  )

  const removeFile = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId))
  }

  const analyzeImages = async () => {
    setIsAnalyzing(true)
    const completedFiles = uploadedFiles.filter((f) => f.status === "completed")

    for (const file of completedFiles) {
      setUploadedFiles((prev) => prev.map((f) => (f.id === file.id ? { ...f, status: "analyzing" } : f)))

      try {
        const response = await fetch("/api/analyze", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            imageData: file.preview,
            fileName: file.file.name,
            fileType: file.file.type,
          }),
        })

        if (!response.ok) {
          throw new Error("Analysis failed")
        }

        const { result } = await response.json()

        setUploadedFiles((prev) =>
          prev.map((f) =>
            f.id === file.id
              ? {
                  ...f,
                  status: "analyzed",
                  analysis: result,
                }
              : f,
          ),
        )

        if (selectedPatient) {
          const analysisRecord = {
            id: Date.now().toString(),
            patient_id: selectedPatient,
            type: "ai_analysis",
            fileName: file.file.name,
            fileType: file.file.type,
            analysis: result.analysis,
            confidence: result.confidence,
            timestamp: new Date().toISOString(),
            imageData: file.preview,
          }

          const existingRecords = JSON.parse(localStorage.getItem("medical_records") || "[]")
          existingRecords.push(analysisRecord)
          localStorage.setItem("medical_records", JSON.stringify(existingRecords))
        }
      } catch (error) {
        console.error("Analysis error:", error)
        setUploadedFiles((prev) =>
          prev.map((f) =>
            f.id === file.id
              ? {
                  ...f,
                  status: "error",
                  error: "Analysis failed. Please try again.",
                }
              : f,
          ),
        )
      }
    }

    setIsAnalyzing(false)
  }

  const downloadReport = () => {
    const reportData = {
      title: "Medical Image Analysis Report",
      generatedAt: new Date().toISOString(),
      summary: {
        totalImages: uploadedFiles.filter((f) => f.status === "analyzed").length,
        analysisDate: new Date().toLocaleDateString(),
        averageConfidence: Math.round(
          (uploadedFiles.reduce((acc, f) => acc + (f.analysis?.confidence || 0), 0) / uploadedFiles.length) * 100,
        ),
      },
      results: uploadedFiles
        .filter((f) => f.status === "analyzed")
        .map((file) => ({
          fileName: file.file.name,
          fileType: file.file.type,
          fileSize: `${(file.file.size / 1024 / 1024).toFixed(2)} MB`,
          timestamp: file.analysis?.timestamp,
          analysis: file.analysis?.analysis,
          confidence: file.analysis?.confidence ? Math.round(file.analysis.confidence * 100) : 0,
          status: file.analysis?.status,
        })),
    }

    const reportContent = `MEDICAL IMAGE ANALYSIS REPORT
Generated: ${new Date().toLocaleString()}

SUMMARY
=======
Total Images Analyzed: ${reportData.summary.totalImages}
Analysis Date: ${reportData.summary.analysisDate}
Average Confidence: ${reportData.summary.averageConfidence}%

DETAILED RESULTS
===============
${reportData.results
  .map(
    (result, index) => `
${index + 1}. ${result.fileName}
   File Type: ${result.fileType}
   File Size: ${result.fileSize}
   Confidence: ${result.confidence}%
   Analysis Date: ${new Date(result.timestamp || "").toLocaleString()}
   
   Analysis:
   ${result.analysis}
   
   ${"=".repeat(80)}
`,
  )
  .join("")}

DISCLAIMER
==========
This AI analysis is for screening purposes only. Please consult with a qualified healthcare professional for proper medical diagnosis and treatment recommendations.

Report generated by MedAnalyze AI System
`

    const blob = new Blob([reportContent], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `medical-analysis-report-${new Date().toISOString().split("T")[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const completedFiles = uploadedFiles.filter((f) => f.status === "completed")
  const hasCompletedFiles = completedFiles.length > 0
  const analyzedFiles = uploadedFiles.filter((f) => f.status === "analyzed")
  const hasAnalyzedFiles = analyzedFiles.length > 0

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm text-muted-foreground">Back to Home</span>
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
                Upload Images
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2" style={{ fontFamily: "var(--font-heading)" }}>
              Upload Medical Images
            </h1>
            <p className="text-muted-foreground">
              Upload your medical images for AI-powered analysis. Supported formats: DICOM, JPEG, PNG, TIFF, BMP
            </p>
          </div>

          {/* Upload Area */}
          <Card className="mb-8">
            <CardContent className="p-8">
              <div
                className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                  isDragOver ? "border-accent bg-accent/5" : "border-border hover:border-accent/50 hover:bg-accent/5"
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center">
                    <Upload className="w-8 h-8 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Drop your medical images here</h3>
                    <p className="text-muted-foreground mb-4">or click to browse files</p>
                    <input
                      type="file"
                      multiple
                      accept={acceptedFormats.join(",")}
                      onChange={handleFileInput}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload">
                      <Button asChild className="cursor-pointer">
                        <span>Choose Files</span>
                      </Button>
                    </label>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>Maximum file size: 50MB per file</p>
                    <p>Supported formats: {acceptedFormats.join(", ")}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Patient Selection Dropdown */}
          {patients.length > 0 && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Associate with Patient</CardTitle>
                <CardDescription>
                  {selectedPatient && patientId
                    ? "Analysis results will be automatically saved to this patient's record"
                    : "Select a patient to save AI analysis results to their medical record"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <select
                  value={selectedPatient}
                  onChange={(e) => setSelectedPatient(e.target.value)}
                  className="w-full p-2 border border-border rounded-md bg-background"
                  disabled={!!patientId}
                >
                  <option value="">Select a patient (optional)</option>
                  {patients.map((patient) => (
                    <option key={patient.id} value={patient.id}>
                      {patient.name} - {patient.medical_record_number}
                    </option>
                  ))}
                </select>
                {selectedPatient && patientId && (
                  <div className="mt-2 p-2 bg-violet-50 rounded-md">
                    <p className="text-sm text-violet-700">
                      <strong>Selected Patient:</strong> {patients.find((p) => p.id === selectedPatient)?.name}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* File List */}
          {uploadedFiles.length > 0 && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileImage className="w-5 h-5" />
                  Uploaded Files ({uploadedFiles.length})
                </CardTitle>
                <CardDescription>Track the progress of your uploaded medical images</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {uploadedFiles.map((file) => (
                  <div key={file.id} className="border border-border rounded-lg overflow-hidden">
                    <div className="flex items-center gap-4 p-4">
                      {file.preview && (
                        <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={file.preview || "/placeholder.svg"}
                            alt={file.file.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-medium text-foreground truncate">{file.file.name}</p>
                          {file.status === "completed" && <CheckCircle className="w-4 h-4 text-green-500" />}
                          {file.status === "analyzed" && <Brain className="w-4 h-4 text-accent" />}
                          {file.status === "analyzing" && (
                            <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                          )}
                          {file.status === "error" && <AlertCircle className="w-4 h-4 text-destructive" />}
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">
                          {(file.file.size / 1024 / 1024).toFixed(2)} MB
                          {file.status === "analyzing" && " • Analyzing..."}
                          {file.status === "analyzed" && " • Analysis Complete"}
                        </p>
                        {file.status === "uploading" && <Progress value={file.progress} className="h-2" />}
                        {file.status === "error" && (
                          <Alert className="mt-2">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription className="text-xs">{file.error}</AlertDescription>
                          </Alert>
                        )}
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => removeFile(file.id)} className="flex-shrink-0">
                        <X className="w-4 h-4" />
                      </Button>
                    </div>

                    {file.status === "analyzed" && file.analysis && (
                      <div className="border-t border-border bg-muted/30 p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Brain className="w-4 h-4 text-accent" />
                          <h4 className="text-sm font-semibold text-foreground">AI Analysis Results</h4>
                          <Badge variant="secondary" className="text-xs">
                            {Math.round(file.analysis.confidence * 100)}% confidence
                          </Badge>
                        </div>
                        <div className="text-sm text-foreground whitespace-pre-wrap bg-background/50 p-3 rounded-md border">
                          {file.analysis.analysis}
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          Analyzed on {new Date(file.analysis.timestamp).toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Analysis Button */}
          {hasCompletedFiles && (
            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">Ready for Analysis</h3>
                    <p className="text-muted-foreground">
                      {completedFiles.length} image{completedFiles.length !== 1 ? "s" : ""} uploaded successfully
                    </p>
                  </div>
                  <Button
                    size="lg"
                    className="bg-accent hover:bg-accent/90"
                    onClick={analyzeImages}
                    disabled={isAnalyzing}
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Brain className="w-4 h-4 mr-2" />
                        Start AI Analysis
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Results Summary */}
          {hasAnalyzedFiles && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  Analysis Complete
                </CardTitle>
                <CardDescription>
                  {analyzedFiles.length} image{analyzedFiles.length !== 1 ? "s" : ""} analyzed successfully
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Button asChild>
                    <Link href="/results">View Detailed Results</Link>
                  </Button>
                  <Button variant="outline" onClick={downloadReport}>
                    Download Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
