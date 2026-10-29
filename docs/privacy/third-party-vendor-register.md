# Rayida Tech — Third-Party Vendor & Sub-processor Register
**Framework:** Nigeria Data Protection Act (NDPA) 2023, Sections 39 & 41  
**Last Updated:** October 29, 2026  
**Auditor:** Technical Compliance Desk  

---

## 1. Register Overview
This register records every external service provider and sub-processor engaged by Rayida Tech that interacts with or processes application data.

---

## 2. Vendor Inventory

| Vendor Name | Service Provided | Personal Data Processed | Location / Processing Region | Transfer Safeguards (NDPA Part VIII) | Cookie or Browser Storage Used | Privacy Notice / Terms |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Supabase Inc.** | Managed PostgreSQL Database & User Authentication | Contact inquiries, subscriber emails, visitor logs, encrypted admin credentials | Frankfurt (eu-central-1) / US East (AWS) | Standard Contractual Clauses, AES-256 encryption at rest | HTTP session cookies (`sb-*-auth-token`) for admin panel only | https://supabase.com/privacy |
| **Resend Inc.** | Transactional Outbound Email API Gateway | Sender email, recipient email, inquiry subject, message text | Ireland / EU (eu-west-1) | Standard Contractual Clauses, TLS 1.3 encryption in transit | None (REST API called server-side only) | https://resend.com/legal/privacy-policy |
| **Zoho Corporation** | Corporate Email Hosting (`info@rayidatech.name.ng`) | Email correspondence, attachments, inquiry replies | EU / Global Data Centers | Standard Contractual Clauses, TLS 1.3 in transit | Standard webmail cookies when accessing Zoho interface | https://www.zoho.com/privacy.html |
| **Vercel Inc.** | Application Hosting, Edge Middleware, SSL Routing | Server request logs, IP addresses (ephemeral), user-agent headers | Global Edge Network / USA | Standard Contractual Clauses, SOC 2 Type II certified infrastructure | None deployed to public visitors by Vercel | https://vercel.com/legal/privacy-policy |
| **ipwhois.app / freeipapi** | Geolocation Lookup for Analytics | Anonymous IP addresses for city/country resolution | Global API Endpoints | Ephemeral lookup; no persistent account or profile storage | None (only queried if user consents to analytics cookies) | Public API privacy policies |

---

## 3. Review Frequency
This register is audited **bi-annually** or immediately whenever a new third-party dependency, SDK, or cloud infrastructure provider is evaluated for integration.
