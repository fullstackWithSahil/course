import { NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { createHash } from "crypto";
import sendEmail from "@/lib/sendEmail";
import validateKeyAndLimit, { isValidAuthResult } from "@/app/api/validatekey";


export async function POST(request: Request){
    try {
        const req = await request.json();
        //validate the emails you want to send
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        for (let i = 0; i < req.to.length; i++) {
            const email = req.to[i];
            if (!regex.test(email)) {
                return new NextResponse(JSON.stringify({
                    error:`${email} is not a valid email`,
                    success: false,
                }), { status: 429 }); 
            }
        }

        const redis = Redis.fromEnv();

        //validate the api key, rate limits and check permissions
        const validation = await validateKeyAndLimit(request, "email:send");
        if (!isValidAuthResult(validation)) {
            return validation; // It's a NextResponse (error)
        }
        
        //prevent user from sending multiple emails if they accedently send multiple requests with same body
        const requestHash = createHash('sha256')
            .update(JSON.stringify(req))
            .digest('hex');
        
        const duplicateKey = `${validation.teacher}:email:duplicate:${requestHash}`;
        const existingRequest = await redis.get(duplicateKey);
        if (existingRequest) {
            return new NextResponse(JSON.stringify({
                error: "Duplicate request detected. Please wait before sending the same email again.",
                success: false,
            }), { status: 429 });
        }
        await redis.setex(duplicateKey, 10, "sent");
        
        // Check if the daily limit is exceeded (assuming 100 emails per day)
        const dailyUsageKey = `${validation.teacher}:email:daily`;
        const dailyRatelimit = new Ratelimit({
            redis,
            limiter: Ratelimit.slidingWindow(100, "1 d"),
        });
        const { success: dailySuccess } = await dailyRatelimit.limit(dailyUsageKey);
        if (!dailySuccess) {
            return new NextResponse(JSON.stringify({
                error: "Daily email limit exceeded. Please try again tomorrow.",
                success:false,
            }), { status: 429 });
        }

        //send the email using a third-party service like SendGrid, Nodemailer, etc.
        await sendEmail({
            to:req.to,
            from: req.from || "",
            subject: req.subject || "No Subject",
            html: req.html || "No content provided",
        })

        //send a success response
        return new NextResponse(JSON.stringify({
            message: "Email sent successfully",
            success:true
        }),{status: 200});
    } catch (error) {
        console.log("error in email send route:", error);
        return new NextResponse(JSON.stringify({
            error: "Something went wrong. This is most likely a problem from our end",
            success:false,
        }), { status: 500 });
    }
}