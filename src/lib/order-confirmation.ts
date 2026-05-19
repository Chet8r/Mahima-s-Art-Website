import "server-only";
import { Resend } from "resend";

const CLOUDINARY_CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

function publicImageUrl(publicId: string): string | undefined {
  if (publicId.startsWith("placeholder/")) {
    const seed = publicId.replace("placeholder/", "");
    return `https://picsum.photos/seed/${seed}/400/500`;
  }
  if (!CLOUDINARY_CLOUD) return undefined;
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD}/image/upload/c_fill,w_400,h_500,f_auto,q_auto/${publicId}`;
}

export type OrderConfirmationInput = {
  buyerEmail: string;
  buyerName: string | null;
  buyerPhone: string | null;
  shippingAddress: string[] | null;
  shippingOption: string | null;
  amountPaidPence: number;
  // Stripe Payment Intent ID (pi_...). Used as the order reference because
  // Stripe's dashboard search resolves these but not Checkout Session IDs.
  paymentIntentId: string;
  artworks: {
    title: string;
    pricePence: number;
    imagePublicId: string | null;
  }[];
};

function orderReference(paymentIntentId: string): string {
  // Strip the "pi_" prefix and any "_test" suffix variants, then take the
  // last 8 chars uppercased. Works for both live (pi_3ABC...) and test
  // (pi_3TYt...) IDs.
  return paymentIntentId.slice(-8).toUpperCase();
}

function escape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatGbp(pence: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 2,
  }).format(pence / 100);
}

export async function sendOrderConfirmation(
  input: OrderConfirmationInput,
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!apiKey || !from) {
    console.error("Order confirmation skipped - Resend not configured");
    return;
  }

  const reference = orderReference(input.paymentIntentId);

  const artworkBlocks = input.artworks
    .map((a) => {
      const img = a.imagePublicId ? publicImageUrl(a.imagePublicId) : undefined;
      return `
        <tr>
          ${
            img
              ? `<td style="width: 80px; padding: 8px 12px 8px 0;">
                  <img src="${img}" alt="" width="64" style="display:block; width:64px; height:80px; object-fit:cover;" />
                </td>`
              : ""
          }
          <td style="padding: 8px 0;">
            <div style="font-family: Georgia, serif; font-size: 16px; color: #0b2545;">${escape(a.title)}</div>
            <div style="font-size: 12px; color: #6b6f76; margin-top: 4px;">Original · 1 of 1</div>
          </td>
          <td style="padding: 8px 0; text-align: right; font-size: 14px; color: #0b2545; white-space: nowrap;">
            ${formatGbp(a.pricePence)}
          </td>
        </tr>
      `;
    })
    .join("");

  const addressBlock = input.shippingAddress
    ? input.shippingAddress
        .filter(Boolean)
        .map((l) => escape(l))
        .join("<br>")
    : "(not provided)";

  const html = `
    <div style="font-family: Inter, system-ui, -apple-system, sans-serif; max-width: 560px; margin: 0 auto; color: #1a1a1a; background: #faf7f2; padding: 32px;">
      <div style="text-align: center; margin-bottom: 32px;">
        <div style="font-family: Georgia, serif; font-size: 28px; color: #0b2545;">Mahi <i style="color:#1e3a66;">Art</i></div>
      </div>

      <h1 style="font-family: Georgia, serif; font-size: 24px; color: #0b2545; margin: 0 0 8px;">
        Thank you${input.buyerName ? `, ${escape(input.buyerName)}` : ""}.
      </h1>
      <p style="font-size: 12px; color: #6b6f76; letter-spacing: 0.06em; margin: 0 0 16px;">
        Order reference <strong style="color: #0b2545; letter-spacing: 0.1em;">${reference}</strong>
      </p>
      <p style="font-size: 14px; line-height: 1.6; color: #1a1a1a; margin: 0 0 24px;">
        Your order is confirmed. Mahi will be in touch within a couple of days about shipping.
        Each piece is hand-packed for transit.
      </p>

      <div style="background: white; border: 1px solid #e7e1d4; padding: 16px 20px; margin-bottom: 24px;">
        <table style="width:100%; border-collapse: collapse;">
          ${artworkBlocks}
          <tr><td colspan="3" style="border-top: 1px solid #e7e1d4; padding-top: 12px;"></td></tr>
          <tr>
            <td colspan="2" style="padding: 6px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1.2px; color: #6b6f76;">
              Total paid
            </td>
            <td style="padding: 6px 0; font-size: 16px; color: #0b2545; text-align: right;">
              ${formatGbp(input.amountPaidPence)}
            </td>
          </tr>
        </table>
      </div>

      <div style="background: white; border: 1px solid #e7e1d4; padding: 16px 20px; margin-bottom: 24px; font-size: 13px; line-height: 1.6;">
        <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #d8b863; margin-bottom: 6px;">Shipping to</div>
        ${addressBlock}
        ${
          input.shippingOption
            ? `<div style="margin-top: 10px; font-size: 12px; color: #6b6f76;">${escape(input.shippingOption)}</div>`
            : ""
        }
      </div>

      <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e7e1d4; font-size: 11px; color: #6b6f76; text-align: center;">
        Mahi Art · shopmahiart.com
      </div>
    </div>
  `.trim();

  const text = [
    `Thank you${input.buyerName ? `, ${input.buyerName}` : ""}.`,
    ``,
    `Order reference: ${reference}`,
    ``,
    `Your order is confirmed. Mahi will be in touch within a couple of days about shipping.`,
    ``,
    `Items:`,
    ...input.artworks.map((a) => `  · ${a.title} - ${formatGbp(a.pricePence)}`),
    ``,
    `Total paid: ${formatGbp(input.amountPaidPence)}`,
    ``,
    `Shipping to:`,
    input.shippingAddress?.filter(Boolean).join("\n") ?? "(not provided)",
    input.shippingOption ? `\nShipping option: ${input.shippingOption}` : "",
    ``,
    `Mahi Art · shopmahiart.com`,
  ].join("\n");

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to: input.buyerEmail,
      replyTo: process.env.CONTACT_TO_EMAIL,
      subject: `Your Mahi Art order [${reference}]`,
      html,
      text,
    });
    if (error) {
      console.error("Order confirmation Resend error", error);
    }
  } catch (e) {
    console.error("Order confirmation send exception", e);
  }
}

export async function sendArtistSaleNotification(
  input: OrderConfirmationInput,
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !from || !to) {
    console.error("Artist notification skipped - Resend not configured");
    return;
  }

  const itemRows = input.artworks
    .map(
      (a) => `
        <tr>
          <td style="padding: 6px 0; font-family: Georgia, serif; font-size: 15px; color: #0b2545;">
            ${escape(a.title)}
          </td>
          <td style="padding: 6px 0; text-align: right; font-size: 14px; color: #0b2545; white-space: nowrap;">
            ${formatGbp(a.pricePence)}
          </td>
        </tr>
      `,
    )
    .join("");

  const addressBlock = input.shippingAddress
    ? input.shippingAddress
        .filter(Boolean)
        .map((l) => escape(l))
        .join("<br>")
    : "(not provided)";

  const reference = orderReference(input.paymentIntentId);
  const itemsSummary = input.artworks.map((a) => a.title).join(", ");

  const subject = `🟢 New order ${reference} - ${itemsSummary} (${formatGbp(input.amountPaidPence)})`;

  const html = `
    <div style="font-family: Inter, system-ui, -apple-system, sans-serif; max-width: 560px; margin: 0 auto; color: #1a1a1a; background: #faf7f2; padding: 32px;">
      <h1 style="font-family: Georgia, serif; font-size: 22px; color: #0b2545; margin: 0 0 4px;">
        New order ${reference}
      </h1>
      <p style="font-size: 13px; color: #6b6f76; margin: 0 0 24px;">
        Payment confirmed via Stripe.
      </p>

      <div style="background: white; border: 1px solid #e7e1d4; padding: 16px 20px; margin-bottom: 16px;">
        <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #d8b863; margin-bottom: 10px;">Items</div>
        <table style="width:100%; border-collapse: collapse;">
          ${itemRows}
          <tr><td colspan="2" style="border-top: 1px solid #e7e1d4; padding-top: 10px;"></td></tr>
          <tr>
            <td style="padding: 6px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1.2px; color: #6b6f76;">
              Total charged
            </td>
            <td style="padding: 6px 0; font-size: 16px; color: #0b2545; text-align: right;">
              ${formatGbp(input.amountPaidPence)}
            </td>
          </tr>
        </table>
      </div>

      <div style="background: white; border: 1px solid #e7e1d4; padding: 16px 20px; margin-bottom: 16px; font-size: 13px; line-height: 1.6;">
        <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #d8b863; margin-bottom: 6px;">Buyer</div>
        ${input.buyerName ? `${escape(input.buyerName)}<br>` : ""}
        <a href="mailto:${escape(input.buyerEmail)}" style="color: #0b2545;">${escape(input.buyerEmail)}</a>
        ${input.buyerPhone ? `<br>${escape(input.buyerPhone)}` : ""}
      </div>

      <div style="background: white; border: 1px solid #e7e1d4; padding: 16px 20px; margin-bottom: 16px; font-size: 13px; line-height: 1.6;">
        <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #d8b863; margin-bottom: 6px;">Ship to</div>
        ${addressBlock}
        ${input.shippingOption ? `<div style="margin-top: 10px; font-size: 12px; color: #6b6f76;">${escape(input.shippingOption)}</div>` : ""}
      </div>

      <p style="font-size: 12px; color: #6b6f76; margin: 24px 0 0;">
        Stripe payment: <code>${escape(input.paymentIntentId)}</code>
      </p>
    </div>
  `.trim();

  const text = [
    `New order ${reference}`,
    `Payment confirmed via Stripe.`,
    ``,
    `ITEMS`,
    ...input.artworks.map((a) => `  · ${a.title} - ${formatGbp(a.pricePence)}`),
    ``,
    `TOTAL CHARGED  ${formatGbp(input.amountPaidPence)}`,
    ``,
    `BUYER`,
    input.buyerName ?? "(no name)",
    input.buyerEmail,
    input.buyerPhone ?? "(no phone)",
    ``,
    `SHIP TO`,
    input.shippingAddress?.filter(Boolean).join("\n") ?? "(not provided)",
    input.shippingOption ? `\nSHIPPING  ${input.shippingOption}` : "",
    ``,
    `Stripe payment: ${input.paymentIntentId}`,
  ].join("\n");

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: input.buyerEmail,
      subject,
      html,
      text,
    });
    if (error) {
      console.error("Artist notification Resend error", error);
    }
  } catch (e) {
    console.error("Artist notification send exception", e);
  }
}
