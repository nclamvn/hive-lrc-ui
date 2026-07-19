/**
 * Gate / milestone timeline - real project history (Scan to Gate D3), bilingual.
 * verify:  "double" = re-derived by two independent methods; "single" = checked once;
 *          "pending" = authored, not yet independently checked.
 * independence: HIVE evidence class I0..I4.
 */
export type GateStatus = "pass" | "partial" | "blocked" | "current" | "refuted";
export type VerifyLevel = "double" | "single" | "pending";
export type IndClass = "I0" | "I1" | "I2" | "I3" | "I4";
export type Bi = { en: string; vi: string };

export interface Milestone {
  id: string;
  phase: string;
  title: Bi;
  status: GateStatus;
  verify: VerifyLevel;
  independence: IndClass;
  date: string;
  summary: Bi;
  checks: Bi[];
  artifacts: number;
}

const b = (en: string, vi: string): Bi => ({ en, vi });

export const gates: Milestone[] = [
  {
    id: "scan", phase: "SCAN",
    title: b("Multi-repository research scan", "Khảo sát đa kho nghiên cứu"),
    status: "pass", verify: "double", independence: "I1", date: "2026-07-17",
    summary: b(
      "Four upstream sources cloned, audited and compiled, k=9 reproduced locally in 116 s, matching upstream result_10 digit for digit.",
      "Bốn nguồn thượng nguồn được clone, audit và compile, k=9 tái lập cục bộ trong 116 giây, khớp result_10 tới từng chữ số.",
    ),
    checks: [
      b("k=9 reproduction output identical to upstream result_10", "Kết quả tái lập k=9 giống hệt result_10 của nguồn"),
      b("Product-over-primes threshold re-checked with exact integers", "Ngưỡng tích số nguyên tố kiểm lại bằng số nguyên chính xác"),
      b("git status clean on all three upstream repositories", "git status sạch trên cả ba kho nguồn"),
    ],
    artifacts: 6,
  },
  {
    id: "gate-a", phase: "GATE A",
    title: b("Duplicate-coordinate traceability audit", "Audit truy vết tọa độ trùng"),
    status: "pass", verify: "double", independence: "I2", date: "2026-07-17",
    summary: b(
      "The R2 concern rested on a false premise: the pipeline enumerates sorted multisets (a padding phase), not distinct sets, matching the tuple theory exactly.",
      "Nghi vấn R2 dựa trên tiền đề sai: pipeline liệt kê multiset sắp thứ tự (pha đệm), không phải tập phân biệt, khớp đúng lý thuyết tuple.",
    ),
    checks: [
      b("Independent brute-force checker matched S3 counts 35 / 4225 / 56215", "Bộ kiểm brute-force độc lập khớp số S3: 35 / 4225 / 56215"),
      b("Exhaustive small-k truth model: 0 missed, 0 unsound", "Mô hình chân trị k nhỏ vét cạn: 0 sót, 0 sai"),
      b("S2 canonical class count matches freeze/frozen", "Số lớp chuẩn tắc S2 khớp freeze/frozen"),
    ],
    artifacts: 7,
  },
  {
    id: "gate-b", phase: "GATE B",
    title: b("Certificate architecture", "Kiến trúc chứng thư"),
    status: "pass", verify: "double", independence: "I2", date: "2026-07-17",
    summary: b(
      "Recursive proof-trace certificate plus an independent verifier, it rejects false prunes, fabricated survivors and phantom duplicates, not just checksum tampering.",
      "Chứng thư proof-trace đệ quy cùng một verifier độc lập, nó từ chối prune sai, survivor bịa và bản trùng ảo, không chỉ giả mạo checksum.",
    ),
    checks: [
      b("8 of 8 corruption fixtures rejected, including hash-consistent maths attacks", "8/8 mẫu tấn công bị từ chối, kể cả tấn công toán học nhất quán hash"),
      b("Regression: certificate survivors equal the truth model, 0 mismatch", "Hồi quy: survivor của chứng thư bằng mô hình chân trị, 0 lệch"),
      b("Verifier structurally independent from producer", "Verifier độc lập cấu trúc với bộ sinh"),
    ],
    artifacts: 24,
  },
  {
    id: "gate-c", phase: "GATE C",
    title: b("Certified reproduction and orbit compression", "Tái lập có chứng thư và nén orbit"),
    status: "pass", verify: "double", independence: "I2", date: "2026-07-17",
    summary: b(
      "C++ producer plus two verifiers plus a provenance manifest. Orbit-level certificate for the p=53 case verified with the exact completeness equation 120 926 = 120 926.",
      "Bộ sinh C++ cùng hai verifier và manifest xuất xứ. Chứng thư mức orbit cho p=53 kiểm bằng đẳng thức đầy đủ chính xác 120 926 = 120 926.",
    ),
    checks: [
      b("C++ core hash matches the Python producer bit for bit (7 of 7)", "Hash lõi C++ khớp bộ sinh Python từng bit (7/7)"),
      b("Completeness equation recomputed by both verifiers", "Đẳng thức đầy đủ được cả hai verifier tính lại"),
      b("Streaming producer peak RAM 3.1 MB, versus 10.7 GB unstreamed", "Bộ sinh streaming đỉnh RAM 3.1 MB, so với 10.7 GB không streaming"),
    ],
    artifacts: 41,
  },
  {
    id: "gate-c004", phase: "GATE C.004",
    title: b("Full k=9 campaign, estimate gate", "Chiến dịch k=9 đầy đủ, cổng ước lượng"),
    status: "partial", verify: "double", independence: "I2", date: "2026-07-17",
    summary: b(
      "p=19 fully certified by both verifiers. Campaign halted at preflight: p=151 exceeded the per-prime cap 9.3 times, exposing the lift-stage raw-expansion wall.",
      "p=19 được chứng thư đầy đủ bởi cả hai verifier. Chiến dịch dừng ở preflight: p=151 vượt cap mỗi prime 9.3 lần, lộ ra bức tường giãn nở thô tầng lift.",
    ),
    checks: [
      b("p=19 certified: tight fiber empty, both verifiers accept, manifest complete", "p=19 chứng thư: fiber tight rỗng, hai verifier chấp nhận, manifest đủ"),
      b("Exact integer threshold: 373-bit product beats 367-bit bound", "Ngưỡng số nguyên chính xác: tích 373-bit vượt chặn 367-bit"),
      b("Stopped at the cap rather than dropping the hard prime", "Dừng tại cap thay vì bỏ prime khó"),
    ],
    artifacts: 12,
  },
  {
    id: "gate-c005", phase: "GATE C.005",
    title: b("Orbit-compressed lift, measured infeasible", "Nén orbit tầng lift, đo được bất khả thi"),
    status: "blocked", verify: "single", independence: "I2", date: "2026-07-17",
    summary: b(
      "Both allowed compression families measured to fail: decision-DAG state sharing 0.999 (no sharing), orbit-stabilizer only a constant factor. The enumeration route is closed.",
      "Cả hai họ nén được phép đo là thất bại: chia sẻ trạng thái DAG 0.999 (không chia sẻ), orbit-stabilizer chỉ hằng số. Trục liệt kê bị đóng.",
    ),
    checks: [
      b("DAG distinct-state over node ratio = 0.999 (exhaustive small)", "Tỉ lệ trạng-thái-phân-biệt trên node của DAG = 0.999 (vét cạn nhỏ)"),
      b("Seed stabilizer equals the group size, a bounded factor only", "Stabilizer seed bằng cỡ nhóm, chỉ là hệ số có chặn"),
      b("Truth closure rejected + surviving = total fiber for all tested", "Đóng chân trị: bị loại + sống sót = tổng fiber cho mọi ca thử"),
    ],
    artifacts: 3,
  },
  {
    id: "gate-d0", phase: "GATE D0",
    title: b("Tight-class analytic bridge", "Cầu giải tích lớp tight"),
    status: "partial", verify: "single", independence: "I2", date: "2026-07-17",
    summary: b(
      "Reconstructed the polynomial-method core, isolated the load-bearing Fermat-indicator step, localized why it needs k+1 prime. The obstruction for k+1=14 is algebraic.",
      "Tái dựng lõi phương pháp đa thức, cô lập bước chỉ thị Fermat chịu tải, định vị vì sao nó cần k+1 nguyên tố. Rào cản cho k+1=14 là đại số.",
    ),
    checks: [
      b("Polynomial proposition verified exhaustively for odd-prime moduli", "Mệnh đề đa thức kiểm vét cạn cho các modulo nguyên tố lẻ"),
      b("Fermat-indicator lemma exact for primes, fails for composites", "Bổ đề chỉ thị Fermat chính xác với nguyên tố, sai với hợp số"),
      b("Proposition numbering resolved against the source paper", "Đánh số mệnh đề đối chiếu với bài báo nguồn"),
    ],
    artifacts: 7,
  },
  {
    id: "gate-d1", phase: "GATE D1",
    title: b("Composite-14 generalization, candidates refuted", "Tổng quát hoá hợp số 14, ứng viên bị bác"),
    status: "partial", verify: "single", independence: "I2", date: "2026-07-17",
    summary: b(
      "Affine landing is false for k=13 because units act trivially mod 2. The CRT-idempotent indicator is exact but cannot rescue a false target. Candidates refuted with counterexamples.",
      "Landing affine sai cho k=13 vì đơn vị tác động tầm thường mod 2. Chỉ thị lũy đẳng CRT là chính xác nhưng không cứu được mục tiêu sai. Ứng viên bị bác bằng phản ví dụ.",
    ),
    checks: [
      b("Landing statement fails on 8.5% of sampled tuples, counterexample kept", "Mệnh đề landing sai trên 8.5% tuple lấy mẫu, giữ phản ví dụ"),
      b("All units are odd, so parity is locked under the unit action", "Mọi đơn vị đều lẻ, nên tính chẵn lẻ bị khóa dưới tác động đơn vị"),
      b("CRT-idempotent indicator exact on every tested composite modulus", "Chỉ thị lũy đẳng CRT chính xác trên mọi modulo hợp số đã thử"),
    ],
    artifacts: 9,
  },
  {
    id: "gate-d2", phase: "GATE D2",
    title: b("Direct properness, the open door", "Properness trực tiếp, cánh cửa mở"),
    status: "partial", verify: "single", independence: "I2", date: "2026-07-17",
    summary: b(
      "Ground-truth reversal: the tight fiber is all-proper for composite k+1. The obstruction was the affine route, not properness itself. The certificate covers the k=13 sample 100%.",
      "Đảo chiều chân trị: fiber tight là all-proper cho k+1 hợp số. Rào cản nằm ở tuyến affine, không phải bản thân properness. Chứng thư phủ mẫu k=13 100%.",
    ),
    checks: [
      b("Exhaustive full definition: all-proper for the small cases", "Định nghĩa đầy đủ vét cạn: all-proper cho các ca nhỏ"),
      b("Richer witness rescues every earlier affine failure", "Nhân chứng giàu hơn cứu mọi thất bại affine trước đó"),
      b("Self-audit caught a missing gcd branch in the oracle mid-gate", "Tự audit bắt được một nhánh gcd thiếu trong oracle giữa gate"),
    ],
    artifacts: 9,
  },
  {
    id: "gate-d3", phase: "GATE D3",
    title: b("Residual closure, a working certificate", "Đóng residual, một chứng thư hoạt động"),
    status: "pass", verify: "double", independence: "I2", date: "2026-07-17",
    summary: b(
      "An independent bitset oracle agrees with the D2 oracle (0 disagreements). A non-unit multiplier closes the residual exactly. The k=13 residual was only estimated here (~1.6e4), a claim the Contractor withdrew as RESIDUAL-UNKNOWN pending an exact count.",
      "Một oracle bitset độc lập khớp oracle D2 (0 bất đồng). Một hệ số không-đơn-vị đóng residual chính xác. Residual k=13 ở đây mới là ước lượng (~1.6e4), một tuyên bố bị Contractor rút thành RESIDUAL-UNKNOWN, chờ đếm chính xác.",
    ),
    checks: [
      b("Two structurally independent oracles agree exhaustively", "Hai oracle độc lập cấu trúc khớp nhau vét cạn"),
      b("Direct certificate: 14 of 14 corruption fixtures rejected by BOTH verifiers", "Chứng thư trực tiếp: 14/14 mẫu tấn công bị CẢ HAI verifier từ chối"),
      b("Correction: k=13 estimate is not a bound (fixed exactly in D4)", "Đính chính: ước lượng k=13 không phải chặn (đã tính chính xác ở D4)"),
    ],
    artifacts: 12,
  },
  {
    id: "gate-d4", phase: "GATE D4",
    title: b("Exact tight-interface closure at p=191", "Đóng giao diện tight chính xác tại p=191"),
    status: "pass", verify: "double", independence: "I2", date: "2026-07-17",
    summary: b(
      "The extrapolation is replaced by an EXACT count: the k=13 tight residual is 16,171 orbit-classes, with an exact mass identity B0 + B1 + residual = 14^13, computed without enumerating the 14^13 fiber. Every representative is proper at the fixed prime p=191.",
      "Ước lượng được thay bằng con số CHÍNH XÁC: residual tight k=13 là 16.171 lớp orbit, với đẳng thức khối lượng chính xác B0 + B1 + residual = 14^13, tính mà không liệt kê fiber 14^13. Mọi đại diện đều proper tại prime cố định p=191.",
    ),
    checks: [
      b("Exact residual orbit count = 16,171 (Burnside = canonical augmentation)", "Đếm orbit residual chính xác = 16.171 (Burnside = canonical augmentation)"),
      b("Exact mass identity B0 + B1 + residual = 14^13, all 16,171 reps proper at p=191", "Đẳng thức khối lượng chính xác B0 + B1 + residual = 14^13, cả 16.171 đại diện proper tại p=191"),
      b("Two independent verifiers ACCEPT, 16 of 16 corruption attacks rejected by BOTH", "Hai verifier độc lập CHẤP NHẬN, 16/16 tấn công bị CẢ HAI từ chối"),
    ],
    artifacts: 13,
  },
  {
    id: "gate-d5", phase: "GATE D5",
    title: b("Uniform prime transfer, all p>182", "Chuyển đồng đều theo prime, mọi p>182"),
    status: "pass", verify: "double", independence: "I2", date: "2026-07-17",
    summary: b(
      "The single prime p=191 becomes a theorem over primes: the k=13 tight interface is proper for EVERY prime p>182. The witness test reduces by CRT to a p-independent form, each representative gets a fixed s and an exact rational witness arc, and a lattice-point lemma supplies a witness for all p above threshold P0=78, so there are zero exceptional primes.",
      "Một prime p=191 trở thành định lý theo prime: giao diện tight k=13 proper với MỌI prime p>182. Phép thử nhân chứng rút gọn bằng CRT về dạng độc lập với p, mỗi đại diện có một s cố định và một cung nhân chứng hữu tỉ chính xác, và bổ đề điểm lưới cho nhân chứng với mọi p trên ngưỡng P0=78, nên không có prime ngoại lệ nào.",
    ),
    checks: [
      b("CRT-reduced witness formula validated exactly vs all 16,171 D4 witnesses (0 mismatch)", "Công thức nhân chứng rút gọn CRT kiểm khớp chính xác với cả 16.171 nhân chứng D4 (0 lệch)"),
      b("Aggregate threshold P0=78, in-scope exceptional primes = none (183 > 78)", "Ngưỡng tổng hợp P0=78, prime ngoại lệ trong phạm vi = không (183 > 78)"),
      b("Two independent verifiers ACCEPT, 18 of 18 corruption rejected, small-k matches exhaustive truth", "Hai verifier độc lập CHẤP NHẬN, 18/18 tấn công bị từ chối, k nhỏ khớp chân trị vét cạn"),
    ],
    artifacts: 13,
  },
  {
    id: "gate-d6", phase: "GATE D6",
    title: b("Non-tight preflight, NO-GO-PROVISIONAL", "Preflight non-tight, NO-GO-TẠM-THỜI"),
    status: "blocked", verify: "double", independence: "I2", date: "2026-07-18",
    summary: b(
      "The D5 tight theorem integrates correctly into the full reduction (rule TIGHT_UNIFORM_D5, state-equivalence proved, two verifiers, 20/20 attacks) and the exact threshold and prime inventory are frozen. The campaign verdict is NO-GO, but PROVISIONAL: the D6 cost proxy was later found unfaithful (D7), so its p=877 figure is withdrawn. The NO-GO rests on the exact reduction plus real upstream anchors (k=12 p=563 = 24.5h, k=9 p=151 = 46.6 GB), not a verified k=13 measurement.",
      "Định lý tight D5 tích hợp đúng vào rút gọn đầy đủ (rule TIGHT_UNIFORM_D5, chứng minh tương đương trạng thái, hai verifier, 20/20 tấn công) và ngưỡng chính xác + kho prime đã khóa. Kết luận chiến dịch là NO-GO, nhưng TẠM THỜI: proxy chi phí D6 về sau bị phát hiện không trung thực (D7), nên con số p=877 bị rút. NO-GO dựa trên rút gọn chính xác + mốc upstream thật (k=12 p=563 = 24.5h, k=9 p=151 = 46.6 GB), không phải phép đo k=13 đã kiểm.",
    ),
    checks: [
      b("Exact threshold B13 = 7^156·13^143, minimal inventory 109 primes [191,877]", "Ngưỡng chính xác B13 = 7^156·13^143, kho tối thiểu 109 prime [191,877]"),
      b("D5 rule integration verified, 20/20 adversarial attacks rejected", "Tích hợp rule D5 đã kiểm, 20/20 tấn công bị từ chối"),
      b("Verdict NO-GO-PROVISIONAL, D6 cost proxy withdrawn as invalid (see D7/D7R)", "Kết luận NO-GO-TẠM-THỜI, proxy chi phí D6 bị rút vì không hợp lệ (xem D7/D7R)"),
    ],
    artifacts: 17,
  },
  {
    id: "gate-d7", phase: "GATE D7",
    title: b("Architecture redesign, RESTART (predicate re-freeze)", "Thiết kế lại kiến trúc, RESTART (đóng băng lại predicate)"),
    status: "partial", verify: "double", independence: "I2", date: "2026-07-18",
    summary: b(
      "Before optimizing, the find_cover predicate must reproduce frozen truth. It reproduces k=9 p=19 = 1 exactly, but NOT the upstream k=9 p=53 = 4,651 canonical classes, and the D6 cost proxy was found unfaithful (it reported 0 covers where the truth is 1), so the earlier 21-hour projection is withdrawn. Honest RESTART: re-freeze the exact predicate from the upstream oracle before any hard-prime run. No p=877 was fabricated. The unit-symmetry search lever was proved and kept.",
      "Trước khi tối ưu, predicate find_cover phải tái lập chân trị đã khóa. Nó tái lập k=9 p=19 = 1 chính xác, nhưng KHÔNG khớp upstream k=9 p=53 = 4.651 lớp chuẩn tắc, và proxy chi phí D6 bị phát hiện không trung thực (báo 0 cover nơi chân trị là 1), nên dự báo 21 giờ trước đó bị rút. RESTART trung thực: đóng băng lại predicate chính xác từ oracle upstream trước mọi run prime khó. Không bịa p=877. Đòn bẩy đối xứng unit đã được chứng minh và giữ lại.",
    ),
    checks: [
      b("Predicate reproduces p=19 = 1 exactly, p=53 = 4,651 NOT matched (convention unrecoverable)", "Predicate tái lập p=19 = 1 chính xác, p=53 = 4.651 KHÔNG khớp (quy ước không phục hồi được)"),
      b("D6 cost proxy unfaithful (0 vs 1 covers at p=19), the 21h p=877 projection withdrawn", "Proxy chi phí D6 không trung thực (0 vs 1 cover tại p=19), dự báo 21h cho p=877 bị rút"),
      b("Unit-symmetry theorem proved (about (p-1)/2-fold lever), no hard-prime run fabricated", "Định lý đối xứng unit đã chứng minh (đòn bẩy ~(p-1)/2 lần), không bịa run prime khó"),
    ],
    artifacts: 9,
  },
  {
    id: "gate-d7r", phase: "GATE D7R",
    title: b("Ground-truth harness, predicate reproduced", "Bộ chân trị, tái lập predicate"),
    status: "pass", verify: "double", independence: "I2", date: "2026-07-18",
    summary: b(
      "The pinned upstream find_cover was compiled as an oracle and reproduces the frozen truth exactly (p=19 = 1, p=53 = 4,651). A fully independent oracle matches it at the OBJECT level (byte-identical sets) on five primes. The 4,651 is now understood: size-K multiset covers with the anchor speed 1 allowed to repeat once (the duplicate-coordinate padding). The unit action is compatible at the terminal-object level. Predicate re-frozen, optimization can resume on aligned semantics.",
      "find_cover upstream đã ghim được compile thành oracle và tái lập chân trị chính xác (p=19 = 1, p=53 = 4.651). Một oracle hoàn toàn độc lập khớp ở mức ĐỐI TƯỢNG (tập giống hệt từng byte) trên năm prime. Con số 4.651 nay đã hiểu: cover multiset cỡ K với speed neo 1 được lặp một lần (đệm tọa độ trùng). Tác động unit tương thích ở mức đối tượng cuối. Predicate đã đóng băng lại, có thể tiếp tục tối ưu trên ngữ nghĩa đã căn chỉnh.",
    ),
    checks: [
      b("Upstream oracle (commit 755b116b) reproduces F19=1, F53=4,651 exactly", "Oracle upstream (commit 755b116b) tái lập F19=1, F53=4.651 chính xác"),
      b("Independent oracle matches at OBJECT level on 5 primes (19/53/59/67/71)", "Oracle độc lập khớp mức ĐỐI TƯỢNG trên 5 prime (19/53/59/67/71)"),
      b("4,651 = 3,147 distinct + 1,504 anchor-padded multisets, two checkers, 20/20 attacks", "4.651 = 3.147 phân biệt + 1.504 multiset đệm neo, hai checker, 20/20 tấn công"),
    ],
    artifacts: 12,
  },
  {
    id: "gate-d8", phase: "GATE D8",
    title: b("Structural elimination, Fourier criterion", "Loại trừ cấu trúc, tiêu chuẩn Fourier"),
    status: "partial", verify: "double", independence: "I2", date: "2026-07-18",
    summary: b(
      "A strategic pivot from enumeration to STRUCTURAL elimination. A finite-Fourier identity M(u) = G0^k + relation-mass is proved: a vector with no additive relation carrying enough Fourier mass is proper, eliminating the entire relation-sparse (generic) class in one theorem. Measured across k=3,4,5: every one of 13,000+ obstruction vectors is relation-rich (a short relation with |m| at most 3), with ZERO relation-sparse counterexamples. The tight class is the rank-1 anchor already closed by D5.",
      "Chuyển hướng chiến lược từ liệt kê sang loại trừ CẤU TRÚC. Chứng minh danh tính Fourier hữu hạn M(u) = G0^k + khối lượng quan hệ: vector không có quan hệ cộng mang đủ khối lượng Fourier là proper, loại cả lớp relation-sparse (generic) trong một định lý. Đo trên k=3,4,5: từng vector trong 13.000+ obstruction đều relation-rich (một quan hệ ngắn |m| ≤ 3), KHÔNG có phản ví dụ relation-sparse. Lớp tight là neo hạng-1 đã đóng ở D5.",
    ),
    checks: [
      b("Fourier identity proved + validated, criterion relation-mass < G0^k ⟹ proper", "Danh tính Fourier chứng minh + kiểm, tiêu chuẩn khối lượng quan hệ < G0^k ⟹ proper"),
      b("Infinite class eliminated: relation-sparse vectors are proper (two verifiers)", "Loại lớp vô hạn: vector relation-sparse là proper (hai verifier)"),
      b("Dichotomy measured: 0 relation-sparse obstructions in 13,000+ (open: uniform tail bound)", "Đo dichotomy: 0 obstruction relation-sparse trong 13.000+ (mở: chặn đuôi đồng đều)"),
    ],
    artifacts: 13,
  },
  {
    id: "gate-d9", phase: "GATE D9",
    title: b("Fourier tail closure & inverse structure", "Đóng đuôi Fourier & cấu trúc nghịch đảo"),
    status: "partial", verify: "double", independence: "I2", date: "2026-07-18",
    summary: b(
      "A rigorous barrier result: the absolute-value tail route is INSUFFICIENT. The absolute relation mass is essentially vector-independent, about the L1-norm of the Fourier coefficients to the k-th power over p, which is roughly 10,000 times the main term at k=13. So obstructions are improper through SIGNED cancellation, not small terms. In exchange, a verified inverse extractor turns every obstruction into a bounded additive-structure certificate, the tight class is recovered as additive rank 1 (the D5 anchor).",
      "Một kết quả rào chắn chặt chẽ: tuyến đuôi trị-tuyệt-đối là KHÔNG ĐỦ. Khối lượng quan hệ tuyệt đối gần như độc lập với vector, xấp xỉ chuẩn L1 của hệ số Fourier lũy thừa k chia p, khoảng 10.000 lần số hạng chính tại k=13. Nên obstruction improper qua triệt tiêu CÓ DẤU, không phải số hạng nhỏ. Đổi lại, một extractor nghịch đảo đã kiểm biến mọi obstruction thành chứng thư cấu trúc cộng bị chặn, lớp tight thu về hạng cộng 1 (neo D5).",
    ),
    checks: [
      b("Absolute-tail route proven INSUFFICIENT (ABS mass ~ ||Ghat||1^k/p, ~10^4x main, vector-independent)", "Tuyến đuôi tuyệt đối chứng minh KHÔNG ĐỦ (khối lượng ABS ~ ||Ghat||1^k/p, ~10^4x chính, độc lập vector)"),
      b("Inverse extractor verified: every obstruction ⟹ bounded structure cert, tight class = rank 1", "Extractor nghịch đảo đã kiểm: mọi obstruction ⟹ chứng thư cấu trúc bị chặn, lớp tight = hạng 1"),
      b("Two verifiers ACCEPT, 24/24 corruption rejected, open: signed-cancellation closure", "Hai verifier CHẤP NHẬN, 24/24 tấn công bị từ chối, mở: đóng triệt tiêu có dấu"),
    ],
    artifacts: 14,
  },
  {
    id: "gate-d10", phase: "GATE D10",
    title: b("Moment duality & signed cancellation", "Đối ngẫu moment & triệt tiêu có dấu"),
    status: "partial", verify: "double", independence: "I2", date: "2026-07-18",
    summary: b(
      "Encode the signed cancellation as factorial moments of N (the number of forbidden runners): u proper iff some time has N=0. An exact rational moment dual certifies properness per vector (closes 60/60 proper vectors). A clean pair theorem is proved-in-direction: large pair-correlation deviation forces a low rational ratio height. But the uniform generic dual is refuted, an intrinsic small-time spike (all runners cluster) inflates the higher moments 15-95x, independent of ratio height, re-encoding the D9 cancellation barrier.",
      "Mã hóa triệt tiêu có dấu thành moment giai thừa của N (số runner trong vùng cấm): u proper khi có thời điểm N=0. Một dual moment hữu tỉ chính xác chứng nhận proper theo từng vector (đóng 60/60 vector proper). Định lý cặp chứng minh một chiều: lệch tương quan cặp lớn ép chiều cao tỉ số hữu tỉ thấp. Nhưng dual generic đồng đều bị bác, một spike thời-gian-nhỏ nội tại (mọi runner cụm lại) làm phồng moment bậc cao 15-95 lần, độc lập chiều cao tỉ số, mã hóa lại rào D9.",
    ),
    checks: [
      b("Exact factorial-moment dual: per-vector LP dual closes 60/60 proper vectors (integer-coeff Bonferroni valid)", "Dual moment giai thừa chính xác: dual LP theo vector đóng 60/60 vector proper (Bonferroni hệ số nguyên hợp lệ)"),
      b("Pair theorem proved-direction: deviation > 0.03 ⟹ ratio height ≤ 2 (interval/lattice overlap)", "Định lý cặp chứng minh một chiều: lệch > 0,03 ⟹ chiều cao tỉ số ≤ 2 (chồng lấp khoảng/lưới)"),
      b("Generic uniform dual REFUTED (intrinsic spike inflates μ4~15x, μ5~95x), two verifiers, 30/30 corruption", "Dual generic đồng đều BỊ BÁC (spike nội tại phồng μ4~15x, μ5~95x), hai verifier, 30/30 tấn công"),
    ],
    artifacts: 14,
  },
  {
    id: "gate-d11", phase: "GATE D11",
    title: b("Punctured moments, inventory-wide closure", "Moment đục lỗ, đóng toàn kho"),
    status: "partial", verify: "double", independence: "I2", date: "2026-07-18",
    summary: b(
      "The D10 blocker was a universal atom, not a missing dual. Removing the t=0 spike EXACTLY (where all 13 runners are trivially forbidden) unblocks the low-degree dual: the punctured degree-5 dual now has a positive generic margin for ALL 109 inventory primes (worst +0.1221, exact). The pair inverse theorem becomes inventory-uniform (exceptional correlation implies ratio height at most 3). Every vector is then closed by the dual (high ratio height) or emits an exact exceptional-ratio structure certificate.",
      "Điểm nghẽn D10 là một atom phổ quát, không phải thiếu dual. Loại spike t=0 CHÍNH XÁC (nơi cả 13 runner đều bị cấm tầm thường) mở khoá dual bậc thấp: dual đục-lỗ bậc-5 nay có margin generic dương cho CẢ 109 prime trong kho (xấu nhất +0,1221, chính xác). Định lý cặp nghịch đảo trở nên đồng đều toàn kho (tương quan ngoại lệ kéo theo chiều cao tỉ số ≤ 3). Mỗi vector khi đó được dual đóng (chiều cao tỉ số cao) hoặc xuất chứng thư cấu trúc tỉ-số-ngoại-lệ chính xác.",
    ),
    checks: [
      b("Exact spike removal μ_j = C(13,j)/p + (p-1)/p·μ_j* (proved + verifier-checked)", "Loại spike chính xác μ_j = C(13,j)/p + (p-1)/p·μ_j* (chứng minh + verifier kiểm)"),
      b("Punctured deg-5 dual: generic margin POSITIVE for all 109 primes (worst +0.1221)", "Dual đục-lỗ bậc-5: margin generic DƯƠNG cho cả 109 prime (xấu nhất +0,1221)"),
      b("Pair theorem inventory-uniform, dichotomy closed-or-exceptional-ratio, 2 verifiers, 30/30 corruption", "Định lý cặp đồng đều toàn kho, dichotomy đóng-hoặc-tỉ-số-ngoại-lệ, 2 verifier, 30/30 tấn công"),
    ],
    artifacts: 12,
  },
  {
    id: "gate-d12", phase: "GATE D12",
    title: b("Ratio graph: sparse closes, dense low-rank", "Đồ thị tỉ số: thưa đóng, dày hạng thấp"),
    status: "partial", verify: "double", independence: "I2", date: "2026-07-18",
    summary: b(
      "The non-tight remainder is now a finite graph with exact rational labels, not a cloud of vectors. An exact dual-deficit identity expresses the margin per exceptional edge. Sparse graphs (at most 2 exceptional edges) keep the punctured margin positive, so the vector is proper (22/22, zero counterexamples). Dense graphs carry an independent relation basis via a spanning forest, with the rank proved by exact linear algebra, not edge count, a low-rank structural handoff. Every failing vector has at least 3 exceptional edges and emits a verifiable relation basis, no unexplained residual.",
      "Phần non-tight còn lại nay là một đồ thị hữu hạn nhãn hữu tỉ chính xác, không phải đám mây vector. Danh tính dual-deficit chính xác biểu diễn margin theo từng cạnh ngoại lệ. Đồ thị thưa (≤2 cạnh ngoại lệ) giữ margin đục-lỗ dương nên vector proper (22/22, 0 phản ví dụ). Đồ thị dày mang một relation basis độc lập qua spanning forest, hạng chứng minh bằng đại số tuyến tính chính xác, không phải đếm cạnh, handoff cấu trúc hạng thấp. Mọi vector thất bại có ≥3 cạnh ngoại lệ và xuất relation basis kiểm được, không dư thừa vô lý.",
    ),
    checks: [
      b("Exact dual-deficit identity: margin = generic + per-edge deviations (pair + / triple −, signs exact)", "Danh tính dual-deficit chính xác: margin = generic + độ lệch từng cạnh (cặp + / bộ ba −, dấu chính xác)"),
      b("Sparse (≤2 exceptional edges) ⟹ margin > 0 ⟹ proper (22/22, 0 counterexamples)", "Thưa (≤2 cạnh ngoại lệ) ⟹ margin > 0 ⟹ proper (22/22, 0 phản ví dụ)"),
      b("Dense ⟹ spanning-forest independent relation basis (Q-rank, not edge count), 2 verifiers, 32/32 corruption", "Dày ⟹ relation basis độc lập spanning-forest (Q-rank, không đếm cạnh), 2 verifier, 32/32 tấn công"),
    ],
    artifacts: 9,
  },
  {
    id: "gate-d13", phase: "GATE D13",
    title: b("Connected hypergraph, tight rank-1 recovered", "Hypergraph liên thông, thu về hạng-1 tight"),
    status: "partial", verify: "double", independence: "I2", date: "2026-07-18",
    summary: b(
      "The higher residual left by D12 is expressed as EXACT connected correlations, and the pair graph is extended to a relation hypergraph. The support-3 inverse is proved-in-direction: a large connected triple correlation is always backed by a bounded-height support-3 additive relation. Adding these support-3 hyperedges completes the structure the pair graph missed, the tight class is now recovered as additive rank 1 (the exact D5 anchor), by exact linear algebra, not hyperedge count. Scope note: the support-3 inverse profile is measured at p=191 and the support-4/5 profile is evidence, not an all-prime theorem.",
      "Phần dư bậc cao còn lại từ D12 được biểu diễn thành các tương quan liên thông CHÍNH XÁC, và đồ thị cặp được mở rộng thành relation hypergraph. Support-3 inverse chứng minh một chiều: một tương quan bộ-ba liên thông lớn luôn được nâng đỡ bởi một quan hệ cộng support-3 chiều-cao-chặn. Thêm các hyperedge support-3 này hoàn thiện cấu trúc mà đồ thị cặp bỏ lỡ, lớp tight nay thu về hạng cộng 1 (neo D5 chính xác), bằng đại số tuyến tính chính xác, không phải đếm hyperedge. Ghi chú phạm vi: profile support-3 inverse đo tại p=191 và profile support-4/5 là bằng chứng, không phải định lý toàn-prime.",
    ),
    checks: [
      b("Exact connected partition identity, punctured Fourier correction -1/(p-1) kept exactly", "Danh tính phân hoạch liên thông chính xác, hiệu chỉnh Fourier đục-lỗ -1/(p-1) giữ chính xác"),
      b("Support-3 inverse: large connected triple ⟹ bounded-height support-3 relation (frozen before order 4)", "Support-3 inverse: bộ-ba liên thông lớn ⟹ quan hệ support-3 chiều-cao-chặn (đóng băng trước bậc 4)"),
      b("Hypergraph recovers tight class = additive rank 1 (Q-rank, not edge count), 2 verifiers, 36/36 corruption", "Hypergraph thu về lớp tight = hạng cộng 1 (Q-rank, không đếm cạnh), 2 verifier, 36/36 tấn công"),
    ],
    artifacts: 8,
  },
  {
    id: "gate-d14", phase: "GATE D14",
    title: b("Connected-support purity, TRUE_RELATION vs puncture", "Thuần khiết support liên thông, TRUE_RELATION vs đục-lỗ"),
    status: "partial", verify: "double", independence: "I2", date: "2026-07-18",
    summary: b(
      "The connected correlation of each support set is separated by an EXACT identity: a primitive additive relation (the true structural signal) plus the deterministic F_p* puncture term -(1/(p-1))(1-β)^s. Decomposable frequency patterns cancel in the cumulant, so the relation hyperedges are pure. Every connected triple is then either a low-height primitive relation or has a uniformly small high-height tail (< 9/1000), audited at representative inventory primes 191/439/877 where the tail is 0.0080/0.0047/0.0048 and decreasing. Support-4/5 remain the open residual, the all-109-prime summed budget is the remaining step to a full pass.",
      "Tương quan liên thông của mỗi tập support được tách bằng một danh tính CHÍNH XÁC: một quan hệ cộng nguyên thủy (tín hiệu cấu trúc thật) cộng số hạng đục-lỗ F_p* xác định -(1/(p-1))(1-β)^s. Các mẫu tần số phân tách được triệt tiêu trong cumulant, nên các hyperedge quan hệ là thuần khiết. Mỗi bộ-ba liên thông khi đó hoặc là quan hệ nguyên thủy chiều-cao-thấp, hoặc có đuôi chiều-cao-lớn nhỏ đều (< 9/1000), audit tại các prime inventory đại diện 191/439/877 với đuôi 0.0080/0.0047/0.0048 và giảm dần. Support-4/5 vẫn là phần dư mở, ngân sách tổng toàn 109 prime là bước còn lại để pass hoàn toàn.",
    ),
    checks: [
      b("Purity lemma proved as exact identity: κ_direct = κ_fourier at p=191/439/877 (rational)", "Bổ đề thuần khiết chứng minh là danh tính chính xác: κ_direct = κ_fourier tại p=191/439/877 (hữu tỷ)"),
      b("TRUE_RELATION cleanly split from exact puncture -(1/(p-1))(1-β)^s, decomposables cancel", "TRUE_RELATION tách sạch khỏi đục-lỗ chính xác -(1/(p-1))(1-β)^s, phân tách được triệt tiêu"),
      b("Support-3 tail audited 191/439/877 (later superseded by D15: 1/100 over all 109), 2 verifiers, 40/40 corruption", "Đuôi support-3 audit 191/439/877 (D15 sau đó thay bằng 1/100 toàn 109), 2 verifier, 40/40 tấn công"),
    ],
    artifacts: 13,
  },
  {
    id: "gate-d15", phase: "GATE D15",
    title: b("Projective directions, support-3 closed over all 109 primes", "Hướng xạ ảnh, đóng support-3 trên toàn 109 prime"),
    status: "partial", verify: "double", independence: "I2", date: "2026-07-18",
    summary: b(
      "The homogeneous true-relation sum is regrouped into projective relation directions (scalar orbits), with an EXACT orbit-mass identity, a canonical direction height, and a relation lattice of determinant p with an exact shortest-vector certificate. Directions split short / medium / long by height. The headline result closes support-3 UNIFORMLY over all 109 inventory primes: the high-height tail is below 1/100 everywhere (worst 0.009475 at p=281). This corrects the D14 three-prime audit, whose worst case at p≈281 was missed by measuring only 191/439/877, so the earlier 9/1000 is superseded by 1/100. Support-4 and support-5 remain open.",
      "Tổng quan-hệ-thật thuần nhất được gom lại thành các hướng quan hệ xạ ảnh (quỹ đạo vô hướng), với danh tính khối-lượng-quỹ-đạo CHÍNH XÁC, chiều cao hướng chuẩn tắc, và một relation lattice định thức p với chứng nhận vector ngắn nhất chính xác. Các hướng chia short / medium / long theo chiều cao. Kết quả nổi bật đóng support-3 ĐỀU trên toàn 109 prime inventory: đuôi chiều-cao-lớn dưới 1/100 ở mọi nơi (tệ nhất 0.009475 tại p=281). Điều này sửa lại audit ba-prime của D14, vốn bỏ lỡ trường hợp tệ nhất tại p≈281 do chỉ đo 191/439/877, nên 9/1000 cũ được thay bằng 1/100. Support-4 và support-5 vẫn mở.",
    ),
    checks: [
      b("Exact projective orbit-mass identity Σ∏B̂ = Σ_D A_p(D), direction height = primitive relation height", "Danh tính khối-lượng-quỹ-đạo xạ ảnh chính xác Σ∏B̂ = Σ_D A_p(D), chiều cao hướng = chiều cao quan hệ nguyên thủy"),
      b("Support-3 INVENTORY-UNIFORM: tail < 1/100 over all 109 primes (max 0.009475 at p=281), correcting D14's 9/1000", "Support-3 ĐỀU TOÀN INVENTORY: đuôi < 1/100 trên toàn 109 prime (max 0.009475 tại p=281), sửa 9/1000 của D14"),
      b("Support-3 tail bound over 109 primes (later corrected by D16 to 11/1000 on the complete universe), 2 verifiers, 44/44 corruption", "Chặn đuôi support-3 trên 109 prime (D16 sau đó sửa thành 11/1000 trên full universe), 2 verifier, 44/44 tấn công"),
    ],
    artifacts: 27,
  },
  {
    id: "gate-d16", phase: "GATE D16",
    title: b("Modular rank repair, support-3 completeness, support-4", "Sửa hạng modular, tính đầy đủ support-3, support-4"),
    status: "partial", verify: "double", independence: "I2", date: "2026-07-18",
    summary: b(
      "A load-bearing correction: relation rank must be computed over F_p, not Q, because every relation satisfies R·u ≡ 0 (mod p) with u nonzero, so the rank is at most 12 and the additive dimension is always at least 1. The D15 'generic additive dimension 0' was an artifact of Q-rank and is withdrawn. Support-3 is then made genuinely complete by scanning the FULL universe of all (p-1)^2 triple ratios per prime (not one relation line): the true worst tail is 0.010377 at p=353, so the bound is 11/1000, correcting both D14's 9/1000 and D15's 1/100 (both from incomplete families). The projective/lattice method is extended to primitive support-4 relations (orbit identity, lattice of det p, connected 4th cumulant), exact at four small primes, support-4 inventory and support-5 remain open.",
      "Một chỉnh sửa cốt yếu: hạng quan hệ phải tính trên F_p, không phải Q, vì mọi quan hệ thỏa R·u ≡ 0 (mod p) với u khác 0, nên hạng tối đa là 12 và chiều cộng luôn ít nhất 1. 'Chiều cộng generic = 0' của D15 là nhiễu do Q-rank và bị rút. Support-3 sau đó được làm thực sự đầy đủ bằng cách quét TOÀN BỘ universe gồm mọi (p-1)^2 tỉ số bộ-ba mỗi prime (không phải một relation line): đuôi tệ nhất thật là 0.010377 tại p=353, nên chặn là 11/1000, sửa cả 9/1000 của D14 lẫn 1/100 của D15 (đều từ họ chưa đầy đủ). Phương pháp xạ ảnh/lattice mở rộng sang quan hệ support-4 nguyên thủy (danh tính quỹ đạo, lattice định thức p, cumulant bậc 4 liên thông), chính xác tại bốn prime nhỏ, inventory support-4 và support-5 vẫn mở.",
    ),
    checks: [
      b("Modular rank repair: dim_Fp ker = 13 − rank_Fp ≥ 1 (u is a kernel witness), Q-rank inference withdrawn", "Sửa hạng modular: dim_Fp ker = 13 − rank_Fp ≥ 1 (u là nhân chứng kernel), rút suy luận Q-rank"),
      b("Support-3 COMPLETE full universe (all (p-1)² triples): tail < 11/1000, worst 0.010377 at p=353", "Support-3 ĐẦY ĐỦ full universe (mọi (p-1)² bộ-ba): đuôi < 11/1000, tệ nhất 0.010377 tại p=353"),
      b("Support-4 orbit identity + lattice + κ₄, exact at 4 small primes (τ4 < 8/1000), PARTIAL/OPEN, 2 verifiers, 48/48 corruption", "Danh tính quỹ đạo + lattice + κ₄ support-4, chính xác tại 4 prime nhỏ (τ4 < 8/1000), PARTIAL/MỞ, 2 verifier, 48/48 tấn công"),
    ],
    artifacts: 27,
  },
  {
    id: "gate-d17", phase: "GATE D17",
    title: b("Support-4 fast correlation, inventory-complete", "Tương quan nhanh support-4, đầy đủ inventory"),
    status: "pass", verify: "double", independence: "I2", date: "2026-07-18",
    summary: b(
      "A primitive root turns the multiplicative support-4 correlation into a cyclic 4-point correlation on Z_{p-1}, giving an exact fast engine (O(p^3 log p) time, O(p^2) memory) where the previous method was O(p^4). The connected fourth cumulant identity and its Fourier-tensor form are proved exactly. This closes support-4 over the COMPLETE active universe of all (p-1)^3 ratio configurations at every one of the 109 primes (all exact-transform, no prime left open): the worst generic tail is 5/686 = 0.0072886 at p=197, an interior prime decided by the inventory, not the endpoints. It also replaces the always-12 full relation-space rank with a bounded-height rank profile that measures how fast short, simple relations rigidify a vector (tight at height 1, generic at height 2). Support-5 stays open.",
      "Một căn nguyên thủy biến tương quan support-4 nhân tính thành tương quan 4-điểm cyclic trên Z_{p-1}, cho một engine nhanh chính xác (thời gian O(p^3 log p), bộ nhớ O(p^2)) trong khi cách cũ là O(p^4). Danh tính cumulant bậc 4 liên thông và dạng Fourier-tensor được chứng minh chính xác. Điều này đóng support-4 trên TOÀN universe hoạt động gồm mọi (p-1)^3 cấu hình tỉ số tại từng prime trong 109 (đều exact-transform, không prime nào bỏ ngỏ): đuôi generic tệ nhất là 5/686 = 0.0072886 tại p=197, một prime nội quyết định bởi inventory, không phải hai đầu. Nó cũng thay hạng-không-gian-quan-hệ luôn-bằng-12 bằng một rank profile theo chiều cao chặn, đo tốc độ các quan hệ ngắn đơn giản làm cứng một vector (tight tại chiều cao 1, generic tại chiều cao 2). Support-5 vẫn mở.",
    ),
    checks: [
      b("Cyclic + tensor Fourier support-4 identity PROVED exact (κ4_cyclic = κ4_occupancy, Fractions)", "Danh tính support-4 cyclic + tensor Fourier CHỨNG MINH chính xác (κ4_cyclic = κ4_occupancy, hữu tỷ)"),
      b("Support-4 INVENTORY-COMPLETE all 109 primes: max τ4 = 5/686 at p=197, exact-transform, none open", "Support-4 ĐẦY ĐỦ INVENTORY toàn 109 prime: max τ4 = 5/686 tại p=197, exact-transform, không prime mở"),
      b("Bounded-height rank r₄,H replaces always-12 full rank; 2 verifiers, 52/52 corruption", "Rank chiều-cao-chặn r₄,H thay hạng-luôn-12; 2 verifier, 52/52 tấn công"),
    ],
    artifacts: 22,
  },
  {
    id: "gate-d18", phase: "GATE D18",
    title: b("Final connected order, fixed degree-5 refuted, adaptive route", "Bậc liên thông cuối, bác bậc-5 cố định, hướng thích ứng"),
    status: "partial", verify: "double", independence: "I2", date: "2026-07-19",
    summary: b(
      "D18 first tests whether a degree-4 dual alone can close the generic branch. An exact degree-4 minorant is found, positive on the independent benchmark, but an exact map of the realizable region refutes the route. At the worst prime p=197 a real proper vector is exhibited for which every degree-4 certificate fails, the best possible degree-4 bound is exactly 0, while degree 5 recovers the exact loneliness probability 5/98. So degree 5 is the minimal information level, and the support-5 machinery is built and verified, the exact fifth connected cumulant with all ten two-plus-three partitions, its tensor Fourier identity, the exact adverse direction, and a mandatory witness control. The current subphase D18-G then tries to freeze the support-5 structured versus residual split before the analytic bound. Three natural cuts are each proved degenerate at p=197, the bounded-height modular rank saturates to full for every vector, bounded-height support-5 relations are unavoidable, and the adverse fifth-order mass is diffuse. The invariant that does separate is coherence, the tight family adds mass without cancellation while the generic residual is small only through heavy sign cancellation. The cut cleanly removes the already-handled tight family but does not reduce the residual, whose control is the full signed fifth-order Fourier sum. That signed bound was then attempted directly in D18-H and REFUTED, an exact real proper vector at p=197 drives the fixed fifth-order margin negative, and the signed inverse theorem also fails as posed. The correct object is instead the adaptive fifth-order dual, choosing the best certificate for each vector, which holds on every case tested. Proving it uniformly over every vector, including hypothetical empty-loneliness profiles, is the open frontier D18-I. LRC(13) remains open.",
      "D18 trước hết thử xem một dual bậc-4 đơn lẻ có đóng được nhánh generic không. Một minorant bậc-4 chính xác được tìm ra, dương trên benchmark độc lập, nhưng một bản đồ chính xác của miền khả dĩ đã bác bỏ hướng này. Tại prime tệ nhất p=197, một vector proper thật được trưng ra mà mọi chứng chỉ bậc-4 đều thất bại, chặn bậc-4 tốt nhất đúng bằng 0, trong khi bậc 5 phục hồi đúng xác suất cô đơn 5/98. Vậy bậc 5 là mức thông tin tối thiểu, và bộ máy support-5 được dựng và kiểm, cumulant liên thông bậc năm chính xác với đủ mười phân hoạch hai-cộng-ba, danh tính Fourier tensor, chiều bất lợi chính xác, và một kiểm soát nhân chứng bắt buộc. Subphase hiện tại D18-G sau đó cố khóa phân tách support-5 structured so với residual trước khi chặn giải tích. Ba hướng cắt tự nhiên đều bị chứng minh là suy biến tại p=197, hạng modular chiều-cao-chặn bão hòa tới đầy đủ cho mọi vector, quan hệ support-5 chiều-cao-chặn là không thể tránh, và khối lượng bậc năm bất lợi bị phân tán. Bất biến thực sự phân tách là coherence, họ tight cộng khối lượng không triệt tiêu trong khi residual generic nhỏ chỉ nhờ triệt tiêu dấu mạnh. Phép cắt loại sạch họ tight vốn đã được xử lý nhưng không thu nhỏ residual, mà việc kiểm soát nó là tổng Fourier bậc năm có dấu đầy đủ. Chặn một phía có dấu đó là frontier còn lại. LRC(13) vẫn mở.",
    ),
    checks: [
      b("Rank, relation-existence and per-direction magnitude cuts proved degenerate at p=197 (rank saturates to full, bounded-height support-5 relations unavoidable, adverse mass diffuse)", "Ba hướng cắt hạng, tồn-tại-quan-hệ và độ-lớn-mỗi-chiều bị chứng minh suy biến tại p=197 (hạng bão hòa tới đầy đủ, quan hệ support-5 chiều-cao-chặn không tránh được, khối lượng bất lợi phân tán)"),
      b("Coherence separates the already-handled tight family from the residual branch on bounded validation, tight coherence 1, generic residual under 0.1", "Coherence tách họ tight vốn đã xử lý khỏi nhánh residual trên tập kiểm giới hạn, tight coherence 1, residual generic dưới 0.1"),
      b("D18-H REFUTED, the fixed signed fifth-order margin fails on an exact p=197 vector (M5 = minus 20/49) and the signed inverse also fails as posed, the validated new direction is the adaptive per-vector degree-5 dual, uniform proof OPEN (D18-I)", "D18-H BỊ BÁC BỎ, biên bậc năm có dấu cố định thất bại trên một vector chính xác p=197 (M5 = trừ 20/49) và nghịch đảo có dấu cũng thất bại như đã nêu, hướng mới đã kiểm là dual bậc-5 thích ứng theo từng vector, chứng minh đồng đều MỞ (D18-I)"),
    ],
    artifacts: 90,
  },
  {
    id: "gate-d19", phase: "GATE D19",
    title: b("Exact cyclic cover, per-prime separation refuted", "Phủ tuần hoàn chính xác, bác tách theo từng prime"),
    status: "refuted", verify: "double", independence: "I2", date: "2026-07-19",
    summary: b(
      "D19 returns from moment space to the exact source object. Fixing a prime and a primitive root, a speed vector becomes a multiplicity vector on the cyclic group of size p minus 1, and an improper vector (no lonely time) exists exactly when thirteen cyclic translates of the bad set cover the whole group. The fractional covering number is exactly the group size over the bad-set size, about 7 at every prime, far below the budget of 13, so the linear relaxation closes nothing. The decisive result is negative and is published in full. Explicit thirteen-translate covers actually exist at 48 of the 109 primes, and an exact non-tight improper vector is exhibited at p=197 with thirteen distinct speeds, zero lonely times, and adaptive bound exactly 0. This corrects the earlier moment work, the adaptive degree-5 dual also fails at a single prime, and the earlier twenty-thousand-vector search that found no counterexample was bounded by sampling, not by a theorem. Both per-prime methods are therefore insufficient. These single-prime covers are exactly what upstream enumeration finds and are not real counterexamples, they are eliminated only by the prime-product lift that requires one configuration to cover across many primes at once. That lift is the only remaining route. LRC(13) remains open and is not disproven.",
      "D19 quay từ không gian moment về đối tượng nguồn chính xác. Cố định một prime và một căn nguyên thủy, một vector tốc độ thành một vector bội trên nhóm cyclic cỡ p trừ 1, và một vector improper (không thời điểm cô đơn) tồn tại đúng khi mười ba phép dịch tuần hoàn của tập bad phủ toàn nhóm. Số phủ phân số đúng bằng cỡ nhóm chia cỡ tập bad, khoảng 7 tại mọi prime, thấp hơn nhiều ngân sách 13, nên nới lỏng tuyến tính không đóng gì. Kết quả quyết định là âm và được công bố đầy đủ. Phủ mười ba phép dịch tường minh thực sự hiện hữu tại 48 trong 109 prime, và một vector improper non-tight chính xác được trưng ra tại p=197 với mười ba tốc độ phân biệt, không thời điểm cô đơn, và chặn thích ứng đúng bằng 0. Điều này sửa lại công trình moment trước đó, dual bậc-5 thích ứng cũng thất bại tại một prime đơn, và tìm kiếm hai mươi nghìn vector trước đó không thấy phản ví dụ là do giới hạn mẫu, không phải định lý. Vậy cả hai phương pháp theo từng prime đều không đủ. Các phủ đơn-prime này chính là thứ liệt kê thượng nguồn tìm ra và không phải phản ví dụ thật, chúng chỉ bị loại bởi lift tích-các-prime buộc một cấu hình phủ qua nhiều prime cùng lúc. Lift đó là đường còn lại duy nhất. LRC(13) vẫn mở và không bị bác bỏ.",
    ),
    checks: [
      b("Equivalence proved and verified, improper vector iff thirteen cyclic translates of the bad set cover the group; fractional cover about 7 at all 109 primes (below 13, closes nothing)", "Tương đương đã chứng minh và kiểm, vector improper khi và chỉ khi mười ba phép dịch tuần hoàn của tập bad phủ nhóm; phủ phân số khoảng 7 tại toàn 109 prime (dưới 13, không đóng gì)"),
      b("Explicit thirteen-translate covers EXIST at 48 of 109 primes; exact non-tight improper witness at p=197 (0 lonely times, adaptive bound 0) refutes per-prime infeasibility and corrects the earlier moment search", "Phủ mười ba phép dịch tường minh HIỆN HỮU tại 48 trong 109 prime; nhân chứng improper non-tight chính xác tại p=197 (0 thời điểm cô đơn, chặn thích ứng 0) bác vô-khả-thi theo từng prime và sửa tìm kiếm moment trước"),
      b("Both per-prime methods refuted, two verifiers ACCEPT, 78 of 78 corruption rejected; the only remaining route is the prime-product lift (OPEN). LRC(13) OPEN, not disproven", "Cả hai phương pháp theo từng prime bị bác, hai verifier CHẤP NHẬN, 78 trên 78 tấn công bị bác; đường còn lại duy nhất là lift tích-các-prime (MỞ). LRC(13) MỞ, không bị bác bỏ"),
    ],
    artifacts: 12,
  },
  {
    id: "gate-d20", phase: "GATE D20",
    title: b("Simultaneous prime-product lift", "Lift tích các prime đồng thời"),
    status: "current", verify: "pending", independence: "I2", date: "2026-07-19",
    summary: b(
      "D19 proved that a local cover at one prime is not a global counterexample, so D20 attacks the only route left. A genuine LRC(13) counterexample would have to be one single bounded 13-speed multiset that induces a compatible local cover simultaneously across a family of primes whose product crosses the frozen D6 reconstruction threshold. Choosing an unrelated cover independently at each prime is forbidden, the global identity of the one speed tuple must be preserved. To avoid matching permutations across primes, each local residue multiset is encoded by its monic root polynomial F_p(X) = product of (X - r_i) mod p, so a common global tuple must induce compatible symmetric-coefficient residues that reconstruct by CRT. The mandated first phase, now underway, is a full freeze and independent replay of the D6 finite reduction and the D7R alignment, because that is exactly where an earlier predicate mismatch occurred, no inherited cost proxy or search semantics may be reused without replay. A predicate mismatch triggers restart. The target is to certify that no common global multiset survives compatibility beyond the product threshold, or to surface one bounded CRT-compatible global witness. LRC(13) remains open.",
      "D19 đã chứng minh một phủ cục bộ tại một prime không phải phản ví dụ toàn cục, nên D20 tấn công đường duy nhất còn lại. Một phản ví dụ LRC(13) thật phải là một multiset 13 tốc độ có chặn duy nhất, sinh ra phủ cục bộ tương thích đồng thời qua một họ prime mà tích của chúng vượt ngưỡng tái dựng D6 đã đóng băng. Cấm chọn một phủ không liên quan riêng lẻ tại mỗi prime, phải giữ nguyên danh tính toàn cục của một bộ tốc độ chung. Để tránh ghép hoán vị giữa các prime, mỗi multiset thặng dư cục bộ được mã hóa bằng đa thức nghiệm đơn khởi F_p(X) = tích (X - r_i) mod p, nên một bộ tuple toàn cục chung phải sinh ra thặng dư hệ số đối xứng tương thích, tái dựng được bằng CRT. Phase đầu bắt buộc, đang tiến hành, là đóng băng và replay độc lập toàn bộ rút gọn hữu hạn D6 và căn chỉnh D7R, vì đó chính là nơi từng xảy ra lệch predicate, không được tái dùng cost proxy hay ngữ nghĩa tìm kiếm kế thừa mà không replay. Lệch predicate thì khởi động lại. Mục tiêu là chứng nhận không multiset toàn cục chung nào sống sót tương thích vượt ngưỡng tích, hoặc trưng ra một nhân chứng toàn cục tương thích CRT có chặn. LRC(13) vẫn mở.",
    ),
    checks: [
      b("Global/local equivalence to re-prove and independently verify: a global counterexample implies simultaneous compatible local covers over the selected prime family, reconstructing one CRT-compatible bounded global object", "Tương đương toàn cục/cục bộ cần chứng minh lại và kiểm độc lập: phản ví dụ toàn cục kéo theo phủ cục bộ tương thích đồng thời qua họ prime chọn, tái dựng một đối tượng toàn cục có chặn tương thích CRT"),
      b("Mandated first phase underway: freeze and independent replay of the D6 reduction and D7R alignment before any search; predicate mismatch triggers D20-RESTART", "Phase đầu bắt buộc đang tiến hành: đóng băng và replay độc lập rút gọn D6 và căn chỉnh D7R trước mọi tìm kiếm; lệch predicate kích hoạt D20-RESTART"),
      b("Exit states: PASS (certified simultaneous incompatibility beyond the product threshold), PARTIAL, REFUTED (one surviving CRT-compatible global witness), BLOCKED, or RESTART. Per-prime program is closed as insufficient. LRC(13) OPEN", "Trạng thái thoát: PASS (chứng nhận bất tương thích đồng thời vượt ngưỡng tích), PARTIAL, REFUTED (một nhân chứng toàn cục tương thích CRT sống sót), BLOCKED, hoặc RESTART. Chương trình theo từng prime đã đóng vì không đủ. LRC(13) MỞ"),
    ],
    artifacts: 7,
  },
];

export const verifyMeta: Record<VerifyLevel, Bi> = {
  double: b("Double-checked", "Đã kiểm kép"),
  single: b("Verified once", "Đã kiểm một lần"),
  pending: b("Awaiting check", "Chờ kiểm"),
};
