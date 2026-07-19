/**
 * Wiki content for every sidebar section - real project data, bilingual.
 * Text fields carry {en, vi}. Inline math is written as $...$ and rendered
 * with KaTeX by the RichText helper. No em-dashes (use "," or "-").
 */
export type Bi = { en: string; vi: string };

export type Block =
  | { kind: "prose"; text: Bi }
  | { kind: "math"; latex: string; caption?: Bi }
  | { kind: "keyvalue"; rows: { k: Bi; v: Bi }[] }
  | { kind: "table"; head: Bi[]; rows: Bi[][] }
  | { kind: "callout"; tone: "note" | "result" | "warn"; text: Bi }
  | { kind: "list"; items: Bi[] }
  | { kind: "stat"; items: { label: Bi; value: string }[] }
  | { kind: "milestones" }
  | { kind: "depgraph" };

export interface WikiSection {
  key: string;
  title: Bi;
  subtitle: Bi;
  updated: string;
  blocks: Block[];
}

const b = (en: string, vi: string): Bi => ({ en, vi });

/**
 * Problem statement + history, shown at the top of the Workflow (milestones)
 * page so the timeline has context.
 */
export const workflowIntro: Block[] = [
  { kind: "prose", text: b(
    "The Lonely Runner Conjecture (LRC) imagines $n$ runners on a circular track of length 1, starting together and running forever at distinct constant speeds. A runner is called lonely at some time if every other runner is at distance at least $1/n$ around the track. The conjecture asserts that each runner is lonely at some moment.",
    "Giả thuyết Người chạy cô đơn (LRC) hình dung $n$ người chạy trên đường tròn dài 1, xuất phát cùng nhau và chạy mãi với các tốc độ hằng phân biệt. Một người được gọi là cô đơn tại một thời điểm nếu mọi người khác cách nó ít nhất $1/n$ trên đường tròn. Giả thuyết khẳng định mỗi người đều cô đơn ở một thời điểm nào đó.",
  ) },
  { kind: "math", latex: "\\forall i \\; \\exists t : \\; \\lVert t\\,(v_i - v_j) \\rVert \\;\\geq\\; \\frac{1}{n} \\quad \\text{for all } j \\neq i",
    caption: b(
      "Here $\\lVert x \\rVert$ is the distance from $x$ to the nearest integer. Fixing one runner at speed 0 gives the standard normalized form.",
      "Ở đây $\\lVert x \\rVert$ là khoảng cách từ $x$ tới số nguyên gần nhất. Cố định một người ở tốc độ 0 cho dạng chuẩn hóa quen thuộc.",
    ) },
  { kind: "callout", tone: "note", text: b(
    "Project convention: this campaign indexes the problem by $k$, where $k = 13$ means 14 runners. The best HIVE-verified reproduction is $k = 9$ (10 runners); the target is $k = 13$.",
    "Quy ước dự án: chiến dịch này đánh chỉ số bài toán theo $k$, với $k = 13$ nghĩa là 14 người chạy. Kết quả tái lập HIVE mạnh nhất là $k = 9$ (10 người); mục tiêu là $k = 13$.",
  ) },
  { kind: "prose", text: b(
    "History. The problem was posed by Jörg M. Wills in 1967 as a question in Diophantine approximation, and independently by T. W. Cusick in 1973 through a geometric view-obstruction picture. Luis Goddyn gave it the name Lonely Runner in 1998. It is proved in general only for small numbers of runners, and open beyond that; the frontier is computational.",
    "Lịch sử. Bài toán được Jörg M. Wills nêu năm 1967 như một câu hỏi trong xấp xỉ Diophantine, và độc lập bởi T. W. Cusick năm 1973 qua bức tranh cản-tầm-nhìn hình học. Luis Goddyn đặt tên Người chạy cô đơn năm 1998. Nó chỉ được chứng minh tổng quát cho số người chạy nhỏ, còn mở ở phần sau; biên giới hiện nay mang tính tính toán.",
  ) },
  { kind: "table",
    head: [b("Year", "Năm"), b("Milestone", "Cột mốc"), b("By", "Bởi")],
    rows: [
      [b("1967", "1967"), b("Conjecture posed (Diophantine form)", "Nêu giả thuyết (dạng Diophantine)"), b("Wills", "Wills")],
      [b("1972", "1972"), b("Proved for 4 runners", "Chứng minh cho 4 người chạy"), b("Betke, Wills", "Betke, Wills")],
      [b("1973", "1973"), b("View-obstruction formulation", "Phát biểu cản tầm nhìn"), b("Cusick", "Cusick")],
      [b("1998", "1998"), b("Name \"Lonely Runner\" coined", "Đặt tên \"Người chạy cô đơn\""), b("Goddyn", "Goddyn")],
      [b("2001", "2001"), b("Proved for 6 runners", "Chứng minh cho 6 người chạy"), b("Bohman, Holzman, Kleitman", "Bohman, Holzman, Kleitman")],
      [b("2008", "2008"), b("Proved for 7 runners", "Chứng minh cho 7 người chạy"), b("Barajas, Serra", "Barajas, Serra")],
      [b("open", "mở"), b("8 or more runners", "8 người chạy trở lên"), b("unresolved in general", "chưa giải tổng quát")],
    ],
  },
];

export const sections: Record<string, WikiSection> = {
  claims: {
    key: "claims",
    title: b("Claim Ledger", "Sổ mệnh đề"),
    subtitle: b(
      "Every research claim with exact status, evidence and independence class.",
      "Mọi mệnh đề nghiên cứu với trạng thái, bằng chứng và lớp độc lập chính xác.",
    ),
    updated: "2026-07-17",
    blocks: [
      { kind: "prose", text: b(
        "HIVE governance forbids promoting a claim because it is plausible, repeated, or produced by multiple agents of the same model family. Each row records correctness, novelty and an Independence Class I0 to I4.",
        "Quản trị HIVE cấm nâng một mệnh đề chỉ vì nó hợp lý, lặp lại, hay được nhiều agent cùng họ mô hình tạo ra. Mỗi dòng ghi tính đúng, tính mới và một Lớp Độc lập I0 tới I4.",
      ) },
      { kind: "table",
        head: [b("ID", "Mã"), b("Statement", "Mệnh đề"), b("Status", "Trạng thái"), b("Ind.", "Độc lập")],
        rows: [
          [b("C0", "C0"), b("LRC(13) holds", "LRC(13) đúng"), b("OPEN, not attempted", "MỞ, chưa thử"), b("-", "-")],
          [b("C1", "C1"), b("Upstream proves $k \\le 12$", "Nguồn chứng minh $k \\le 12$"), b("EXTERNAL CLAIM", "TUYÊN BỐ NGOÀI"), b("I1, target I3", "I1, mục tiêu I3")],
          [b("C2", "C2"), b("$k = 9$ reproduced locally", "$k = 9$ tái lập cục bộ"), b("VERIFIED-LOCAL", "ĐÃ KIỂM CỤC BỘ"), b("I1", "I1")],
          [b("C2-DUP", "C2-DUP"), b("Duplicate-coordinate handling preserves multiplicity", "Xử lý tọa độ trùng bảo toàn bội"), b("SUPPORTED-INTERNAL", "CÓ CƠ SỞ NỘI BỘ"), b("I2", "I2")],
          [b("C-CERT", "C-CERT"), b("Certificate architecture verified (bounded)", "Kiến trúc chứng thư đã kiểm (có chặn)"), b("SUPPORTED-INTERNAL", "CÓ CƠ SỞ NỘI BỘ"), b("I2", "I2")],
          [b("C-D3", "C-D3"), b("$k=13$ tight-class direct-properness certificate", "Chứng thư properness lớp tight $k=13$"), b("SUPPORTED-INTERNAL", "CÓ CƠ SỞ NỘI BỘ"), b("I2", "I2")],
          [b("C-D4-K13-P191", "C-D4-K13-P191"), b("$k=13$ tight residual closed EXACTLY at $p=191$: 16,171 orbit-classes, mass identity", "Residual tight $k=13$ đóng CHÍNH XÁC tại $p=191$: 16.171 lớp orbit, đẳng thức khối lượng"), b("SUPPORTED-INTERNAL", "CÓ CƠ SỞ NỘI BỘ"), b("I2", "I2")],
          [b("C-D5-K13-UNIFORM", "C-D5-K13-UNIFORM"), b("$k=13$ tight interface proper for EVERY prime $p>182$ (threshold $P_0=78$, 0 exceptions)", "Giao diện tight $k=13$ proper với MỌI prime $p>182$ (ngưỡng $P_0=78$, 0 ngoại lệ)"), b("SUPPORTED-INTERNAL", "CÓ CƠ SỞ NỘI BỘ"), b("I2", "I2")],
          [b("L-D7-UNIT-ACTION", "L-D7-UNIT-ACTION"), b("Unit action preserves the raw cover relation and the terminal find_cover objects (upstream reproduced at object level)", "Tác động unit bảo toàn quan hệ cover thô và đối tượng find_cover cuối (upstream tái lập ở mức đối tượng)"), b("SUPPORTED-INTERNAL", "CÓ CƠ SỞ NỘI BỘ"), b("I2", "I2")],
          [b("C-D8-FOURIER", "C-D8-FOURIER"), b("Relation-sparse vectors are proper: finite-Fourier identity $M(u)=\\hat G(0)^k+\\text{relation mass}$, eliminating an infinite class", "Vector relation-sparse là proper: danh tính Fourier $M(u)=\\hat G(0)^k+\\text{khối lượng quan hệ}$, loại một lớp vô hạn"), b("SUPPORTED-INTERNAL", "CÓ CƠ SỞ NỘI BỘ"), b("I2", "I2")],
          [b("C-D9-ABS-BARRIER", "C-D9-ABS-BARRIER"), b("The GLOBAL absolute-value Fourier tail bound cannot certify $M(u)>0$ ($\\text{ABS} \\approx \\lVert\\hat G\\rVert_1^{\\,k}/p \\gg \\hat G(0)^k$); signed cancellation required (local post-structure bounds not excluded)", "Chặn đuôi Fourier trị-tuyệt-đối TOÀN CỤC không chứng nhận được $M(u)>0$ ($\\text{ABS} \\approx \\lVert\\hat G\\rVert_1^{\\,k}/p \\gg \\hat G(0)^k$); cần triệt tiêu có dấu (không loại chặn cục bộ sau khi bóc cấu trúc)"), b("PROVED-INTERNAL", "ĐÃ CHỨNG MINH NỘI BỘ"), b("I2", "I2")],
          [b("C-D10-PAIR-INVERSE", "C-D10-PAIR-INVERSE"), b("Large pair-correlation deviation forces low rational ratio height: $|\\rho_2(q)-\\beta^2|$ big $\\Rightarrow h(q)$ small", "Lệch tương quan cặp lớn ép chiều cao tỉ số hữu tỉ thấp: $|\\rho_2(q)-\\beta^2|$ lớn $\\Rightarrow h(q)$ nhỏ"), b("PROVED-DIRECTION", "ĐÃ CHỨNG MINH MỘT CHIỀU"), b("I2", "I2")],
          [b("C-D11-SPIKE-REMOVAL", "C-D11-SPIKE-REMOVAL"), b("Exact $t=0$ spike removal: $\\mu_j = \\binom{13}{j}/p + \\frac{p-1}{p}\\mu_j^{*}$; generic punctured deg-5 margin $>0$ for all 109 inventory primes", "Loại spike $t=0$ chính xác: $\\mu_j = \\binom{13}{j}/p + \\frac{p-1}{p}\\mu_j^{*}$; margin generic đục-lỗ bậc-5 $>0$ cho cả 109 prime"), b("PROVED-INTERNAL", "ĐÃ CHỨNG MINH NỘI BỘ"), b("I2", "I2")],
          [b("C-D12-SPARSE-PAIR-BUDGET", "C-D12-SPARSE-PAIR-BUDGET"), b("Ratio-graph dichotomy: sparse pair graph (≤2 edges) + certified higher residual $\\Rightarrow$ margin $>0$ $\\Rightarrow$ proper; dense $\\Rightarrow$ spanning-forest relation basis", "Dichotomy đồ thị tỉ số: đồ thị cặp thưa (≤2 cạnh) + dư bậc cao đã chứng nhận $\\Rightarrow$ margin $>0$ $\\Rightarrow$ proper; dày $\\Rightarrow$ relation basis spanning-forest"), b("SUPPORTED-CONDITIONAL", "CÓ CƠ SỞ CÓ ĐIỀU KIỆN"), b("I2", "I2")],
          [b("C-D13-SUPPORT3-INVERSE-SCOPED", "C-D13-SUPPORT3-INVERSE-SCOPED"), b("Connected hypergraph: large connected triple correlation $\\Rightarrow$ bounded-height support-3 relation (profile measured at $p=191$); hypergraph recovers the tight class as additive rank 1", "Hypergraph liên thông: tương quan bộ-ba liên thông lớn $\\Rightarrow$ quan hệ support-3 chiều cao chặn (profile đo tại $p=191$); hypergraph thu về lớp tight hạng cộng 1"), b("SUPPORTED-INTERNAL / SCOPE-BOUND", "CÓ CƠ SỞ NỘI BỘ / GIỚI HẠN PHẠM VI"), b("I2", "I2")],
          [b("C-D14-PURITY-LEMMA", "C-D14-PURITY-LEMMA"), b("Connected-support purity: $\\kappa_S$ is an EXACT identity separating a primitive additive relation from the deterministic puncture $-\\tfrac{1}{p-1}(1-\\beta)^{s}$; decomposable frequencies cancel, so relation hyperedges are pure", "Thuần khiết support liên thông: $\\kappa_S$ là danh tính CHÍNH XÁC tách quan hệ cộng nguyên thủy khỏi đục-lỗ xác định $-\\tfrac{1}{p-1}(1-\\beta)^{s}$; tần số phân tách triệt tiêu, nên hyperedge quan hệ thuần khiết"), b("PROVED-INTERNAL", "ĐÃ CHỨNG MINH NỘI BỘ"), b("I2", "I2")],
          [b("C-D14-SUPPORT3-TAIL", "C-D14-SUPPORT3-TAIL"), b("Support-3 dichotomy: each connected triple is a low-height primitive relation OR $|\\kappa_3 - \\text{puncture}|$ is small; audited at $p=191/439/877$. SUPERSEDED by C-D15-SUPPORT3-INVENTORY (the 9/1000 constant fails at $p=281$)", "Dichotomy support-3: mỗi bộ-ba liên thông là quan hệ nguyên thủy chiều-cao-thấp HOẶC $|\\kappa_3 - \\text{đục-lỗ}|$ nhỏ; audit tại $p=191/439/877$. ĐƯỢC THAY bằng C-D15-SUPPORT3-INVENTORY (hằng 9/1000 sai tại $p=281$)"), b("SUPERSEDED BY D15", "ĐƯỢC D15 THAY THẾ"), b("I2", "I2")],
          [b("C-D15-ORBIT-IDENTITY", "C-D15-ORBIT-IDENTITY"), b("Exact projective orbit-mass identity: the homogeneous relation sum $\\sum_{m\\cdot u=0}\\prod\\widehat B(m_i)$ equals $\\sum_D A_p(D)$ over scalar-orbit directions; direction height $= $ primitive relation height, relation lattice has $\\det = p$", "Danh tính khối-lượng-quỹ-đạo xạ ảnh chính xác: tổng quan hệ thuần nhất $\\sum_{m\\cdot u=0}\\prod\\widehat B(m_i)$ bằng $\\sum_D A_p(D)$ theo hướng quỹ-đạo vô hướng; chiều cao hướng $=$ chiều cao quan hệ nguyên thủy, relation lattice có $\\det = p$"), b("PROVED-INTERNAL", "ĐÃ CHỨNG MINH NỘI BỘ"), b("I2", "I2")],
          [b("C-D15-SUPPORT3-INVENTORY", "C-D15-SUPPORT3-INVENTORY"), b("Support-3 tail over 109 primes measured on the extremal family ($\\tau_3 < 1/100$, max $0.009475$ at $p=281$). SUPERSEDED by C-D16-SUPPORT3-COMPLETE (the family was incomplete; the full universe reaches $0.010377$ at $p=353$)", "Đuôi support-3 trên 109 prime đo trên họ cực trị ($\\tau_3 < 1/100$, max $0.009475$ tại $p=281$). ĐƯỢC THAY bằng C-D16-SUPPORT3-COMPLETE (họ chưa đầy đủ; full universe đạt $0.010377$ tại $p=353$)"), b("SUPERSEDED BY D16", "ĐƯỢC D16 THAY THẾ"), b("I2", "I2")],
          [b("C-D16-MODULAR-RANK", "C-D16-MODULAR-RANK"), b("Relation rank is computed over $\\mathbb{F}_p$: since $Ru \\equiv 0 \\pmod p$ with $u \\neq 0$, $\\operatorname{rank}_{\\mathbb{F}_p}(R) \\le 12$ and $\\dim_{\\mathbb{F}_p}\\ker R = 13 - \\operatorname{rank}_{\\mathbb{F}_p}(R) \\ge 1$; the D15 $\\mathbb{Q}$-rank additive-dimension inference is withdrawn", "Hạng quan hệ tính trên $\\mathbb{F}_p$: vì $Ru \\equiv 0 \\pmod p$ với $u \\neq 0$, $\\operatorname{rank}_{\\mathbb{F}_p}(R) \\le 12$ và $\\dim_{\\mathbb{F}_p}\\ker R = 13 - \\operatorname{rank}_{\\mathbb{F}_p}(R) \\ge 1$; suy luận chiều cộng theo $\\mathbb{Q}$-rank của D15 bị rút"), b("PROVED-INTERNAL", "ĐÃ CHỨNG MINH NỘI BỘ"), b("I2", "I2")],
          [b("C-D16-SUPPORT3-COMPLETE", "C-D16-SUPPORT3-COMPLETE"), b("Support-3 closes on the COMPLETE universe of all $(p-1)^2$ triple ratios at every one of the 109 primes: the long tail $\\tau_3(p) < 11/1000$ (max $0.010377$ at $p=353$), correcting D14's $9/1000$ and D15's $1/100$", "Support-3 đóng trên universe ĐẦY ĐỦ gồm mọi $(p-1)^2$ tỉ số bộ-ba tại từng prime trong 109: đuôi dài $\\tau_3(p) < 11/1000$ (max $0.010377$ tại $p=353$), sửa $9/1000$ của D14 và $1/100$ của D15"), b("VALIDATED-EXACT / COMPLETE", "ĐÃ THẨM ĐỊNH CHÍNH XÁC / ĐẦY ĐỦ"), b("I2", "I2")],
          [b("C-D16-SUPPORT4-FRAMEWORK", "C-D16-SUPPORT4-FRAMEWORK"), b("Primitive support-4 projective relations: exact orbit-mass identity, relation lattice $\\det = p$, connected 4th cumulant $\\kappa_4$ (lower orders subtracted); full-universe exact at 4 small primes gives $\\tau_4 < 8/1000$; inventory-wide closure and support-5 remain OPEN", "Quan hệ xạ ảnh support-4 nguyên thủy: danh tính khối-lượng-quỹ-đạo chính xác, relation lattice $\\det = p$, cumulant bậc 4 liên thông $\\kappa_4$ (đã trừ bậc thấp); full-universe chính xác tại 4 prime nhỏ cho $\\tau_4 < 8/1000$; đóng toàn inventory và support-5 vẫn MỞ"), b("SUPPORTED-INTERNAL / PARTIAL-INVENTORY", "CÓ CƠ SỞ NỘI BỘ / MỘT PHẦN INVENTORY"), b("I2", "I2")],
          [b("C4", "C4"), b("Raw logs sufficient for independent checker", "Log thô đủ cho bộ kiểm độc lập"), b("REFUTED AS-IS", "BỊ BÁC Ở TRẠNG THÁI HIỆN TẠI"), b("I2", "I2")],
        ],
      },
      { kind: "callout", tone: "note", text: b(
        "No public claim is authorized. C0 remains OPEN: the project has not solved LRC(13); it has built verifiable infrastructure and narrowed the mathematical obstruction.",
        "Không tuyên bố công khai nào được phép. C0 vẫn MỞ: dự án chưa giải LRC(13); nó dựng hạ tầng kiểm chứng được và thu hẹp rào cản toán học.",
      ) },
    ],
  },

  reproduction: {
    key: "reproduction",
    title: b("Reproduction Ladder", "Thang tái lập"),
    subtitle: b("Independently re-verified computational results, rung by rung.", "Kết quả tính toán được tái kiểm độc lập, từng bậc."),
    updated: "2026-07-17",
    blocks: [
      { kind: "stat", items: [
        { label: b("Best verified", "Tốt nhất đã kiểm"), value: "$k = 9$" },
        { label: b("Runtime (M1 Max)", "Thời gian chạy"), value: "115.9 s" },
        { label: b("Primes checked", "Số nguyên tố kiểm"), value: "51 / 51" },
        { label: b("Match to upstream", "Khớp nguồn"), value: "digit-exact" },
      ] },
      { kind: "prose", text: b(
        "$k = 9$ was reproduced from a clean clone using the upstream run.sh unchanged. log_summary.py reports PROOF: YES with log-product 257.870103, matching upstream result_10 to the last digit. This is the strongest HIVE-verified result (VERIFIED-LOCAL, independence I1).",
        "$k = 9$ được tái lập từ bản clone sạch dùng run.sh nguyên trạng. log_summary.py báo PROOF: YES với log-product 257.870103, khớp result_10 tới chữ số cuối. Đây là kết quả HIVE-verified mạnh nhất (VERIFIED-LOCAL, độc lập I1).",
      ) },
      { kind: "table",
        head: [b("k", "k"), b("Runners", "Người chạy"), b("State", "Trạng thái"), b("Resource", "Tài nguyên")],
        rows: [
          [b("9", "9"), b("10", "10"), b("COMPLETED, reproduced", "HOÀN TẤT, đã tái lập"), b("S, minutes", "S, vài phút")],
          [b("10", "10"), b("11", "11"), b("NEXT, with manifest", "TIẾP THEO, kèm manifest"), b("S/M, ~1.5 to 3 h", "S/M, ~1.5 tới 3 h")],
          [b("11", "11"), b("12", "12"), b("PENDING", "CHỜ"), b("M, ~40 h", "M, ~40 h")],
          [b("12", "12"), b("13", "13"), b("PENDING", "CHỜ"), b("L, multi-machine", "L, nhiều máy")],
          [b("13", "13"), b("14", "14"), b("TARGET", "MỤC TIÊU"), b("L++, new method needed", "L++, cần phương pháp mới")],
        ],
      },
    ],
  },

  campaigns: {
    key: "campaigns",
    title: b("Prime Campaigns", "Chiến dịch số nguyên tố"),
    subtitle: b("Per-prime certification runs and the exact finite-prime threshold.", "Các lần chứng thư theo prime và ngưỡng số nguyên tố hữu hạn chính xác."),
    updated: "2026-07-17",
    blocks: [
      { kind: "prose", text: b(
        "A counterexample to LRC(k) would have a product of speeds below $B_k$. If enough primes $p$ each force $p \\mid \\prod v_i$ (because $I(k,p,l)=\\varnothing$), the product exceeds $B_k$ and no counterexample can exist.",
        "Một phản ví dụ cho LRC(k) sẽ có tích tốc độ dưới $B_k$. Nếu đủ nhiều số nguyên tố $p$ mỗi cái buộc $p \\mid \\prod v_i$ (vì $I(k,p,l)=\\varnothing$), thì tích vượt $B_k$ và không phản ví dụ nào tồn tại.",
      ) },
      { kind: "math", latex: "\\prod_{p \\in P_k} p \\;\\geq\\; B_k \\;=\\; \\left[\\frac{\\binom{k+1}{2}^{\\,k-1}}{k}\\right]^{k}",
        caption: b("Verified with exact integer arithmetic, no floating point in the controlling comparison.", "Kiểm bằng số học nguyên chính xác, không dùng số thực ở phép so sánh quyết định.") },
      { kind: "table",
        head: [b("Case", "Trường hợp"), b("Producer", "Bộ sinh"), b("Cert (gz)", "Chứng thư (gz)"), b("Result", "Kết quả")],
        rows: [
          [b("$k=9,\\ p=19$ (full chain)", "$k=9,\\ p=19$ (chuỗi đầy đủ)"), b("2.66 s", "2.66 s"), b("3.69 MB", "3.69 MB"), b("CERTIFIED, both verifiers", "ĐÃ CHỨNG THƯ, hai verifier")],
          [b("$k=9,\\ p=53$ (orbit)", "$k=9,\\ p=53$ (orbit)"), b("3.61 s", "3.61 s"), b("6.07 MB", "6.07 MB"), b("CERTIFIED, 4651 classes", "ĐÃ CHỨNG THƯ, 4651 lớp")],
          [b("$k=9,\\ p=151$ (preflight)", "$k=9,\\ p=151$ (preflight)"), b("killed", "đã dừng"), b("-", "-"), b("CAP EXCEEDED 9.3x", "VƯỢT CAP 9.3x")],
        ],
      },
      { kind: "stat", items: [
        { label: b("Threshold: product of 51 primes", "Ngưỡng: tích 51 số nguyên tố"), value: "373-bit" },
        { label: b("Required $B_9$", "Yêu cầu $B_9$"), value: "367-bit" },
        { label: b("Comparison", "So sánh"), value: "PASS (exact int)" },
      ] },
    ],
  },

  verification: {
    key: "verification",
    title: b("Verification & Certificates", "Kiểm chứng & Chứng thư"),
    subtitle: b("How every result is double-checked: producer, two verifiers, provenance.", "Cách mọi kết quả được kiểm kép: bộ sinh, hai verifier, xuất xứ."),
    updated: "2026-07-17",
    blocks: [
      { kind: "prose", text: b(
        "A certificate is valid only when a mathematical proof-trace, an exact independent verifier acceptance, and a complete provenance manifest all agree. A matching final log line is not sufficient.",
        "Một chứng thư chỉ hợp lệ khi cùng lúc: proof-trace toán học, verifier độc lập chính xác chấp nhận, và manifest xuất xứ đầy đủ. Một dòng log cuối khớp là chưa đủ.",
      ) },
      { kind: "keyvalue", rows: [
        { k: b("Schema versions", "Phiên bản schema"), v: b("hive-cert 0.1 to 0.4 (orbit streaming)", "hive-cert 0.1 tới 0.4 (orbit streaming)") },
        { k: b("Verifier V1", "Verifier V1"), v: b("iterative pushdown, exact Fraction arithmetic", "pushdown lặp, số học Fraction chính xác") },
        { k: b("Verifier V2", "Verifier V2"), v: b("structurally independent (bitset oracle, two-pass model)", "độc lập cấu trúc (oracle bitset, mô hình hai lượt)") },
        { k: b("Corruption suite", "Bộ tấn công"), v: b("14 of 14 rejected by BOTH verifiers", "14 trên 14 bị CẢ HAI verifier từ chối") },
        { k: b("Independence ceiling", "Trần độc lập"), v: b("I2 (two same-author implementations)", "I2 (hai bản cùng tác giả)") },
      ] },
      { kind: "callout", tone: "result", text: b(
        "Double-check in action: the orbit certificate proves the completeness equation (sum of region-counts) = (sum of orbit-sizes) = 120926, with both sides recomputed independently by the verifier, never trusting the producer's count.",
        "Kiểm kép thực tế: chứng thư orbit chứng minh đẳng thức đầy đủ (tổng region-count) = (tổng orbit-size) = 120926, với cả hai vế được verifier tự tính lại, không tin số đếm của bộ sinh.",
      ) },
    ],
  },

  risks: {
    key: "risks",
    title: b("Risk Register", "Sổ rủi ro"),
    subtitle: b("Active P0 risks and resolved obstructions, with evidence.", "Rủi ro P0 hoạt động và các rào cản đã giải, kèm bằng chứng."),
    updated: "2026-07-17",
    blocks: [
      { kind: "table",
        head: [b("ID", "Mã"), b("Risk", "Rủi ro"), b("State", "Trạng thái")],
        rows: [
          [b("R1-B", "R1-B"), b("Production-scale certificate not yet complete", "Chứng thư quy mô sản xuất chưa hoàn tất"), b("ACTIVE P0", "HOẠT ĐỘNG P0")],
          [b("R3-D", "R3-D"), b("$k=13$ tight interface: uniform theorem over all primes $p>182$ proved in D5", "Giao diện tight $k=13$: định lý đồng đều trên mọi prime $p>182$ đã chứng minh ở D5"), b("RESOLVED", "ĐÃ GIẢI")],
          [b("R3-E", "R3-E"), b("Non-tight stages open: D6 finds find_cover campaign-infeasible under caps (hard prime PROJECTED $\\approx 21\\times$ cap; blocked-as-architected)", "Tầng non-tight còn mở: D6 thấy find_cover bất khả thi quy mô chiến dịch dưới cap (prime khó DỰ BÁO $\\approx 21\\times$ cap; chặn-do-kiến-trúc)"), b("ACTIVE P0", "HOẠT ĐỘNG P0")],
          [b("R3-F", "R3-F"), b("D5 theorem-to-reduction integration verified (rule + state equivalence + 2 verifiers)", "Tích hợp định lý D5 vào rút gọn đã kiểm (rule + tương đương trạng thái + 2 verifier)"), b("RESOLVED", "ĐÃ GIẢI")],
          [b("R3-H", "R3-H"), b("find_cover predicate identified (D7R): upstream oracle reproduces $p=53=4651$, independent oracle matches at object level", "Predicate find_cover đã xác định (D7R): oracle upstream tái lập $p=53=4651$, oracle độc lập khớp mức đối tượng"), b("RESOLVED", "ĐÃ GIẢI")],
          [b("R2", "R2"), b("Duplicate-coordinate traceability", "Truy vết tọa độ trùng"), b("RESOLVED, no gap found", "ĐÃ GIẢI, không có lỗ hổng")],
          [b("R1-C", "R1-C"), b("Raw expansion before quotient", "Giãn nở thô trước quotient"), b("RESOLVED, orbit-compressed", "ĐÃ GIẢI, nén orbit")],
          [b("R1-D", "R1-D"), b("Exact orbit-count certificate", "Chứng thư đếm orbit chính xác"), b("RESOLVED, exact at $p=53$", "ĐÃ GIẢI, chính xác tại $p=53$")],
        ],
      },
      { kind: "callout", tone: "result", text: b(
        "Gate D4 replaced the earlier estimate with an EXACT count ($16{,}171$ orbit-classes at $p=191$, mass identity $B_0+B_1+\\text{residual}=14^{13}$). Gate D5 then lifted the single prime to a THEOREM over primes: the $k=13$ tight interface is proper for every prime $p>182$ (aggregate threshold $P_0=78$, zero exceptional primes). Two independent verifiers accept both; 16 of 16 (D4) and 18 of 18 (D5) corruption attacks rejected.",
        "Gate D4 thay ước lượng cũ bằng con số CHÍNH XÁC ($16{,}171$ lớp orbit tại $p=191$, đẳng thức khối lượng $B_0+B_1+\\text{residual}=14^{13}$). Gate D5 nâng một prime thành ĐỊNH LÝ theo prime: giao diện tight $k=13$ proper với mọi prime $p>182$ (ngưỡng tổng hợp $P_0=78$, không prime ngoại lệ). Hai verifier độc lập chấp nhận cả hai; 16/16 (D4) và 18/18 (D5) tấn công bị từ chối.",
      ) },
    ],
  },

  resources: {
    key: "resources",
    title: b("Resource Profile", "Hồ sơ tài nguyên"),
    subtitle: b("Compute buckets and the current bottleneck.", "Nhóm tài nguyên tính toán và điểm nghẽn hiện tại."),
    updated: "2026-07-17",
    blocks: [
      { kind: "stat", items: [
        { label: b("Local machine", "Máy cục bộ"), value: "Apple M1 Max, 32 GB" },
        { label: b("Cloud budget (B1)", "Ngân sách cloud (B1)"), value: "up to 15,000,000 vnd" },
        { label: b("k=9 campaign", "Chiến dịch k=9"), value: "S/M" },
        { label: b("k=13 (current method)", "k=13 (phương pháp hiện tại)"), value: "L++" },
      ] },
      { kind: "list", items: [
        b("S, Plentiful: single short session (compile, find_cover, $k \\le 9$).", "S, Dồi dào: một phiên ngắn (compile, find_cover, $k \\le 9$)."),
        b("M, Moderate: hours or a strong machine ($k=10$, $k=11$).", "M, Trung bình: nhiều giờ hoặc máy mạnh ($k=10$, $k=11$)."),
        b("L, Constrained: long multi-machine campaign ($k=12$), or infeasible ($k=13$ by lift).", "L, Hạn chế: chiến dịch dài nhiều máy ($k=12$), hoặc bất khả thi ($k=13$ bằng lift)."),
      ] },
      { kind: "callout", tone: "note", text: b("L-class resources are the current bottleneck. The direct-properness certificate (Gate D3) aims to replace the L++ tight-class lift with a seconds-scale orbit certificate.", "Tài nguyên mức L là điểm nghẽn hiện tại. Chứng thư properness trực tiếp (Gate D3) nhắm thay lift lớp tight L++ bằng chứng thư orbit cỡ vài giây.") },
    ],
  },

  notes: {
    key: "notes",
    title: b("Notes & Next Actions", "Ghi chú & Hành động tiếp theo"),
    subtitle: b("The concrete, ordered next steps.", "Các bước tiếp theo cụ thể, có thứ tự."),
    updated: "2026-07-17",
    blocks: [
      { kind: "list", items: [
        b("DONE (Gate D4): exact $k=13$ orbit count is $16{,}171$, with mass identity $B_0+B_1+\\text{residual}=14^{13}$ and every representative proper.", "XONG (Gate D4): đếm orbit $k=13$ chính xác là $16{,}171$, với đẳng thức khối lượng $B_0+B_1+\\text{residual}=14^{13}$ và mọi đại diện proper."),
        b("DONE (Gate D5): the tight interface is proved proper for EVERY prime $p>182$ (threshold $P_0=78$, no exceptions), reusing the D4 orbit partition.", "XONG (Gate D5): giao diện tight đã chứng minh proper với MỌI prime $p>182$ (ngưỡng $P_0=78$, không ngoại lệ), tái dùng phân hoạch orbit D4."),
        b("Next: close the remaining non-tight stages of the $k=13$ reduction (the other strata of $I(13,p,\\cdot)$).", "Tiếp theo: đóng các tầng non-tight còn lại của rút gọn $k=13$ (các tầng khác của $I(13,p,\\cdot)$)."),
        b("Integrate the direct-properness certificate into the campaign pipeline, replacing $\\text{lift} \\times 7$ for the tight class.", "Tích hợp chứng thư properness trực tiếp vào pipeline chiến dịch, thay $\\text{lift} \\times 7$ cho lớp tight."),
        b("Formalize B2' soundness and Prop 4.5 orbit-invariance in Lean (needs a funded compute session for Mathlib).", "Hình thức hóa tính đúng B2' và bất biến orbit Prop 4.5 trong Lean (cần phiên compute có ngân sách cho Mathlib)."),
        b("Reproduce $k=10$ with a full provenance manifest.", "Tái lập $k=10$ với manifest xuất xứ đầy đủ."),
      ] },
    ],
  },

  artifacts: {
    key: "artifacts",
    title: b("Artifacts", "Tư liệu"),
    subtitle: b("Reports, certificates and verifiers produced across the gates.", "Báo cáo, chứng thư và verifier tạo qua các gate."),
    updated: "2026-07-17",
    blocks: [
      { kind: "keyvalue", rows: [
        { k: b("SCAN_REPORT.md + addendum", "SCAN_REPORT.md + phụ lục"), v: b("scan, 16 sections + provenance", "khảo sát, 16 mục + xuất xứ") },
        { k: b("Gate A audit", "Audit Gate A"), v: b("duplicate-coordinate, independent checker", "tọa độ trùng, bộ kiểm độc lập") },
        { k: b("hive-cert 0.1 to 0.4", "hive-cert 0.1 tới 0.4"), v: b("producers + 2 verifiers + corruption suites", "bộ sinh + 2 verifier + bộ tấn công") },
        { k: b("orbit certificates", "chứng thư orbit"), v: b("$p=53$ (6.07 MB gz), $k=9,\\ p=19$ full-chain", "$p=53$ (6.07 MB gz), $k=9,\\ p=19$ chuỗi đầy đủ") },
        { k: b("D0 to D3 analytic", "D0 tới D3 giải tích"), v: b("Prop 4.4 audit, obstruction dossier, direct certificate", "audit Prop 4.4, hồ sơ rào cản, chứng thư trực tiếp") },
      ] },
      { kind: "callout", tone: "note", text: b("Every artifact is SHA-256 hashed in the command log; upstream repositories stay read-only and clean.", "Mọi tư liệu có hash SHA-256 trong command log; các repo nguồn giữ chỉ đọc và sạch.") },
    ],
  },

  settings: {
    key: "settings",
    title: b("Settings", "Cài đặt"),
    subtitle: b("Display and governance configuration.", "Cấu hình hiển thị và quản trị."),
    updated: "2026-07-17",
    blocks: [
      { kind: "keyvalue", rows: [
        { k: b("Language", "Ngôn ngữ"), v: b("English / Tiếng Việt (profile menu)", "English / Tiếng Việt (menu hồ sơ)") },
        { k: b("Demo mode", "Chế độ demo"), v: b("adding demo=1 to the URL pins the date and version for stable screenshots", "thêm demo=1 vào URL sẽ cố định ngày và phiên bản cho ảnh chụp ổn định") },
        { k: b("Typeface", "Phông chữ"), v: b("Inter (UI), KaTeX (mathematics)", "Inter (giao diện), KaTeX (toán học)") },
        { k: b("Palette", "Bảng màu"), v: b("monochrome, status shown by weight, not colour", "đơn sắc, trạng thái thể hiện bằng độ đậm, không bằng màu") },
        { k: b("Public claims", "Tuyên bố công khai"), v: b("disabled", "đã tắt") },
      ] },
    ],
  },
};

export const sectionOrder = [
  "claims", "reproduction", "campaigns", "workflow",
  "verification", "risks", "resources", "notes", "artifacts", "settings",
];
