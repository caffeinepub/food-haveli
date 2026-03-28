# Food Haveli — Razorpay Pricing Integration

## Current State
Pricing section has 3 plans (Starter Free, Growth ₹999, Enterprise ₹2,499). The CTA buttons have no onClick handlers — clicking them does nothing.

## Requested Changes (Diff)

### Add
- Razorpay demo payment modal that opens when any pricing plan button is clicked
- Modal shows realistic Razorpay-branded checkout UI: plan name, amount, UPI/card/netbanking tabs, pay button
- On 'Pay Now' click: shows processing spinner → success screen with order ID, plan activation message, confetti effect
- For free plan: skip payment modal, show direct activation success screen
- RazorpayModal component in LandingPage.tsx

### Modify
- Pricing plan buttons: add onClick to open Razorpay modal with selected plan details

### Remove
- Nothing removed

## Implementation Plan
1. Add RazorpayModal component inside LandingPage.tsx with full UI
2. Wire plan buttons with onClick={()=>handlePlanSelect(plan)}
3. Modal: shows plan name + price, UPI/Card/Netbanking tabs, realistic form fields, pay button
4. Payment flow: Processing state (2s) → Success state with unique order ID
5. Free plan: instant success on button click
