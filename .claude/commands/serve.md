---
name: serve
description: Start a local HTTP server on port 8000 to preview the static site. Use when the user asks to preview, view in browser, serve, or start a dev server.
---

# Serve the site locally

Start a Python HTTP server from the project root so the user can preview the static site at **http://localhost:8000**.

## Steps

1. Check whether port 8000 is already serving:
   ```
   lsof -ti :8000
   ```
   If a PID is returned, do **not** start a second server — skip to step 4 and report the URL.

2. Start the server in the background from the project root. Use the Bash tool with `run_in_background: true`:
   ```
   python3 -m http.server 8000
   ```

3. Verify it's up:
   ```
   curl -s -o /dev/null -w "%{http_code}" http://localhost:8000
   ```
   Expect `200`. If not, surface the curl output and stop.

4. Tell the user: **"Serving at http://localhost:8000 — refresh after edits to see changes."**

## To stop later

```
lsof -ti :8000 | xargs kill
```
