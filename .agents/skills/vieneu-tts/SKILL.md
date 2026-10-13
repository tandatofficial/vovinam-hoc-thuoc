---
name: vieneu-tts
description: >-
  Vietnamese Text-to-Speech and instant voice cloning skill powered by VieNeu-TTS (v3 Turbo).
  Allows cloning any Vietnamese voice from a 3-8s audio sample, serving OpenAI-compatible audio API,
  and batch-generating natural high-fidelity Vietnamese speech (48kHz) for questions, lectures, or study sessions.
---

# 🦜 VieNeu-TTS Skill: Vietnamese Voice Cloning & Speech Synthesis

This skill equips the agent with instant Vietnamese voice cloning and high-quality speech generation capabilities using **VieNeu-TTS (v3 Turbo)** by Phạm Nguyễn Ngọc Bảo (`pnnbao97`).

## Capabilities

1. **Instant Voice Cloning (3–8s Audio Sample)**:
   Clone any speaker's voice (e.g., Vovinam Grandmaster, teacher, or user's custom recording) into natural 48kHz Vietnamese speech.
2. **25 Built-in Curated Voices**:
   Natural regional Vietnamese accents (Bắc, Trung, Nam) with conversational cadence and emotional tags (`[cười]`, `[thở dài]`, `[hắng giọng]`).
3. **OpenAI-Compatible TTS Server**:
   Can run as a local streaming microservice (`POST /v1/audio/speech`) replacing OpenAI TTS in web applications and mobile apps.
4. **Batch Generation**:
   Generate pre-rendered `.mp3` / `.wav` voice tracks for all learning content.

---

## 🛠️ Quick Usage & CLI Workflow

### 1. Requirements Setup
```bash
# Install uv package manager
powershell -c "irm https://astral.sh/uv/install.ps1 | iex"

# Inside this skill directory (.agents/skills/vieneu-tts):
uv sync --extra all
```

Or install via pip:
```bash
pip install vieneu
```

### 2. Instant Voice Cloning via Python SDK

```python
from vieneu import Vieneu

# Initialize v3 Turbo model (CPU or CUDA)
tts = Vieneu(mode="v3turbo")

# Clone voice from a 3-8s sample audio file
tts.infer(
    text="Vovinam Việt Võ Đạo là môn võ thuật Việt Nam do Cố Võ sư Sáng tổ Nguyễn Lộc sáng lập năm 1938 tại Hà Nội.",
    prompt_audio="sample_voice.wav", # Đường dẫn file giọng mẫu cần clone
    output_file="output_cloned.mp3",
    speed=0.95
)
```

### 3. Generate Audio for Vovinam Questions

Run the project batch script:
```bash
python scripts/clone_vovinam_audio.py --voice-sample "voices/thay_day_vo.wav"
```
The script will synthesize audio for all 10 questions into `public/audio/q{id}_easy.mp3` and `public/audio/q{id}_full.mp3`.

### 4. Running the OpenAI-Compatible API Server

To serve live voice cloning on `http://localhost:8000`:
```bash
uv run python -m vieneu.server --host 0.0.0.0 --port 8000
```
Then query endpoint:
```http
POST /v1/audio/speech
Content-Type: application/json

{
  "model": "v3turbo",
  "input": "Chào các môn sinh Vovinam!",
  "voice": "sample_reference.wav",
  "response_format": "mp3"
}
```

---

## 📱 Frontend Integration in Vovinam App

The frontend (`src/utils/tts.ts` and `src/components/StudyView.tsx`) checks for:
1. Pre-generated Cloned MP3s in `/audio/q{id}_easy.mp3` and `/audio/q{id}_full.mp3`.
2. High-fidelity Natural Online Vietnamese TTS streaming fallback.
3. Native iOS 15 Siri / Linh `vi-VN` offline SpeechSynthesis fallback.
