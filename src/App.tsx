import {
  Background,
  Controls,
  Handle,
  MarkerType,
  MiniMap,
  Position,
  ReactFlow,
  addEdge,
  useEdgesState,
  useNodesState,
  type Connection,
  type Edge,
  type Node,
  type NodeProps,
} from "@xyflow/react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Html, Line, OrbitControls, PerspectiveCamera } from "@react-three/drei";
import {
  Briefcase,
  BookOpen,
  Cable,
  CheckCircle2,
  ClipboardList,
  Cpu,
  Database,
  Download,
  ExternalLink,
  FileClock,
  Factory,
  Gauge,
  GitBranch,
  Layers3,
  LineChart,
  Maximize2,
  Network,
  Plus,
  PlugZap,
  RotateCcw,
  Save,
  Search,
  Share2,
  SlidersHorizontal,
  TrendingUp,
  Thermometer,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Mesh } from "three";

type ThemeName = "executive" | "studio" | "signal";
type PlantStage = "base" | "shoulder" | "peak" | "rotation" | "fault";

type DeviceData = Record<string, unknown> & {
  label: string;
  kind: string;
  brand: string;
  protocol: string;
  layer: string;
  role: string;
  io: string;
  note: string;
  evidence?: string[];
};

type DeviceNode = Node<DeviceData, "device">;
type DeviceEdge = Edge<Record<string, unknown>>;

const storageKey = "bms-knowledge-network-v1";

const brandColors: Record<string, string> = {
  Siemens: "brand-siemens",
  Honeywell: "brand-honeywell",
  "Johnson Controls": "brand-jci",
  Schneider: "brand-schneider",
  Belimo: "brand-belimo",
  Danfoss: "brand-danfoss",
  "Generic / Concept": "brand-generic",
};

const protocols = [
  "BACnet/IP",
  "BACnet MS/TP",
  "Modbus TCP",
  "Modbus RTU",
  "KNX",
  "LonWorks",
  "M-Bus",
  "OPC UA",
  "MQTT",
  "Hardwired I/O",
];

const layers = ["Server", "IP Network", "FLN", "Field Controller", "Field Device", "Sensor", "Actuator"];

const portfolioSummary = {
  roles: ["BMS Engineer", "ELV Engineer", "Controls Integration", "Smart Building Specialist"],
  strengths: [
    "BMS topology modeling",
    "BACnet / Modbus integration",
    "Chiller plant sequencing",
    "Power metering and SQL trend architecture",
  ],
  stack: ["React", "TypeScript", "React Flow", "Three.js", "SQL Server concepts"],
  protocols: ["BACnet/IP", "BACnet MS/TP", "Modbus TCP/RTU", "OPC UA", "M-Bus", "Hardwired I/O"],
  proof: ["Interactive topology", "3D plant simulation", "Energy reporting layer", "Trend and database schema"],
};

const caseStudies = [
  {
    title: "Mixed BACnet / Modbus Integration",
    summary: "Multi-brand controller and meter integration with discovery, routing, register mapping, and timeout diagnosis.",
    problem: "A site needs one BMS view across BACnet/IP controllers, MS/TP trunks, and Modbus energy meters.",
    system: "BACnet/IP backbone, MS/TP field controllers, Modbus RTU meters, server trends, alarm routing.",
    action: "Map each network layer, verify UDP 47808 routing, check MS/TP MAC and baud rate, normalize register scale and data type.",
    result: "A repeatable commissioning path that separates IP, trunk, and register faults instead of treating all failures as device issues.",
    evidence: ["VLAN / BBMD checklist", "MS/TP parameter sheet", "Modbus register offset examples"],
  },
  {
    title: "Chiller Plant Lead-Lag and Fault Recovery",
    summary: "Plant sequence model for staging, minimum runtime, lead rotation, low-flow detection, and standby equipment start.",
    problem: "Operators need to understand when the second chiller starts and how the plant reacts to equipment lockout.",
    system: "Three chillers, CHW pumps, condenser pumps, cooling towers, DP sensor, BTU meter, valves, status points.",
    action: "Model operating modes, encode lead-lag behavior, expose plant load, flow, delta T, and tower state in the interface.",
    result: "The sequence becomes inspectable: base load, shoulder load, peak demand, rotation, and fault recovery are all visible.",
    evidence: ["Sequence of operation summary", "CHWS / CHWR / DP point list", "Fault recovery scenario"],
  },
  {
    title: "Power Metering to SQL Reporting",
    summary: "Meter collection, demand windows, quality checks, zone aggregation, and SQL-backed reports for energy insight.",
    problem: "Raw kWh and kVA values are difficult to use unless meter intervals, multipliers, and timestamps are trusted.",
    system: "Modbus meters, CT ratios, 15-minute interval data, zone mapping, SQL trend and report tables.",
    action: "Define register normalization, mark data quality risks, aggregate meters by zone, and separate trend, alarm, and audit tables.",
    result: "Energy data is presented as operational evidence: peak demand, consumption, tenant profile, and report reliability.",
    evidence: ["CT ratio and multiplier checks", "MeterIntervals schema", "Monthly tenant report outline"],
  },
];

const initialNodes: DeviceNode[] = [
  {
    id: "server",
    type: "device",
    position: { x: 40, y: 120 },
    data: {
      label: "BMS Server",
      kind: "Supervisor",
      brand: "Generic / Concept",
      protocol: "BACnet/IP",
      layer: "Server",
      role: "Graphics, trend, alarm, schedule, user access",
      io: "Database / workstation / web client",
      note: "Public portfolio view starts here: this node shows the whole system context.",
      evidence: ["Operator graphics and alarm workflow", "Trend retention and reporting path", "User access and audit trail boundary"],
    },
  },
  {
    id: "ip",
    type: "device",
    position: { x: 300, y: 90 },
    data: {
      label: "BACnet/IP Backbone",
      kind: "Network",
      brand: "Generic / Concept",
      protocol: "BACnet/IP",
      layer: "IP Network",
      role: "High-level integration between server, routers, and plant controllers",
      io: "Ethernet / VLAN / IP addressing",
      note: "Use this layer to teach routing, BBMD, subnet planning, and cyber hygiene.",
      evidence: ["UDP 47808 and BBMD planning", "VLAN and subnet discovery path", "Ping, Wireshark, BACnet Who-Is checks"],
    },
  },
  {
    id: "router",
    type: "device",
    position: { x: 570, y: 60 },
    data: {
      label: "PXC / Network Controller",
      kind: "Controller",
      brand: "Siemens",
      protocol: "BACnet MS/TP",
      layer: "FLN",
      role: "Routes IP traffic to field-level networks",
      io: "Ethernet + RS-485 trunk",
      note: "Great place to store brand-specific controller families and commissioning steps.",
      evidence: ["Baud rate, MAC address, max master", "RS-485 termination and shield grounding", "Trunk timeout and duplicate MAC diagnosis"],
    },
  },
  {
    id: "ahu",
    type: "device",
    position: { x: 850, y: 20 },
    data: {
      label: "AHU Controller",
      kind: "Field Controller",
      brand: "Honeywell",
      protocol: "BACnet MS/TP",
      layer: "Field Controller",
      role: "Controls fan, valve, damper, filter status, discharge temperature",
      io: "AI x4 / AO x3 / DI x5 / DO x4",
      note: "Attach sequence of operation, point schedule, and troubleshooting notes here.",
      evidence: ["AI/AO/DI/DO point schedule", "Supply air temperature loop", "Fan proof, filter, and damper interlock checks"],
    },
  },
  {
    id: "vav",
    type: "device",
    position: { x: 850, y: 220 },
    data: {
      label: "VAV Box Controller",
      kind: "Terminal Controller",
      brand: "Johnson Controls",
      protocol: "BACnet MS/TP",
      layer: "Field Controller",
      role: "Airflow loop, reheat valve, occupancy mode",
      io: "Flow sensor / actuator / reheat output",
      note: "Useful for explaining pressure independent control and balancing.",
      evidence: ["Airflow calibration and box constants", "Occupancy and reheat sequence", "Balancing and pressure-independent control notes"],
    },
  },
  {
    id: "chiller",
    type: "device",
    position: { x: 590, y: 330 },
    data: {
      label: "Chiller Plant Gateway",
      kind: "Plant Integration",
      brand: "Schneider",
      protocol: "Modbus TCP",
      layer: "Field Device",
      role: "Collects chiller, pump, meter, and tower data",
      io: "TCP device map / register table",
      note: "Connect this to the 3D plant model and real register explanations.",
      evidence: ["Modbus address, function code, data type", "Lead-lag and minimum runtime checks", "Delta T, flow, and lockout signals"],
    },
  },
  {
    id: "sensor",
    type: "device",
    position: { x: 1120, y: 100 },
    data: {
      label: "Duct Temperature Sensor",
      kind: "Sensor",
      brand: "Generic / Concept",
      protocol: "Hardwired I/O",
      layer: "Sensor",
      role: "Measures supply or return air temperature",
      io: "10K NTC / PT1000 / 0-10V",
      note: "Add wiring diagrams, calibration checks, and bad-reading symptoms.",
      evidence: ["Sensor type and scaling check", "Calibration offset record", "Bad reading symptoms and wiring checks"],
    },
  },
  {
    id: "actuator",
    type: "device",
    position: { x: 1130, y: 300 },
    data: {
      label: "Valve Actuator",
      kind: "Actuator",
      brand: "Belimo",
      protocol: "Hardwired I/O",
      layer: "Actuator",
      role: "Modulates chilled water valve position",
      io: "0-10V command / 2-10V feedback",
      note: "Good example for fail-safe direction, manual override, and stroke time.",
      evidence: ["Command and feedback comparison", "Fail-safe direction and stroke time", "Manual override and valve authority notes"],
    },
  },
  {
    id: "meter-gateway",
    type: "device",
    position: { x: 310, y: 475 },
    data: {
      label: "Power Meter Collection",
      kind: "Energy Gateway",
      brand: "Schneider",
      protocol: "Modbus RTU",
      layer: "Field Device",
      role: "Collects kWh, kVA, kW, PF, voltage, current, and demand data",
      io: "RS-485 trunk / register map / interval logging",
      note: "Use this node to explain meter polling, demand window, data quality, and tenant or zone aggregation.",
      evidence: ["CT ratio and multiplier validation", "Register offset and data type checks", "Demand window and missing interval handling"],
    },
  },
  {
    id: "zone-energy",
    type: "device",
    position: { x: 590, y: 520 },
    data: {
      label: "Zone Demand Analytics",
      kind: "Power Management",
      brand: "Generic / Concept",
      protocol: "OPC UA",
      layer: "Server",
      role: "Calculates area kVA peak, kWh consumption, and operating profile",
      io: "15-minute interval data / tariff period / report tags",
      note: "This turns raw meter data into management insight for zones, tenants, plant rooms, and distribution boards.",
      evidence: ["Area and tenant meter aggregation", "kVA peak versus kWh explanation", "Tariff period and load profile report"],
    },
  },
  {
    id: "trend-log",
    type: "device",
    position: { x: 860, y: 475 },
    data: {
      label: "Trend Log Objects",
      kind: "Historical Data",
      brand: "Generic / Concept",
      protocol: "BACnet/IP",
      layer: "Server",
      role: "Stores sampled point values, change-of-value records, and runtime history",
      io: "Trend interval / COV threshold / buffer size / retention rule",
      note: "Use this node to explain what should be trended, how often, why COV matters, and how bad trend design overloads a system.",
      evidence: ["Sampling interval and COV policy", "Database growth estimate", "Quality flag and retention rule"],
    },
  },
  {
    id: "sql-server",
    type: "device",
    position: { x: 1130, y: 470 },
    data: {
      label: "SQL Server Database",
      kind: "Database",
      brand: "Generic / Concept",
      protocol: "SQL / ODBC",
      layer: "Server",
      role: "Stores alarms, events, trends, energy records, audit logs, and reporting data",
      io: "Tables / indexes / backup / retention / archive",
      note: "This is where BMS knowledge becomes data engineering: schema, retention, query performance, backup, and report reliability.",
      evidence: ["TrendSamples and MeterIntervals schema", "point_id + timestamp index strategy", "Backup, restore, archive, and report performance"],
    },
  },
];

const initialEdges: DeviceEdge[] = [
  edge("server-ip", "server", "ip", "BACnet/IP"),
  edge("ip-router", "ip", "router", "BACnet/IP"),
  edge("router-ahu", "router", "ahu", "BACnet MS/TP"),
  edge("router-vav", "router", "vav", "BACnet MS/TP"),
  edge("ip-chiller", "ip", "chiller", "Modbus TCP"),
  edge("ahu-sensor", "ahu", "sensor", "AI"),
  edge("ahu-actuator", "ahu", "actuator", "AO"),
  edge("ip-meter-gateway", "ip", "meter-gateway", "Modbus RTU"),
  edge("meter-zone-energy", "meter-gateway", "zone-energy", "OPC UA"),
  edge("zone-energy-trend", "zone-energy", "trend-log", "Trend Collection"),
  edge("trend-sql", "trend-log", "sql-server", "SQL / ODBC"),
];

function edge(id: string, source: string, target: string, label: string): DeviceEdge {
  return {
    id,
    source,
    target,
    label,
    type: "smoothstep",
    markerEnd: { type: MarkerType.ArrowClosed },
    data: { protocol: label },
  };
}

function DeviceNodeView({ data, selected }: NodeProps<DeviceNode>) {
  const brandClass = brandColors[data.brand] ?? brandColors["Generic / Concept"];

  return (
    <div className={`device-node ${brandClass} ${selected ? "is-selected" : ""}`}>
      <Handle type="target" position={Position.Left} />
      <div className="node-topline">
        <span>{data.layer}</span>
        <span>{data.protocol}</span>
      </div>
      <strong>{data.label}</strong>
      <p>{data.kind}</p>
      <div className="node-brand">{data.brand}</div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
}

const nodeTypes = { device: DeviceNodeView };

function loadSavedState() {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { nodes: DeviceNode[]; edges: DeviceEdge[] };
    if (!Array.isArray(parsed.nodes) || !Array.isArray(parsed.edges)) return null;
    return parsed;
  } catch {
    return null;
  }
}

function PortfolioStack({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="portfolio-stack">
      <span>{title}</span>
      <div>
        {items.map((item) => (
          <strong key={item}>{item}</strong>
        ))}
      </div>
    </section>
  );
}

export default function App() {
  const saved = useMemo(() => loadSavedState(), []);
  const [nodes, setNodes, onNodesChange] = useNodesState<DeviceNode>(saved?.nodes ?? initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<DeviceEdge>(saved?.edges ?? initialEdges);
  const [selectedNodeId, setSelectedNodeId] = useState<string>("server");
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
  const [connectionProtocol, setConnectionProtocol] = useState("BACnet MS/TP");
  const [theme, setTheme] = useState<ThemeName>("executive");
  const [brandFilter, setBrandFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [plantStage, setPlantStage] = useState<PlantStage>("shoulder");
  const [notice, setNotice] = useState<{ message: string; tone: "success" | "warning" } | null>(null);
  const noticeTimer = useRef<number | null>(null);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const showNotice = useCallback((message: string, tone: "success" | "warning" = "success") => {
    setNotice({ message, tone });
    if (noticeTimer.current) {
      window.clearTimeout(noticeTimer.current);
    }
    noticeTimer.current = window.setTimeout(() => setNotice(null), 3200);
  }, []);

  const selectedNode = nodes.find((node) => node.id === selectedNodeId);
  const selectedEdge = edges.find((item) => item.id === selectedEdgeId);

  const filteredNodes = useMemo(() => {
    return nodes.map((node) => {
      const matchesBrand = brandFilter === "All" || node.data.brand === brandFilter;
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        [node.data.label, node.data.kind, node.data.brand, node.data.protocol, node.data.layer]
          .join(" ")
          .toLowerCase()
          .includes(q);

      return {
        ...node,
        hidden: !matchesBrand || !matchesQuery,
      };
    });
  }, [brandFilter, nodes, query]);

  const visibleNodeCount = filteredNodes.filter((node) => !node.hidden).length;

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((currentEdges) =>
        addEdge(
          {
            ...connection,
            id: `${connection.source}-${connection.target}-${Date.now()}`,
            type: "smoothstep",
            label: connectionProtocol,
            markerEnd: { type: MarkerType.ArrowClosed },
            data: { protocol: connectionProtocol },
          },
          currentEdges,
        ),
      );
    },
    [connectionProtocol, setEdges],
  );

  const updateSelectedNode = (patch: Partial<DeviceData>) => {
    if (!selectedNode) return;
    setNodes((currentNodes) =>
      currentNodes.map((node) =>
        node.id === selectedNode.id ? { ...node, data: { ...node.data, ...patch } } : node,
      ),
    );
  };

  const updateSelectedEdge = (protocol: string) => {
    if (!selectedEdge) return;
    setEdges((currentEdges) =>
      currentEdges.map((item) =>
        item.id === selectedEdge.id ? { ...item, label: protocol, data: { ...item.data, protocol } } : item,
      ),
    );
  };

  const addDevice = () => {
    const id = `device-${Date.now()}`;
    const newNode: DeviceNode = {
      id,
      type: "device",
      selected: true,
      position: { x: 180 + Math.random() * 240, y: 180 + Math.random() * 220 },
      data: {
        label: "New Device",
        kind: "Field Device",
        brand: "Generic / Concept",
        protocol: connectionProtocol,
        layer: "Field Device",
        role: "Describe the device role.",
        io: "Add point type or register mapping.",
        note: "Use this area for commissioning notes and learning points.",
        evidence: ["Add point schedule, protocol parameters, or commissioning proof here."],
      },
    };

    setNodes((currentNodes) => [...currentNodes.map((node) => ({ ...node, selected: false })), newNode]);
    setSelectedNodeId(id);
    setSelectedEdgeId(null);
    showNotice("New device added and selected.");
  };

  const saveGraph = () => {
    try {
      localStorage.setItem(storageKey, JSON.stringify({ nodes, edges }));
      showNotice("Saved locally.");
    } catch {
      showNotice("Save failed. Browser storage may be unavailable.", "warning");
    }
  };

  const resetGraph = () => {
    if (!window.confirm("Reset the knowledge graph to the built-in portfolio example?")) return;
    setNodes(initialNodes);
    setEdges(initialEdges);
    setSelectedNodeId("server");
    setSelectedEdgeId(null);
    localStorage.removeItem(storageKey);
    showNotice("Graph reset to portfolio example.", "warning");
  };

  const exportGraph = () => {
    try {
      const blob = new Blob([JSON.stringify({ nodes, edges }, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "bms-knowledge-network.json";
      anchor.click();
      URL.revokeObjectURL(url);
      showNotice("JSON export started.");
    } catch {
      showNotice("Export failed. Check browser download permissions.", "warning");
    }
  };

  return (
    <main className="app-shell">
      <aside className="left-rail">
        <div className="brand-mark">
          <div className="mark-core">
            <Network size={22} />
          </div>
          <div>
            <span>BMS Atlas</span>
            <strong>Figo Knowledge Network</strong>
          </div>
        </div>

        <nav className="rail-nav" aria-label="Workspace navigation">
          <a href="#network" className="active">
            <GitBranch size={17} />
            Network
          </a>
          <a href="#cases">
            <Briefcase size={17} />
            Cases
          </a>
          <a href="#plant">
            <Layers3 size={17} />
            Chiller 3D
          </a>
          <a href="#library">
            <Database size={17} />
            Brand Library
          </a>
          <a href="#power">
            <PlugZap size={17} />
            Power
          </a>
          <a href="#data">
            <FileClock size={17} />
            Data
          </a>
          <a href="#portfolio">
            <BookOpen size={17} />
            Portfolio
          </a>
        </nav>

        <section className="theme-switcher" aria-label="Surface modes">
          <span>Surface modes</span>
          <button className={theme === "executive" ? "selected" : ""} onClick={() => setTheme("executive")}>
            Executive Dark
          </button>
          <button className={theme === "studio" ? "selected" : ""} onClick={() => setTheme("studio")}>
            Light Studio
          </button>
          <button className={theme === "signal" ? "selected" : ""} onClick={() => setTheme("signal")}>
            Signal Lab
          </button>
        </section>

        <section className="system-score" aria-label="Knowledge coverage">
          <div>
            <span>Knowledge nodes</span>
            <strong>{nodes.length}</strong>
          </div>
          <div>
            <span>Connections</span>
            <strong>{edges.length}</strong>
          </div>
        </section>
      </aside>

      <section className="workspace">
        <header className="command-header" id="portfolio">
          <div className="command-title">
            <span className="caption">BMS Atlas / public portfolio workspace</span>
            <h1>BMS / ELV systems engineer with a visual knowledge network.</h1>
            <p>
              I model building systems as connected knowledge objects: topology, protocol, device role, control sequence, trend data, and operational risk.
            </p>
            <div className="role-strip" aria-label="Target roles">
              {portfolioSummary.roles.map((role) => (
                <span key={role}>{role}</span>
              ))}
            </div>
          </div>
          <div className="portfolio-grid" aria-label="Portfolio capability summary">
            <PortfolioStack title="Core strengths" items={portfolioSummary.strengths} />
            <PortfolioStack title="Industry stack" items={portfolioSummary.protocols} />
            <PortfolioStack title="Proof material" items={portfolioSummary.proof} />
          </div>
          <div className="hero-actions">
            <a className="button-link primary-link" href="#cases">
              <Briefcase size={17} />
              View cases
            </a>
            <a className="button-link" href="#network">
              <ExternalLink size={17} />
              Open demo
            </a>
            <a className="button-link" href="#" aria-label="Download CV placeholder">
              <Download size={17} />
              CV
            </a>
            <button className="tool-action" onClick={saveGraph}>
              <Save size={17} />
              Save
            </button>
            <button onClick={exportGraph} className="secondary tool-action">
              <Share2 size={17} />
              Export JSON
            </button>
          </div>
        </header>

        {notice && (
          <div className={`toast toast-${notice.tone}`} role="status">
            <CheckCircle2 size={17} />
            <span>{notice.message}</span>
          </div>
        )}

        <section className="network-section" id="network">
          <div className="panel-toolbar">
            <div className="search-box">
              <Search size={16} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search device, brand, protocol"
              />
            </div>
            <label>
              Brand
              <select value={brandFilter} onChange={(event) => setBrandFilter(event.target.value)}>
                <option>All</option>
                {Object.keys(brandColors).map((brand) => (
                  <option key={brand}>{brand}</option>
                ))}
              </select>
            </label>
            <label>
              New link protocol
              <select value={connectionProtocol} onChange={(event) => setConnectionProtocol(event.target.value)}>
                {protocols.map((protocol) => (
                  <option key={protocol}>{protocol}</option>
                ))}
              </select>
            </label>
            <button onClick={addDevice}>
              <Plus size={17} />
              Add device
            </button>
            <button className="quiet" onClick={resetGraph} aria-label="Reset graph">
              <RotateCcw size={17} />
            </button>
          </div>

          <div className="graph-layout">
            <div className="graph-canvas">
              <ReactFlow
                nodes={filteredNodes}
                edges={edges}
                nodeTypes={nodeTypes}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                fitView
                minZoom={0.35}
                maxZoom={1.6}
                onNodeClick={(_, node) => {
                  setSelectedNodeId(node.id);
                  setSelectedEdgeId(null);
                }}
                onEdgeClick={(_, edgeItem) => {
                  setSelectedEdgeId(edgeItem.id);
                  setSelectedNodeId("");
                }}
                onPaneClick={() => {
                  setSelectedEdgeId(null);
                }}
                proOptions={{ hideAttribution: true }}
              >
                <Background color="var(--graph-grid)" gap={24} />
                <MiniMap
                  pannable
                  zoomable
                  bgColor="oklch(0.11 0.01 250)"
                  maskColor="oklch(0.06 0 0 / 0.54)"
                  nodeColor="oklch(0.38 0.04 250)"
                  nodeStrokeColor="oklch(0.66 0.09 188)"
                  nodeStrokeWidth={2}
                />
                <Controls />
              </ReactFlow>
              {visibleNodeCount === 0 && (
                <div className="empty-state">
                  <Search size={18} />
                  <strong>No matching devices</strong>
                  <span>Clear the search or switch brand filter back to All.</span>
                </div>
              )}
            </div>

            <aside className="inspector">
              <div className="inspector-title">
                <SlidersHorizontal size={17} />
                <strong>{selectedEdge ? "Connection Inspector" : "Device Inspector"}</strong>
              </div>

              {selectedEdge ? (
                <div className="form-stack">
                  <label>
                    Protocol
                    <select
                      value={String(selectedEdge.data?.protocol ?? selectedEdge.label ?? "")}
                      onChange={(event) => updateSelectedEdge(event.target.value)}
                    >
                      {protocols.map((protocol) => (
                        <option key={protocol}>{protocol}</option>
                      ))}
                      <option>AI</option>
                      <option>AO</option>
                      <option>DI</option>
                      <option>DO</option>
                    </select>
                  </label>
                  <p className="hint">
                    Select any connection to update its protocol. This area can later include cable type, baud rate, IP subnet, MSTP MAC, polling interval, and register map.
                  </p>
                </div>
              ) : selectedNode ? (
                <div className="form-stack">
                  <label>
                    Device name
                    <input
                      value={selectedNode.data.label}
                      onChange={(event) => updateSelectedNode({ label: event.target.value })}
                    />
                  </label>
                  <label>
                    Layer
                    <select
                      value={selectedNode.data.layer}
                      onChange={(event) => updateSelectedNode({ layer: event.target.value })}
                    >
                      {layers.map((layer) => (
                        <option key={layer}>{layer}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Brand
                    <select
                      value={selectedNode.data.brand}
                      onChange={(event) => updateSelectedNode({ brand: event.target.value })}
                    >
                      {Object.keys(brandColors).map((brand) => (
                        <option key={brand}>{brand}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Protocol
                    <select
                      value={selectedNode.data.protocol}
                      onChange={(event) => updateSelectedNode({ protocol: event.target.value })}
                    >
                      {protocols.map((protocol) => (
                        <option key={protocol}>{protocol}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Role
                    <textarea
                      value={selectedNode.data.role}
                      onChange={(event) => updateSelectedNode({ role: event.target.value })}
                    />
                  </label>
                  <label>
                    I/O or register
                    <textarea
                      value={selectedNode.data.io}
                      onChange={(event) => updateSelectedNode({ io: event.target.value })}
                    />
                  </label>
                  <label>
                    Notes
                    <textarea
                      value={selectedNode.data.note}
                      onChange={(event) => updateSelectedNode({ note: event.target.value })}
                    />
                  </label>
                  <div className="evidence-box">
                    <div className="evidence-title">
                      <ClipboardList size={16} />
                      <strong>Engineering evidence</strong>
                    </div>
                    {(selectedNode.data.evidence?.length
                      ? selectedNode.data.evidence
                      : ["Add protocol parameters, point schedules, commissioning notes, or troubleshooting proof."]
                    ).map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="hint">Select a node or connection to edit its details.</p>
              )}
            </aside>
          </div>
        </section>

        <section className="case-panel" id="cases">
          <div className="section-heading">
            <div>
              <span className="caption">Engineering case studies</span>
              <h2>Proof that the network is based on field systems, not only concepts</h2>
            </div>
            <div className="case-proof">
              <span>{caseStudies.length} cases</span>
              <span>Problem / System / Action / Result</span>
            </div>
          </div>
          <div className="case-grid">
            {caseStudies.map((study) => (
              <article className="case-card" key={study.title}>
                <div className="case-card-head">
                  <Briefcase size={18} />
                  <div>
                    <h3>{study.title}</h3>
                    <p>{study.summary}</p>
                  </div>
                </div>
                <dl className="case-brief">
                  <div>
                    <dt>Problem</dt>
                    <dd>{study.problem}</dd>
                  </div>
                  <div>
                    <dt>System</dt>
                    <dd>{study.system}</dd>
                  </div>
                  <div>
                    <dt>Action</dt>
                    <dd>{study.action}</dd>
                  </div>
                  <div>
                    <dt>Result</dt>
                    <dd>{study.result}</dd>
                  </div>
                </dl>
                <div className="case-evidence" aria-label={`${study.title} evidence`}>
                  {study.evidence.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="plant-and-library">
          <article className="plant-panel" id="plant">
            <div className="section-heading plant-heading">
              <div>
                <span className="caption">3D plant teaching module</span>
                <h2>Multi-chiller staging and hydronic sequence simulation</h2>
              </div>
              <select value={plantStage} onChange={(event) => setPlantStage(event.target.value as PlantStage)}>
                <option value="base">Base load / one machine</option>
                <option value="shoulder">Shoulder load / two machines</option>
                <option value="peak">Peak demand / three machines</option>
                <option value="rotation">Lead-lag rotation</option>
                <option value="fault">Chiller fault / standby start</option>
              </select>
            </div>
            <PlantStageControls stage={plantStage} onStageChange={setPlantStage} />
            <div className="plant-stage">
              <ChillerPlant stage={plantStage} />
            </div>
            <PlantModeStrip stage={plantStage} />
          </article>

          <article className="library-panel" id="library">
            <div className="section-heading compact">
              <div>
                <span className="caption">Vendor-neutral knowledge base</span>
                <h2>Brand families</h2>
              </div>
              <Maximize2 size={17} />
            </div>
            <div className="brand-list">
              {[
                ["Siemens", "PXC / Desigo / P1 / BACnet", "Strong for campus-level BMS architecture."],
                ["Honeywell", "WEBs / Spyder / CIPer", "Useful for Niagara integration and mixed sites."],
                ["Johnson Controls", "Metasys / FEC / NAE", "Good reference for terminal and plant controllers."],
                ["Schneider", "EcoStruxure / AS-P / MP-C", "Strong device ecosystem and plant integration."],
                ["Belimo", "Valve / Damper / Energy Valve", "Critical actuator knowledge for field diagnosis."],
                ["Danfoss", "VFD / Hydronic control", "Good for pumps, drives, and plant energy logic."],
              ].map(([brand, family, detail]) => (
                <div className="brand-row" key={brand}>
                  <div className={`brand-dot ${brandColors[brand]}`} />
                  <div>
                    <strong>{brand}</strong>
                    <span>{family}</span>
                  </div>
                  <p>{detail}</p>
                </div>
              ))}
            </div>
          </article>
        </section>

        <PowerManagementPanel />
        <DataArchitecturePanel />
      </section>
    </main>
  );
}

function DataArchitecturePanel() {
  const trendItems = [
    {
      title: "Trend Source",
      detail: "AI, AO, BI, BO, AV, BV, meter registers, plant status, alarm counters",
      risk: "Too many high-frequency points can overload controllers and network trunks.",
    },
    {
      title: "Collection Strategy",
      detail: "Fixed interval, change of value, exception reporting, controller buffer upload",
      risk: "Poor interval design creates either blind spots or unnecessary database growth.",
    },
    {
      title: "SQL Server Layer",
      detail: "Trend tables, event tables, audit tables, indexes, backup, archive, retention policy",
      risk: "No retention plan means slow reports, large backups, and difficult recovery.",
    },
    {
      title: "Analytics Output",
      detail: "Energy dashboard, equipment runtime, comfort drift, alarm frequency, KPI reports",
      risk: "Reports are only useful when point naming, timestamps, and units are consistent.",
    },
  ];

  const tables = [
    ["TrendSamples", "timestamp, point_id, value, quality", "Time-series point history"],
    ["AlarmEvents", "event_time, priority, source, state", "Alarm investigation"],
    ["MeterIntervals", "meter_id, kwh, kva, pf, demand_window", "Energy reporting"],
    ["AuditTrail", "user, action, object, before, after", "Operation accountability"],
  ];

  return (
    <section className="data-panel" id="data">
      <div className="section-heading">
        <div>
          <span className="caption">Trend collection and database knowledge layer</span>
          <h2>From field values to SQL-backed operational intelligence</h2>
        </div>
        <div className="data-badges">
          <span>Trend Log</span>
          <span>Collection Service</span>
          <span>SQL Server</span>
        </div>
      </div>

      <div className="data-grid">
        <article className="pipeline-card">
          {trendItems.map((item, index) => (
            <div className="pipeline-step" key={item.title}>
              <div className="step-index">{index + 1}</div>
              <div>
                <strong>{item.title}</strong>
                <p>{item.detail}</p>
                <span>{item.risk}</span>
              </div>
            </div>
          ))}
        </article>

        <article className="database-card">
          <div className="database-visual">
            <Database size={38} />
            <div>
              <strong>SQL Server Repository</strong>
              <span>Normalized historical data, reports, archive, and restore strategy</span>
            </div>
          </div>
          <div className="table-map">
            {tables.map(([name, fields, use]) => (
              <div className="table-row" key={name}>
                <strong>{name}</strong>
                <span>{fields}</span>
                <p>{use}</p>
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}

function PowerManagementPanel() {
  const zones = [
    {
      name: "Tower A Office",
      meters: 18,
      kvaPeak: 1280,
      kwh: 482600,
      profile: "weekday daytime peak",
      status: "stable",
    },
    {
      name: "Retail Podium",
      meters: 32,
      kvaPeak: 860,
      kwh: 311420,
      profile: "late evening demand",
      status: "watch",
    },
    {
      name: "Chiller Plant",
      meters: 11,
      kvaPeak: 1760,
      kwh: 609300,
      profile: "weather dependent",
      status: "optimize",
    },
    {
      name: "Car Park and ELV",
      meters: 9,
      kvaPeak: 310,
      kwh: 108900,
      profile: "base load dominant",
      status: "stable",
    },
  ];

  const totalPeak = zones.reduce((sum, zone) => sum + zone.kvaPeak, 0);
  const totalKwh = zones.reduce((sum, zone) => sum + zone.kwh, 0);

  return (
    <section className="power-panel" id="power">
      <div className="section-heading">
        <div>
          <span className="caption">Power management knowledge layer</span>
          <h2>Meter collection, peak demand, and consumption intelligence</h2>
        </div>
        <div className="power-summary">
          <div>
            <span>Total kVA Peak</span>
            <strong>{totalPeak.toLocaleString()}</strong>
          </div>
          <div>
            <span>Total kWh Consumption</span>
            <strong>{totalKwh.toLocaleString()}</strong>
          </div>
        </div>
      </div>

      <div className="power-grid">
        <article className="power-flow">
          <div className="flow-step">
            <PlugZap size={22} />
            <strong>Meter Collection</strong>
            <span>Modbus RTU, Modbus TCP, M-Bus, pulse input, interval data</span>
          </div>
          <div className="flow-step">
            <Cable size={22} />
            <strong>Data Normalization</strong>
            <span>Register mapping, multiplier, CT ratio, timestamp quality</span>
          </div>
          <div className="flow-step">
            <TrendingUp size={22} />
            <strong>Zone Aggregation</strong>
            <span>Area kVA peak, kWh consumption, tariff period, tenant split</span>
          </div>
          <div className="flow-step">
            <LineChart size={22} />
            <strong>Management Insight</strong>
            <span>Demand alarms, load profile, plant efficiency, reporting</span>
          </div>
        </article>

        <article className="zone-table">
          <div className="zone-header">
            <span>Zone</span>
            <span>Meters</span>
            <span>kVA Peak</span>
            <span>kWh</span>
            <span>Profile</span>
          </div>
          {zones.map((zone) => (
            <div className={`zone-row status-${zone.status}`} key={zone.name}>
              <strong>{zone.name}</strong>
              <span>{zone.meters}</span>
              <span>{zone.kvaPeak.toLocaleString()}</span>
              <span>{zone.kwh.toLocaleString()}</span>
              <span>{zone.profile}</span>
            </div>
          ))}
        </article>
      </div>
    </section>
  );
}

const plantScenarios: Record<
  PlantStage,
  {
    label: string;
    active: number;
    lead: number;
    load: string;
    chwFlow: string;
    deltaT: string;
    tower: string;
    note: string;
    faultIndex?: number;
  }
> = {
  base: {
    label: "Base load",
    active: 1,
    lead: 0,
    load: "32%",
    chwFlow: "38%",
    deltaT: "5.8C",
    tower: "one fan VSD",
    note: "Only the lead chiller and matched pumps are enabled.",
  },
  shoulder: {
    label: "Shoulder load",
    active: 2,
    lead: 0,
    load: "64%",
    chwFlow: "66%",
    deltaT: "6.1C",
    tower: "two cells enabled",
    note: "Second chiller stages on after demand and minimum runtime are satisfied.",
  },
  peak: {
    label: "Peak demand",
    active: 3,
    lead: 0,
    load: "91%",
    chwFlow: "92%",
    deltaT: "6.5C",
    tower: "three cells enabled",
    note: "All machines are active with condenser water and tower fans tracking load.",
  },
  rotation: {
    label: "Lead-lag rotation",
    active: 2,
    lead: 1,
    load: "58%",
    chwFlow: "63%",
    deltaT: "5.9C",
    tower: "balanced runtime",
    note: "Lead machine changes to equalize runtime while maintaining chilled water supply.",
  },
  fault: {
    label: "Fault recovery",
    active: 2,
    lead: 0,
    load: "71%",
    chwFlow: "58%",
    deltaT: "8.2C",
    tower: "standby sequence",
    note: "Chiller 2 is locked out and standby equipment starts after permissive checks.",
    faultIndex: 1,
  },
};

function PlantStageControls({
  stage,
  onStageChange,
}: {
  stage: PlantStage;
  onStageChange: (stage: PlantStage) => void;
}) {
  const stages: PlantStage[] = ["base", "shoulder", "peak", "rotation", "fault"];

  return (
    <div className="staging-strip" aria-label="Chiller staging controls">
      {stages.map((item) => {
        const scenario = plantScenarios[item];
        return (
          <button
            className={stage === item ? "selected" : ""}
            key={item}
            onClick={() => onStageChange(item)}
            type="button"
          >
            <span>{scenario.label}</span>
            <strong>{scenario.active} active</strong>
          </button>
        );
      })}
    </div>
  );
}

function PlantModeStrip({ stage }: { stage: PlantStage }) {
  const scenario = plantScenarios[stage];
  const state = [
    `Plant load ${scenario.load}`,
    `CHW flow ${scenario.chwFlow}`,
    `Delta T ${scenario.deltaT}`,
    `Tower ${scenario.tower}`,
  ];

  const icons = [Factory, Gauge, Thermometer, Zap];

  return (
    <div className="mode-strip">
      {state.map((item, index) => {
        const Icon = icons[index];
        return (
          <div key={item}>
            <Icon size={17} />
            <span>{item}</span>
          </div>
        );
      })}
    </div>
  );
}

function ChillerPlant({ stage }: { stage: PlantStage }) {
  const scenario = plantScenarios[stage];
  const speed = stage === "fault" ? 0.11 : stage === "base" ? 0.1 : stage === "peak" ? 0.24 : 0.17;
  const activeIndexes = Array.from({ length: scenario.active }, (_, index) => (scenario.lead + index) % 3);
  const compact = typeof window !== "undefined" && window.innerWidth < 720;

  return (
    <Canvas shadows dpr={[1, 1.75]}>
      <PerspectiveCamera makeDefault position={compact ? [8.8, 6.6, 10.6] : [6.8, 5.4, 8.4]} fov={compact ? 52 : 43} />
      <ambientLight intensity={0.58} />
      <directionalLight position={[3, 6, 4]} intensity={2.7} castShadow />
      <Environment preset="warehouse" />
      <group rotation={[0, -0.34, 0]} scale={compact ? 0.72 : 1} position={compact ? [-0.15, -0.15, 0] : [0, 0, 0]}>
        <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.48, 0]}>
          <planeGeometry args={[10.5, 6.8]} />
          <meshStandardMaterial color="#171b21" roughness={0.82} metalness={0.1} />
        </mesh>

        <HeaderPipe label="CHWS Header" z={-2.05} color="#5db7ff" />
        <HeaderPipe label="CHWR Header" z={-1.32} color="#e8783f" />
        <HeaderPipe label="CWS Header" z={1.02} color="#27d0ba" />
        <HeaderPipe label="CWR Header" z={1.78} color="#8bd7c8" />

        {[0, 1, 2].map((index) => {
          const x = -3.25 + index * 1.55;
          const isFault = scenario.faultIndex === index;
          const isActive = activeIndexes.includes(index) && !isFault;
          const isLead = scenario.lead === index;
          return (
            <group key={index}>
              <ChillerUnit index={index} active={isActive} fault={isFault} lead={isLead} position={[x, 0, -0.1]} />
              <PumpUnit label={`CHWP-${index + 1}`} active={isActive} fault={isFault} position={[x, -0.02, -2.05]} color="#5db7ff" />
              <PumpUnit label={`CWP-${index + 1}`} active={isActive} fault={isFault} position={[x, -0.02, 1.05]} color="#27d0ba" />
              <ValveSymbol active={isActive} position={[x + 0.58, 0.12, -1.66]} color={isFault ? "#ef4444" : "#f5a15d"} />
              <ValveSymbol active={isActive} position={[x + 0.58, 0.12, 1.42]} color={isFault ? "#ef4444" : "#27d0ba"} />
              <SensorPost label={`T${index + 1}`} position={[x - 0.58, 0, -1.64]} active={isActive} />
            </group>
          );
        })}

        {[0, 1, 2].map((index) => {
          const x = 1.15 + index * 1.05;
          const active = index < scenario.active && stage !== "fault";
          return <TowerUnit key={index} index={index} active={active || (stage === "fault" && index < 2)} position={[x, 0, 1.55]} />;
        })}

        <PlantBlock label="AHU / HX Load" position={[3.25, 0.02, -1.65]} color="#d8954d" size={[1.05, 0.72, 0.72]} />
        <PlantBlock label="DP Sensor" position={[2.85, 0.1, -2.42]} color="#7dd3fc" size={[0.35, 0.45, 0.35]} />
        <PlantBlock label="BTU Meter" position={[3.95, 0.1, -1.05]} color="#d1d5db" size={[0.42, 0.42, 0.42]} />
        {!compact && (
          <Html center position={[0.35, 1.55, 2.68]} className="plant-note">
            {scenario.note}
          </Html>
        )}

        {Array.from({ length: 18 }).map((_, index) => (
          <FlowParticle
            key={`chw-${index}`}
            offset={index / 18}
            speed={speed}
            lane="supply"
            color="#5db7ff"
          />
        ))}
        {Array.from({ length: 16 }).map((_, index) => (
          <FlowParticle
            key={`return-${index}`}
            offset={index / 16}
            speed={speed * 0.9}
            lane="return"
            color="#e8783f"
          />
        ))}
        {Array.from({ length: 14 }).map((_, index) => (
          <FlowParticle
            key={`cw-${index}`}
            offset={index / 14}
            speed={speed * 0.8}
            lane="condenser"
            color="#27d0ba"
          />
        ))}
      </group>
      <OrbitControls enablePan={false} minDistance={compact ? 8 : 6.4} maxDistance={compact ? 14 : 12.5} />
    </Canvas>
  );
}

function HeaderPipe({ label, z, color }: { label: string; z: number; color: string }) {
  return (
    <group>
      <Line
        points={[
          [-4.2, 0.16, z],
          [4.15, 0.16, z],
        ]}
        color={color}
        lineWidth={5}
      />
      <Html center position={[4.35, 0.32, z]} className="plant-label small">
        {label}
      </Html>
    </group>
  );
}

function ChillerUnit({
  index,
  active,
  fault,
  lead,
  position,
}: {
  index: number;
  active: boolean;
  fault: boolean;
  lead: boolean;
  position: [number, number, number];
}) {
  const body = fault ? "#6b2020" : active ? "#c85839" : "#3a424d";
  const glow = fault ? "#ef4444" : active ? "#f1744f" : "#64748b";

  return (
    <group position={position}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.18, 0.82, 1.06]} />
        <meshStandardMaterial color={body} roughness={0.42} metalness={0.36} emissive={glow} emissiveIntensity={active || fault ? 0.12 : 0.02} />
      </mesh>
      <mesh castShadow position={[-0.38, 0.51, 0.18]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.14, 0.14, 0.62, 24]} />
        <meshStandardMaterial color="#d6dde8" roughness={0.38} metalness={0.55} />
      </mesh>
      <mesh castShadow position={[0.38, 0.51, 0.18]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.14, 0.14, 0.62, 24]} />
        <meshStandardMaterial color="#d6dde8" roughness={0.38} metalness={0.55} />
      </mesh>
      <PlantStatusLight active={active} fault={fault} position={[0.48, 0.53, -0.48]} />
      <Html center position={[0, 0.84, 0]} className={`plant-label ${fault ? "fault" : active ? "active" : ""}`}>
        CH-{index + 1} {fault ? "FAULT" : active ? (lead ? "LEAD" : "ON") : "STBY"}
      </Html>
    </group>
  );
}

function PumpUnit({
  label,
  active,
  fault,
  position,
  color,
}: {
  label: string;
  active: boolean;
  fault: boolean;
  position: [number, number, number];
  color: string;
}) {
  return (
    <group position={position}>
      <mesh castShadow rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.24, 0.24, 0.54, 28]} />
        <meshStandardMaterial
          color={fault ? "#7f1d1d" : active ? color : "#3f4752"}
          roughness={0.35}
          metalness={0.4}
          emissive={active ? color : "#000000"}
          emissiveIntensity={active ? 0.12 : 0}
        />
      </mesh>
      <mesh castShadow position={[0.34, 0, 0]}>
        <boxGeometry args={[0.18, 0.22, 0.22]} />
        <meshStandardMaterial color="#8b95a4" roughness={0.5} metalness={0.2} />
      </mesh>
      <Html center position={[0, 0.44, 0]} className="plant-label small">
        {label}
      </Html>
    </group>
  );
}

function TowerUnit({
  index,
  active,
  position,
}: {
  index: number;
  active: boolean;
  position: [number, number, number];
}) {
  return (
    <group position={position}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.82, 1.18, 0.88]} />
        <meshStandardMaterial color={active ? "#8792a2" : "#3f4650"} roughness={0.65} metalness={0.18} />
      </mesh>
      <mesh castShadow position={[0, 0.72, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.08, 32]} />
        <meshStandardMaterial color={active ? "#d4dae4" : "#647084"} roughness={0.44} metalness={0.38} />
      </mesh>
      <Html center position={[0, 1.02, 0]} className={`plant-label small ${active ? "active" : ""}`}>
        CT-{index + 1} {active ? "ON" : "STBY"}
      </Html>
    </group>
  );
}

function ValveSymbol({
  active,
  position,
  color,
}: {
  active: boolean;
  position: [number, number, number];
  color: string;
}) {
  return (
    <mesh position={position} rotation={[0, 0, Math.PI / 4]} castShadow>
      <boxGeometry args={[0.22, 0.22, 0.08]} />
      <meshStandardMaterial color={active ? color : "#4b5563"} roughness={0.3} metalness={0.35} />
    </mesh>
  );
}

function SensorPost({ label, position, active }: { label: string; position: [number, number, number]; active: boolean }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.58, 12]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.42} metalness={0.4} />
      </mesh>
      <mesh castShadow position={[0, 0.34, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color={active ? "#7dd3fc" : "#64748b"} emissive={active ? "#38bdf8" : "#000000"} emissiveIntensity={active ? 0.18 : 0} />
      </mesh>
      <Html center position={[0, 0.62, 0]} className="plant-label micro">
        {label}
      </Html>
    </group>
  );
}

function PlantStatusLight({
  active,
  fault,
  position,
}: {
  active: boolean;
  fault: boolean;
  position: [number, number, number];
}) {
  const color = fault ? "#ef4444" : active ? "#22c55e" : "#64748b";
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.08, 16, 16]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={active || fault ? 0.6 : 0.05} />
    </mesh>
  );
}

function PlantBlock({
  label,
  position,
  color,
  size,
}: {
  label: string;
  position: [number, number, number];
  color: string;
  size: [number, number, number];
}) {
  return (
    <group position={position}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={size} />
        <meshStandardMaterial color={color} roughness={0.38} metalness={0.32} />
      </mesh>
      <Html center position={[0, size[1] / 2 + 0.3, 0]} className="plant-label">
        {label}
      </Html>
    </group>
  );
}

function FlowParticle({
  offset,
  speed,
  color,
  lane,
}: {
  offset: number;
  speed: number;
  color: string;
  lane: "supply" | "return" | "condenser";
}) {
  const ref = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = (clock.elapsedTime * speed + offset) % 1;
    const x = lane === "return" ? 4.05 - t * 8 : -4.05 + t * 8;
    const z = lane === "supply" ? -2.05 : lane === "return" ? -1.32 : 1.38 + Math.sin(t * Math.PI * 2) * 0.38;
    ref.current.position.set(x, 0.52 + Math.sin(t * Math.PI) * 0.1, z);
  });

  return (
    <mesh ref={ref} castShadow>
      <sphereGeometry args={[0.055, 16, 16]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.45} />
    </mesh>
  );
}
