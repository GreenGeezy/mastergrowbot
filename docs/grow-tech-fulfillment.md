# MasterGrowbot AI Grow Tech Fulfillment

## Whop Checkout Link Setup

For each Whop checkout link:

- Go to Whop Dashboard > Checkout links > Create checkout link.
- Product type must be one-time payment.
- Turn Advanced options ON.
- Turn Ask questions before checkout ON.
- Turn Redirect after checkout ON.
- Keep Add a waitlist OFF.
- Keep 3D Secure on Account default.
- Keep Accept local currency payments ON.
- Keep included apps OFF unless intentionally needed.

Use the same redirect URL for all 4 checkout links:

```text
https://www.mastergrowbot.com/grow-tech/thank-you
```

## Required Whop Checkout Questions

Use these questions for every Grow Tech checkout link:

1. Delivery name
   Placeholder: John Smith
   Optional: No

2. Delivery address
   Placeholder: 123 Main St, Apt 4B, Denver, CO 80202
   Optional: No

3. Country and delivery phone
   Placeholder: United States, 555-555-5555
   Optional: No

## Customer-Facing Trust Copy

Use this trust positioning on the Grow Tech sales page and in order support messages:

- Secure checkout powered by Whop.
- 100% free shipping.
- Cards, Apple Pay, and local payment methods supported.
- Delivery details collected at checkout.
- Tracking sent after dispatch.
- Order support included through support@mastergrowbot.com.

The third-party supplier disclosure should be displayed in the FAQ, shipping area, or final legal note. Do not place supplier disclosure directly under Buy buttons, because high-intent CTA areas should focus on secure checkout, delivery details, tracking, and support.

Preferred supplier disclosure:

```text
Orders are prepared through our supplier network. Shipping speed, packaging, and carrier updates may vary by destination, and tracking details are sent after dispatch.
```

Support email:
[support@mastergrowbot.com](mailto:support@mastergrowbot.com)

## Customer FAQ

### When do I get tracking?

Tracking is sent by email or Whop support message after supplier dispatch. Tracking can take 24 to 72 hours to update after the carrier receives the package.

### Where do I enter my delivery address?

Delivery details are collected during Whop checkout before payment.

### Do I need another app to use these products?

The Scout Camera and Soil Health Meter do not require another app. The Environment Monitor has a built-in display for readings. Optional supplier app features may exist, but MasterGrowbot AI is the only app positioned on this page.

### Do these tools diagnose plant problems?

No. These tools help capture better plant images and grow context. Upload clear photos and relevant grow details into MasterGrowbot AI for plant health analysis and grow guidance.

### Who do I contact for help with my order?

Email [support@mastergrowbot.com](mailto:support@mastergrowbot.com) and one of our dedicated team members will get back to you shortly.

## Checkout 1

Name:
MasterGrowbot AI Scout Camera 10-20X

Headline:
Upgrade your plant photos before AI analysis

Price:
$149

Description:
Clip a 10-20X phone camera lens onto your iPhone or Android phone to capture sharper close-up plant photos before uploading them into MasterGrowbot AI. Best for leaves, stems, buds, pest damage, trichomes, grow journal photos, and better AI scan inputs.

Includes:
100% free shipping.
Tracking sent after supplier dispatch.
This product helps capture better plant images but does not diagnose plant issues by itself.

## Checkout 2

Name:
MasterGrowbot AI Environment Monitor

Headline:
Monitor grow-room air, temperature, and humidity

Price:
$89

Description:
Track grow-room temperature, humidity, CO2, air quality, particulates, and VOC context before asking MasterGrowbot AI for plant health guidance. This rechargeable environment monitor gives growers a quick way to document grow-room conditions alongside plant photos and grow journal notes.

Includes:
100% free shipping.
Tracking sent after supplier dispatch.
This product helps monitor grow-room conditions but does not diagnose plant issues by itself.

## Checkout 3

Name:
MasterGrowbot AI Soil Health Meter 6-in-1

Headline:
Check soil, light, and grow context before AI scans

Price:
$59

Description:
A 6-in-1 digital soil detector for checking soil moisture, pH, temperature, fertility, light, and air humidity context before asking MasterGrowbot AI for plant health guidance. Built for better watering decisions, grow journal notes, and stronger AI scan context.

Includes:
100% free shipping.
Tracking sent after supplier dispatch.
This product helps collect grow context but does not diagnose plant issues by itself.

## Checkout 4

Name:
MasterGrowbot AI Grow Tech Kit

Headline:
Complete grow tech setup, save $50

Price:
$247

Description:
Includes the MasterGrowbot AI Scout Camera 10-20X, Environment Monitor, and Soil Health Meter 6-in-1. Built for growers who want better plant photos, better environment data, and better soil and light context for MasterGrowbot AI.

Includes:
100% free shipping.
Save $50 versus buying individually.
Tracking sent after supplier dispatch.
These products help capture better plant images and grow context but do not diagnose plant issues by themselves.

## Purchase Confirmation Support Message

```text
Hey {recipient_name},

Thank you for your MasterGrowbot AI Grow Tech order.

We received your purchase and are preparing your product for shipment. You will receive a follow-up message with your tracking number once the supplier confirms dispatch.

Order item: {whop_name}

Please check your inbox and spam folder for your receipt and order updates. If your delivery address needs to be updated, reply here as soon as possible.

Thank you,
MasterGrowbot AI
```

## Tracking Support Message

```text
Hey {recipient_name},

Your MasterGrowbot AI Grow Tech order has shipped.

Tracking number: [TRACKING NUMBER]
Carrier/tracking link: [TRACKING LINK]

Tracking can take 24 to 72 hours to update after the supplier creates the label.

Thank you,
MasterGrowbot AI
```

## Fulfillment Steps For Admin

1. Check Whop Dashboard > Payments for new paid orders.
2. Open the Whop checkout answers and copy the customer's delivery details.
3. Order the correct product from AliExpress using the customer's delivery details.
4. Message the AliExpress seller:
   Please do not include invoices, pricing, promotional inserts, supplier marketing materials, or any receipt in the package. Thank you.
5. Save tracking number when available.
6. Send tracking message through Whop support chat or email.

## Future Webhook Note

Do not implement webhooks today unless the project already has a safe Whop webhook pattern.

If webhooks are implemented later, they must verify signatures, handle `payment.succeeded`, return 200 quickly, and be idempotent.
