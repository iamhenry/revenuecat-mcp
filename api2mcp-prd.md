# Product Requirements Document (PRD)

## MCP → RevenueCat TypeScript Wrapper

### 1 · Purpose

Create a **local TypeScript CLI + library** that exposes the complete RevenueCat v2 REST surface (offerings, products, entitlements, packages, price experiments) through the **Model Context Protocol (MCP)** so AI agents, scripts, or developers can perform CRUD operations interactively inside **VS Code**.

### 2 · Background & Rationale

* **RevenueCat** is the de-facto backend for in-app subscriptions; teams want programmatic control for automation and CI.
* **Model Context Protocol (MCP)** offers a unified way to expose tools to LLMs & agents.
* Wrapping RevenueCat in MCP unlocks ChatGPT-like assistants, custom IDE commands, and pipeline integrations without re-implementing business logic.

### 3 · Goals

| #      | Goal                                                                                                        |
| :----- | ----------------------------------------------------------------------------------------------------------- |
| **G1** | Provide full CRUD coverage of RevenueCat v2 resources.                                                      |
| **G2** | Deliver a zero-setup CLI (`rc-mcp serve`) that runs locally and communicates via MCP (STDIO; SSE optional). |
| **G3** | Offer clear, typed request/response schemas for developers & LLMs.                                          |
| **G4** | Map RevenueCat errors to MCP-standard error codes.                                                          |
| **G5** | Package as both an **npm lib** and a **single-file executable**.                                            |

### 4 · Non-Goals

* No UI dashboards (future VS Code extension is stretch).
* No automated integration tests (manual interactive testing is acceptable).
* No support for RevenueCat v1 endpoints.

### 5 · Stakeholders

| Role              | Name/Description                               |
| ----------------- | ---------------------------------------------- |
| Primary Developer | Junior engineer implementing wrapper           |
| Product Owner     | Solutions Architect (you)                      |
| End Users         | Internal developers, LLM agents, build scripts |

### 6 · User Personas & Stories

| Persona       | Story (INVEST)                                                                    | Acceptance Test                                                        |
| ------------- | --------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| **DevCLI**    | As a developer, I run `rc-mcp serve` so my ChatGPT plugin can create an Offering. | Issuing MCP `CreateOffering` returns `200` w/ new Offering ID.         |
| **LLMAgent**  | As an AI agent, I call `ListEntitlements` to audit tiers.                         | `pageSize` + `cursor` iterate deterministically to `cursor=null`.      |
| **DevScript** | As a build script, I need clear error codes so failures halt CI.                  | A 429 from RevenueCat appears as MCP `RATE_LIMITED` with `retryAfter`. |

### 7 · Functional Requirements

#### 7.1 · Command Catalog

Each **resource** exposes **five commands**: `Create`, `Get`, `Update`, `Delete`, `List`.

| Resource | MCP Command      | RevenueCat v2 Endpoint   | Notes          |
| -------- | ---------------- | ------------------------ | -------------- |
| Offering | `CreateOffering` | `POST /offerings`        | —              |
|          | `GetOffering`    | `GET /offerings/{id}`    | —              |
|          | `UpdateOffering` | `PATCH /offerings/{id}`  | Partial update |
|          | `DeleteOffering` | `DELETE /offerings/{id}` | Hard delete    |
|          | `ListOfferings`  | `GET /offerings`         | Pagination     |

*Repeat identical command mapping for Entitlement, Product, Package, PriceExperiment.*

#### 7.2 · Transport

* **STDIO** newline-delimited JSON (default).
* Optional `--transport=sse` spins HTTP SSE server on `localhost:7777`.

#### 7.3 · Configuration

| Env Var                 | Required | Default                         | Description               |
| ----------------------- | -------- | ------------------------------- | ------------------------- |
| `REVENUECAT_SECRET_KEY` | ✔        | —                               | Bearer key for RevenueCat |
| `RC_API_URL`            | ✖        | `https://api.revenuecat.com/v2` | Override for sandbox      |

#### 7.4 · Error Mapping

| HTTP | MCP `error.code`   | Extra fields |
| ---- | ------------------ | ------------ |
| 400  | `VALIDATION_ERROR` | `details`    |
| 401  | `UNAUTHENTICATED`  | —            |
| 403  | `FORBIDDEN`        | —            |
| 404  | `NOT_FOUND`        | —            |
| 429  | `RATE_LIMITED`     | `retryAfter` |
| 500+ | `INTERNAL`         | —            |

#### 7.5 · Logging

* Use **Pino** JSON. Fields: `timestamp`, `level`, `reqId`, `command`, `durationMs`.
* `--verbose` prints HTTP bodies (redacts key).

#### 7.6 · Performance & Resilience

* Single-process concurrency (< 20 rps).
* Exponential back-off: 200 ms × 2^attempt (cap 2 s), 3 attempts.

### 8 · Non-Functional Requirements

| Area            | Requirement                                              |
| --------------- | -------------------------------------------------------- |
| Maintainability | Clean Architecture; 80 % TSDoc coverage.                 |
| Security        | Secret never logged; fail-fast if missing.               |
| Portability     | Node ≥ 18 on macOS, Linux, Windows.                      |
| Packaging       | `npm publish` and bundled binary (< 5 MB) via `esbuild`. |

### 9 · Technical Architecture Overview

```text
┌──────────┐       MCP JSON   ┌────────────────┐
│ LLM/IDE  │ ───▶ commands ─▶ │ Presentation   │
└──────────┘       results    │  (MCP Adapter) │
                              └──────┬─────────┘
                                     │ DTOs
                           Use-cases │
                                     ▼
                              ┌─────────────┐
                              │  Core Layer │
                              └────┬────────┘
                                   │ Port
                                   ▼
                              ┌─────────────┐
                              │ RevenueCat  │
                              │   Client    │
                              └─────────────┘
```

### 10 · Implementation Plan & Timeline

| Phase | Milestone                  | Target Date (week ending) | Owner  |
| ----- | -------------------------- | ------------------------- | ------ |
| 0     | Dev env ready              | **Jun 20 2025**           | Jr Eng |
| 1     | Skeleton CLI boots         | Jun 24 2025               | Jr Eng |
| 2     | Offerings CRUD operational | Jun 27 2025               | Jr Eng |
| 3     | Full API surface           | Jul 05 2025               | Jr Eng |
| 4     | Packaging & SSE transport  | Jul 09 2025               | Jr Eng |
| 5     | Error/logging hardening    | Jul 12 2025               | Jr Eng |
| 6     | Docs & v1.0 release        | Jul 16 2025               | Jr Eng |

### 11 · Success Metrics

* **M1:** 100 % of commands return expected JSON in manual tests.
* **M2:** Bundled executable < 5 MB.
* **M3:** Quick-start README produces working `CreateOffering` in ≤ 5 min.
* **M4:** No secrets leaked in logs (regex scan).

### 12 · Risks & Mitigations

| Risk                        | Probability | Impact | Mitigation                                 |
| --------------------------- | ----------- | ------ | ------------------------------------------ |
| API changes                 | Medium      | Medium | Auto-gen types from OpenAPI; semver bumps. |
| Rate-limits during bulk ops | High        | Low    | Built-in back-off & pagination.            |
| Missing env var             | Medium      | High   | `dotenv-safe` fail-fast.                   |

### 13 · Glossary

| Term                | Definition                                                  |
| ------------------- | ----------------------------------------------------------- |
| **MCP**             | Model Context Protocol – JSON contract for tools.           |
| **DTO**             | Data Transfer Object.                                       |
| **STDIO Transport** | Server reads/writes newline-delimited JSON on stdin/stdout. |

---

*Last updated · 17 June 2025*
