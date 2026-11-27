# Task 002 — 3D Motion Studio

## Objective

基於現有的 OBJECT 001 / MAKER CONSOLE Playground，提升 3D 模型的視覺品質，並建立可重複使用的機械動畫系統。

不要重新建立專案，不要移除既有功能，不要開始開發正式 Landing Page。

## Visual References

- https://recent.design/i/jxpvlxl-ai-generated-macro-pad-3d-model
- https://recent.design/i/qkfor3e-3d-product-explorations
- `references/` 資料夾中的視覺參考

延續 Soft Industrial Craft 設計方向。面板採霧透處理，能隱約看見內部結構；維持奶油白外殼、橄欖綠及陶土橘按鍵、復古單色 LCD 與精緻金屬旋鈕。

## Phase 1 — Existing Implementation Audit

先檢查現有程式碼與模型，記錄問題並優先重用現有程式。只有必要時才重構。

- Geometry quality：曲面、法線、倒角、孔洞、壁厚及零件穿插。
- Mesh hierarchy、component naming、local origins、pivots 與裝配軸線。
- Materials：塑膠、磨砂透明材質、金屬、玻璃及橡膠。
- Lighting、camera、contact shadows、rendering performance 與資源生命週期。
- 保留精修前基準截圖供前後比較。

## Phase 2 — Visual Refinement

目標是精緻的工業產品展示效果，而非低多邊形或卡通風格。

- 改善外殼圓角、倒角、法線及接縫，消除可見的側面分段。
- 修正產品比例與裝配高度，讓外殼、鍵帽及內部零件合理配合。
- 重建鍵帽淺凹曲面、圓滑肩部與底緣；改善機械開關外殼、軸心及接腳。
- 加入有合理轉折的 PCB 走線、焊盤、固定柱、焊點與電子元件。
- 旋鈕採車削輪廓，加入細密滾花及頂部加工紋；改善螺絲座與 USB-C 插孔。
- LCD 分成框體、顯示面及薄玻璃，確保文字清晰且不浮在面板上。
- 建立具區別的 PBR 塑膠、磨砂面板、金屬、玻璃、PCB 與橡膠材質。
- 以柔和攝影棚主光、補光、輪廓光、環境反射及接觸陰影呈現產品層次。
- 保持磨砂半透明上蓋隱約透出內部，不呈現透明玻璃或不透明白板效果。
- 先完成並檢查組裝狀態的視覺品質，再進入動畫開發。

## Phase 3 — Animation System

動畫邏輯與 Maker Console component 分離。所有動畫皆以標準化進度計算狀態，支援任意進度跳轉與可逆播放；相同進度及設定必須得到相同狀態，不依賴播放歷史。

建立可重複使用的 Motion Controller、Component Registry、Animation Timeline、Material Presets、Lighting Presets、Camera Presets，並為每個 3D 物件提供獨立動畫設定檔。保留未來由 scroll progress 呼叫 `setProgress(0–1)` 的介面。

核心控制介面：

```ts
type MotionId =
  | "explode"
  | "reassemble"
  | "turntable"
  | "keyPress"
  | "rotary"
  | "lcdBoot";

interface MotionController {
  select(id: MotionId, targetId?: string): void;
  play(): void;
  pause(): void;
  reverse(): void;
  replay(): void;
  reset(): void;
  setProgress(progress: number): void;
}
```

動畫狀態規則：

- 進度介於 0 與 1；面板時間軸顯示 0–100%。
- Play 正向播放；Pause 保持當前狀態；Reverse 從當前進度反向播放。
- Replay 回到所選動畫起點並正向播放；Reset 恢復模型完整組裝與預設互動狀態。
- Timeline scrubber 拖曳時暫停播放，直接套用目標進度。
- 動畫設定變更後，以目前標準化進度重算狀態。
- 任一時刻只播放一個選定動畫；切換動畫後套用新動畫起點。
- 動畫更新不應每幀觸發整個 React 模型樹重新渲染。

### M01 — Exploded View

主要零件沿合理組裝軸線依序分離，底座作為固定基準，避免明顯碰撞。

### M02 — Reassembly

依物理組裝順序返回原位置，使用拆解路徑反向播放並精確恢復原始 transform。

### M03 — Product Turntable

產品展示父 Group 繞模型中心旋轉 360 度，不修改零件的局部座標。

### M04 — Tactile Key Press

六顆按鍵可個別指定；按鍵沿自身按壓軸移動並回彈，不穿入支撐結構。

### M05 — Rotary Interaction

旋鈕帽繞實際軸心獨立轉動，固定底座不跟隨旋轉。

### M06 — LCD Boot Animation

LCD 隨進度呈現開機自檢、啟動及 READY 動態文字。顯示內容依進度決定，支援反向播放及任意跳轉。

預設時長：拆解／組裝 4 秒、旋轉 8 秒、按鍵 0.4 秒、旋鈕 1.2 秒、LCD 2.4 秒。旋轉採 Linear，其餘採克制的 Power In Out 或 Power Out，不使用誇張彈跳。

## Phase 4 — Playground Animation Panel

在現有 Playground 控制面板新增 Animation Studio，保留既有視角、縮放、材質、光源、Wireframe 與零件顯示功能。

新增控制：

- Animation selector 及按鍵動畫目標選擇。
- Play、Pause、Reverse、Replay、Reset。
- Timeline scrubber（0–100%）。
- Duration、Easing（Linear、Power In Out、Power Out）。
- Explode distance、Component stagger。
- Camera controls 沿用既有視角預設與 Orbit Controls；Scrub 時不重設使用者視角。

距離與 stagger 僅在拆解／組裝動畫中啟用；按鍵目標僅在按鍵動畫中啟用。動畫播放時持續渲染，暫停後恢復按需渲染。相機取景應能容納完全拆解狀態。

## Architecture Requirements

- 保留九類主要零件各自的 Mesh／Group、穩定 ID、初始 transform、local origin 與合理 pivot。
- Component Registry 保存零件 Object3D、初始 transform、組裝軸及動畫角色。
- 動畫設定以 Maker Console 的獨立 profile 宣告零件位移、順序、stagger 與旋轉目標。
- Material、Lighting、Camera Presets 集中管理，供後續物件重用。
- Geometry、材質及紋理應適當重用並釋放。
- 不把所有動畫控制硬編碼在 Maker Console component 中。

## Validation

- 九類主要零件與各按鍵、旋鈕能獨立控制。
- 拆解全程無明顯穿插，組裝後精確回到初始 transforms。
- 驗證進度 0、0.5、1、0.25、0.75、0；正向、反向及直接跳轉結果一致。
- Play、Pause、Reverse、Replay、Reset、設定變更及動畫切換行為正確。
- 原有 Playground 控制功能不受影響。
- 執行 lint、type check、build，並檢查瀏覽器執行錯誤及重複操作後資源狀態。
- 檢查桌面與窄螢幕的構圖、可操作性及效能。
- 若可操作瀏覽器，保存完整組裝、半拆解、完全拆解與材質近景截圖至 `output/playwright/`。

## Deliverables

- 精修後的 Maker Console 01 及其產品攝影棚呈現。
- 六種支援可逆播放與任意跳轉的動畫。
- 可重用動畫核心及 Maker Console 獨立動畫設定檔。
- Playground Animation Studio 面板。
- 更新後的 `Design.md` 與使用說明。
- 完成項目、截圖、測試結果、效能問題及尚未完成項目報告。

## Out of Scope

- 正式個人品牌 Landing Page。
- 以網頁滾動驅動動畫；本任務僅保留 progress API。
- Game Boy、皮革筆記本、相機等其他 3D 物件。
- 與本任務無關的新增功能或專案重建。
