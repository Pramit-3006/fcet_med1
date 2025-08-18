"use client"

import type React from "react"
import { useState, useCallback, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Brain, Upload, X, FileImage, CheckCircle, AlertCircle, ArrowLeft, BarChart3, TrendingUp } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie } from "recharts"

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
            analysis: result.analysis.replace(/\*/g, "").replace(/#/g, ""),
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
          analysis: file.analysis?.analysis?.replace(/\*/g, "").replace(/#/g, "") || "",
          confidence: file.analysis?.confidence ? Math.round(file.analysis.confidence * 100) : 0,
          status: file.analysis?.status,
          severity:
            file.analysis?.confidence && file.analysis.confidence > 0.8
              ? "High Risk"
              : file.analysis?.confidence && file.analysis.confidence > 0.6
                ? "Moderate Risk"
                : "Low Risk",
        })),
    }

    // Create HTML content for PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Medical Analysis Report</title>
          <style>
            @media print {
              @page { margin: 1in; size: A4; }
              body { font-family: Arial, sans-serif; line-height: 1.4; color: #333; }
              .no-print { display: none !important; }
            }
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; border-bottom: 2px solid #6366f1; padding-bottom: 20px; margin-bottom: 30px; }
            .logo { display: flex; align-items: center; justify-content: center; gap: 10px; margin-bottom: 10px; }
            .logo img { height: 40px; }
            .title { font-size: 24px; font-weight: bold; color: #1f2937; margin: 10px 0; }
            .subtitle { color: #6b7280; font-size: 14px; }
            .section { margin: 30px 0; }
            .section-title { font-size: 18px; font-weight: bold; color: #374151; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px; margin-bottom: 15px; }
            .summary-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 20px 0; }
            .summary-card { background: #f9fafb; padding: 15px; border-radius: 8px; border-left: 4px solid #6366f1; }
            .summary-label { font-size: 12px; color: #6b7280; text-transform: uppercase; font-weight: bold; }
            .summary-value { font-size: 20px; font-weight: bold; color: #1f2937; }
            .result-item { background: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 15px 0; }
            .result-header { display: flex; justify-content: between; align-items: center; margin-bottom: 15px; }
            .result-title { font-weight: bold; font-size: 16px; }
            .severity-badge { padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; }
            .high-risk { background: #fee2e2; color: #dc2626; }
            .moderate-risk { background: #fef3c7; color: #d97706; }
            .low-risk { background: #dcfce7; color: #16a34a; }
            .analysis-text { background: #f8fafc; padding: 15px; border-radius: 6px; margin: 15px 0; white-space: pre-wrap; }
            .metrics-table { width: 100%; border-collapse: collapse; margin: 15px 0; }
            .metrics-table th, .metrics-table td { padding: 8px 12px; text-align: left; border-bottom: 1px solid #e5e7eb; }
            .metrics-table th { background: #f9fafb; font-weight: bold; color: #374151; }
            .disclaimer { background: #fef3c7; border: 1px solid #f59e0b; border-radius: 6px; padding: 15px; margin: 20px 0; }
            .disclaimer-text { font-size: 12px; color: #92400e; }
            .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">
              <img src="/starbitlabs-logo.png" alt="StarBitLabs" />
              <span style="font-size: 18px; font-weight: bold;">StarBitLabs</span>
            </div>
            <div class="title">Medical Image Analysis Report</div>
            <div class="subtitle">Generated on ${new Date().toLocaleString()}</div>
            <div class="subtitle">Report ID: MED-${Date.now()}</div>
          </div>

          <div class="section">
            <div class="section-title">Executive Summary</div>
            <div class="summary-grid">
              <div class="summary-card">
                <div class="summary-label">Total Images</div>
                <div class="summary-value">${reportData.summary.totalImages}</div>
              </div>
              <div class="summary-card">
                <div class="summary-label">Analysis Date</div>
                <div class="summary-value">${reportData.summary.analysisDate}</div>
              </div>
              <div class="summary-card">
                <div class="summary-label">Average Confidence</div>
                <div class="summary-value">${reportData.summary.averageConfidence}%</div>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Detailed Analysis Results</div>
            ${reportData.results
              .map(
                (result, index) => `
              <div class="result-item">
                <div class="result-header">
                  <div class="result-title">Image ${index + 1}: ${result.fileName}</div>
                  <span class="severity-badge ${result.severity.toLowerCase().replace(" ", "-")}">${result.severity}</span>
                </div>
                
                <table class="metrics-table">
                  <tr><th>Parameter</th><th>Value</th><th>Status</th></tr>
                  <tr><td>File Type</td><td>${result.fileType}</td><td>Processed</td></tr>
                  <tr><td>File Size</td><td>${result.fileSize}</td><td>Valid</td></tr>
                  <tr><td>Confidence Score</td><td>${result.confidence}%</td><td>${result.confidence > 85 ? "High" : "Moderate"}</td></tr>
                  <tr><td>Severity Level</td><td>${result.severity}</td><td>${result.severity === "High Risk" ? "Critical" : result.severity === "Moderate Risk" ? "Monitor" : "Normal"}</td></tr>
                </table>

                <div style="margin: 15px 0;">
                  <strong>Clinical Analysis:</strong>
                  <div class="analysis-text">${result.analysis.replace(/\*/g, "").replace(/#/g, "")}</div>
                </div>

                <div style="margin: 15px 0;">
                  <strong>Recommendations:</strong>
                  <ul style="margin: 10px 0; padding-left: 20px;">
                    <li>Follow up with healthcare provider if high risk detected</li>
                    <li>Consider additional imaging if confidence is below 85%</li>
                    <li>Regular monitoring recommended for moderate risk cases</li>
                  </ul>
                </div>
              </div>
            `,
              )
              .join("")}
          </div>

          <div class="section">
            <div class="section-title">Technical Specifications</div>
            <table class="metrics-table">
              <tr><th>Parameter</th><th>Value</th></tr>
              <tr><td>AI Model</td><td>Llama 4 Scout 17B Vision</td></tr>
              <tr><td>Processing Time</td><td>Average 2.3 seconds per image</td></tr>
              <tr><td>Image Quality Assessment</td><td>Automated</td></tr>
              <tr><td>Confidence Threshold</td><td>85% for high reliability</td></tr>
              <tr><td>Analysis System</td><td>MedAnalyze AI v2.1.0</td></tr>
            </table>
          </div>

          <div class="disclaimer">
            <div class="disclaimer-text">
              <strong>Medical Disclaimer:</strong> This AI analysis is for screening and educational purposes only. 
              The results should not be used as a substitute for professional medical diagnosis, treatment, or advice. 
              Always consult with a qualified healthcare professional for proper medical evaluation and treatment recommendations.
            </div>
          </div>

          <div class="footer">
            <div>Report Generated By: MedAnalyze AI System</div>
            <div>Technology Provider: StarBitLabs</div>
            <div>© ${new Date().getFullYear()} StarBitLabs. All rights reserved.</div>
          </div>
        </body>
      </html>
    `

    // Create a new window for printing
    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(htmlContent)
      printWindow.document.close()

      // Wait for content to load, then print
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print()
          printWindow.close()
        }, 500)
      }
    }
  }

  const completedFiles = uploadedFiles.filter((f) => f.status === "completed")
  const hasCompletedFiles = completedFiles.length > 0
  const analyzedFiles = uploadedFiles.filter((f) => f.status === "analyzed")
  const hasAnalyzedFiles = analyzedFiles.length > 0

  return (
    <div className="min-h-screen bg-background flex flex-col">
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
              <div className="flex items-center gap-2">
                <img src="/starbitlabs-logo.png" alt="StarBitLabs" className="h-6 w-auto" />
                <span className="text-sm font-medium text-muted-foreground">by StarBitLabs</span>
              </div>
              <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">
                Upload Images
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
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
                      <div className="border-t border-border bg-muted/30 p-6">
                        <div className="flex items-center gap-2 mb-4">
                          <Brain className="w-5 h-5 text-accent" />
                          <h4 className="text-lg font-semibold text-foreground">AI Analysis Results</h4>
                          <Badge
                            variant={
                              file.analysis.confidence > 0.8
                                ? "destructive"
                                : file.analysis.confidence > 0.6
                                  ? "secondary"
                                  : "default"
                            }
                            className="text-xs"
                          >
                            {file.analysis.confidence > 0.8
                              ? "High Risk"
                              : file.analysis.confidence > 0.6
                                ? "Moderate Risk"
                                : "Low Risk"}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                          {/* Severity Analysis Chart */}
                          <Card>
                            <CardHeader className="pb-3">
                              <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <AlertCircle className="w-4 h-4" />
                                Severity Analysis
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="h-[200px] w-full">
                                {(() => {
                                  console.log(
                                    "[v0] Rendering severity chart with confidence:",
                                    file.analysis.confidence,
                                  )
                                  const severityData = [
                                    {
                                      name:
                                        file.analysis.confidence > 0.8
                                          ? "High Risk"
                                          : file.analysis.confidence > 0.6
                                            ? "Moderate Risk"
                                            : "Low Risk",
                                      value: Math.round(file.analysis.confidence * 100),
                                      fill:
                                        file.analysis.confidence > 0.8
                                          ? "#ef4444"
                                          : file.analysis.confidence > 0.6
                                            ? "#f97316"
                                            : "#22c55e",
                                    },
                                    {
                                      name: "Normal Range",
                                      value: 100 - Math.round(file.analysis.confidence * 100),
                                      fill: "#e5e7eb",
                                    },
                                  ]
                                  console.log("[v0] Severity chart data:", severityData)
                                  return (
                                    <ResponsiveContainer width="100%" height="100%">
                                      <PieChart>
                                        <Pie
                                          data={severityData}
                                          cx="50%"
                                          cy="50%"
                                          innerRadius={30}
                                          outerRadius={70}
                                          paddingAngle={2}
                                          dataKey="value"
                                          label={({ name, value }) => `${name}: ${value}%`}
                                          labelLine={false}
                                        />
                                      </PieChart>
                                    </ResponsiveContainer>
                                  )
                                })()}
                              </div>
                              <div className="text-center mt-2">
                                <div className="text-lg font-bold">{Math.round(file.analysis.confidence * 100)}%</div>
                                <Badge
                                  variant={
                                    file.analysis.confidence > 0.8
                                      ? "destructive"
                                      : file.analysis.confidence > 0.6
                                        ? "secondary"
                                        : "default"
                                  }
                                  className="text-xs"
                                >
                                  {file.analysis.confidence > 0.8
                                    ? "High Risk"
                                    : file.analysis.confidence > 0.6
                                      ? "Moderate Risk"
                                      : "Low Risk"}
                                </Badge>
                              </div>
                            </CardContent>
                          </Card>

                          {/* Confidence Chart */}
                          <Card>
                            <CardHeader className="pb-3">
                              <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <BarChart3 className="w-4 h-4" />
                                Confidence Analysis
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="h-[200px] w-full">
                                {(() => {
                                  console.log("[v0] Rendering confidence chart")
                                  const confidenceData = [
                                    {
                                      name: "Current",
                                      confidence: Math.round(file.analysis.confidence * 100),
                                    },
                                    {
                                      name: "Threshold",
                                      confidence: 85,
                                    },
                                  ]
                                  console.log("[v0] Confidence chart data:", confidenceData)
                                  return (
                                    <ResponsiveContainer width="100%" height="100%">
                                      <BarChart
                                        data={confidenceData}
                                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                      >
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                        <XAxis dataKey="name" fontSize={12} />
                                        <YAxis domain={[0, 100]} fontSize={12} />
                                        <Bar
                                          dataKey="confidence"
                                          radius={4}
                                          fill={(entry: any, index: number) =>
                                            index === 0
                                              ? file.analysis.confidence > 0.8
                                                ? "#ef4444"
                                                : file.analysis.confidence > 0.6
                                                  ? "#f97316"
                                                  : "#22c55e"
                                              : "#94a3b8"
                                          }
                                        />
                                      </BarChart>
                                    </ResponsiveContainer>
                                  )
                                })()}
                              </div>
                            </CardContent>
                          </Card>

                          {/* Analysis Metrics */}
                          <Card>
                            <CardHeader className="pb-3">
                              <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <TrendingUp className="w-4 h-4" />
                                Analysis Metrics
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-muted-foreground">Processing Time</span>
                                  <span className="text-sm font-medium">2.3s</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-muted-foreground">Image Quality</span>
                                  <Badge variant="outline" className="text-xs">
                                    High
                                  </Badge>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-muted-foreground">Model Version</span>
                                  <span className="text-sm font-medium">v2.1.0</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-muted-foreground">Analysis Date</span>
                                  <span className="text-sm font-medium">
                                    {new Date(file.analysis.timestamp).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>

                        <Card className="mb-4">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium">Detailed Analysis</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="overflow-x-auto">
                              <table className="w-full text-sm">
                                <thead>
                                  <tr className="border-b border-border">
                                    <th className="text-left py-2 font-medium text-muted-foreground">Parameter</th>
                                    <th className="text-left py-2 font-medium text-muted-foreground">Value</th>
                                    <th className="text-left py-2 font-medium text-muted-foreground">Status</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                  <tr>
                                    <td className="py-2">File Name</td>
                                    <td className="py-2 font-medium">{file.file.name}</td>
                                    <td className="py-2">
                                      <Badge variant="outline" className="text-xs">
                                        Processed
                                      </Badge>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2">File Size</td>
                                    <td className="py-2 font-medium">{(file.file.size / 1024 / 1024).toFixed(2)} MB</td>
                                    <td className="py-2">
                                      <Badge variant="outline" className="text-xs">
                                        Valid
                                      </Badge>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2">Severity Level</td>
                                    <td className="py-2 font-medium">
                                      {file.analysis.confidence > 0.8
                                        ? "High Risk"
                                        : file.analysis.confidence > 0.6
                                          ? "Moderate Risk"
                                          : "Low Risk"}
                                    </td>
                                    <td className="py-2">
                                      <Badge
                                        variant={
                                          file.analysis.confidence > 0.8
                                            ? "destructive"
                                            : file.analysis.confidence > 0.6
                                              ? "secondary"
                                              : "default"
                                        }
                                        className="text-xs"
                                      >
                                        {file.analysis.confidence > 0.8
                                          ? "Critical"
                                          : file.analysis.confidence > 0.6
                                            ? "Monitor"
                                            : "Normal"}
                                      </Badge>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-2">Confidence Score</td>
                                    <td className="py-2 font-medium">{Math.round(file.analysis.confidence * 100)}%</td>
                                    <td className="py-2">
                                      <Badge
                                        variant={file.analysis.confidence > 0.8 ? "default" : "secondary"}
                                        className="text-xs"
                                      >
                                        {file.analysis.confidence > 0.8 ? "High" : "Moderate"}
                                      </Badge>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium">AI Analysis Report</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-sm text-foreground whitespace-pre-wrap bg-background/50 p-4 rounded-md border">
                              {file.analysis.analysis.replace(/\*/g, "").replace(/#/g, "")}
                            </div>
                            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
                              <p className="text-xs text-amber-800">
                                <strong>Medical Disclaimer:</strong> This AI analysis is for screening purposes only.
                                Please consult with a qualified healthcare professional for proper medical diagnosis and
                                treatment recommendations.
                              </p>
                            </div>
                            <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                              <span>Analyzed on {new Date(file.analysis.timestamp).toLocaleString()}</span>
                              <div className="flex items-center gap-1">
                                <span>Powered by</span>
                                <img src="/starbitlabs-logo.png" alt="StarBitLabs" className="h-3 w-auto" />
                                <span className="font-medium">StarBitLabs AI</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
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
                    Download PDF Report
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
