# Rayida Tech — Master Data Inventory & RoPA (Record of Processing Activities)
**Framework:** Nigeria Data Protection Act (NDPA) 2023, Section 24 & NDPC Guidelines  
**Last Updated:** October 29, 2026  
**Document Owner:** Privacy Architecture & Engineering Desk  
**Contact:** info@rayidatech.name.ng  

---

## 1. Executive Summary
This document establishes the verified Record of Processing Activities (RoPA) for Rayida Tech. It maps all personal data flows, collection points, storage locations, legal bases, sub-processors, and retention schedules derived directly from the application codebase (`rayidatech.name.ng`).

---

## 2. Personal Data Mapping Matrix

| Ref ID | Data Category | Specific Data Elements | Collection Point | Processing Purpose | Lawful Basis (NDPA 2023) | Storage Location | Sub-processors / Third Parties | Retention Period | Security Safeguards |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **D-01** | **Contact Inquiries** | Full Name, Email, Phone/WhatsApp, Company, Project Brief, Budget Range, Submission Timestamp | Website Contact Form (`/contact`), Direct Email (`info@rayidatech.name.ng`) | Project evaluation, scoping, proposals, customer communication | **Contractual Necessity** (NDPA Sec. 25(1)(b)) | Supabase PostgreSQL (`public.contacts`), Zoho Mail Server | Supabase Inc., Zoho Corp., Resend Inc. | 12 months for uncontracted inquiries; 6 years for executed client contracts | TLS 1.3 in transit, AES-256 at rest, RLS row isolation, header sanitization |
| **D-02** | **Newsletter Subscriptions** | Email Address, Subscription Timestamp | Homepage & Blog Newsletter Inputs | Disseminating technical articles, case studies, product announcements | **Explicit Consent** (NDPA Sec. 25(1)(a)) | Supabase PostgreSQL (`public.subscribers`) | Supabase Inc., Resend Inc. | Retained until user unsubscribes or revokes consent | Double-validation, instant unsubscription mechanism, RLS row isolation |
| **D-03** | **Technical Telemetry & Web Analytics** | IP Address, User-Agent, Device Type, Browser, OS, Screen Resolution, Referrer, Page Path, Dwell Time | `ActivityTracker.tsx` via Beacon / Fetch (`/api/track`) | Performance monitoring, network bottleneck diagnosis, DoS defense | **Consent** (NDPA Sec. 25(1)(a)) & **Legitimate Interests** (NDPA Sec. 25(1)(f)) | Supabase PostgreSQL (`public.visitor_logs`), browser `sessionStorage` | Supabase Inc., Vercel Inc., ipwhois.app | 90 days rolling window (automated truncation) | Analytics cookie gate (blocked until user consents), RLS locked to admins |
| **D-04** | **Administrative Credentials** | Admin Email, Password Hashes, Session Tokens, MFA State | Admin Login (`/admin/login`), Server Actions | Internal content management, portfolio updates, CRM inspection | **Contractual / Legitimate Interest** (NDPA Sec. 25(1)(f)) | Supabase Auth (`auth.users`), browser HTTP Cookies | Supabase Inc., Vercel Inc. | Duration of employment or administrative role | Argon2 / bcrypt password hashing, secure HTTP-only cookies, `requireAdminSession` server guard |
| **D-05** | **Client Project Data (Processor Role)** | Client customer accounts, transactional databases, vector embeddings, custom APIs | Enterprise software engagements, custom web/mobile apps | Fulfilling custom software development and cloud deployment contracts | **Contractual Necessity** (NDPA Sec. 25(1)(b)) & Client Instruction | Dedicated client cloud instances (AWS, Supabase, Vercel) | Defined per Statement of Work (SOW) | Specified in client Master Services Agreement / DPA | Role-based access, dedicated staging vs. production environments, API secrets vaults |

---

## 3. Storage & Infrastructure Architecture

- **Frontend & Edge Hosting:** Vercel Inc. (Global Edge Network)
- **Database Engine:** Supabase Inc. (Managed PostgreSQL on AWS eu-central-1 / us-east-1)
- **Transactional Email Gateway:** Resend Inc. (eu-west-1 region)
- **Inbound Business Email:** Zoho Mail (Zoho Corporation)
- **Client-Side Storage:**
  - `localStorage`: `theme`, `theme_version`, `rayida_cookie_consent`, `rayida_visitor_id` (only with consent)
  - `sessionStorage`: `rayida_session_id`, `rayida_client_geo` (only with consent)

---

## 4. Special Category Data
Rayida Tech **does not collect, process, or store** sensitive personal data as defined under Section 30 of the NDPA 2023 (e.g. genetic data, biometric identification, religious beliefs, political affiliations, sexual orientation, or health records) in its portfolio operations.
