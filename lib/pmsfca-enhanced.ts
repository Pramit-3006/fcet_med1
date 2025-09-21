// Enhanced PMSFCA (Possibilistic Modified Spatial Fuzzy C-means Algorithm) with AI assistance
// This implementation combines traditional clustering with AI-guided tissue classification

export interface PMSFCAConfig {
  clusters: number
  maxIterations: number
  tolerance: number
  spatialWeight: number
  possibilisticWeight: number
  aiGuidance: boolean
}

export interface TissueClassification {
  whiteMatter: number[][]
  greyMatter: number[][]
  csfMatter: number[][]
  confidence: number
  aiGuidance?: string
}

export interface PMSFCAResult {
  segmentedImage: ImageData
  tissueClassification: TissueClassification
  clusterCenters: number[]
  membershipMatrix: number[][]
  possibilityMatrix: number[][]
  iterations: number
  convergenceHistory: number[]
  processingTime: number
}

export class EnhancedPMSFCA {
  private config: PMSFCAConfig
  private aiGuidance: string | null = null

  constructor(config: Partial<PMSFCAConfig> = {}) {
    this.config = {
      clusters: 3, // CSF, Grey Matter, White Matter
      maxIterations: 100,
      tolerance: 0.001,
      spatialWeight: 0.5,
      possibilisticWeight: 0.8,
      aiGuidance: true,
      ...config,
    }
  }

  setAIGuidance(guidance: string) {
    this.aiGuidance = guidance
  }

  async analyze(imageData: ImageData): Promise<PMSFCAResult> {
    const startTime = performance.now()

    // Convert image to grayscale intensity matrix
    const intensityMatrix = this.extractIntensityMatrix(imageData)
    const { width, height } = imageData

    // Initialize cluster centers with AI-guided tissue-specific values
    let clusterCenters = this.initializeClusterCenters(intensityMatrix)

    // Apply AI guidance if available
    if (this.aiGuidance && this.config.aiGuidance) {
      clusterCenters = this.applyAIGuidance(clusterCenters, this.aiGuidance)
    }

    // Initialize membership and possibility matrices
    let membershipMatrix = this.initializeMembershipMatrix(intensityMatrix, clusterCenters)
    let possibilityMatrix = this.initializePossibilityMatrix(intensityMatrix, clusterCenters)

    const convergenceHistory: number[] = []
    let iteration = 0
    let converged = false

    // Main PMSFCA iteration loop
    while (iteration < this.config.maxIterations && !converged) {
      const oldCenters = [...clusterCenters]

      // Update membership matrix with spatial constraints
      membershipMatrix = this.updateMembershipMatrix(intensityMatrix, clusterCenters, width, height)

      // Update possibility matrix
      possibilityMatrix = this.updatePossibilityMatrix(intensityMatrix, clusterCenters)

      // Update cluster centers with tissue-specific constraints
      clusterCenters = this.updateClusterCenters(intensityMatrix, membershipMatrix, possibilityMatrix)

      // Apply tissue ordering constraint (CSF < Grey < White)
      clusterCenters = this.enforcePhysiologicalConstraints(clusterCenters)

      // Check convergence
      const centerChange = this.calculateCenterChange(oldCenters, clusterCenters)
      convergenceHistory.push(centerChange)
      converged = centerChange < this.config.tolerance

      iteration++
    }

    // Generate final segmentation
    const segmentedImage = this.generateSegmentedImage(membershipMatrix, possibilityMatrix, width, height)

    // Classify tissues with enhanced accuracy
    const tissueClassification = this.classifyTissues(
      membershipMatrix,
      possibilityMatrix,
      clusterCenters,
      width,
      height,
    )

    const processingTime = performance.now() - startTime

    return {
      segmentedImage,
      tissueClassification,
      clusterCenters,
      membershipMatrix,
      possibilityMatrix,
      iterations: iteration,
      convergenceHistory,
      processingTime,
    }
  }

  private extractIntensityMatrix(imageData: ImageData): number[] {
    const { data, width, height } = imageData
    const intensities: number[] = []

    for (let i = 0; i < data.length; i += 4) {
      // Convert RGB to grayscale using luminance formula
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]
      const intensity = 0.299 * r + 0.587 * g + 0.114 * b
      intensities.push(intensity / 255) // Normalize to [0, 1]
    }

    return intensities
  }

  private initializeClusterCenters(intensityMatrix: number[]): number[] {
    // Initialize with physiologically realistic values for brain tissues
    // Based on typical T1-weighted MRI intensities
    return [
      0.15, // CSF (Cerebrospinal Fluid) - darkest
      0.45, // Grey Matter - medium intensity
      0.75, // White Matter - brightest
    ].sort((a, b) => a - b) // Ensure ascending order
  }

  private applyAIGuidance(centers: number[], guidance: string): number[] {
    // Parse AI guidance to adjust cluster centers
    // This is a simplified implementation - in practice, you'd use more sophisticated NLP
    const lowerGuidance = guidance.toLowerCase()

    if (lowerGuidance.includes("bright white matter") || lowerGuidance.includes("hyperintense white")) {
      centers[2] = Math.min(0.9, centers[2] + 0.1) // Increase white matter intensity
    }

    if (lowerGuidance.includes("dark csf") || lowerGuidance.includes("hypointense csf")) {
      centers[0] = Math.max(0.05, centers[0] - 0.05) // Decrease CSF intensity
    }

    if (lowerGuidance.includes("grey matter contrast") || lowerGuidance.includes("cortical definition")) {
      // Adjust grey matter to be more distinct from white matter
      centers[1] = (centers[0] + centers[2]) * 0.4 // Position between CSF and white matter
    }

    return centers.sort((a, b) => a - b) // Maintain order
  }

  private initializeMembershipMatrix(intensityMatrix: number[], centers: number[]): number[][] {
    const n = intensityMatrix.length
    const c = centers.length
    const membership: number[][] = Array(n)
      .fill(null)
      .map(() => Array(c).fill(0))

    for (let i = 0; i < n; i++) {
      const distances = centers.map((center) => Math.abs(intensityMatrix[i] - center))
      const minDistance = Math.min(...distances)

      // Soft assignment with exponential decay
      let sum = 0
      for (let j = 0; j < c; j++) {
        membership[i][j] = Math.exp(-distances[j] / (minDistance + 0.001))
        sum += membership[i][j]
      }

      // Normalize
      for (let j = 0; j < c; j++) {
        membership[i][j] /= sum
      }
    }

    return membership
  }

  private initializePossibilityMatrix(intensityMatrix: number[], centers: number[]): number[][] {
    const n = intensityMatrix.length
    const c = centers.length
    const possibility: number[][] = Array(n)
      .fill(null)
      .map(() => Array(c).fill(0))

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < c; j++) {
        const distance = Math.abs(intensityMatrix[i] - centers[j])
        possibility[i][j] = Math.exp(-distance * 5) // Higher sensitivity for possibility
      }
    }

    return possibility
  }

  private updateMembershipMatrix(
    intensityMatrix: number[],
    centers: number[],
    width: number,
    height: number,
  ): number[][] {
    const n = intensityMatrix.length
    const c = centers.length
    const membership: number[][] = Array(n)
      .fill(null)
      .map(() => Array(c).fill(0))

    for (let i = 0; i < n; i++) {
      const x = i % width
      const y = Math.floor(i / width)

      // Calculate spatial context
      const spatialInfluence = this.calculateSpatialInfluence(intensityMatrix, x, y, width, height)

      // Calculate distances with spatial weighting
      const distances: number[] = []
      for (let j = 0; j < c; j++) {
        const intensityDistance = Math.abs(intensityMatrix[i] - centers[j])
        const spatialDistance = Math.abs(spatialInfluence - centers[j])
        distances[j] = intensityDistance + this.config.spatialWeight * spatialDistance
      }

      // Update membership with fuzzy logic
      let sum = 0
      for (let j = 0; j < c; j++) {
        if (distances[j] === 0) {
          membership[i][j] = 1
          for (let k = 0; k < c; k++) {
            if (k !== j) membership[i][k] = 0
          }
          break
        } else {
          membership[i][j] = 1 / Math.pow(distances[j], 2)
          sum += membership[i][j]
        }
      }

      // Normalize if not already done
      if (sum > 0) {
        for (let j = 0; j < c; j++) {
          membership[i][j] /= sum
        }
      }
    }

    return membership
  }

  private calculateSpatialInfluence(
    intensityMatrix: number[],
    x: number,
    y: number,
    width: number,
    height: number,
  ): number {
    // Calculate average intensity in 3x3 neighborhood
    let sum = 0
    let count = 0

    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const nx = x + dx
        const ny = y + dy

        if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
          const index = ny * width + nx
          sum += intensityMatrix[index]
          count++
        }
      }
    }

    return count > 0 ? sum / count : intensityMatrix[y * width + x]
  }

  private updatePossibilityMatrix(intensityMatrix: number[], centers: number[]): number[][] {
    const n = intensityMatrix.length
    const c = centers.length
    const possibility: number[][] = Array(n)
      .fill(null)
      .map(() => Array(c).fill(0))

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < c; j++) {
        const distance = Math.abs(intensityMatrix[i] - centers[j])
        possibility[i][j] = Math.exp(-distance * this.config.possibilisticWeight * 10)
      }
    }

    return possibility
  }

  private updateClusterCenters(
    intensityMatrix: number[],
    membershipMatrix: number[][],
    possibilityMatrix: number[][],
  ): number[] {
    const c = membershipMatrix[0].length
    const centers: number[] = []

    for (let j = 0; j < c; j++) {
      let numerator = 0
      let denominator = 0

      for (let i = 0; i < intensityMatrix.length; i++) {
        const weight = Math.pow(membershipMatrix[i][j], 2) * possibilityMatrix[i][j]
        numerator += weight * intensityMatrix[i]
        denominator += weight
      }

      centers[j] = denominator > 0 ? numerator / denominator : 0
    }

    return centers
  }

  private enforcePhysiologicalConstraints(centers: number[]): number[] {
    // Ensure CSF < Grey Matter < White Matter ordering
    const sorted = [...centers].sort((a, b) => a - b)

    // Ensure minimum separation between tissue types
    const minSeparation = 0.1
    if (sorted[1] - sorted[0] < minSeparation) {
      sorted[1] = sorted[0] + minSeparation
    }
    if (sorted[2] - sorted[1] < minSeparation) {
      sorted[2] = sorted[1] + minSeparation
    }

    // Clamp to valid intensity range
    return sorted.map((center) => Math.max(0, Math.min(1, center)))
  }

  private calculateCenterChange(oldCenters: number[], newCenters: number[]): number {
    let maxChange = 0
    for (let i = 0; i < oldCenters.length; i++) {
      const change = Math.abs(newCenters[i] - oldCenters[i])
      maxChange = Math.max(maxChange, change)
    }
    return maxChange
  }

  private generateSegmentedImage(
    membershipMatrix: number[][],
    possibilityMatrix: number[][],
    width: number,
    height: number,
  ): ImageData {
    const segmented = new ImageData(width, height)
    const data = segmented.data

    // Define colors for each tissue type
    const colors = [
      [0, 0, 255], // CSF - Blue
      [128, 128, 128], // Grey Matter - Grey
      [255, 255, 255], // White Matter - White
    ]

    for (let i = 0; i < membershipMatrix.length; i++) {
      // Find dominant tissue type with possibility weighting
      let maxValue = 0
      let dominantCluster = 0

      for (let j = 0; j < membershipMatrix[i].length; j++) {
        const combinedValue = membershipMatrix[i][j] * possibilityMatrix[i][j]
        if (combinedValue > maxValue) {
          maxValue = combinedValue
          dominantCluster = j
        }
      }

      // Set pixel color
      const pixelIndex = i * 4
      data[pixelIndex] = colors[dominantCluster][0] // R
      data[pixelIndex + 1] = colors[dominantCluster][1] // G
      data[pixelIndex + 2] = colors[dominantCluster][2] // B
      data[pixelIndex + 3] = 255 // A
    }

    return segmented
  }

  private classifyTissues(
    membershipMatrix: number[][],
    possibilityMatrix: number[][],
    centers: number[],
    width: number,
    height: number,
  ): TissueClassification {
    const whiteMatter: number[][] = []
    const greyMatter: number[][] = []
    const csfMatter: number[][] = []

    let totalConfidence = 0
    let pixelCount = 0

    for (let i = 0; i < membershipMatrix.length; i++) {
      const x = i % width
      const y = Math.floor(i / width)

      // Find dominant tissue with confidence weighting
      let maxValue = 0
      let dominantCluster = 0
      let confidence = 0

      for (let j = 0; j < membershipMatrix[i].length; j++) {
        const combinedValue = membershipMatrix[i][j] * possibilityMatrix[i][j]
        if (combinedValue > maxValue) {
          maxValue = combinedValue
          dominantCluster = j
          confidence = combinedValue
        }
      }

      // Classify pixel based on dominant cluster
      const pixelData = [x, y, confidence, centers[dominantCluster]]

      switch (dominantCluster) {
        case 0: // CSF
          csfMatter.push(pixelData)
          break
        case 1: // Grey Matter
          greyMatter.push(pixelData)
          break
        case 2: // White Matter
          whiteMatter.push(pixelData)
          break
      }

      totalConfidence += confidence
      pixelCount++
    }

    const overallConfidence = pixelCount > 0 ? totalConfidence / pixelCount : 0

    return {
      whiteMatter,
      greyMatter,
      csfMatter,
      confidence: overallConfidence,
      aiGuidance: this.aiGuidance || undefined,
    }
  }
}
