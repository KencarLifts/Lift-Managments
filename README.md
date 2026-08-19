# LiftOps Elevator Management PWA

Responsive English-language prototype for elevator fleet, order, installation, maintenance/service, remote-call access, user and activity management.

## Run locally

A service worker requires HTTP(S), so do not open `index.html` directly if you want PWA/offline behavior.

```bash
cd elevator-management-pwa
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

### Demo accounts
- Administrator: `admin@liftops.local` / `admin123`
- Manager: `manager@liftops.local` / `manager123`
- Technician: `tech@liftops.local` / `tech123`

## Included
- Elevator list, search, add/edit/delete, Online/Offline status and direct toggle
- Elevator Code derived from FactoryNO and visible only to Administrator/Manager
- Use Type with automatic inspection scheduling
- Dashboard Total / Online / Offline counters
- JSON import/export for Administrator/Manager
- Order Process and Installation workflows
- Maintenance & Service records with embedded automatic generated-jobs dashboard/table and assignment workflow
- Remote Call page with per-elevator web links and per-technician access control
- Administrator / Manager / Technician role behavior and account approvals
- 30-minute idle session timeout
- Activity log
- Responsive mobile layout
- Installable Android/desktop PWA with home-screen icon and offline cache
- Browser `localStorage` persistence

## Technician permissions

Technician accounts have **edit access only on Maintenance & Service**. They can add, edit, and delete maintenance/service records.

For Technician accounts:
- **Dashboard** — visible, read-only
- **Elevators** — visible, read-only; no Add, Edit, Delete, Import, Export JSON, or status toggle
- **Maintenance & Service** — visible and editable, including automatic generated jobs and assigned Service Records
- **Remote Call** — hidden by default; can be granted separately from User Management by a Manager or Administrator
- **Order Process** — hidden
- **Installation** — hidden
- **User Management** — hidden
- **Activity Log** — hidden

Direct navigation to a hidden Technician page is also blocked and returns to Dashboard.

## Maintenance Technician field

The `Technician` field in Add/Edit Maintenance / Service Record is a dropdown instead of free text.

- When a **Technician** is signed in, the dropdown contains only the currently logged-in technician. The saved record is enforced to that account name.
- When an **Administrator** or **Manager** is signed in, the dropdown can select any account name stored in User Management.

## Inspection and preventive-maintenance scheduling

`Use type` controls the next inspection date:
- `Commercial` — Last annual inspection date + **6 calendar months**
- `Domestic` — Last annual inspection date + **12 calendar months**

Preventive maintenance uses the **newer** of:
- the elevator's latest Maintenance & Service `Service date`, or
- the elevator master-data `Last maintenance contract date`.

It then applies `Services per year`. Examples:
- 6 services/year = every 2 months
- 12 services/year = every 1 month

The former **Next Jobs page has been removed**. Its generated-job counters, search, job-type/status filters, scheduling explanation, and job table are now inside **Maintenance & Service**.

Generated jobs are:
- **Inspection support** — due on the calculated next annual inspection date
- **Preventive maintenance** — due from the latest applicable maintenance base date and Services per year

### Generated-job assignment

The **Accept** button is visible to Administrator, Manager, and Technician accounts:
- A **Technician** accepts directly to their own account. The job is removed from the automatic queue and becomes a `Pending` Service Record with that technician name.
- A **Manager** or **Administrator** must select an approved Technician account. The job is then removed from the automatic queue and becomes a `Pending` Service Record assigned to that technician.
- Service Records created from generated jobs carry an account assignment and are visible only to the assigned Technician plus Manager / Administrator accounts. Manually created service records keep their normal visibility.
- Deleting an assigned generated Service Record releases its source job so the automatic job can appear again if its scheduling conditions still apply.

## Elevator Code

`Elevator Code` is read-only and visible only to **Administrator** and **Manager** accounts:

`Elevator Code = 2000 + first 2 digits + last 3 digits of FactoryNO`

Example: `F-2024-001` → digits `2024001` → `2000 + 20 + 001 = 2021`.

## Android: Add LiftOps to the Home screen

For Android installation, serve the site over **HTTPS** (or `http://localhost` during local development). In Chrome on Android:

1. Open the LiftOps site.
2. Tap **Install LiftOps on this device** on the sign-in screen or **Install app** after signing in.
3. Confirm the Android installation prompt.

If Chrome does not show the automatic prompt, open the Chrome menu (⋮) and choose **Install app** or **Add to Home screen**.

## Production security note

This remains a front-end prototype. For production, move authentication, authorization, audit logging and elevator data to a secured backend/database. Use server-side role checks, password hashing, secure/HttpOnly sessions or an identity provider, HTTPS, input validation, rate limiting, backup/retention controls, and tamper-resistant audit logs. Do not store real passwords or sensitive production data in browser `localStorage`.


## Remote Call

Each elevator has a `Remote call` URL parameter. Administrator and Manager accounts can edit it from **Elevators → Edit Elevator**. The URL is not shown in the Technician elevator master-data view.

The **Remote Call** page:
- is always available to Administrator and Manager accounts;
- can be granted/revoked separately for each Technician from **User Management**;
- places the elevator dropdown and configured Remote call URL in the sidebar menu;
- loads the selected URL in an embedded frame that uses nearly all of the main content height;
- also provides an **Open** link because some remote systems block iframe embedding or HTTP content inside an HTTPS PWA.

In **User Management**, each Technician row has a **Grant access / Revoke access** button for Remote Call.

## Revision: assignment, remote call, and conditional service date

- Automatic generated jobs have an **Accept** action for all three roles.
- Generated jobs move into Service Records when accepted/assigned.
- Assigned generated Service Records are visible only to the assigned Technician and Manager / Administrator accounts.
- **Next service date** remains visible only when `Service type = Preventive inspection`.
- Technician navigation continues to hide **Order Process**, **Installation**, **User Management**, and **Activity Log**.
- Technician Remote Call access is a separate permission and is disabled by default.


## Revision v9

- Assigned generated jobs are visible to the assigned Technician and all Manager / Administrator accounts. Other Technician accounts cannot view or open them.
- The Remote Call elevator selector and external link were moved into the sidebar menu, leaving the main Remote Call page primarily for the embedded controller interface.
