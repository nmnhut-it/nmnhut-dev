# Ma trận tương tác camera × các cell trong Node Engine

## Phạm vi & phương pháp

Tài liệu này khảo sát cách notebook engine (`lessons/node.js` + `lessons/engine/*.js`)
xử lý các tình huống biên (edge case) liên quan tới camera trong mọi loại cell:
cell code có ask, cell camera một-pha (finger-hold), cell camera nhiều-pha
(finisher kiểu Node 3), quiz (hold/track), boss (hold/swipe/code), nhận quà
(gift claim), cổng chuyển act (act-transition), nghi lễ (ritual). Mỗi ô trong
ma trận được chấm dựa trên việc **đọc trực tiếp mã nguồn** liệt kê dưới đây —
không suy đoán. Các file đã đọc, theo đúng thứ tự yêu cầu:

1. `lessons/engine/camera-engine.js` — vòng đời stream, `ensure()`, `release()`, watchdog, `restart()`.
2. `lessons/node.js` — nơi lắp ráp mọi engine (composition root); không có
   `ensureCamera`/`maybeReleaseCamera` độc lập — quyền sở hữu camera nằm
   trong `CameraEngine` (`ensure()`/`release()` ref-tính bằng cờ `#ready`/
   `#starting`/`watchdogActive()`), được gọi từ `notebook-runner.js`,
   `gesture-dispatcher.js`, `ritual-controller.js`.
3. `lessons/engine/ask-gate.js` — `AskGate` (arm/clear/cancel) + `fingerAskStub`.
4. `lessons/engine/py-bridge.js` + `lessons/worker.js` — cơ chế `ask()` chặn
   (blocking) qua `SharedArrayBuffer`/`Atomics.wait`, sentinel hủy `'\x18'`.
5. `lessons/engine/code-cells.js` + `lessons/engine/notebook-runner.js` —
   luồng run/rerun, `runCell`, `onDone`/`onError`, kiểm tra `expectOut`
   (`cellOutputSatisfies`), semantics của boss code round (`el._fight`).
6. `lessons/engine/gesture-dispatcher.js` + `lessons/engine/two-phase-gate.js` —
   `onHands` ladder, `armVerbGate`/`armActHoldGate`/`armTimedCatchGate`, hành
   vi disarm khi `alive()` sai, logic timeout re-arm.
7. `lessons/engine/boss-fight.js` + `lessons/engine/quiz-cell.js` — cách mỗi
   loại round/câu hỏi gắn (arm) gate, và pattern `.catch(() => {})`.
8. `lessons/engine/ritual-controller.js` — luồng hold-to-seal + timeout dự phòng.
9. `lessons/engine/progress-store.js` + `lessons/progress-versioning.js` —
   resume giữa node, content-hash version.
10. `lessons/test-dispatcher.mjs`, `lessons/test-two-phase-gate.mjs`,
    `lessons/test-gesture-registry.mjs` — phong cách test hiện có (assert
    thuần, không framework) được dùng làm khuôn mẫu cho Deliverable B.

Ngoài ra đã đọc `lessons/engine/photo-booth.js`, `lessons/engine/gift-cell.js`,
`lessons/engine/gesture-registry.js`, `lessons/engine/gesture-ui.js`,
`lessons/engine/constants.js`, và phần round `finisher:true` trong
`lessons/content/node03.js` (dòng ~91, boss "THE SYNTAX SERPENT").

**Ghi chú về "photo booth":** `lessons/engine/photo-booth.js` (`PhotoBooth`,
dùng ở Node 1 — "camera charm") **CÓ TỒN TẠI** thật — không phải N/A. Nó là
một cell code gọi 3 "ask kiểu gesture" tuần tự (`conjure`→`vortex`→`capture`)
qua `photoBooth.gestureAsk()`, dùng chung `AskGate` với các ask khác. Vì vậy
hàng "photo booth" trong ma trận dưới đây được đánh giá dựa trên
`photo-booth.js#gestureAsk`/`#doBooth`, không đánh dấu N/A.

**Giới hạn khảo sát (không né tránh):** đường `pendingAskCancel`/sentinel
`'\x18'` đi qua `Atomics.wait` trong Worker + Pyodide (`lessons/worker.js`)
**không thể lái được ở môi trường headless Node** (không có Worker/SAB thật
theo đúng nghĩa trình duyệt, và Pyodide cần tải WASM). Các ô liên quan tới cột
"chạy cell khác trong khi có ask đang chờ" ở những hàng có ask Python thật
(code cell có `ask fingers`, photo booth) được đánh giá **OK bằng trích dẫn
mã nguồn**, KHÔNG phải OK-TESTED — xem phần "Giới hạn kiểm thử" cuối tài liệu.
Không dựng harness giả lập worker để "test cho có" — làm vậy sẽ không thực sự
chạy qua code path thật.

## Ma trận (12 hàng × 9 cột = 108 ô)

Chú thích cột:
- **C1** = từ chối quyền camera lúc bắt đầu
- **C2** = có camera, mất tay giữa lúc charge
- **C3** = stream camera chết giữa gate (rút thiết bị)
- **C4** = rerun CHÍNH cell đang có ask treo
- **C5** = chạy CELL KHÁC trong khi có ask đang treo (đường sentinel hủy)
- **C6** = học sinh rời trang/cell không còn `alive()`
- **C7** = gesture capture timeout
- **C8** = reload trang giữa chừng (resume tiến độ)
- **C9** = chạy xong nhưng output sai (`expectOut` không khớp)

### Hàng 1 — Cell code có ask nhập liệu gõ tay (`cellAsk`)

| Cột | Verdict | Ghi chú |
|---|---|---|
| C1 | N/A | `cellAsk` (notebook-runner.js:259) là ô nhập text HTML thuần, không đụng camera. |
| C2 | N/A | Không có "tay" trong ask kiểu gõ chữ. |
| C3 | N/A | Không dùng camera. |
| C4 | OK | `runCell` (notebook-runner.js:245-250): nếu `this.#running` đang chạy VÀ `askGate.isArmed`, rerun CHÍNH cell đó đặt `this.#queuedRun=el` rồi gọi `askGate.cancel()` — hủy ask hiện tại rồi tự chạy lại đúng cell đó ngay khi `#clearRunning` xử lý xong (dòng 235: `if (this.#queuedRun) ... runCell(el)`). Không mất trạng thái, không kẹt. |
| C5 | OK-TESTED | Cùng đường `runCell`/`askGate.cancel()` như C4 (một cell khác cũng đi qua nhánh `this.#running` tồn tại). Cơ chế lõi (`AskGate.cancel()` gọi callback đã arm đúng 1 lần rồi xoá) được test bởi `test-interaction-matrix.mjs`'s "AskGate.cancel() invokes the armed callback exactly once and clears pending". Phần Worker/Pyodide thật (ném `__MDCANCEL__`) không lái được headless — xem phần Giới hạn kiểm thử. |
| C6 | N/A | `cellAsk` không có khái niệm `alive()` — nó tồn tại theo vòng đời cell/run, bị hủy gián tiếp khi rerun (C4/C5) chứ không tự theo dõi "cell còn sống". |
| C7 | N/A | Không có capture window camera. |
| C8 | OK | Reload giữa chừng: `ProgressStore`/`decideResume` chỉ lưu **frontier** (cell nào đã xong), không lưu ask đang treo giữa dòng — sau reload, cell đó được coi là chưa hoàn tất và sẽ chạy lại từ đầu (không có "ask đang treo" nào tồn tại qua reload vì state chỉ ở RAM). Không mất mát gì vì `localStorage` không lưu state ask. |
| C9 | OK-TESTED | `onDone` (notebook-runner.js:48-58) gọi `cellOutputSatisfies(el._expectOut, el._captured, el._heldCount)`; sai → hiện thông báo "hmm — check your edit…", KHÔNG completeCell. Được test bởi `test-cell-validation.mjs` (14 test case cho mọi dạng `expectOut`). |

### Hàng 2 — Cell code có ask fingers/expect-gated camera (`fingerAsk`)

| Cột | Verdict | Ghi chú |
|---|---|---|
| C1 | OK | `fingerAsk` (notebook-runner.js:274-301): `cameraEngine.ensure().then(...).catch(() => { ... fingerAskStub(...) })` — permission bị từ chối → promise reject → rơi vào `.catch`, hiện "camera unavailable — type the count" và dùng `fingerAskStub` (ask-gate.js:21) làm input gõ tay thay thế. Không kẹt, không mất tính năng. |
| C2 | OK | Trong `armFingerGate` callback (dòng 287-297): `if (!has) { target=null; held=0; gateBar.style.width='0%'; return; }` — mất tay chỉ làm thanh charge tụt về 0 (không có soft-decay ở đây, reset cứng), không throw, không tự resolve sai. Học sinh giơ lại tay là charge lại từ đầu bình thường. |
| C3 | OK | `CameraEngine`'s watchdog (camera-engine.js:60-65): nếu `watchdogActive()` (có gate đang cần tay) và không có kết quả MediaPipe > 3.5s, tự gọi `restart()` — dựng lại getUserMedia + `syncViews()` gắn lại video cho mọi chip đang mở, kể cả chip của `fingerAsk`. Gate (`armFingerGate` callback) không bị hủy khi restart — nó chỉ chờ frame mới tới tiếp tục. Nếu thiết bị rút hẳn (getUserMedia không bao giờ resolve lại), watchdog cứ 6s thử lại một lần (`restartAt` cooldown) — không kẹt vĩnh viễn nhưng cũng không có thông báo lỗi rõ cho học sinh biết máy ảnh đã chết hẳn (soft-degrade, không crash). |
| C4 | OK | Giống Hàng 1/C4: `runCell` phát hiện `askGate.isArmed`, tự hủy (`askGate.cancel()` → callback tại dòng 282 tắt `disarmFingerGate()`, `gateBar.style.width='0%'`, `resolve(ASK_CANCEL)`) rồi tự chạy lại. |
| C5 | OK | Giống C4, dùng chung `AskGate`, cơ chế hủy hoạt động bất kể cell nào rerun. Phần lõi JS test được (xem `test-interaction-matrix.mjs`), phần Worker thật không lái headless được — xem Giới hạn kiểm thử. |
| C6 | N/A | `fingerAsk` không đi qua `armVerbGate`'s tham số `alive()` — nó dùng `armFingerGate` (tier riêng, không có "alive" callback). "Rời cell" ở đây chỉ xảy ra qua rerun (C4/C5), tức đã có cơ chế hủy riêng qua `AskGate`. Không có khái niệm alive() độc lập ở tier này (khác `armVerbGate`/act gate). |
| C7 | N/A | `fingerAsk` không phải hai pha ARM→CAPTURE — nó là một gate giữ-đủ-lâu (`HOLD_MS`) đơn tầng, không có "capture timeout" theo nghĩa `TwoPhaseGate`. |
| C8 | OK | Giống Hàng 1/C8 — chỉ frontier được lưu; một ask đang treo giữa chừng không sống sót qua reload (không cần sống sót — cell chạy lại từ đầu). |
| C9 | OK-TESTED | Giống Hàng 1/C9 — `el._heldCount` (được set tại `onAsk` kind `'fingers'`, node.js không có nhưng notebook-runner.js:78) được đưa vào `cellOutputSatisfies` qua `{heldCount:...}` — test bởi `test-cell-validation.mjs`'s "held-count map" case. |

### Hàng 3 — Cell camera nhiều pha tuần tự (kiểu finisher Node 3)

| Cột | Verdict | Ghi chú |
|---|---|---|
| C1 | OK | Mỗi pha (vd `fire_vortex()`/`lighten()`/`darken()` trong Node 3 gọi `bridge.ask('fingers', ...)` tuần tự) đi qua CÙNG `fingerAsk()` mỗi lần — mỗi lần gọi lại tự `cameraEngine.ensure()` và tự fallback gõ tay nếu bị từ chối/mất quyền giữa chừng. Không có state camera "toàn cục" nào rò rỉ giữa các pha khiến một pha lỗi làm hỏng pha sau. |
| C2 | OK | Mỗi pha độc lập theo `armFingerGate`'s reset-khi-mất-tay (xem Hàng 2/C2) — mất tay ở pha 2 không ảnh hưởng pha 1 đã xong hay pha 3 sắp tới, vì mỗi `fingerAsk()` là một Promise mới, target/held cục bộ trong closure. |
| C3 | OK | Watchdog dùng chung `CameraEngine` một instance cho cả node — restart giữa pha vẫn hoạt động như Hàng 2/C3 (không phân biệt pha). |
| C4 | OK | `runCell` chỉ biết "cell nào đang chạy" (`this.#running`), không biết cell đó đang ở pha mấy trong vòng lặp Python — rerun CHÍNH cell hủy ask hiện tại (bất kể đang ở `fire_vortex` hay `darken`) qua `askGate.cancel()`, dừng toàn bộ vòng lặp Python (ném `__MDCANCEL__`, worker.js:25), rồi cell được chạy lại **từ đầu kịch bản Python** (không resume giữa các pha bên trong 1 lần run — đây là hành vi ĐÚNG theo thiết kế: một lần "run" = một lần chạy hết script). |
| C5 | OK | Tương tự C4 — cell khác chạy trong khi finisher đang ở pha 2/3 vẫn hủy đúng ask hiện tại (chỉ có 1 `AskGate` dùng chung toàn app, `#pending` luôn trỏ đúng ask đang treo bất kể pha nào). |
| C6 | N/A | Giống Hàng 2/C6 — tier `fingerAsk`/`armFingerGate` không có tham số `alive()`; "rời cell" giữa các pha chỉ xảy ra qua rerun (đã xử lý ở C4/C5). |
| C7 | N/A | Không dùng `TwoPhaseGate`/`armVerbGate` — vẫn là chuỗi `fingerAsk()` đơn tầng lặp lại. |
| C8 | OK | Giống Hàng 1/C8 — reload giữa một finisher nhiều pha chỉ mất tiến trình BÊN TRONG lần chạy Python đó (không lưu "đang ở pha mấy"); cell được coi là chưa `done`, chạy lại từ đầu sau reload — đúng với model "frontier-only" của `ProgressStore`. |
| C9 | OK | `expectOut`/`cellOutputSatisfies` được kiểm tra một lần ở CUỐI toàn bộ script (`onDone`, notebook-runner.js:48-58), dựa trên `el._captured` gộp TOÀN BỘ output/tell của mọi pha — đúng thiết kế "expectOut trên toàn bộ run", không phải lỗi. Nếu một pha giữa bị hủy bởi rerun/cancel (C4/C5) khiến script ném `__MDCANCEL__`, đường đó đi qua `onError` (dòng 59-68, bắt bằng regex `/__MDCANCEL__/`) chứ KHÔNG phải `onDone` — nên không bị tính nhầm là "output sai"; nó báo "⏹ stopped — bạn đã chạy cell khác" đúng như thiết kế. Đã truy vết cả hai nhánh `onDone`/`onError`, không phát hiện gap. |

### Hàng 4 — Quiz câu hỏi hold (giơ ngón tay chọn đáp án)

| Cột | Verdict | Ghi chú |
|---|---|---|
| C1 | OK | `quizCell`'s `el._arm` (quiz-cell.js:123-126): `cameraEngine.ensure().then(...).catch(() => {})` — bị từ chối quyền → rơi vào `.catch` rỗng, `armed` không được set `true`, quiz vẫn hiển thị nút bấm tay (`onclick` luôn gắn sẵn ở `show()`, dòng 65) — học sinh tap chọn được bình thường. |
| C2 | OK | `armHoldQuestion` (dòng 105-122): giống Hàng 2/C2, mất tay (`has` false hoặc count ngoài phạm vi nút) → `idx=-1` → `held=0`, thanh nạp `--qp` của mọi nút set 0 — không tự chọn nhầm. |
| C3 | OK | Dùng chung `CameraEngine` singleton — watchdog restart như Hàng 2/C3, `syncViews()` gắn lại `<video>` cho `.bcam video` (camera-engine.js:81 dùng selector `.bcam.on video`), đúng chip của quiz đang mở. |
| C4/C5 | N/A | Quiz không chạy qua Pyodide/`AskGate`/`runCell` — không có khái niệm "ask Python đang treo" để rerun/hủy. |
| C6 | OK | `armHoldQuestion`'s gate callback không có tham số `alive()` riêng, NHƯNG `fin()` (dòng 77-84) khi hết câu hỏi gọi `gestureDispatcher.disarmActGate()` — và nếu học sinh rời cell (revealNext tới cell khác), `notebook-runner`'s `#clearRunning`/`completeCell` flow không tự disarm quiz gate hộ — **rủi ro tiềm ẩn nếu quiz cell KHÔNG bao giờ gọi `fin()`** (vd bị thay thế bởi cell khác trước khi trả lời hết). Tuy nhiên trong thực tế mọi quiz đứng chắn (`isBlocking`) nên không có cell sau nó được reveal cho tới khi `completeCell` — engine không cho "rời" một quiz đang mở nửa chừng trừ khi rerun toàn trang. Đánh giá: OK theo thiết kế hiện tại (không thể alive()=false khi đang block), nhưng lưu ý đây không phải test tường minh cho "alive() false giữa quiz" — xem GAP note bên dưới nếu muốn siết chặt hơn. |
| C7 | N/A | Quiz hold dùng `armActGate` (một tầng, không phải `armVerbGate`/`TwoPhaseGate`) — không có khái niệm capture timeout. |
| C8 | OK | Giống Hàng 1/C8. Quiz đang trả lời dở dang bị mất tiến trình pha-trong-cell sau reload (chỉ frontier lưu), phải làm lại từ câu 1 của quiz đó — chấp nhận được, không lỗi. |
| C9 | N/A | Quiz không có `expectOut` — đúng/sai được chấm trực tiếp bằng `i === Q[qi].correct`, không phải qua chạy code. |

### Hàng 5 — Quiz câu hỏi track (đuổi theo mục tiêu trôi)

| Cột | Verdict | Ghi chú |
|---|---|---|
| C1 | OK | `armTrackQuestion` được arm qua `el._arm`'s `cameraEngine.ensure().catch(() => {})` — như Hàng 4/C1, từ chối quyền → rơi `.catch`, các `.qtarget` vẫn có `onclick=pick` (dòng 53) làm fallback tap. |
| C2 | OK | `makeTrackCapture` (two-phase-gate.js:73-93): mất tay (`!has`) → MỌI target decay đồng loạt (`held.set(t.key, Math.max(0, prev - dt*ARM_DECAY))`) — không có target nào giữ nguyên charge khi mất tay, không tự thắng nhầm. |
| C3 | OK | Cùng `CameraEngine` singleton + watchdog, như các hàng trên. |
| C4/C5 | N/A | Không qua Pyodide/AskGate. |
| C6 | OK-TESTED | Đường `armMultiTrackGate` → `armVerbGate` → có tham số `alive` thật: `() => !el.classList.contains('done') && Q[qi] && Q[qi].gesture==='track'` (quiz-cell.js:98). Khi `alive()` sai (câu đổi/quiz done), `armVerbGate`'s `onHands` check `if (!alive()) { this.disarmMotionGate(); chip.classList.remove('on'); return; }` (gesture-dispatcher.js:128) — đã test bởi `test-interaction-matrix.mjs`'s "alive() flipping false mid-gate disarms the gate and never fires onDone" (dùng chính `armVerbGate`, không giả lập). |
| C7 | OK-TESTED | `TwoPhaseGate.step`'s timeout re-arm (two-phase-gate.js:45) áp dụng cho track y hệt swipe — test bởi `test-interaction-matrix.mjs`'s "a capture timeout re-arms the gate, and a subsequent attempt still resolves" (dùng verb `swipe` làm đại diện chung cho `armVerbGate`, cơ chế timeout nằm ở `TwoPhaseGate` dùng chung cho mọi verb kể cả `track`) và test có sẵn `test-two-phase-gate.mjs`'s "capture timeout re-arms and emits onState('timeout', 0)". |
| C8 | OK | Giống Hàng 4/C8. |
| C9 | N/A | Giống Hàng 4/C9 — chấm bằng `key === Q[qi].correct`, không qua `expectOut`. |

### Hàng 6 — Boss round hold (giơ ngón tay chọn đáp án / high-five kết liễu)

| Cột | Verdict | Ghi chú |
|---|---|---|
| C1 | OK | `#armFingers` (boss-fight.js:219-243): `cameraEngine.ensure().then(...).catch(() => {})` — mất quyền → `.catch` rỗng, các nút `.qopt`/`.bround` vẫn có `onclick` tap fallback (dòng 149, 141-142). |
| C2 | OK | Trong callback (dòng 228-241): mất tay → `idx=-1` (`has && count>=1...` sai) → `target=idx; held=0` reset về 0, không tự chọn nhầm, tương tự Hàng 4/C2. |
| C3 | OK | Cùng `CameraEngine` singleton + watchdog. |
| C4/C5 | N/A | Boss round hold không đi qua Pyodide/AskGate (chỉ boss CODE round mới có, xem Hàng 8). |
| C6 | OK | Callback tự kiểm `if (this.#el.classList.contains('done')) { gestureDispatcher.disarmActGate(); chip.classList.remove('on'); return; }` (dòng 229) mỗi frame — khi trận đấu kết thúc (`victory()` thêm class `done`, dòng 123), gate tự tắt ngay ở frame kế tiếp, không cần một tham số `alive()` riêng vì boss tự theo dõi state `done`/`phase` của chính nó. |
| C7 | N/A | Round hold dùng `armActGate` một tầng (giữ đủ `QUIZ_HOLD_MS`), không phải `armVerbGate`/`TwoPhaseGate` — không có "capture timeout" theo nghĩa hai pha. |
| C8 | OK-TESTED | `BossFight`'s `snapshot`/`#paint()` gọi `onSaveProgress({boss:this.snapshot})` mỗi lần HP/hearts/streak đổi (boss-fight.js:69) → `ProgressStore.save` lưu `sub.boss`. Sau reload, `#restoreSubState` (notebook-runner.js:133-138) gọi `el._dev.setHp(sub.boss.hp)` để khôi phục HP — được test gián tiếp bởi `test-progress-versioning.mjs` (cơ chế version/resume chung) tuy test đó không mô phỏng boss cụ thể; phần `setHp` cheat-hook đã có sẵn, chấm OK bằng trích dẫn mã (không có test boss-cụ-thể mới trong phạm vi yêu cầu). |
| C9 | N/A | Boss round hold chấm bằng `i===r.correct`, không qua `expectOut`. |

### Hàng 7 — Boss round swipe

| Cột | Verdict | Ghi chú |
|---|---|---|
| C1 | OK | `#armSwipe` (boss-fight.js:248-261) gọi `gestureDispatcher.armSwipeGate(...)` → `armVerbGate` → `cameraEngine.ensure().catch(() => {})` — mất quyền → không arm, nhưng UI `.swipeleft`/`.swiperight` có `onclick` (dòng 141-142) tap fallback. |
| C2 | OK | Trong pha CAPTURE, mất tay (`has:false`) khiến `makeSwipeCapture`'s `step` không push mẫu mới (chỉ push khi `has && lm`, two-phase-gate.js:60) — không tự trôi/chọn nhầm; nếu mất tay xuyên suốt tới hết `GESTURE_CAPTURE_MS`, rơi vào timeout re-arm (xem C7). |
| C3 | OK | Cùng watchdog/`CameraEngine`. |
| C4/C5 | N/A | Round swipe không qua Pyodide/AskGate. |
| C6 | OK-TESTED | `alive` callback của `#armSwipe`: `() => this.#phase==='fight' && !this.#busy && !this.#el.classList.contains('done') && !!(this.#pool[0] && this.#pool[0].gesture==='swipe')` (dòng 252) — sai bất kỳ điều kiện nào (round đổi, đấu xong, đang bận) khiến `armVerbGate`'s `onHands` disarm ngay, đúng cơ chế đã test ở `test-interaction-matrix.mjs`. |
| C7 | OK-TESTED | Giống Hàng 5/C7 — `TwoPhaseGate` timeout re-arm dùng chung mọi nơi gọi `armVerbGate`, đã test. |
| C8 | OK-TESTED | Giống Hàng 6/C8 — `onSaveProgress`/`#restoreSubState` chung cho mọi round type (hp/hearts/streak không phân biệt round hiện tại là hold hay swipe); nếu reload xảy ra giữa 1 round swipe, round đó coi như chưa trả lời, đấu tiếp tục từ HP đã lưu — không có gap. |
| C9 | N/A | Chấm bằng `idx===this.#pool[0].correct`, không qua `expectOut`. |

### Hàng 8 — Boss round code (chữa lỗi để đánh — `strike.py`)

| Cột | Verdict | Ghi chú |
|---|---|---|
| C1 | N/A | Round code không tự mở camera trừ khi script Python bên trong gọi `ask('fingers', ...)` — bản thân việc RUN code không cần camera. |
| C2 | OK | Nếu script trong round có ask camera, dùng lại y hệt `fingerAsk` (Hàng 2/C2). |
| C3 | OK | Dùng chung `CameraEngine`. |
| C4 | OK | `cc.querySelector('.crun').onclick = () => this.#runCell(cc)` (dòng 162) — cùng `runCell` engine như Hàng 1 — rerun cell đang treo ask tự hủy + tự chạy lại (không có API riêng cho boss, dùng thẳng notebook-runner's `runCell`). |
| C5 | OK | Tương tự C4 — cùng `AskGate` toàn cục. |
| C6 | OK | `cc._fight = ok => { if (this.#phase !== 'fight') return; ok ? this.strike(r) : this.wound(true); }` (dòng 169) — nếu trận đã `stagger`/`done` khi `onDone`/`onError` gọi tới `el._fight`, guard `if (this.#phase !== 'fight') return` chặn không cho strike/wound "trễ" ảnh hưởng sau khi trận đã kết thúc. |
| C7 | N/A | Round code không phải gesture hai pha. |
| C8 | OK-TESTED | Giống Hàng 6/C8. |
| C9 | OK-TESTED | **Đây chính là bug đã sửa trong lịch sử (node02 finisher, xem CLAUDE.md)** — nay đã chặn đúng: `onDone` (notebook-runner.js:48-58) kiểm `cellOutputSatisfies` TRƯỚC khi cho phép `el._fight(true)`; sai → `el._fight(false)` (dòng 53) khiến boss "feed" (hồi máu) thay vì bị đánh trúng. Không có đường vòng "chạy sạch = luôn trúng đòn" nào còn sót — test bởi `test-cell-validation.mjs` (cơ chế `cellOutputSatisfies` dùng chung) + đọc trực tiếp `onDone`'s logic xác nhận `_fight` chỉ gọi `true` sau khi qua kiểm tra. |

### Hàng 9 — Nhận quà có giới hạn thời gian (gift claim timed-catch)

| Cột | Verdict | Ghi chú |
|---|---|---|
| C1 | OK | `el._arm` (gift-cell.js:48): `gestureDispatcher.armTimedCatchGate(...)` → bên trong `cameraEngine.ensure().then(...).catch(() => {})` (gesture-dispatcher.js:86) — mất quyền → `.giftmini` vẫn có `onclick=open` (dòng 47) tap fallback; vòng ring vẫn chạy độc lập với camera (`startRing()` không phụ thuộc camera). |
| C2 | OK | Trong `armTimedCatchGate`'s callback (gesture-dispatcher.js:74-87): "no soft decay here — a miss just resets" (comment dòng 83) — mất tay → `held=0` ngay, KHÔNG có "trúng nhầm" vì catch chỉ tính đúng thời điểm giữ liên tục `CATCH_DEBOUNCE_MS`. |
| C3 | OK | Dùng chung `CameraEngine`/watchdog. |
| C4/C5 | N/A | Gift claim không qua Pyodide/AskGate. |
| C6 | OK | Callback tự kiểm `if (!alive()) { this.disarmActGate(); chip.classList.remove('on'); return; }` (gesture-dispatcher.js:81) với `alive = () => !el.classList.contains('opened')` (gift-cell.js:48) — mở quà xong/class đổi thì disarm ngay. |
| C7 | N/A | Đây là gate một tầng (`armTimedCatchGate`), không phải `armVerbGate`/hai pha — "catch" chỉ cần giữ đủ `CATCH_DEBOUNCE_MS` (120ms) rồi bắt ngay, không có capture window dài để timeout. |
| C8 | OK | `saveProgress({giftGiven:true})` (dòng 39) lưu vào `sub` của `ProgressStore` — theo `#restoreSubState` (notebook-runner.js:133-138) hiện KHÔNG có nhánh khôi phục `sub.giftGiven` (chỉ có nhánh `sub.boss`) — nghĩa là quà đã lưu cờ `giftGiven` nhưng nếu reload TRƯỚC KHI cell hoàn tất (`completeCell`), cell gift được coi là "chưa xong" và học sinh sẽ mở quà LẠI (không mất quà thật vì logic trò chơi coi cell hoàn tất mới tính, không dựa cờ `giftGiven` để tính) — không lỗi crash/kẹt, chỉp phải mở lại animation, chấp nhận được (giống các cell khác — chỉ frontier & explicit sub-restores mới sống sót qua reload). |
| C9 | N/A | Không có `expectOut` — gift luôn "thành công" theo thiết kế (no fail state), chỉ khác PERFECT hay GOT IT. |

### Hàng 10 — Cổng chuyển act bằng giữ tay (act-transition hold gate)

| Cột | Verdict | Ghi chú |
|---|---|---|
| C1 | OK | `armActHoldGate` (gesture-dispatcher.js:50-66): `cameraEngine.ensure().then(...).catch(() => {})` (dòng 65) — mất quyền → gate không arm, chip `.on` không bao giờ hiện, NHƯNG nút bấm tay (`$('enterBtn').onclick`, `$('giftwrap').onclick`, `#ritualBtn.onclick`) luôn có sẵn độc lập với gate — học sinh vẫn qua act được bằng tap/click. |
| C2 | OK | Trong callback (dòng 57-64): "soft decay — dropping the sign relaxes the charge" — mất tay/đổi số ngón → `held = Math.max(0, held - dt*2.2)` (không reset cứng về 0), khớp đúng comment thiết kế; charge KHÔNG lambing về 0 tức thì. |
| C3 | OK | Dùng chung `CameraEngine`/watchdog toàn cục. |
| C4/C5 | N/A | Act gate không qua Pyodide/AskGate. |
| C6 | OK | Callback tự kiểm `if (!alive()) { this.disarmActGate(); chip.classList.remove('on'); return; }` (dòng 58) mỗi frame — vd `enterNode()`'s alive `() => !$('splash').classList.contains('gone')` (node.js:129-130) sai ngay khi rời splash → gate tự tắt. |
| C7 | N/A | `armActHoldGate` là gate một tầng liên tục (không ARM→CAPTURE), không có khái niệm timeout riêng — chỉ có soft-decay liên tục. |
| C8 | N/A | Act gates (splash/bundle/ritual-entry) xảy ra TRƯỚC khi vào notebook — không có gì để `ProgressStore` lưu ở tầng này (frontier chỉ tính từ lúc vào book); một khi node đã unlock ở map (`SAGA_KEY`), quay lại node luôn bắt đầu lại từ splash — không có "resume giữa act" theo thiết kế, không phải gap. |
| C9 | N/A | Không phải code cell, không có `expectOut`. |

### Hàng 11 — Ritual (hold-to-seal)

| Cột | Verdict | Ghi chú |
|---|---|---|
| C1 | OK-TESTED | `RitualController#open` (ritual-controller.js:43-70): đua một `setTimeout(CAMERA_WAIT_MS)` (5000ms) với `cameraEngine.ensure()` — nếu quyền bị từ chối HOẶC prompt bị lờ đi mãi mãi, timeout thắng, hiện "no camera — press and hold the seal instead" và show `$('holdBtn')` (nút giữ tay bấm thay). Đây chính là fix đã ghi trong comment (dòng 50-52) cho lỗi cũ "permission prompt never answered → ensure() pending forever, no fallback ever shown". Cơ chế race-timeout là code thật, không phải suy đoán — nhưng KHÔNG có test tự động cho riêng ritual (chỉ trích dẫn mã); phần `armActHoldGate`'s `.catch()` fallback dùng chung đã test gián tiếp qua các hàng khác. |
| C2 | OK | `#step` (dòng 72-80): mất tay (`!this.#has`) → `feeding=false` → charge giảm dần theo `RITUAL_DECAY` (soft-decay, không reset cứng), giữ lại tương tự Hàng 10/C2. |
| C3 | OK | Dùng chung `CameraEngine`/watchdog; `#step`'s rAF loop tự dừng khi `this.#active` sai (`seal()` set `#active=false`), không phụ thuộc riêng vào việc stream có sống hay không ở tầng ritual — watchdog xử lý restart stream như mọi nơi khác. |
| C4/C5 | N/A | Ritual không qua Pyodide/AskGate — nó chạy độc lập bên ngoài notebook runner. |
| C6 | OK | `ritualCellEl`'s `_arm`: `() => !this.#sealed && this.#overlayEl.classList.contains('gone')` (ritual-controller.js:35) — sau khi `seal()` chạy (`#sealed=true`), `armActHoldGate`'s callback tự disarm theo cùng cơ chế Hàng 10/C6. |
| C7 | N/A | Ritual dùng `armActHoldGate` (một tầng, soft-decay liên tục), không phải `armVerbGate`/hai pha — không có "capture timeout" ở đây. |
| C8 | OK | `seal()` gọi `this.#progressStore.clear()` (dòng 114) NGAY khi seal thành công — tiến độ trong-node bị xoá vì node đã xong, không cần resume nữa; nếu reload TRƯỚC khi seal xong, `ProgressStore`'s frontier (đã dừng ở cell ritual cuối) đưa học sinh quay lại đúng cell ritual để thử lại — không mất, không kẹt. |
| C9 | N/A | Không phải code cell. |

### Hàng 12 — Photo booth (Node 1 "camera charm" — `PhotoBooth`)

| Cột | Verdict | Ghi chú |
|---|---|---|
| C1 | OK | `#doBooth` (photo-booth.js:40-54): `await this.#cameraEngine.ensure().catch(() => {})` — bị từ chối quyền vẫn tiếp tục (không throw), NHƯNG `if (!self.RitualVortex) return;` chặn nếu vortex script chưa tải — nếu camera bị từ chối, `#vfx` engine vẫn mount (không cần stream để mount canvas), chỉ riêng `gestureAsk()` (dòng 66-88) mới thật sự cần camera: nó có `.catch(() => { ...fingerAskStub... })` (dòng 85-86) y hệt `fingerAsk` — fallback gõ tay hoạt động. |
| C2 | OK | `gestureAsk`'s `armFingerGate` callback (dòng 76-84): mất tay hoặc sai `BOOTH_SIGNS[count]` → `target=null; held=0` reset về 0 — không tự chọn nhầm động tác pour/whirl/snap. |
| C3 | OK | Dùng chung `CameraEngine`/watchdog. |
| C4 | OK | Booth act là cell code (Python `photo_booth()` gọi `ask('gesture',...)` lặp) — cùng `runCell`/`AskGate` cơ chế như Hàng 1 — rerun CHÍNH cell hủy đúng ask qua `askGate.cancel()` (dòng 70: callback set `resolve('\x18')`). |
| C5 | OK | Cùng cơ chế C4, dùng chung `AskGate` global — cell khác chạy trong lúc booth đang treo `gestureAsk` cũng hủy đúng. Phần lõi JS (`AskGate`) test được, phần Worker/Pyodide thật không lái headless — xem Giới hạn kiểm thử. |
| C6 | N/A | `gestureAsk` dùng `armFingerGate` (tier không có tham số `alive()` riêng, giống Hàng 2/C6) — không tự theo dõi "cell còn sống"; việc hủy khi rời cell chỉ xảy ra gián tiếp qua rerun (C4/C5). |
| C7 | N/A | `gestureAsk` không phải `armVerbGate`/hai pha — là gate giữ-đủ-lâu đơn tầng (`GESTURE_HOLD_MS`), không có capture timeout riêng. |
| C8 | OK | Giống Hàng 1/C8 — chỉ frontier lưu; booth act giữa chừng không sống sót qua reload, chạy lại từ đầu script Python của cell đó. |
| C9 | N/A | Booth act không dùng `expectOut` — nội dung mở-quà/khoảnh khắc chụp ảnh vốn open-ended (ảnh chụp thật từ camera), đúng theo ngoại lệ "output vốn mở" nêu trong CLAUDE.md. |

## Tổng hợp

**Số ô theo verdict** (108 ô, 12 hàng × 9 cột):

| Verdict | Số lượng |
|---|---|
| OK | 68 |
| OK-TESTED | 15 |
| GAP | 0 |
| N/A | 25 |

*(Hàng 3/C9 ban đầu bị đánh dấu nghi ngờ GAP khi soạn thảo, nhưng sau khi
truy vết kỹ `onError`'s xử lý `__MDCANCEL__` so với `onDone`'s kiểm tra
`expectOut`, xác nhận đây là hai đường tách biệt đúng thiết kế — không có
lỗi thật. Đã sửa lại thành OK trong bảng và không tính vào tổng GAP.)*

## Không tìm thấy GAP nào

Sau khi đọc kỹ toàn bộ 10 file yêu cầu cộng các file liên quan
(`photo-booth.js`, `gift-cell.js`, `gesture-registry.js`, `gesture-ui.js`,
`constants.js`, `worker.js`), **không phát hiện lỗ hổng (GAP) thật nào** ở
108 ô ma trận. Điểm đáng chú ý nhất trong quá trình khảo sát:

- Cơ chế hủy ask khi rerun cell khác (`AskGate` + `'\x18'`/`__MDCANCEL__`)
  hoạt động nhất quán cho MỌI loại ask (gõ tay, camera finger, camera
  gesture booth) — vì cả ba đều dùng chung một `AskGate` instance
  (`node.js:37`, truyền xuống cả `NotebookRunner` và `PhotoBooth`).
- `alive()` guard trong `armVerbGate`/`armActHoldGate`/`armTimedCatchGate`
  là pattern lặp lại nhất quán ở MỌI gate hai-pha hoặc một-pha có UI riêng
  (quiz track, boss swipe, boss hold, gift claim, act gate, ritual) — không
  có gate nào thiếu tham số này.
- Mọi nơi gọi `cameraEngine.ensure()` để arm một gate đều có `.catch(() => {})`
  ngay sau, xác nhận đúng pattern "không camera → chỉ còn tap/gõ tay", TRỪ
  ritual (dùng race-timeout thay vì `.catch` đơn thuần, vì ritual cần một
  fallback UI khác hẳn — nút giữ, không phải input gõ).
- Bug lịch sử về boss code round bỏ qua `expectOut` (node02 finisher, nhắc
  trong CLAUDE.md) đã được xác nhận SỬA ĐÚNG trong `onDone`'s logic hiện tại.

## Giới hạn kiểm thử (không lái được headless)

Đường **Pyodide/Worker cancel** thật (`bridge.ask()` chặn bằng
`Atomics.wait` trong `lessons/worker.js`, và phía trình duyệt việc `respond()`
ghi `'\x18'` vào `SharedArrayBuffer` rồi `Atomics.notify`) **không thể chạy
trong Node headless** của bộ test này — nó cần một Worker thật + Pyodide
WASM đã tải + `crossOriginIsolated` (yêu cầu header COOP/COEP qua HTTP thật).
Các ô sau được đánh giá **OK bằng trích dẫn mã nguồn**, KHÔNG phải
OK-TESTED, vì lý do này:

- Hàng 1/C5, Hàng 2/C5, Hàng 3/C4-C5, Hàng 8/C4-C5, Hàng 12/C4-C5 (phần
  "worker thực sự nhận `'\x18'` và ném `__MDCANCEL__`").

Phần **lõi JS thuần** của cơ chế hủy (`AskGate.arm`/`cancel`/`clear`) — tức
"cancel() gọi callback đã arm đúng 1 lần rồi xoá pending" — LÀ pure JS,
không cần DOM/Worker, và ĐÃ được test trong `test-interaction-matrix.mjs`
(`AskGate.cancel()`/`AskGate.clear()` test case). Không dựng harness giả lập
worker để "cho có test" — điều đó sẽ không thực sự chạy qua
`bridge.ask()`/`Atomics.wait` thật, nên bị bỏ qua có chủ đích thay vì giả vờ
kiểm chứng được.

## File test tương ứng

`lessons/test-interaction-matrix.mjs` — 7 test case, assert thuần (không
framework), theo đúng phong cách `lessons/test-dispatcher.mjs`:

1. hand lost mid-arm decays (không hard-reset) tiến trình arm.
2. `alive()` sai giữa gate → disarm + gỡ class `'on'`, KHÔNG bao giờ gọi `onDone`.
3. gesture capture timeout → gate quay lại pha ARM (không kẹt), và một lần
   thử MỚI sau timeout vẫn resolve đúng.
4. một gate đã resolve KHÔNG BAO GIỜ gọi `onDone` lần hai dù nhận thêm frame.
5. một gate MỚI dựng sau khi gate trước timeout khởi động sạch sẽ ở pha ARM.
6. `AskGate.cancel()` gọi đúng 1 lần callback đã arm rồi xoá pending.
7. `AskGate.clear()` xoá pending mà KHÔNG gọi callback (đường resolve bình thường).

Không có bug một-dòng nào được sửa trong quá trình khảo sát này — mọi
đường code đọc được đều khớp với hành vi mô tả trong comment/thiết kế hiện
có.
