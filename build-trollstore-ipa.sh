#!/bin/bash
set -e

echo "=== ĐANG ĐÓNG GÓI APP VOVINAM HỌC THUỘC CHO TROLLSTORE (iOS 15) ==="

# 1. Build Vite web offline
echo "[1/5] Building web distribution files..."
npm install
npm run build

# 2. Add / Sync iOS
echo "[2/5] Syncing Capacitor iOS..."
npx cap add ios || true
npx cap sync ios

# 3. Build Xcode archive without code signing
echo "[3/5] Compiling Xcode archive..."
rm -rf build Payload VovinamHocThuoc.ipa
xcodebuild clean archive \
  -workspace ios/App/App.xcworkspace \
  -scheme App \
  -configuration Release \
  -destination 'generic/platform=iOS' \
  -archivePath build/App.xcarchive \
  CODE_SIGNING_ALLOWED=NO \
  CODE_SIGNING_REQUIRED=NO \
  CODE_SIGN_IDENTITY="" \
  IPHONEOS_DEPLOYMENT_TARGET=15.0

# 4. Packaging into Payload/
echo "[4/5] Packaging Payload..."
mkdir -p Payload
cp -R build/App.xcarchive/Products/Applications/App.app Payload/

# 5. Pseudo-signing with ldid if available
if command -v ldid &> /dev/null; then
  echo "Fake-signing binary with ldid..."
  ldid -S Payload/App.app/App || true
fi

zip -r9 VovinamHocThuoc.ipa Payload
rm -rf Payload

echo "=== HOÀN TẤT! File IPA đã được tạo: VovinamHocThuoc.ipa ==="
echo "Cách cài đặt: Gửi file này qua AirDrop / Telegram / Drive vào iPhone -> Mở trong TrollStore để cài đặt."
