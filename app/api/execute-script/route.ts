import { type NextRequest, NextResponse } from "next/server"
import { spawn } from "child_process"
import path from "path"

export async function POST(request: NextRequest) {
  try {
    const { script, args = [] } = await request.json()

    console.log("[v0] Executing script:", script, "with args:", args.length)

    const scriptPath = path.join(process.cwd(), "scripts", script)

    return new Promise((resolve) => {
      const pythonProcess = spawn("python", [scriptPath, ...args], {
        cwd: process.cwd(),
        stdio: ["pipe", "pipe", "pipe"],
      })

      let stdout = ""
      let stderr = ""

      pythonProcess.stdout.on("data", (data) => {
        stdout += data.toString()
      })

      pythonProcess.stderr.on("data", (data) => {
        stderr += data.toString()
      })

      pythonProcess.on("close", (code) => {
        console.log("[v0] Script execution completed with code:", code)

        if (code !== 0) {
          console.error("[v0] Script error:", stderr)
          resolve(NextResponse.json({ error: `Script execution failed: ${stderr}` }, { status: 500 }))
          return
        }

        try {
          // Try to parse the last line as JSON (the main result)
          const lines = stdout.trim().split("\n")
          const resultLine = lines[lines.length - 1]
          const result = JSON.parse(resultLine)

          resolve(NextResponse.json(result))
        } catch (parseError) {
          console.error("[v0] Failed to parse script output:", parseError)
          resolve(NextResponse.json({ error: "Failed to parse script output", output: stdout }, { status: 500 }))
        }
      })

      pythonProcess.on("error", (error) => {
        console.error("[v0] Failed to start script:", error)
        resolve(NextResponse.json({ error: `Failed to start script: ${error.message}` }, { status: 500 }))
      })
    })
  } catch (error) {
    console.error("[v0] API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
