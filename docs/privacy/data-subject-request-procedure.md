# Rayida Tech — Data Subject Access Request (DSAR) Standard Operating Procedure
**Framework:** Nigeria Data Protection Act (NDPA) 2023, Part VI (Sections 34–38)  
**Version:** 2026.1  
**Last Updated:** October 29, 2026  
**Intake Desk:** info@rayidatech.name.ng  

---

## 1. Scope & Rights Supported
Under Part VI of the Nigeria Data Protection Act 2023, individuals (data subjects) possess statutory rights regarding their personal data. Rayida Tech supports requests for:
1. **Right of Access (Section 34):** Confirmation of processing and copies of personal data.
2. **Right to Rectification (Section 35):** Correction of inaccurate, out-of-date, or incomplete data.
3. **Right to Erasure / Deletion (Section 36):** Deletion of records where retention is no longer justified.
4. **Right to Restrict Processing (Section 37):** Temporary restriction of processing during accuracy reviews.
5. **Right to Object (Section 38):** Objection to processing based on legitimate interests or direct marketing.
6. **Right to Data Portability (Section 38):** Delivery of data in structured CSV or JSON formats.
7. **Right to Withdraw Consent:** Immediate cessation of consent-based processing.

---

## 2. Standard 5-Step DSAR Workflow

```
[ Step 1: Intake & Logging ] (Within 24 Hours)
             │
             ▼
[ Step 2: Identity Verification ] (Within 48 Hours)
             │
             ▼
[ Step 3: Information Retrieval & Review ] (Days 3–14)
             │
             ▼
[ Step 4: Redaction & Third-Party Protection ] (Days 15–20)
             │
             ▼
[ Step 5: Secure Resolution & Response Delivery ] (Max 30 Days)
```

---

## 3. Step-by-Step Procedure

### Step 1: Request Intake & Initial Logging
- All requests arriving via `info@rayidatech.name.ng` or formal letters must be logged in the internal DSAR Register within 24 hours.
- Record: Date received, requester name, contact email, request type, verification status, and 30-day statutory deadline.

### Step 2: Identity Verification
- To protect data subjects from identity theft and unauthorized disclosure, the compliance officer must verify that the requester is indeed the individual to whom the data relates.
- **Verification Method:** Confirm request originates from the verified email address associated with the inquiry or contract records. For sensitive requests, request secondary verification (e.g. proof of company domain ownership or phone confirmation).

### Step 3: Information Retrieval
- Search production repositories:
  - `public.contacts` (Supabase)
  - `public.subscribers` (Supabase)
  - `public.visitor_logs` (Supabase)
  - Zoho Mail correspondence archives
- Retrieve all associated records.

### Step 4: Third-Party Redaction
- Ensure that personal information belonging to third parties (other than the requester) is redacted prior to release.

### Step 5: Resolution & Response Delivery
- **Statutory Timeline:** Full response must be delivered within **30 calendar days** of receipt.
- If a request is exceptionally complex, a 30-day extension may be requested in writing before the initial 30 days expire, stating clear reasons.
- **Fees:** DSAR fulfillment is strictly **free of charge**, unless a request is manifestly unfounded or excessive, in which case a reasonable administrative fee may be assessed in consultation with NDPC rules.
- **Right to Complain:** Every DSAR response must inform the requester of their right to lodge a complaint with the **Nigeria Data Protection Commission (NDPC)** if they are unsatisfied with the resolution.
