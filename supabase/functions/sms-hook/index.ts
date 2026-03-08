import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

async function sendOtpViaWhatsApp(phone: string, otp: string): Promise<void> {
    const accountSid = Deno.env.get("TWILIO_ACCOUNT_SID");
    const authToken = Deno.env.get("TWILIO_AUTH_TOKEN");
    const fromNumber = Deno.env.get("TWILIO_WHATSAPP_FROM") || "whatsapp:+14155238886";

    if (!accountSid || !authToken) {
        throw new Error("TWILIO_ACCOUNT_SID or TWILIO_AUTH_TOKEN is not set");
    }

    // Ensure phone has + prefix and whatsapp: prefix
    const toPhone = phone.startsWith("+") ? phone : `+${phone}`;
    const toWhatsApp = `whatsapp:${toPhone}`;
    const fromWhatsApp = fromNumber.startsWith("whatsapp:") ? fromNumber : `whatsapp:${fromNumber}`;

    const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;

    const body = new URLSearchParams({
        From: fromWhatsApp,
        To: toWhatsApp,
        Body: `Your UniCouncil OTP is: ${otp}. Valid for 10 minutes.`,
    });

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Authorization": "Basic " + btoa(`${accountSid}:${authToken}`),
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: body.toString(),
    });

    const data = await response.json();

    if (!response.ok) {
        console.error("Twilio WhatsApp error:", JSON.stringify(data));
        throw new Error(data.message ?? "Failed to send WhatsApp OTP via Twilio");
    }

    console.log(`WhatsApp OTP sent to ${toPhone}, SID: ${data.sid}`);
}

serve(async (req: Request) => {
    if (req.method !== "POST") {
        return new Response("Method Not Allowed", { status: 405 });
    }

    try {
        const payload = await req.json();
        const { user, sms } = payload;

        console.log("Hook called. Phone:", user?.phone, "OTP length:", sms?.otp?.length);

        if (!user?.phone || !sms?.otp) {
            return new Response(
                JSON.stringify({ error: "Missing phone or OTP in payload" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        await sendOtpViaWhatsApp(user.phone, sms.otp);

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("SMS hook error:", error);
        return new Response(
            JSON.stringify({
                error: error instanceof Error ? error.message : "Internal server error",
            }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
});
