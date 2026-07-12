# AI Agent Handoff: BMS Knowledge Network

## 1. Mission

This repository is a personal BMS/ELV knowledge network and portfolio platform owned by Figo Cao. It is intended to explain engineering relationships visually, support personal review, and demonstrate practical HVAC controls knowledge to employers, clients, colleagues, and students.

The work should remain technically serious. Visual polish is important, but it must not hide incorrect topology, units, control sequences, sensor relationships, or safety assumptions.

## 2. Important Files

| File or folder | Role |
| --- | --- |
| `atec-vav-simulator.html` | Main standalone Three.js VAV digital twin. This is the highest-priority interactive surface. |
| `src/App.tsx` | React BMS Atlas workspace shell with knowledge-network modules. |
| `src/styles.css` | Workspace design tokens and UI styling. |
| `VAV/` | Reference PDFs for psychrometry, variable-volume systems, energy saving/building pressurization, and building control systems. |
| `PRODUCT.md` | Product intent, users, and core product areas. |
| `DESIGN.md` | Visual language and interaction principles. |
| `BACKLOG.md` | Existing product backlog and improvement notes. |
| `assets/` | Local visual references used by the project. |

## 3. How to Run

Requirements: Node.js and npm.

```powershell
npm install
npm run dev
```

Then open:

```text
http://127.0.0.1:5174/atec-vav-simulator.html
```

Production build:

```powershell
npm run build
```

The simulator is a single HTML file with a module script. It uses the Three.js import map to load `three` and `three/addons/` from the pinned `0.172.0` CDN path. The React workspace is built by Vite from `src/main.tsx`.

## 4. Current VAV Topology

The 3D layout uses metres as scene units. The intended physical hierarchy is:

```text
AHU / plug fan / CV-HV coil sections
          |
          +-- reducing main supply trunk ------------------------------+
                 | sequential branch take-offs                         |
                 +-- manual VCD -- VAV-01 / 2860 -- diffuser -- Zone 01 |
                 +-- manual VCD -- VAV-02 / 2862 -- diffuser -- Zone 02 |
                 +-- manual VCD -- VAV-03 / 2863 -- diffuser -- Zone 03
```

The branch VAVs are deliberately smaller than the AHU and rooms. They are not three equal-size boxes in a row. Each branch VCD is an interactive balancing damper whose actual opening affects branch pressure loss, VAV differential pressure, and pitot flow.

## 5. Main Runtime State

`atec-vav-simulator.html` keeps the simulation state in one `state` object.

- `state.fan`, `state.sa`, `state.ra`, `state.fa`: actuator targets and actual values
- `state.vav`: selected terminal damper target and actual value
- `state.vcd`: selected branch manual VCD target and actual value
- `state.auxVavs`: VAV-02 and VAV-03 state objects
- `state.supervisory`: fan pressure reset, outdoor air, relief, SAT reset, building pressure, and demand ventilation values
- `state.airside`: CV/HV target and actual values plus RA, MA, AHU SAT and humidity-ratio state points
- `state.physics`: fan pressure, duct pressure, branch VCD pressure drop, VAV dP, airflow, room flow, outdoor airflow, RPM, and duct velocity

All visible website copy is English. Keep new UI copy English as well.

## 6. Core Engineering Models

### Fan and main duct

Fan total pressure follows the fan-speed square law:

```text
Fan pressure = FAN_PRESSURE_MAX * (fan speed / 100)^2
```

The main trunk currently uses a 1200 x 600 mm design section (`MAIN_DUCT_AREA = 0.72 m2`) and reduces downstream after branch take-offs. Main duct velocity is calculated from total VAV pitot flow.

### VCD and VAV flow

The VCD has a nonlinear conductance based on its actual opening. Its branch pressure loss reduces the pressure available to the VAV damper. The VAV damper then uses a nonlinear circular-damper coefficient and pitot-style relationship:

```text
VAV dP = available branch pressure * damper coefficient^2
VAV flow = VAV_FLOW_COEFF * sqrt(VAV dP)
Room flow = VAV flow * flow coefficient
```

This is still a teaching model. It is not a replacement for a manufacturer K-factor, box size table, duct fitting loss calculation, or TAB measurement.

### PID and actuator lag

Each terminal has independent PID values and a 90-second VAV actuator stroke assumption. PID output adjusts the damper target; actual damper movement is ramped in the animation loop. The VCD is also ramped to make manual balancing changes visible without instantaneous jumps.

### Airside temperature chain

The runtime derives the following chain:

```text
Outdoor air temperature / RH
        + return air temperature / humidity ratio
        -> mixed air temperature / humidity ratio
        -> AHU cooling valve CV or heating valve HV
        -> AHU supply air temperature
        -> terminal reheat for 2862 or 2863
        -> VAV supply air temperature / zone response
```

CV and HV are mutually exclusive around the SAT setpoint. `satBaseSetpoint` is the operator base value, while the supervisory SAT reset can trim the active setpoint.

### Psychrometrics

The chart is derived from the same runtime state rather than static sample values. It plots outdoor air, return air, mixed air, AHU supply air, VAV supply air, and selected zone air. The psychrometric panel can be clicked or expanded with the `Expand` button. Escape or the backdrop closes it.

## 7. Three.js Scene Rules

- Use `THREE.BoxGeometry`/`CylinderGeometry`/`TubeGeometry` for equipment and ducts.
- Keep model proportions credible. Do not enlarge VAV terminals merely to make labels easier to read.
- Use selective bloom only for neon duct edges, particles, heating elements, and active signals. DOM labels and equipment shells must remain sharp.
- Keep the camera target broad enough to show AHU, main trunk, sequential take-offs, all VAVs, and the rooms.
- Keep HUD cards outside equipment clearance areas. Cards should remain anchored with leader lines and prefer lanes above or below the real 3D anchor.
- Preserve left-mouse orbit, wheel zoom, and right-mouse pan behavior from OrbitControls.
- Keep supply air physically layered: the main rectangular supply trunk runs above the room roofs, each VAV terminal branch stays above the ceiling plane, and each room is fed through a dedicated spiral round drop into its ceiling outlet.
- At viewports up to 1100px, keep the 3D scene primary: show a compact title and four key readouts, hide secondary HUD chrome, and expose the full cockpit through the touch-friendly `VAV controls` drawer.
- The simulator display toolbar can hide/show the intro card, psychrometric panel, and all live data cards; the cockpit toggle remains available independently at every viewport.

## 8. Change Protocol for Future Agents

Before editing:

1. Read this file, `PRODUCT.md`, `DESIGN.md`, and the relevant documents under `VAV/`.
2. Inspect the current runtime and browser console with a local dev server. Do not assume old screenshots represent the current layout.
3. Identify whether the requested change is visual, topology, physics, control logic, or documentation. Keep those concerns separate where possible.

After editing:

1. Run `npm run build`.
2. Check the local simulator for console errors and missing DOM IDs.
3. Test at desktop and narrow viewport sizes if the change touches HUD or cards.
4. Verify interactions: orbit, zoom, VCD slider, VAV selection, PID controls, psychrometric expansion, and system power.
5. Update this handoff file when the runtime architecture or important engineering assumptions change.

## 9. Known Caveats and Next Priorities

- The simulator uses simplified airflow coefficients and zone thermal dynamics. A future engineering pass should replace constants with a documented, manufacturer-specific K-factor model and explicit duct fitting/system-effect losses.
- The AHU airside model is a compact educational coil model. It should eventually expose coil leaving-air temperature, valve authority, minimum flow, freeze protection, discharge-air high limit, and heating/cooling interlocks as explicit sequences.
- Return-air and room-air paths are visually simplified. A future pass should add more explicit return branches and terminal discharge particle paths for all three zones.
- The single-file simulator is effective for a demo, but a future refactor should move runtime state, physics, scene construction, and HUD layout into modules with tests.
- The public GitHub repository should not contain secrets, credentials, `node_modules`, generated `dist`, or temporary logs.

## 10. Commit Guidance

Use focused commits and describe the engineering consequence, for example:

```text
feat(vav): add sequential branch topology and manual VCD pressure loss
feat(ahu): connect CV/HV temperature chain to psychrometrics
fix(hud): reserve vertical card lanes around 3D equipment
docs: update AI agent handoff assumptions
```
