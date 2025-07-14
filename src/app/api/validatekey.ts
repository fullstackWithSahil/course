import { NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { supabaseClient } from "@/lib/server/supabase";

export const ErrorResponse = JSON.stringify({
    serverError:true,
    message: "An error occurred while processing your request.",
});

export default async function validateKeyAndLimit(
    request: Request,
    permission: string
): Promise<NextResponse<any>|{ ok: boolean; teacher: string }> {
	const redis = Redis.fromEnv();
	//get the api key from the request headers
	const apiKey = request.headers.get("authorization");
	if (!apiKey || !apiKey.startsWith("Bearer ")) {
		return new NextResponse(
			JSON.stringify({
				error: "API key is missing or invalid",
				success:false
			}),
			{ status: 401 }
		);
	}

	//check if the api key is valid
	const supabase = supabaseClient();
	const { data: apiKeyData, error } = await supabase
		.from("apikeys")
		.select("*")
		.eq("key", apiKey.replace("Bearer ", ""))
		.single();
	if (error || !apiKeyData) {
		return new NextResponse(
			JSON.stringify({
				error: "Invalid API key",
				success:false
			}),
			{ status: 401 }
		);
	}

	//check if the API key has the required permissions
	if (!apiKeyData.permissions.includes(permission)) {
		return new NextResponse(
			JSON.stringify({
				error: "API key does not have permission to send emails",
				success:false
			}),
			{ status: 403 }
		);
	}

	//ckeck if the rate limit is exceeded
	const reatLimitKey = `${apiKeyData.teacher}:${permission}:limit`;
	const ratelimit = new Ratelimit({
		redis,
		limiter: Ratelimit.slidingWindow(10, "10 s"),
	});
	const { success } = await ratelimit.limit(reatLimitKey);
	if (!success) {
		return new NextResponse(
			JSON.stringify({
				error: "Rate limit exceeded. Please try again later.",
				success: false,
			}),
			{ status: 429 }
		);
	}
    return {ok:true,teacher:apiKeyData.teacher||"teacher"};
}

export function isValidAuthResult(
  result: NextResponse | { ok: boolean; teacher: string }
): result is { ok: boolean; teacher: string } {
  return (result as any).ok === true && typeof (result as any).teacher === "string";
}