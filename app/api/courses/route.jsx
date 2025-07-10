import { NextResponse } from "next/server";
import { db } from "@/config/db";
import { coursesTable } from "@/config/schema";
import { desc, eq, sql } from "drizzle-orm";
import { currentUser } from "@clerk/nextjs/server";

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const courseId = searchParams?.get('courseId')
    const user=await currentUser(); 

    if(courseId==0){
         const result = await db.select().from(coursesTable).where(sql`${coursesTable.courseContent}::jsonb !='{}'::jsonb `);
        console.log(result);


        return NextResponse.json(result);
    }

    if (courseId) {
        const result = await db.select().from(coursesTable).where(eq(coursesTable.cid, courseId));
        console.log(result);


        return NextResponse.json(result[0]);

    }
    else{
        const result = await db.select().from(coursesTable).where(eq(coursesTable.userEmail, user.primaryEmailAddress?.emailAddress)).orderBy(desc(coursesTable.id));
        console.log(result);


        return NextResponse.json(result);
    }






}