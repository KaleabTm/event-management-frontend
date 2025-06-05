import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { eventSchema } from "@/lib/validations/event"
import { updateEvent, deleteEvent } from "@/lib/events"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = eventSchema.parse(body)

    const event = await updateEvent(params.id, session.user.email, validatedData)
    return NextResponse.json(event)
  } catch (error) {
    console.error("PUT /api/events/[id] error:", error)
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: "Failed to update event" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await deleteEvent(params.id, session.user.email)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("DELETE /api/events/[id] error:", error)
    return NextResponse.json({ error: "Failed to delete event" }, { status: 500 })
  }
}
