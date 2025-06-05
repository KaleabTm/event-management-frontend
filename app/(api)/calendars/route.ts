import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { calendarSchema } from "@/lib/validations/event"
import { getCalendars, createCalendar } from "@/lib/calendars"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const calendars = await getCalendars(session.user.email)
    return NextResponse.json(calendars)
  } catch (error) {
    console.error("GET /api/calendars error:", error)
    return NextResponse.json({ error: "Failed to fetch calendars" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = calendarSchema.parse(body)

    const calendar = await createCalendar(session.user.email, validatedData)
    return NextResponse.json(calendar, { status: 201 })
  } catch (error) {
    console.error("POST /api/calendars error:", error)
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: "Failed to create calendar" }, { status: 500 })
  }
}
