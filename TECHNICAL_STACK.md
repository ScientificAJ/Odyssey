# Odyssey V1 — Technical Stack

> **Architecture decision:** Odyssey V1 is a device-local mobile application. Its calendar, goals, habits, completion history, metrics, settings, and proof photos remain on the user's device. There is no backend, cloud database, remote account, remote sync, push service, online analytics, or online photo storage.
>
> **Platform:** iOS and Android
>
> **Stack reviewed:** 17 July 2026
>
> **Companion sources:** [`PRODUCT_SPEC.md`](./PRODUCT_SPEC.md) defines what the product does. [`DESIGN.md`](./DESIGN.md) defines how it looks and feels. This document defines how V1 should be engineered.

---

## 1. Technical Direction

Build Odyssey as a production-grade **Expo and React Native** application using TypeScript, a local encrypted SQLite database, and private files inside the application sandbox.

The stack should make the experience feel native, fast, tactile, and visually distinctive while keeping the data model portable enough to support an optional backend in a later product version. V1 must not contain placeholder cloud code, fake sync states, unused API clients, or remote services “for later.”

### Core engineering principles

1. **Local means local.** User data is readable and writable without internet access and is not transmitted anywhere.
2. **SQLite is the source of truth.** UI state may be cached in memory, but durable product state lives in the local database.
3. **Media is a private file, not a database blob.** SQLite stores proof metadata and private file references; image bytes live in the app's protected document directory.
4. **Every write is honest.** The interface shows success only after the local database transaction and required file operation complete.
5. **Visual ambition has a budget.** Motion, image processing, and environmental art may never make planning or completion feel slow.
6. **Native capability, no provider dependency.** Camera, local notifications, haptics, and secure device storage are allowed; hosted services are not.
7. **Future-ready, not future-built.** Use clean repositories and domain boundaries so online sync can be designed later without shipping dormant networking now.

---

## 2. Stack at a Glance

| Area                    | Choice                                                                | Why                                                                                                            |
| ----------------------- | --------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| Mobile framework        | Expo SDK 57 development build with its supported React Native version | Current Expo framework, native modules, strong local tooling, and one iOS/Android codebase.                    |
| Language                | TypeScript with strict mode                                           | Makes product states, database records, routes, and calculations explicit.                                     |
| Package manager         | pnpm                                                                  | Deterministic installs, efficient storage, strict dependency boundaries.                                       |
| Navigation              | Expo Router                                                           | File-based native routing, lazy route evaluation, typed routes, and clean deep links from local notifications. |
| Durable structured data | `expo-sqlite` with SQLCipher                                          | Persistent local relational data with device-side encryption.                                                  |
| Database access         | Drizzle ORM and `drizzle-kit`                                         | Typed schema, prepared queries, migrations, and readable SQL ownership.                                        |
| Encryption-key storage  | `expo-secure-store`                                                   | Keeps the SQLCipher key in platform-protected local key storage.                                               |
| Proof-photo storage     | `expo-file-system`                                                    | Private on-device files that persist across app restarts.                                                      |
| Photo intake            | `expo-image-picker`                                                   | System camera and photo-library UI with contextual permissions.                                                |
| Photo processing        | `expo-image-manipulator`                                              | Resize, orient, recompress, and produce controlled local proof files.                                          |
| Local reminders         | `expo-notifications`                                                  | Schedules device-local notifications without push tokens or a server.                                          |
| Forms                   | React Hook Form and Zod                                               | Fast forms with shared runtime validation and TypeScript inference.                                            |
| Async local state       | TanStack Query                                                        | In-memory query caching and mutation invalidation over local repositories only.                                |
| Ephemeral UI state      | Zustand                                                               | Small, predictable state for sheets, filters, creation drafts, and transient UI.                               |
| Dates and time zones    | `date-fns` and `@date-fns/tz`                                         | Explicit local-date and time-zone operations without a large date runtime.                                     |
| Motion                  | React Native Reanimated                                               | Smooth UI-thread animations and controllable reduced-motion behavior.                                          |
| Gestures                | React Native Gesture Handler                                          | Native-quality gestures with accessible button alternatives.                                                   |
| Long lists              | Shopify FlashList                                                     | View recycling for the Journal and long calendar agendas.                                                      |
| Images                  | `expo-image`                                                          | Efficient local rendering, thumbnails, placeholders, and memory-aware caching.                                 |
| Visual effects          | `expo-blur`, `expo-linear-gradient`, local raster/vector assets       | Implements the sea-glass and tropical visual system without a web view.                                        |
| Feedback                | `expo-haptics` and `expo-audio`                                       | Optional local haptics and restrained sound with independent user controls.                                    |
| Fonts                   | `expo-font` with bundled Fraunces and Manrope files                   | Brand typography works offline and does not depend on a font CDN.                                              |
| Icons                   | `lucide-react-native` plus a small approved local Odyssey asset set   | One coherent system family with room for signature product objects.                                            |
| Unit/component tests    | Jest, `jest-expo`, React Native Testing Library                       | Expo-supported local tests for domain logic and accessible components.                                         |
| Route integration tests | `expo-router/testing-library`                                         | Verifies navigation without running a hosted service.                                                          |
| End-to-end tests        | Maestro CLI, run locally                                              | Verifies real iOS/Android flows, permissions, reminders, and persistence.                                      |
| Code quality            | ESLint, Prettier, `tsc --noEmit`                                      | Fast, deterministic local gates.                                                                               |
| Native builds           | Expo CLI, Android Studio, and Xcode                                   | Debug and release builds remain on developer-controlled machines.                                              |

### Version policy

- Scaffold with the current stable Expo SDK supported by the required native modules. As of 17 July 2026, Expo's current Router quick start exposes the SDK 57 template.
- Use the React and React Native versions selected by that Expo SDK; do not upgrade them independently.
- Install Expo modules with `npx expo install` so compatible native versions are selected.
- Pin exact dependency versions and the pnpm version in the lockfile and `packageManager` field.
- Pin the current active-LTS Node.js major in `.nvmrc` or `.node-version` when the project is scaffolded.
- Review upgrades intentionally. React Native ships frequently, so do not use floating versions in production.
- Use an Expo development build, not Expo Go, for real development. SQLCipher is not supported in Expo Go.

---

## 3. Application Architecture

Use a feature-oriented application with explicit domain and storage boundaries.

```text
screens and components
        ↓
feature view-model hooks
        ↓
domain services and policies
        ↓
repository interfaces
        ↓
SQLite repositories + private media store + local notification scheduler
```

### Layer responsibilities

#### Presentation

- Expo Router screens.
- Design-system primitives and composed components.
- Accessibility semantics, focus, gesture alternatives, reduced motion, and responsive layout.
- No SQL, filesystem paths, notification scheduling, or metric formulas inside components.

#### Feature layer

- View-model hooks for Today, Calendar, Odyssey, Journal, creation, and settings.
- Calls domain services and maps domain results into render-ready view data.
- Owns loading, empty, saving, and local-error presentation.

#### Domain layer

- Quest state transitions.
- Recurrence generation.
- Priority ordering.
- Consistency, intensity, Momentum, and XP calculations.
- Reminder policy and quiet-hours decisions.
- Final Boss and milestone completion rules.
- Pure TypeScript wherever possible so the highest-risk logic is easy to test.

#### Data layer

- Drizzle schema and migrations.
- Repository implementations.
- SQLCipher database initialization and transactions.
- Proof-file lifecycle.
- Local notification identifiers and reconciliation.
- Export, import, deletion, and integrity checks.

### Boundary rules

- Domain code must not import React Native, Expo, Drizzle, or platform APIs.
- Screens must not import Drizzle tables or execute SQL.
- Filesystem URIs must not escape the media repository into analytics, logs, or general UI state.
- The app must have no generic HTTP client, API base URL, authentication token store, websocket, or sync worker in V1.

---

## 4. Local Data Architecture

### 4.1 SQLite source of truth

Use `expo-sqlite` for goals, milestones, habits, tasks, occurrences, completions, reminder records, XP ledger entries, reflections, settings, migration state, and proof metadata.

Required database settings at open:

- SQLCipher encryption enabled.
- Encryption key loaded from SecureStore before the first query.
- Foreign keys enabled.
- Write-ahead logging enabled after verifying compatibility with the selected SQLCipher build.
- Busy timeout configured.
- Schema version checked and pending migrations applied in a transaction.
- Prepared statements or Drizzle parameter binding used for all user values.

Do not use:

- AsyncStorage as the primary database;
- JSON files for relational product state;
- SQLite BLOB columns for full proof photos;
- unparameterized SQL;
- destructive “drop and recreate” migrations after development begins.

### 4.2 Drizzle schema and migrations

- Drizzle owns table definitions, indexes, relationships, and migration files.
- Migration files are committed and never rewritten after release.
- Every migration has forward migration coverage against a populated prior-version database.
- Seed data is synthetic and exists only in development or tests.
- Repository methods expose product language such as `completeQuest()` and `rescheduleOccurrence()`, not generic table operations.

### 4.3 Atomic writes

Use a single SQLite transaction for product actions that update multiple records.

Examples:

- Completing a Quest writes the Completion, updates the Occurrence state, appends XP, and invalidates derived summaries atomically.
- Rescheduling updates the occurrence, notification record, and history in one logical operation.
- Deleting a proof first records the deletion intent, removes the file, and then commits final metadata state. A failed file deletion remains visible for retry.

Photo-file creation cannot be part of a SQLite transaction. Use a safe two-phase flow:

```text
process to temporary local file
→ verify readable file and checksum
→ move to final private path
→ commit SQLite metadata and completion transaction
→ remove temporary residue
```

If the database transaction fails, remove the newly created final file. If cleanup fails, record it for the next local orphan sweep.

### 4.4 Data integrity

- Use UUIDs generated locally for every durable entity.
- Add foreign keys and explicit delete behavior.
- Add unique indexes that prevent duplicate Habit occurrences.
- Store metric calculation and schema versions.
- Run a lightweight startup integrity check after an unclean shutdown.
- Keep an app-private recovery copy of the previous database before a destructive migration, then delete it after verified success.

---

## 5. Proof-Photo Storage

### 5.1 Storage layout

Store processed proof media inside the app's private document directory:

```text
odyssey/
├── database/
│   └── odyssey.db
├── proofs/
│   ├── originals/
│   │   └── {proof-id}.jpg
│   └── thumbnails/
│       └── {proof-id}.jpg
├── exports/
└── temp/
```

The exact platform directory is resolved through `expo-file-system`; never build absolute paths manually.

### 5.2 Intake pipeline

1. Request camera or photo-library permission only after the user selects that action.
2. Configure the picker for images only and disable microphone permission.
3. Do not request EXIF data.
4. Process the selected image into a new app-owned file.
5. Correct orientation and constrain the long edge to the approved maximum.
6. Encode to a quality-controlled JPEG or WebP format supported consistently on both platforms.
7. Generate a small thumbnail separately.
8. Verify that GPS and unnecessary EXIF metadata are absent; do not assume recompression removed them.
9. Hash the final file and store only metadata and relative paths in SQLite.
10. Remove picker-cache and temporary files after success or cancellation.

### 5.3 Media rules

- One proof image per completion in MVP.
- Do not convert image bytes to Base64 for ordinary storage or rendering.
- Do not expose proof files through public URLs.
- Do not write proof images to the user's general photo library unless the user explicitly exports one.
- `expo-image` renders thumbnails in lists; the full file loads only in the proof viewer.
- Journal scrolling must not decode full-resolution images.
- Deleting a completion or proof removes both original and thumbnail files.
- A local orphan sweep reconciles missing metadata, missing files, and abandoned temporary files.

### 5.4 Local-only backup policy

“Stored locally” must not silently become “included in an operating-system cloud backup.”

- Mark the database, proof directory, and sensitive exports as excluded from iCloud backup on iOS.
- Disable Android Auto Backup for Odyssey data and define restrictive data-extraction rules.
- Keep exported packages local and user-initiated. If the user shares an export through the system share sheet, that is an explicit user action outside Odyssey's automatic storage behavior.
- State clearly that uninstalling the application or clearing its data can permanently remove the Voyage unless the user created an export.

---

## 6. Local Encryption and Device Privacy

### 6.1 Database encryption

- Enable SQLCipher through the `expo-sqlite` configuration plugin.
- Generate a cryptographically secure random database key on first launch.
- Store only that key in `expo-secure-store`.
- Never log, export, hard-code, or check the key into source control.
- If the key is unavailable while the database remains, stop and offer a clear local-data recovery or erase flow; never open the data unencrypted.

### 6.2 Media protection

SQLCipher does not encrypt proof-photo files. Rely on the operating system's app sandbox and file-protection facilities for MVP, then verify the protection behavior on physical devices.

Before claiming “encrypted proof photos,” add and verify file-level encryption; do not let database encryption imply media encryption. The honest V1 wording is **private, app-sandboxed local proof** unless file-level encryption is implemented and tested.

### 6.3 Logging

- Production logs contain no names, notes, dates tied to content, filesystem URIs, proof metadata, or database values.
- Wrap console output so it is removed from release builds.
- Store no remote crash reports or analytics in V1.
- A user-triggered diagnostic export must redact private product content by default.

### 6.4 App lock

Device biometrics or passcode-gated app lock may be added as a practical post-MVP feature with `expo-local-authentication`. It is not a substitute for database encryption or operating-system device security.

---

## 7. Calendar and Time Engine

### 7.1 Representation

Store both user intent and machine time:

- `local_date` as `YYYY-MM-DD` for the intended calendar day;
- local start and deadline times where present;
- IANA time-zone identifier;
- absolute timestamp for recorded actions;
- recurrence definition and generation version;
- custom day-boundary setting.

### 7.2 Recurrence

V1 supports daily and selected-weekday recurrence. Implement this in a small tested domain service instead of adopting a full external-calendar recurrence model.

- Generate occurrences in a rolling window.
- Use a unique series/date key to make generation idempotent.
- Preserve historical occurrence snapshots.
- Regenerate only future windows after an edit.
- Test month boundaries, leap years, daylight-saving gaps and folds, time-zone changes, and custom day boundaries.

### 7.3 Calendar rendering

- Query only the visible date range plus a small buffer.
- Month view uses aggregates rather than mounting every event card.
- Day and week views virtualize long agendas.
- Layout calculations are memoized and kept off the critical gesture path.
- Drag is presentation only; the domain receives an explicit proposed date/time and validates it.

---

## 8. Local Notifications

Use `expo-notifications` for scheduled local notifications only.

### Required rules

- Do not request or store Expo push tokens, APNs tokens, or FCM tokens.
- Do not configure a push server.
- Persist each scheduled local notification identifier in SQLite.
- On Quest edit, completion, skip, reschedule, or deletion, cancel obsolete notification identifiers and schedule only the new valid set.
- Reconcile future reminders on app launch, time-zone change, permission change, and app upgrade.
- Use Android notification channels for user-controlled reminder categories.
- Keep notification bodies privacy-safe according to the product settings.
- Opening a reminder deep-links through Expo Router to the local Quest record.
- Treat local delivery as operating-system best effort. Do not claim exact delivery guarantees.

Local notifications remain available without a remote push service. All timing decisions and message content are produced on device.

---

## 9. State, Queries, and Forms

### 9.1 TanStack Query

Use TanStack Query only as an in-memory async cache around local repository calls.

- No HTTP query functions.
- No persisted server cache.
- Mutations call domain services, then invalidate exact local query keys.
- Database remains authoritative after relaunch.
- Query keys use product ranges such as `['occurrences', startDate, endDate]`.

### 9.2 Zustand

Use Zustand for ephemeral state only:

- active creation draft before save;
- selected calendar view and filters;
- open sheets and transient presentation state;
- reduced visual-detail session state.

Do not mirror the durable database graph into one global Zustand store.

### 9.3 React Hook Form and Zod

- One Zod schema defines runtime validation for each form or command.
- React Hook Form manages field state without rerendering the full form on every keystroke.
- Domain services validate again at the boundary; UI validation is not a security or integrity boundary.
- Error messages state how to recover and are linked accessibly to their fields.

---

## 10. UI and Design-System Implementation

### 10.1 Tokens

Translate `DESIGN.md` into typed source tokens:

```text
src/design/
├── colors.ts
├── typography.ts
├── spacing.ts
├── radii.ts
├── shadows.ts
├── motion.ts
└── themes.ts
```

- Tokens are the only source for approved color, type, spacing, radius, depth, and motion values.
- Use React Native `StyleSheet.create` and small typed design primitives.
- Do not add a general CSS or utility-class framework for MVP.
- Keep platform-specific elevation and blur fallbacks behind shared components.

### 10.2 Component hierarchy

Build primitives first:

- Screen and ScenicScreen
- Text styles
- Button, IconButton, and PressableSurface
- Input, Select, SegmentedControl, and Chip
- Card and SeaGlassSurface
- Sheet and Dialog
- StatusLabel and PriorityMark
- ProgressBar and ProgressRing
- QuestRow and QuestCard
- Empty, Error, Offline/Local Error, and Rest states

Feature screens compose these primitives; they do not recreate styling locally.

### 10.3 Imagery and environmental layer

- Bundle essential artwork locally so the app remains complete offline.
- Prefer optimized static WebP/PNG layers and restrained Reanimated transforms for the MVP environment.
- Do not introduce real-time 3D merely to chase an award aesthetic.
- Add Skia or another rendering runtime only after measurement proves a signature effect cannot be achieved within the existing stack.
- Use generated or commissioned real assets; do not replace product art with emoji, CSS-like drawings, or placeholder geometry.

### 10.4 Motion

- React Native Reanimated owns gesture-linked and state-transition motion.
- Use the durations and curves in `DESIGN.md`.
- All motion helpers accept a reduced-motion policy.
- Celebration effects stop, simplify, or become static under reduced motion and low-power treatment.
- Never animate large blurred surfaces continuously behind scrolling content.

### 10.5 Lists and images

- Use FlashList for Proof Journal, long Quest history, and long calendar agendas.
- Provide stable IDs and item types.
- Avoid unstable nested keys that defeat recycling.
- Use thumbnail dimensions to reserve layout space before decoding.
- Profile lists in release mode; development performance is not acceptance evidence.

---

## 11. Accessibility Engineering

- Use native React Native semantics and roles before custom accessibility behavior.
- Every interactive control has an accessible name, role, state, hint only when useful, and at least a 44 × 44 pt/dp target.
- Priority and Quest state are announced in words and never inferred from color.
- Calendar drag has Move Date and Move Time actions.
- Sheets restore focus to the invoking control when dismissed.
- Floating navigation cannot obscure focused content.
- Large text is tested at the largest supported accessibility sizes.
- Reduced Motion, Sound Off, Haptics Off, Increased Contrast, and screen-reader flows are verified on real devices.
- Decorative scenery and proof framing remain hidden from the accessibility tree unless they communicate approved content.
- Use React Native Testing Library queries by role and accessible name so inaccessible components are harder to ship.

---

## 12. Performance Engineering

`DESIGN.md` owns the user-facing performance targets. The engineering approach is:

- profile release builds on one representative mid-range Android device and one supported iPhone;
- instrument important transitions locally with the Performance API and development-only marks;
- keep database range queries indexed and bounded;
- perform metric aggregation in SQL or memoized domain functions outside render;
- render thumbnails before originals;
- process imported images away from active animation and navigation transitions;
- lazy-load noncritical routes and victory assets;
- virtualize long lists;
- avoid global rerenders from clock ticks or progress animation;
- measure before adding memoization or a heavier rendering library;
- run cold launch, warm launch, Today usable, calendar scroll, completion save, Journal scroll, and proof-open benchmarks before release.

No remote performance-monitoring provider is included in V1. Store development benchmark output as local build artifacts with synthetic data only.

---

## 13. Testing Strategy

### 13.1 Pure domain tests

Use Jest for:

- Quest state transitions;
- recurrence generation and idempotency;
- priority sorting;
- consistency, intensity, Momentum, and XP formulas;
- quiet hours and reminder-stage selection;
- milestone and Final Boss completion;
- time-zone, daylight-saving, and day-boundary fixtures.

These tests must use fixed clocks and synthetic data.

### 13.2 Component tests

Use `jest-expo` and React Native Testing Library for:

- screen-reader names, roles, states, and focus order;
- form validation and recovery;
- reduced-motion branches;
- permission denied and unavailable-camera states;
- empty, local-save error, and proof-file failure states;
- navigation destinations through Expo Router's testing utilities.

Prefer behavior assertions over broad snapshot tests.

### 13.3 Database integration tests

Run against a real temporary SQLite database in the native test environment for:

- migrations from every released schema;
- foreign keys and unique occurrence constraints;
- transactional completion and rescheduling;
- XP ledger correction;
- delete cascades and preserved history;
- file/database reconciliation;
- encrypted database open, wrong-key failure, and recovery behavior.

### 13.4 End-to-end tests

Use Maestro locally on installed development or release builds. Cover the acceptance journey in `PRODUCT_SPEC.md`, including:

- first launch with no account;
- Final Boss, Habit, Task, and milestone creation;
- calendar edit through gesture and accessible alternative;
- local reminder action;
- measured Partial completion;
- camera permission denial and photo selection;
- app termination and local persistence;
- time-zone change;
- proof deletion;
- complete local data erasure;
- reduced motion and large text critical paths.

### 13.5 Manual device matrix

At minimum:

- current iOS release on a recent iPhone;
- oldest supported iOS release on the oldest supported iPhone class;
- current Android release on a Pixel-class device;
- oldest supported Android release on a mid-range or low-memory physical device;
- VoiceOver and TalkBack;
- 12-hour and 24-hour clocks;
- at least one daylight-saving time zone and one non-DST time zone;
- denied camera, denied photos, denied notifications, low storage, and battery-saver states.

---

## 14. Local Development and Builds

### 14.1 Bootstrap

Recommended starting point:

```bash
npx create-expo-app@latest odyssey --template default@sdk-57
cd odyssey
corepack enable
pnpm install
```

Before using the template command, confirm SDK 57 remains the current stable production choice and that `expo-sqlite` SQLCipher supports the selected build. If the transition is incomplete, choose the latest stable supported Expo template rather than an RC or beta.

### 14.2 Native development builds

SQLCipher and production native behavior require a development build:

```bash
npx expo prebuild --clean
npx expo run:android
npx expo run:ios
```

- Android Studio provides the Android SDK, emulator, profiling, signing, and release bundle tools.
- Xcode provides the iOS simulator, instruments, signing, archive, and device tools.
- Do not require EAS Build, EAS Update, TestFlight, Firebase App Distribution, or another hosted build service for the local MVP workflow.
- iOS device and App Store distribution still require Apple's normal signing and distribution requirements; those are release infrastructure, not product data storage.

### 14.3 Required local commands

The scaffold should provide:

```text
pnpm lint
pnpm format:check
pnpm typecheck
pnpm test
pnpm test:coverage
pnpm db:generate
pnpm db:check
pnpm e2e:android
pnpm e2e:ios
pnpm check
```

`pnpm check` is the local acceptance gate and runs formatting, lint, type checking, unit/component tests, schema checks, and any fast integrity tests. Release-device E2E and performance passes remain separate required gates.

---

## 15. Recommended Project Structure

```text
odyssey/
├── src/
│   ├── app/                     # Expo Router routes only
│   │   ├── (tabs)/
│   │   │   ├── today.tsx
│   │   │   ├── calendar.tsx
│   │   │   ├── odyssey.tsx
│   │   │   └── me.tsx
│   │   ├── quest/
│   │   ├── milestone/
│   │   └── _layout.tsx
│   ├── components/              # Shared design-system components
│   ├── design/                  # Tokens, themes, motion, assets
│   ├── features/
│   │   ├── onboarding/
│   │   ├── today/
│   │   ├── calendar/
│   │   ├── quests/
│   │   ├── voyage/
│   │   ├── proof/
│   │   ├── journal/
│   │   └── settings/
│   ├── domain/
│   │   ├── entities/
│   │   ├── policies/
│   │   ├── services/
│   │   └── repositories/
│   ├── data/
│   │   ├── db/
│   │   │   ├── schema/
│   │   │   ├── migrations/
│   │   │   └── client.ts
│   │   ├── repositories/
│   │   ├── media/
│   │   ├── notifications/
│   │   └── export/
│   ├── hooks/
│   ├── state/
│   ├── lib/
│   └── testing/
├── assets/                      # Bundled fonts, images, icons, audio
├── __tests__/
├── .maestro/
├── app.config.ts
├── drizzle.config.ts
├── package.json
├── pnpm-lock.yaml
└── tsconfig.json
```

Keep tests outside `src/app`; every file under the Expo Router app directory is treated as a route or layout.

---

## 16. Quality Gate

Every change must pass the relevant part of this stack's quality gate:

1. Formatting clean.
2. ESLint clean with no unexplained disables.
3. TypeScript strict check clean.
4. Unit and component tests green.
5. Database migration and integrity tests green.
6. No user data, proof paths, encryption keys, or real personal information in fixtures, logs, screenshots, or test artifacts.
7. Accessibility checks for changed components.
8. Release-mode performance measurement for changed calendar, list, image, or motion paths.
9. Local persistence verified across force-close and relaunch.
10. Denied permissions and low-storage failure paths verified when affected.

Do not claim that a feature is complete because it works in Expo Go, in a web preview, or only with mocked native modules.

---

## 17. Future Online Migration Boundary

Online storage is not part of V1. If a later release adds it, begin with a separate product and security decision covering accounts, consent, encryption, conflict resolution, deletion, retention, migration, and operating cost.

The V1 architecture prepares only these safe seams:

- stable local UUIDs;
- repository interfaces around durable entities;
- immutable occurrence and ledger history;
- versioned database migrations;
- explicit `created_at` and `updated_at` timestamps;
- user-triggered export format;
- proof metadata separated from file bytes.

Do not ship dormant sync tables, upload queues, auth screens, API clients, tokens, remote configuration, or cloud SDKs in the local-only app.

---

## 18. Explicitly Not in the V1 Stack

- Backend server or serverless functions
- PostgreSQL, MySQL, MongoDB, Firebase, Supabase, or hosted SQLite
- User accounts, passwords, social login, sessions, or remote authentication
- REST, GraphQL, tRPC, websockets, or generic API client
- Cloud object storage or photo CDN
- APNs/FCM remote push and Expo Push Service
- Google Calendar, Apple Calendar, or Outlook APIs
- AI SDKs or proof recognition
- Remote analytics, session replay, crash reporting, or feature flags
- Remote configuration or over-the-air updates
- Hosted CI/CD as a requirement
- WebView-based app shell
- Real-time 3D engine for the MVP environment

---

## 19. Implementation Order

1. Scaffold Expo SDK, TypeScript strict mode, local builds, lint, formatting, and tests.
2. Implement design tokens and accessible primitives from `DESIGN.md`.
3. Add SQLCipher initialization, SecureStore key handling, Drizzle schema, and migrations.
4. Build and test the pure domain model and progress formulas.
5. Implement Final Boss, milestones, Habit, Task, and occurrence repositories.
6. Build onboarding, Today, and creation flows.
7. Build day/week/month calendar queries and interactions.
8. Add local notification scheduling and reconciliation.
9. Add proof intake, processing, storage, thumbnails, deletion, and orphan cleanup.
10. Add Odyssey progress, Journal, recovery, and Final Boss victory.
11. Add export, complete local erasure, backup exclusions, privacy controls, and permission recovery.
12. Run the full device, accessibility, performance, migration, and acceptance journey.

This order proves the high-risk local data and time model before the most expensive visual polish is layered on top.

---

## 20. Technical Definition of Done

Odyssey V1 is technically ready only when:

1. The app functions from first launch through Final Boss victory with airplane mode enabled.
2. Force-close and relaunch preserve every committed product action.
3. No application code transmits user product data or proof media over the network.
4. SQLCipher database encryption and key-loss behavior are verified on iOS and Android release builds.
5. Proof originals and thumbnails live only in the private app sandbox and are excluded from automatic cloud backup.
6. Required proof is never marked saved before its local file and SQLite metadata are durable.
7. Local reminders are created, updated, cancelled, and reconciled without push tokens or a server.
8. Schema migrations preserve populated user data.
9. Complete local-data erasure removes the database, proof files, thumbnails, exports, temporary files, reminder schedules, and secure key.
10. The `PRODUCT_SPEC.md` acceptance journey passes with local-only wording and behavior.
11. The `DESIGN.md` accessibility and performance gates pass on the agreed physical-device matrix.
12. Every dependency is necessary, pinned, licensed for use, and free of known unresolved critical security issues at release time.

---

## 21. Official References

- Expo's current Router quick start recommends its SDK 57 template and documents native, optimized, offline-capable file-based routing: [Expo Router introduction](https://docs.expo.dev/router/introduction/).
- Expo documents SQLite for data persisted across app restarts, FileSystem for device-local files, and SecureStore for small encrypted values such as keys: [Expo — Store data](https://docs.expo.dev/develop/user-interface/store-data/).
- Expo SQLite supports prepared statements, Drizzle integration, and SQLCipher on Android and iOS through a development build: [Expo SQLite](https://docs.expo.dev/versions/latest/sdk/sqlite/).
- Expo ImagePicker provides system camera and photo-library access and configurable permissions: [Expo ImagePicker](https://docs.expo.dev/versions/latest/sdk/imagepicker/).
- Expo distinguishes local notifications created on the device from remote push notifications; Odyssey uses only the former: [Expo notifications overview](https://docs.expo.dev/push-notifications/what-you-need-to-know/).
- Expo supports developer-controlled local debug and release builds through Android Studio, Xcode, and `npx expo run`: [Expo local app builds](https://docs.expo.dev/guides/local-app-overview/).
- React Native's release schedule is frequent, supporting the decision to pin the Expo-selected React Native version rather than upgrade it independently: [React Native releases](https://reactnative.dev/docs/releases).
- Expo recommends Jest, `jest-expo`, and React Native Testing Library for unit and component testing: [Expo unit testing](https://docs.expo.dev/develop/unit-testing/).
- FlashList recycles list components and should be profiled in release mode, supporting its focused use for long Journal and agenda surfaces: [FlashList performance](https://shopify.github.io/flash-list/docs/fundamentals/performance/).
