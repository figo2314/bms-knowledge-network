# BMS Knowledge Network

Personal knowledge workspace and engineering showcase for BMS, ELV, HVAC controls, VAV systems, psychrometrics, power management, and data architecture.

## Current Demo

The main interactive deliverable is the standalone Three.js digital twin:

- `atec-vav-simulator.html` - Siemens BACnet ATEC 550-445 VAV digital twin
- `VAV/` - source reference documents used for the VAV and psychrometric teaching content
- `src/` - React-based BMS Atlas workspace shell

The VAV simulator runs directly from Vite and imports Three.js modules through the import map in the HTML file.

```powershell
npm install
npm run dev
```

Open `http://127.0.0.1:5173/atec-vav-simulator.html` unless Vite selects another port.

## Scope

The simulator demonstrates:

- A large AHU with fan, cooling coil valve (CV), heating coil valve (HV), outdoor air, return air, mixed air, and supply air temperatures
- A long, reducing main supply trunk with sequential branch take-offs
- Three smaller VAV terminals: 2860 cooling only, 2862 three-stage electric heat, and 2863 hot-water reheat
- A controllable manual branch VCD on each branch
- Pitot differential pressure airflow calculation and pressure-independent VAV control
- Discrete PID control with actuator lag and static-pressure reset
- Live psychrometric process points and an expandable holographic chart
- Three.js WebGL geometry, selective bloom, DOM/CSS2D HUD labels, and orbit controls

## Engineering Note

This is an educational digital twin, not a commissioning tool or a substitute for approved Siemens application documentation, design calculations, TAB data, or life-safety sequences. All physical constants and simplified zone/coil models should be reviewed before using the project for formal engineering decisions.

See [`AI_AGENT_HANDOFF.md`](AI_AGENT_HANDOFF.md) before making changes.
