import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { Gender } from "@prisma/client"

export async function POST(request: NextRequest) {
  try {
    const {
      email,
      password,
      nickname,
      region,
      children,
      interests,
      profileImage,
      bio,
    } = await request.json()

    // 기본 유효성 검사
    if (!email || !password || !nickname) {
      return NextResponse.json({ error: "이메일, 비밀번호, 닉네임은 필수입니다." }, { status: 400 })
    }

    // 이미 존재하는 사용자 확인
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json({ error: "이미 가입된 이메일입니다." }, { status: 409 })
    }

    // 비밀번호 해시화
    const hashedPassword = await bcrypt.hash(password, 12)

    // 사용자 생성
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        nickname,
        location: region || null,
        interests: interests || [],
        avatar: profileImage || null,
        bio: bio || null,
        verified: false,
      },
    })

    // 자녀 정보가 있는 경우 생성
    if (children && children.length > 0) {
      await Promise.all(
        children.map(async (child: any) => {
          let age = 0
          let birthDate: Date | null = null

          if (child.birthDate) {
            const parsedBirthDate = new Date(child.birthDate)
            if (!isNaN(parsedBirthDate.getTime())) {
              birthDate = parsedBirthDate
              const today = new Date()
              let ageInYears = today.getFullYear() - birthDate.getFullYear()
              const m = today.getMonth() - birthDate.getMonth()
              if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                ageInYears--
              }
              age = ageInYears
            }
          }

          await prisma.child.create({
            data: {
              parentId: user.id,
              name: child.name || "자녀",
              age: age,
              gender: child.gender === "male" ? Gender.MALE : Gender.FEMALE,
              birthDate: birthDate,
            },
          })
        })
      )
    }

    // 비밀번호를 제외한 사용자 정보 반환
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
      message: "회원가입이 성공적으로 완료되었습니다."
    }, { status: 201 })

  } catch (error) {
    console.error("회원가입 오류:", error)
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ error: "회원가입 중 알 수 없는 오류가 발생했습니다." }, { status: 500 })
  }
}