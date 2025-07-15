import { NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { createHash } from "crypto";
import sendEmail from "@/lib/sendEmail";
import validateKeyAndLimit, { isValidAuthResult } from "@/app/api/validatekey";
import { supabaseClient } from "@/lib/server/supabase";
import { z } from "zod";

export async function GET(request: Request) {
	try {
		//validate the api key, rate limits and check permissions
		const validation = await validateKeyAndLimit(
			request,
			"email:templates"
		);
		if (!isValidAuthResult(validation)) {
			return validation; // It's a NextResponse (error)
		}

		//getting the templetes from the database
		const supabase = supabaseClient();
		const { data } = await supabase
			.from("templetes")
			.select("*")
			.eq("teacher", validation.teacher);
		if (!data) {
			return new NextResponse(
				JSON.stringify({
					success: false,
					error: "You have not created any templates",
				}),
				{ status: 404 }
			);
		}
		return new NextResponse(
			JSON.stringify(
				{
					success: true,
					message: "Templates successfully retrived",
					data,
				}
			),
			{ status: 200 }
		);
	} catch (error) {
		console.log("error in listing templetes api:", error);
		return new NextResponse(
			JSON.stringify({
				error: "Something went wrong. This is most likely a problem from our end",
				success: false,
			}),
			{ status: 500 }
		);
	}
}

export async function POST(request: Request) {
	try {
		const req = await request.json();
		//validate the request schema
		const validSchema = schemaValidation(req);
		if (!validSchema.success) {
			return new NextResponse(JSON.stringify(validSchema));
		}
		//validate the emails you want to send
		const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
		for (let i = 0; i < req.to.length; i++) {
			const email = req.to[i];
			if (!regex.test(email)) {
				return new NextResponse(
					JSON.stringify({
						error: `${email} is not a valid email`,
						success: false,
					}),
					{ status: 429 }
				);
			}
		}

		const redis = Redis.fromEnv();

		//validate the api key, rate limits and check permissions
		const validation = await validateKeyAndLimit(request, "email:send");
		if (!isValidAuthResult(validation)) {
			return validation; // It's a NextResponse (error)
		}

		//prevent user from sending multiple emails if they accedently send multiple requests with same body
		const requestHash = createHash("sha256")
			.update(JSON.stringify(req))
			.digest("hex");

		const duplicateKey = `${validation.teacher}:email:duplicate:${requestHash}`;
		const existingRequest = await redis.get(duplicateKey);
		if (existingRequest) {
			return new NextResponse(
				JSON.stringify({
					error: "Duplicate request detected. Please wait before sending the same email again.",
					success: false,
				}),
				{ status: 429 }
			);
		}
		await redis.setex(duplicateKey, 10, "sent");

		// Check if the daily limit is exceeded (assuming 100 emails per day)
		const dailyUsageKey = `${validation.teacher}:email:daily`;
		const dailyRatelimit = new Ratelimit({
			redis,
			limiter: Ratelimit.slidingWindow(100, "1 d"),
		});
		const { success: dailySuccess } =
			await dailyRatelimit.limit(dailyUsageKey);
		if (!dailySuccess) {
			return new NextResponse(
				JSON.stringify({
					error: "Daily email limit exceeded. Please try again tomorrow.",
					success: false,
				}),
				{ status: 429 }
			);
		}

		//get the templete from the database
		const supabase = supabaseClient();
		const { data, error } = await supabase
			.from("templetes")
			.select("*")
			.eq("teacher", validation.teacher)
			.eq("name", req.template)
			.single();
		if (error) {
			return new NextResponse(
				JSON.stringify({
					success: false,
					message: `${req.template} does not exist`,
				})
			);
		}

		//ensure all the keys exist and replace the variables
		let formatedHtml = data.body;
		let variables = data.variables;
		for (const key of Object.keys(req.variables)) {
			if (!data.variables.includes(key)) {
				return new NextResponse(
					JSON.stringify({
						success: false,
						message: `The template ${req.template} does not cotain the variable ${key}`,
					})
				);
			}
			formatedHtml = formatedHtml.replace(
				`{{${key}}}`,
				req.variables[key]
			);
			variables = variables.filter((e) => e != key);
		}
		if (variables.length > 0) {
			return new NextResponse(
				JSON.stringify({
					success: false,
					message: `you have not provided value for variable ${variables[0]}`,
				})
			);
		}

		//send the email using a third-party service like SendGrid, Nodemailer, etc.
		await sendEmail({
			to: req.to,
			from: req.from || "",
			subject: req.subject || "No Subject",
			html: formatedHtml || "No content provided",
		});

		//send a success response
		return new NextResponse(
			JSON.stringify({
				message: "Email sent successfully",
				success: true,
			}),
			{ status: 200 }
		);
	} catch (error) {
		console.log("error in email send route:", error);
		return new NextResponse(
			JSON.stringify({
				error: "Something went wrong. This is most likely a problem from our end",
				success: false,
			}),
			{ status: 500 }
		);
	}
}

const nonEmptyString = z.string().min(1, { message: "Must not be empty." });

const requestSchema = z.object({
	to: z
		.array(nonEmptyString.email())
		.min(1, { message: '"to" array must not be empty.' }),
	subject: nonEmptyString,
	from: nonEmptyString.email(),
	template: nonEmptyString,
	variables: z
		.record(z.any())
		.refine((val) => Object.keys(val).length > 0, {
			message: '"variables" must be a non-empty object.',
		}),
});

function schemaValidation(body: any) {
	const result = requestSchema.safeParse(body);

	if (!result.success) {
		return {
			success: false,
			errors: result.error.issues.map(
				(issue) => `${issue.path.join(".")}: ${issue.message}`
			),
		};
	}

	return { success: true, data: result.data };
}
