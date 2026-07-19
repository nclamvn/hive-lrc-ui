# COMMAND FOR BUILDER — HIVE-LRC OBSERVATORY PIXEL-PERFECT

## 0. CONTRACT

```text
Owner / PI:
  duyệt hình thức cuối cùng và mọi deviation

Contractor / Design Architect:
  golden master, visual specification, acceptance criteria,
  review visual diff

Builder:
  triển khai component, responsive, data binding, tests,
  sửa CSS cho tới khi đạt quality gate
```

Golden master bắt buộc:

```text
HIVE_OBSERVATORY_GOLDEN_MASTER_1586x992.png
```

Mục tiêu:

> Xây giao diện thật giống mockup đã duyệt ở mức gần như pixel-perfect, đồng thời giữ được component architecture, accessibility, i18n và dữ liệu động.

Không được:

- đặt nguyên ảnh mockup làm background;
- dùng canvas để vẽ toàn bộ UI;
- thay typography, palette hoặc hierarchy;
- đổi bố cục để “tối ưu” theo ý Builder;
- làm graph bằng force layout ngẫu nhiên;
- re-baseline để che sai khác;
- dùng dữ liệu live trong visual regression;
- tự thêm gradient, glassmorphism, neon hoặc màu thứ hai;
- dùng emoji thay icon;
- đổi câu chữ của golden fixture;
- làm card hoặc graph “gần giống” rồi dừng.

---

## 1. ĐẦU VÀO BẮT BUỘC

Đọc toàn bộ:

1. `HIVE_OBSERVATORY_VISUAL_BUILD_SPEC.md`
2. `hive-observatory.tokens.css`
3. `hive-observatory.content-fixture.json`
4. `observatory.visual.spec.ts`
5. golden master PNG

Kiểm tra codebase hiện tại trước khi sửa:

```text
framework
routing
CSS strategy
font loading
i18n
test stack
existing HIVE design tokens
existing dashboard components
```

Giữ stack hiện tại nếu không có lý do kỹ thuật bắt buộc phải đổi.

---

## 2. CHẾ ĐỘ GOLDEN FIXTURE

Tạo chế độ render cố định:

```text
/en/overview?fixture=golden
```

hoặc biến môi trường tương đương.

Trong chế độ này:

- ngày giờ cố định;
- feed cố định;
- graph nodes/edges cố định;
- animation bị tắt;
- webfont chờ load xong;
- không gọi realtime;
- không gọi API ngoài;
- không dùng random ID;
- không dùng layout dựa trên kích thước nội dung bất định;
- mọi chart dùng fixture chính xác.

Production mode vẫn dùng dữ liệu thật.

---

## 3. TRIỂN KHAI THEO 8 PASS

### PASS 1 — Structural skeleton

Chỉ dựng:

```text
top navigation
hero
four metric cards
main map panel
live feed
lower information panels
footer
```

Chưa tinh chỉnh chi tiết.

Yêu cầu:
- đúng major bounding boxes;
- đúng grid;
- đúng chiều cao từng vùng;
- không overflow;
- route chạy ổn định.

### PASS 2 — Typography

Khóa:
- display serif;
- Inter cho UI;
- sizes;
- line heights;
- tracking;
- text colors;
- truncation.

Không chuyển sang pass sau nếu headline hoặc card typography còn lệch rõ.

### PASS 3 — Surfaces and tokens

Khóa:
- page background;
- card surfaces;
- borders;
- radii;
- shadows;
- dividers;
- spacing.

### PASS 4 — Research Attack Map

Dựng graph deterministic:
- fixed coordinates;
- custom nodes;
- custom edges;
- legend;
- controls;
- active path;
- support-4 group;
- risk group;
- path-highlight card.

Không dùng auto-layout trong golden mode.

### PASS 5 — Feed and lower panels

Khóa:
- row heights;
- dividers;
- badges;
- charts;
- evidence ladder;
- bottleneck table;
- method icons;
- next actions;
- at-a-glance.

### PASS 6 — Icons and micro-detail

Khóa:
- logo;
- Lucide icons;
- stroke width;
- dot sizes;
- status markers;
- tiny labels;
- chevrons;
- information icons.

### PASS 7 — Responsive and interaction

Sau desktop golden mới làm:
- 1440;
- 1280;
- tablet;
- mobile;
- keyboard;
- hover/focus;
- graph pan/zoom.

Không làm responsive bằng cách phá desktop golden.

### PASS 8 — Visual regression

Chạy screenshot ở:
- 1586 × 992;
- DPR 1;
- Chromium;
- English;
- golden fixture;
- reduced motion;
- fonts ready.

Lặp cho tới khi PASS.

---

## 4. QUALITY GATE

### Golden desktop

```text
pixel diff ratio <= 0.00030
SSIM >= 0.9993
major region displacement <= 1 px
text baseline displacement <= 1 px
no missing component
no extra component
no clipped text
no unexpected scrollbar
```

Mục tiêu stretch:

```text
pixel diff ratio <= 0.00015
SSIM >= 0.9995
```

“100% giống” được hiểu là:
- không có khác biệt nhận thức được ở kích thước tham chiếu;
- mọi deviation còn lại chỉ do anti-aliasing có kiểm soát;
- không có khác biệt bố cục, typography, nội dung hoặc hierarchy.

### Region gates

Phải có crop diff riêng:

```text
header
hero
metric cards
research map
live feed
bottom panels
footer
```

Một vùng fail thì toàn trang fail dù SSIM tổng vẫn cao.

---

## 5. BÁO CÁO MỖI VÒNG

Builder xuất:

```text
screenshots/
  actual.png
  diff.png
  overlay-50.png
  crops/
visual-report.json
VISUAL_REVIEW.md
```

`VISUAL_REVIEW.md` phải ghi:

```text
viewport
DPR
browser version
font readiness
pixel diff
SSIM
failed regions
known deviations
files changed
```

Không được ghi “looks close”.

---

## 6. DEVIATION POLICY

Builder chỉ được tự quyết:
- chi tiết implementation không ảnh hưởng pixel;
- semantics HTML;
- state management;
- internal data fetching;
- performance optimizations không đổi output.

Phải xin duyệt trước khi:
- đổi font;
- đổi kích thước vùng;
- đổi graph topology;
- bỏ panel;
- đổi nội dung;
- thay icon family;
- thay accent;
- thay breakpoint strategy;
- re-baseline.

---

## 7. ACCEPTANCE CHECKLIST

```text
[ ] Golden fixture deterministic
[ ] Fonts loaded before screenshot
[ ] Header exact
[ ] Hero exact
[ ] Orbit illustration exact
[ ] Four cards exact
[ ] Map topology exact
[ ] All graph labels exact
[ ] Live feed exact
[ ] Lower panels exact
[ ] Footer exact
[ ] No random layout
[ ] No screenshot-as-background
[ ] EN golden PASS
[ ] VI layout reviewed separately
[ ] Accessibility baseline PASS
[ ] Visual thresholds PASS
[ ] 15/15 existing tests remain green
```

---

## 8. REQUIRED FINAL REPORT

Tạo:

```text
REPORT_OBSERVATORY_PIXEL_PERFECT.md
```

Sections:

```text
STATUS
ROUTE
STACK
GOLDEN FIXTURE
LAYOUT
TYPOGRAPHY
TOKENS
MAP
FEED
LOWER PANELS
RESPONSIVE
ACCESSIBILITY
VISUAL METRICS
REGION DIFFS
EXISTING TESTS
FILES
DEVIATIONS
SUGGESTIONS
```

Exit:

```text
PASS:
  golden desktop đạt threshold, không deviation vật liệu

PARTIAL:
  UI hoạt động nhưng còn region fail

BLOCKED:
  thiếu font, asset hoặc stack không thể tái tạo output

RESTART:
  golden master hoặc information architecture thay đổi
```
