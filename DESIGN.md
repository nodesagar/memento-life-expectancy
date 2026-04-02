# Life Expectancy Chart Web App - Design Document

## 1. Understanding Summary
*   **What is being built:** A web application that generates a life expectancy grid chart (in months), similar to the provided reference image, based on the user's age.
*   **Why it exists:** To give users a stark, customizable visual perspective of how their remaining time on earth is historically distributed among activities (sleep, chores, free time, etc.).
*   **Who it is for:** Individuals seeking a customized visualization of their remaining life, driven by their current age.
*   **Key constraints:** Downloadable capability must accurately capture the custom-rendered grid and legends; interactions should be smooth and responsive.
*   **Explicit non-goals:** Not a time-tracking app, no user accounts required, and no user data saved to any backend database.

## 2. Assumptions (Non-Functional Requirements)
*   **Privacy & Security:** 100% Client-Side. Age and customized time allocations are processed entirely in the browser. 
*   **Performance & Scale:** Highly performant, statically targeted. Renders entirely client-side, making zero server calls post-load.
*   **Maintenance:** Low maintenance. Once deployed to a static host (Vercel/GitHub Pages), it requires no database scaling.

## 3. Decision Log
1.  **Customisation Level:** 
    *   *Decision:* Provide standard defaults initially but allow the user to fully slide/customize their personal daily hours. 
    *   *Reasoning:* It makes the final visualization deeply personal over fixed averages.
2.  **Tech Stack:**
    *   *Decision:* React (Vite) + CSS Grid + `html-to-image`.
    *   *Reasoning:* React elegantly handles the math & state linking the inputs to the chart. CSS Grid perfectly handles the dense circle layout. `html-to-image` handles the download requirement seamlessly.
3.  **Extrapolation Math Calculation:**
    *   *Decision:* Total lifespan assumed at 90. Gray circles are mapped first representing "elapsed months" (`Lived = age * 12`). Then, customized hours are applied uniquely to the *remaining* pool of months using fractional day allocation (`Hours / 24`).

## 4. Final Architecture & Layout
*   **Controls Panel:** Clean column/sidebar holding:
    *   Age Input (0-89 Max).
    *   Range sliders or number inputs for standard activities (Sleep, Work, Screen Time, etc.).
    *   Excess hour warning validation (sum > 24 shows text warning).
    *   "Download Image" action button.
*   **Chart Output Panel:** Visual container capturing:
    *   Dynamic Titles / Subtitles matching the wireframe constraints (An X year old's remaining time...).
    *   Grid container (36 circles wide).
    *   Activity Legends mapped dynamically showing colors and calculated remaining months to visually match the provided reference image layout.
