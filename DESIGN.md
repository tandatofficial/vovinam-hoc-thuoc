---
version: 1.0.0
name: Vovinam-Study-Design-System
description: >-
  Human-centered mobile design system inspired by Apple iOS HIG and Duolingo learning ergonomics.
  Optimized specifically for memorization, high-contrast reading comfort, and single-handed mobile usage.

colors:
  primary: "#0038A8"          # Vovinam Deep Ocean Blue
  primary-light: "#EBF2FF"    # Soft blue tint for active chips
  primary-hover: "#002B82"    
  secondary: "#D97706"        # Martial Gold / Focus Accent
  secondary-light: "#FEF3C7"  # Warm amber background for mnemonic tips
  
  canvas: "#F8FAFC"           # Clean slate background (reduces eye strain)
  surface: "#FFFFFF"          # Pure white card surface
  surface-subtle: "#F1F5F9"   # Card background for secondary content
  
  text-heading: "#0F172A"     # Crisp slate-900 for titles
  text-body: "#1E293B"        # High-contrast slate-800 for answer reading
  text-muted: "#64748B"       # Slate-500 for captions and metadata
  
  status-mastered: "#16A34A"  # Forest green (Đã vững)
  status-learning: "#D97706"  # Amber orange (Đang học / Mơ hồ)
  status-review: "#DC2626"    # Crimson red (Yếu điểm / Quên)

typography:
  font-family: "'Be Vietnam Pro', -apple-system, BlinkMacSystemFont, 'SF Pro Text', system-ui, sans-serif"
  question-title:
    size: "20px"
    weight: "700"
    line-height: "1.4"
  quote-core:
    size: "17px"
    weight: "600"
    line-height: "1.5"
  body-reading:
    size: "15px"
    weight: "400"
    line-height: "1.65"
  label-pill:
    size: "12px"
    weight: "700"
    letter-spacing: "0.02em"

components:
  card:
    radius: "16px"
    border: "1px solid #E2E8F0"
    shadow: "0 2px 10px rgba(0, 0, 0, 0.04)"
  selector-pills:
    min-size: "40px"
    radius: "12px"
    active-ring: "2px solid #0038A8"
  action-button:
    min-height: "48px"
    radius: "14px"
    feedback: "active:scale-95 transition-transform"

guidelines:
  - "Always keep paragraphs broken into bite-sized units (max 3-4 sentences per paragraph) for quick visual scanning."
  - "Key keywords must be bolded or emphasized with contrasting tint boxes."
  - "Buttons in the thumb zone must have at least 44px tap target size to adhere to Apple HIG."
---
