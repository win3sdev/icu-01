import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== "GET") {
      return res.status(405).json({ error: "Method Not Allowed" });
    }

    const { query } = req;
    const page = parseInt((query.page as string) || "1");
    const pageSize = 25;

    const where = {
      ...(query.province && {
        province: { contains: query.province as string },
      }),
      ...(query.city && { city: { contains: query.city as string } }),
      ...(query.district && {
        district: { contains: query.district as string },
      }),
      ...(query.schoolName && {
        schoolName: { contains: query.schoolName as string },
      }),
      ...(query.grade && { grade: { contains: query.grade as string } }),
      ...(query.schoolStartTime && {
        schoolStartTime: { equals: query.schoolStartTime as string },
      }),
      ...(query.schoolEndTime && {
        schoolEndTime: { equals: query.schoolEndTime as string },
      }),
      ...(query.weeklyStudyHours && {
        weeklyStudyHours: {
          equals: parseInt(query.weeklyStudyHours as string),
        },
      }),
      ...(query.monthlyHolidays && {
        monthlyHolidays: { equals: parseInt(query.monthlyHolidays as string) },
      }),
      ...(query.suicideCases && {
        suicideCases: { equals: parseInt(query.suicideCases as string) },
      }),
      ...(query.studentComments && {
        studentComments: { contains: query.studentComments as string },
      }),
      status: "approved",
    };

    const [total, data] = await Promise.all([
      prisma.schoolSurvey.count({ where }),
      prisma.schoolSurvey.findMany({
        where,
        take: pageSize,
        skip: (page - 1) * pageSize,
        orderBy: {
          createdAt: "desc",
        },
      }),
    ]);

    return res.status(200).json({
      data,
      pagination: {
        total,
        pageSize,
        currentPage: page,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error("Error fetching school data:", error);
    return res.status(500).json({ error: "Failed to fetch school data" });
  }
}
