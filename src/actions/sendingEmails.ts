"use server";

import sendDiscordMessage from "@/lib/discord";
import sendEmail from "@/lib/sendEmail";
import { supabaseClient } from "@/lib/server/supabase";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { createHash } from "crypto";

export async function sendTemplateEmails(
    to:string[],
    teacher:string,
    template:string,
    subject:string,
    variables:any
){
    try {
		//validate the emails you want to send
		const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
		for (let i = 0; i < to.length; i++) {
			const email = to[i];
			if (!regex.test(email)) {
				return {
					error: `${email} is not a valid email`,
					success: false,
				}
			}
		}

		const redis = Redis.fromEnv();

		//prevent user from sending multiple emails if they accedently send multiple requests with same body
		const requestHash = createHash("sha256")
			.update(JSON.stringify({to}))
			.digest("hex");

		const duplicateKey = `${teacher}:email:duplicate:${requestHash}`;
		const existingRequest = await redis.get(duplicateKey);
		if (existingRequest) {
			return {
				error:"Duplicate request detected. Please wait before sending the same email again.",
				success: false,
			}
		}
		await redis.setex(duplicateKey, 10, "sent");

		// Check if the daily limit is exceeded (assuming 100 emails per day)
		const dailyUsageKey = `${teacher}:email:daily`;
		const dailyRatelimit = new Ratelimit({
			redis,
			limiter: Ratelimit.slidingWindow(100, "1 d"),
		});
		const { success: dailySuccess } =
			await dailyRatelimit.limit(dailyUsageKey);
		if (!dailySuccess) {
			return {
				error: "Daily email limit exceeded. Please try again tomorrow.",
				success: false,
			}
		}

		//get the templete from the database
		const supabase = supabaseClient();
		const { data, error } = await supabase
			.from("templetes")
			.select("*")
			.eq("teacher", teacher)
			.eq("name",template)
			.single();
		if (error) {
			return {
				success: false,
				message: `${template} does not exist`,
			}
		}

		//ensure all the keys exist and replace the variables
		let formatedHtml = data.body;
        let dvariables = data.variables;
        console.log({dvariables})
		for (const key of Object.keys(variables)) {
            if (!data.variables.includes(key)) {
				return{
					success: false,
					message: `The template ${template} does not cotain the variable ${key}`,
				}
			}
			formatedHtml = formatedHtml.replace(`{{${key}}}`, variables[key as any]);
            dvariables = dvariables.filter(e=>e!=key)
		}
        if(dvariables.length>0){
            return {
				success: false,
				message: `you have not provided value for variable ${dvariables[0]}`,
			}
        }

        //get the teachers sender email
        const {data:senderEmail} = await supabase
            .from("teachers")
            .select("senderEmail")
            .eq("teacher",teacher)
            .single();
        console.log({senderEmail})
        if(!senderEmail||!senderEmail.senderEmail){
            await sendDiscordMessage(`You have probably forgotten to set asender email for ${teacher}`);
            return {
                success:false,
                message:"There was an error sending emails. This is probably our fault"
            }
        }

		//send the email using a third-party service like SendGrid, Nodemailer, etc.
		await sendEmail({
			to: to,
			from:senderEmail?.senderEmail||"",
			subject:subject || "No Subject",
			html: formatedHtml || "No content provided",
		});

		//send a success response
		return {
			message: "Email sent successfully",
			success: true,
		}
    } catch (error) {
        console.log("Error sending emails as server action ",error);
        return {
            success:false,
            message:"There was an error sending emails. This is probably our fault"
        }
    }
}