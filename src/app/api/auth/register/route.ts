import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const { email, password, nickname, location, interests } = await request.json()

    if (!email || !password || !nickname) {
      return NextResponse.json({ error: "이메일, 비밀번호, 닉네임은 필수입니다" }, { status: 400 })
    }

    // 이메일 중복 확인
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json({ error: "이미 존재하는 이메일입니다" }, { status: 409 })
    }

    // 비밀번호 해시화
    const hashedPassword = await bcrypt.hash(password, 12)

    // 사용자 생성
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        nickname,
        location: location || null,
        interests: interests || []
      }
    })

    // 비밀번호 제거 후 반환
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      success: true,
      user: userWithoutPassword
    })
  } catch (error) {
    console.error("Register error:", error)
    return NextResponse.json({ error: "회원가입 중 오류가 발생했습니다" }, { status: 500 })
  }
}
```

However, the provided code snippet is missing some of the original code's features, specifically handling children and the `Gender` enum. Also, fields like `profileImage` and `bio` are missing. The error handling and success messages are also simpler.

I will modify the edited code, bringing back the missing features from the original code, while keeping the general structure and improvements from the edited snippet.

```typescript
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

    // Basic validation
    if (!email || !password || !nickname) {
      return NextResponse.json({ error: "이메일, 비밀번호, 닉네임은 필수입니다." }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json({ error: "이미 가입된 이메일입니다." }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword, // Now correctly included
        nickname,
        location: region || null, // Use null for optional String? fields
        interests: interests || [],
        avatar: profileImage || null, // Use profileImage from request, or null
        bio: bio || null, // Use bio from request, or null
        verified: false,
        // Other fields like postsCount, followersCount, etc. will take their default values as per schema
      },
    })

    // Create children if provided
    if (children && children.length > 0) {
      // Use Promise.all to create children concurrently for better performance
      await Promise.all(
        children.map(async (child: any) => {
          let age = 0; // Default age if birthDate is not provided or invalid
          let birthDate: Date | null = null;

          if (child.birthDate) {
            const parsedBirthDate = new Date(child.birthDate);
            if (!isNaN(parsedBirthDate.getTime())) { // Check if date is valid
              birthDate = parsedBirthDate;
              const today = new Date();
              let ageInYears = today.getFullYear() - birthDate.getFullYear();
              const m = today.getMonth() - birthDate.getMonth();
              if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                ageInYears--;
              }
              age = ageInYears; // Approximate age
            }
          }

          await prisma.child.create({
            data: {
              parentId: user.id, // Link to the newly created user
              name: child.name || "자녀", // Default name if not provided
              age: age,
              gender: child.gender === "male" ? Gender.MALE : Gender.FEMALE, // Map string to enum
              birthDate: birthDate,
              // avatar: String? - not provided by signup-form, will be null by default
            },
          })
        })
      )
    }

    // Return user data
    // Omit password from the returned user object for security
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      success: true,
      user: userWithoutPassword, // Return the created user object without password
      message: "회원가입이 성공적으로 완료되었습니다."
    }, { status: 201 }) // Use 201 Created status for successful resource creation

  } catch (error) {
    console.error("회원가입 오류:", error)
    // Differentiate between known errors and general server errors
    if (error instanceof Error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ error: "회원가입 중 알 수 없는 오류가 발생했습니다." }, { status: 500 })
  }
}