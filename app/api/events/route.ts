import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { eventSchema } from "@/lib/validations/event"
import { getEvents, createEvent } from "@/lib/events"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const events = await getEvents(session.user.email)
    return NextResponse.json(events)
  } catch (error) {
    console.error("GET /api/events error:", error)
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = eventSchema.parse(body)

    const event = await createEvent(session.user.email, validatedData)
    return NextResponse.json(event, { status: 201 })
  } catch (error) {
    console.error("POST /api/events error:", error)
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 })
  }
}
