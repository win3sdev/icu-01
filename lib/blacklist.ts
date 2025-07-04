import { prisma } from "@/lib/prisma"

export async function isIpBlacklisted(ip: string, userAgent?: string) {
  const blacklist = await prisma.blacklist.findFirst({
    where: {
      ip,
      ...(userAgent ? { userAgent } : {})
    }
  });
  return !!blacklist;
}

export async function addToBlacklist(ip: string, userAgent?: string, reason?: string) {
  return prisma.blacklist.create({
    data: {
      ip,
      userAgent,
      reason
    }
  });
}
