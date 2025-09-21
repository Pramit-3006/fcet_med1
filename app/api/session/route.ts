import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const createSessionSchema = z.object({
  sessionId: z.string(),
  uploadedFiles: z.array(z.any()).optional(),
})

// GET /api/session?sessionId=xxx - Get session data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get("sessionId")

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID is required" }, { status: 400 })
    }

    const session = await prisma.analysisSession.findUnique({
      where: { sessionId },
      include: {
        _count: {
          select: { analyses: true },
        },
      },
    })

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 })
    }

    // Get associated analyses
    const analyses = await prisma.medicalAnalysis.findMany({
      where: {
        id: { in: session.analyses },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({
      session: {
        ...session,
        analyses,
      },
    })
  } catch (error) {
    console.error("[v0] Error fetching session:", error)
    return NextResponse.json({ error: "Failed to fetch session" }, { status: 500 })
  }
}

// POST /api/session - Create or update session
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createSessionSchema.parse(body)

    const session = await prisma.analysisSession.upsert({
      where: { sessionId: validatedData.sessionId },
      update: {
        uploadedFiles: validatedData.uploadedFiles || [],
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Extend expiration
      },
      create: {
        sessionId: validatedData.sessionId,
        uploadedFiles: validatedData.uploadedFiles || [],
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    })

    return NextResponse.json({ session })
  } catch (error) {
    console.error("[v0] Error creating/updating session:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid request data", details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Failed to create/update session" }, { status: 500 })
  }
}
