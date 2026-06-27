# RoleRedesign

Analyse workforce roles and redesign them for an AI-augmented future. Designed for HR and OD leaders.

## Features

- **Two-Layer Access Gate:** Share code validation proxied via Cloudflare Worker, followed by a Telegram approval gate (/approve_sessionId).
- **Multi-Step Form:** 5 steps to collect context, team priorities, and staff tasks.
- **Excel Template Integration:** Download template, collect input, and upload back.
- **AI Analysis Chain:** Decomposes tasks, scores displacement risk (0–100), classifies tasks, and generates superpower narrative, tools, and upskilling priorities.
- **Function Shift Visuals:** Interactive radar and bar charts.

## Deployment

Pushed to `main` branch builds via GitHub Actions and deploys to `gh-pages` pointing to `redesign.buildjoynow.com`.

Cloudflare Worker handles KV session store, admin changes, and API calls.
