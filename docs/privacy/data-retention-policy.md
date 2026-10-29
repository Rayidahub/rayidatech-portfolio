# Rayida Tech — Data Retention & Disposal Policy
**Framework:** Nigeria Data Protection Act (NDPA) 2023, Section 24(1)(e) & NDPC Regulatory Guidance  
**Version:** 2026.1  
**Last Updated:** October 29, 2026  
**Contact:** info@rayidatech.name.ng  

---

## 1. Purpose & Core Principles
Personal data must not be kept for longer than is necessary for the purposes for which it is processed. This policy establishes binding operational retention limits, archiving standards, and secure deletion mechanisms across all Rayida Tech systems.

---

## 2. Retention Schedule by Record Category

### A. Contact Inquiries & Project Briefs (`public.contacts`)
- **Uncontracted Inquiries:** Retained for **12 months** from the date of submission. This allows follow-up communications on delayed project lifecycles. If no active contract materializes after 12 months, the record is automatically deleted.
- **Contracted Client Inquiries:** Transitioned to client contract records upon project kickoff.

### B. Client Contracts, SOWs, and Financial Invoices
- **Retention Period:** Retained for **6 years** following project completion and final contract sign-off.
- **Justification:** Statutory requirement under Nigerian tax and corporate compliance law (Companies and Allied Matters Act / Federal Inland Revenue Service requirements for commercial transactions).
- **Storage:** Encrypted cloud backup; access restricted to executive administration.

### C. Newsletter Subscribers (`public.subscribers`)
- **Retention Period:** Active until user initiates unsubscription or withdraws consent.
- **Disposal Action:** Upon receiving an unsubscribe request or email bounce notification, the record status is set to inactive and permanently purged during quarterly database cleanups.

### D. Visitor Logs & Telemetry (`public.visitor_logs`)
- **Retention Period:** Rolling **90-day retention window**.
- **Automated Purging:** An automated database maintenance task truncates records older than 90 days. Records older than 90 days cannot be retrieved.

### E. Admin User Accounts & Audit Trails (`auth.users`, `admin_users`)
- **Retention Period:** Active for the duration of the staff member or contractor's service with Rayida Tech.
- **Deprovisioning:** Revoked immediately upon contract termination; historical access audit logs retained for **24 months** for security forensic purposes.

---

## 3. Secure Deletion & Destruction Protocols
1. **Database Records:** Executed via parameterized SQL `DELETE` or cryptographically verified Supabase cascading purge, ensuring data cannot be restored from read replicas once purged.
2. **Local Browser Storage:** Users can clear consent, theme, and session identifiers via browser cache clear or via our interactive Cookie Preferences interface.
3. **Email Archives:** Inquiries in Zoho Mail are archived after 12 months and permanently deleted according to company email lifecycle rules.
