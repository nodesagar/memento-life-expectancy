# ChronosViz: Aesthetic Evolution Design Plan

## 1. Purpose & Tone
*   **Purpose**: Create a visceral, high-impact visualization of time that feels like a "memento mori" for the modern age.
*   **Tone**: **Industrial Utilitarian** meets **Luxury Minimal**.
*   **Differentiation Anchor**: The "Chronos Matrix" — a high-density, mono-spaced data grid that feels like a redacted government dossier or a high-end watch face.

## 2. Design System Snapshot
*   **Typography**: 
    *   *Display*: "Georama" or "Inter Tight" (Heavy weights, tight tracking).
    *   *UI/Data*: "JetBrains Mono" or "Roboto Mono" (For that industrial, precise feel).
*   **Color Story**: "Obsidian & Cobalt"
    *   `--bg`: `#050505` (True black for infinite depth)
    *   `--surface`: `#0f0f0f`
    *   `--border`: `rgba(255, 255, 255, 0.08)`
    *   `--accent`: `#3b82f6` (Vivid blue)
*   **Spacing**: Strict 4px/8px baseline grid. Large "Editorial" margins.

## 3. DFII Evaluation
*   **Aesthetic Impact**: 5/5 (Industrial mono-type and true black depth)
*   **Context Fit**: 5/5 (Serious subject matter handled with precision)
*   **Implementation Feasibility**: 4/5 (Requires clean CSS Grid and Framer Motion)
*   **Performance Safety**: 4/5 (Large grid needs memoization)
*   **Consistency Risk**: 1/5 (Simple component set)
*   **DFII Score**: **17** (Excellent - Execute fully)

## 4. Component Architecture (CC Patterns)
*   **Matrix Component**: Uses a "Dot" primitive with CSS variable-driven coloring.
*   **Control sidebar**: Uses a "Sidebar Section" compound component pattern.
*   **Download Trigger**: A floating "Action Orbit" to keep the UI clean.

## 5. Differentiation Callout
> "This avoids generic UI by using ultra-wide letter spacing for headers, a monospaced data-first aesthetic instead of rounded SaaS components, and a custom 'Dossier' layout that feels like an official document of one's life."
