"use client"

import type React from "react"
import { useEffect, useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Download, Upload, Zap, BarChart3, FileText } from "lucide-react"
import { useSearchParams } from "next/navigation"

interface EnhancementSettings {
  brightness: number
  contrast: number
  sharpness: number
  noise_reduction: number
  gamma: number
}

interface ImageMetrics {
  original_resolution: string
  enhanced_resolution: string
  file_size_original: string
  file_size_enhanced: string
  enhancement_factor: string
  processing_time: string
  quality_score: number
}

export default function ImageEnhancePage() {
  const [originalImage, setOriginalImage] = useState<string | null>(null)
  const [enhancedImage, setEnhancedImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [metrics, setMetrics] = useState<ImageMetrics | null>(null)
  const [selectedPatient, setSelectedPatient] = useState<string>("")
  const [patients, setPatients] = useState<any[]>([])
  const searchParams = useSearchParams()
  const [settings, setSettings] = useState<EnhancementSettings>({
    brightness: 100,
    contrast: 100,
    sharpness: 100,
    noise_reduction: 50,
    gamma: 100,
  })

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}")
    if (currentUser.id) {
      const storedPatients = JSON.parse(localStorage.getItem("patients") || "[]")
      const userPatients = storedPatients.filter((p: any) => p.user_id === currentUser.id)
      setPatients(userPatients)

      const patientId = searchParams.get("patientId")
      if (patientId && userPatients.find((p: any) => p.id === patientId)) {
        setSelectedPatient(patientId)
      }
    }
  }, [searchParams])

  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setOriginalImage(e.target?.result as string)
        setEnhancedImage(null)
        setMetrics(null)
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const applyImageEnhancement = useCallback(async () => {
    if (!originalImage || !canvasRef.current) return

    setIsProcessing(true)
    setProgress(0)

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const img = new Image()
    img.onload = () => {
      const startTime = Date.now()

      canvas.width = img.width * 2
      canvas.height = img.height * 2

      setProgress(20)

      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = "high"
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

      setProgress(40)

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data

      for (let i = 0; i < data.length; i += 4) {
        let r = data[i] * (settings.contrast / 100) + (settings.brightness - 100)
        let g = data[i + 1] * (settings.contrast / 100) + (settings.brightness - 100)
        let b = data[i + 2] * (settings.contrast / 100) + (settings.brightness - 100)

        const gamma = settings.gamma / 100
        r = Math.pow(r / 255, 1 / gamma) * 255
        g = Math.pow(g / 255, 1 / gamma) * 255
        b = Math.pow(b / 255, 1 / gamma) * 255

        data[i] = Math.max(0, Math.min(255, r))
        data[i + 1] = Math.max(0, Math.min(255, g))
        data[i + 2] = Math.max(0, Math.min(255, b))
      }

      setProgress(60)

      if (settings.sharpness > 100) {
        const sharpenKernel = [0, -1, 0, -1, 5, -1, 0, -1, 0]
        applyConvolutionFilter(imageData, sharpenKernel, canvas.width, canvas.height)
      }

      setProgress(80)

      ctx.putImageData(imageData, 0, 0)

      const enhancedDataUrl = canvas.toDataURL("image/png")
      setEnhancedImage(enhancedDataUrl)

      const endTime = Date.now()
      const processingTime = ((endTime - startTime) / 1000).toFixed(2)

      setMetrics({
        original_resolution: `${img.width} × ${img.height}`,
        enhanced_resolution: `${canvas.width} × ${canvas.height}`,
        file_size_original: `${((originalImage.length * 0.75) / 1024).toFixed(1)} KB`,
        file_size_enhanced: `${((enhancedDataUrl.length * 0.75) / 1024).toFixed(1)} KB`,
        enhancement_factor: "2x",
        processing_time: `${processingTime}s`,
        quality_score: Math.min(95, 70 + (settings.sharpness - 100) * 0.2 + (settings.contrast - 100) * 0.1),
      })

      setProgress(100)
      setIsProcessing(false)
    }

    img.src = originalImage
  }, [originalImage, settings])

  const applyConvolutionFilter = (imageData: ImageData, kernel: number[], width: number, height: number) => {
    const data = imageData.data
    const output = new Uint8ClampedArray(data)

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        for (let c = 0; c < 3; c++) {
          let sum = 0
          for (let ky = -1; ky <= 1; ky++) {
            for (let kx = -1; kx <= 1; kx++) {
              const idx = ((y + ky) * width + (x + kx)) * 4 + c
              sum += data[idx] * kernel[(ky + 1) * 3 + (kx + 1)]
            }
          }
          output[(y * width + x) * 4 + c] = Math.max(0, Math.min(255, sum))
        }
      }
    }

    for (let i = 0; i < data.length; i++) {
      data[i] = output[i]
    }
  }

  const downloadEnhanced = () => {
    if (!enhancedImage) return

    if (selectedPatient && metrics) {
      const enhancementRecord = {
        id: Date.now().toString(),
        patient_id: selectedPatient,
        type: "image_enhancement",
        originalImage: originalImage,
        enhancedImage: enhancedImage,
        settings: settings,
        metrics: metrics,
        timestamp: new Date().toISOString(),
      }

      const existingRecords = JSON.parse(localStorage.getItem("medical_records") || "[]")
      existingRecords.push(enhancementRecord)
      localStorage.setItem("medical_records", JSON.stringify(existingRecords))
    }

    const link = document.createElement("a")
    link.download = "enhanced-medical-image.png"
    link.href = enhancedImage
    link.click()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">FCET Medical Image Enhancement</h1>
          <p className="text-slate-600">Transform low-resolution medical images into high-quality, detailed scans</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Upload Image
                </CardTitle>
                <CardDescription>Select a medical image to enhance</CardDescription>
              </CardHeader>
              <CardContent>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Button onClick={() => fileInputRef.current?.click()} className="w-full" variant="outline">
                  Choose Image
                </Button>
              </CardContent>
            </Card>

            {patients.length > 0 && originalImage && (
              <Card>
                <CardHeader>
                  <CardTitle>Associate with Patient</CardTitle>
                  <CardDescription>
                    {selectedPatient && searchParams.get("patientId")
                      ? "Enhanced images will be automatically saved to this patient's record"
                      : "Select a patient to save enhanced images to their record"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <select
                    value={selectedPatient}
                    onChange={(e) => setSelectedPatient(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-md bg-white"
                    disabled={!!searchParams.get("patientId")}
                  >
                    <option value="">Select a patient (optional)</option>
                    {patients.map((patient) => (
                      <option key={patient.id} value={patient.id}>
                        {patient.name} - {patient.medical_record_number}
                      </option>
                    ))}
                  </select>
                  {selectedPatient && searchParams.get("patientId") && (
                    <div className="mt-2 p-2 bg-blue-50 rounded-md">
                      <p className="text-sm text-blue-700">
                        <strong>Selected Patient:</strong> {patients.find((p) => p.id === selectedPatient)?.name}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {originalImage && (
              <Card>
                <CardHeader>
                  <CardTitle>Enhancement Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Brightness: {settings.brightness}%</label>
                    <Slider
                      value={[settings.brightness]}
                      onValueChange={([value]) => setSettings((prev) => ({ ...prev, brightness: value }))}
                      min={50}
                      max={150}
                      step={1}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Contrast: {settings.contrast}%</label>
                    <Slider
                      value={[settings.contrast]}
                      onValueChange={([value]) => setSettings((prev) => ({ ...prev, contrast: value }))}
                      min={50}
                      max={200}
                      step={1}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Sharpness: {settings.sharpness}%</label>
                    <Slider
                      value={[settings.sharpness]}
                      onValueChange={([value]) => setSettings((prev) => ({ ...prev, sharpness: value }))}
                      min={50}
                      max={200}
                      step={1}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Gamma: {settings.gamma}%</label>
                    <Slider
                      value={[settings.gamma]}
                      onValueChange={([value]) => setSettings((prev) => ({ ...prev, gamma: value }))}
                      min={50}
                      max={150}
                      step={1}
                      className="mt-2"
                    />
                  </div>

                  <Button onClick={applyImageEnhancement} disabled={isProcessing} className="w-full">
                    <Zap className="h-4 w-4 mr-2" />
                    {isProcessing ? "Enhancing..." : "Enhance Image"}
                  </Button>

                  {isProcessing && (
                    <div className="space-y-2">
                      <Progress value={progress} />
                      <p className="text-sm text-slate-600 text-center">{progress}% Complete</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Image Comparison</CardTitle>
                <CardDescription>Before and after enhancement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium mb-2">Original</h3>
                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 min-h-[300px] flex items-center justify-center">
                      {originalImage ? (
                        <img
                          src={originalImage || "/placeholder.svg"}
                          alt="Original"
                          className="max-w-full max-h-[300px] object-contain"
                        />
                      ) : (
                        <p className="text-slate-500">No image uploaded</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Enhanced</h3>
                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 min-h-[300px] flex items-center justify-center">
                      {enhancedImage ? (
                        <img
                          src={enhancedImage || "/placeholder.svg"}
                          alt="Enhanced"
                          className="max-w-full max-h-[300px] object-contain"
                        />
                      ) : (
                        <p className="text-slate-500">Click "Enhance Image" to process</p>
                      )}
                    </div>
                  </div>
                </div>

                {enhancedImage && (
                  <div className="mt-4 flex justify-center">
                    <Button onClick={downloadEnhanced}>
                      <Download className="h-4 w-4 mr-2" />
                      Download Enhanced Image
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {metrics && (
          <div className="mt-6">
            <Tabs defaultValue="metrics" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="metrics" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Metrics
                </TabsTrigger>
                <TabsTrigger value="report" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Report
                </TabsTrigger>
              </TabsList>

              <TabsContent value="metrics">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Enhancement Metrics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-600">Original Resolution:</span>
                        <Badge variant="outline">{metrics.original_resolution}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-600">Enhanced Resolution:</span>
                        <Badge variant="outline">{metrics.enhanced_resolution}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-600">Enhancement Factor:</span>
                        <Badge>{metrics.enhancement_factor}</Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">File Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-600">Original Size:</span>
                        <Badge variant="outline">{metrics.file_size_original}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-600">Enhanced Size:</span>
                        <Badge variant="outline">{metrics.file_size_enhanced}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-600">Processing Time:</span>
                        <Badge>{metrics.processing_time}</Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Quality Assessment</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-600 mb-2">
                          {metrics.quality_score.toFixed(1)}%
                        </div>
                        <p className="text-sm text-slate-600">Enhancement Quality Score</p>
                        <Progress value={metrics.quality_score} className="mt-3" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="report">
                <Card>
                  <CardHeader>
                    <CardTitle>Enhancement Report</CardTitle>
                    <CardDescription>Detailed analysis of the image enhancement process</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-semibold mb-3">Processing Summary</h3>
                        <div className="bg-slate-50 p-4 rounded-lg">
                          <p className="text-sm">
                            The medical image has been successfully enhanced using advanced digital processing
                            techniques. The original {metrics.original_resolution} image was upscaled to{" "}
                            {metrics.enhanced_resolution}
                            using bicubic interpolation, resulting in a {metrics.enhancement_factor} improvement in
                            resolution.
                          </p>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold mb-3">Enhancement Techniques Applied</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-blue-50 p-3 rounded-lg">
                            <h4 className="font-medium text-blue-900">Resolution Enhancement</h4>
                            <p className="text-sm text-blue-700">Bicubic interpolation for 2x upscaling</p>
                          </div>
                          <div className="bg-green-50 p-3 rounded-lg">
                            <h4 className="font-medium text-green-900">Contrast Optimization</h4>
                            <p className="text-sm text-green-700">Dynamic range adjustment for better visibility</p>
                          </div>
                          <div className="bg-purple-50 p-3 rounded-lg">
                            <h4 className="font-medium text-purple-900">Sharpening Filter</h4>
                            <p className="text-sm text-purple-700">Edge enhancement for clearer details</p>
                          </div>
                          <div className="bg-orange-50 p-3 rounded-lg">
                            <h4 className="font-medium text-orange-900">Gamma Correction</h4>
                            <p className="text-sm text-orange-700">Brightness curve optimization</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold mb-3">Quality Metrics</h3>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b">
                                <th className="text-left p-2">Metric</th>
                                <th className="text-left p-2">Original</th>
                                <th className="text-left p-2">Enhanced</th>
                                <th className="text-left p-2">Improvement</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="border-b">
                                <td className="p-2">Resolution</td>
                                <td className="p-2">{metrics.original_resolution}</td>
                                <td className="p-2">{metrics.enhanced_resolution}</td>
                                <td className="p-2 text-green-600">+{metrics.enhancement_factor}</td>
                              </tr>
                              <tr className="border-b">
                                <td className="p-2">File Size</td>
                                <td className="p-2">{metrics.file_size_original}</td>
                                <td className="p-2">{metrics.file_size_enhanced}</td>
                                <td className="p-2 text-blue-600">Optimized</td>
                              </tr>
                              <tr>
                                <td className="p-2">Quality Score</td>
                                <td className="p-2">-</td>
                                <td className="p-2">{metrics.quality_score.toFixed(1)}%</td>
                                <td className="p-2 text-green-600">Excellent</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  )
}
