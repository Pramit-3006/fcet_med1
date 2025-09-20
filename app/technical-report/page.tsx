"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Download } from "lucide-react"
import Image from "next/image"

export default function TechnicalReportPage() {
  const generatePDFReport = () => {
    const reportContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>FCET Medical Image Analysis - Technical Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; color: #333; }
          .header { text-align: center; margin-bottom: 40px; border-bottom: 3px solid #6366f1; padding-bottom: 20px; }
          .logo { width: 120px; height: auto; margin-bottom: 20px; }
          h1 { color: #1e293b; font-size: 28px; margin-bottom: 10px; }
          h2 { color: #6366f1; font-size: 22px; margin-top: 30px; margin-bottom: 15px; border-left: 4px solid #6366f1; padding-left: 15px; }
          h3 { color: #475569; font-size: 18px; margin-top: 25px; margin-bottom: 10px; }
          .section { margin-bottom: 30px; }
          .tech-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin: 20px 0; }
          .tech-item { background: #f8fafc; padding: 15px; border-radius: 8px; border-left: 4px solid #6366f1; }
          .feature-list { background: #f1f5f9; padding: 20px; border-radius: 8px; margin: 15px 0; }
          .enhancement-box { background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; padding: 20px; border-radius: 12px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 50px; padding-top: 20px; border-top: 2px solid #e2e8f0; color: #64748b; }
          ul { margin: 10px 0; padding-left: 25px; }
          li { margin: 5px 0; }
          .highlight { background: #fef3c7; padding: 2px 6px; border-radius: 4px; }
          @media print { body { margin: 20px; } .no-print { display: none; } }
        </style>
      </head>
      <body>
        <div class="header">
          <img src="/starbitlabs-logo.png" alt="StarBitLabs" class="logo">
          <h1>FCET Medical Image Analysis Application</h1>
          <p style="font-size: 18px; color: #64748b;">Complete Technical Report & Documentation</p>
          <p style="color: #6366f1; font-weight: bold;">Powered by StarBitLabs</p>
        </div>

        <div class="section">
          <h2>🏥 Application Overview</h2>
          <p>The FCET Medical Image Analysis Application is a comprehensive web-based platform for healthcare professionals to analyze medical images using AI-powered tools, enhance image quality, and manage patient records. The application combines cutting-edge artificial intelligence with advanced image processing capabilities.</p>
        </div>

        <div class="section">
          <h2>🛠️ Core Technologies & Tools</h2>
          <div class="tech-grid">
            <div class="tech-item">
              <h3>Frontend Framework</h3>
              <ul>
                <li><span class="highlight">Next.js 14</span> - App Router architecture</li>
                <li><span class="highlight">React 18</span> - Component-based UI</li>
                <li><span class="highlight">TypeScript</span> - Type-safe development</li>
                <li><span class="highlight">Tailwind CSS v4</span> - Utility-first styling</li>
              </ul>
            </div>
            <div class="tech-item">
              <h3>AI & Analysis</h3>
              <ul>
                <li><span class="highlight">Groq AI</span> - Medical image analysis</li>
                <li><span class="highlight">Llama 4 Scout</span> - Vision model</li>
                <li><span class="highlight">AI SDK</span> - Standardized integration</li>
                <li><span class="highlight">Custom Algorithms</span> - Image processing</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="section">
          <h2>🎯 Core Features & Implementation</h2>
          
          <h3>1. Medical Image Analysis</h3>
          <div class="feature-list">
            <p><strong>Location:</strong> /upload page</p>
            <p><strong>Technology:</strong> Groq AI + Custom analysis algorithms</p>
            <p><strong>Capabilities:</strong></p>
            <ul>
              <li>Drag-and-drop image upload with validation</li>
              <li>AI-powered analysis of X-rays, MRIs, CT scans</li>
              <li>Confidence scoring and risk assessment</li>
              <li>Real-time progress tracking</li>
              <li>Support for DICOM, JPEG, PNG, TIFF, BMP formats</li>
            </ul>
          </div>

          <h3>2. Patient Management System</h3>
          <div class="feature-list">
            <p><strong>Location:</strong> /patients pages</p>
            <p><strong>Technology:</strong> localStorage + React state management</p>
            <p><strong>Features:</strong></p>
            <ul>
              <li>Patient registration and profile management</li>
              <li>Medical history tracking</li>
              <li>Analysis results association</li>
              <li>Enhanced images storage per patient</li>
            </ul>
          </div>

          <h3>3. Advanced Reporting & Visualization</h3>
          <div class="feature-list">
            <p><strong>Components:</strong> Charts, Tables, PDF Generation</p>
            <p><strong>Features:</strong></p>
            <ul>
              <li>Severity analysis with pie charts</li>
              <li>Confidence analysis with bar charts</li>
              <li>HTML-to-PDF conversion</li>
              <li>Comprehensive metrics tables</li>
              <li>StarBitLabs branded reports</li>
            </ul>
          </div>
        </div>

        <div class="enhancement-box">
          <h2 style="color: white; margin-top: 0;">🚀 FCET Enhancement Technology</h2>
          <h3 style="color: #e2e8f0;">Image Processing Pipeline</h3>
          <ul style="color: #e2e8f0;">
            <li><strong>Resolution Enhancement:</strong> 2x upscaling using bicubic interpolation</li>
            <li><strong>Quality Adjustments:</strong> Brightness, contrast, sharpness, gamma correction</li>
            <li><strong>Real-time Preview:</strong> Before/after comparison with live adjustments</li>
            <li><strong>Processing Metrics:</strong> Quality scores and enhancement statistics</li>
          </ul>
          
          <h3 style="color: #e2e8f0;">Enhancement Algorithms</h3>
          <ul style="color: #e2e8f0;">
            <li><strong>Bicubic Interpolation:</strong> Advanced upscaling algorithm</li>
            <li><strong>Histogram Equalization:</strong> Contrast enhancement</li>
            <li><strong>Gaussian Filtering:</strong> Noise reduction and sharpening</li>
            <li><strong>Gamma Correction:</strong> Brightness optimization</li>
          </ul>
        </div>

        <div class="section">
          <h2>🔧 Technical Architecture</h2>
          
          <h3>File Structure</h3>
          <ul>
            <li><strong>/app</strong> - Next.js App Router pages and API routes</li>
            <li><strong>/components</strong> - Reusable UI components and forms</li>
            <li><strong>/lib</strong> - Utility functions, authentication, integrations</li>
            <li><strong>/public</strong> - Static assets including StarBitLabs logo</li>
          </ul>

          <h3>API Integration</h3>
          <ul>
            <li><strong>Groq API:</strong> Medical image analysis and report generation</li>
            <li><strong>Supabase:</strong> Database connectivity with localStorage fallback</li>
            <li><strong>Custom APIs:</strong> Patient management and data processing</li>
          </ul>

          <h3>Data Management</h3>
          <ul>
            <li><strong>Patient Data:</strong> localStorage with user association</li>
            <li><strong>Analysis Results:</strong> AI-generated reports with confidence scores</li>
            <li><strong>Enhanced Images:</strong> Before/after pairs with processing metadata</li>
          </ul>
        </div>

        <div class="section">
          <h2>🔒 Security & Privacy</h2>
          <ul>
            <li><strong>Client-side Processing:</strong> FCET enhancement works entirely in browser</li>
            <li><strong>Data Isolation:</strong> User data separated by authentication</li>
            <li><strong>Medical Disclaimers:</strong> Proper warnings for AI-generated analysis</li>
            <li><strong>Secure Storage:</strong> Encrypted localStorage for sensitive data</li>
          </ul>
        </div>

        <div class="section">
          <h2>📊 Performance Metrics</h2>
          <ul>
            <li><strong>Image Processing:</strong> Real-time enhancement with Web Workers</li>
            <li><strong>AI Analysis:</strong> Sub-30 second processing for most medical images</li>
            <li><strong>Data Storage:</strong> Efficient localStorage management</li>
            <li><strong>User Experience:</strong> Responsive design with mobile support</li>
          </ul>
        </div>

        <div class="footer">
          <img src="/starbitlabs-logo.png" alt="StarBitLabs" style="width: 80px; height: auto; margin-bottom: 10px;">
          <p><strong>Powered by StarBitLabs</strong></p>
          <p>Advanced Medical Image Analysis & Enhancement Technology</p>
          <p>Generated on ${new Date().toLocaleDateString()}</p>
        </div>
      </body>
      </html>
    `

    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(reportContent)
      printWindow.document.close()
      printWindow.focus()
      setTimeout(() => {
        printWindow.print()
      }, 1000)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <Image src="/starbitlabs-logo.png" alt="StarBitLabs" width={120} height={60} className="mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Technical Documentation</h1>
          <p className="text-xl text-slate-600">FCET Medical Image Analysis Application</p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-6 w-6 text-blue-600" />
              Complete Technical Report
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 mb-6">
              Download a comprehensive technical report covering all aspects of the FCET Medical Image Analysis
              Application, including technologies used, features implemented, and architectural details.
            </p>

            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <h3 className="font-semibold text-blue-800 mb-2">Report Contents:</h3>
              <ul className="text-blue-700 space-y-1">
                <li>• Application Overview & Architecture</li>
                <li>• Core Technologies & Tools Used</li>
                <li>• FCET Enhancement Technology Details</li>
                <li>• AI Integration & Analysis Features</li>
                <li>• Patient Management System</li>
                <li>• Security & Privacy Implementation</li>
                <li>• Performance Metrics & Specifications</li>
              </ul>
            </div>

            <Button onClick={generatePDFReport} className="w-full bg-blue-600 hover:bg-blue-700" size="lg">
              <Download className="h-5 w-5 mr-2" />
              Download Technical Report (PDF)
            </Button>
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-slate-500 text-sm">
            Powered by <strong>StarBitLabs</strong> • Advanced Medical Technology Solutions
          </p>
        </div>
      </div>
    </div>
  )
}
