# Product Requirements Document (PRD)
## Project: RestoVision AI (Hotel & Restaurant Intelligent Floor Manager)
**Repository**: [https://github.com/Soham303/Hotel_Manager.git](https://github.com/Soham303/Hotel_Manager.git)  
**Version**: 1.0.0  
**Author / Pair Programmer**: Antigravity AI & Soham Deshpande  

---

### 1. Executive Summary & Source Reel Analysis

#### 1.1 Source Instagram Reel Transcription
* **Source URL**: `https://www.instagram.com/reel/Dey4jafAmwk/`
* **Creator**: Louis Gleeson (`@aigleeson`)
* **Audio / Script Transcription**:
  > *"How restaurants are using AI 👀*  
  > *AI now monitors every table in real time and alerts staff when customers wait five minutes without a waiter or when a free table needs cleaning.*  
  > *Managers can review peak hours to schedule waiters, and some systems even work with existing security cameras.*  
  > *Would you want this in your favorite restaurant?*  
  > *👉 Follow @aigleeson for more #AIForBusiness #RestaurantTech #ArtificialIntelligence #computervision"*

#### 1.2 Visual Breakdown of the Video
* **Camera Overlay**: An overhead/wide-angle CCTV security camera view of a restaurant dining room.
* **Table Detection Polygons**: Tables labeled `T01 Free`, `T02 Free`, `T03 Free`, `T04 Free`, `T05 Free`, `T06 Free` surrounded by dynamic green boundary boxes.
* **Real-time Status List**: Left HUD showing live statuses (`Available`, `Occupied`, `Attention Needed`, `Needs Cleaning`).
* **Interaction Workflow**: Customers walk to tables, sit down, and the system automatically tracks elapsed time without waiter contact. If 5 minutes pass without server approach, an urgent alert triggers. When guests depart leaving dirty plates, the table state transitions to "Needs Cleaning", notifying busing staff.

---

### 2. Problem Statement
1. **Slow First Contact**: In traditional restaurants, guests seated at tables often wait 5–10 minutes before a waiter greets them or takes their order, resulting in customer dissatisfaction and lost revenue.
2. **Lag in Table Turnover**: Tables sit empty with uncleaned dishes for 10–20 minutes during rush hours because busing staff are unaware of departures, slashing table turnover rates by 15–25%.
3. **Inefficient Staff Scheduling**: Managers schedule staff based on guesswork rather than computer vision occupancy heatmaps and historical dining metrics.
4. **Expensive Hardware Requirements**: Existing table sensor solutions require proprietary IoT hardware and batteries, whereas restaurants already possess high-definition CCTV security cameras that remain unutilized for operations.

---

### 3. Solution: RestoVision AI
RestoVision AI transforms standard restaurant security cameras into an intelligent, autonomous dining floor management copilot. By leveraging Computer Vision (CV) polygon tracking and real-time state machines, RestoVision AI automatically:
1. Detects guest seating and tracks time-to-first-waiter contact.
2. Triggers audio-visual alerts if customers wait longer than 5 minutes without staff contact.
3. Automatically flags vacated dirty tables for cleaning and sanitization.
4. Provides real-time interactive 2D floor plans and camera HUD overlays.
5. Produces peak-hour heatmaps and AI-driven staff scheduling recommendations.

---

### 4. Target User Personas
* **Floor Manager / Maitre D'**: Monitors real-time floor occupancy, ensures fast guest service, and oversees table turnover.
* **Waitstaff & Bussers**: Receive immediate alerts on smart watches / mobile devices / tablets when a table is waiting or ready for cleaning.
* **General Manager / Owner**: Analyzes peak-hour trends, turnover speed, and schedules optimal staff shifts to minimize labor costs while maximizing covers.

---

### 5. Core Feature Specifications

#### Feature 1: Live CCTV Camera Perception & HUD Overlay
* Stream simulated or live RTSP/Webcam/Video restaurant feeds.
* Real-time polygon boundary overlays for each table (T01 - T06+).
* Dynamic status tags: `AVAILABLE (Free)`, `OCCUPIED (Seated)`, `ATTENTION NEEDED (>5m)`, `IN SERVICE (Served)`, `NEEDS CLEANING (Dirty)`, `RESERVED`.
* Table Zone Calibration tool allowing managers to click and drag polygon points over any camera angle.

#### Feature 2: Automated 5-Minute Waiter & Cleaning Alert System
* Live countdown timers for unassisted tables.
* Critical pulse alert triggering at the 5-minute threshold.
* Automated departure detection triggering "Needs Cleaning" alert with busser notification.
* Audio chime alert (optional sound toggle) and browser push notifications.
* One-click action buttons: "Assign Server", "Acknowledge", "Mark Cleaned & Reset".

#### Feature 3: Interactive Floor Plan & Table Management Dashboard
* Synchronized 2D floor map mirroring the physical restaurant layout.
* Quick-glance indicators: table capacity, current party size, time seated, assigned waiter.
* Status filtering: All, Attention Needed, Occupied, Dirty, Available.

#### Feature 4: Peak-Hour Analytics & AI Waiter Scheduling
* Hourly occupancy heatmaps showcasing rush hours (Lunch 12–2 PM, Dinner 7–9 PM).
* Key Performance Indicators (KPIs):
  * Average Table Turnover Time (Target: < 45 mins)
  * Average Waiter First-Response Time (Target: < 3 mins)
  * Clean & Reset Turnaround Time (Target: < 4 mins)
  * Tables Lost / Delayed SLA Rate
* AI Staffing Optimizer: Generates recommended waiter and busser counts per hour based on predicted table covers.

---

### 6. Technical Architecture & Stack
* **Frontend**: React 18 + Vite (High-performance modern UI).
* **Styling**: Vanilla CSS (Rich dark-mode aesthetic, glassmorphism, glowing status badges, smooth transitions, micro-animations, Outfit & Plus Jakarta Sans typography).
* **Perception Engine**: Canvas-based real-time computer vision simulation with support for custom polygon detection zones, event loop, and camera stream integration.
* **State Management**: Reactive state store with event emitters for instant audio-visual dispatch alerts.
* **Icons & Assets**: Lucide-React icons, high-fidelity SVGs, curated restaurant CCTV footage simulation.

---

### 7. Implementation Roadmap & Phased Steps
* **Step 1**: PRD & Architectural Blueprint (This Document).
* **Step 2**: Project Scaffolding & Design System Tokens (Vite + React + Vanilla CSS).
* **Step 3**: CCTV Camera Feed & Real-Time Computer Vision Table Tracking Engine.
* **Step 4**: Interactive Dining Floor Plan & Live Table Status Grid.
* **Step 5**: Automated Staff Alerting & Dispatch Center (5-Minute Waiter Rule & Table Reset).
* **Step 6**: Peak-Hour Analytics & AI Waiter Scheduling Engine.
* **Step 7**: Visual Table Zone Calibration Tool & Video Stream Source Switcher.
* **Step 8**: Verification, Testing, Polished Documentation & Production Build.
