import { PrismaClient } from '@prisma/client'

// 싱글톤 패턴을 사용하여 PrismaClient 인스턴스 생성
const prismaClientSingleton = () => {
  return new PrismaClient()
}

// PrismaClientSingleton 타입 정의
declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

export const prisma = globalThis.prisma ?? prismaClientSingleton()

// 개발환경에서만 글로벌 객체에 PrismaClient 인스턴스 할당
// 개발환경에서 서버가 리로드될 때마다 새로운 PrismaClient 인스턴스가 생성되는 것 방지
if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma