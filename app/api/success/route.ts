import { NextResponse } from "next/server";
import getServerStripe from "@/app/api/getServerStripe";

const stripe = getServerStripe();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("session_id");
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  return NextResponse.json(session);
}
