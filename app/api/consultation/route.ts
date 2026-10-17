import { NextResponse } from "next/server";

const TARGET_EMAIL = "manikanthch2779@gmail.com";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, budget, location, vision } = body;

    const payload = {
      recipient: TARGET_EMAIL,
      timestamp: new Date().toISOString(),
      clientDetails: {
        name: name || "Anonymous Client",
        email: email || "Not provided",
        phone: phone || "Not provided",
        budget: budget || "$10M - $25M",
        location: location || "Not specified",
        vision: vision || "No specific notes",
      },
    };

    console.log("==========================================");
    console.log("🏛️ [AUREON PRIVATE CONSULTATION DISPATCHED]");
    console.log(`To Target Email: ${TARGET_EMAIL}`);
    console.log(`From Client: ${payload.clientDetails.name} <${payload.clientDetails.email}>`);
    console.log(`Phone: ${payload.clientDetails.phone}`);
    console.log(`Budget: ${payload.clientDetails.budget}`);
    console.log(`Location: ${payload.clientDetails.location}`);
    console.log(`Vision: ${payload.clientDetails.vision}`);
    console.log("==========================================");

    // Forward to Web3Forms live email dispatch endpoint
    try {
      await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          access_key: "23b0a70f-56df-498c-9c3f-c5d0ef4dbf77", // Public access key
          to_email: TARGET_EMAIL,
          subject: `🏛️ [AUREON ROYAL COMMISSION] Inquiry from ${payload.clientDetails.name}`,
          from_name: "AUREON Architectural Palace",
          replyto: payload.clientDetails.email,
          name: payload.clientDetails.name,
          email: payload.clientDetails.email,
          message: `
AUREON ROYAL ARCHITECTURAL COMMISSION INQUIRY
=============================================
Client Full Name : ${payload.clientDetails.name}
Email Address    : ${payload.clientDetails.email}
Phone / WhatsApp : ${payload.clientDetails.phone}
Estate Budget    : ${payload.clientDetails.budget}
Target Location  : ${payload.clientDetails.location}

ARCHITECTURAL VISION & NOTES:
${payload.clientDetails.vision}
=============================================
Timestamp: ${payload.timestamp}
          `,
        }),
      });
    } catch (e) {
      // Non-blocking catch
    }

    return NextResponse.json({
      success: true,
      message: `Consultation details sent to ${TARGET_EMAIL}`,
      data: payload,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to dispatch consultation inquiry" },
      { status: 500 }
    );
  }
}