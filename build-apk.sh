#!/usr/bin/env bash

set -Eeuo pipefail

readonly SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
readonly TOOLCHAIN_DIR="${ODYSSEY_TOOLCHAIN_DIR:-${SCRIPT_DIR}/.build-tools}"
readonly DOWNLOAD_DIR="${TOOLCHAIN_DIR}/downloads"
readonly LOCAL_JDK_DIR="${TOOLCHAIN_DIR}/jdk-17"
readonly SDK_DIR="${ODYSSEY_ANDROID_SDK_DIR:-${TOOLCHAIN_DIR}/android-sdk}"

readonly JDK_URL="https://github.com/adoptium/temurin17-binaries/releases/download/jdk-17.0.19%2B10/OpenJDK17U-jdk_x64_linux_hotspot_17.0.19_10.tar.gz"
readonly JDK_SHA256="d8afc263758141a66e0e3aafc321e783f7016696f4eaea067d340a269037d331"
readonly JDK_ARCHIVE="${DOWNLOAD_DIR}/OpenJDK17U-jdk_x64_linux_hotspot_17.0.19_10.tar.gz"

readonly CMDLINE_TOOLS_URL="https://dl.google.com/android/repository/commandlinetools-linux-14742923_latest.zip"
readonly CMDLINE_TOOLS_SHA256="04453066b540409d975c676d781da1477479dde3761310f1a7eb92a1dfb15af7"
readonly CMDLINE_TOOLS_ARCHIVE="${DOWNLOAD_DIR}/commandlinetools-linux-14742923_latest.zip"

readonly ANDROID_ABIS="${ANDROID_ABIS:-arm64-v8a}"
readonly GRADLE_WORKERS="${GRADLE_WORKERS:-$(nproc)}"

usage() {
  cat <<'EOF'
Build a standalone Odyssey Android APK on Linux.

Usage:
  ./build-apk.sh

Output:
  dist/Odyssey-<version>-<abis>-release.apk

Optional environment variables:
  ANDROID_ABIS             Native ABIs to build. Default: arm64-v8a
                           Universal example:
                           armeabi-v7a,arm64-v8a,x86,x86_64
  GRADLE_WORKERS           Gradle worker count. Default: every CPU core
  GRADLE_HEAP_MB           Gradle heap in MiB. Default: resource-aware
  ODYSSEY_TOOLCHAIN_DIR    Local JDK/SDK cache directory
  ODYSSEY_ANDROID_SDK_DIR  Android SDK directory
  SKIP_CHECKS=1            Skip lint, typecheck, tests, and schema checks

The first run downloads roughly 2-3 GB of build tools. Later runs reuse them.
The generated release APK is signed with Android's local debug key for direct
installation and testing. It is not a Play Store production signing setup.
EOF
}

die() {
  printf 'ERROR: %s\n' "$*" >&2
  exit 1
}

on_error() {
  printf '\nBuild failed at line %s.\n' "$1" >&2
}

trap 'on_error "$LINENO"' ERR

if [[ "${1:-}" == "--help" || "${1:-}" == "-h" ]]; then
  usage
  exit 0
fi

[[ $# -eq 0 ]] || die "Unknown argument: $1 (use --help)"
[[ "$(uname -s)" == "Linux" ]] || die "This script currently supports Linux only."
[[ "$(uname -m)" == "x86_64" ]] || die "This script currently supports x86_64 Linux only."

for required_command in awk curl grep nproc node readlink sed sha256sum tar unzip; do
  command -v "${required_command}" >/dev/null 2>&1 || die "Missing command: ${required_command}"
done

node_major="$(node -p "Number(process.versions.node.split('.')[0])")"
((node_major >= 20)) || die "Node.js 20 or newer is required (found $(node --version))."

mkdir -p "${DOWNLOAD_DIR}" "${TOOLCHAIN_DIR}"

download_verified() {
  local url="$1"
  local destination="$2"
  local expected_sha256="$3"

  if [[ -f "${destination}" ]] && printf '%s  %s\n' "${expected_sha256}" "${destination}" | sha256sum --check --status; then
    return
  fi

  printf 'Downloading %s\n' "$(basename -- "${destination}")" >&2
  curl --fail --location --retry 3 --show-error --progress-bar "${url}" --output "${destination}.part"
  printf '%s  %s\n' "${expected_sha256}" "${destination}.part" | sha256sum --check --status \
    || die "Checksum verification failed for $(basename -- "${destination}")"
  mv -f -- "${destination}.part" "${destination}"
}

java_major_from() {
  local java_binary="$1"
  "${java_binary}" -XshowSettings:properties -version 2>&1 \
    | awk -F= '/java.specification.version/ {gsub(/[[:space:]]/, "", $2); print $2; exit}'
}

select_java_home() {
  local system_java=""
  local system_java_major="0"

  if command -v java >/dev/null 2>&1; then
    system_java="$(readlink -f "$(command -v java)")"
    system_java_major="$(java_major_from "${system_java}")"
  fi

  if [[ "${system_java_major}" =~ ^[0-9]+$ ]] && ((system_java_major >= 17)); then
    dirname -- "$(dirname -- "${system_java}")"
    return
  fi

  if [[ ! -x "${LOCAL_JDK_DIR}/bin/java" ]]; then
    download_verified "${JDK_URL}" "${JDK_ARCHIVE}" "${JDK_SHA256}"
    local unpack_dir="${TOOLCHAIN_DIR}/jdk-17.unpack"
    rm -rf -- "${unpack_dir}"
    mkdir -p "${unpack_dir}"
    tar -xzf "${JDK_ARCHIVE}" --strip-components=1 -C "${unpack_dir}"
    rm -rf -- "${LOCAL_JDK_DIR}"
    mv -f -- "${unpack_dir}" "${LOCAL_JDK_DIR}"
  fi

  printf '%s\n' "${LOCAL_JDK_DIR}"
}

JAVA_HOME="$(select_java_home)"
export JAVA_HOME
export PATH="${JAVA_HOME}/bin:${PATH}"

printf 'Using Java: '
java -version 2>&1 | sed -n '1p'

install_android_command_line_tools() {
  local sdkmanager="${SDK_DIR}/cmdline-tools/latest/bin/sdkmanager"
  [[ -x "${sdkmanager}" ]] && return

  download_verified "${CMDLINE_TOOLS_URL}" "${CMDLINE_TOOLS_ARCHIVE}" "${CMDLINE_TOOLS_SHA256}"

  local unpack_dir="${TOOLCHAIN_DIR}/android-command-line-tools.unpack"
  rm -rf -- "${unpack_dir}"
  mkdir -p "${unpack_dir}" "${SDK_DIR}/cmdline-tools"
  unzip -q "${CMDLINE_TOOLS_ARCHIVE}" -d "${unpack_dir}"
  rm -rf -- "${SDK_DIR}/cmdline-tools/latest"
  mv -f -- "${unpack_dir}/cmdline-tools" "${SDK_DIR}/cmdline-tools/latest"
  rm -rf -- "${unpack_dir}"
}

install_android_command_line_tools

readonly SDKMANAGER="${SDK_DIR}/cmdline-tools/latest/bin/sdkmanager"
export ANDROID_HOME="${SDK_DIR}"
export ANDROID_SDK_ROOT="${SDK_DIR}"
export PATH="${SDK_DIR}/platform-tools:${SDK_DIR}/build-tools/36.0.0:${PATH}"

printf 'Accepting Android SDK licenses...\n'
set +o pipefail
yes | "${SDKMANAGER}" --sdk_root="${SDK_DIR}" --licenses >/dev/null
license_status="${PIPESTATUS[1]}"
set -o pipefail
((license_status == 0)) || die "Android SDK license acceptance failed."

printf 'Installing required Android SDK packages...\n'
"${SDKMANAGER}" --sdk_root="${SDK_DIR}" \
  "platform-tools" \
  "platforms;android-36" \
  "build-tools;35.0.0" \
  "build-tools;36.0.0" \
  "ndk;27.0.12077973" \
  "ndk;27.1.12297006" \
  "cmake;3.22.1"

cd -- "${SCRIPT_DIR}"

if command -v pnpm >/dev/null 2>&1; then
  PNPM=(pnpm)
elif command -v corepack >/dev/null 2>&1; then
  PNPM=(corepack pnpm)
else
  die "pnpm or Corepack is required."
fi

printf 'Installing JavaScript dependencies...\n'
"${PNPM[@]}" install --frozen-lockfile

if [[ "${SKIP_CHECKS:-0}" != "1" ]]; then
  printf 'Running repository checks...\n'
  "${PNPM[@]}" check
fi

printf 'Generating the Android project...\n'
"${PNPM[@]}" exec expo prebuild --platform android --clean --no-install
printf 'sdk.dir=%s\n' "${SDK_DIR}" >android/local.properties

total_memory_mb="$(awk '/MemTotal:/ {print int($2 / 1024)}' /proc/meminfo)"
default_heap_mb="$((total_memory_mb / 4))"
((default_heap_mb < 2048)) && default_heap_mb=2048
((default_heap_mb > 8192)) && default_heap_mb=8192
readonly GRADLE_HEAP_MB="${GRADLE_HEAP_MB:-${default_heap_mb}}"

printf 'Building standalone release APK (%s, %s workers, %s MiB Gradle heap)...\n' \
  "${ANDROID_ABIS}" "${GRADLE_WORKERS}" "${GRADLE_HEAP_MB}"

NODE_ENV=production android/gradlew -p android :app:assembleRelease \
  --no-daemon \
  --max-workers="${GRADLE_WORKERS}" \
  -PreactNativeArchitectures="${ANDROID_ABIS}" \
  -Dorg.gradle.parallel=true \
  -Dorg.gradle.jvmargs="-Xmx${GRADLE_HEAP_MB}m -XX:MaxMetaspaceSize=1024m -Dfile.encoding=UTF-8"

readonly SOURCE_APK="${SCRIPT_DIR}/android/app/build/outputs/apk/release/app-release.apk"
[[ -f "${SOURCE_APK}" ]] || die "Gradle succeeded but ${SOURCE_APK} was not created."

app_version="$(node -p "require('./app.json').expo.version")"
abi_label="${ANDROID_ABIS//,/-}"
readonly OUTPUT_DIR="${SCRIPT_DIR}/dist"
readonly OUTPUT_APK="${OUTPUT_DIR}/Odyssey-${app_version}-${abi_label}-release.apk"
mkdir -p "${OUTPUT_DIR}"
cp -f -- "${SOURCE_APK}" "${OUTPUT_APK}"

readonly APKSIGNER="${SDK_DIR}/build-tools/36.0.0/apksigner"
"${APKSIGNER}" verify --verbose --print-certs "${OUTPUT_APK}"

unzip -Z1 "${OUTPUT_APK}" | grep -qx 'assets/index.android.bundle' \
  || die "The release APK is missing its embedded JavaScript bundle."

printf '\nAPK ready: %s\n' "${OUTPUT_APK}"
printf 'Size: '
du -h "${OUTPUT_APK}" | awk '{print $1}'
printf 'SHA-256: '
sha256sum "${OUTPUT_APK}" | awk '{print $1}'
