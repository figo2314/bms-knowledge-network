# Design

## Intent

BMS Atlas is a premium technical workspace and public portfolio. The interface should feel like a refined control room: dense enough for engineering work, polished enough to demonstrate personal taste and professional credibility.

## Visual Language

- Primary mode: executive dark control surface with graphite material, restrained copper signature color, precise hairline borders, and compact product density.
- Alternate demos: light studio and signal lab.
- Layout: narrow persistent left navigation, dossier-style command header, editable graph workspace, inspector panel, multi-chiller 3D staging module, brand library, and power-management analytics.
- Shape system: 7 to 8 px radius for product surfaces, square technical tags for metadata, full pill only for 3D plant labels.
- Motion: functional and restrained. Motion should communicate selection, flow, staging, fault state, or plant operation.

## Color

Use OKLCH custom properties in `src/styles.css`.

- Background: near-black neutral stage.
- Surface: dark graphite and blue-gray panels.
- Primary: warm red-orange, used for author signature, primary actions, and optimization emphasis.
- Accent: cyan-green, used for focus, active connections, and live system indicators.
- Brand colors: vendor-specific node accents, never used as global theme colors.

## Typography

Use a system sans stack for reliability and product clarity. Large hero type is reserved for the public portfolio header. Editing surfaces use compact product UI sizing with high contrast and readable labels.

## Components

- Device nodes: brand-accented, compact, draggable, connectable, with visible layer/protocol metadata.
- Inspector: direct manipulation for device name, layer, brand, protocol, role, I/O, and notes.
- Graph toolbar: search, brand filtering, protocol selection, add, reset.
- Chiller plant: Three.js scene with three chillers, CHW pumps, condenser pumps, cooling towers, headers, valves, sensors, BTU meter, DP sensor, orbit control, animated flow particles, and add/remove machine staging modes.
- Power management: KPI summary, meter-to-insight flow, zone demand table.
- Data architecture: trend collection pipeline, SQL Server repository, schema map, retention and reporting risks.

## Accessibility

All visible website content is English. Maintain WCAG AA contrast, visible focus rings, readable inspector fields, reduced-motion fallback, and non-color-only status cues where possible.
