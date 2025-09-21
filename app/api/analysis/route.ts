import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

// Schema for creating a new analysis
const createAnalysisSchema = z.object({
  fileName: z.string(),
  fileType: z.string(),
  fileSize: z.number().optional(),
  imageUrl: z.string().optional(),
  analysisType: z.enum(["PMSFCA", "AI_ANALYSIS", "COMBINED"]),
  sessionId: z.string().optional(),
})

// Schema for updating analysis results
const updateAnalysisSchema = z.object({
  status: z.enum(["processing", "completed", "failed"]).optional(),
  confidence: z.number().min(0).max(1).optional(),
  pmsfcaResults: z.any().optional(),
  aiAnalysis: z.string().optional(),
  aiConfidence: z.number().min(0).max(1).optional(),
  whiteMatter: z.any().optional(),
  greyMatter: z.any().optional(),
  csfMatter: z.any().optional(),
  processingTime: z.number().optional(),
  errorMessage: z.string().optional(),
})

// GET /api/analysis - Get all analyses or filter by session
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get("sessionId")
    const userId = searchParams.get("userId")
    const status = searchParams.get("status")
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    const where: any = {}

    if (sessionId) {
      // Find analyses by session
      const session = await prisma.analysisSession.findUnique({
        where: { sessionId },
        select: { analyses: true },
      })

      if (session) {
        where.id = { in: session.analyses }
      }
    }

    if (userId) {
      where.userId = userId
    }

    if (status) {
      where.status = status
    }

    const analyses = await prisma.medicalAnalysis.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    })

    const total = await prisma.medicalAnalysis.count({ where })

    return NextResponse.json({
      analyses,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    })
  } catch (error) {
    console.error("[v0] Error fetching analyses:", error)
    return NextResponse.json({ error: "Failed to fetch analyses" }, { status: 500 })
  }
}

// POST /api/analysis - Create a new analysis
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createAnalysisSchema.parse(body)

    const analysis = await prisma.medicalAnalysis.create({
      data: {
        ...validatedData,
        status: "processing",
      },
    })

    // Update session if provided
    if (validatedData.sessionId) {
      await prisma.analysisSession.upsert({
        where: { sessionId: validatedData.sessionId },
        update: {
          analyses: {
            push: analysis.id,
          },
          currentStep: "processing",
        },
        create: {
          sessionId: validatedData.sessionId,
          analyses: [analysis.id],
          currentStep: "processing",
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        },
      })
    }

    return NextResponse.json({ analysis }, { status: 201 })
  } catch (error) {
    console.error("[v0] Error creating analysis:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid request data", details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Failed to create analysis" }, { status: 500 })
  }
}
