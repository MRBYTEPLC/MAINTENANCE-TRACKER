> ⚠️ **Disclaimer:** This project is provided for educational and prototyping purposes only. Read the full [LICENSE](LICENSE) before any production deployment.

# MaintTrack Pro — Serverless Shop-Floor Maintenance System 🏭📉

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Backend: Google Apps Script](https://img.shields.io/badge/Backend-Google%20Apps%20Script-4285F4?logo=google)](https://developers.google.com/apps-script)
[![Database: Google Sheets](https://img.shields.io/badge/Database-Google%20Sheets-34A853?logo=googlesheets)](https://sheets.google.com)
[![Status: Open Source](https://img.shields.io/badge/Status-Open%20Source-brightgreen)]()

---

## Project Overview

**MaintTrack Pro** is an open-source, serverless maintenance logging system designed for modern manufacturing facilities, assembly lines, and SMEs pursuing operational excellence.

It transforms any standard **Google Sheet** into a centralized, real-time maintenance database — eliminating paper trails and isolated Excel logs — through a lightweight **Google Apps Script** backend that acts as a zero-cost HTTP API gateway.

Engineering teams can instantly log machine breakdowns, track corrective and preventive actions, record safety work permits, and build structured datasets ready for **OEE** and **TPM** analysis.

---

## Core Objectives

| Goal | Description |
|---|---|
| **↓ MTTR** | Minimize Mean Time To Repair via instant digital breakdown logging |
| **📋 Standardized Diagnostics** | Classify machine faults with uniform industrial parameters |
| **🦺 Safety Enforcement** | Block task execution until safety permits (high voltage, hot work, confined spaces) are digitally cleared |
| **🔌 Frictionless Integration** | Plug-and-play compatibility with Google Apps Script (serverless) or FastAPI/Python backends |

---

## Architecture

```
[ Field Tablet / Mobile Device ]
         │
         │  HTTP POST (JSON payload)
         ▼
[ Google Apps Script Web App ]  ◄── Public endpoint (no auth server needed)
         │
         │  appendRow()
         ▼
[ Google Sheet — database_logs tab ]
         │
         ▼
[ Dashboard / OEE Reports / TPM Analysis ]
```

---

## Database Schema

Each POST request appends one row to the `database_logs` sheet with the following fields:

| Column | Field | Description |
|---|---|---|
| A | `timestamp` | Server-side auto-generated timestamp |
| B | `reporter_identity` | ID or name of the person reporting |
| C | `work_shift` | Active shift (Morning / Afternoon / Night) |
| D | `technician_name` | Assigned technician |
| E | `asset_id` | Machine or asset identifier |
| F | `process_area` | Plant area or production line |
| G | `failure_classification` | Fault type (Electrical / Mechanical / etc.) |
| H | `initial_symptom` | First observed symptom |
| I | `corrective_actions` | Actions taken to restore operation |
| J | `preventive_measures` | Follow-up actions to avoid recurrence |
| K | `spare_parts_availability` | Whether required parts were in stock |
| L | `requested_part_number` | Part number requested if out of stock |
| M | `response_time_stamp` | Time technician arrived at the asset |
| N | `startup_time_stamp` | Time asset returned to operation |
| O | `asset_final_status` | Operational / Pending / Scrapped |
| P | `engineering_notes` | Additional technical observations |
| Q | `calculated_downtime_min` | Total downtime in minutes |
| R | `active_permits` | Safety permits activated during the job |

---

## Deployment Guide

### Step 1 — Prepare your Google Sheet

1. Create a new Google Sheet at [sheets.google.com](https://sheets.google.com).
2. The backend will auto-create the `database_logs` tab with headers on first use. No manual setup needed.

---

### Step 2 — Inject the Backend Engine

1. Open your Google Sheet → top menu → **Extensions** → **Apps Script**.
2. Delete any default code in the editor.
3. Paste the full contents of [`src/Code.js`](src/Code.js).
4. Click the 💾 **Save** icon (or `Ctrl + S`).

---

### Step 3 — Deploy as a Public Web App

1. Click **Deploy** (top right) → **New Deployment**.
2. Click the ⚙️ gear icon → select **Web App**.
3. Set the following options:

| Setting | Value |
|---|---|
| Description | MaintTrack Production API |
| Execute as | **Me** (your-email@gmail.com) |
| Who has access | **Anyone** |

4. Click **Deploy** → authorize the permissions when prompted.
5. Copy the generated **Web App URL** — this is your private API endpoint.

> 💡 Every time you edit `Code.js`, click **Deploy → Manage Deployments → Edit → New Version** to push the update live.

---

### Step 4 — Connect your Frontend

In your frontend JavaScript, replace the placeholder URL with your Web App URL:

```javascript
const ENDPOINT = "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL";

const payload = {
  reporter_id: "ENG-045",
  shift:        "Morning",
  name:         "John Doe",
  machine:      "CNC-12",
  process:      "Machining Line A",
  classification: "Mechanical",
  symptom:      "Abnormal vibration on spindle",
  corrective:   "Replaced worn bearing SKF 6205",
  preventive:   "Schedule monthly lubrication check",
  spare:        "Yes",
  partnum:      "SKF-6205-2RS",
  response:     "07:42",
  startup:      "09:15",
  status:       "Operational",
  notes:        "Bearing showed fatigue signs — check adjacent units",
  downtime:     93,
  permits:      ["LOTO", "Hot Work"]
};

fetch(ENDPOINT, {
  method: "POST",
  body:   JSON.stringify(payload)
})
.then(res => res.json())
.then(data => console.log(data));
```

---

### Step 5 — Verify the Connection

Open your Web App URL directly in a browser. You should receive:

```json
{
  "status": "operational",
  "engine": "Google Apps Script Serverless Gateway",
  "timestamp": "2026-01-15T08:30:00.000Z"
}
```

---

## API Reference

### `POST /` — Log a Maintenance Event

**Request body (JSON):**

```json
{
  "reporter_id": "string",
  "shift":       "Morning | Afternoon | Night",
  "name":        "string",
  "machine":     "string",
  "process":     "string",
  "classification": "Electrical | Mechanical | Hydraulic | Software | Other",
  "symptom":     "string",
  "corrective":  "string",
  "preventive":  "string",
  "spare":       "Yes | No",
  "partnum":     "string | null",
  "response":    "HH:MM",
  "startup":     "HH:MM",
  "status":      "Operational | Pending | Scrapped",
  "notes":       "string | null",
  "downtime":    "number (minutes)",
  "permits":     ["LOTO", "Hot Work", "Confined Space", "Working at Height"]
}
```

**Success response:**
```json
{ "status": "success", "message": "Data successfully committed to Google Sheets Grid." }
```

**Error response:**
```json
{ "status": "error", "message": "Error description" }
```

### `GET /` — Health Check

Returns server status. Useful for monitoring that the deployment is live.

---

## Repository Structure

```
mainttrack-google-appsscript/
├── src/
│   └── Code.js          # Google Apps Script backend engine
├── .gitignore
├── LICENSE
└── README.md
```

---

## Roadmap

- [ ] Authentication layer (API key header validation)
- [ ] `doGet` endpoint to query logs by asset ID or date range
- [ ] FastAPI/Python alternative backend
- [ ] Power BI / Looker Studio dashboard template
- [ ] OEE auto-calculation formula sheet

---

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add: your feature description'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## License

Distributed under the **MIT License** with an Extended Industrial Disclaimer.  
See [LICENSE](LICENSE) for full terms before any production deployment.
