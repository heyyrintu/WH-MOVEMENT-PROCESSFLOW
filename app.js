const laneColors = {
  "Control Tower": "#0F4C81",
  "Farukh Nagar Source Ops": "#E67E22",
  "Transport and Yard": "#C44536",
  "Destination Ops": "#148F77",
  "Exception Desk": "#6C5CE7",
};

const views = {
  transfer: [
    {
      lane: "Control Tower",
      steps: [
        {
          step: 1,
          title: "Freeze move master data",
          owner: "Control Tower and Inventory",
          control: "SKU, CBM, destination, truck sequence, and dock calendar locked before wave release.",
          output: "Approved daily move file",
        },
        {
          step: 2,
          title: "Release transfer order and load sheet",
          owner: "Control Tower",
          control: "One load sheet per truck and destination wave.",
          output: "Truck-level dispatch instruction",
        },
      ],
    },
    {
      lane: "Farukh Nagar Source Ops",
      steps: [
        {
          step: 3,
          title: "Pick to staging by wave",
          owner: "Source Operations",
          control: "Stage by approved Silani wave and truck sequence. No mixed unlabeled pallets.",
          output: "Staged inventory by route",
        },
        {
          step: 4,
          title: "Palletize, wrap, label, scan",
          owner: "Inventory and QA",
          control: "Every pallet needs pallet ID, SKU, qty, truck, and destination label.",
          output: "Ready-to-load pallets",
        },
        {
          step: 5,
          title: "Pre-load inventory validation",
          owner: "Inventory Control",
          control: "SKU, qty, and cube must match truck manifest before dock call.",
          output: "Cleared truck stack",
        },
      ],
    },
    {
      lane: "Transport and Yard",
      steps: [
        {
          step: 6,
          title: "Truck check-in and dock assignment",
          owner: "Yard and Safety",
          control: "Trailer floor check, dock lock or wheel chock, slot adherence.",
          output: "Docked truck",
        },
        {
          step: 7,
          title: "Load, scan, seal, gate-out",
          owner: "Dock Supervisor and Security",
          control: "100 percent pallet scan to manifest and seal number captured before departure.",
          output: "Dispatched truck",
        },
        {
          step: 8,
          title: "Transit and destination appointment",
          owner: "Transport",
          control: "2-hour transit assumption and live ETA communication to destination dock.",
          output: "Truck in transit",
        },
      ],
    },
    {
      lane: "Destination Ops",
      steps: [
        {
          step: 9,
          title: "Gate-in and seal verification",
          owner: "Destination Yard",
          control: "Seal must match source dispatch record.",
          output: "Authorized inbound truck",
        },
        {
          step: 10,
          title: "Unload and receipt scan",
          owner: "Destination Dock",
          control: "Blind receipt is not allowed. Every pallet must scan on unload.",
          output: "Recorded receipt",
        },
        {
          step: 11,
          title: "QC and putaway",
          owner: "Destination Operations and QA",
          control: "Putaway only to assigned Silani zone. Same-shift closure required.",
          output: "System and physical stock aligned",
        },
        {
          step: 12,
          title: "End-of-day reconciliation",
          owner: "Control Tower and Inventory",
          control: "Dispatch vs receipt vs putaway must close before next-wave approval.",
          output: "Daily signed closure",
        },
      ],
    },
  ],
  exception: [
    {
      lane: "Exception Desk",
      steps: [
        {
          step: 1,
          title: "Flag mismatch or damage",
          owner: "Any operating team",
          control: "Short, excess, wrong label, damaged pallet, or missing scan all trigger hold.",
          output: "Exception raised",
        },
        {
          step: 2,
          title: "Hold affected pallet or load line",
          owner: "Exception Desk",
          control: "Do not allow putaway or closure until recount is complete.",
          output: "Controlled hold",
        },
        {
          step: 3,
          title: "Recount and rescan",
          owner: "Inventory Control",
          control: "Recount at source or destination depending on issue location.",
          output: "Verified variance",
        },
        {
          step: 4,
          title: "Assign corrective action",
          owner: "Control Tower",
          control: "Short, excess, damage, relabel, rework, or return decision with owner and timestamp.",
          output: "Corrective action issued",
        },
        {
          step: 5,
          title: "Close and release",
          owner: "Control Tower and QA",
          control: "No carry-forward without named owner and recovery date.",
          output: "Exception log closed",
        },
      ],
    },
  ],
  controls: [
    {
      lane: "Control Tower",
      steps: [
        {
          step: "08:30",
          title: "Start-of-day review",
          owner: "Project lead, transport, source ops, destination ops",
          control: "Confirm truck roster, dock slots, wave release, and previous-day carryovers.",
          output: "Day unlocked",
        },
        {
          step: "15:00",
          title: "Midday exception review",
          owner: "Control Tower",
          control: "Check slot adherence, delayed dispatches, pending unloads, and active exceptions.",
          output: "Recovery actions",
        },
        {
          step: "22:00",
          title: "Day closure review",
          owner: "Control Tower and Inventory",
          control: "Close dispatch, receipt, putaway, and count variances before next-day release.",
          output: "Daily closure pack",
        },
      ],
    },
    {
      lane: "Transport and Yard",
      steps: [
        {
          step: "Rule 1",
          title: "Truck departure gate",
          owner: "Yard and Security",
          control: "No truck leaves without manifest, seal number, and dispatch approval.",
          output: "Compliant dispatch",
        },
        {
          step: "Rule 2",
          title: "Dock discipline",
          owner: "Dock Supervisor",
          control: "Target full-load fill rate above 90 percent on full trips.",
          output: "Cube-optimized trucks",
        },
      ],
    },
    {
      lane: "Destination Ops",
      steps: [
        {
          step: "Rule 3",
          title: "Same-shift putaway",
          owner: "Destination Ops",
          control: "Receipt must not stay un-put away into the next working cycle without escalation.",
          output: "Stable receiving lanes",
        },
        {
          step: "Rule 4",
          title: "Daily cycle count",
          owner: "Inventory Control",
          control: "Count top moved SKUs and all exception SKUs every day.",
          output: "Inventory integrity",
        },
      ],
    },
  ],
};

const phases = [
  {
    title: "Phase 1",
    dates: "Opening move window",
    focus: "Edel movement",
    cbm: 235.55,
    trips: 5,
    note: "4.71 trip equivalent at 50 CBM/trip, rounded up for planning.",
    tone: "navy",
    detail: "Move Edel inventory first with strict route segregation, label discipline, and receiving lane control.",
  },
  {
    title: "Phase 2",
    dates: "Middle move window",
    focus: "Non-mover movement",
    cbm: 1644.715,
    trips: 33,
    note: "Excludes Edel stock already allocated to Phase 1.",
    tone: "amber",
    detail: "Use the second wave to clear non-movers and static reserve stock so source congestion comes down fast.",
  },
  {
    title: "Phase 3",
    dates: "Final move window",
    focus: "Rest of inventory",
    cbm: 7119.735,
    trips: 143,
    note: "Balances the approved 9,000 CBM relocation target after Phases 1 and 2.",
    tone: "teal",
    detail: "Use the final wave for the remaining inventory, final balancing, residual sweep, count closure, and sign-off.",
  },
];

const dailySummaryCards = [
  {
    title: "Fleet Model",
    text: "10 trucks, 40 ft each, 50 CBM per trip.",
  },
  {
    title: "Trip Capacity",
    text: "20 trips/day = 1,000 CBM transport capacity per day.",
  },
  {
    title: "Required Pace",
    text: "9,000 CBM in 15 days needs 600 CBM/day, or about 12 trips/day.",
  },
  {
    title: "Trip Buffer",
    text: "8 trips/day remain as recovery buffer for congestion, delay, or receiving constraints.",
  },
];

const cycleSteps = [
  { title: "Load", detail: "3 hours at Farukh Nagar dock", color: "#0F4C81" },
  { title: "Transit", detail: "2 hours to Silani", color: "#E67E22" },
  { title: "Unload", detail: "3 hours at destination dock", color: "#148F77" },
  { title: "Return", detail: "2 hours back to source", color: "#C44536" },
  { title: "Rest", detail: "2 hours ready window", color: "#6C5CE7" },
];

const timelineItems = [
  { time: "08:30", title: "Wave release review", detail: "Trucks, docks, wave sheets, and carryover exceptions confirmed." },
  { time: "12:00", title: "Dock utilization check", detail: "Review loading pace and slot drift at Farukh Nagar." },
  { time: "15:00", title: "Transit and receipt review", detail: "Confirm ETA, gate-in, and unloading status." },
  { time: "22:00", title: "Closure review", detail: "Dispatch, receipt, putaway, and variance closure before next-day release." },
];

const readiness = [
  "Master SKU and CBM list mapped to Silani.",
  "Dock calendar locked for both source and destination.",
  "Truck roster and backup transport confirmed.",
  "Scanners, label stock, and load sheets tested.",
  "Destination zone and bin mapping frozen.",
  "Safety briefing completed across all shifts.",
];

const controls = [
  {
    title: "Scan compliance",
    text: "Every pallet scans at load and unload. No blind receipt and no manual line closure.",
  },
  {
    title: "Inventory accuracy",
    text: "Cycle count top moved SKUs and every exception SKU daily before releasing the next wave.",
  },
  {
    title: "Fast-mover protection",
    text: "Keep 2 to 3 days of fast-mover service stock at Farukh Nagar until destination lanes are stable.",
  },
  {
    title: "Dock safety",
    text: "Wheel chock or dock lock, trailer check, and no pedestrian entry into live loading lanes.",
  },
];

const kpis = [
  {
    title: "Relocation vs plan",
    text: "Daily moved CBM must stay on or above target against the 15-day relocation curve.",
  },
  {
    title: "Truck slot adherence",
    text: "Target 95 percent or better adherence to dock appointment schedule.",
  },
  {
    title: "Same-shift putaway",
    text: "Destination putaway closure should exceed 95 percent every day.",
  },
  {
    title: "Damage and variance",
    text: "Hold damage and count variance below 0.2 percent through the move period.",
  },
];

const legendLanes = [
  "Control Tower",
  "Farukh Nagar Source Ops",
  "Transport and Yard",
  "Destination Ops",
  "Exception Desk",
];

const flowBoard = document.getElementById("flow-board");
const laneLegend = document.getElementById("lane-legend");
const dailySummary = document.getElementById("daily-summary");
const phaseGrid = document.getElementById("phase-grid");
const cycleStrip = document.getElementById("cycle-strip");
const timeline = document.getElementById("timeline");
const readinessList = document.getElementById("readiness-list");
const controlList = document.getElementById("control-list");
const kpiList = document.getElementById("kpi-list");
const tabs = document.querySelectorAll(".tab");

function renderLegend() {
  laneLegend.innerHTML = legendLanes
    .map(
      (lane) => `
        <span class="legend-pill">
          <span class="legend-dot" style="background:${laneColors[lane] || "#0F4C81"}"></span>
          ${lane}
        </span>
      `
    )
    .join("");
}

function renderFlow(viewKey) {
  const lanes = views[viewKey];
  flowBoard.innerHTML = lanes
    .map(
      (laneGroup) => `
        <section class="lane">
          <div class="lane-head">
            <div class="lane-title-wrap">
              <span class="legend-dot" style="background:${laneColors[laneGroup.lane] || "#0F4C81"}"></span>
              <h3>${laneGroup.lane}</h3>
            </div>
            <span>${laneGroup.steps.length} step${laneGroup.steps.length > 1 ? "s" : ""}</span>
          </div>
          <div class="lane-track">
            ${laneGroup.steps
              .map(
                (item, index) => `
                  <article class="flow-card" style="--accent:${laneColors[laneGroup.lane] || "#0F4C81"}; animation-delay:${index * 60}ms">
                    <div class="flow-card-top">
                      <div class="step-badge">${item.step}</div>
                      <div>
                        <h3>${item.title}</h3>
                      </div>
                    </div>
                    <div class="flow-meta">
                      <div><strong>Owner:</strong> ${item.owner}</div>
                      <div><strong>Control:</strong> ${item.control}</div>
                      <div><strong>Output:</strong> ${item.output}</div>
                    </div>
                  </article>
                `
              )
              .join("")}
          </div>
        </section>
      `
    )
    .join("");
}

function renderPhases() {
  phaseGrid.innerHTML = phases
    .map(
      (phase) => `
        <article class="phase-card tone-${phase.tone}">
          <p class="section-kicker">${phase.dates}</p>
          <h3>${phase.title}</h3>
          <p class="phase-focus">${phase.focus}</p>
          <div class="phase-metrics">
            <div class="phase-metric">
              <span>CBM</span>
              <strong>${phase.cbm.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</strong>
            </div>
            <div class="phase-metric">
              <span>Trips</span>
              <strong>${phase.trips}</strong>
            </div>
          </div>
          <p>${phase.detail}</p>
          <p class="phase-note">${phase.note}</p>
        </article>
      `
    )
    .join("");
}

function renderDailySummary() {
  dailySummary.innerHTML = dailySummaryCards
    .map(
      (item) => `
        <article class="summary-card">
          <h3>${item.title}</h3>
          <p>${item.text}</p>
        </article>
      `
    )
    .join("");
}

function renderCycle() {
  cycleStrip.innerHTML = cycleSteps
    .map(
      (step) => `
        <article class="cycle-card" style="border-top:6px solid ${step.color}">
          <h3>${step.title}</h3>
          <p>${step.detail}</p>
        </article>
      `
    )
    .join("");
}

function renderTimeline() {
  timeline.innerHTML = timelineItems
    .map(
      (item) => `
        <article class="timeline-item">
          <strong>${item.time}</strong>
          <div>
            <h3>${item.title}</h3>
            <p>${item.detail}</p>
          </div>
        </article>
      `
    )
    .join("");
}

function renderReadiness() {
  readinessList.innerHTML = readiness.map((item) => `<li>${item}</li>`).join("");
}

function renderControls() {
  controlList.innerHTML = controls
    .map(
      (item) => `
        <article class="control-item">
          <h3>${item.title}</h3>
          <p>${item.text}</p>
        </article>
      `
    )
    .join("");
}

function renderKpis() {
  kpiList.innerHTML = kpis
    .map(
      (item) => `
        <article class="kpi-item">
          <h3>${item.title}</h3>
          <p>${item.text}</p>
        </article>
      `
    )
    .join("");
}

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((button) => {
      button.classList.remove("active");
      button.setAttribute("aria-selected", "false");
    });
    tab.classList.add("active");
    tab.setAttribute("aria-selected", "true");
    renderFlow(tab.dataset.view);
  });
});

renderLegend();
renderFlow("transfer");
renderDailySummary();
renderPhases();
renderCycle();
renderTimeline();
renderReadiness();
renderControls();
renderKpis();
