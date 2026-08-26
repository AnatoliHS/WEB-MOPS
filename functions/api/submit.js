export async function onRequestPost({ request, env }) {
  try {
    let data;
    const contentType = request.headers.get('content-type') || '';
    
    if (contentType.includes('application/json')) {
      data = await request.json();
    } else {
      const formData = await request.formData();
      data = Object.fromEntries(formData.entries());
    }

    // Honeypot check
    if (data.website) {
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }

    const name = (data.name || '').trim();
    const email = (data.email || '').trim();
    const phone = (data.phone || '').trim();
    const service = (data.service || '').trim();
    const message = (data.message || '').trim();
    const turnstileToken = data['cf-turnstile-response'] || data.turnstileToken || '';

    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // 1. Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(JSON.stringify({ error: "Invalid email format" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // 2. Email domain validation (check for MX records)
    const domain = email.split('@')[1];
    try {
      const dnsResponse = await fetch(`https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domain)}&type=MX`, {
        headers: {
          'Accept': 'application/dns-json'
        }
      });

      if (dnsResponse.ok) {
        const dnsData = await dnsResponse.json();
        if (!dnsData.Answer || dnsData.Answer.length === 0) {
          return new Response(JSON.stringify({ error: "Invalid email domain. The domain does not accept emails." }), {
            status: 400,
            headers: { "Content-Type": "application/json" }
          });
        }
      }
    } catch (e) {
      console.error("DNS check failed", e);
    }

    // 3. Cloudflare Turnstile Verification
    const turnstileSecret = env.TURNSTILE_SECRET_KEY;
    if (turnstileSecret) {
      if (!turnstileToken) {
        return new Response(JSON.stringify({ error: "Please complete the security check" }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
      }

      const turnstileFormData = new FormData();
      turnstileFormData.append('secret', turnstileSecret.trim());
      turnstileFormData.append('response', turnstileToken);
      
      const ip = request.headers.get('CF-Connecting-IP');
      if (ip) {
        turnstileFormData.append('remoteip', ip);
      }

      const turnstileResult = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        body: turnstileFormData
      });

      const turnstileOutcome = await turnstileResult.json();
      if (!turnstileOutcome.success) {
        return new Response(JSON.stringify({ error: "Anti-spam verification failed. Please try again." }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
      }
    } else {
      console.warn("TURNSTILE_SECRET_KEY is not defined. Skipping Turnstile verification.");
    }

    // 4. Send Email via Resend
    const resendApiKey = env.RESEND_API_KEY;
    if (!resendApiKey) {
      return new Response(JSON.stringify({ error: "Server configuration error: RESEND_API_KEY environment variable is missing." }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    const fromEmail = env.RESEND_FROM_EMAIL || env.FROM_EMAIL || "onboarding@resend.dev";
    const toEmail = "mopsgroupofcompanies@gmail.com";

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey.trim()}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: `MOPS Website <${fromEmail.trim()}>`,
        to: [toEmail],
        reply_to: email,
        subject: `New Mops Inc. Inquiry: ${service || 'General'} - ${name}`,
        html: `
          <h3>New Message from MOPS Inc. Website</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
          <p><strong>Preferred Service / Damage Type:</strong> ${service || 'Not specified'}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
        `
      })
    });

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      let resendErr = errorText;
      try {
        const errJson = JSON.parse(errorText);
        resendErr = errJson.message || errorText;
      } catch (e) {}
      console.error("Resend API Error:", resendErr);
      return new Response(JSON.stringify({ error: `Failed to send email: ${resendErr}` }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify({ success: true, message: "Email sent successfully" }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("Function error:", error);
    return new Response(JSON.stringify({ error: "Internal server error: " + error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
