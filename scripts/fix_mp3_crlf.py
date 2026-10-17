# -*- coding: utf-8 -*-
import os
import glob

def clean_mp3_file(filepath):
    with open(filepath, "rb") as f:
        data = f.read()

    cleaned = bytearray()
    i = 0
    removed_count = 0
    n = len(data)

    while i < n:
        # Check if current byte is 0x0d 0x0a followed by MP3 sync word (0xff and top 3 bits set >= 0xe0)
        if i + 2 < n and data[i] == 0x0d and data[i+1] == 0x0a and data[i+2] == 0xff and (data[i+3] & 0xe0) == 0xe0:
            removed_count += 1
            i += 2 # Skip the corrupting 0x0d 0x0a
        else:
            cleaned.append(data[i])
            i += 1

    if removed_count > 0:
        with open(filepath, "wb") as f:
            f.write(cleaned)
        print(f"Fixed {os.path.basename(filepath)}: removed {removed_count} stray CRLF prefixes ({len(data)} -> {len(cleaned)} bytes)")
    else:
        print(f"Skipped {os.path.basename(filepath)}: already clean ({len(data)} bytes)")

def main():
    dirs = [
        r"public/audio",
        r"dist/audio",
        r"ios-native/VovinamHocThuoc/Resources/Audio"
    ]
    for d in dirs:
        if os.path.exists(d):
            print(f"\nScanning directory: {d}")
            for p in sorted(glob.glob(os.path.join(d, "*.mp3"))):
                clean_mp3_file(p)

if __name__ == "__main__":
    main()
