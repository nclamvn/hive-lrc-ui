# BUILDER COMPLETION REPORT — TIP-UI-001

**Builder:** Claude Code · **Date:** 2026-07-17 · **Project:** `hive-lrc-ui/` (Next.js 16, React 19, TS strict)

```text
STATUS: PARTIAL
(mọi hạng mục DONE trừ ngưỡng số của Gate V3 — bị chặn bởi bản chất golden master, chi tiết ở DEVIATIONS)

IMPLEMENTED:
- AppShell, Sidebar (192px, logo 58px @ 34/36, menu 44px items, bottom status), TopHeader
  (title 44px, 3 meta clusters, profile dropdown chứa language switch, demo mode ?demo=1)
- MetricCard ×4 (Target Claim render KaTeX \operatorname{LRC}(13), RRI, k=9 reproduced, Investigation)
- ClaimLedger (fixture đã duyệt: C0 OPEN/NU, C1 EXTERNAL CLAIM, C2 VERIFIED-LOCAL,
  C4 REFUTED AS-IS, C5 NEXT — KHÔNG sao chép nhãn sai trong mock)
- ReproductionLadder (completed/next/pending/target + legend, node 44px)
- BottleneckChart (custom SVG, log scale, dashed final segment, gray band MAJOR HARDNESS JUMP,
  label "Relative compute index · Illustrative, not measured" theo spec)
- WorkflowStepper (8 bước, RRI current đen + marker + baseline dots)
- RiskRegister (R1–R3, P0 pill đen, R3 wrap 2 dòng như mock)
- ResourceProfile (3 histogram SVG deterministic S/M/L, footer bottleneck)
- ProofDependencyGraph (custom SVG toạ độ cố định, 9 node data-node-id, 3 loại nét,
  legend dọc, focus/hover, fallback list cho screen reader)
- NotesNextActions (4 action + network ornament SVG seeded-LCG deterministic)
- Math: InlineMath / BlockMath / MathMarkdown (KaTeX, trust:false, throwOnError:false,
  strict:warn, fallback source khi parse lỗi, không ảnh tĩnh)
- i18n: /en/overview + /vi/overview, middleware redirect / và /{locale},
  html lang đúng, key parity có test, route placeholder cho mọi nav/view-all
- Data architecture: fixtures → adapter (view model) → components; không hard-code string trong JSX
- Responsive: 1440+/1200–1439 (sidebar 76px)/768–1199/<768 theo §16

VISUAL RESULTS (EN 1672×941, DPR 1, Chromium, demo mode):
- Gate V1 container geometry: PASS — mọi container ±2px so với rhythm §6
  (header y=20 h=72, metrics y=112 h=102, primary y=230 h=268, workflow y=514 h=188,
   dependency y=718 h=188, sidebar 192px, ClaimLedger 496px, Ladder 414px; không scrollbar)
- Gate V2 typography: PASS — 100% UI text là Inter (test quét toàn DOM, trừ .katex),
  tabular-nums cho số, không fallback serif/Arial, không clipping
- Gate V3 screenshot diff vs golden:
    SSIM:                 0.4337   (ngưỡng ≥ 0.995)  → FAIL
    mismatched pixels:    8.62%    (ngưỡng ≤ 0.8%)   → FAIL
    mean abs RGB diff:    13.90    (ngưỡng ≤ 2.5)    → FAIL
    vùng sai liên tục:    0 ô 32×32 (ngưỡng: không có) → PASS
- Monochrome AC-06: PASS (0.00% pixel có màu, tolerance spread 12)
- Screenshots nộp kèm (test-results/visual/):
    overview-en-1672x941.png, overview-vi-1672x941.png,
    overview-en-1440x900.png, overview-vi-1440x900.png,
    overview-en-diff.png, metrics-en.json

I18N:
- EN: PASS · VI: PASS (cùng geometry, không clipping — có test riêng)
- missing keys: 0 (assertKeyParity chạy trong test suite)
- Nhãn VI dài (vd BỊ BÁC BỎ Ở TRẠNG THÁI HIỆN TẠI) truncate bằng ellipsis + title tooltip theo §13.7

LATEX:
- inline: PASS (LRC(13) metric render bằng KaTeX, aria-label "L R C of thirteen")
- block: PASS (BlockMath component, cùng pipeline render)
- invalid input fallback: PASS (throwOnError:false + fallback <code>/<pre> hiển thị source)

TESTS: 14 passed / 1 failed (chỉ Gate V3 assertions)
- unit: i18n key parity PASS
- component/E2E: load EN + VI không console error, locale switch qua profile menu,
  redirect / và /vi, view-all links reachable, keyboard traversal tới graph node,
  KaTeX hiện diện + không ảnh công thức: PASS
- visual: geometry PASS, typography PASS, mono PASS, VI-no-clipping PASS, diff FAIL (số liệu trên)
- axe: PASS (0 critical/serious sau fix contrast)
- Playwright HTML report: playwright-report/

FILES CREATED / MODIFIED:
- src/app/[locale]/{layout.tsx, overview/page.tsx, [section]/page.tsx}, src/middleware.ts
- src/components/shell/{AppShell,Sidebar,TopHeader,icons}.tsx
- src/components/dashboard/{MetricCard,ClaimLedger,ReproductionLadder,BottleneckChart,
  WorkflowStepper,RiskRegister,ResourceProfile,ProofDependencyGraph,NotesNextActions}.tsx
- src/components/math/{InlineMath,BlockMath,MathMarkdown}.tsx
- src/data/fixtures/overview.demo.ts, src/data/adapters/researchOverviewAdapter.ts
- src/i18n/{index.ts,en.json,vi.json}, src/styles/{tokens.css,globals.css}
- tests/visual/{overview.spec.ts,compare.ts}, tests/e2e/overview.spec.ts, playwright.config.ts
- public/reference/hive-lrc-dashboard-golden.png

DEVIATIONS:
1. Gate V3 không đạt ngưỡng số.
   Why: golden master là ảnh AI-sinh dùng typography serif + texture raster riêng; spec khoá
   Inter cho toàn UI và cấm bắt chước serif (§5). Diff image cho thấy ~toàn bộ mismatch là
   glyph chữ, KHÔNG có lệch cấu trúc (largestBlob=0, Gate V1 pass ±2px). SSIM 0.995 chỉ đạt
   được khi baseline cùng công nghệ render. KHÔNG hạ threshold (Final Rule 10) — báo cáo và
   chờ Contractor quyết định (xem SUGGESTIONS 1).
   Visual impact: nét chữ khác mock; bố cục/tỷ lệ/sắc độ khớp. Semantic impact: none.
2. WCAG AA vs palette: token muted #8A8A87 trên nền trắng = 3.46:1, fail AA cho text nhỏ
   (axe serious ×16). Đổi các text nhỏ sang #666666 (secondary — vẫn trong palette khoá).
   Muted chỉ còn dùng cho ornament trang trí. Visual impact: header bảng/label phụ đậm hơn
   một chút. Semantic impact: none. Palette không bị thêm màu.
3. i18n: THÊM (không sửa) 8 key phụ vào cả en/vi: app.language, header.researchLead,
   header.operator, header.profileMenu, chart.summary, graph.nodeList — cần cho header
   metadata, aria và chart summary mà locale gốc không có. File gốc Contractor còn nguyên
   trong _ui_package/.
4. Graph node Attack: render 1 dòng "Attack k=13" (đúng giá trị key graph.attack đã khoá)
   thay vì 2 dòng "Attack / k = 13" như mock — tránh tự chế string ngoài locale.
5. Icon "Reproduction": Lucide không có icon ladder → custom SVG cùng grid 24px stroke 1.5.
6. Nội dung Claim Ledger/Risk khác mock (C3, VERIFIED, novelty NU ở C2…): áp dụng đúng
   fixture đã duyệt theo §3 — mock sai nhận thức luận, không sao chép. Phần này làm tăng
   pixel diff nhưng là chủ đích của Contractor.

KNOWN ISSUES:
- Gate V3 numeric FAIL như trên (chờ quyết định baseline).
- Pill VI dài phải truncate (tooltip đầy đủ) — trong giới hạn §13.7 cho phép.
- Sidebar bottom status là hiển thị tĩnh (System Status/All Systems Nominal theo locale),
  chưa nối telemetry — đúng scope §17.

SUGGESTIONS:
1. Re-baseline: sau khi Contractor visual-review và approve implementation này, dùng chính
   overview-en-1672x941.png (commit-pinned) làm regression baseline. Khi đó SSIM ≥ 0.995 /
   mismatch ≤ 0.8% trở thành gate CÓ NGHĨA cho mọi thay đổi tương lai (self-regression),
   thay vì so với ảnh AI-sinh khác công nghệ render. Mock giữ vai trò design reference.
2. Nếu muốn so trực tiếp với mock, cần định nghĩa metric bỏ qua glyph (vd SSIM trên bản
   Gaussian-blur σ=4, hoặc so structural map) — cần Contractor định ngưỡng mới.
3. Cân nhắc thêm key i18n cho ladder k-label prefix nếu sau này có locale không dùng "k =".
4. data/adapters đã sẵn interface để nối Git artifacts thật (SCAN_REPORT parser) ở TIP sau.
```

## Cách chạy

```bash
npm run build && npm run start -- -p 3100   # http://localhost:3100/en/overview?demo=1
npm test                                     # toàn bộ Playwright (visual + e2e + axe)
npx playwright show-report                   # HTML report
```
