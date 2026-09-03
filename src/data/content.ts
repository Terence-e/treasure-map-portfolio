/**
 * All page copy lives here, lifted from the 2026 CV and the 21-page
 * Project Portfolio. Edit this file and the whole site — 3D beacons and
 * camera shots included — follows.
 */

export const profile = {
  name: 'Terence Eloundou Gaston',
  role: 'Computer Systems Engineer',
  location: 'Uxbridge, London',
  phone: '+44 7771 180588',
  email: 'eterence.g@gmail.com',
  linkedin: 'https://linkedin.com/in/terence-eloundou-g',
  github: 'https://github.com/Terence-e',
  tagline: 'From requirement to running system.',
  summary: `Computer Systems Engineering undergraduate at Brunel (Year 3) and a working software engineer at Afryx Labs. I take things from requirement to running system: Python/FastAPI and Next.js/Supabase applications, Odoo automations, and embedded work on Raspberry Pi and microcontrollers — with the specs, tests and documentation that go with them. Comfortable owning a piece of work in a distributed team. Right to work in the UK; willing to relocate UK-wide.`,
}

/** Headline counts, straight from the portfolio cover. */
export const tally = [
  { value: '25', label: 'projects' },
  { value: '2', label: 'live in production' },
  { value: '3', label: 'organisations' },
  { value: 'FR / EN', label: 'bilingual delivery' },
]

/**
 * Stops on the conquest chart. Each is an annexed Area with a
 * designation, a plain-language name and a coordinate on the territory.
 * [x, z] are world units; the island has radius ≈ 22. The order spirals
 * inward — the campaign ends at the centre.
 */
export type Stop = {
  id: string
  code: string
  label: string
  chapter: string
  position: [number, number]
}

export const stops: Stop[] = [
  { id: 'landfall', code: 'AREA 01', label: 'Landfall', chapter: 'Who holds this territory', position: [-12, 8] },
  { id: 'voyages', code: 'AREA 02', label: 'Deployments', chapter: 'Where I have worked', position: [-6, 3] },
  { id: 'production', code: 'AREA 03', label: 'Production', chapter: 'Systems running in the field', position: [1, 7] },
  { id: 'personal', code: 'AREA 04', label: 'Personal Builds', chapter: 'What I build unprompted', position: [9, 3] },
  { id: 'engineering', code: 'AREA 05', label: 'Field Engineering', chapter: 'Hardware, control and silicon', position: [12, -4] },
  { id: 'armoury', code: 'AREA 06', label: 'Armoury', chapter: 'What I work with', position: [5, -10] },
  { id: 'harbour', code: 'AREA 07', label: 'Academy', chapter: 'Where I trained', position: [-4, -11] },
  { id: 'offduty', code: 'AREA 08', label: 'Off Duty', chapter: 'Rook sacrifices', position: [-11, -5] },
  { id: 'signal', code: 'AREA 09', label: 'Comms', chapter: 'How to reach me', position: [0, -1] },
]

export type Role = {
  title: string
  org: string
  place: string
  period: string
  bullets: string[]
}

export const experience: Role[] = [
  {
    title: 'Software Engineer',
    org: 'Afryx Labs',
    place: 'Hybrid',
    period: 'Jun 2026 – Present',
    bullets: [
      `Own the frontend and login flow of a multi-tenant school platform built as a Next.js / TypeScript / Supabase monorepo, working to a written authentication and theming specification alongside a distributed team.`,
      `Moved per-school branding (logos, colour schemes) out of hardcoded values into per-institution configuration, and built a school-selector step for users with access to more than one institution.`,
      `Ship schema changes as versioned local migrations through the CI/CD pipeline rather than editing production directly; debug environment, network and firewall issues across Windows, Docker and Linux.`,
    ],
  },
  {
    title: 'Odoo Developer Intern',
    org: 'ST Digital',
    place: 'Douala, Cameroon',
    period: 'Jul – Aug 2025',
    bullets: [
      `Built Odoo 17 modules in Python/PostgreSQL for contact centralisation and event-invitation automation, cutting event marketing workload by around 50%.`,
      `Automated Microsoft Partner Centre price imports using scheduled actions, removing manual entry and improving accuracy; contributed to the “Data is Gold” project, code reviews and technical analysis reports.`,
      `Tracked tasks and defects in GitHub Issues with reproduction steps and change notes; gained exposure to DevOps practice and data-centre operations.`,
    ],
  },
  {
    title: 'IT Assistant',
    org: 'Fondation Révélation Sainte Thérèse',
    place: 'Yaoundé, Cameroon',
    period: 'Jun – Sep 2024',
    bullets: [
      `Installed and maintained a fingerprint attendance system for 20+ teachers, replacing a paper register.`,
      `Built and maintained the school website and campus network; monthly visits rose from roughly 20 to 150.`,
    ],
  },
]

export const alsoRan = [
  'Heathrow — Engineering Insights Week (Aug 2026)',
  'AirEx Technologies — Future Ready for All, Scrum/Waterfall and a team business pitch (Apr–Jun 2025)',
  'Sodexo — part-time bar staff at high-volume events, Fulham (Jan–Jun 2025)',
]

export type ProjectGroup =
  | 'production'
  | 'personal'
  | 'quant'
  | 'security'
  | 'engineering'

export type Project = {
  id: string
  group: ProjectGroup
  name: string
  /** Organisation, role, date and stack — the standfirst line. */
  meta: string
  /** Short status or year badge. */
  badge: string
  /** One-line summary, always shown first. */
  lede: string
  /** Full prose from the portfolio. */
  paras: string[]
  /** Closing line, set as a kicker in the portfolio. */
  kicker?: string
}

export const projects: Project[] = [
  /* ---------------- PRODUCTION & DELIVERED ---------------- */
  {
    id: 'kampus',
    group: 'production',
    name: 'Kampus — multi-tenant school platform',
    meta: 'Afryx Labs · Software Engineer · Jun 2026 – present · Next.js, TypeScript, Supabase, Postgres',
    badge: 'LIVE',
    lede: `African-first school management system. Built for Cameroon, scaling across Africa.`,
    paras: [
      `I own the frontend and the login flow of this multi-tenant platform, where every school gets its own subdomain of kampusafryx.com, working to a written authentication and theming specification alongside a distributed team.`,
      `Login identifiers are synthetic per-school addresses (prenom.nom@subdomain) used purely to resolve which institution a user belongs to — no mailbox exists, so Supabase Auth e-mail confirmation and reset flows were replaced with OTP/WhatsApp verification.`,
      `Moved per-school branding (logo, colour charte) out of hardcoded values into per-institution configuration, and built the school-selector step for users who belong to more than one institution, resolved via kampus_person_id plus affectation role.`,
      `Schema changes ship as versioned local migrations through the CI/CD pipeline rather than edits in the Supabase dashboard.`,
    ],
    kicker: 'Four layers: web + mobile apps, auth & tenancy, data, delivery — I own the top layer and the auth path through it',
  },
  {
    id: 'uniform',
    group: 'production',
    name: 'School Uniform Sales & Receipts System',
    meta: 'Fondation Révélation Sainte Thérèse · specification author & delivery lead · 2026 · Next.js 16 App Router, TypeScript, Supabase, next-intl, shadcn/ui, Tailwind v4 · live on Vercel',
    badge: 'LIVE',
    lede: `Point-of-sale for a school uniform shop — record a sale, print a receipt, export the month to Excel — in English and French, replacing a paper cahier de registre.`,
    paras: [
      `I wrote the specification (docs/requirements.md, v2.5) and it is the single source of truth: every issue and commit cites its requirement IDs, and any scope change goes through a pull request, never chat or e-mail, so the repo cannot drift from what was agreed.`,
      `Four design decisions carry the system. Locale then auth — the next-intl middleware owns the response first and the Supabase cookie refresh decorates that same response, because two middlewares each building their own NextResponse drop one another's Set-Cookie headers.`,
      `Totals are computed twice and trusted once — the same computeTotals() drives the form and re-runs on the server, and only the server's numbers are written; seller_id comes from the session, never the payload.`,
      `Receipts are self-contained — line items store description, size and unit price rather than pointing at the live catalogue, so reprinting a six-month-old receipt shows the price actually charged.`,
      `Row-level security is the access control, not the UI — a seller sees their own sales, an admin sees all, and the Excel export runs the same query under the same policies, so it needs no separate check. The ledger is append-only: no table grants a delete policy, and stock is corrected with a compensating movement rather than an edit.`,
      `Contracted and managed two freelance developers against a phased plan with acceptance criteria, dates and a defined late penalty. Phase 2 is half-landed by design — the stock schema, policies and server actions exist behind two flags, held back deliberately until counts are accurate, because wiring stock deduction early produces negative balances that look like real data.`,
    ],
  },
  {
    id: 'frst-stock',
    group: 'production',
    name: 'FRST Stock & Inventory Management System',
    meta: 'Fondation Révélation Sainte Thérèse · specification author & delivery lead · 2026 · phase 2, in delivery',
    badge: 'IN DELIVERY',
    lede: `Stock control for roughly 10–50 users and 20–150 distinct item types, self-hosted on the school's own main and backup servers running 24/7.`,
    paras: [
      `Phase 2 of the same programme, in its own repository (FRST-Management-System).`,
      `A single stock manager is the only role authorised to change quantities; everyone else reads. Every mutation is written to an audit trail so a discrepancy can be traced to a person and a moment.`,
      `Item types are generalised rather than hardcoded, so the school can add new lines itself without a developer.`,
    ],
    kicker: 'Designed to replace a paper register without losing its traceability',
  },
  {
    id: 'frst-timetable',
    group: 'production',
    name: 'FRST Timetable Management System',
    meta: 'Personal build for the same school · 2026 · FastAPI, SQLite, vanilla JavaScript · French-language UI',
    badge: '2026',
    lede: `Système de Gestion des Emplois du Temps — a timetabling system that replaces the hand-ruled paper grids, rewritten by hand every time anything moved.`,
    paras: [
      `Disciplines, teachers and their availability, classes and hours-per-week go in; a timetable comes out, is corrected by hand where needed, and is exported to PDF for printing.`,
      `The scheduler is a greedy planner in services/generator.py paired with a dedicated clash_detector.py, so an unplaceable slot surfaces as a named conflict rather than a silent gap. Seven routers split the API by domain — teachers, subjects, classes, availability, timetable, generation, dashboard — and FastAPI publishes interactive docs at /docs.`,
      `Layered on top: a four-level admin hierarchy (lv1–lv4b) with tag-based permissions, a cascading tag-assignment wizard, audit logging, and a staged confirmation gate that must be passed before generation runs.`,
      `Deliberately deployable by a non-technical user — the whole system is one start.bat double-click, and the entire database is a single .sqlite file, so backup means copying one file and restore means putting it back.`,
    ],
  },
  {
    id: 'school-it',
    group: 'production',
    name: 'School website, campus network & fingerprint attendance',
    meta: 'Fondation Révélation Sainte Thérèse · IT Assistant · Jun – Sep 2024 · Yaoundé, Cameroon',
    badge: '2024',
    lede: `Replacing a paper register, and putting a school on the map.`,
    paras: [
      `Installed and maintained a fingerprint attendance system for 20+ teachers, replacing a paper register.`,
      `Built and maintained the school website and the campus network; monthly visits rose from roughly 20 to 150.`,
      `Also built an early interactive timetable viewer for the school in HTML/JavaScript over JSON schedule data — the direct ancestor of the FastAPI system above.`,
    ],
  },
  {
    id: 'odoo',
    group: 'production',
    name: 'Odoo 17 automation modules',
    meta: 'ST Digital · Odoo Developer Intern · Jul – Aug 2025 · Douala, Cameroon · Python, PostgreSQL, Odoo 17',
    badge: '2025',
    lede: `Scattered spreadsheets and mailboxes into one centralised model, with the invitations automated.`,
    paras: [
      `Built Odoo 17 modules in Python/PostgreSQL for contact centralisation and event-invitation automation, cutting event marketing workload by around 50%.`,
      `Automated Microsoft Partner Centre price imports with scheduled actions, removing manual entry and improving accuracy; contributed to the internal “Data is Gold” project, code reviews and technical analysis reports.`,
      `Tracked tasks and defects in GitHub Issues with reproduction steps and change notes — the habit that shows up in every project since.`,
    ],
    kicker: 'Six weeks from observation to shipped modules',
  },

  /* ---------------- PERSONAL SOFTWARE BUILDS ---------------- */
  {
    id: 'truth-machine',
    group: 'quant',
    name: 'A truth machine for trading ideas',
    meta: 'Personal · 2026 · Python, pandas, scikit-learn, matplotlib · four-module research pipeline (~880 lines) plus a 13-page report and a full project log',
    badge: '2026',
    lede: `A pipeline that takes any strategy, tests it honestly across markets and years, and says whether the edge is real — before money is risked.`,
    paras: [
      `It began as “I want to build a trading model” and became something more useful. The strategies turned out to be disposable; the apparatus and the judgement are the product.`,
      `Four modules, data-source pluggable and strategy-agnostic: backtest.py (loaders for HistData, Marketstack and yfinance, feature construction, trade extraction), strategies.py (white-box SMA crossover with a four-timeframe consensus filter, a grey-box logistic regression, intraday momentum), eval_harness.py (walk-forward, purged K-fold with embargo, Sharpe, PSR and deflated Sharpe), and report.py.`,
      `Three strategies were built and three were killed on the evidence. The SMA crossover returned about −7%/year on EUR/USD 2006–09 and trailing stops did not rescue it. The logistic model beat the base rate out-of-sample by ~1.5 points and did not overfit — and still went from +44% to −91% once the spread was paid across 28,303 trades. Intraday momentum (Gao et al., 2018) held up as an equities effect and was robustly dead on FX: 1,459 trades, expectancy −0.019%, probabilistic Sharpe 0.000.`,
      `The interesting part is the gate. A variant that held the signal 30 days showed +270% on silver; the harness identified it as roughly 15× overlap inflation on a single 2010–11 rally, with sign-flips across hold lengths proving noise rather than edge. A pre-registered test found Fibonacci retracements hit 15.14% versus 15.03% for random levels across 16,298 retracements — no better than chance. Self-tested against ten pure-noise strategies, a naive PSR of 0.868 said “87% confident”; the deflated Sharpe correctly returned 0.245 and called it luck-of-ten.`,
      `No profitable strategy yet, and the report says so on its own cover. The discipline — state the hypothesis first, test fairly, accept the answer when it is unwanted — is now automated in the harness rather than left to willpower.`,
    ],
    kicker: 'Accuracy is not profit',
  },
  {
    id: 'sentinel',
    group: 'security',
    name: 'Sentinel — AI website, network & access-control security scanner',
    meta: 'Personal · 2026, ongoing · Python (16 modules, ~5,700 lines), Tkinter GUI, nmap, urlscan.io API · defensive, own systems only',
    badge: 'ONGOING',
    lede: `A scanner that walks a target it is authorised to test and reports what is exposed.`,
    paras: [
      `Checks HTTPS enforcement and HTTP to HTTPS redirection, missing security headers, open ports, exposed admin panels, leaked secrets, database exposure, SSH configuration, authentication and rate-limiting behaviour, and access control on protected routes.`,
      `Each check is its own module — panel_checker, secrets_checker, database_exposure_checker, ssh_checker, auth_checker, rate_limit_checker, access_control_checker, frontend_exposure_checker, nmap_scanner, urlscan_api_checker — so a new class of check is a new file, not a change to the scanner core.`,
      `A shared risk_engine normalises every finding onto one Info–Critical scale and escalates rather than overwrites, so a target that fails one Medium and one Critical check is reported Critical. ai_explainer turns each raw finding into plain-English cause and remediation, and report_generator emits a text report with a risk summary and numbered findings, each carrying its evidence.`,
      `Two front ends over the same engine: a Tkinter desktop GUI (the largest module, ~1,600 lines) and a generated HTML dashboard that lays the findings out as a scan graph by category.`,
    ],
    kicker: 'For authorized testing only. Never scan systems without permission.',
  },
  {
    id: 'reel-extractor',
    group: 'personal',
    name: 'Reel Info Extractor — video to searchable knowledge base',
    meta: 'Personal · 2026 · Python, faster-whisper, Ollama vision model, Notion API',
    badge: '2026',
    lede: `A pipeline that takes saved Instagram Reels — cybersecurity, quant finance, cloud, hardware, data science — transcribes and describes them, auto-tags them, and files them as searchable entries in a Notion database.`,
    paras: [
      `A backlog of roughly 100 saved Reels is recovered through Meta's official “Download Your Information” JSON export rather than live scraping.`,
      `Deliberately rebuilt on free and local tooling: faster-whisper for transcription and a local Ollama vision model instead of paid APIs, orchestrated by a custom Python script instead of a no-code automation service.`,
    ],
    kicker: 'No paid APIs — built to be cheap to run, not just cheap to build',
  },
  {
    id: 'knightmare',
    group: 'personal',
    name: 'Knightmare Chart — 3D portfolio site',
    meta: 'Personal · 2026 · React, TypeScript, Vite, three.js r169, GSAP',
    badge: 'THIS SITE',
    lede: `A personal portfolio built as a cockpit display: a procedurally generated territory you fly over as you scroll.`,
    paras: [
      `Glass readout panels carry the content and beacons mark each area of the CV.`,
      `The terrain is real geometry, not an image — value-noise fbm with a radial falloff displacing a mesh, plus custom contour, grid and shoreline shaders; markers, route lines and a compass sit on top.`,
      `Entirely client-side: no server, no API keys. Every word on the page comes from one typed content file, so the 3D markers follow whatever the CV says.`,
    ],
  },
  {
    id: 'dealpilot',
    group: 'personal',
    name: 'DealPilot — multi-agent sales automation',
    meta: 'AIRIA AI Agent Challenge, Track 2 · with Pierre Byemg · Airia agents, Node/Express, React, Slack, OpenAI API',
    badge: 'CHALLENGE',
    lede: `A multi-agent system that automates sales intelligence, proposal generation and compliance monitoring — five specialised agents cooperating behind one dashboard.`,
    paras: [
      `Research gathers company intelligence, CRM analyses deal history, Compliance detects regulatory risk, Proposal generates a personalised document and Email drafts the follow-up.`,
      `A React dashboard visualises pipeline state and agent activity; Slack carries notifications back to the humans.`,
    ],
    kicker: 'Five agents, one orchestrated run',
  },
  {
    id: 'java-library',
    group: 'personal',
    name: 'Java library management system',
    meta: 'Personal · JavaFX, PostgreSQL, Maven · built under a one-day deadline',
    badge: '1 DAY',
    lede: `A full CRUD desktop application for managing a library: catalogue, members, loan tracking and usage statistics.`,
    paras: [
      `JavaFX front end over a PostgreSQL schema, built and packaged with Maven — designed, written and working inside a single day.`,
    ],
    kicker: 'Scope control was the real constraint',
  },
  {
    id: 'wordle',
    group: 'personal',
    name: 'Wordle — terminal game with a PyQt5 GUI mode',
    meta: 'Personal · Python, PyQt5, dictionary API',
    badge: 'PERSONAL',
    lede: `An advanced Wordle clone playable in the terminal, with a PyQt5 GUI mode over the same engine.`,
    paras: [
      `Random word fetching, dictionary-API word validation, difficulty levels, win/loss stats and high scores.`,
    ],
    kicker: 'One engine, two interfaces',
  },

  /* ---------------- ENGINEERING — BRUNEL ---------------- */
  {
    id: 'traffic-sign',
    group: 'engineering',
    name: 'Traffic sign recognition on a Raspberry Pi robot',
    meta: 'EE1643 · 2025 · TensorFlow / TFLite, OpenCV, Picamera2, Raspberry Pi Trilobot',
    badge: '2025',
    lede: `A convolutional neural network trained to recognise roadside signs, then deployed to a Trilobot for real-time recognition and motion control — the robot acts on what it sees.`,
    paras: [
      `Six classes covering directional arrows and signal colours; robustness under varied lighting came from data augmentation and Picamera2 tuning rather than a bigger model.`,
      `Two convolutional blocks into two dense layers. Training and validation curves were used to catch overfitting before the model ever reached the robot.`,
    ],
  },
  {
    id: 'smart-bicycle',
    group: 'engineering',
    name: 'Smart Bicycle Monitoring System',
    meta: 'EE2657 Microcontroller Group Design Project · 2026 · PIC16F18877, Flowcode, HX711 load cell, MMA8452 accelerometer, Hall sensors',
    badge: '2026',
    lede: `A microcontroller-based cycling instrument that measures speed, slope, pedal force and gear ratio, driven from a keypad and displayed on a 16×2 LCD.`,
    paras: [
      `Hall sensors time wheel rotations for speed; an MMA8452 accelerometer read over I²C classifies uphill, downhill or level; an HX711 load cell — calibrated against known weights — converts pedal force to newtons; sliding resistors read front and rear gear position and compute the tooth ratio.`,
      `Software written in Flowcode as separate macros per function, simulated first, then integrated onto soldered hardware and validated by continuity testing.`,
      `Assessed three ways: the group report, a practical demonstration with a poster presentation, and an 800-word individual critical review of the team's work — so the project had to be explained aloud and judged, not just written up.`,
      `Each sensor also got its own MPLAB X test harness in C before integration — six standalone projects (Accelerometer_Testing, Hall_effect_sensor_Testing, Weight_Load_Testing, Testing_Gear, Testing_Keypad, LCD_Testing), about 1,500 lines of C in total, so a misbehaving sensor could be isolated from the integrated build.`,
    ],
  },
  {
    id: 'bicycle-sim',
    group: 'engineering',
    name: 'Bicycle monitoring system — Flowcode simulation',
    meta: 'Simulation study for the same system · keypad and LCD interaction model',
    badge: '2026',
    lede: `The full keypad-and-LCD interaction modelled in Flowcode before any hardware existed, so menu logic and timing could be proven cheaply.`,
    paras: [
      `The user picks a measurement from a menu — speed, slope, force, gear — and the LCD reports it over a 10-second sampling window: the same flow the physical unit later ran.`,
    ],
  },
  {
    id: 'tracked-robot',
    group: 'engineering',
    name: 'Autonomous tracked robot with arm and claw',
    meta: 'BE1609 Engineering Practice, group design project · C++ control logic, Fusion 360 to BS8888',
    badge: '2025',
    lede: `A tracked robot with a jointed arm and claw whose task was to pick up a dowel and place it on a flat circular target — mechanical system and electronics designed together.`,
    paras: [
      `Contributed the C++ control logic, logged defects through iterative testing, and produced the BS8888 technical drawings and shaded assembly views for the mechanism.`,
    ],
  },
  {
    id: 'pid-mycobot',
    group: 'engineering',
    name: 'Control & robotics — PID design and the myCobot 280 Pi',
    meta: 'EE2652 Assignment 2 · Apr 2026 · MATLAB/Simulink, myBlockly, myCobot 280 Pi',
    badge: '2026',
    lede: `Designed a PI/PID controller for a plant that was oscillating badly in open loop, then compared the existing and revised closed-loop responses — overshoot and settling time both collapse in the revised system.`,
    paras: [
      `Derived the modified Denavit–Hartenberg frame assignment and parameter table for the six-axis myCobot 280 Pi, then drove the arm through myBlockly to check the kinematics against the model.`,
    ],
  },
  {
    id: 'chebyshev',
    group: 'engineering',
    name: 'Chebyshev passive filter design',
    meta: 'EE2652 Sensors & Automation · 2026 · OrCAD / PSpice',
    badge: '2026',
    lede: `Synthesised low-pass, high-pass and band-pass Chebyshev filters from specification: prototype tables, denormalisation to real component values, then verification in PSpice.`,
    paras: [
      `Simulated responses were measured against the design targets with cursors on the passband ripple and the cut-off, and reported with full netlists and theoretical analysis.`,
    ],
  },
  {
    id: 'verilog',
    group: 'engineering',
    name: 'Verilog HDL design tasks',
    meta: 'EE2660 Digital Systems Design · Jan 2026 · Verilog, ModelSim, Quartus',
    badge: '2026',
    lede: `A set of Verilog designs — parity generation, BCD encoding, counters and multiplexed selection — each verified against a written testbench rather than by inspection.`,
    paras: [
      `Timing was read off ModelSim waveforms to confirm the design behaved at the clock edges it claimed to, including the reset and enable paths.`,
      `The module also ran a separate synchronous sequential design strand — lab notes in October 2025 and a formal report in November — before the Verilog assignment covering learning outcomes 1 to 6 in January.`,
    ],
  },
  {
    id: 'sequential-logic',
    group: 'engineering',
    name: 'Sequential logic design in Quartus',
    meta: 'EE1629 Digital Devices and Systems, Lab 3 · Verilog / schematic capture, Quartus, DE-series board',
    badge: '2025',
    lede: `A 4-bit counter built from flip-flops — the contrast with the purely combinational 4-bit adder is the point of the lab: state, and therefore memory, changes how the circuit is reasoned about.`,
    paras: [
      `Designed and simulated in Quartus, then wired on a breadboard and confirmed on a Tektronix scope, so the simulated waveform and the measured one could be compared directly.`,
    ],
  },
  {
    id: 'pic-labs',
    group: 'engineering',
    name: 'PIC16F18877 microcontroller laboratories',
    meta: 'EE2659 Microcontroller Principles & EE2649 Computer Architecture · 2026 · MPLAB X, XC8, ARM/PIC assembly',
    badge: '2026',
    lede: `Eight laboratories on the Matrix Multimedia PIC development board: port I/O and LED banks, switch reading, software delay loops, multiplexed seven-segment displays, HD44780 LCD driving and ADC acquisition.`,
    paras: [
      `Documented as a research-style report with video evidence for each exercise, clock configuration (_XTAL_FREQ = 32 MHz) and the delay mathematics worked through rather than asserted.`,
    ],
  },
  {
    id: 'oop-java',
    group: 'engineering',
    name: 'Supermarket & banking application',
    meta: 'EE2651 Object Oriented Systems and Programming · May 2026 · Java, UML',
    badge: '2026',
    lede: `Two related object-oriented systems designed from class diagrams first: a supermarket with products, suppliers, employees and reorder checking, and a banking module with customers, accounts and transactions.`,
    paras: [
      `Each behaviour — user login, adding a product, reorder check, editing a price with automatic VAT, loading products from file at startup — was specified as a sequence diagram before it was implemented, then tested against it.`,
    ],
  },
  {
    id: 'cad-bench',
    group: 'engineering',
    name: 'Fusion 360 CAD reproduction to BS8888',
    meta: 'BE1609 Engineering Practice, CAD assignment · Fusion 360, engineering measurement',
    badge: '2024',
    lede: `Measured a real park bench in the field and reproduced it as a dimensioned 3D CAD model, demonstrating measurement technique as much as modelling.`,
    paras: [
      `Produced the solid model, the rendered view and the orthographic drawing set to BS8888 conventions.`,
    ],
  },
]

export const groupMeta: Record<ProjectGroup, { title: string; blurb: string }> = {
  production: {
    title: 'Production & delivered systems',
    blurb: 'Built for three organisations. Two are live and running in a school in Yaoundé right now.',
  },
  personal: {
    title: 'Personal software builds',
    blurb: 'Built unprompted, on my own time, for my own reasons.',
  },
  quant: {
    title: 'Quantitative research',
    blurb: 'Machine learning and statistics applied to markets — and the harness that decides whether an edge is real.',
  },
  security: {
    title: 'Defensive security',
    blurb: 'Scanning, hardening and access control. Own systems only, authorised targets only.',
  },
  engineering: {
    title: 'Engineering projects',
    blurb: 'Coursework and group projects from the Brunel degree — the module is named on each, but these are builds, not exam papers.',
  },
}

/** Smaller repositories that do not warrant a full card. */
export const workshop = [
  { name: 'neetcode-submissions', tag: 'Java', note: `Running record of NeetCode.io problem solutions — data structures and algorithms practice kept in version control.` },
  { name: 'Video-analysis', tag: 'private', note: `Exploratory video-processing work feeding the Reel Info Extractor pipeline.` },
  { name: 'tutorialsODOO', tag: 'SCSS, fork', note: `Working copy of the official Odoo tutorials used to ramp up before the ST Digital internship.` },
  { name: 'st-work', tag: 'Python, private', note: `Internship working repository from ST Digital.` },
  { name: 'BE1610 RC transient labs', tag: 'PSpice', note: `Capacitor transient behaviour investigated in hardware and simulation.` },
  { name: 'Data networks & cyber security', tag: 'coursework', note: `Internet and network technologies assignment; TryHackMe Pre-Security certificate (Aug 2026) and the ongoing Jr Penetration Tester path with public CTF write-ups.` },
]

/**
 * Manufacturer figures, listed as facts rather than reproduced pages.
 */
export const hardware = [
  {
    part: 'PIC16F18877',
    kind: '8-bit MCU · Microchip',
    spec: `56 KB Flash, 4 KB SRAM, 256 B EEPROM · 40-pin PDIP, 36 I/O · 32 MHz · 10-bit ADC, 35 channels · 5-bit DAC · 2.3–5.5 V · EUSART, I²C, SPI`,
    used: 'Smart Bicycle, EE2659 and EE2649 laboratories',
  },
  {
    part: 'HX711',
    kind: '24-bit load-cell ADC · Avia',
    spec: `24-bit · channel A gain 128 or 64 (±20 mV / ±40 mV full scale at 5 V), channel B fixed gain 32 (±80 mV) · 10 or 80 SPS · 2.6–5.5 V · two-wire PD_SCK / DOUT`,
    used: 'Pedal-force measurement, calibrated against known weights',
  },
  {
    part: 'MMA8452Q',
    kind: '3-axis accelerometer · NXP',
    spec: `12-bit / 8-bit output · ±2 g / ±4 g / ±8 g selectable · I²C · 1.95–3.6 V · output data rate 1.56–800 Hz · 6–165 µA`,
    used: 'Slope detection — uphill, downhill or level',
  },
  {
    part: 'Hall-effect sensor',
    kind: 'digital rotation pickup',
    spec: `Open-collector digital output triggered by a wheel-mounted magnet; edges timed by the MCU to derive wheel speed`,
    used: 'Wheel-speed measurement on the smart bicycle',
  },
  {
    part: 'Sliding resistor',
    kind: 'linear potentiometer as position sensor',
    spec: `Gear cable movement varies the wiper position; a voltage divider presents that as an analogue voltage into the PIC 10-bit ADC`,
    used: 'Front (3-position) and rear (9-position) gear detection',
  },
  {
    part: 'myCobot 280 Pi',
    kind: '6-DOF collaborative arm · Elephant Robotics',
    spec: `6 DOF · 250 g payload · 280 mm working radius · ±0.5 mm repeatability · 860 g · joints ±165° (J6 ±179°) · Raspberry Pi BCM2711 quad-core 1.5 GHz, 2 GB · DC 12 V 5 A`,
    used: 'Forward kinematics and modified D–H parameter validation',
  },
  {
    part: 'Raspberry Pi + Camera Module 2',
    kind: 'SBC and 8 MP camera',
    spec: `Broadcom BCM2711 quad-core Cortex-A72 at 1.5 GHz · Sony IMX219 8 MP sensor, 3280×2464 stills, 1080p30 video`,
    used: 'Traffic-sign recognition robot — TensorFlow Lite inference on-board',
  },
]

/** The smart-bicycle interface map, as built rather than as datasheeted. */
export const bicycleBus = [
  { node: 'Hall-effect sensor', detail: 'digital input · edge timing to wheel speed' },
  { node: 'HX711 + load cell', detail: '2-wire PD_SCK / DOUT · pedal force' },
  { node: 'Sliding resistors ×2', detail: 'analogue in to ADC · front and rear gear' },
  { node: 'MMA8452Q', detail: 'I²C (SDA / SCL) · slope from X-axis' },
  { node: '16×2 LCD (HD44780)', detail: '4-bit mode · RS, R/W, E, DB4–DB7' },
  { node: '4×4 matrix keypad', detail: 'row / column scan · menu selection' },
]

export const chess = {
  handle: 'terencee01',
  stat: '3,355 games since Jan 2023 · 14 brilliant moves across 972 rapid games (0.1% of moves)',
  lede: `Not a build, but the same instinct: give up material you are told to protect because you have calculated what comes after.`,
  paras: [
    `Both positions in the portfolio are chess.com's own Game Review calling the move brilliant — the engine evaluation in the corner is what the sacrifice bought.`,
    `The move statistics say the preference is measurable rather than sentimental: rook forks found 89.3% of the time and opponents' loose rooks punished 90.5% of the time — both the highest of any piece — while rooks are also the piece left hanging least often, at 8.8% of all pieces dropped.`,
  ],
  moves: [
    { san: 'Rxc3!!', note: 'the rook steps onto a defended square; evaluation swings to −6.83, Black winning' },
    { san: 'Rxh6!!', note: 'the same idea against a castled king, worth −4.51 after the piece comes off' },
  ],
}

export const education = {
  school: 'Brunel University London',
  degree: 'BEng (Hons) Computer Systems Engineering',
  period: '2024 – 2028',
  year2: `Control & Robotics (PID design, D–H matrices, myCobot 280 Pi) · Microcontroller Principles (ARM assembly) · Digital Systems Design (Verilog, Quartus) · Sensors & Automation · Data Networks & Cyber Security · Object-Oriented Programming · Analogue Electronics (Chebyshev filter design, OrCAD/PSpice)`,
  year1: 'Introductory Programming for Engineers (A*)',
  prior: 'Gordonstoun — A-levels in Mathematics, Chemistry and Physics (2022 – 2024)',
}

export const skills: { group: string; items: string[] }[] = [
  {
    group: 'Languages',
    items: ['Python', 'C / C++', 'Java', 'JavaScript / TypeScript', 'SQL', 'Verilog', 'HTML / CSS'],
  },
  {
    group: 'Frameworks & data',
    items: [
      'FastAPI', 'Next.js', 'Supabase', 'PostgreSQL', 'MySQL', 'SQLite',
      'TensorFlow & TFLite', 'OpenCV', 'PyQt', 'Odoo', 'REST APIs',
    ],
  },
  {
    group: 'Tools & platforms',
    items: [
      'Git / GitHub', 'GitHub Actions', 'Docker', 'Linux', 'Vercel',
      'VS Code', 'Quartus', 'OrCAD / PSpice', 'Fusion 360 (BS8888)', 'MPLAB X', 'Flowcode',
    ],
  },
  {
    group: 'Hardware',
    items: ['Raspberry Pi', 'Arduino', 'ST Nucleo', 'PIC16F18877', 'GPIO', 'myCobot 280 Pi'],
  },
]

export const additional = [
  'TryHackMe Pre Security Certificate (Aug 2026); working through the Jr Penetration Tester path with public CTF write-ups.',
  'Fluent in English and French; IELTS 6.5.',
  'Certified Sports Leader and House Leader Assistant.',
  'Piano Grade 5. Competitive basketball.',
]

/* ==================================================================
   ABOUT — written from what the work evidences, not from adjectives.
   Every claim here should be traceable to something in this file.
   ================================================================== */

export const about = {
  headline: 'I write the specification first, and I let the evidence win.',
  paras: [
    `I am a Computer Systems Engineering undergraduate at Brunel, in Year 3, and a working software engineer at Afryx Labs. Most of what is on this island was built because something in front of me was being done on paper and did not need to be — a uniform shop keeping a cahier de registre, a school rewriting its timetable by hand every time a teacher moved, a register of twenty teachers signed in ink.`,
    `The pattern across the work is that the document comes before the code. The uniform system has a versioned specification, docs/requirements.md at v2.5, and every issue and commit cites its requirement IDs; scope changes go through a pull request rather than a chat message, so the repository cannot quietly drift from what was agreed. That is not process for its own sake — it is what let me contract and manage two freelance developers against acceptance criteria and a delivery date without being in the room.`,
    `The other pattern is that I try to disprove my own work. The trading research is the clearest case: three strategies built, three killed on the evidence, a report whose own cover says there is no profitable strategy yet. The interesting output was never a strategy — it was the harness that refuses to let me believe a good-looking result, and that caught a +270% variant as overlap inflation on a single rally.`,
    `I build for people who are not technical, and it changes the decisions. The timetable system is one start.bat double-click and a single .sqlite file, because backup has to mean copying one file and restore has to mean putting it back. Receipts store their own line items rather than pointing at the live catalogue, because reprinting a six-month-old receipt has to show the price actually charged. The ledger is append-only and stock is corrected with a compensating movement, because a shop needs to be able to explain a discrepancy, not hide it.`,
    `I work in English and French, and everything I have shipped for the school in Yaoundé is bilingual by requirement rather than as a translation afterthought. I am comfortable owning a piece of work in a distributed team, and comfortable saying when something is not ready — Phase 2 of the stock system is deliberately half-landed behind two flags, because wiring stock deduction before the counts are accurate produces negative balances that look like real data.`,
  ],
  traits: [
    { label: 'Specification first', note: 'Written requirements, cited IDs, changes through pull requests.' },
    { label: 'Evidence over instinct', note: 'Three strategies built and three killed; a report that says so on its cover.' },
    { label: 'Built for non-technical users', note: 'One double-click to deploy, one file to back up, two languages.' },
    { label: 'Audit trails everywhere', note: 'Who changed what, when — in the stock system, the timetable and the platform.' },
    { label: 'Ships to a deadline', note: 'A library system designed, written and working inside a single day.' },
  ],
}

/* ==================================================================
   PARCOURS — where I came from, in order.
   ================================================================== */

export type Stage = {
  id: string
  place: string
  where: string
  period: string
  lines: string[]
  /** Modules, subjects or tools, shown as chips. */
  chips?: string[]
  /** Set when a section is deliberately waiting on a document. */
  pending?: string
}

export const parcours: Stage[] = [
  {
    id: 'cameroon',
    place: 'O-levels',
    where: 'Cameroon',
    period: 'to 2022',
    lines: [
      `I sat my O-levels in Cameroon before moving to the UK. Schooling in both French and English is where the bilingual delivery in everything since comes from — it is not a skill I added later, it is the environment I learned in.`,
    ],
    pending: 'Subject-by-subject results to be added once the certificate is to hand.',
  },
  {
    id: 'gordonstoun',
    place: 'Gordonstoun',
    where: 'Moray, Scotland',
    period: '2022 – 2024',
    lines: [
      `A-levels in Mathematics, Chemistry and Physics.`,
      `Ran and helped organise charity events through the school, and qualified as a Certified Sports Leader — which at Gordonstoun means being responsible for other people's sessions, not just attending your own.`,
      `Also House Leader Assistant.`,
    ],
    chips: ['Mathematics', 'Chemistry', 'Physics', 'Certified Sports Leader', 'House Leader Assistant', 'Charity events'],
  },
  {
    id: 'brunel',
    place: 'Brunel University London',
    where: 'Uxbridge',
    period: '2024 – 2028',
    lines: [
      `BEng (Hons) Computer Systems Engineering. Year 1 introductory programming came out at A*; Year 2 was where the hardware started.`,
    ],
  },
]

/** Brunel, year by year — the modules and what each one actually used. */
export const modules: { year: string; items: { code: string; name: string; tools: string }[] }[] = [
  {
    year: 'Year 2 — 2025/26',
    items: [
      { code: 'EE2652', name: 'Sensors & Automation', tools: 'MATLAB/Simulink · myBlockly · myCobot 280 Pi · OrCAD / PSpice' },
      { code: 'EE2657', name: 'Microcontroller Group Design Project', tools: 'PIC16F18877 · Flowcode · MPLAB X · HX711 · MMA8452' },
      { code: 'EE2659', name: 'Microcontroller Principles', tools: 'MPLAB X · XC8 · PIC assembly' },
      { code: 'EE2649', name: 'Computer Architecture & Interfacing', tools: 'ARM assembly · E-blocks2' },
      { code: 'EE2660', name: 'Digital Systems Design', tools: 'Verilog · ModelSim · Quartus' },
      { code: 'EE2651', name: 'Object Oriented Systems & Programming', tools: 'Java · UML class and sequence diagrams' },
      { code: 'EE2661', name: 'Data Networks & Cyber Security', tools: 'Networking fundamentals · security principles' },
      { code: 'EE2658', name: 'Professional Practices & Business for Engineers', tools: 'CPD record · organisation research' },
    ],
  },
  {
    year: 'Year 1 — 2024/25',
    items: [
      { code: 'EE1626', name: 'Introductory Programming for Engineers', tools: 'A* · Python' },
      { code: 'EE1643', name: 'Introduction to Electronic & Computer Systems', tools: 'TensorFlow Lite · OpenCV · Raspberry Pi' },
      { code: 'EE1629', name: 'Digital Devices & Systems', tools: 'Quartus · DE-series board · Tektronix scope' },
      { code: 'EE1628', name: 'Internet & Network Technologies', tools: 'Protocols · addressing · assignment and exam' },
      { code: 'EE1627', name: 'Data & Information', tools: 'MySQL' },
      { code: 'BE1609', name: 'Engineering Practice', tools: 'C++ · Fusion 360 to BS8888 · group design' },
      { code: 'BE1610', name: 'Engineering Systems & Energy I', tools: 'RC transients · PSpice · lab reports' },
      { code: 'MATH', name: 'Mathematics for Computer Systems', tools: 'Examination and continuous workshop assessment' },
    ],
  },
]

export const languages = [
  { name: 'English', level: 'Fluent · IELTS 6.5' },
  { name: 'French', level: 'Fluent — all delivery for the Yaoundé school is bilingual FR/EN' },
]

/* ==================================================================
   HOBBIES
   ================================================================== */

export type Hobby = {
  id: string
  name: string
  line: string
  paras: string[]
  stat?: string
}

export const hobbies: Hobby[] = [
  {
    id: 'chess',
    name: 'Chess',
    line: 'A documented weakness for giving up rooks.',
    stat: '3,355 games since Jan 2023 · 14 brilliant moves across 972 rapid games · chess.com/terencee01',
    paras: [
      `Not a build, but the same instinct: give up material you are told to protect because you have calculated what comes after.`,
      `The move statistics say the preference is measurable rather than sentimental — rook forks found 89.3% of the time and opponents' loose rooks punished 90.5% of the time, both the highest of any piece, while rooks are also the piece left hanging least often at 8.8% of all pieces dropped.`,
    ],
  },
  {
    id: 'basketball',
    name: 'Basketball',
    line: 'Competitive, and the reason for the sports leader qualification.',
    paras: [
      `Played competitively through school and still play. It is where the Certified Sports Leader qualification came from — running other people's sessions rather than only turning up to your own.`,
    ],
  },
  {
    id: 'piano',
    name: 'Piano',
    line: 'Grade 5.',
    paras: [
      `Grade 5 piano. Nothing to show here yet — no recording exists that I would put on a website.`,
    ],
  },
]

/**
 * One annotated game position, transcribed from the chess.com Game
 * Review screenshot. Squares are read from the flipped board in that
 * image, so the FENs are worth checking against the original game
 * before anyone quotes them.
 */
export const chessGame = {
  title: 'Rxc3!!',
  opponent: 'SaherAlsayedd182',
  evaluation: '−6.83',
  /** Before the sacrifice: rook still on c8, a white knight on c3. */
  before: '2r2rk1/pp3pp1/4pnp1/q2p4/1n1PP2P/2N3Q1/PPP3P1/2KR1B1R b - - 0 1',
  /** After Rxc3. */
  after: '5rk1/pp3pp1/4pnp1/q2p4/1n1PP2P/2r3Q1/PPP3P1/2KR1B1R w - - 0 2',
  from: 'c8',
  to: 'c3',
  why: [
    `White is castled queenside behind pawns on a2, b2 and c2, with the king on c1. Black already has the two pieces that matter aimed at that corner: the queen on a5 and the knight on b4.`,
    `The rook takes the knight on c3 — a square defended twice, by the b2 pawn and by the king's own pawn shield. Materially it is a rook for a knight. Positionally it is the only way to remove the shield.`,
    `If White recaptures with the b-pawn, the a5 queen and the b4 knight arrive on an open file and a broken king position, and the attack plays itself. If White declines, Black is simply a piece up on the queenside with the attack still standing.`,
    `The engine agrees: the evaluation swings to −6.83, which is a winning position for Black. Chess.com's own Game Review marked the move brilliant.`,
  ],
}

/* ==================================================================
   TRADING RESULTS
   Every figure below is read off Trading_Project_Report.pdf — the
   measured output of the harness, not illustrative numbers.
   ================================================================== */

export type Bar = {
  label: string
  /** Total return over the period, per cent. */
  value: number
  trades: number
  win: number
  rr: number
  /** Expectancy per trade, per cent. */
  exp: number
  note?: string
}

export const tradingViews: {
  id: string
  title: string
  lede: string
  unit: string
  bars: Bar[]
  takeaway: string
}[] = [
  {
    id: 'years',
    title: 'Intraday momentum, year by year',
    lede: 'The same strategy that works on equities, run on EUR/USD across five years and 1,459 trades.',
    unit: 'total return %',
    bars: [
      { label: 'SPY', value: 1.35, trades: 59, win: 49.2, rr: 1.57, exp: 0.0229, note: 'Equities — Sharpe 2.58, but PSR 0.899 on 59 trades: unproven, not proven.' },
      { label: '2006', value: -6.0, trades: 277, win: 21.3, rr: 0.66, exp: -0.0217 },
      { label: '2007', value: -5.66, trades: 273, win: 19.4, rr: 0.59, exp: -0.0207 },
      { label: '2009', value: -4.35, trades: 294, win: 40.1, rr: 0.82, exp: -0.0148 },
      { label: '2023', value: -5.81, trades: 306, win: 24.2, rr: 0.5, exp: -0.019 },
      { label: '2024', value: -5.81, trades: 309, win: 16.8, rr: 0.72, exp: -0.0188 },
    ],
    takeaway:
      'Every FX year is negative and the losses are the same size — that consistency is the finding. Pooled: 1,459 trades, expectancy −0.0189%, total −27.63%. The effect is real in equities and robustly dead in FX.',
  },
  {
    id: 'hold',
    title: 'The overfitting trap — return by hold length',
    lede: 'The same 1,463 signals, held for different lengths. If the edge were real, the line would not change sign.',
    unit: 'total return %',
    bars: [
      { label: '0 days', value: -26.9, trades: 1463, win: 33.1, rr: 0.82, exp: -0.0184 },
      { label: '1 day', value: 5.1, trades: 1463, win: 51.1, rr: 0.97, exp: 0.0035 },
      { label: '3 days', value: -30.8, trades: 1463, win: 49.1, rr: 0.99, exp: -0.0211 },
      { label: '15 days', value: 8.4, trades: 1463, win: 50.9, rr: 0.97, exp: 0.0057 },
      { label: '30 days', value: 69.5, trades: 1463, win: 50.3, rr: 1.02, exp: 0.0475, note: 'The one that looks like a discovery — and is not.' },
    ],
    takeaway:
      'The +69.5% bar is the trap. Win rate sits at about 50% at every hold length, and the sign flips either side of it: that is noise with a long tail, inflated roughly fifteen-fold by overlapping trades, not an edge.',
  },
]

/** The cost lesson: one model, EUR/USD 2009, before and after spread. */
export const costLesson = {
  trades: 28303,
  before: { label: 'Before costs', equity: 1.4436, pct: 44 },
  after: { label: 'After costs', equity: 0.0852, pct: -91 },
  note: 'Identical model, identical trades. The spread is charged 28,303 times, and a tiny edge does not survive it. Accuracy is not profit.',
}

/** The luck gate: what the harness does to a good-looking Sharpe. */
export const luckGate = [
  { label: 'Best of 10 pure-noise strategies', value: 0.8, kind: 'naive' as const },
  { label: 'Probabilistic Sharpe (naive)', value: 0.868, kind: 'naive' as const },
  { label: 'Deflated Sharpe (honest)', value: 0.245, kind: 'honest' as const },
]
