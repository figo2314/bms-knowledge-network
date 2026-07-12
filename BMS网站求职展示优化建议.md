# BMS 知识网络网站优化 BACKLOG

更新时间：2026-07-10  
维护方式：本文件作为活文档使用。子 Agent 每完成一批优化后，由我复查源码、构建结果、视觉截图和应聘展示效果，并持续更新状态、验收结论和下一步建议。

## 状态说明

| 状态 | 含义 |
|---|---|
| `TODO` | 尚未开始，或当前代码中没有可验证实现 |
| `IN_PROGRESS` | 已出现实现信号，但还未完整接入或未验收 |
| `VERIFY` | 功能已实现，需要构建、截图、移动端、交互或内容质量验收 |
| `DONE` | 已通过应聘展示、行业表达、技术实现和视觉体验验收 |
| `REOPEN` | 曾完成，但后续改动导致问题回归 |

## 当前观察摘要

- 构建：`npm.cmd run build` 通过。
- 自动 UI 探测：`detect.mjs --json src` 返回 `[]`，暂未发现明显模板化 UI 命中。
- 性能：主 JS chunk 约 `1.37 MB`，gzip 后约 `394 KB`，仍需要拆包。
- 当前源码信号：`src/App.tsx` 已出现 `portfolioSummary`、`caseStudies`、`evidence`、`Briefcase`、`Download` 等数据和图标导入。
- 当前风险：`portfolioSummary` 与 `caseStudies` 数据已存在，但从 JSX 片段看，首屏仍主要是旧版 metrics + Save / Export，疑似尚未完整渲染到界面。
- 代码结构：`src/App.tsx` 仍承担大部分页面、数据、交互和 3D 模块，架构拆分尚未完成。

## 北极星目标

把网站从“很酷的 BMS demo”进化为“招聘官和技术主管 3 分钟内能判断专业深度的个人技术品牌”。

验收时我会用四个问题判断：

1. 招聘官是否能快速知道你适合什么岗位。
2. 技术主管是否能看到真实工程判断，而不是只看到概念词。
3. 行业同行是否能认可 BMS / ELV / 控制系统细节。
4. 网站本身是否证明你有系统建模、可视化表达和产品实现能力。

## P1 BACKLOG

### BMS-P1-001 招聘官快速理解层

状态：`IN_PROGRESS`

证据：

- `src/App.tsx` 已有 `portfolioSummary` 数据。
- 已包含目标岗位、核心能力、技术栈、协议栈、proof points。
- 但当前首屏 JSX 仍主要渲染 `Domain Coverage`、`Knowledge Objects`、`Plant Sequence`，还没有确认招聘摘要完整露出。

目标：

让首屏直接回答“你是谁、适合什么岗位、最强能力是什么、这个网站证明了什么”。

验收标准：

- 首屏可见目标岗位：BMS Engineer / ELV Engineer / Controls Integration / Smart Building。
- 首屏可见核心能力：topology modeling、BACnet / Modbus integration、chiller sequencing、power metering、SQL trend architecture。
- 首屏有明确求职入口：Download CV、View case studies、Open network demo、Contact 至少出现 2 个。
- Save / Export JSON 不能成为唯一主操作，因为它们更像工具按钮，不像作品集入口。
- 桌面首屏不显得拥挤；移动端首屏不需要滚动很久才能理解个人定位。

下一步建议：

- 将 `portfolioSummary` 真正接入首屏。
- 把工具操作和招聘操作分层：招聘 CTA 更靠前，Save / Export 放入工具区。
- 增加一句个人定位文案：`I model building systems as connected knowledge objects: topology, protocol, sequence, trend data, and operational risk.`

### BMS-P1-002 工程案例 Case Studies

状态：`IN_PROGRESS`

证据：

- `src/App.tsx` 已有 `caseStudies` 数组。
- 当前已有三个案例方向：Mixed BACnet / Modbus Integration、Chiller Plant Lead-Lag and Fault Recovery、Power Metering to SQL Reporting。
- 需要确认这些案例是否已在页面中渲染，以及视觉层级是否足够像作品集证据。

目标：

用案例证明你不是只懂概念，而是能处理现场系统、通讯、控制逻辑和数据问题。

验收标准：

- 页面有独立 `Case Studies` 区域或导航入口。
- 每个案例包含 `Problem / System / Action / Result / Evidence`。
- 至少 3 个案例覆盖：通讯集成、冷站控制、能耗/SQL。
- 案例文案要有工程判断：BBMD、UDP 47808、MS/TP MAC、baud rate、register offset、CT ratio、demand window、retention policy 等。
- 每个案例要让招聘官知道“你做了什么判断”，而不是只列技术名词。

下一步建议：

- 将 `caseStudies` 渲染为一个独立章节，不要藏在数据里。
- 每个案例增加 `Result` 的数字化或半数字化结果，例如减少排查路径、提高报表可信度、降低误判。
- 增加一个 “Interview talking points” 小字段，方便面试时讲。

### BMS-P1-003 知识节点升级为可验证资产

状态：`IN_PROGRESS`

证据：

- `DeviceData` 已新增 `evidence?: string[]`。
- 新增设备默认 evidence 文案：`Add point schedule, protocol parameters, or commissioning proof here.`
- 需要确认核心初始节点是否都补上了真实 evidence，而不是只有默认提示。

目标：

把节点从说明文字升级为工程资产：点表、协议参数、调试证据、风险说明。

验收标准：

- 核心节点至少 8 个拥有 `evidence`。
- BACnet/IP Backbone 包含 VLAN、BBMD、UDP 47808、routing 或 discovery 相关证据。
- MS/TP / Controller 节点包含 baud rate、MAC、max master、termination。
- Power Meter 节点包含 CT ratio、register offset、data type、multiplier、demand window。
- Trend / SQL 节点包含 retention、schema、index、backup、report risk。
- Inspector 能显示 evidence，而不是只存在于数据里。

下一步建议：

- 先给 `server`、`ip`、`router`、`meter-gateway`、`trend-log`、`sql-server`、`chiller`、`zone-energy` 补 evidence。
- Inspector 中新增 “Engineering evidence” 区块。
- 支持 evidence 的增删改，后续可导出到 JSON。

## P2 BACKLOG

### BMS-P2-001 移动端展示优先

状态：`TODO`

当前问题：

- 之前移动端截图显示页面总高度超过 7000px。
- React Flow 画布有横向溢出。
- 手机端把完整编辑器、Inspector、3D、表格全部堆叠，阅读成本高。

目标：

手机端用于建立第一印象，桌面端用于完整编辑和演示。

验收标准：

- 手机首屏能看懂个人定位和核心能力。
- React Flow 不造成页面级横向滚动。
- 手机端默认 read-only overview，编辑器可通过按钮进入。
- Inspector 在手机端改成底部抽屉或折叠区。
- 3D 冷站保留核心工况切换，隐藏次要微标签。
- 移动截图无明显文字挤压、遮挡、横向溢出。

下一步建议：

- 加一个 mobile-only `portfolio first` 布局。
- 给 `.graph-canvas` 或 React Flow 容器增加移动端隔离滚动策略。
- 移动端隐藏 MiniMap 或替换为静态 topology preview。

### BMS-P2-002 性能拆包

状态：`TODO`

当前问题：

- 构建通过，但主 JS chunk 约 `1.37 MB`。
- React Flow + Three.js 都在首包里，公开作品集首屏加载会吃亏。

目标：

让招聘官更快看到首屏个人定位，重型交互模块按需加载。

验收标准：

- 3D 冷站模块使用 lazy load。
- React Flow 编辑器可按路由、标签或视口按需加载。
- 首屏 Portfolio Summary 不依赖 Three.js。
- 构建后主 chunk 明显下降，或至少通过 manualChunks 拆出 `three`、`react-flow`。
- 加载中使用 skeleton 或轻量占位，不使用空白区域。

下一步建议：

- 使用 `React.lazy` / `Suspense` 拆 `ChillerPlant`。
- 考虑把 Network Editor 拆为独立组件后按需加载。
- 配置 Vite/Rollup `manualChunks` 分离 Three.js 和 React Flow。

### BMS-P2-003 工具交互反馈

状态：`TODO`

当前问题：

- Save 写入 localStorage 但缺少成功提示。
- Reset 无确认或 Undo。
- Export JSON 缺少失败提示。
- 筛选无结果时缺少 empty state。

目标：

把原型交互升级为可信的产品工具交互。

验收标准：

- Save 后出现 toast 或 inline 状态：Saved locally。
- Reset 前有确认，或 Reset 后可 Undo。
- Export 成功/失败都有反馈。
- Add device 后自动选中新节点，并给轻提示。
- Brand / Search 无结果时显示 empty state 和清除筛选入口。
- 所有反馈不遮挡主操作，不造成布局跳动。

下一步建议：

- 新增轻量 toast state。
- 将 resetGraph 改为确认流程。
- filteredNodes 全 hidden 时显示 empty state。

### BMS-P2-004 代码架构拆分

状态：`TODO`

当前问题：

- `src/App.tsx` 约 49 KB，集中承载数据、页面、编辑器、3D 场景、Power、Data 模块。
- 作为原型可接受，但作为技术主管作品集，结构还不够能体现工程治理能力。

目标：

让代码结构也成为作品集的一部分：清楚、可扩展、可维护。

验收标准：

- `src/data/devices.ts`：设备、边、品牌、协议、层级。
- `src/data/caseStudies.ts`：案例数据。
- `src/components/network/`：Toolbar、DeviceNode、Inspector、Graph。
- `src/components/plant/`：ChillerPlant、stage controls、plant primitives。
- `src/components/power/`：PowerManagementPanel。
- `src/components/data-architecture/`：DataArchitecturePanel。
- `src/schemas/knowledgeGraph.ts`：导入导出数据结构和验证逻辑。
- 拆分后 `npm.cmd run build` 仍通过。

下一步建议：

- 先拆数据，再拆纯 UI，再拆 3D。
- 每次拆分保持行为不变，避免同时重构视觉和逻辑。

## P3 BACKLOG

### BMS-P3-001 行业细节补强

状态：`TODO`

目标：

让行业同行看到细节时觉得“这个人真的做过现场和系统调试”。

验收标准：

- BMS 拓扑模块增加 IP / VLAN / BBMD / routing。
- BACnet 对象类型包含 AI、AO、BI、BO、AV、BV、Schedule、Trend Log、Alarm。
- Modbus 示例包含 address、function code、data type、scale。
- 网络排障路径包含 ping、Wireshark、BACnet discovery、polling timeout。
- 冷站模块包含 CHWS/CHWR/CWS/CWR、DP、flow、valve command、pump status。
- 能耗模块包含 CT/PT ratio、tariff period、missing interval、wrong multiplier。
- SQL 模块包含 `point_id + timestamp` index strategy、retention、backup restore。

### BMS-P3-002 简历与联系入口

状态：`TODO`

目标：

应聘作品集必须能转化为真实联系和面试机会。

验收标准：

- 有 `Download CV` 或 `View CV`。
- 有 Email / LinkedIn / GitHub / Portfolio source 至少 2 个。
- 联系入口在桌面和移动端都容易找到。
- 不要求填写复杂表单。

### BMS-P3-003 分享与导出能力

状态：`TODO`

目标：

让某个节点、案例或图谱可以独立分享，用于面试和客户沟通。

验收标准：

- 支持复制当前节点/案例链接。
- JSON 导出带版本号。
- 后续可扩展 PDF / SVG / Mermaid 导出。

## 持续观察协议

每次子 Agent 完成一批改动后，我会按以下流程复查：

1. 读取 `src/App.tsx`、`src/styles.css`、新增组件和数据文件。
2. 运行 `npm.cmd run build`。
3. 运行自动 UI 探测：`detect.mjs --json src`。
4. 必要时启动 Vite，抓桌面和移动截图。
5. 对照本 BACKLOG 更新每项状态。
6. 对已实现但不够好的项标记 `VERIFY` 或 `REOPEN`，并补充下一步建议。

验收不是看“有没有代码”，而是看“招聘官、技术主管、行业同行是否真的能读到对应价值”。

## 更新日志

### 2026-07-10

- 将原优化建议整理为可执行 BACKLOG。
- 确认当前构建通过。
- 确认自动 UI 探测 clean。
- 观察到 `portfolioSummary`、`caseStudies`、`evidence` 数据已经进入源码。
- 将招聘摘要、Case Studies、节点 evidence 标记为 `IN_PROGRESS`。
- 将移动端、性能拆包、工具反馈、代码架构拆分保留为 `TODO`。
