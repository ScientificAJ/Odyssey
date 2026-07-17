# Odyssey V1

Odyssey is a mobile-first, gamified productivity calendar that turns one meaningful goal into scheduled habits and tasks. It measures both **consistency** and **actual intensity**, supports private photo proof, and connects daily progress to milestones and a final goal—the **Final Boss**.

## Build From Here

Use this README as the single entry point when starting or continuing the build. The complete specification is split into three source-of-truth documents:

1. [`PRODUCT_SPEC.md`](./PRODUCT_SPEC.md) — features, workflows, product rules, data definitions, privacy, metrics, MVP scope, acceptance criteria, and extra-feature backlog.
2. [`DESIGN.md`](./DESIGN.md) — visual identity, layouts, components, motion, responsive behavior, accessibility presentation, performance targets, and UI quality requirements.
3. [`TECHNICAL_STACK.md`](./TECHNICAL_STACK.md) — Expo and React Native stack, device-local SQLite and proof storage, architecture, libraries, security, testing, local builds, and engineering definition of done.

## Source-of-Truth Rule

- Follow `PRODUCT_SPEC.md` for **what Odyssey does**.
- Follow `DESIGN.md` for **how Odyssey looks and feels**.
- Follow `TECHNICAL_STACK.md` for **how Odyssey is engineered**.
- If they appear to conflict, product behavior comes from `PRODUCT_SPEC.md`; adapt the presentation using `DESIGN.md` without inventing or removing product behavior.
- V1 stores its database and proof photos on the user's device. It has no backend, account, remote sync, cloud database, online analytics, push service, or online media storage.
- Do not introduce external calendar, AI, wearable, social, cloud, or provider-integration features unless the product scope is explicitly changed.

## MVP Goal

Ship the complete journey from creating a Final Boss, scheduling measurable Quests, and recording honest effort with optional photo proof through milestone completion, recovery from missed work, and Final Boss victory.

## Run the App

Odyssey is now scaffolded as the local-only Expo SDK 57 application described by the specifications.

```bash
corepack enable
pnpm install
pnpm check
pnpm exec expo prebuild --clean
pnpm exec expo run:android
# macOS only:
pnpm exec expo run:ios
```

Use a development build, not Expo Go: SQLCipher requires native prebuild configuration. The project pins Node.js in [`.nvmrc`](./.nvmrc), stores no API credentials, and needs no backend or online service at runtime.

The fast local acceptance gate is `pnpm check`. Physical-device permission, reminder-delivery, accessibility, encrypted-database, file-protection, force-close, and performance verification remain separate release gates as defined by the source-of-truth specifications.

## Build a Standalone Android APK

On x86_64 Linux, run one command:

```bash
./build-apk.sh
```

The script downloads checksum-verified JDK 17 and Android SDK tooling into `.build-tools/`, installs project dependencies, runs `pnpm check`, generates the native Android project, builds a standalone release APK with an embedded Hermes bundle, verifies its signature, and writes the result to `dist/`.

It uses every CPU core by default and chooses a Gradle heap from available memory. The default APK targets `arm64-v8a`, which is the fastest path for modern physical Android devices. To build all Android ABIs:

```bash
ANDROID_ABIS=armeabi-v7a,arm64-v8a,x86,x86_64 ./build-apk.sh
```

Useful overrides:

```bash
GRADLE_WORKERS=32 GRADLE_HEAP_MB=8192 ./build-apk.sh
SKIP_CHECKS=1 ./build-apk.sh
```

The APK is signed with Android's generated local debug key so it can be installed directly for testing. Publishing through Google Play requires a private production signing key and a release signing configuration; neither is stored in this repository.
