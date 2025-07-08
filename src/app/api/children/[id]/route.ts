import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { name, age, gender } = await request.json()

    const child = await prisma.child.update({
      where: { id: params.id },
      data: {
        name,
        age,
        gender,
      },
    })

    return NextResponse.json({ success: true, child })
  } catch (error) {
    console.error("Error updating child:", error)
    return NextResponse.json({ error: "Failed to update child" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.child.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting child:", error)
    return NextResponse.json({ error: "Failed to delete child" }, { status: 500 })
  }
}
