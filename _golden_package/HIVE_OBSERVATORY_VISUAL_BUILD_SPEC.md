# HIVE-LRC OBSERVATORY — VISUAL BUILD SPEC v1.0

## 1. SOURCE OF TRUTH

Thứ tự ưu tiên:

1. `HIVE_OBSERVATORY_GOLDEN_MASTER_1586x992.png`
2. tài liệu này
3. CSS tokens
4. content fixture
5. code hiện hữu

Khi tài liệu và ảnh khác nhau, ảnh là nguồn đúng, trừ khi Contractor ban hành correction.

---

## 2. REFERENCE ENVIRONMENT

```text
viewport: 1586 × 992 CSS px
deviceScaleFactor: 1
browser: Chromium stable
locale: en
timezone: UTC
color scheme: light
reduced motion: true
page zoom: 100%
```

Page là viewport app, không bao gồm browser chrome.

Desktop golden không được có vertical scrollbar trong 992 px.

---

## 3. VISUAL DNA

Phong cách:

```text
editorial research publication
+
mathematical mission control
+
premium restrained technology
```

Không phải:
- SaaS dashboard phổ thông;
- cyberpunk;
- glassmorphism;
- enterprise BI;
- marketing landing page.

Tính cách:
- yên tĩnh;
- chính xác;
- uy tín học thuật;
- giàu thông tin;
- có tín hiệu “live” nhưng không phô trương.

---

## 4. PAGE GEOMETRY

### Main frame

```text
page width: 100%
reference width: 1586
content inset left/right: 46 px
usable width: 1494 px
top nav height: 55 px
footer visual band: khoảng 62 px cuối trang
```

### Major vertical bands

```text
0–55:
  top navigation

56–230:
  hero

237–347:
  metric cards

363–708:
  attack map + live feed

722–918:
  lower panels

929–991:
  footer and page termination
```

Sai số triển khai chấp nhận trước tuning: ±2 px.
Golden pass: ±1 px.

### Main grid

Dùng CSS Grid 12 cột.

```text
gap: 14–16 px
map/feed ratio: khoảng 3 : 1
```

Khuyến nghị:

```css
grid-template-columns: repeat(12, minmax(0, 1fr));
column-gap: 14px;
```

Map:
```text
span 9 columns
```

Feed:
```text
span 3 columns
```

---

## 5. COLOR SYSTEM

Khóa bằng CSS variables.

```text
page background:
  warm off-white, gần #FDFCF9

card surface:
  gần #FFFEFC

primary ink:
  #111111

secondary ink:
  khoảng #66645F

tertiary ink:
  khoảng #8B8881

hairline:
  khoảng #E2E0DA

strong line:
  khoảng #CBC8C0

black node:
  #111111

accent green:
  khoảng #2F9B50

accent pale:
  green với alpha 0.08–0.14

danger/bottleneck:
  dùng muted rust rất ít, chỉ icon nhỏ

shadow:
  đen alpha rất thấp
```

Accent xanh chỉ xuất hiện ở:
- live dot;
- active nav marker;
- current gate;
- verified badge;
- active graph path;
- progress lines;
- status active.

Không dùng xanh làm nền panel lớn.

---

## 6. TYPOGRAPHY

### Fonts

Display:
```text
Newsreader hoặc font serif được Owner duyệt
weight 500
```

UI:
```text
Inter
weights 400, 500, 600
```

Khuyến nghị Next.js:

```ts
import { Inter, Newsreader } from "next/font/google";
```

Không dùng system fallback trong golden screenshot nếu webfont chưa load.

### Hero headline

```text
serif
font size khoảng 41–45 px
line height 1.02–1.08
weight 500
letter spacing hơi âm
max width khoảng 710 px
```

Giữ đúng 2 dòng:

```text
A live observatory of a Human–AI attack
on the Lonely Runner Conjecture.
```

Không để reflow thành 3 dòng tại reference viewport.

### UI sizes

```text
nav: 13–14 px
eyebrow: 10–11 px uppercase, tracking rộng
metric label: 9–10 px uppercase
metric main value: 20–25 px
body: 11–13 px
micro: 8–10 px
panel title: 10–12 px uppercase/semibold
```

Text rendering:
- antialias mặc định Chromium;
- không dùng text-shadow;
- không scale transform text.

---

## 7. TOP NAVIGATION

### Bounding

```text
height: 55 px
border-bottom: 1 px hairline
display: grid hoặc flex
```

### Left brand

```text
x khoảng 18
logo 28–32 px
wordmark HIVE-LRC
OBSERVATORY dưới, tracking rộng
```

Logo phải là SVG thật.

### Center navigation

Các mục:

```text
Overview
Research Map
Gates
Claims
Methods
Verification
Journal
About
```

Overview active:
- text đen;
- underline rất mảnh;
- chấm xanh ở giữa;
- không dùng pill.

### Right controls

```text
theme icon button
Read segmented control active black
Audit inactive
EN language button
```

Radii 7–9 px.
Chiều cao controls 28–32 px.

---

## 8. HERO

### Layout

```text
left: headline + description
right: orbit illustration
```

Hero không nằm trong card.

### Live eyebrow

```text
green dot 6 px
LIVE OBSERVATORY
uppercase
tracking 0.22–0.28em
```

### Subtitle

Giữ gần nguyên văn fixture.
Width khoảng 570 px.
Color secondary.

### Orbit illustration

Không dùng ảnh raster nặng.

Dựng bằng SVG:
- 6–8 ellipse rings;
- stroke xám alpha thấp;
- dash patterns khác nhau;
- 4–6 orbit nodes;
- central faint HIVE cube mark;
- opacity rất nhẹ;
- không tranh chấp với headline.

SVG phải deterministic.
Không animation trong golden mode.
Production có thể dùng drift cực nhẹ ≤12 s, amplitude ≤2 px.

---

## 9. METRIC CARDS

Bốn card ngang đều.

### Geometry

```text
height khoảng 112 px
radius 10–12 px
border 1 px
shadow rất nhẹ
padding 16–18 px
gap 10–14 px
```

### Card anatomy

```text
icon left/top
uppercase label
main value
secondary line
bottom status line
optional sparkline
optional chevron
```

### Exact fixture

1. Target Claim
2. Current Research Gate
3. Highest Independent Reproduction
4. Latest Structural Advance

Accent green chỉ ở:
- Gate D16;
- verified badge;
- Support-3 complete;
- sparkline;
- status dots.

---

## 10. RESEARCH ATTACK MAP — SIGNATURE COMPONENT

Đây là phần quan trọng nhất.

### Panel

```text
x ~46
y ~363
width ~1078
height ~345
```

Header cao khoảng 35–40 px.
Border, radius và divider giống mock.

### Background

Dùng radial grid rất nhẹ:

```css
background-image:
  radial-gradient(circle, rgba(17,17,17,.08) 0.7px, transparent 0.8px);
background-size: 16px 16px;
```

Opacity phải rất thấp.

### Graph engine

Khuyến nghị:
- React Flow với nodes fixed;
- custom SVG edges;
- no auto-layout trong golden;
- pan/zoom enabled production;
- `fitView={false}` trong golden;
- fixed viewport transform.

Không dùng force-directed layout.

### Graph content

Phải có:
- S, A, B, C;
- C.004, C.005;
- D11–D16 lower path;
- D16 selected center;
- D3–D10 right path;
- D17–D19 support-4 group;
- R1–R3 risk group;
- multiple dependency/supersede edges;
- active path green.

### Node families

Black primary gate:
```text
filled circle
white text
```

White gate:
```text
white fill
gray border
black text
```

Current gate:
```text
larger circle
white fill
green outer ring
subtle glow
```

Claim:
```text
small pale rounded/circular node
```

Risk:
```text
light circle in dashed group
```

### Edge families

```text
dependency:
  solid gray, arrow

active path:
  solid green, arrow

supersedes:
  darker arrow

open/provisional:
  dashed

support link:
  dotted/dashed light
```

Edge crossings phải giống topology của mock.
Dùng custom Bezier control points trong fixture.

### Groups

Support-4:
- dashed rounded rectangle;
- small uppercase label;
- D17/D18/D19.

Risk & Bottlenecks:
- dashed rectangle;
- label;
- R1/R2/R3.

### Map controls

Left vertical:
- plus;
- minus;
- fit.

Top right:
- View options button.

Bottom right:
- Path Highlight card.

### Golden coordinates

Lưu node positions trong fixture JSON.
Không tính lại từ text.
Text label width cố định.

---

## 11. LIVE RESEARCH FEED

### Panel

```text
width khoảng 365 px
height khớp map/lower region
```

Header:
- LIVE RESEARCH FEED;
- View all journal →.

Rows:
- timestamp column;
- sequence badge;
- event chip;
- title;
- description;
- bottom divider.

Không card hóa từng event riêng.
Đây là một panel với rows.

Fixture gồm 5 events:
- gate opened;
- theorem proved;
- claim updated;
- correction applied;
- theorem proved.

Chip:
- outline capsule;
- uppercase micro text;
- không màu mạnh.

---

## 12. LOWER PANELS

### Evidence Ladder

- vertical level rail 5→1;
- circle levels;
- label;
- ratio at right;
- thin green progress bars;
- footer scale note.

### Progress Overview

- 3 series:
  - black;
  - green;
  - gray.
- subtle axes;
- compact labels;
- no chart library default styles.

SVG hoặc Observable Plot.
Golden mode uses fixed points.

### Bottleneck Frontier

- table layout;
- columns Issue / Impact / Status;
- green active dot;
- gray open/monitoring dot;
- row separators very light.

### Method Summary

- five line icons;
- centered labels;
- thin dividers only where visible.

### Next Actions

- 3 checkbox rows;
- compact.

### At a Glance

- four metrics;
- last-updated;
- live dot.

---

## 13. FOOTER

Full width hairline top.

Left:
```text
HIVE-LRC Observatory is a public research record.
```

Center links:
```text
Data & Exports
API
How to Contribute
Citation
```

Right:
```text
Version 0.6.3
All times UTC
Live
```

Micro text 9–10 px.

---

## 14. ICONOGRAPHY

Dùng một family duy nhất:
```text
Lucide
```

Default:
```text
size 16–18
stroke width 1.4–1.6
```

Metric icons có thể 24–28 px.
Không dùng filled icon trừ node graph.

Logo và central HIVE mark là custom SVG.

---

## 15. MOTION

Golden:
```text
all animations disabled
```

Production:
- hover 120–160 ms;
- card translate tối đa −1 px;
- active path pulse rất nhẹ;
- live dot pulse 2 s;
- orbit drift cực nhẹ;
- graph focus transition 180–240 ms.

Tôn trọng `prefers-reduced-motion`.

---

## 16. RESPONSIVE

Golden desktop là ưu tiên.

### ≥1440

Giữ gần layout golden.

### 1280–1439

- hero headline nhỏ hơn;
- metric cards vẫn 4 cột nếu đủ;
- map/feed 8/4 hoặc 9/3;
- lower panels wrap có kiểm soát.

### 1024–1279

- hero orbit giảm;
- metrics 2×2;
- map full width;
- feed dưới map;
- lower panels 2 cột.

### <768

- nav chuyển menu;
- headline 34–38 px;
- metrics 1 cột;
- graph dùng horizontal scroll hoặc dedicated map route;
- feed list;
- charts stack.

Không kỳ vọng pixel-match mobile với desktop mock.

---

## 17. ACCESSIBILITY

- semantic landmarks;
- nav labels;
- graph có alternative structured list;
- visible focus;
- controls ≥32 px;
- contrast WCAG AA;
- status không dựa riêng vào màu;
- SVG có title/desc;
- charts có data table fallback;
- keyboard pan/focus graph.

---

## 18. PERFORMANCE

- page shell server-rendered;
- map client component;
- lazy-load graph interactions sau first paint;
- SVG orbit inline;
- no large raster hero;
- no layout shift;
- fonts preloaded;
- target desktop Lighthouse performance ≥90 sau khi visual parity hoàn tất.

Visual parity ưu tiên trước micro-optimization.

---

## 19. DATA ARCHITECTURE

Tách:

```text
visual fixture
production public read model
private research store
```

Golden fixture không được phụ thuộc live backend.

Production mapping:
- metric cards từ current public release;
- feed từ approved journal events;
- graph từ public graph nodes/edges;
- chart từ public release history.

---

## 20. TESTING

### Existing tests

Tất cả test hiện tại phải tiếp tục pass.

### Visual

- full page;
- seven crop regions;
- EN golden;
- font ready;
- animation disabled.

### Behavioral

- nav active state;
- Read/Audit switch;
- language switch;
- graph zoom;
- graph node drawer;
- feed links;
- journal navigation.

### i18n

EN golden là baseline.
VI cần:
- không overflow;
- không cắt chữ;
- hierarchy giữ nguyên;
- có screenshot approval riêng;
- không ép VI pixel-match EN.

---

## 21. PROHIBITED SHORTCUTS

- screenshot background;
- hard-coded raster text;
- canvas-only page;
- force graph random seed không cố định;
- browser zoom trick;
- transform scale toàn page;
- negative margins để che overflow;
- re-baseline không duyệt;
- bỏ content để tăng SSIM;
- đổi font vì “gần giống”.
