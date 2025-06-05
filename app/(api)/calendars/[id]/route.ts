import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { calendarSchema } from "@/lib/validations/event"
import { updateCalendar, deleteCalendar } from "@/lib/calendars"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = calendarSchema.parse(body)

    const calendar = await updateCalendar(params.id, session.user.email, validatedData)
    return NextResponse.json(calendar)
  } catch (error) {
    console.error("PUT /api/calendars/[id] error:", error)
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: "Failed to update calendar" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await deleteCalendar(params.id, session.user.email)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("DELETE /api/calendars/[id] error:", error)
    return NextResponse.json({ error: "Failed to delete calendar" }, { status: 500 })
  }
}
