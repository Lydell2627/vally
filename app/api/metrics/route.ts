import { createClient } from 'next-sanity';
import { NextResponse } from 'next/server';
import { projectId, dataset, apiVersion } from '../../../lib/sanity';

// Helper to get authenticated client
function getWriteClient() {
    const token = process.env.SANITY_API_TOKEN;
    if (!token) return null;

    return createClient({
        projectId,
        dataset,
        apiVersion,
        token,
        useCdn: false,
    });
}

// The singleton metrics document ID
const METRICS_DOC_ID = 'metrics-singleton';

// --- GET: Fetch current metrics ---
export async function GET() {
    try {
        const client = getWriteClient();
        if (!client) {
            return NextResponse.json({ error: 'No API token configured' }, { status: 500 });
        }

        const metrics = await client.fetch(
            `*[_type == "metrics" && _id == $id][0]`,
            { id: METRICS_DOC_ID }
        );

        if (!metrics) {
            return NextResponse.json({
                noCount: 0,
                hasSigned: false,
                signatureName: null,
                hasSaidYes: false,
                yesClickedAt: null,
                totalNoBeforeYes: null,
            });
        }

        return NextResponse.json({
            noCount: metrics.noCount || 0,
            lastNoClickAt: metrics.lastNoClickAt || null,
            hasSigned: metrics.hasSigned || false,
            signatureName: metrics.signatureName || null,
            signedAt: metrics.signedAt || null,
            hasSaidYes: metrics.hasSaidYes || false,
            yesClickedAt: metrics.yesClickedAt || null,
            totalNoBeforeYes: metrics.totalNoBeforeYes || null,
        });
    } catch (error) {
        console.error('Metrics fetch error:', error);
        return NextResponse.json({ error: 'Failed to fetch metrics' }, { status: 500 });
    }
}

// --- POST: Track events (no-click, yes-click, signature) ---
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { type, data } = body;
        const client = getWriteClient();

        if (!client) {
            console.warn('No SANITY_API_TOKEN found. Simulating metrics save.');
            return NextResponse.json({ success: true, simulated: true });
        }

        // Ensure the singleton document exists
        await client.createIfNotExists({
            _id: METRICS_DOC_ID,
            _type: 'metrics',
            noCount: 0,
            hasSigned: false,
            hasSaidYes: false,
        });

        switch (type) {
            case 'no-click': {
                // Increment the no-count
                await client
                    .patch(METRICS_DOC_ID)
                    .inc({ noCount: 1 })
                    .set({ lastNoClickAt: new Date().toISOString() })
                    .commit();

                return NextResponse.json({ success: true, event: 'no-click' });
            }

            case 'yes-click': {
                const noCountAtYes = data?.noCount || 0;

                await client
                    .patch(METRICS_DOC_ID)
                    .set({
                        hasSaidYes: true,
                        yesClickedAt: new Date().toISOString(),
                        totalNoBeforeYes: noCountAtYes,
                    })
                    .commit();

                // Send email notification
                await sendYesNotification(noCountAtYes);

                return NextResponse.json({ success: true, event: 'yes-click' });
            }

            case 'signature': {
                const signatureName = data?.name || 'Unknown';

                await client
                    .patch(METRICS_DOC_ID)
                    .set({
                        hasSigned: true,
                        signatureName: signatureName,
                        signedAt: new Date().toISOString(),
                    })
                    .commit();

                // Send signature notification too
                await sendSignatureNotification(signatureName);

                return NextResponse.json({ success: true, event: 'signature' });
            }

            default:
                return NextResponse.json({ error: 'Unknown event type' }, { status: 400 });
        }
    } catch (error) {
        console.error('Metrics save error:', error);
        return NextResponse.json({ error: 'Failed to save metrics' }, { status: 500 });
    }
}

// --- DELETE: Reset the no-count ---
export async function DELETE() {
    try {
        const client = getWriteClient();
        if (!client) {
            return NextResponse.json({ error: 'No API token configured' }, { status: 500 });
        }

        await client
            .patch(METRICS_DOC_ID)
            .set({ noCount: 0, lastNoClickAt: null })
            .commit();

        return NextResponse.json({ success: true, message: 'No-count reset to 0' });
    } catch (error) {
        console.error('Metrics reset error:', error);
        return NextResponse.json({ error: 'Failed to reset metrics' }, { status: 500 });
    }
}

// --- Email Notifications via Resend ---
async function sendYesNotification(noCount: number) {
    try {
        const apiKey = process.env.RESEND_API_KEY;
        const toEmail = process.env.NOTIFICATION_EMAIL;

        if (!apiKey || !toEmail) {
            console.warn('Resend not configured. Skipping email notification.');
            return;
        }

        const { Resend } = await import('resend');
        const resend = new Resend(apiKey);

        await resend.emails.send({
            from: 'Vally <onboarding@resend.dev>',
            to: toEmail,
            subject: '💍 SHE SAID YES! 🎉',
            html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 40px 20px; text-align: center;">
          <h1 style="font-size: 48px; margin-bottom: 10px;">🎉</h1>
          <h1 style="font-size: 32px; color: #ce1215; text-transform: uppercase; letter-spacing: 2px;">She Said Yes!</h1>
          <p style="font-size: 18px; color: #333; margin: 20px 0;">
            The moment you've been waiting for — she clicked <strong>"OKAY, ONE DATE"</strong>.
          </p>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="font-size: 14px; color: #666; margin: 0;">Times she clicked "No" before saying Yes:</p>
            <p style="font-size: 48px; font-weight: bold; color: #ce1215; margin: 10px 0;">${noCount}</p>
          </div>
          <p style="font-size: 14px; color: #999;">
            Sent from Vally at ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
          </p>
        </div>
      `,
        });
    } catch (error) {
        console.error('Failed to send yes notification email:', error);
    }
}

async function sendSignatureNotification(name: string) {
    try {
        const apiKey = process.env.RESEND_API_KEY;
        const toEmail = process.env.NOTIFICATION_EMAIL;

        if (!apiKey || !toEmail) return;

        const { Resend } = await import('resend');
        const resend = new Resend(apiKey);

        await resend.emails.send({
            from: 'Vally <onboarding@resend.dev>',
            to: toEmail,
            subject: '✍️ T&C Signed!',
            html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 40px 20px; text-align: center;">
          <h1 style="font-size: 48px; margin-bottom: 10px;">✍️</h1>
          <h1 style="font-size: 28px; color: #ce1215; text-transform: uppercase;">Terms & Conditions Signed</h1>
          <p style="font-size: 18px; color: #333; margin: 20px 0;">
            She signed with the name: <strong style="color: #ce1215;">"${name}"</strong>
          </p>
          <p style="font-size: 14px; color: #999;">
            Signed at ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
          </p>
        </div>
      `,
        });
    } catch (error) {
        console.error('Failed to send signature notification email:', error);
    }
}
