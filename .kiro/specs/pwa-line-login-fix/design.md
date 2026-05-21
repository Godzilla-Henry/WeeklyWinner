— 行動裝置上按時會跳轉至LINEApp 認證成後cllback在新的瀏覽器視窗/分頁開啟，原視窗PWA 或瀏覽器分頁）仍停留在未登入狀態。修正策略為：改用LFF_ID開啟，LINEApp 在其開啟URL`lif.()完成後自動授權流程 LINE App 內完成不開新視窗。桌面瀏覽器維持現有iff.l()流程:上lbac 在新視窗開啟的條件:應使用`line://app/{FF_ID}`，中登入: 瀏覽器log({ redrcUri }+BroadcsCan流程.ts login(): 登入函式，目前對所置統一呼叫`lif.gin()`plginiLiff()**:應用啟動時初始化插件已處理lggdIn→ycBndog()邏輯: LINE Lg LIFF 應用ID（）定義constanndexlff.iICint:LIFFSDK PI，判斷是否在LINEApp內建 bVw執行上，使用者按按鈕ts` 的 `函式{ redirectUri }。LINE DK會跳轉至 App 進行認證，認證系統瀏覽器的**新分**原本或瀏覽器分頁:inputinputginAttempt { userAent: strg, maxTouchPis: numbr }L = /iPhon|iPad|iPod|Android/.tstinput
ORnpu.mxTuchnt> 1
RETURMbil"ff.logi()"Standalone(iPhone): 按下→跳轉LINEApp→ 認證allback在新分開啟仍未登入❌
-**機 Chrome(ndroid): 使用者按下 →`liff.logn()`→跳轉App→認證完成→callbk 在 rom新分頁開啟原分頁仍未登入❌
-**手機Safari(iPhone): 使用者按下 →`liff.lgn()`→跳轉pp →認證完成→callbackfari新分頁開啟原分頁仍未 ❌**:使用者按下 → lff.lgn→LINEOAuth 頁面在同視窗開啟 認證完成→ redirec回原頁面 登入成功 ✅（）:{eireUri})` 流程必須pugns/lit` 的 `iLiff修改：偵測gedIn → syncBackendLog()自動同步
- 後端API 呼叫方式不變（LINE Access TBradcatChanl橋接機制（PwaBidgs）保留，桌面PWA 仍可使用FFSDK管理的ccessToken+ Pini pessted pfil 儲存機制變
- `src/api/http.ts` 的認證請求不修改:非行動裝置登入流程完全不受此修正影響。行動上的其他功能（後的PI呼叫、頁面導航、登出等也明確`seLiff.s`login() 未區分裝置類型: 目前 `logn()`對所有裝置一呼叫`iff.lgi({ rdirectUri})`未考慮行動裝置上 `liff.login()` 會跳轉至pp並新視窗回傳cllbck差異LINEDK行動裝置行為: 在行動裝置上，liff.lgi()觸發 LNEApp的 Auth流程，認證完成後LIEA 會用系統瀏覽器開啟 i URI，這必然是新瀏覽器分頁/視窗無法回到原本的或瀏覽器分頁正確的行動裝置流程**: 使用 `le://pp/{LIFF_ID}`深層連結直接開啟LINEpp，LINEApp會在其內建WbVew 中載入 LIFF EndpiURL（即應用根路徑`/`）由於使用者已在 LINE App 中登入，`liffinit()`完成後lisLgedI 自動為tue`，`uginlitLiff會自動執行syncBackendL 完成登入使用登入puhere te us is on a mobile devic(return) presses the LINE gibutton,t fxd `lfunctionL navigate to `line://app/{IFF_ID}`via` insteadofcalg `.login(), ensuring theloginflowcomletes within'swith peng anewbrowse wndow.瀏覽器登入流程puhere te us is NOT on a mobile devic(returne), the fixd`login()`function continue tocall{ redirectUri } with thesamerediect URI lgi s before (daloe modusesorign`, otherwse use `origin + pathame`), preservng the xistig deskop loginflow.僅修改 1個檔案：LffFile:src/comosbles/uLiff.t

**Fucton**: `li():
新增行動: 在login()函式內使用 regex+ maxTuchPonts 判斷是否為行動裝置不需新增 np套件）

2.**行動裝置分支 — 深層連結**: 若為行動裝置，使用 `window.ocaion.href= \lne://app/${LFF_ID}\`導向 LINE App
3桌面分支 — 維持現有邏輯: 若為桌面，維持現有 liff.login({ diectUri })呼叫不變
4不修改其他檔案: plgin/lff.ts` 已有 `loggedIn → synBackndLogin邏輯LINEApp Webiw開啟根路徑後自動觸發，無需額外處理**修正後的 login() 函式：**
untionlog(): vidf (!nitiaizd.vau) retur

行動裝置判斷：UA rgex+mxTouchPoins（涵蓋 iPad 等平板）contisMbi=
Phon|iPad|iPd|Andoid/i.es(navgatr.rAgnt||
    nagator.maxTouhPints > 1;if (iMi) {
    / 行動裝置：深層連結開啟 INE App → WebVw 載入 IFF URL → 自動登入
    wndowlocion.ref=`line://app/${_I}`;
retr;
 }  // 桌面：維持現有 lf.logn() 流程
  onst{ origin, ptham}= wndw.locaion;
  redrectUrisSandaloneMode()? orgin : `${gi}${pathnam}`;
  .login({ redirectUri };
}
``

**為何只需改1個檔案：**
-開啟 LIFF Endpoint URL（根路徑 `/`）- `maints`執行 → → )`→ `.sgdI()`為 `（因為 LINE App 內）-pluis/偵測到`lggdI.value` 為e→自動 sycBendLoin()- 登入同步完成 → amou → 使用者看到已登入的 Dshbrd
##Testg Stragy

###VaaoAppach
測試策略分兩階段：先在未修正的程式碼上確認bu存在（所有裝置都走`lff.loi()`），再驗證修正後行動裝置走深層連結、桌面維持不變。### ElaoryBg CodiChckg

**Goal**: 在未修正的程式碼上確認 bug 條件成立 — 行動裝置上 `logn` 呼叫`l.lgin() 而非深層連結。TstPlan Mocknagtor.serAgen` 為行動裝置 UA，呼叫 `log()`，驗證它呼叫了 `l.oin()而非設定`wndo.lotin.hrf`Tsts:iPhone UA Test: 設定 UA 為 iPhe，呼叫 `lgi() →預期呼叫lff.lgn()（未修正時的行為bg）
2**AriUATest: 設定UA為An，呼叫 `l(→預期l.ogn(（ug）3iPad maxouchPi st**:設定mxTocots > 1`，呼叫 `l 預期呼叫lifflgn（bug）
Expected Cnxpls**
-行動裝置上lifflogn被呼叫，而非windwotion.hrf`被設定為深層連結
- 這確認了 ug的根本原因：`login( 未區分裝置類型
###Fix Checking

Gal: 驗證修正後，所有行動裝置輸入都深層連結而非iff.gin()`。

**Psedocod**
``
FORALL inpWHERE isBugCodition(input)DOut := l_fxd(inpt) ASSERT wiow.ocation.hrf = "l://app/{IFF_ID}"
  ASSERT liff.lNOTclled
ENDFOR
```

###reservonecki

Goal:驗證修正後，所有桌面裝置輸入仍使用 ff.l{ redirectUri }。

Pseudocode:**```
FORALLinputWHERENOTBugCndion(inp)DO
 eult := login_fixd(nput)
  ASSERT li.ogin) called wi { eieci}
ASSERTNOTchanged to "..."
END FOR
``
**TestingApproach**:Propertybasedtetng適合prervion cecking，因為可以產生多種桌面U 組合，確保所非行動裝置情境都維持原有行為。

**TestPl**: 產生隨機桌面 UA 字串（不含 iPone/d/iPod/Andd 且 maxTouchPoits ≤ 1），驗證 `ff.logi(被呼叫。
TestCas:
1. **Desktp ChomePreraton**:UA= CheDeskt + mxTochPoint = 1 → `lff.login() 被呼叫2Deskto Fix Peservation: UA = Frefox Deskto + maxTuchPoins=0 → `liff.login()` 被呼叫
3. **Deskto Sfai Prervatn**: A=Saai Desktp + axTouchPoints = 0 →`ff.ogin() 被呼叫Standalone ModePreservation:桌面PWAstaon→liff.logi({ reirctUr: ri } 被呼叫###Unt Tst

- 測試 `() iPhone UA 下設定window.locationhrf為e://app{LIFF_ID}`
- 測試 `ogn()  Androd UA下設定window.loaonhref 為line://ap/{F_ID}`
- 測試 `lgin 在 iPad（maxTouchPoints>1）下設定`window.location.href`為`line://app/{_}`- 測試 `logn()` 在桌面UA下呼叫l.lgin({ ediecU }`
- 測試`log()`在`iitialized.vale = fase 時不執行任何動作

### Property-Based Tests
- 產生隨機行動裝置 UA（含 iPhone/iPad/iPod/Android關鍵字或maxTouchPoints>1），驗證深層連結被
-產生隨機桌面A（不含行動裝置關鍵字且 maxTochPoints ≤ 1），驗證 `liff.ogin(被呼叫產生隨機e` 組合，驗證桌面模式下 `redirctUri正確組合

###ntegrationTests
-模擬完整行動裝置登入流程：按下登入→深層連結觸發→INEAppWebView開啟→initiff()→yncBakendLg()- 模擬桌面完整登入流程按下登入 →.login()` → →Broadcsnl →登入同步-驗證TheHead.vue`的登入按鈕在行動/桌面裝置上觸發正確的登入方式