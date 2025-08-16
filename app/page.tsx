import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, Shield, Zap, Users, ChevronRight, Star } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                MedAnalyze
              </span>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                Features
              </a>
              <a href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors">
                Case Studies
              </a>
              <a href="#contact" className="text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </a>
              <Link href="/patients" className="text-muted-foreground hover:text-foreground transition-colors">
                Patients
              </Link>
              <Link href="/enhance" className="text-muted-foreground hover:text-foreground transition-colors">
                Enhance
              </Link>
              <Button variant="outline" size="sm" asChild>
                <Link href="/auth/sign-up">Register</Link>
              </Button>
              <Button size="sm" className="bg-accent hover:bg-accent/90" asChild>
                <Link href="/upload">Get Started</Link>
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-muted/50 to-background"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="mb-6 bg-accent/10 text-accent border-accent/20">
              AI-Powered Medical Imaging
            </Badge>
            <h1
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Advanced Medical Image Analysis
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Empower healthcare professionals with AI-driven insights for faster, more accurate medical image
              interpretation
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3" asChild>
                <Link href="/upload">
                  Request Demo
                  <ChevronRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="px-8 py-3 bg-transparent" asChild>
                <Link href="/enhance">
                  <Zap className="mr-2 w-4 h-4" />
                  Enhance Images
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2
              className="text-3xl md:text-4xl font-bold text-foreground mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Cutting-Edge Features
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Advanced AI technology designed specifically for medical imaging workflows
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <Brain className="w-6 h-6 text-accent" />
                </div>
                <CardTitle className="text-xl">AI-Driven Analysis</CardTitle>
                <CardDescription>
                  Advanced machine learning algorithms trained on millions of medical images for precise diagnostics
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-accent" />
                </div>
                <CardTitle className="text-xl">Real-Time Processing</CardTitle>
                <CardDescription>
                  Get instant results with our optimized processing pipeline, reducing analysis time by up to 80%
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-accent" />
                </div>
                <CardTitle className="text-xl">HIPAA Compliant</CardTitle>
                <CardDescription>
                  Enterprise-grade security with full HIPAA compliance and end-to-end encryption
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-accent" />
                </div>
                <CardTitle className="text-xl">Team Collaboration</CardTitle>
                <CardDescription>
                  Share findings and collaborate with colleagues in real-time with integrated communication tools
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <Brain className="w-6 h-6 text-accent" />
                </div>
                <CardTitle className="text-xl">Multi-Modal Support</CardTitle>
                <CardDescription>
                  Support for X-rays, MRIs, CT scans, ultrasounds, and other medical imaging modalities
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-accent" />
                </div>
                <CardTitle className="text-xl">Integration Ready</CardTitle>
                <CardDescription>
                  Seamlessly integrate with existing PACS systems and electronic health records
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2
              className="text-3xl md:text-4xl font-bold text-foreground mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Trusted by Healthcare Professionals
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              See how MedAnalyze is transforming medical imaging workflows worldwide
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-border">
              <CardHeader>
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                  ))}
                </div>
                <CardDescription className="text-base">
                  "MedAnalyze has revolutionized our radiology department. The AI insights help us catch details we
                  might have missed, improving patient outcomes significantly."
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold">DR</span>
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Dr. Sarah Chen</p>
                    <p className="text-muted-foreground text-sm">Chief Radiologist, Metro Hospital</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                  ))}
                </div>
                <CardDescription className="text-base">
                  "The speed and accuracy of MedAnalyze is incredible. We've reduced our image analysis time by 75%
                  while maintaining the highest quality standards."
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold">MJ</span>
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Dr. Michael Johnson</p>
                    <p className="text-muted-foreground text-sm">Director of Imaging, Regional Medical Center</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                  ))}
                </div>
                <CardDescription className="text-base">
                  "The integration with our existing systems was seamless. MedAnalyze fits perfectly into our workflow
                  without disrupting our established processes."
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold">EP</span>
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Dr. Emily Park</p>
                    <p className="text-muted-foreground text-sm">IT Director, University Hospital</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2
              className="text-3xl md:text-4xl font-bold text-foreground mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Technical Support
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Need technical assistance? Contact our support team for help with the medical imaging platform
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <Card className="border-border">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-accent" />
                </div>
                <CardTitle className="text-2xl">Technical Support</CardTitle>
                <CardDescription>Get help with technical issues and platform support</CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div>
                  <p className="text-lg font-semibold text-foreground">Email Support</p>
                  <p className="text-muted-foreground">pradhanpramit3006@gmail.com</p>
                </div>
                <div>
                  <p className="text-lg font-semibold text-foreground">Phone Support</p>
                  <p className="text-muted-foreground">+91 8336933369</p>
                </div>
                <div>
                  <p className="text-lg font-semibold text-foreground">Support Hours</p>
                  <p className="text-muted-foreground">Monday - Friday: 9:00 AM - 6:00 PM EST</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: "var(--font-heading)" }}>
            Ready to Transform Your Medical Imaging?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of healthcare professionals who trust MedAnalyze for accurate, fast medical image analysis
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="px-8 py-3" asChild>
              <Link href="/upload">Start Free Trial</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="px-8 py-3 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent"
              asChild
            >
              <Link href="/enhance">Enhance Images</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                <Brain className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                MedAnalyze
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Support
              </a>
            </div>
            <p className="text-sm text-muted-foreground">© 2025 MedAnalyze. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
