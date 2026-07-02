import { NextRequest, NextResponse } from "next/server";
import { setDiscordRole } from "@/lib/discord";

export async function POST(request: NextRequest) {
  const internalSecret = process.env.INTERNAL_API_SECRET;
  const authHeader = request.headers.get("authorization");

  if (!internalSecret || authHeader !== `Bearer ${internalSecret}`) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = (await request.json()) as {
    discordUserId?: string;
    active?: boolean;
  };

  if (!body.discordUserId) {
    return NextResponse.json({ error: "discordUserId is required." }, { status: 400 });
  }

  await setDiscordRole(body.discordUserId, body.active === true);
  return NextResponse.json({ ok: true });
}
