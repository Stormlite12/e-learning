import { NextResponse } from "next/server";
import { db } from "@/config/db";
import { coursesTable } from "@/config/schema";
import { eq } from "drizzle-orm";

export async function GET(req) {
    const {searchParams} = new URL(req.url);
    const courseId=searchParams.get('courseId')

    const result = await db.select().from(coursesTable).where(eq(coursesTable.cid,courseId));

    console.log(result);

    
    return NextResponse.json(result[0]);


}