export async function onRequestPost(context) {
  try {
    // 1. Get the form data
    const formData = await context.request.formData();
    const data = Object.fromEntries(formData.entries());

    // 1.1 Honeypot Check
    // If a bot fills out the hidden 'website' field, silently succeed without sending the email
    if (data.website) {
      return Response.redirect(new URL('/thanks', context.request.url).toString(), 303);
    }

    // ---------------------------------------------------------
    // 1.2 Turnstile Verification
    // ---------------------------------------------------------
    const turnstileToken = data['cf-turnstile-response'];
    const ip = context.request.headers.get('CF-Connecting-IP');
    const turnstileSecret = context.env.TURNSTILE_SECRET_KEY;

    if (turnstileSecret) {
      if (!turnstileToken) {
        return new Response("Turnstile security check missing. Please complete the security check.", { status: 400 });
      }

      let verificationBody = new FormData();
      verificationBody.append('secret', turnstileSecret);
      verificationBody.append('response', turnstileToken);
      if (ip) {
        verificationBody.append('remoteip', ip);
      }

      const verificationResult = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        body: verificationBody,
        method: 'POST',
      });

      const outcome = await verificationResult.json();

      if (!outcome.success) {
        const errorDetails = (outcome['error-codes'] || []).join(', ');
        console.error("Turnstile verification failed:", errorDetails);
        return new Response(`Turnstile verification failed: ${errorDetails || 'Invalid token'}. Please try again.`, { status: 403 });
      }
    } else {
      console.warn("TURNSTILE_SECRET_KEY environment variable is not defined. Skipping server-side Turnstile verification.");
    }
    // ---------------------------------------------------------
    // END Turnstile Verification
    // ---------------------------------------------------------

    // 1.5 Validate Email Format
    const emailStr = data.email || '';
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(emailStr)) {
      return new Response(`The email address "${emailStr}" is not in a valid email format.`, { status: 400 });
    }

    // 1.6 Validate Email Domain (DNS MX Record Check)
    const domain = emailStr.split('@')[1];
    try {
      const dnsResponse = await fetch(`https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domain)}&type=MX`, {
        headers: { 'Accept': 'application/dns-json' }
      });

      if (dnsResponse.ok) {
        const dnsData = await dnsResponse.json();
        if (dnsData.Status !== 0 || !dnsData.Answer || dnsData.Answer.length === 0) {
          return new Response(`The email domain "@${domain}" does not appear to exist or cannot receive emails.`, { status: 400 });
        }
      }
    } catch (e) {
      console.warn("DNS check error, continuing:", e.message);
    }

    // 2. Build the email body
    const emailBody = `
      <h2>New Contact Form Inquiry</h2>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Phone:</strong> ${data.phone || 'Not provided'}</p>
      <p><strong>Preferred Service:</strong> ${data.service}</p>
      <p><strong>Message:</strong></p>
      <p style="white-space: pre-wrap;">${data.message}</p>
    `;

    // 3. Send email using Resend
    const resendApiKey = context.env.RESEND_API_KEY;
    if (!resendApiKey) {
      console.error("RESEND_API_KEY is not defined in environment variables.");
      return new Response("Server configuration error: RESEND_API_KEY environment variable is missing.", { status: 500 });
    }

    const recipientEmail = context.env.NOTIFICATION_EMAIL || "mopsgroupofcompanies@gmail.com";
    const senderEmail = context.env.FROM_EMAIL || "onboarding@resend.dev";

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: `Mops Inc. Website <${senderEmail}>`,
        to: [recipientEmail],
        reply_to: data.email,
        subject: `New Mops Inc. Inquiry: ${data.service} - ${data.name}`,
        html: emailBody,
      }),
    });

    // 4. If successful, redirect the user to your custom thanks page
    if (response.ok) {
      return Response.redirect(new URL('/thanks', context.request.url).toString(), 303);
    } else {
      const errorText = await response.text();
      let cleanErrorMessage = errorText;
      try {
        const parsedObj = JSON.parse(errorText);
        cleanErrorMessage = parsedObj.message || parsedObj.name || errorText;
      } catch (e) {}
      console.error("Resend API error:", cleanErrorMessage);
      return new Response('Email service error: ' + cleanErrorMessage, { status: 500 });
    }
  } catch (err) {
    return new Response('Server Error: ' + err.message, { status: 500 });
  }
}
