# CiteContext MCP Server

[![npm version](https://img.shields.io/npm/v/citecontext-mcp.svg?style=flat-square&color=gold)](https://www.npmjs.com/package/citecontext-mcp)
[![npm downloads](https://img.shields.io/npm/dm/citecontext-mcp.svg?style=flat-square)](https://www.npmjs.com/package/citecontext-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![Smithery](https://smithery.ai/badge/citecontext-mcp)](https://smithery.ai/server/citecontext-mcp)

The official **Model Context Protocol (MCP)** server for [CiteContext](https://citecontext.com) — the autonomous Generative Engine Optimization (GEO) platform.

Equip your AI coding agent (Cursor, Claude Desktop, Windsurf, Claude Code) with tools to audit website citability, diagnose AI search crawler blockers, generate compliant `/llms.txt` context indexes, validate Schema.org JSON-LD structured data, and deploy remediation Pull Requests autonomously.

---

## ⚡ Quickstart

No build steps or global installs required. Run directly via `npx`:

```bash
npx -y citecontext-mcp
```

---

## 📦 Installation & Setup

### 1. Cursor IDE

Add the server to your project or user `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "citecontext": {
      "command": "npx",
      "args": ["-y", "citecontext-mcp"],
      "env": {
        "CITECONTEXT_API_KEY": "ctx_live_your_api_key_here"
      }
    }
  }
}
```

> **Note:** `CITECONTEXT_API_KEY` is optional for public audit & generation tools. Set it to unlock authenticated workspace features and automated GitHub PR remediations.

### 2. Claude Desktop

Add to your `claude_desktop_config.json`:

* **macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
* **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "citecontext": {
      "command": "npx",
      "args": ["-y", "citecontext-mcp"]
    }
  }
}
```

### 3. Smithery CLI

Install automatically via [Smithery](https://smithery.ai/server/citecontext-mcp):

```bash
npx -y @smithery/cli install citecontext-mcp --client claude
```

### 4. Windsurf

Add to `~/.codeium/windsurf/mcp_config.json`:

```json
{
  "mcpServers": {
    "citecontext": {
      "command": "npx",
      "args": ["-y", "citecontext-mcp"]
    }
  }
}
```

---

## 🛠️ Included Tools

The CiteContext MCP server provides 18 specialized Generative Engine Optimization tools:

### Public Tools (Zero configuration required)

| Tool | Description |
|---|---|
| `geo_audit_domain` | Run a comprehensive 8-category Generative Engine Optimization audit on any website domain. |
| `check_ai_bot_access` | Check whether real-time citation bots (`OAI-SearchBot`, `Claude-SearchBot`, `PerplexityBot`, `Google-Extended`) are permitted by `robots.txt`. |
| `generate_robots_txt` | Generate an AI-optimized `robots.txt` that explicitly welcomes citation engines while controlling mass model scrapers. |
| `generate_llms_txt` | Generate compliant, token-efficient `/llms.txt` and `/llms-full.txt` files from a sitemap or website root. |
| `generate_schema_json` | Generate verified Schema.org `SoftwareApplication` or `Organization` JSON-LD markup with authenticated `sameAs` entity links. |
| `audit_page_geo` | Deep page-level inspection of Princeton KDD factual density, heading hierarchy, and citation readiness. |
| `get_remediation_patch` | Generate drop-in code patches for Next.js, Astro, Remix, Hugo, or generic HTML sites. |
| `search` / `fetch` | Query the CiteContext GEO and AI search knowledge base directly within AI research workflows. |

### Workspace Tools (Requires `CITECONTEXT_API_KEY`)

| Tool | Description |
|---|---|
| `deploy_github_pr` | Open an automated Pull Request directly on target GitHub repositories with verified GEO remediations. |
| `get_ai_search_visibility` | Track brand mention frequency and sentiment across ChatGPT Search, Claude, and Gemini. |
| `get_ai_search_cited_sources` | Identify which external reference domains AI models cite for target category queries. |
| `track_competitor_generative_gap`| Conduct head-to-head generative engine comparisons against competitors. |
| `client_prompts` | Manage workspace target prompt libraries with visibility trend monitoring. |
| `discover_prompts` | Discover high-intent buyer prompts across commercial evaluation and head-to-head comparison pillars. |
| `analyze_agent_logs` | Inspect raw server access logs for AI crawler request rates, status codes, and crawl behavior. |

---

## 🔑 Environment Variables

| Variable | Description | Default |
|---|---|---|
| `CITECONTEXT_API_KEY` | Workspace API key for authenticated client tools & automated PR creation | *None (optional)* |
| `CITECONTEXT_API_URL` | CiteContext backend gateway URL | `https://citecontext.com/api/mcp/run` |

---

## 🔒 Security & Privacy

* **Zero Local Dependencies:** Written in standard Node.js (v18+) without third-party package dependencies.
* **Non-Invasive:** Does not inspect local files or credentials outside explicit user tool invocations.
* **Safe Remote Transport:** Connects over HTTPS to CiteContext's secured API gateway.

---

## 📄 License

MIT &copy; [CiteContext Systems](https://citecontext.com)
