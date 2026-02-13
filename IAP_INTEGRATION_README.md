# Dating App API Integration Guide

## In-App Purchases & Subscriptions

This document provides the necessary details for integrating In-App Purchases (IAP) and Subscriptions for both Android and iOS.

---

### 1. Subscription Products
| Plan | Product ID | Duration |
| :--- | :--- | :--- |
| **Monthly Subscription** | `sir_19_1m` | 1 Month |
| **Yearly Subscription** | `isr_199_1y` | 1 Year |

**Subscription Benefits:** 
- Unlimited approvals and rejections (removes the 20/day limit).

---

### 2. Coin Products (Consumable)
| Product Name | Product ID | Coins |
| :--- | :--- | :--- |
| **25 Coins Pack** | `com.dating.coins25` | 25 Coins |
| **50 Coins Pack** | `com.dating.coins50` | 50 Coins |

---

### 3. API Endpoints for Mobile Integration

#### A. Send Purchase Coins (Consumable)
**Endpoint:** `POST /api/v1/users/purchase-coins`  
**Description:** Call this after a successful coin purchase.

**Request Body:**
```json
{
  "productId": "com.dating.coins50",
  "transactionId": "GPA.3312-4451-...",
  "platform": "android",
  "purchaseToken": "token_from_google_play",
  "packageName": "com.dating.app"
}
```

#### B. Update Subscription (Auto-Renewable)
**Endpoint:** `POST /api/v1/users/update-subscription`  
**Description:** Call this after a successful subscription purchase or renewal.

**Request Body:**
```json
{
  "subscriptionId": "sir_19_1m",
  "purchaseToken": "token_from_google_play",
  "packageName": "com.dating.app",
  "platform": "ios"
}
```

#### C. Get Store Purchase History
**Endpoint:** `GET /api/v1/users/purchase-history`  
**Description:** Call this to get a full list of all IAPs and Subscriptions for the current user. Includes status (active/expired) and expiry dates.

---


### 4. Webhook (Server-to-Server) Callbacks

You must configure these URLs in your developer consoles to receive real-time updates.

#### **Apple App Store**
- **Callback URL:** `https://your-domain.com/api/v1/webhooks/apple`
- **Method:** `POST`
- **Setup:** Add this to "App Store Server Notifications URL" in App Store Connect.

#### **Google Play Store**
- **Callback URL:** `https://your-domain.com/api/v1/webhooks/google`
- **Method:** `POST`
- **Setup:** Add this to "Real-time Developer Notifications" in Google Play Console.

---

### 5. Interaction Quota
- **Non-Subscribed Users:** Limited to 20 interactions (approvals/rejections) per calendar day.
- **Subscribed Users:** Unlimited interactions until `subscriptionExpiry`.
