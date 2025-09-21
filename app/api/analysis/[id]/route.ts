import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

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

// GET /api/analysis/[id] - Get specific analysis
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const analysis = await prisma.medicalAnalysis.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    })

    if (!analysis) {
      return NextResponse.json({ error: "Analysis not found" }, { status: 404 })
    }

    return NextResponse.json({ analysis })
  } catch (error) {
    console.error("[v0] Error fetching analysis:", error)
    return NextResponse.json({ error: "Failed to fetch analysis" }, { status: 500 })
  }
}

// PUT /api/analysis/[id] - Update analysis results
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const validatedData = updateAnalysisSchema.parse(body)

    const analysis = await prisma.medicalAnalysis.update({
      where: { id: params.id },
      data: validatedData,
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    })

    return NextResponse.json({ analysis })
  } catch (error) {
    console.error("[v0] Error updating analysis:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid request data", details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Failed to update analysis" }, { status: 500 })
  }
}

// DELETE /api/analysis/[id] - Delete analysis
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.medicalAnalysis.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error deleting analysis:", error)
    return NextResponse.json({ error: "Failed to delete analysis" }, { status: 500 })
  }
}
