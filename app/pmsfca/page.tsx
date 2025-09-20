import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain, ArrowRight, CheckCircle, TrendingUp, Clock, Target, Zap, Shield } from "lucide-react"
import Link from "next/link"

export default function PMSFCAPage() {
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
              <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                Home
              </Link>
              <Link href="/upload" className="text-muted-foreground hover:text-foreground transition-colors">
                Analysis
              </Link>
              <Link href="/enhance" className="text-muted-foreground hover:text-foreground transition-colors">
                Enhancement
              </Link>
              <Button size="sm" className="bg-accent hover:bg-accent/90" asChild>
                <Link href="/upload">Try PMSFCA</Link>
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
              Advanced White Matter Segmentation
            </Badge>
            <h1
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              PMSFCA Algorithm
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Pseudo-trapezoidal Membership-based Spatial Fuzzy Clustering Algorithm for precise White Matter extraction
              from MRI
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3" asChild>
                <Link href="/upload">
                  Try PMSFCA Analysis
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="px-8 py-3 bg-transparent">
                <a href="#methodology">Learn More</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2
              className="text-3xl md:text-4xl font-bold text-foreground mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Clinical Significance
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              White Matter (WM) volume quantification from MR images is crucial for diagnosing neurological diseases
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-6 h-6 text-accent" />
                </div>
                <CardTitle className="text-lg">Multiple Sclerosis</CardTitle>
                <CardDescription>WMA as imaging biomarker for MS diagnosis and progression monitoring</CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Target className="w-6 h-6 text-accent" />
                </div>
                <CardTitle className="text-lg">Huntington's Disease</CardTitle>
                <CardDescription>White matter loss as clinical indicator of HD progression</CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-accent" />
                </div>
                <CardTitle className="text-lg">Parkinson's Disease</CardTitle>
                <CardDescription>WM tract damage evident at preclinical stages</CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-accent" />
                </div>
                <CardTitle className="text-lg">Cognitive Decline</CardTitle>
                <CardDescription>Post-radiation treatment assessment and delirium risk prediction</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Methodology Section */}
      <section id="methodology" className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2
              className="text-3xl md:text-4xl font-bold text-foreground mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              PMSFCA Methodology
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Advanced fuzzy clustering algorithm with pseudo-trapezoidal membership functions and spatial filtering
            </p>
          </div>

          <div className="mb-16">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-2xl text-center">PMSFCA Processing Pipeline</CardTitle>
                <CardDescription className="text-center">
                  Methodological flow of PMSFCA-based White Matter segmentation (Figure 4.1)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {/* Input MRI Image */}
                  <div className="flex items-center justify-center">
                    <div className="bg-accent/10 border-2 border-accent rounded-lg p-6 text-center min-w-[200px]">
                      <Brain className="w-8 h-8 text-accent mx-auto mb-2" />
                      <h3 className="font-semibold text-lg">Input MRI Image</h3>
                      <p className="text-sm text-muted-foreground">T1-weighted axial slices</p>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <ArrowRight className="w-6 h-6 text-muted-foreground rotate-90" />
                  </div>

                  {/* LASKR Processing */}
                  <div className="flex items-center justify-center">
                    <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 text-center min-w-[200px]">
                      <Zap className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <h3 className="font-semibold text-lg">LASKR</h3>
                      <p className="text-sm text-muted-foreground">Joint denoising & sharpening</p>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <ArrowRight className="w-6 h-6 text-muted-foreground rotate-90" />
                  </div>

                  {/* FCET Processing */}
                  <div className="flex items-center justify-center">
                    <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 text-center min-w-[200px]">
                      <Target className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <h3 className="font-semibold text-lg">FCET</h3>
                      <p className="text-sm text-muted-foreground">Contrast enhancement</p>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <ArrowRight className="w-6 h-6 text-muted-foreground rotate-90" />
                  </div>

                  {/* Brain Extraction */}
                  <div className="flex items-center justify-center">
                    <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-6 text-center min-w-[200px]">
                      <Shield className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                      <h3 className="font-semibold text-lg">Brain Extraction</h3>
                      <p className="text-sm text-muted-foreground">Skull stripping pipeline</p>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <ArrowRight className="w-6 h-6 text-muted-foreground rotate-90" />
                  </div>

                  {/* FCM Clustering */}
                  <div className="flex items-center justify-center">
                    <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-6 text-center min-w-[200px]">
                      <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-white font-bold text-sm">FCM</span>
                      </div>
                      <h3 className="font-semibold text-lg">FCM Clustering</h3>
                      <p className="text-sm text-muted-foreground">Compute cluster centers</p>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <ArrowRight className="w-6 h-6 text-muted-foreground rotate-90" />
                  </div>

                  {/* PTM Parameters */}
                  <div className="flex items-center justify-center">
                    <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 text-center min-w-[200px]">
                      <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-white font-bold text-sm">PTM</span>
                      </div>
                      <h3 className="font-semibold text-lg">PTM Parameters</h3>
                      <p className="text-sm text-muted-foreground">p₁ᵢ, p₂ᵢ, p₃ᵢ, p₄ᵢ</p>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <ArrowRight className="w-6 h-6 text-muted-foreground rotate-90" />
                  </div>

                  {/* Membership Functions */}
                  <div className="flex items-center justify-center">
                    <div className="bg-teal-50 border-2 border-teal-200 rounded-lg p-6 text-center min-w-[200px]">
                      <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-white font-bold text-sm">ζ</span>
                      </div>
                      <h3 className="font-semibold text-lg">Membership Functions</h3>
                      <p className="text-sm text-muted-foreground">4 cases computation</p>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <ArrowRight className="w-6 h-6 text-muted-foreground rotate-90" />
                  </div>

                  {/* Spatial Smoothing */}
                  <div className="flex items-center justify-center">
                    <div className="bg-indigo-50 border-2 border-indigo-200 rounded-lg p-6 text-center min-w-[200px]">
                      <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-white font-bold text-sm">ϑ</span>
                      </div>
                      <h3 className="font-semibold text-lg">Spatial Smoothing</h3>
                      <p className="text-sm text-muted-foreground">4-connected neighborhood</p>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <ArrowRight className="w-6 h-6 text-muted-foreground rotate-90" />
                  </div>

                  {/* Pixel Clustering */}
                  <div className="flex items-center justify-center">
                    <div className="bg-pink-50 border-2 border-pink-200 rounded-lg p-6 text-center min-w-[200px]">
                      <CheckCircle className="w-8 h-8 text-pink-600 mx-auto mb-2" />
                      <h3 className="font-semibold text-lg">Pixel Clustering</h3>
                      <p className="text-sm text-muted-foreground">Maximum membership</p>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <ArrowRight className="w-6 h-6 text-muted-foreground rotate-90" />
                  </div>

                  {/* WM Segmentation Output */}
                  <div className="flex items-center justify-center">
                    <div className="bg-accent border-2 border-accent rounded-lg p-6 text-center min-w-[200px] text-white">
                      <Brain className="w-8 h-8 mx-auto mb-2" />
                      <h3 className="font-semibold text-lg">WM Segmentation</h3>
                      <p className="text-sm opacity-90">Binary output S(r,c)</p>
                    </div>
                  </div>
                </div>

                {/* Mathematical Formulations */}
                <div className="mt-12 grid md:grid-cols-2 gap-6">
                  <Card className="border-border">
                    <CardHeader>
                      <CardTitle className="text-lg">Key Mathematical Formulations</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">FCM Cluster Centers:</h4>
                        <div className="bg-muted/50 p-3 rounded-lg font-mono text-sm">
                          a<sub>i</sub> = Σ(V<sub>k</sub> × φ<sub>ki</sub>
                          <sup>ε</sup>) / Σφ<sub>ki</sub>
                          <sup>ε</sup>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Membership Update:</h4>
                        <div className="bg-muted/50 p-3 rounded-lg font-mono text-sm">
                          φ<sub>ki</sub> = 1 / Σ(||V<sub>k</sub> - a<sub>i</sub>|| / ||V<sub>k</sub> - a<sub>u</sub>||)
                          <sup>2/(ε-1)</sup>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-border">
                    <CardHeader>
                      <CardTitle className="text-lg">PTM Parameter Computation</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">For each cluster i:</h4>
                        <div className="bg-muted/50 p-3 rounded-lg font-mono text-sm space-y-1">
                          <div>
                            p₁ᵢ = I<sub>min</sub> (if i=1), a<sub>i-1</sub> (otherwise)
                          </div>
                          <div>
                            p₂ᵢ = I<sub>min</sub> (if i=1), a<sub>i</sub> (otherwise)
                          </div>
                          <div>
                            p₃ᵢ = a₁ (if i=1), a<sub>i</sub> (otherwise)
                          </div>
                          <div>
                            p₄ᵢ = a₂ (if i=1), a<sub>i+1</sub> (otherwise)
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Spatial Smoothing Details */}
                <div className="mt-8">
                  <Card className="border-border">
                    <CardHeader>
                      <CardTitle className="text-lg">Spatial Smoothing Implementation</CardTitle>
                      <CardDescription>
                        4-connected neighborhood averaging for spatial information integration
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold mb-2">Convolution Kernel:</h4>
                          <div className="bg-muted/50 p-4 rounded-lg font-mono text-center">
                            <div className="grid grid-cols-3 gap-2 max-w-[120px] mx-auto">
                              <div className="bg-background border rounded p-2 text-sm">0</div>
                              <div className="bg-accent text-white rounded p-2 text-sm">1</div>
                              <div className="bg-background border rounded p-2 text-sm">0</div>
                              <div className="bg-accent text-white rounded p-2 text-sm">1</div>
                              <div className="bg-accent text-white rounded p-2 text-sm">1</div>
                              <div className="bg-accent text-white rounded p-2 text-sm">1</div>
                              <div className="bg-background border rounded p-2 text-sm">0</div>
                              <div className="bg-accent text-white rounded p-2 text-sm">1</div>
                              <div className="bg-background border rounded p-2 text-sm">0</div>
                            </div>
                            <p className="text-sm mt-2">× (1/5)</p>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Smoothing Formula:</h4>
                          <div className="bg-muted/50 p-3 rounded-lg font-mono text-sm">
                            ϑᵢ(r,c) = [ζᵢ(r-1,c) + ζᵢ(r,c-1) + ζᵢ(r,c) + ζᵢ(r,c+1) + ζᵢ(r+1,c)] / 5
                          </div>
                          <p className="text-sm text-muted-foreground mt-2">
                            Where ϑᵢ is the smoothed membership function incorporating spatial neighborhood information
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="algorithm">Algorithm</TabsTrigger>
              <TabsTrigger value="membership">Membership</TabsTrigger>
              <TabsTrigger value="results">Results</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-8">
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="text-xl">Key Challenges</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-accent rounded-full mt-2"></div>
                      <div>
                        <p className="font-semibold">Noise and Low Contrast</p>
                        <p className="text-muted-foreground text-sm">
                          RF receiver noise and low tissue contrast in MRI complicate structure extraction
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-accent rounded-full mt-2"></div>
                      <div>
                        <p className="font-semibold">Edge Preservation</p>
                        <p className="text-muted-foreground text-sm">
                          Traditional denoising filters blur edges, requiring additional sharpening steps
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-accent rounded-full mt-2"></div>
                      <div>
                        <p className="font-semibold">Computational Overhead</p>
                        <p className="text-muted-foreground text-sm">
                          Separate denoising and sharpening filters cause processing delays
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="text-xl">PMSFCA Solutions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                      <div>
                        <p className="font-semibold">Integrated Processing</p>
                        <p className="text-muted-foreground text-sm">
                          Combined LASKR denoising and FCET contrast enhancement preprocessing
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                      <div>
                        <p className="font-semibold">Pseudo-Trapezoidal Membership</p>
                        <p className="text-muted-foreground text-sm">
                          Enhanced interpretability and reduced overlapping in fuzzy clustering
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                      <div>
                        <p className="font-semibold">Spatial Filtering</p>
                        <p className="text-muted-foreground text-sm">
                          Neighborhood-based membership refinement for accurate segmentation
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="algorithm" className="mt-8">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-xl">Algorithm Workflow</CardTitle>
                  <CardDescription>Step-by-step process of the PMSFCA white matter segmentation</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white font-bold text-sm">
                        1
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">FCM Cluster Center Computation</h4>
                        <p className="text-muted-foreground mb-2">
                          Initialize cluster membership values randomly and compute cluster centers using Fuzzy C-Means
                          algorithm
                        </p>
                        <div className="bg-muted/50 p-3 rounded-lg font-mono text-sm">
                          a<sub>i</sub> = Σ(V<sub>k</sub> × φ<sub>ki</sub>) / Σφ<sub>ki</sub>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white font-bold text-sm">
                        2
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Pseudo-Trapezoidal Parameters</h4>
                        <p className="text-muted-foreground mb-2">
                          Compute PTM parameters from sorted cluster centers and image intensity bounds
                        </p>
                        <div className="bg-muted/50 p-3 rounded-lg font-mono text-sm">
                          P = {"{p₁ᵢ, p₂ᵢ, p₃ᵢ, p₄ᵢ}"} for each cluster i
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white font-bold text-sm">
                        3
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Membership Function Computation</h4>
                        <p className="text-muted-foreground mb-2">
                          Calculate local membership values using pseudo-trapezoidal functions with four distinct cases
                        </p>
                        <div className="bg-muted/50 p-3 rounded-lg font-mono text-sm">
                          ζᵢ(r,c) = f(I(r,c), p₁ᵢ, p₂ᵢ, p₃ᵢ, p₄ᵢ)
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white font-bold text-sm">
                        4
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Spatial Smoothing</h4>
                        <p className="text-muted-foreground mb-2">
                          Apply 4-connected neighborhood averaging to incorporate spatial information
                        </p>
                        <div className="bg-muted/50 p-3 rounded-lg font-mono text-sm">
                          ϑᵢ = ζᵢ ** (1/5) × [0 1 0; 1 1 1; 0 1 0]
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white font-bold text-sm">
                        5
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">White Matter Extraction</h4>
                        <p className="text-muted-foreground mb-2">
                          Assign pixels to highest membership class and extract WM as brightest tissue
                        </p>
                        <div className="bg-muted/50 p-3 rounded-lg font-mono text-sm">
                          S(r,c) = 1 if l(r,c) = Z, else 0
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="membership" className="mt-8">
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="text-xl">Pseudo-Trapezoidal Membership</CardTitle>
                    <CardDescription>
                      Enhanced interpretability compared to traditional membership functions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Advantages over Traditional Functions</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            Better interpretability than Triangular, Trapezoidal, and Gaussian
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            Reduced high-level overlapping between clusters
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            Extreme level of separation among membership values
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            Optimal for clinical decision support systems
                          </li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="text-xl">Spatial Information Integration</CardTitle>
                    <CardDescription>Neighborhood-based membership refinement for robust segmentation</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Spatial Filtering Benefits</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            Membership values modified by neighborhood pixels
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            4-connected spatial convolution for smoothing
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            Refined and accurate segmentation results
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            Noise reduction through spatial consistency
                          </li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="results" className="mt-8">
              <div className="grid md:grid-cols-3 gap-8 mb-8">
                <Card className="border-border">
                  <CardHeader className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <TrendingUp className="w-6 h-6 text-green-600" />
                    </div>
                    <CardTitle className="text-2xl">0.8300 ± 0.0158</CardTitle>
                    <CardDescription>Dice Similarity Index (DSI)</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-sm text-muted-foreground">
                      Highest DSI score compared to EFSF, MFCMDE, SFCM, and WSFCM
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardHeader className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Clock className="w-6 h-6 text-blue-600" />
                    </div>
                    <CardTitle className="text-2xl">3.88 ± 0.46</CardTitle>
                    <CardDescription>Computational Time (seconds)</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-sm text-muted-foreground">
                      Fastest processing time among all compared algorithms
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardHeader className="text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Target className="w-6 h-6 text-purple-600" />
                    </div>
                    <CardTitle className="text-2xl">100</CardTitle>
                    <CardDescription>Test Images Validated</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-sm text-muted-foreground">
                      Consistent performance across T1-weighted MRI slices
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-xl">Performance Comparison</CardTitle>
                  <CardDescription>PMSFCA vs. existing fuzzy-based segmentation techniques</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">Algorithm</th>
                          <th className="text-center p-2">DSI Score</th>
                          <th className="text-center p-2">Computational Time (sec)</th>
                          <th className="text-center p-2">Key Limitation</th>
                        </tr>
                      </thead>
                      <tbody className="text-muted-foreground">
                        <tr className="border-b">
                          <td className="p-2 font-semibold">EFSF</td>
                          <td className="text-center p-2">0.7747 ± 0.0357</td>
                          <td className="text-center p-2">6.16 ± 0.93</td>
                          <td className="text-center p-2">No spatial adjustment</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-2 font-semibold">MFCMDE</td>
                          <td className="text-center p-2">0.3844 ± 0.246</td>
                          <td className="text-center p-2">13.18 ± 0.29</td>
                          <td className="text-center p-2">Computationally heavy</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-2 font-semibold">SFCM</td>
                          <td className="text-center p-2">0.6212 ± 0.3655</td>
                          <td className="text-center p-2">5.16 ± 1.51</td>
                          <td className="text-center p-2">Simple local averaging</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-2 font-semibold">WSFCM</td>
                          <td className="text-center p-2">0.4207 ± 0.2784</td>
                          <td className="text-center p-2">6.05 ± 1.51</td>
                          <td className="text-center p-2">Reduced spatial benefits</td>
                        </tr>
                        <tr className="border-b bg-accent/5">
                          <td className="p-2 font-bold text-foreground">PMSFCA</td>
                          <td className="text-center p-2 font-bold text-foreground">0.8300 ± 0.0158</td>
                          <td className="text-center p-2 font-bold text-foreground">3.88 ± 0.46</td>
                          <td className="text-center p-2 font-bold text-green-600">Superior performance</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Technical Implementation */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2
              className="text-3xl md:text-4xl font-bold text-foreground mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Technical Implementation
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Integration with LASKR denoising and FCET contrast enhancement for optimal preprocessing
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-border">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-accent" />
                </div>
                <CardTitle className="text-xl">LASKR Preprocessing</CardTitle>
                <CardDescription>
                  Locally-Adaptive Steering Kernel Regression for joint denoising and sharpening
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Adaptive kernel size and shape</li>
                  <li>• Simultaneous noise suppression and edge enhancement</li>
                  <li>• Computationally efficient processing</li>
                  <li>• Optimal trade-off between MLV and noise SD</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-accent" />
                </div>
                <CardTitle className="text-xl">FCET Enhancement</CardTitle>
                <CardDescription>
                  Feature-preserving Contrast Enhancement Transform for improved tissue contrast
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Grey Level Density function computation</li>
                  <li>• Statistical distribution-based transformation</li>
                  <li>• Free from processing-induced distortions</li>
                  <li>• VIF score &gt; 1 for information fidelity</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <Brain className="w-6 h-6 text-accent" />
                </div>
                <CardTitle className="text-xl">Brain Extraction</CardTitle>
                <CardDescription>Automated skull stripping pipeline for brain parenchyma extraction</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Maximum entropy-based thresholding</li>
                  <li>• Connected component labeling</li>
                  <li>• Largest component extraction</li>
                  <li>• Morphological refinement operations</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Clinical Applications */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2
              className="text-3xl md:text-4xl font-bold text-foreground mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Clinical Applications
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              PMSFCA enables precise white matter atrophy quantification for neurological disease diagnosis
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-xl">Neurological Disease Biomarkers</CardTitle>
                <CardDescription>White matter atrophy quantification for disease characterization</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-accent rounded-full mt-2"></div>
                    <div>
                      <p className="font-semibold">Multiple Sclerosis (MS)</p>
                      <p className="text-muted-foreground text-sm">
                        WMA as imaging biomarker for MS diagnosis and treatment monitoring
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-accent rounded-full mt-2"></div>
                    <div>
                      <p className="font-semibold">Huntington's Disease (HD)</p>
                      <p className="text-muted-foreground text-sm">
                        White matter loss as clinical indicator of HD progression
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-accent rounded-full mt-2"></div>
                    <div>
                      <p className="font-semibold">Parkinson's Disease</p>
                      <p className="text-muted-foreground text-sm">WM tract damage detection at preclinical stages</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-xl">Treatment Assessment</CardTitle>
                <CardDescription>Post-treatment cognitive decline and risk prediction</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-accent rounded-full mt-2"></div>
                    <div>
                      <p className="font-semibold">Radiation Treatment Effects</p>
                      <p className="text-muted-foreground text-sm">
                        Post-radiation cognitive decline assessment in nasopharyngeal carcinoma
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-accent rounded-full mt-2"></div>
                    <div>
                      <p className="font-semibold">Delirium Risk Prediction</p>
                      <p className="text-muted-foreground text-sm">
                        Long-term delirium vulnerability assessment using WMA
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-accent rounded-full mt-2"></div>
                    <div>
                      <p className="font-semibold">Longitudinal Monitoring</p>
                      <p className="text-muted-foreground text-sm">
                        Disease progression tracking through serial WM volume measurements
                      </p>
                    </div>
                  </div>
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
            Experience PMSFCA Technology
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Try our advanced white matter segmentation algorithm for precise neurological disease assessment
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="px-8 py-3" asChild>
              <Link href="/upload">Analyze MRI Images</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="px-8 py-3 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent"
              asChild
            >
              <Link href="/enhance">Enhance Images First</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
