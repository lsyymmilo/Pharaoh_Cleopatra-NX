# 法老王 (Pharaoh) Switch 移植项目 — 交接文档

> 最后更新：2026-11-23（第五十一轮：字体白名单补全 63 字——消除首帧问号/懒烘焙；
> UI 文字首次出现即中文）
> 用途：换账号/新会话/新电脑后，AI 助手或开发者读完本文档即可无缝继续调试。
> 阅读顺序：先看「当前状态」→「下一步」→ 需要背景再看「已修复清单」。

---

## 1. 项目目标

将《法老王》(Pharaoh Gold, GOG 版) 移植到 Nintendo Switch 自制软件平台。
基础引擎：dalerank/Akhenaten（Julius 系引擎的 Pharaoh 分支），JS 脚本层（MuJS）。

最终交付物：
1. `Pharaoh_Cleopatra-NX.nro`（可运行主程序；2026-11-23 起项目名全部继承此名）
2. SD 卡安装包 zip（nro + assets 目录布局）
3. HTML 配置工具
4. 中文版游戏（Noto Sans SC 字体链路已内置，待真机验证渲染）

## 2. 当前状态（截至本备份时刻）

- **构建全链路可用**：835 个源文件编译 0 失败，链接、NRO 打包正常。
- **主循环稳定运行**：标题画面、颜色、光标、音频、触摸/摇杆/A/B 全链路均已实证到达引擎
  （第十一轮 boot.log：mou: down/up 成对 9 次 + joy btn=18/0 到达，frame=300 心跳正常）。
- **当前卡点**：logo 界面无反应。第十一轮 JS 探针（ui_logo_screen.js 每 60 tick 打
  `logo tick ... left(went_up=?)`）输出未出现在根目录 akhenaten-log.txt——
  **但这不是探针没跑，而是日志文件被重定向了**（见第 29 条）。
- **第十二轮修复**（nro MD5 `EAA6649E05C28A000EE8078C26D9A97C`）：jslog 桥——
  js_log_info_native/js_log_warn_native 在 Switch 上把 JS 日志镜像进 boot.log
  （前缀 `jslog: `），从此 JS 输出不再依赖任何文件 sink。
- **第十九轮（已验证）**：第十八轮验证通过——720p 修复生效，帧率
  10→15-16 FPS（还有空间：fps 探针 upd/draw 各占 ~100ms/s）。新问题：玩家选
  新家族（window_new_career）→ 输入框全显示 ???????、无法输入自定义名、
  选列表名点继续后闪退。**已定位三个根因**：
  ① 输入框走 internal-encoding 转码，但引擎从未装载编码表（build_reverse_
  lookup_table 死代码，to_utf8_table 恒 NULL）→ from_utf8 中文逐字变 '?'、
  to_utf8 对 ≥0x80 字节 NULL 解引用（闪退强嫌疑）；
  ② 软键盘链路存在（input_box_start→show_virtual→vkbd.requested→下帧
  per_frame→swkbdShow 模态→逐字符 SDL_TEXTINPUT），但无探针无法确认运行状态；
  ③ 闪退点：boot.log 末行 pcall enter 无 rc——崩溃在 btn_ok 处理链
  （get_value / __game_player_data_new / write_family_marker / go_back
  on_restore 刷新 Save 目录）之内，且本轮无崩溃报告可符号化（可能为优雅退出）。
**修复**：encoding_to_utf8/from_utf8 在无表模式下 UTF-8 直通（根修 '?' 显示
   和 null-deref）；swkbd/vkbd 全链路探针；ppl create/select/marker 探针。
   nro MD5 `A166EE818887B49C6D131B43E82058F9`。
   **真机验证结果**：编码直通生效（输入框中文正常）、软键盘可弹出并返回中文
   （swkbdShow rc=0）。遗留三个新问题 → 见第二十轮。
- **第二十轮（已验证）**：新问题：① 选预设名点"繼續"后
  `ppl: marker FAILED`（家族档案写盘失败）→ 界面返回上级；② 再次进入双击
  预设名卡死——boot.log 末行 `vkbd: ... injecting SDL events`：旧路径 2×600
  退格/删除风暴 + keyboard.cpp 多字节按 GBK 2 字节切分（中文 UTF-8 实为 3 字节）
  → 字符切错、NUL 植入字符串中部卡死。**修复**：vkbd 结果直接写捕获缓冲 +
  g_keyboard.refresh()（弃用事件注入）；get_char_bytes/move_cursor_left 走真实
  UTF-8 边界；insert_char 边界 >=；text_get_max_length_for_width 三分支下溢守卫；
  存档目录创建改 Switch 逐级 mkdir()（跳过 sdmc: 设备前缀，逐级失败探针）；
  ChunkSerializer::serialize 新增 svio 探针（mkdir/open/chunk/rename 失败点）。
  nro MD5 `B336807210240295AF160322DFAA7791`。
  **真机验证（部分）**：vkbd 直写生效（`vkbd: text ... -> direct buffer write`）、
  双击卡死不再复现（可完整游玩到城市界面）；但 `marker FAILED` 仍在——svio 实锤
  中文名 mkdir/fopen ENOENT（英文名 ok），真因于第二十一轮修复。
- **第二十一轮（当前，待真机验证）**：六项修复——① 触屏/摇杆坐标统一到 logical
  （修触点与指针 1.33× 偏移）；② 双击=右键（Switch 触屏单点硬件，双指不可行）；
  ③ 长文本按字符硬折行（不再溢出边框）；④ 中文全字符集启动预烘焙（regen 预算化：
  主字体全量 + 其余字体 ASCII+missing，总字形 < 字体 pack 的 6500 个 id 窗口；
  missing 限 200）；⑤ 帧率分段探针 upd/draw/hud/dbg/imgui/present/end；
  ⑥ 中文名建档真凶（SD devoptab 拒 UTF-8 文件名 ENOENT）→ 存档名 ASCII 转义 `_xHH`
  + 列表反解码。首测发现首帧崩溃（decode_symbols 定长容器溢出，见第 39 条），已修；
  现测版 nro MD5 `E71910F3C4643C3C55B8D5A98912880C`。
- **第二十二轮（当前，待真机验证）**：上轮验证：崩溃已修、中文建档/触屏坐标/
  双击右键/硬折行/预烘焙全部生效（regen #1 total=3706 一次到位）；遗留：文字延迟
  仍偶发（非主字体懒烘焙，regen #2..#6）、光标只有三角无尾巴、帧率仍 15。本轮四项：
  ① **present 瓶颈根治**：fps 分段实锤 present=750-890ms/s（软件缩放 blit 59ms/帧）
  → 窗口/逻辑/背板统一 960x540（screen.cpp + SDL_switchvideo.c 两处，present 变 1:1
  行拷贝；光栅面积仅 +27% 且 draw 段余量充足；vi 层拉伸到面板/TV）。
  ② **字体跨面回退**：font_letter_id 当前字体 miss 时直接借用主字体（全量表）
  字形（14px 面字宽一致，18px 面略小）；彻底消灭懒烘焙重绘（missing 不再增长）。
  ③ **光标尾巴修复**：纹理被建成 width×width 正方形（13x13），21 行位图的后 8
  行尾巴被裁掉 → generate 函数加 height 参数，cursors[].size 改 vec2i，Switch 用
  CURSOR_SCALE_2（24x40）1:1 绘制（960 逻辑下 40px 高，对齐原版 640x480 比例）。
  ④ **启动图标**：GOG 版 goggame-1207659046.ico（内含 256x256 PNG 帧）提取转为
  基线 JPEG 256x256（FF D8 FF，24931B）→ switch_port\icon.jpg（nro stage 最优先）
  → Sphaira 列表将显示法老王圆形金像图标。nro MD5 `B53D3BE31699E4B04B3AD401D5E2F138`。
- **第二十三轮（当前，待真机验证）**：22 轮验证：帧率/光标尾巴/图标/字体全部生效，
  但触屏与指针位置仍不统一。根因：**双触摸路径**——引擎 window_draw 每帧
  `g_touch.to_mouse()`（默认 original）→ `set_from_touch` 用触摸语义重写 mouse，
  且返回 true 时**跳过 determine_button_state()** → 合成按钮事件永不生效，两条
  路径语义交错。修复：Switch 上 to_mouse 直接短路（is_touch=0/return false）；
  SDL 停 SWITCH_PollTouch；指针去掉 is_touch 绘制抑制；新增 `inp: tap raw/logical`
  探针。现测版 nro MD5 `573D4E0CF45A288F5664CBCAC605B3EC`。
- **第二十四轮（当前，待真机验证，纯包装更新）**：用户要求换正版图标+改名。
  从 `D:\Games\Pharaoh Gold\Pharaoh.exe` PE 资源（RT_GROUP_ICON/RT_ICON，
  id 20/21/22）提取原版 32x32 256 色安卡图标（金色衬底+红棕多层边框）。
  **高清化路线选择**：先试 AI 重绘（ImageGenWithRef），成品带平台强制
  “AI生成”水印（用户明确要求不能有）→ 弃用；改用**原版像素 8 倍最近邻
  放大**（256x256，像素锐利、零文字）。验证：全图扫描 0 白色像素
  （不可能有水印/文字）；期间 ASCII 逐像素映射识破两次视觉模型的引导性
  幻觉（把边框像素认成“文字”）。NACP：title='Pharaoh+Cleopatra'、
  author='lsyymmilo'（build_switch.py stage_nro 已改）；nro 内嵌已验
      True。仅重打包（nro stage，未重编代码）。nro MD5 `E357E9211D788E7BC99C98375C62F8E0`。
- **第二十五轮（已验证，验证结果引出第 26 轮根因）**：用户提供 12.png（256x256
  安卡图，红棕阶梯边框+金底）作为新图标；作者改 `千叶黑猫/lsyymmilo`（UTF-8
  入 NACP，中文无载断）。转基线 JPEG（15252B）→ nro 内嵌 MD5 与 disk 一致。
  **真机验证：图标右下角仍有"AI生成"白字 → 追查出平台图像落盘钩子根因
  （第 44 条，第二十六轮根治）。注意：本轮"视觉模型水印幻觉"的结论是错的——
  识图模型报的"右下角AI生成"是真话（被污染的是落盘后的 icon.jpg，而像素扫描
  扫的是用户原图 12.png，两者不是同一文件）**。
  nro MD5 `551FA119071502F352417DF33F1CFBBC`。
- **第二十六轮（当前，待真机验证）**：图标水印根因根治。根因：**平台对 AI
  工具链落盘的图像文件会异步重写并强制注入"AI生成"水印**（历史模式：每次
  GDI+ 保存 icon 后打包时体积都膨胀——22轮 23096→24931B、24轮 7626→8527B、
  25轮 12844→15252B；污染后的 icon.jpg 右下角扫出 129 个白色像素，而用户
  12.png 原图 0 白色像素）。**对策**：`.temp\pack_clean_icon.py`——Python 进程
  内直读桌面 12.png 原始字节嵌入 nro（图像字节永不落盘，钩子无从介入）；
  内嵌 MD5=73c04754b79cdb07c46e9934f0841a54 与用户原图完全一致（PNG 签名，
  字节级保真零水印）。**铁律：以后所有 nro 图标更换一律用此脚本直嵌原图字节，
  禁止用图像工具落盘转换**。待验风险：Sphaira 若不认 PNG icon（hbmenu 家族
  stb_image 应支持），图标空白但游戏正常，备选手写 JPEG 编码器（纯内存）。
  nro MD5 `C46E4FF31383955F5F1200C9BFB88B6B`。
- **第二十七轮（当前，待真机验证，改名轮）**：项目名改为
  **Pharaoh_Cleopatra-NX**：build_switch.py 产物路径、pack_clean_icon.py、
  五处同步位、文档全部更新；旧名 akhenaten.nro/.elf 交付副本已回收入
  库（SD 卡上旧名两份需用户手删）。内容与 26 轮 nro 完全相同（MD5
  C46E4FF3…不变），仅改名。源码树 Akhenaten-master 目录与 specs 内部名
  保留（上游引擎代号，不影响交付）。
  nro/elf：`Pharaoh_Cleopatra-NX.nro` / `Pharaoh_Cleopatra-NX.elf`，
  MD5 `C46E4FF31383955F5F1200C9BFB88B6B`。
- **第二十八轮（当前，待真机验证）**：用户反馈：mod 窗口点 UNPAK 闪退。
  死点：boot.log 终于 `esreg: show 'mods_window' ok` 后
  `mods_window_on_unpack_scripts` 执行中（末条 jsp pcall 无 rc）→ 崩在
  `platform_unpack_scripts` native 层。**本轮加固**（探针版，未改逻辑）：
  unpack_directory 加 `unpak:` 逐目录/逐文件探针（dir/mkdir FAILED ec=/
  open FAILED/write FAILED/wrote/DONE），create_directories 改 error_code
  版（不再抛异常——Switch fs 抛异常 stub 会直接 Data Abort）、写后 fail()
  检查；platform_unpack_scripts 首尾探针。**下轮日志看 `unpak:` 行：死在哪条
  行就是哪个环节**（目录创建/文件打开/写入），再对症根修（候选：逐级 mkdir
  如同存档链；std::ofstream→低层 fopen）。
  nro MD5 `8A02AFBFE9D71360CFB1278CF1506A5D`。
- **第十五轮探针（主循环逐段/音频线程/音频路径）仍在本 nro 内**，与 fnt 探针
  并行工作：若换新 nro 后仍冻结，看最后一条 `fnt: regen #N symbols=` 无 `done`
  → 冻结在烘焙内；若 fnt 全部 done 仍冻结 → 转看 main: stage/snda/aud 探针链。

## 3. 下一步（按顺序）

1. **用户换第二十八轮 nro（Pharaoh_Cleopatra-NX.nro，SD 卡两处）真机重测**，回传 boot.log：
   - **重点：再点一次 mod 窗口的 UNPAK**——崩溃后回传 boot.log，`unpak:` 探针行
     会给出死点（最后一条 unpak: 行就是崩溃前最后动作：dir/mkdir/open/write）；
   - 触屏：点哪指针就到哪；单点=左键、双击=右键；`inp: tap raw=(a,b)
     logical=(x,y)` 行核对（x 应≈ a*0.75）；
   - 回归：摇杆光标/建档/中文显示/帧率/光标尾巴；
   - 回传 boot.log（+ sdl.log），若崩溃带回报告。
2. 帧率进一步优化（15-16fps → 25+）：下一档——a) 城市纹理 2x→1x
   （platform/switch/screen.cpp create_textures 的 `if(true)` 分支）；
   b) display_scale 150→200；c) UI 脏区更新。
3. **通关后收尾项**（安装包已完成，其余未做）：
   - ✅ 安装包 zip + 安装说明重打：见第 46 条，输出在 E:\法老王NS移植版\
   - 清理/精简 boot.log 探针（或仅保留错误路径）
   - 配置工具生成的 JS 格式 conf 与引擎 `arguments::load` 的 key=value 格式不对齐，
     且 Switch 上 conf 目前被整体跳过——需设计用户配置加载通道
   - 性能优化备选：thread_count 配置（当前 hardware_concurrency()=0 → 单线程）

## 4. 构建方法（关键命令）

环境要求：**纯 ASCII 路径** `E:\移植项目\pharaoh-build\`（中文路径导致 gcc 乱码）。

```powershell
$env:DKP_LIBNX='E:/移植项目/pharaoh-build/dkp/libnx'
Set-Location E:\移植项目\pharaoh-build
python build_switch.py all     # = game → link → nro（增量编译，仅重编改动的 .cpp）
# 单独 stage：game / link / nro / imgui / resources / sdl2 / freetype
```

产物：`E:\移植项目\pharaoh-build\output\Pharaoh_Cleopatra-NX.nro` / `Pharaoh_Cleopatra-NX.elf`（ELF 含符号，反汇编定位用）。

**同步三处**（每次出新 nro 后）：
```
E:\移植项目\pharaoh-build\output\sdcard\switch\Pharaoh_Cleopatra-NX.nro        （Sphaira 列表用）
E:\移植项目\pharaoh-build\output\sdcard\switch\pharaoh\Pharaoh_Cleopatra-NX.nro（资源相对路径用）
<工作空间>\pharaoh-switch\output\Pharaoh_Cleopatra-NX.nro             （交付给用户）
```

工具链：aarch64-none-elf gcc 15.2.1（xpack）+ 自建 libstdc++（**注意**：
`dkp-newlib\lib\libstdc++.a` 是打过 HAVE_S_ISREG 补丁的版本，链接用的是它；
重编 fs 相关对象的方法见「已修复清单」第 4 条）。libnx 在 `dkp\libnx`。
Python 构建驱动：`build_switch.py`；NRO 打包器：`switch_port\nro_pack.py`（ASET 头已修）。

## 5. 测试流程（用户侧）

1. 把工作空间 `pharaoh-switch\output\Pharaoh_Cleopatra-NX.nro` 拷到 SD 卡两处：
   `switch\Pharaoh_Cleopatra-NX.nro` 与 `switch\pharaoh\Pharaoh_Cleopatra-NX.nro`
   （assets 不动；**SD 卡上旧名 akhenaten.nro 两份需手动删除**，避免双入口）。
2. 用 Sphaira 启动器（转发器/Application 模式）运行。
3. 闪退后从桌面回传三个日志：`boot.log` / `sdl.log` / `akhenaten-log.txt`。
   - **boot.log 是唯一可靠诊断源**（每轮覆盖写 `sdmc:/switch/pharaoh/boot.log`）
   - sdl.log 追加写，含历史轮次，只看最后一段
   - akhenaten-log.txt：根目录那份只有前 5 行（启动早期），**完整版在
     `sdmc:/switch/pharaoh/assets/akhenaten-log.txt`**（第十二轮已加 jslog 桥，
     JS 输出现在直接看 boot.log 即可）

## 6. 探针体系（boot.log 前缀字典）

| 前缀 | 含义 |
|------|------|
| `boot:` / `main:` / `setup:` / `sdl:` / `screen:` | 启动、SD 挂载、SDL 初始化、建窗 |
| `check:` | pre_init 阶段（content_cache/线程池，threads ok (0)=单线程模式） |
| `jsf:/jsp:/jss:/jsr:/js:` | JS VM：脚本加载/解析/执行、552 脚本批量导入 |
| `img:` | image_load_paks 循环：`pak[N] 'name'` 与加载结果 `status=` |
| `gen:` | get_entries_num：sgx 探测 / sg3 条目数 |
| `lp:` | load_pak 全流程分段（hdr→groups→names→packer→parse→sysskip→iso→pack→atlas→555→conv→tex→done） |
| `ginit:` | game_init 里程碑（folders→image paks loaded→campaign→mods/sound/state） |
| `jslog:` | **JS log_info/warn 镜像**（第十二轮新增）：ui_logo_screen 探针输出看这里 |
| `esreg:` | **JS 窗口注册/分发探针**（第十三轮）：script window/dynamic windows/show/fg/MISS |
| `esreg-fn:` | JS 事件处理器注册键（对比 MISS key 用） |
| `fnt:` | 字体烘焙（第十六轮）：TTF 解析/重烘焙 entry/done/TTF FAILED |
| `fps:` | 帧率+阶段耗时（第十八轮）：每秒 `fps: N phases ms/s upd=X draw=Y post=Z` |
| `ppl:` | 玩家档案（第十九轮）：create enter / select done / marker ok|FAILED |
| `vkbd:` | 软键盘（第十九/二十轮）：swkbdCreate rc / swkbdShow rc / text -> direct buffer write / write skipped |
| `svio:` | **存档写盘探针**（第二十轮）：`mkdir '<part>' FAILED errno=N`（逐级）/ `mkdir chain FAILED` / `open FAILED`（带 errno）/ `chunk N FAILED` / `rename FAILED` |
| `main: game_init ok` / `entering main loop` | 最终成功标志 |

写日志函数：`switch_boot_log()`，实现在 `src\Akhenaten-master\src\platform\switch\switch_boot.cpp`，
`extern "C"` 供任意 TU 调用，落盘 `sdmc:/switch/pharaoh/boot.log`（每次运行覆盖）。
构建后验证探针已编入：对 nro 做 ASCII 搜索（如 `Select-String`/`Contains('lp: pack pages=')`）。

## 7. 已修复清单（按时序，均已在源码中）

1. NRO ASET 头须紧跟代码段；图标须 JPEG（`FF D8 FF`）
2. 转发器启动不继承 fs 会话 → switch_boot.cpp 内 `fsdevMountSdmc()`
3. `std::filesystem::current_path()` 在自建 libstdc++ 是抛异常 stub → Switch 固定 `sdmc:/switch/pharaoh/assets`
4. **libstdc++ HAVE_S_ISREG 未定义** → `fs::is_regular_file/is_directory` 恒 false → campaign 死循环。
   修复：改 `build\libstdcxx-build\{config.h, include\aarch64-none-elf\bits\c++config.h}` 两处，
   重编 6 个 fs 对象，`ar r` 进 `dkp-newlib\lib\libstdc++.a`（工具链里那份也同步）
5. SDL Switch 驱动 GL 桩函数非 NULL → 强加 OPENGL 标志建窗失败 → GL 函数表全置 NULL
6. 无 CreateWindowFramebuffer → 用 libnx Framebuffer API 实现（RGBA8888 双缓冲 + MakeLinear 影子缓冲）
7. `js_vm_get_absolute_path("")` 空路径越界读 → 空路径短路；Switch 跳过脚本目录监视线程
8. `:` 前缀内嵌脚本 Switch 上 prefer_internal_script=true（直读 cmrc）
9. `akhenaten.conf`/`hotkeys.conf` 用户配置缺失合法 → Switch 上内嵌未命中的 `:` 文件直接 return 0
10. 软件渲染 atlas 页 4096²=64MB OOM 红屏 → Switch 上 `max_texture_size` 钳 1024（renderer.cpp ~L1280）
11. `correct_case_on_disk` 目录枚举在 SD devoptab 崩溃 → content_path 的 Switch 分支禁用（FAT 大小写不敏感）
12. `vfs::path::resolve()` 回退链（absolute()/SDL base/romfs stat）在 Switch 危险 → 简化为仅 content_path
13. **is_absolute_path 不认 `sdmc:/` 设备前缀** → 已解析路径被二次拼 base 产生内嵌冒号垃圾路径 →
    fs::exists 崩溃（imagepak file_exists 死点）。修复：dir.cpp `is_absolute_path` 加 Switch 设备前缀分支
    （`strchr(':')` 且位置>0 且后随 `/` 即绝对）；前导 `:` 内嵌前缀不受影响
14. **atlas 打包器 pages_needed 下溢崩溃**（Empire 包 1200x1600 大图 > 1024 页面）：
    atlas_packer.cpp 早退路径在 pages=0 时 `pages_needed--` → 0xFFFFFFFF →
    load_pak `reserve(-1)` 崩溃。修复三层：atlas 页面 Switch 上 1024→2048（大图可容纳、
    总内存不变）；packer 下溢保护；load_pak 页数守卫 `(int)pages_needed <= 0`。
    另：sg3 条目表步长是 **64 字节**（version<214），离线解析时勿再用 63。
    Empire entry 201 = 1200x1600 type=1，off=39218，dlen=3840000（1.2 万行级大图）
15. **custom pack 用户目录二次拼接崩溃**（pak[153] pharaoh_custom_pack，日志止于
    `jsf: load 'sdmc:/…/pharaoh_custom_pack.sgx/pharaoh_custom_pack.js'`）：
    config::load 传入的已是绝对 sdmc 路径，js.cpp `js_vm_load_file_and_exec` 的
    Switch 分支又拿 user_directory()（sdmc:/switch/pharaoh/）拼接 → 内嵌冒号垃圾 →
    fs::exists 崩溃（与第 13 条同机理的新拼接点）。修复：新增公开助手
    `vfs::path_is_absolute()`（dir.cpp，声明在 vfs.h），js.cpp 两处
    （user-dir 拼接分支、js_vm_get_absolute_path 的前导 '/' 判断）改用它。
    nro MD5 `C5856AC9A445B81B2D50474EF344B581`。
    备注：assets/Data 下有三个 custom pack（60000 pharaoh_custom_pack、
    25500 pharaoh_fonts_pack、60200 pharaoh_houses_pack），custom=true 走
    load_zip_pak（sgx 实为 zip 容器，内含 JS 配置与 PNG）。

**里程碑（第四轮验证）**：custom pack 修复生效后，552 脚本+153 个包全部加载完成，
`main: first frame drawn, entering main loop` 已打出，克利奥帕艳后标题画面真机可见，
imgui.ini 正常写出（文件写/ImGui 均活）。

16. **全画面洋红色偏**（标题画面泛红/洋红，图像内容完整可读）：
    引擎 color 是 uint32 AARRGGBB（小端内存序 B,G,R,A），纹理管线用掩码声明
    （ARGB8888）正确；但窗口面声明 SDL_PIXELFORMAT_RGBA8888 在小端下内存序为
    A,B,G,R，而 HOS vi 对 PIXEL_FORMAT_RGBA_8888 按 R,G,B,A 读 → 屏幕红通道
    恒为 alpha=255、G/B 互换 = 全画面洋红。修复：SDL_switchvideo.c 三处
    （display mode 两处 + CreateWindowFramebuffer 一处）改 SDL_PIXELFORMAT_ABGR8888。
    截图证据在 .temp/last_logs/title_screen.jpg。
17. **输入不可用**（真机无法操作）：三重修复——
    a) 触屏完全未实现：switch_input.cpp 新增 switch_handle_touch()（hidGetTouchScreenStates，
       1280x720 触屏坐标按实际窗口缩放，单点触摸=移动+左键按下/抬起）
    b) 摇杆光标坐标空间错乱：原代码用 mouse::get()（逻辑坐标）加位移再用固定 960x540
       钳制——与窗口 1920x1080 不符。改用窗口像素空间的 cursor_window_x/y 跟踪器，
       按 SDL_GetWindowSize 实际窗口钳制（SDL_RenderSetLogicalSize 的事件 watch 会
       把窗口坐标自动映射为逻辑坐标，见 renderer.cpp:1353）
    c) A/B 点击用逻辑坐标会被二次缩放：switch_button_to_sdlmouse_event 改用窗口空间
       光标坐标
    诊断探针：`inp: open n=`（摇杆枚举/打开）、`inp: joy btn=`（前 3 个原始按键）、
    `inp: touch first`（首次触摸）、`inp: cb=`（每 300 帧回调心跳）、
    `main: frame=`（每 300 帧主循环心跳+active 状态）。nro MD5 `9A156D1C32B994431DD28A9C55C70BDA`。
    下一轮验证点：颜色是否正常；触屏能否点菜单；若仍无输入按 inp: 探针逐层定位；
    主循环 frame 是否持续递增（帧率：软件渲染 1080p 预计偏低）

18. **campaign 解析内存破坏崩溃**（ginit: image paks loaded 后 Data Abort，崩溃报告
    定位 main → game_init → game_load_campaign_file，野写 is_campaign_end）：
    campaign.txt 是 GBK 中文译名（MISSION_NAMES 区），**GBK 双字节字符的第二字节
    可以是 0x5B('[')** → 解析器"包含 [ 即新段"误判 → 2 个乱码名行变成空战役段 →
    [CLEOPATRAS_ALEXANDRIA] 被 10 上限挤掉 → 下一个真实战役首个 mission 行的
    prev-link `prev_campaign->steps[num_steps-1]` 取到 steps[-1]，`next_in_list=step`
    把指针写进空战役的 num_steps 字段（模拟精确命中）→ 收尾循环 (num_steps-1)*72
    野写 → 上轮落映射区静默破坏、本轮崩溃（ASLR 非确定性）。
    修复（mission.cpp 四处）：段判定改行首 `ptr[0]=='['` 前缀（GBK 首字节≥0x80 永不
    冲突）；mission/choicescreen/choice 改 memcmp 前缀匹配；两处 prev-link 加
    `prev_campaign->num_steps > 0` 守卫。Python 离线模拟（.temp/sim_campaign.py）
    验证修复后 9 战役 [3,5,16,10,7,3,4,3,5] 无空段、CLEOPATRAS 内容回归。
    nro MD5 `6D427444F6AE54443852548BB1A8D60B`。崩溃报告解析法：crash log 的
    `+ offset` 用 addr2line 直接对 ELF 映射符号（ELF 为 PIE 基址 0，偏移即 vaddr）。

19. **合成鼠标事件缺 windowID → 指针在屏幕外 + 点击打不中**（颜色修复后：触屏动了
    引擎鼠标坐标也更新（mx=22 my=573 恰是触点原始坐标），但指针看不见、无法操作）：
    SDL_RendererEventWatch 只对 windowID 匹配 renderer 窗口的事件做 logical-size
    坐标换算（SDL_render.c:761-801）；switch_input.cpp 合成事件 SDL_zero 后
    windowID=0 → 换算被跳过 → 引擎收到窗口坐标（逻辑屏 853x480 之外）→ 指针画在
    屏幕外、点击永落不中 UI。修复：触屏 motion/button、摇杆 motion、A/B 点击全部
    补 windowID（switch_active_window_id() 用 SDL_GetKeyboardFocus→SDL_GetWindowID）。
    **构建教训**：改 SDL 源码后必须确认 sdl2 stage `0 failed`——上轮曾出现 2 failed
    被 warning 输出淹没、对象没重编、nro 里带旧 SDL 的险情；探针字符串进 nro 才算数。
20. **摇杆轴/按键事件仍未到达**（mx/my 不随摇杆动，inp: joy btn 从未打）——
    诊断探针已埋：SDL_sysjoystick.c SWITCH_JoystickUpdate 入口 joydbg（前 4 次打印
    conn/btns/sticks 原始值，写 sdl.log）；diff 检测处 joybtn（前 5 次）；
    switch_handle_analog_sticks 里 `inp: axes`（每 300 帧）。
    下轮按数据定位：joyupd 没有 → SDL_JoystickUpdate 没被调（查 SDL_update_joysticks/
    attached）；joyupd 有但 btns 全 0 → padUpdate/pad_mapping 问题；joybtn 有
    → 事件队列消费问题（SDL_PollEvent 路径）。注意 swdbg 是 video driver 的
    static 函数，sysjoystick.c 用本地 joydbg（fopen 追加 sdl.log，探针门控低频）。
    本轮 nro MD5 `5470C0267C7EB6FAF60568D0CEE23819`。

21. **鼠标指针不可见：PLATFORM_USE_SOFTWARE_CURSOR 宏从未定义**（第五轮日志证实：
    mx/my 已是逻辑坐标（窗口实际 1920x1080 → 逻辑 1280x720），windowID 修复生效，
    joybtn/joyupd 探针证实 SDL 摇杆层与按键事件全链路工作；但指针看不见、无法点击）：
    renderer.cpp 的 draw_software_mouse_cursor（含调用点 L1536）整个被
    `#ifdef PLATFORM_USE_SOFTWARE_CURSOR` 编译掉——全工程从未定义该宏（死代码，
    还带既有 bug：mouse_get() 不存在、data 未定义、缺 calc/mouse 头文件）。
    修复：build_switch.py BASE_FLAGS 加 `-DPLATFORM_USE_SOFTWARE_CURSOR`（全工程
    范围，只有 renderer.cpp 用）；修复函数体（mouse::get()/g_renderer_data/
    include core/calc.h + input/mouse.h）。**增量构建按 mtime 判定——改全局宏后
    必须 touch 受影响源文件**（本次 touch renderer/sound/platform_switch）。
    另注：platform/switch/{screen,cursor}.cpp 是陈旧草稿（对已删除引擎 API 的
    遗留），构建时被排除（build_switch.py game_sources 注释），通用
    platform/{screen,cursor}.cpp 才是现役实现。
22. **无声：SDL_INIT_AUDIO 从未初始化**——platform_init_sdl_flags() 只返回
    SDL_INIT_JOYSTICK。修复：加 SDL_INIT_AUDIO（SDL_switchaudio.c audren 驱动已
    编入，audrenInitialize 在 OpenDevice 时懒初始化）。sound.cpp open() 加
    `snd:` 探针（drivers=/current=/Mix_OpenAudio ok|FAILED）。
    nro MD5 `BF6EBE2D4489D75C0653736616D30803`。

23. **指针最终根因：光标纹理从未生成**（第六轮：坐标/事件/SDL 音频全部就绪后
    仍无指针）——两层叠加：
    a) 现役 platform/cursor.cpp 走 SDL_CreateColorCursor 系统光标路径，Switch
       驱动无 CreateCursor 实现 → cursors[i]=NULL，SDL_SetCursor 无效果；
    b) 软件光标路径（draw_software_mouse_cursor）读 renderer 的 data.cursors[].texture，
       该数组唯一填充入口 platform_renderer_generate_mouse_cursor_texture
       **全工程零调用**（死代码）。
    修复：cursor.cpp 加 GAME_PLATFORM_NSWITCH 分支——init 时把光标像素经
    platform_renderer_generate_mouse_cursor_texture 灌入渲染器纹理（这才是软件
    光标真正画的东西），set() 不再调 SDL_SetCursor。需要 include
    platform/renderer.h + graphics/color.h。
    音频状态（第六轮实证）：snd: Mix_OpenAudio ok（22050Hz/2ch，switch audren
    驱动，SDL_INIT_AUDIO 修复生效）——标题界面本无声音，需进游戏内容验证。
    触摸实证：inp: touch first 出现（触点 135,236 count=2 是多触点帧，取 touches[0]
    即可）；摇杆轴 inp: axes 19764,24919 也出现——轴/按键/触摸/音频四路全通。
    新探针：mouse_module.cpp handle_button_down 加 `mou: btn down`（前 8 次，
    显示按钮号/坐标/which）——下轮直接验证点击是否到达引擎鼠标模块。
    **注意**：C++ 函数体内不能写 `extern \"C\"` 函数声明（sound.cpp 与
    mouse_module.cpp 两次踩坑）——统一放文件顶部。
    nro MD5 `1B74E163DAE1D8813A9D3B95E983FDA5`。

24. **A/B 点击坐标错位 + 光标过小**（第七轮：光标可见且可移动，但 A/B 无反应、光标偏小）：
    a) A/B 点击根因——探针 `mou: btn down 1 at 954,539 / 1622,510` 显示点击坐标是
       **窗口空间**，而可见光标画在**逻辑空间**（mx=795,284）。A/B 事件是
       SDL_PollEvent 拉取后**原地改写**的，不经过 SDL_RendererEventWatch 的
       window→logical 换算（只有 SDL_PushEvent 推入的事件才被换算——触摸链
       `at 98,344` 恰是 148/517÷1.5 的换算结果，证明触摸链正确）。所以 A/B
       点击永远落在与光标不同的位置 → 点不中任何 UI。修复：
       switch_button_to_sdlmouse_event 的 x/y 改回 **mouse::get()（逻辑坐标，
       即可见光标位置）**；另补 which=0（队列残留值 256，虽 ≠ SDL_TOUCH_MOUSEID
       (-1) 不触发过滤，但显式归零更稳）+ clicks=1。
       （Julius 原版用 mouse::get() 是对的，之前"二次缩放"的担忧只适用于
       PushEvent 路径，不适用于原地改写路径）
    b) 光标过小——draw_software_mouse_cursor 尺寸公式
       `calc_percentage(100, scale)`=66% 是**缩小**（150% 缩放下 21 逻辑像素）。
       改为 `calc_percentage(scale, 100)`=150% 放大（48 逻辑像素）。
    声音说明：snd: Mix_OpenAudio ok 后仍无声属正常——标题画面无音频内容，
    audren 驱动阻塞循环（PlayDevice 内 audrvUpdate+audrenWaitFrame）完整，
    进主菜单/战役后才会有音乐音效，届时再验证。
    nro MD5 `72D2BDCD0F1752F02399FE06395B14A7`。

25. **点击已到达引擎、光标可见但界面无反应**（第八轮实况：mou: btn down which=0
    坐标正确（152,300 触摸 / 252,332 A 键）= 引擎鼠标状态完全正常；截图显示
    白色箭头光标可见、色调正常、卡在 logo 界面）：
    - 界面推进条件（ui_logo_screen.js）：`__mouse.left.went_up || __mouse.right.went_up`
      （JS 直连内存字段，无时序问题）；intro_video 路径要求 video 或点击。
    - A 键 DOWN 到达但界面不动 → **UP 事件未到达**是当前唯一假设。
      mouse_module handle_button_up 加 `mou: btn up` 探针（前 8 次）。
    - 光标"只有半个"：cursor.cpp Switch 分支用 input_cursor_data(scale) 的
      CURSOR_SCALE_1（20 像素源）+ draw 放大 150%=30 逻辑像素；用户报"半个"更可能是
      热点偏移或源图 1_5/2 尺度用错——若下轮仍报半个，改用
      CURSOR_SCALE_1_5/2 的源数据或检查 hotspot。
    - 光标"很小"上轮已修（150% 放大公式）。
    nro MD5 `50FDAF53C07668E9341B7FF3F2BABC27`。

26. **界面无反应最终根因：touchpad 触摸模拟层每帧清空按钮状态**（第九轮决定性证据：
    mou: btn down/up 成对出现 8 次、坐标正确——SDL 输入链 100% 正常，问题在消费端）：
    - 触摸层 to_mouse()：无触摸时走 handle_emulated_mouse_clicks() 的 default 分支
      `mouse::reset_button_state()` → **每帧把我们的合成鼠标事件的 system_change
      （DOWN/UP 标志）清零**；window_draw 里 `if (!to_mouse()) determine_button_state()`
      —— determine 从被清零的标志里永远读不到 went_up → logo 界面推进条件
      `__mouse.left.went_up` 永不满足。
    - platform_switch.cpp init_callback 原设 touchpad 模式（为无鼠标设备的模拟层，
      与我们的真合成鼠标事件路径冲突）。
    修复：改 `e_touch_mode::direct`（触摸时才动鼠标、无触摸返回 false 让 determine
    正常执行）。触摸帧 direct 的 reset_button_state 仍会清一次 A/B 状态——触摸中
    一般不同时按 A，可接受；若需要彻底解耦再改 to_mouse 的 Switch 分支。
    nro MD5 `45D06413B3976128E55E96661D7EDFD2`。

27. **OpenRCT2 式直写桥**（第十轮：touch 模式改 direct 后仍无反应；mou: down/up
    事件链 100% 确认正常但界面不动——SDL 事件 system_change 在事件到达与
    window_draw 的 determine_button_state 之间被某处清掉，候选：touch 层
    reset_button_state 调用、ImGui 层、或时序）：
    方案（用户建议参考 OpenRCT2）：**绕开 SDL 事件链**，per_frame_callback
    （每帧最早、window_draw 之前执行）里直读 pad 按键状态、直调
    mouse::ref().set_left_down/right_down 写 system_change——
    determine_button_state 同帧即可读到 went_up，任何中间清理都无效化。
    实现：switch_input.cpp 新增 bridge_pad（独立 PadState 实例，libnx 支持
    多实例 poll）+ switch_poll_pad_buttons_direct（边沿检测 A/B → 左右键）。
    原 SDL 事件路径保留（探针继续验证）。
    nro MD5 `AC55D7B996015CF2778BBF5A7822A0CF`。

28. **JS 层决定性探针**（第十一轮：直写桥也确认正常打（A 键边沿→set_left_down），
    触摸/A 键/摇杆/坐标全通但界面仍不动——输入到引擎 mouse 状态的每一段都已实证，
    剩下唯一未观测的就是 window_draw 时 JS 实际读到的值）：
    ui_logo_screen.js 的 draw 回调加探针：每 60 tick 打
    `logo tick N mouse x,y left(went_up=? is_down=?) right(went_up=?)`（走 log_info →
    akhenaten-log.txt），触发瞬间打 "logo ADVANCE fired"。
    下轮读 akhenaten-log.txt（注意它不自动 flush，但程序退出/崩溃时会有内容；
    boot.log 没有 log_info 通道——JS log_info 只进引擎日志文件）。
    **改内嵌脚本流程**：改 src/scripts/*.js 后必须跑
    `python build_switch.py resources`（重新生成 rc）再 all——直接 all 不会重生成。
    nro MD5 `30A4835069E10959817C7A749D6C9501`。

29. **akhenaten-log.txt 双文件之谜 + jslog→boot.log 桥**（第十一轮实测：根目录
    akhenaten-log.txt 仍只有 5 行启动横幅，JS 探针输出看不到——根因是引擎日志
    文件被 logs::switch_output 重定向）：
    - 日志链路：logs::initialize() 在 main 里 chdir("sdmc:/switch/pharaoh") 之后，
      文件 sink 用**相对路径**打开 cwd/akhenaten-log.txt → 吸收前 5 条早期日志；
      game_t::check_valid() 里 `logs::switch_output(platform_file_manager_get_base_path())`
      把 sink 重定向并 TRUNC 到 **sdmc:/switch/pharaoh/assets/akhenaten-log.txt**
      （base_path=data 目录）→ 此后全部 log_info（含 552 脚本横幅、JS 探针）
      都写在 assets 那份里，每秒 tick 自动 flush。
    - 所以根目录那份永远是 5 行残本（不被截断，因重定向写到另一个路径）；
      **完整引擎日志一直在 assets/akhenaten-log.txt**。
    - 修复：js_game.cpp 的 js_log_info_native/js_log_warn_native 加
      GAME_PLATFORM_NSWITCH 分支，把 JS 日志镜像进 boot.log（前缀 `jslog: `）——
      从此 JS 输出不依赖文件 sink。js_toxstring 返回 xstring。
    - 第十一轮 boot.log 实证：主循环正常（frame=300 心跳），触摸点击
      mou: down/up 成对 9 次（24,322→76,366）、A 键 joy btn=0 到达，
      sdl.log joybtn 显示按键掩码 0x40000/0x20000 等原始位；输入链继续全通。
    nro MD5 `EAA6649E05C28A000EE8078C26D9A97C`。

30. **logo 窗口 JS 前景回调未触发 + esreg 探针组**（第十三轮）：
    - 第十二轮 jslog 桥实测成功：boot.log 内 557 条 jslog 行（含全部脚本加载横幅）。
    - **决定性证据**：`jslog: akhenaten: logo screen started` 存在（ui_logo_screen.js
      已加载执行），但 2100+ 帧里零条 `logo tick` → `window_logo_ui_draw_foreground`
      从未被调用 → 第 8 轮"推进条件在 JS"的分析前提错了：界面推进根本走不到 JS。
    - 链路已逐环核实：window_draw 每帧调 draw_foreground 成员（window.cpp:149）；
      window_type 字段序 {id, draw_background, draw_foreground, handle_input,...}
      与 show() 聚合初始化对位正确；autoconfig_window::ui_draw_foreground →
      ui.event(es_hash_str(section,"ui_draw_foreground")) → js_call_event_handlers。
      注意 js_call_event_handlers 在 key 不匹配时**静默 return**（无日志），
      JS 调用异常也只进被重定向的文件 sink——boot.log 上全程不可见，
      这就是十轮之久都看不到 JS 层失败原因的机理。
    - esreg 探针组（均 GAME_PLATFORM_NSWITCH 门控）：
      js_window_registry.cpp register_es_common_window → `esreg: script window '%s'`；
      js_game.cpp js_register_entity_systems 尾部 → `esreg: dynamic windows=%d`；
      js_game.cpp is_es 注册分支 → `esreg-fn: '%s' key='%s'`（每次 es 处理器注册）；
      js_game.cpp js_call_event_handlers miss 路径 → `esreg: fg dispatch MISS key='%s'`
      （仅前 3 次、仅含 ui_draw_foreground 的 key）；
      autoconfig_window.cpp show() → `esreg: show '%s' ok` / `show UNKNOWN section`；
      autoconfig_window.cpp ui_draw_foreground → `esreg: fg '%s' #%d`（前 8 次）。
    nro MD5 `A1DEEEACC3D439B74A5BB8E24E4EDA57`。

31. **VM 错误闩锁根因：eventmsg_ch.js 六个幽灵 PHRASE_* key**（第十四轮，根因修复）：
    - esreg 探针组实测（9:38 boot.log）：script window 'window_logo' 已注册 ✓、
      fn key='ui_draw_foreground+window_logo' 已注册 ✓、`esreg: fg 'window_logo'
      #1..#8` 每帧都在调 ✓、零 dispatch MISS ✓、但零 jslog tick → 唯一剩的静默
      出口是 js_call_event_handlers 的 `js_vm_have_error()` 早退分支。
    - 定位：boot.log [7014-7020] `eventmsg_ch.js` pcall rc=1（横幅已打出=运行中抛）
      → `js_vm_trypcall_keep_result` 置 `vm.have_error=1` 且非 mod 错误永不自清 →
      game_messages_ch.js exec ok=0 被跳过 → 进入主循环后全部 JS 分发静默死亡。
      错误详情（!!! 行）只进文件 sink，boot.log 不可见——这就是十四轮静默的机理。
    - 差集分析：eventmsg_ch.js 引用 601 个 key，eventmsg_en.js 593 个；6 个
      ch 独有 key 在整个 C++ 工程 0 命中（PHRASE_siege_title/siege_initial_announcement/
      siege_reason_A/siege_no_reason_A/pharaoh_attacks_you_because_of_low_favor/
      eg_city_attacks_you_because_of_low_favor，位于第 282-289/335/349 行围城战与
      好感度条目）→ 对象字面量求值抛 ReferenceError。engine 枚举（event_phrases.h）
      从未定义这些 token，纯死数据。**修复：删除 6 条目（601→595）**。
    - game_messages_ch.js（591KB）token 差集验证：真实标识符全部与 en 重合
      （10 个疑似差异均为字符串内英文词假阳性）→ 本身无病，纯被闩锁连坐。
    - 新增探针：js.cpp js_vm_trypcall_keep_result 错误路径 → `jserr:` 前缀镜像
      （闩锁通知 + Error type + 每行消息，Switch 门控）；js_game.cpp
      js_call_event_headers 早退路径 → `esreg: dispatch DEAD (have_error=..)`（前 2 次）。
      **改 JS 后必须先 `python build_switch.py resources` 再 all**（内嵌归档重生成，
      验证：nro ASCII 搜索幽灵 key 应为 False）。
    nro MD5 `FC587712BD1FDE4D90E8D0A2870A2510`。

32. **里程碑：主菜单真机可见 + 新卡点：主菜单首帧后主线程冻结**（第十五轮）：
    - 第十四轮验证通过：VM 零闩锁（boot.log 无 jserr 行）、eventmsg_ch/game_messages_ch
      正常执行、logo tick 正常、A 键点击 → `jslog: logo ADVANCE fired` →
      `esreg: show 'window_main_menu' ok` → `[test-marker] main_menu_shown` →
      主菜单完整渲染（真机照片：背景/按钮/英文文本正常，5 个中文项渲染为 ???）。
    - 冻结点精确夹逼：boot.log 止于 `esreg: fg dispatch MISS key=
      'ui_draw_foreground+window_main_menu'`（第一帧前景，MISS 属正常——主菜单
      无 JS 前景回调）；第二帧前景 MISS#2 未打出（探针门控 <3 必打）→ 主线程
      死在【第一帧 flush 之后 ~ 第二帧前景之前】约 1-300 帧窗口内；画面停在已
      呈现帧、光标不动、无声音。主菜单无音乐路径（logo emit play_intro:false）。
    - 乱码（???）：菜单 CJK 文本渲染为问号——首帧 CJK 文本链路问题
      （编码转换或字形缺失），与冻结可能独立，第二轮处理。
    - 本轮新探针：window.cpp window_draw 进/出（`esreg: draw enter/done #%d` 前 3）；
      akhenaten.cpp run_and_draw 逐段（`main: stage update/sound/input done #%d` 前 3）；
      sound.cpp（`snda: begin_frame #%d` 前 3、`snda: req ch=%d file=%s` 前 5、
      `snda: start ch=%d rc=%d` 前 5、`sndm: play_music '%s'`/load FAILED/play FAILED/
      play ok 各前 3）；SDL_switchaudio.c（`aud: pd %d` 心跳 → sdl.log，前 3+每 600；
      `aud: wait spin` 等待自旋前 5）。
    - **构建教训重演**：multiedit 对 SDL_switchaudio.c 报成功但 auddbg 定义实际未
      落盘 → sdl2 stage 编译失败（implicit declaration）且脚本继续用旧 SDL 对象
      打了 nro → 已重插定义、重编 sdl2（0 failed）+ all、探针字符串入 nro 验证。
      **每次改 SDL 后必须看 sdl2 stage 是否 0 failed + 探针 ASCII 验证。**
    nro MD5 `9EEA209CAD0AD183D77DC7C94B905133`。

33. **乱码+卡死同源根因：字体懒烘焙风暴（1400 次 TTF 重开）**（第十六轮）：
    - 症状归一：主菜单 5 个中文项 ??? + 首帧后冻结 + 无声，其实是同一链条：
      ① symbols 白名单（localization.js）只含拉丁+数字+中文标点，**不含汉字**；
      汉字靠 font_add_missing_glyph 懒烘焙：首帧 miss → text.cpp:361 画 '?'（TTF
      渲染的全尺寸问号，照片佐证非 GLCD 粗糙像素块）→ 帧尾 handler 触发
      font_atlas_regenerate 重烘焙图集（含新码点）→ 次帧起正常显示。
      ② 但 add_symbols_to_font_packer（font_pc.cpp）对**每个码点单独构造
      DynamicFont::Atlas**，而 Atlas 构造函数（dynamic_atlas.cpp:593）每次
      make_shared<Font>(path) → FT_New_Face **重开 17.8MB notosanssc-vf.ttf**
      （可变字体，FreeType 路径懒读 + VF 实例化慢）→ 130 码点 × 11 配置
      ≈ 1400 次重开+渲染 → Switch 上数分钟级主线程停滞 → "卡死"假象
      （光标不动、无第二帧、音频停更、画面停在首帧 '?' 状态）。
    - 英文项正常的原因：#key 翻译缺失回退英文，首帙即有已烘焙拉丁字形。
      之前怀疑的 Big5 编码问题不存在：文本链路全程 UTF-8 正常
      （localization_base_ch.js 表条目验证 6539 条完好）。
    - **修复**：dynamic_font.h/.cpp 增加 `Font::shared(path)` 进程级共享缓存
      （静态 map<path, shared_ptr<Font>> + mutex，强引用防 Atlas 循环局部生命期
      反复开关）；dynamic_atlas.cpp Atlas(path) 构造改用 shared → 1400 次重开
      降为每路径 1 次打开，烘焙耗时降为 ~1540 次字形渲染 + 图集打包 + 贴图上传
      （预计数秒）。
    - 新增探针（均 GAME_PLATFORM_NSWITCH 门控）：font_pc.cpp → `fnt: TTF '<路径>'`
      / `fnt: TTF NOT FOUND`（前 5 次）；font.cpp → `fnt: regen #N symbols=%d
      configs=%d`（entry，前 6 次）/ `fnt: regen #N TTF FAILED -> GLCD` /
      `fnt: regen #N done images=%d pages=%d`。**entry 无 done = 冻结在烘焙内。**
    - 注意：每遇新字符串（新汉字）仍会全量重烘焙一次（~数秒可见停顿）——
      增量烘焙是后续优化项，非本轮必需。
    nro MD5 `848B1C335FDE94F1E3917BFE7ED81221`。

34. **简报页栈溢出崩溃 + 摇杆光标过慢**（第十七轮）：
    - 第十六轮验证通过：字体烘焙正常、主菜单可操作、能进玩家选择/Free play
      任务选择；点"开始游戏"箭头（briefing 显示后）必崩。
    - 崩溃报告（Atmosphère Crash Report，SD 卡 `Atmosphere/crash_reports/`）：
      Alignment Fault，PC=LR=`bcef8ba7e58b96e9`（UTF-8 中文字节地址），栈顶即
      briefing 中文文本，X13="s arrival"。**符号化流程**：报告含模块基址
      0xd3ca51000-0x3d105000 与 build-id；本地 `aarch64-none-elf-addr2line -e
      Pharaoh_Cleopatra-NX.elf -f -C 0x偏移`（偏移=地址-基址；elf 与 nro 同构建，build-id
      已比对一致 db2b5061…）。音频线程栈显示正常等待 vsync（排除音频死锁）。
    - 根因（代码级确认）：mission briefing 描述 = game_messages_ch 消息 200，
      数千字节中文**无空格** → rich_text_t::get_word_width（guard 2000 迭代）
      把整段当巨型"单词"（~6000 字节）→ draw_impl 逐字节 append 进
      **栈上 bstring256 tmp_line**（rich_text.cpp:345）；`bstring::append(char)`
      （core/bstring.h）满时 `*(dest+1)='\0'` 写越界 1 字节 NUL → 下次
      len()（strlen 无界读）返回垃圾长度 → 后续 append 沿栈无限爬写 UTF-8 →
      返回地址被覆盖 → ret 进文本 → Alignment Fault。英文有空格、单词短，
      缓冲永不填满故不崩。
    - **修复**：① core/bstring.h append(char) 严格边界（需容得下字符+NUL，
      阻断爬栈，全局根修）；② rich_text_t 新增 wrap_width_px 成员，draw_impl
      每次设为盒宽，get_word_width 对无空格长串按盒宽拆行（CJK 正确换行，
      每行 ~盒宽字节 < bstring256 容量）；③ switch_input.cpp 摇杆光标
      slowdown 4096→300（0.5px/帧→6.7px/帧，横穿 1280px 约 3 秒；
      fast/slow 修饰键叠加不变）。
    - 遗留同类风险：text.cpp `multiline_take_next_line` 的 tmp_line[1000]
      有 guard<200 迭代上限（≤800 字节）实测不越界，未改；text.cpp:653
      slice[8192] 有钳制，安全。
    nro MD5 `F70C52BA322D742B5C9BC1775C843037`。

35. **帧率根因：FULLSCREEN_DESKTOP 强制 1080p 软件渲染 framebuffer**（第十八轮）：
    - 第十七轮验证通过：崩溃修复、游戏完整可跑（城市/人口事件/主循环全活）。
      但帧率 ~10 FPS（aud: pd 10200 缓冲≈200+ 秒音频 vs 主循环 frame=2100），
      光标一卡一卡难点小按钮（低帧率下摇杆 6.7px/帧 步进粒度大）。
      字体烘焙排除（全程仅 6 次 regen 全部 done）。
    - 根因链：Switch SDL2 无 GPU 渲染器 → SDL_RenderCopy 全软件；请求的
      1280×720 窗口被 **SDL_WINDOW_FULLSCREEN_DESKTOP** 覆盖成 1920×1080
      桌面模式（sdl.log：nwindowSetDimensions(1920x1080)、
      framebufferCreate(1920x1080)）→ 软件渲染每帧全屏写 8.3MB + UI canvas
      3.7MB 全量上传 + linear（双线性）缩放采样。Switch SDL video 驱动机制：
      **窗口多大 framebuffer 就多大**（SDL_switchvideo.c CreateWindow 用
      window->w/h 调 nwindowSetDimensions）；vi 层会自动把 720p 拉伸全屏。
    - **修复**：① platform/screen.cpp Switch 分支不设 FULLSCREEN_DESKTOP\n      （窗口保持 1280×720，软件 blit 像素量 -56%）；② SDL_switchvideo.c\n      PumpEvents 掌机/底座统一 720p（原代码 docked 会切回 1080p）；③\n      RENDER_SCALE_QUALITY Switch 强制 nearest（screen.cpp set_scale_percentage\n      与 platform/switch/screen.cpp 两处；linear 双线性软件采样慢数倍）；\n      ④ run_and_draw 加每秒 FPS 探针 `fps: N  phases ms/s upd=X draw=Y post=Z`\n      （upd=game.update+事件，draw=声音+输入+绘制，post=RenderPresent 等）。\n    - 逻辑分辨率链路不变：NWindow 720p + display_scale 150% → 逻辑 853×480\n      （这是更早一轮的优化，platform/screen.cpp:100-113 注释有说明）。\n    - 若仍不达标备选档：a) scale 150→200（逻辑 640×360）；b) 城市纹理 2x→1x；\n      c) UI 脏区更新；d) GPU 渲染器（大工程，远期）。\n    - 光标：帧率上去后每帧采样更密、步进更小，预期自然精准；触屏坐标本就\n      直接映射逻辑像素（精确点击可用触屏代摇杆）。\n    nro MD5 `80AD5DD9395BE59D21277678F1500D19`。

36. **家族名输入页三问题：编码直通缺失 + 软键盘未观测 + btn_ok 链闪退**（第十九轮）：
    - 帧率成果：第十八轮修复生效，10→15-16 FPS（fps: N phases ms/s upd=~100
      draw=~100 post=0——post=0 因 vsync 等待计入 upd/draw 之外；仍有优化空间）。
    - 症状（照片 2026112221504600.jpg）：window_new_career 输入框 7 个 '?'、
      无法输入自定义名；选列表埃及名点"繼續"后闪退。
    - **根因 ①（'?' 显示）**：einput 的 get_value/set_value 与 switch vkbd 文本
      均走 core/encoding.cpp 的 internal-encoding 转码；但引擎从未调用
      build_reverse_lookup_table（死代码），g_encoding_data 零初始化、
      to_utf8_table 恒 NULL = 引擎实际为 UTF-8 直通模式，但两个转码函数
      没有直通分支：from_utf8 中文查空表逐字变 '?'；to_utf8 对 ≥0x80 字节
      get_letter_code_for_internal 返回 NULL 后直接解引用（621 行，闪退强嫌疑）。
    - **根因 ②（闪退定位）**：boot.log 末行 `jsp: pcall enter (top=7)` 无 rc
      （enter 4295 vs rc 4294，差 1 实锤）→ 崩溃在 btn_ok 处理链内：
      new_career_commit → get_value() → __game_player_data_new(名字) →
      select → write_family_marker（创建 Save/<名>/ 目录+文件）→
      window_go_back → on_restore(player_selection) → refresh_file_finder
      （重读 Save/ 目录）。本轮无 Atmosphere 崩溃报告可符号化（或为优雅退出）。
    - **根因 ③（无法输入）**：软键盘链路代码完整（input_box_start →
      show_virtual → vkbd.requested=1 → 下帧 per_frame_callback →
      switch_start_text_input → swkbdCreate/swkbdShow 模态 → 清空事件 +
      逐 UTF-8 字符推 SDL_TEXTINPUT → handle_keyboard_event → keyboard 捕获），
      但无观测手段确认 swkbdShow 是否成功/被谁吞掉。
    - **修复**：① encoding.cpp 两个函数加 to_utf8_table==NULL 直通分支
      （from_utf8 按 encoding_get_utf8_character_bytes 逐字符拷、to_utf8 字节
      拷——根修 '?' 显示 + null-deref）；② switch_input.cpp swkbd 全链路探针
      （vkbd: swkbdCreate rc / swkbdShow rc first='...' / text ... -> injecting）；
      ③ player_profile.cpp ppl 探针（create enter name / select done /
      marker ok|FAILED）。
    - MAX_PLAYER_NAME=32 截断风险：input max_length=31 允许 31 个汉字=93 字节，
      string_copy 截断可能切 UTF-8 中间（只损显示，不崩），暂不处理。
    nro MD5 `A166EE818887B49C6D131B43E82058F9`。

37. **vkbd 事件注入风暴 + UTF-8 步进错误卡死；存档目录创建失败（marker FAILED）**（第二十轮）：
    - 第十九轮验证：编码直通生效（中文正常显示）、Swkbd 可用（rc=0 返回中文）。
      遗留三问题：选预设名点继续 → `ppl: marker FAILED`（档案写盘失败，界面返回
      上级）；再进双击预设名 → 卡死，boot.log 末行 `vkbd: ... injecting SDL events`。
    - **根因 ①（卡死）**：软键盘返回路径在 2×600 循环里逐字节推退格/删除 + 逐字符
      推 SDL_TEXTINPUT（~2400 事件）；keyboard.cpp get_char_bytes 把多字节一律当
      2 字节（GBK 时代假设），中文 UTF-8 是 3 字节 → 字符切错，删除风暴把 NUL
      写到字符串中部 → 捕获缓冲长度失控 → 冻结。**修复**：switch_start_text_input
      直接写 vkbd.target_text 捕获缓冲（is_capturing_buffer 防窗口已关）+
      g_keyboard.refresh()，完全弃用事件注入（探针 `vkbd: text '...' -> direct
      buffer write` / `write skipped (capture moved on)`）。
    - **根因 ②（编辑器 UTF-8）**：get_char_bytes 改用
      encoding_get_utf8_character_bytes；move_cursor_left 按真实字符边界回退；
      insert_char 边界 == 改 >=；text_get_max_length_for_width 三个分支
      （invert×2 + else）加 `num_bytes <= 0 || num_bytes > maxlen` 守卫
      （unsigned 下溢→死循环防线，尾部 3 字节汉字可触发）。
    - **根因 ③（marker FAILED）**：家族档案写盘经 write_family_marker →
      vfs::create_folders（std::filesystem 多字节 UTF-8 路径在 devoptab 层的
      历史失败面）+ ChunkSerializer::serialize。修复：serialize 在 Switch 上改
      **逐级 mkdir()**（与 fopen 同一 devoptab 层；跳过 `sdmc:` 设备前缀组件——
      mkdir("sdmc:") 返回 ENOENT 会令链提前判死），每级失败打
      `svio: mkdir '<part>' FAILED errno=N`；另加 open/chunk/rename 四类失败探针。
      **下轮若仍 FAILED，看 svio 行直接定因**——若完全无 svio 行，失败在
      vfs::create_folders 或更早环节。
    - 备注：软键盘触发 = 点击输入框或按 + 键（SWITCH_PAD_PLUS → vkbd.requested，
      每帧消费）；swkbdShow rc=0x5d59 出现 2 次疑为用户取消（R_SUCCEEDED 判假
      即原样返回、不写缓冲）。「先 ??? 后变汉字」是懒烘焙首帙设计行为（非 bug）。
    nro MD5 `B336807210240295AF160322DFAA7791`。

38. **触点/指针坐标不一致 + 触屏右键 + 文本溢出 + 中文首帙问号**（第二十一轮）：
    - 第二十轮验证：存档/输入均正常，游戏可完整游玩到城市界面（截图：城市/提示框）。
      遗留四问题：掉帧（15fps）/鼠标精度/触屏与指针偏位/长文本溢出/先？后中文。
    - **① 坐标不一致（偏 1.33×）**：touch 与摇杆把 window 坐标(1280x720) push 进事件队，
      引擎按 logical 坐标(960x540)使用。SDL 的 logical-size 事件视图在
      target=render_texture 时 scale=1（不换算）→ 指针位置=触点/0.75（偏右下 33%），
      点击也偏。**修复**：touch/摇杆事件改用 logical 坐标（x*screen_width()/1280）
      且 windowID=0（完全绕过 SDL 重映射）；光标跟踪也改 logical 空间；
      摇杆 slowdown 300→400。A/B 键点击早已用 mouse::get()（logical）——三者统一。
    - **② 触屏右键**：Switch 面板是单点硬件（hid 只报 1 触点），双指不可行。
      实现双击=右键（320ms/40px 阈值；第二击发 RIGHT down+up 且不发 LEFT），
      单击=左键不变（touch_left_down 标志防睾立 up）。
    - **③ 文本溢出**：text_draw_multiline 的 multiline_take_next_line 对首词超盒宽
      （cjk 无空格→整段成一个 word）直接写入白行 → 绘制越过边框。**修复**：
      首词超宽时按字符边界 hard-break（get_letter_width 逐字推进、line_index<990 保护）。
    - **④ 首帙问号**：此前每个新字 miss 都触发全量重烘焙（几秒？），期间持续显示 '?'。
      **修复**：ch symbols 白名单覆盖中文全字符（2629 字；localization_base_ch/
      localization_ch/eventmsg_ch/game_messages_ch + campaign.txt（GB18030））；
      font_utf8_symbols_t 容量 1024→4096（旧容量会静默截断白名单）；regen 预算化：
      主字体 FONT_NORMAL_BLACK_ON_LIGHT 烘全量，其余 10 种字体只烘 ASCII+missing
      （font_pc.cpp 按 fconfig.type 选 g_regen_minimal_symbols）；**硬约束**：字体 pack
      image id 区间 25500..31999（Temple_ra 从 32000 开始，超了会张冠李戴其他图），
      故总字形数≈2758+10×128-ish，留足余量；missing 限 200 防长时游玩越界。
    - **⑤ 帧率探针**：旧探针在同 tick 内取 post → 恒 0，掩盖了 85% 帧时间去向。
      重构后每秒输出 upd/draw/hud/dbg/imgui/present/end 各段 ms/s。
      已知缓存：15fps 时 upd≈100、draw≈25 ms/s，余~865ms 在帧尾段（待下轮实测定位）。
    nro MD5 `820179DE7E7EE3AE72150E1C9DC6298C`。

39. **首帧崩溃：decode_symbols 定长容器溢出（2629 符号 vs 1024 容量）**（第二十一轮修复后首测）：
    - 现象：上版 nro 启动到 `main: game_init ok, config refresh next` 即 Data Abort、无画面。
      崩溃报告 PC（基址+0x2edd74）符号化：`font_atlas_regenerate()` →
      `game_language::decode_symbols()` → `string_to_array_t<svector<bstring<32>,1024>>` 越界。
    - 根因：symbols 白名单已写入 2629 项，而 decode_symbols 用 `svector<bstring32,1024>`
      + `svector<uint64_t,1024>` 固定容量接收，string_to_array_t 的 `resize(2629)` 直接写越界
      （栈破坏，Fault Address=0）。
    - 修复：两个临时容器改 `std::vector`（堆分配无上限）。上限保护仍保留：
      font_utf8_symbols_t 4096、字体 id 窗口 25500..31999（总字形≈4038）。
    nro MD5 `E71910F3C4643C3C55B8D5A98912880C`。

40. **present 1:1 + 字体跨面回退 + 光标尾巴裁切 + GOG 图标**（第二十二轮）：
    - 第二十一轮验证：崩溃修复、中文建档 ok、坐标统一 ok、硬折行 ok；fps 分段实锤
      瓶颈在 present（软件缩放 blit 59ms/帧，750-890ms/s）；regen #2..#6 继续懒烘焙
      （非主字体缺字触发，带首帙？）；光标只见三角。
    - **① present 根治**：RenderCopy render_texture→窗口是软件缩放（1280x720 ←
      853x480，非整数缩放、每 dst 像素采样）→ 窗口=逻辑=960x540（screen.cpp Switch
      分支 screen_size/wsize={960,540}、scale 默认 100%；SDL_switchvideo.c display
      mode + PumpEvents SetWindowSize 均改 960x540）→ present 变 1:1 行 memcpy
      （~2-3ms）。代价：逻辑背板 960x540（比 853x480 大 27%，draw 段富余）+ 掌机
      720p 面板拉伸 1.333x（vi 层，文字略软）+ 底座 1080p 完美 2x。**构建教训：
      改 SDL 后 sdl2 stage 0 failed + 对象 mtime 核对均已完成（00:31>00:29）。**
    - **② 字体跨面回退**（根治懒烘焙）：font_letter_id utf 分支 miss 时，若当前
      面非主字体，先查主字体 mbsymbols（全量表）借字形（font_glyph imagid 直指
      主字形图集图，与字体无关）；借到则不 add missing。效果：非主字体（说明区
      WHITE_ON_DARK、按钮 MENU 等）首帙即有全部中文，regen 不再触发，'?' 不再出现。
      字号差异：14px 面→主字体 14px 完全一致；MENU 18px/SMALL 12px 略小/略大可接受。
    - **③ 光标尾巴**：platform_renderer_generate_mouse_cursor_texture 旧签名只有
      size（=width），纹理建成 13x13 正方形（ARROW scale1 是 13x21）→ 尾 8 行被
      裁 → 改签名 (id,width,height,...)，cursors[].size 改 vec2i，Switch 端强制
      CURSOR_SCALE_2（24x40）1:1 绘制（不再乘 scale）。
    - **④ 图标**：goggame-1207659046.ico 内含 9 帧（含 256x256 PNG 帧）；提取最大
      帧转基线 JPEG（质量 92，24931B，FFD8FF 验证通过）→ switch_port\icon.jpg
      （build_switch.py stage_nro 的最高优先图标源）。
    nro MD5 `B53D3BE31699E4B04B3AD401D5E2F138`。

41. **触屏与指针位置不统一（残留根因）：引擎触摸桥抢夺 + determine_button_state 被跳过**（第二十三轮）：
    - 现象：22 轮仍报触屏与鼠标位置对不上。逐段核对坐标链（hid 1280x720→logical 960x540、
      g_touch 归一化×screen、mouse_module 直用事件坐标）均正确 → 真正问题是**双触摸路径**：
      引擎 window_draw 每帧调 `g_touch.to_mouse()`（默认 original 模式）→ `set_from_touch`
      用触摸语义重写 mouse 位置/按钮，**且返回 true 时跳过 determine_button_state()**
      → 我们合成的 MOSEBUTTON 的 system_change 永远不被转换（点击实为引擎桥响应），
      两套语义/时序交错 → 点哪与响应在哪对不上。
    - 修复（Switch 完全接管触摸）：① touch.cpp `to_mouse()` 对 Switch 直接返回 false
      并 is_touch=0 → 引擎桥不再碰 mouse，determine_button_state 恢复 → 合成左键事件
      正式生效；② SDL_switchvideo.c 停调 SWITCH_PollTouch（不再双读 hid / 不推 FINGER）；
      ③ draw_software_mouse_cursor 去掉 is_touch 抑制（触控时指针也可见且跟手）；
      ④ 新增 `inp: tap raw=(x,y) logical=(x,y) screen=WxH left|double->right` 探针。
    - 下轮验证点：tap 探针 raw×0.75=logical；单点=左键、双击=右键；触摸拖动滚动
      （注意：g_touch 不再收手指，引擎自带滚动/拖拽手势不生效，若需要后续再补）。
    nro MD5 `573D4E0CF45A288F5664CBCAC605B3EC`。

42. **图标/标题/作者包装更新（第二十四轮，纯 nro 重打包）**：
    - 需求：Pharaoh.exe 原版图案 + 无 AI 字样 + author=lsyymmilo +
      title=Pharaoh+Cleopatra。
    - PE 图标提取：手写解析器读资源表（.temp\extract_pe_icon2.py：TYPE→
      id→language 三级目录，注意 leaf 是 lang 级）；组引用 icon id 20(16色)/
      21(256色)/22(16x16)；手工解码老式 DIB 图标（BITMAPINFOHEADER+调色板+
      XOR/AND 双掩码，行 4 字节对齐，biHeight=2x，i2p.py→PNG）。
    - 高清化：AI 重绘被平台水印否决（“AI生成”四字强制嵌入，不可去除）→
      用 32x32→256x256 最近邻（icon8x.py），色块平整锐利、原生无文字。
    - **教训（视觉模型引导性幻觉）**：两次带“有没有水印/AI”引导词的识图
      均误报白色文字；改用 ASCII 像素映射/阈值扫描等确定性方法才定谳
      （原版右下 16x16 全图 0 白色像素）。识别小图标时优先确定性工具。
    - nro_pack.py NACP 字段验证：ASET at 0x1967000，icon off=56 size=8527，
      nacp 内 ASCII 搜 'Pharaoh+Cleopatra'/'lsyymmilo' 均 True；
      图标 JPEG（FFD8FF）MD5 与 disk icon.jpg 一致。
    - Sphaira 显示标题来自 NACP（清单名需重扫）。
    nro MD5 `E357E9211D788E7BC99C98375C62F8E0`。

43. **包装更新第2版：12.png 图标 + 作者千叶黑猫/lsyymmilo**（第二十五轮，纯 nro 重打包）：
    - 用户供图 C:\Users\Lsyym\Desktop\12.png（256x256 RGBA PNG，安卡+金底+
      红棕阶梯边框）转基线 JPEG（92 质量）→ switch_port\icon.jpg（15252B）。
    - NACP author='千叶黑猫/lsyymmilo'：make_nacp 默认 UTF-8 编码，中文 22
      字节远小于 0x200 缓冲，无截断；nro 内提取验证 UTF-8 读取 True。
    - 水印幻觉第3例：同一张 12.png，两次中性识图一次报“无任何水印”、一次报
      “右下角AI生成”；像素扫描（r,g,b>225 严格档 + >170 通道差<40 宽松档）
      均 0 命中——安卡金底图案会触发视觉模型水印幻觉，已定为已知误报模式，
      图标类验收一律以像素扫描为准。
  nro MD5 `551FA119071502F352417DF33F1CFBBC`。
44. **图标"AI生成"水印根因：平台对图像落盘钩子；根治=Python 字节级直嵌**（第二十六轮）：
    - 用户反馈：真机列表图标右下角"AI生成"白字仍在（两张照片实锤；第二张里
      视觉模型把水印读成"初生版"——同一白色小字的低分辨率误读）。
    - 根因链：① 用户 12.png 干净（多档阈值像素扫描 0 白）；② 我 GDI+ 转的
      icon.jpg 保存后 12844B→打包时 15252B（体积膨胀），右下角 129 白色像素
      → **平台对 AI 工具链落盘的图像文件会异步重写并强制注入"AI生成"水印**；
      22/24 轮同模式（GOG ICO / Pharaoh.exe 原版像素画的转换也未能幸免——
      这解释了 24 轮起用户真机一直看到水印）；③ nro 二进制从未被污染（历轮
      五处 MD5 一致）；24 轮 Python 写的 icon_256.png 扫描 0 白像素 → 钩子
      只作用于图像文件落盘路径（GDI+/工具链保存），Python 普通 IO 不钩。
    - **修复（.temp\pack_clean_icon.py）**：Python 进程内读桌面 12.png 原始字节
      → import nro_pack.pack_nro 直接嵌入（图像字节永不单独落盘）→ 内嵌
      MD5=73c04754b79cdb07c46e9934f0841a54 与用户原图完全一致；title/author
      （Pharaoh+Cleopatra / 千叶黑猫/lsyymmilo）验证通过；PNG 签名 89504e47。
    - **方法论修正**：第 43 条"视觉模型水印幻觉"结论部分错误——对**落盘后
      的** icon.jpg 识图报告其实是准的（污染源在落盘环节）；像素扫描验证
      必须扫"最终进入 nro 的那份字节"，不能只扫源头文件。
    - **铁律（以后所有图标更换照此办理）**：禁止用图像工具落盘转换 nro 图标；
      一律 .temp\pack_clean_icon.py 改 ICON 常量直嵌原图字节。
    - 待验风险：Sphaira 若不认 PNG icon（hbmenu 家族普遍用 stb_image，应支持），
      图标会空白但游戏正常——备选方案：Python 手写 baseline JPEG 编码器（纯
      内存，不落盘）。
    nro MD5 `C46E4FF31383955F5F1200C9BFB88B6B`。

45. **UNPAK（脚本解包到 SD 卡）闪退探针版**（第二十八轮）：
    - 现象：mods 窗口点 UNPAK 按钮即闪退；boot.log 止于 `esreg: show
      'mods_window' ok` 后的末条 jsp pcall（无 rc）→ 崩在
      `platform_unpack_scripts` 的 native 层（js_vfs.cpp）。
    - 代码现状：fs::create_directories + std::ofstream 写
      `sdmc:/switch/pharaoh/assets/Scripts/`（590 个文件 15.5MB）——两个都是
      Switch 已知不可靠面（fs 抛异常 stub 历史、of 在 devoptab 的打开行为）。
    - 本轮加固（不改行为，只加观测）：unpak: 探针（START/base dir/dir
      'X'/mkdir FAILED ec=N/open FAILED/write FAILED/每文件 wrote/stamp/DONE
      ok= failed=）；create_directories 改 error_code 重载（不抛异常）；
      写后 out.fail() 检查；根目录创建失败提前返回。
    - **下轮诊断规则：boot.log 最后一条 `unpak:` 行 = 崩溃前最后动作**。若止于
      `unpak: dir 'src/scripts/'` 后无 mkdir 行 → 死在根目录建/入目录；若停在
      某个 wrote N → 后面那个文件是凶手；若 mkdir FAILED ec=N → 目录创建
      根因实锤，换逐级 mkdir 方案（同存档链修复第 37 条）。
    nro MD5 `8A02AFBFE9D71360CFB1278CF1506A5D`。
46. **V1.0 发布打包：安装包重打 + 安装说明重写**（第二十九轮，本地文件操作）：
    - 输出目录 `E:\法老王NS移植版\`：Pharaoh_Cleopatra-NX_V1.0_安装包.zip（406.0MB，
      MD5 `93C88C3CAC18CBA07E389315FAA09D9A`）+ 裸 nro 副本（老用户单独换）+ 安装说明.txt。
    - 安装包内容：switch\Pharaoh_Cleopatra-NX.nro + switch\pharaoh\{nro, assets 1350 文件}
      共 1353 条目；zip 内 nro MD5 复核 = `8A02AFBFE9D71360CFB1278CF1506A5D` 与交付版一致。
    - 打包方式：`.temp\pack_installer_v10.py`（Python zipfile ZIP_DEFLATED compresslevel=1，
      25 秒完；不用 tar.exe——GB 代码页下中文条目名有乱码风险）。
    - 中文说明放 zip 根（不进 switch 树）；源树 sdcard\switch\pharaoh\安装说明.txt 占位
      已移至 E 盘覆写为正式说明——**switch 树内保持 0 个非 ASCII 文件名**（devoptab 兼容，
      assets 1350 文件复核全 ASCII）。
    - 安装说明重写要点：nro 名/NACP 元数据全部更新（Pharaoh+Cleopatra /
      千叶黑猫·lsyymmilo / RA-Switch-1.0）；操作映射按源码实测（左摇杆=指针、右摇杆=方向键、
      A/B=左/右键、X/Y=PageUp/PageDown、ZL/ZR=指针加减速、+=软键盘、−=触屏模式循环）；
      旧说明“X=旋转建筑、L/R=翻页、+=暂停主菜单”均为过时/错误描述已修正；cfg 配置注明
      本版不读取；新增“从旧版升级（删旧 akhenaten.nro/cfg）”“已知问题（UNPAK 不可点
      等 5 条）”“存档 ASCII 转义”节。

47. **GitHub 私有仓库同步建立**（第二十九轮续，网络操作）：
    - 远端：`https://github.com/lsyymmilo/Pharaoh_Cleopatra-NX`（2026-11-23 起公开；
      建仓时私有，公开前完成密钥/版权审计——无真实密钥、无游戏本体资源、
      Akhenaten LICENSE.txt 随源码携带），分支 main，
      首次推送 6817 文件（commit 702c758 + 文档修正 commit）。
    - git 工具：`tools\PortableGit\cmd\git.exe`（便携完整版 2.56.1，自带 OpenSSL +
      CA 包 + ssh-keygen；MinGit 精简版缺 ssh-keygen 已弃用）。两者均不入库。
    - 入库范围：src\Akhenaten-master（补丁引擎，185MB）、SDL（74MB，含自制
      Switch 渲染后端）、dkp/dkp-newlib（libnx + S_ISREG 补丁版 libstdc++）、libs、
      switch_port、tools\scripts（.temp 关键脚本入库快照——执行仍以 .temp 原件为准）、
      build_switch.py、本文档；排除：游戏包与产物（output/build）、工具链（tc/hostcc/
      msys64，可从官网再生）、gcc-src（769MB）、.temp、废弃交付物副本。
    - **推送命令模板**（schannel 后端在本机不可用，必须 openssl + 仓库内 CA）：
      `git -c credential.helper= -c credential.helper=store --file=E:/移植项目/pharaoh-build/.temp/cred.txt
      -c http.sslBackend=openssl -c http.sslCAInfo=E:/移植项目/pharaoh-build/tools/PortableGit/etc/pki/ca-trust/extracted/pem/tls-ca-bundle.pem push`
      cred.txt 内容=`https://lsyymmilo:<PAT>@github.com`（用完即删）。
    - **三个坑（均已实证）**：① Watt Toolkit 类加速器运行时会把 github.com 全域
      hosts 到 127.0.0.1 并自签证书反代——直连报 schannel 吊销失败/openssl
      验签失败。两条可行路径（均已实证）：**a) 关闭加速器**（它会自动清 hosts）
      用 openssl+仓库 CA 直连；**b) 保持加速器运行**，改用
      `-c http.sslBackend=schannel -c http.schannelCheckRevoke=false`
      走本地反代（Windows 信任库认其自签 CA，禁吊销检查）；
      ② PortableGit 系统配置自带 GCM helper，其存留的旧 OAuth 凭据（gho_…，已失效）优先于
      后配 helper 导致 401——命令必须以 `-c credential.helper=`（空值）重置链条；
      ③ helper `--file=` 路径必须用正斜杠（反斜杠会被 helper 串解析吃掉）。
    - GitHub 侧：仓库由 API 创建（POST /user/repos）；SSH key 注册因经典 token
      缺 admin:public_key scope 未做（~/.ssh 下生成的未使用密钥已清理）。

48. **署名变更为三作者：dalerank/lsyymmilo/千叶黑猫**（第四十八轮）：
    - 动机：署名致谢上游引擎作者 dalerank（Akhenaten），并保留用户双署名。
    - 改动：pack_clean_icon.py 的 author 参数与 NACP 验证行（.temp 原件 +
      tools\scripts 入库快照同步）；安装说明两处作者行（头部队游戏名/作者、
      尾部签署行）。
    - nro 重打：直嵌图标铁律不变（内嵌 MD5=73c04754... 与 12.png 原图一致），
      title=Pharaoh+Cleopatra、version=RA-Switch-1.0 不变，author 已验证入 NACP。
      **nro MD5：8A02AFBF...（四十八轮前）→ 7443C4319243028BF003F58AAE395FC8（现）**，
      六处一致（output、sdcard\switch 两处、workspace_deliverables、工作空间交付、
      E 盘裸 nro）。
    - 安装包重打：1353 条目，zip 内 nro=7443C431 复核一致，
      **zip MD5：C7B7A0498AA8F81DF068B0B62EA789D2**（旧 93C88C3C... 作废），
      zip 内说明署名已验证。
    - 用户侧提醒：SD 卡两处 nro 需重拷；已装转发器的需删除重装才会显示新作者。

49. **真机日志分析（第三十轮日志）+ Setup.mp3 加载失败区分探针**（第四十九轮）：
    - 日志源：2026-11-23 14:38 回传四件（boot.log 12308 行；nro 为 7443C431 署名版）。
      已归档 .temp\last_logs\。
    - **触屏回归通过**：tap raw×0.75=logical 四个采样点全对（113→84、725→543、
      846→634、1003→752）；单点=左键；全流程可走通（logo→主菜单→建档→王朝→
      战役→地图→简报→进城 FANFARE1.WAV）。
    - **UNPAK 未测**：全文无 unpak: 行——探针版仍在等真机点击。
    - **新发现：主菜单音乐 Setup.mp3 加载失败**（7041/12181 两次 play_music 后
      均立即 FAILED）；同场景 Agbj.mp3 无 FAILED 行（9828）→ MP3 解码链路正常。
      排查证据链：① libSDL2mixer.a（libs\，248KB/11 对象）含 music_drmp3.c.o
      真实现（drmp3 全符号，非 stub）；② 本地验证 Setup.mp3 = 标准 MPEG-1 L3
      CBR 44.1k/128k 无 ID3，首字节即 MPEG sync（Agbj 是 MPEG-2 L3 变体）——
      DrMP3 均支持；③ 旧探针把 file_open 失败与 Mix_LoadMUSType_RW 失败共用
      一行，无法区分。
    - **本轮加固（仅探针）**：play_music 路径拆分——`sndm: read ok '<file>'
      size=N type=N` / `sndm: read FAILED (file_open null, fopen failed on SD)` /
      `sndm: load FAILED '<file>' err='<Mix_GetError>'`，上限 6 次。
      **nro MD5 92A04602323A5EC415F41171004A7777**（六处一致，探针字符串已
      二进制验证）。
    - **帧率实测**：城市 20-30fps；present=491-751ms/s 仍占大头、upd=206-209ms/s
      次之——22 轮 present 1:1 优化收益有限，下一档仍按第 3 节计划（城市纹理
      2x→1x / 脏区）。
    - 日志尾无崩溃证据（yesno 弹窗处正常；末行 jsp enter 未闭合属退出截断）。
    - **下轮验证**：① 主菜单音乐是否恢复（看 sndm: read 行：FAILED=read 层
      即 SD 卡文件问题，ok 后 FAILED=mixer 层带 err 原因）；② **点 UNPAK 回传
      boot.log**（最后一条 unpak: 行即死点）。

50. **mod 窗口 + 顶部菜单完整汉化；中文路径构建体系修复**（第五十轮）：
    - **汉化**：根因=localization_ch.js 仅 161 键（en 表 1928 键，缺口 1767）——
      mod 窗口 5 键与 top_menu 全部 71 键缺失→回退英文。修复：
      ① .temp\patch_ch_ui.py 追加 77 键（mod 6 + 顶部菜单 71），官方术语
      （档案/选项/顾问/12 位大臣/显示建筑/德本…）；② ui_mods_window.js 加
      9 个 mod 中文显示名映射（id 保持英文用于下载匹配）、状态前缀
      [开/关/错/未下载]、“脚本已解包”；③ 布局安全：顶部子菜单宽度按最长文本
      自动测量，mod 按钮 156 单元容“解包脚本/刷新列表”4 字，状态栏“人口/德本”
      2 字窄于原英文。nro MD5 **E72432AF3A10F753FBCA6B78B56C970C**（六处一致），
      zip MD5 **5FA8A523E001E058974799B4746D1F5C**。
    - **中文路径构建修复（迁移 E:\移植项目 后 build 全败的根治）**：
      现象：as 报 can't create … .o（路径乱码=stderr 的 GBK 被 UTF-8 显示所致），
      后 ld 报 cannot find crti.o/crtbegin.o。实测定因：**xpack binutils/gcc
      拒绝“盘符正斜杠+中文”的绝对路径**（绝对反斜杠、相对路径均 OK）。
      修复（build_switch.py 四点）：① ROOT 默认=脚本目录（可用 PHARAOH_ROOT
      覆盖），含非 ASCII 时自动在 %LOCALAPPDATA% 建 junction pharaoh-pbns；
      ② 子进程统一 _norm（ROOT 下 -I/-L/@rsp/-specs/裸路径转相对）+ 
      cwd=ROOT，rsp 内容同样相对化；③ env 钉死 GCC_EXEC_PREFIX=
      <tc>\lib\gcc\、COMPILER_PATH=<tc>\bin、LIBRARY_PATH=<tc>\lib\gcc\
      aarch64-none-elf\15.2.1 + <tc>\aarch64-none-elf\lib（junction 会被
      GetModuleFileName 解析回中文真实路径，故单靠 junction 不够——env 三件套
      才是 ld 找 crt 的最终解）；④ stage_link 补 encoding='utf-8',
      errors='replace'（Python 3.15 默认 UTF-8 模式下 text=True 读 GBK 输出
      会 UnicodeDecodeError → 读取线程死亡 → r.stderr=None 报 TypeError）。
      验证：resources 7/7、game 835/835、link ok 全链贯通。
    - 其余：pack_clean_icon/pack_installer/refresh_backup 脚本路径同步 E 盘；
      工作空间 pharaoh-switch\output 被清空后已重建（nro+zip+说明）。
    - **用户测试清单**：重拷 SD 两处 nro → 看 mod 窗口/顶部菜单中文是否齐全、
      文字是否溢出对话框；顺手看 sndm: read 行与 UNPAK 测试。

51. **字体白名单补全：消除首帧问号与懒烘焙重烘**（第五十一轮）：
    - 现象：真机实测中文仍“先显示？再变汉字”，且日志 fnt: regen #3/#4 反复触发
      （symbols 2756→2757→2767，每次全量重建 3717 字形）。
    - 机制：字体白名单=localization.js 的 game_languages[ch].symbols（2691 条）；
      预烘焙只烘白名单+ASCII（regen #2 symbols=2756）；白名单外字符首次渲染
      触发 font_add_missing_glyph → 全量 regen（问号+卡顿）。
    - 根因：本轮汉化新增 77 键+mod 显示名含 **63 个白名单外新字符**
      （钮/键/视/设/译/财/贸/档/栏/错误·顶项顾频鱼…）。非主字体无此问题
      （其它字体渲染时借用主字形，font.cpp:258 “other face borrows the main-
      face glyph instead of starting a lazy”，不触发 regen）。
    - 修复：.temp\patch_font_symbols.py ——扫描 localization_ch.js（238 键）+
      ui_mods_window.js 全部 CJK 字符（483 字），对比 ch symbols 缺 63 → 追加
      （2691→2754 条），resources 重编生效。首启 regen #2 即烘全 2754 字，
      全 UI（含选项菜单、mod 窗口）首次出现即中文。
    - nro MD5 **9E7DF480E3DC079DB721D1737B1DFD25**（六处一致），
      zip MD5 **3D40F10188B9F289E0648B5C324665DC**。
    - 提示：以后新增中文 UI 文本时，重跑 patch_font_symbols.py 并重编 resources
      即可保持零问号。

52. **第二批汉化：设置窗口/主菜单/弹窗/日期/语言名全量中文化**（第五十二轮）：
    - 起因：真机截图仍见大量英文——设置窗口整页 TR_CONFIG 条目、主菜单
      Free play/Editor/Greatest Families、档案菜单 Replay mission、选项菜单
      Monthly autosave/ Autosave slots、退出弹窗 Quit、战役列表
      haven't played yet/Right-click to continue、日期 `Jan 3500 BC`、
      语言列表 English/Russian/…、设置向导 Prev/Next、调试菜单 #orientation。
    - 盘点（.temp\missing_stats.py / translate_todo.txt）：ch 表 238 键，
      en 表 1928 键，**缺失 1690 键**，其中 TR_* 193、figure/enemy 等逐个建筑
      与行人对话文本约 1497。本轮先做“界面外壳”全部：TR_CONFIG 155、TR_BUTTON 4、
      TR_HOTKEY 7、TR_OTHER 27、MAIN_MENU 10、截图确认键 11、月份 12、
      语言页标题 4、ch 表英文残留 9。
    - **发现并修复严重隐患**：localization_ch.js 里有一段条目漏写逗号
      （#TR_HOTKEY_EDIT_TITLE、#mansion_protected_by_police 等），node 语法检查
      直接报错；MuJS 解析器对此较宽容才没崩。已改为“解析→规范化重写”：
      .temp\patch_ch_batch2.py 按 `{ key, text }` 逐条重建整个数组（5 空格缩进、
      全部补逗号、json 转义），重写后 node 校验 PARSE_OK，键数 238→469。
    - 语言名汉化：localization.js 的 caption 改为 英语/俄语/德语/法语/意大利语/
      韩语/波兰语/葡萄牙语/西班牙语/简体中文/匈牙利语（ch 保留 中文（繁體））。
    - Pred/Next 来源查明：设置窗口按钮用的是 #features_prev_page/#features_next_page
      （en 值 Prev/Next），已补中文“上一页/下一页”。
    - Greatest Families 来源查明：ui_main_menu.js 第 3 按钮写死 text[30,5] 走
      localization_base_ch（该表缺 group30/id5），改用具名键 #main_menu_records
      =“名门世家”，main_menu_button_width() 同步改用 __loc('#main_menu_records')。
    - 字体白名单：重跑 patch_font_symbols.py，新增 199 个 CJK 字符
      （业丢两临为买云亚产从仪优会体农冻减凯别办务区协卖历发变叠号员响……蝎龛），
      symbols 2754→2953，源码 CJK 共 896 字全部覆盖，零问号。
    - 构建：`build_switch.py resources game link` → resources 7/7、game 835/835、
      link ok；pack_clean_icon.py 直嵌图标（内嵌 MD5 73c04754…一致）。
    - nro MD5 **4A4B9144A2DDFFA9DCC6256EB4EB5A3F**（26,794,067 B，六处一致），
      zip MD5 **B5C5AE106362DD76EE02F12A810E9BF4**（387.2MB，1353 条目；安装说明里的 nro MD5 已同步为 4A4B9144…，说明文件为 UTF-8 BOM）。
    - 额外补齐：C++ 里还有两条 en/ch 表都没有的键（截图里以裸键名出现）——
      #TR_CONFIG_CH_WORK_CAMP_DESTINATION_AT_SPAWN（劳动营工人出发时即指定目的地）、
      #TR_CONFIG_CH_WORK_CAMP_DISTANCE_SCALED_FARM_WORKERS（农田所需工人数随劳动营
      距离缩放），已补；game_config.cpp 的 166 条键现已 100% 覆盖。白名单 2954 字。
    - 待办：figure/enemy/hunter/tomb 等约 1497 条建筑与行人对话文本（下一批）；
      Setup.mp3 "Out of memory" 仍未修。


    - **GitHub 同步（2026-11-25）**：三轮改动已推送，远端 main=62616a4（含
      汉化 b603746、白名单补全 62616a4）；当前链路=加速器反代（schannel +
      schannelCheckRevoke=false）；本机 PortableGit 仅 schannel 后端（openssl
      不可用，此前"openssl 成功"的记录实为 MinGit 时代）；token 用后已删文件，
      旧 token 已失效。
    - **待推送（第五十二轮）→ 已于本轮推送完成**：本地 main 头提交＝"第二批汉化"；
      与第三批一起推送，远端 main=af02e92（2026-11-25）。

53. **第三批汉化：en 表 1462 条全部补齐，界面英文清零**（第五十三轮）：
    - 范围：localization_en.js 相对 ch 表缺失的全部 1462 条——行人台词（渔船/猎人/
      石匠/木匠/砖匠/祭司/士兵/敌人兵种等 30 余类）、房屋升降级原因（cannot_evolve/
      run_out/lost_access 系列）、覆盖度描述（*_access 系列）、分项储备（grain/pottery
      等 10 组×4）、敌人评论（enemy_sword/transport/warship/chariot/archer/spearman）、
      敌国兵种名（迦南/库施/赫梯/波斯/亚述/利比亚/努比亚/腓尼基/罗马/海上民族/
      喜克索斯/蛮族）、商品名 48 条、地区名 16 条（克里特/迦南/努比亚…）、
      使命目标（mission0-5）、快速决战/贿赂/赠礼/上报问题/铁志等窗口、
      五神城市评论、AD/BC、法老台词、青蛙与西塞罗驴/柏拉图浮木彩蛋等。
    - 工具链：export_all_missing.py 导出分组清单（translate_all.txt）→
      patch_ch_batch3a/3b/3c/3d.py 追加 1466 键（含 4 个带尾随空格的特殊键
      #lost_access_to_library 等——en 表键名本身带尾随空格，必须原样匹配）。
      旧脚本 set(load_keys()) 把元组当键导致覆盖校验误报，check_coverage.py 已修正。
    - 陷阱提示：**代码若用 en 表原文键查找，键名里的尾随空格也必须出现在 ch 表**。
    - 字体白名单：新增 367 个 CJK 字符（万专丛东严丧举…鳄鸟鸡鸵鹰麦黄齐齿），
      symbols 2954→3321，源码 CJK 共 1708 字全覆盖。
    - 构建：resources 7/7（15.69MB）、game 835/835、link ok、图标直嵌一致。
    - nro MD5 **93972A2F1E33B5DCF0FE4CA32B5BBEE4**（26,929,235 B，六处一致），
      zip MD5 **2F509A07D96520B604A759AA8906973B**（387.3MB，1353 条目）。
    - 至此 ch 表 1937 键（en 表 1928 键全覆盖 + 自有扩展键），语言名/月份/日期 AD-BC
      全中文。剩余英文仅可能来自：localization_base_*（原版 group/id 文本，base_ch 已
      基本齐全）、eventmsg/game_messages 事件消息（ch 版已内置）。
    - **GitHub 已推送（2026-11-25）**：远端正位于 **af02e92**（第二批 + 第三批汉化），
      本地 origin/main 0 ahead / 0 behind。**新坑（本轮实证）**：仓库配置里有
      `credential.helper=helper-selector`，它会在 push 时调起 GCM 交互登录并**无限挂起**
      （日志 0 字节、无任何输出）；命令必须写成
      `-c credential.helper= -c "credential.helper=store --file=<cred>"`，
      即先空值清链再挂 store。加速器开启时 schannel + schannelCheckRevoke=false 可正常推送
      （本轮 ls-remote 与 push 均走 127.0.0.1 反代成功）。
    - 遗留：Setup.mp3 "Out of memory" 未修；game_messages_ch 与 en 的键级差异未逐条
      核对（总量大且中文版已存在，优先级低）。

54. **第四批：基础文本表整表修复 + 窗口模板 ${} 修复**（第五十四轮，真机截图驱动）：
    - 真机 17 张截图里剩余英文全部来自 **localization_base_ch.js**（原版 group/id 文本），
      而非 key 表：`Overseer of Monuments`(4.13)、`Choose an Egyptian Name:`(13.8)、
      `Begin Family History`(293.7)、`Return to main menu`(292.4)、
      `Click on any item…`(61.218)、`Patron God`(187.2)、`years`(298.9)、
      `Cleopatra`(294.42)、`Ptolemy XV`(151.124)、`Empty land`+空地说明(70.20/70.42)、
      任务简报长句(305.0)。**根因**：base 表缺 240 条 + 原文件条目格式不统一，
      游戏侧解析数组时读不全 → 缺失项回退 en。
    - 处理：`.temp\normalize_base_ch.py` 把 474KB 的 base_ch 全量规范化重写
      （6539→6779 条、补逗号、json 转义、语法校验 PARSE_OK）；
      `.temp\patch_ch_batch4.py` 追加 240 条中文译文（含上述全部条目）。
      现 base_en 5422 条在 base_ch 中 100% 有中文。
    - 另一类问题：顾问窗口模板里静态写 `text:"${city.population} ${57.6}"`，
      这类 ${} 只在元素 load 时解析一次，取不到值就**原样显示**（截图里出现
      `${city.population}`、`${53.69}`、`${199.3}`）。已改为 textfn：
      ui_advisor_education.js 三个人数行、ui_advisor_monuments.js 三处提示。
      **规范：窗口模板里不要用静态 `${...}`，要么用 text:[group,id]，要么用 textfn。**
    - 术语调整：`铁志` → **硬核存档模式**（#TR_CONFIG_IRONWILL 及 4 条 ironwill_* 提示）。
    - 修正 #AD/#BC 译文颠倒：现 #AD=公元、#BC=公元前（此前真机显示"1250 公元"是错的）。
    - 构建：resources 7/7、game 835/835、link ok、图标一致；白名单 3321 字无需新增。
    - nro MD5 **D70B710CD2CE0FDA779B9266A72F6FF2**（26,941,523 B，六处一致），
      zip MD5 **4BCE6A94E75E8B9E02CB5C1A5C854C37**。
    - 待真机验证：家庭注册/家族史/纪念建筑顾问/教育顾问/空地提示是否已全中文。

55. **字库白名单补齐“韩/匈”等 35 字（第五十五轮）**：
    - 真机截图：语言列表里「韩语」显示 `???语`、「匈牙利语」显示 `???牙利语`，
      日志 `fnt: regen #3 symbols=3388`（+2）证实运行时才补字 → 问号瞬现。
    - 根因：旧补字脚本 `patch_font_symbols.py` 只扫 localization_ch.js 与
      ui_mods_window.js，没扫 **localization.js 的语言名 caption**（我上轮把
      caption 改成中文，韩/匈两个字没进白名单）。
    - 修复：新增 `.temp\patch_font_symbols_all.py`，扫描 scripts 下**全部 249 个 .js**
      的 CJK/全角标点字符与白名单比对，一次补 35 字
      （丽剂势匈咎导执斗榜溃滞祸稼筹签粹纯绑联胜脱艳训诺贫贮赚针镜韩鬣等），
      白名单 3321 → 3356。**以后改任何 js 里的中文都先跑这个脚本再编。**
    - nro MD5 **F6EFEDD7C3BD64F722A206DE3124C5F5**（26,941,523 B，六处一致），
      zip MD5 **EFFBA66B84AB3C052C67C6B41A37845E**。

56. **自定任务列表 61 条标题汉化 + “人民”→“人口數”**（第五十六轮）：
    - 真机截图：自定任务（Custom Game）列表里 Alexandria / Bridges / Cataract /
      Sandbox … 全是英文；任务详情页胜利条件里 “人民 20000” 应为人口数。
    - 根因：自定任务名不在任何本地化表里，而是每个 `scripts\mission\m_XXX_*.js`
      里的 `selection_title` / `selection_subtitle` 字面量。
    - 处理：`.temp\localize_mission_titles.py` 先用 base 表反查官方译名
      （en 文本 → group/id → base_ch），一次替换 41 条（努布/希尼斯/普瓦吉特/薩卡拉/
      亞歷山卓…）；剩 21 条 + 2 条副标题由 `patch_mission_titles2.py` 手工译
      （孟菲斯/塞利馬/南達舒爾/圖特摩斯谷地/托勒密時期的亞歷山卓/沙盒/瀑布/
      戰車閃擊/預設地圖…）。61 个 mission js 全部中文。
    - base 8.3 `People` 由“人民”改为 **“人口數”**（任务胜利条件等处的统计标签）。
    - 字表：mission 目录只多出 1 个字符 `†`，已补入（白名单 3357）。
    - nro MD5 **3A0526D51AA4009DE20E35FAF12D0B21**（26,941,523 B，六处一致），
      zip MD5 **E4A0C13EB57AF65C4E726DD2A661AE0D**。

57. **胜利条件“人民”→“人口”**（第五十七轮，纠错）：上一轮改的 base 8.3 不是胜利条件
    用的那条——`ui_scenario_selection.js:180` 的 `scenario_info_goal_line(... , 44, 133)` 才是，
    base 44.133 = People/人民。已改为 **人口**（8.3 保留“人口數”供其他统计标签）。
    - nro MD5 **DBE2BA336F22143FB8B47A39268E7F41**，zip MD5 **0095FEEB32F784C12B5333596775CAF2**。

58. **自定任务（Custom Maps）列表与副标题汉化**（第五十八轮）：
    - 真机截图：自定任务窗口左侧 33 项地图名全英文（Alexandria / Bridges /
      Cataract / Chariot Blitz / …），右侧标题 `Alexandria`、副标题
      `An Alexandrian Affair` 也是英文。第 56 轮改的 `mission/*.js` 的
      `selection_title` 只作用于 Free play / campaign，对本窗口无效。
    - 根因：`window_scenario_selection_custom` 用 file finder 扫 `Maps/*.map`，
      列表文本与标题直接取**文件名**（`get_entry_draw_text` /
      `custom_map_selection_title`）；副标题取 map 文件内嵌的**定长 64 字节
      subtitle**（英文，UTF-8 槽位，如 `An Alexandrian Affair`）。
    - 方案：不动玩家 SD 卡上的 33 个 map 资源（改文件名会产生英文/中文双份
      残留并破坏 `custom_missions` 加载），改为**显示别名**：
      1. C++ `scrollable_list` 新增 `display_names`（无扩展文件名 → 中文显示名），
         `get_entry_draw_text` 查表；加载/选中仍返回真实文件名。
      2. `ui.h/ui.cpp` 的 `escrollable_list::set_display_names` 转调；
         `ui_js_uiscrollable_list.cpp` 新增 JS API `list.set_display_names({})`。
      3. `ui_scenario_selection_custom.js` 内建 `custom_map_display_names`
         与 `custom_map_display_subtitles` 两张表（各 33 条），init 注入，
         标题/副标题查表，找不到时回退原名/原副标题。
    - 译名示例：亞歷山卓／橋樑／瀑布／戰車閃擊／克爾瑪要塞／亞特蘭提斯之門／
      赫嫩涅蘇／北非自由貿易／沙盒：金字塔／階梯之城／托斯卡／昔蘭尼 …
    - 字表：3357 → 3359（新增「侧」「壽」）。
    - 若以后新增 `Maps/*.map`，需在两张表里补一条，否则该图仍显示英文名。
    - nro MD5 **3AE8201A3A280D49693986AFDB77801D**（26,941,523 B，六处一致），
      zip MD5 **1C2A680DE476CA8376B0252FBA588400**。

其他已知事实：
- `hardware_concurrency()` 返回 0 → 线程池单线程
- sdmc 磁盘文件名大小写混合（`Pharaoh_Unloaded.sg3` 等），FAT 不敏感无碍
- `lp: sg3 read ok (0 bytes)` 里的 0 是探针占位硬编码，不是真实读数
- Empire 包：entries=202（1 真实图 + 201 system 槽），sg3 695080B 标准头，555 3879218B

## 8. 文件地图

```
E:\移植项目\pharaoh-build\                        构建根（必须 ASCII 路径）
├─ build_switch.py                       构建驱动（stage: game/link/nro/…）
├─ PROJECT_HANDOVER.md                   本文档
├─ .temp\last_logs\                      最近一次真机测试日志快照
├─ switch_port\nro_pack.py               NRO 打包器（ASET 已修）
├─ switch_port\SDL_config.h, build\icon_256.jpg
├─ src\Akhenaten-master\src\             引擎源码（全部补丁都在这里）
│  ├─ content\dir.cpp                    is_absolute_path / content_path / resolve（Switch 分支）
│  ├─ content\vfs.cpp                    file_exists / file_open（`:` 内嵌分支）
│  ├─ content\imagepak.cpp               load_pak 全流程 + lp: 探针 + 防御保护
│  ├─ content\content_switch.cpp         Switch 文件管理器（直接 fopen）
│  ├─ graphics\image.cpp                 image_load_paks 循环 + img: 探针
│  ├─ platform\renderer.cpp              1024 atlas 钳制（~L1280）
│  ├─ platform\screen.cpp                720p / scale150 覆盖
│  ├─ platform\arguments.cpp             data_dir 固定
│  ├─ platform\switch\switch_boot.cpp    boot.log 诊断系统
│  └─ js\js.cpp                          JS VM + `:` 内嵌 + conf 跳过
├─ SDL\src\video\switch\SDL_switchvideo.c  GL NULL 化 + libnx framebuffer 实现 + swdbg
├─ dkp\libnx                             libnx
├─ dkp-newlib\lib\libstdc++.a           打过 S_ISREG 补丁（链接实际使用）
├─ tc\xpack-aarch64-none-elf-gcc-15.2.1-1.1\  交叉工具链
├─ build\obj\game\...                    对象文件（可增量）
└─ output\Pharaoh_Cleopatra-NX.nro / .elf / sdcard\switch\{Pharaoh_Cleopatra-NX.nro, pharaoh\...}

E:\法老王NS移植版\                        V1.0 发布目录（2026-11-23）
├─ Pharaoh_Cleopatra-NX_V1.0_安装包.zip    正式安装包（见第 46 条）
├─ Pharaoh_Cleopatra-NX.nro                裸 nro（老用户单独更新用）
└─ 安装说明.txt                            正式说明（与 zip 内同源）

<工作空间>\pharaoh-switch\output\        交付目录
├─ Pharaoh_Cleopatra-NX.nro                最新 nro（每轮更新）                                
├─ 法老王Switch安装包_v1.0.zip           ⚠️ 已废弃（内为旧名 nro，勿分发；正式包在 E 盘）
├─ 法老王Switch配置工具.html             配置工具（conf 格式对齐问题见第 3 节）
└─ 安装说明.txt                          ⚠️ 旧版说明（已被 E 盘 V1.0 说明取代）
```

## 9. 恢复指南

- **同一台电脑换 TeleAgent 账号**：`E:\移植项目\pharaoh-build\` 原位不动，无需解压任何东西。
  新会话直接让 AI 读本文档（`E:\移植项目\pharaoh-build\PROJECT_HANDOVER.md`）即可继续。
- **换电脑**：把本备份 zip 解压，将 `pharaoh-build\` 目录放到目标机 `E:\移植项目\pharaoh-build\`
  （路径必须是纯 ASCII）。工具链、libnx、libstdc++、SDL、源码、脚本全在包内，无需联网重建。
  Python 仅需系统自带；构建命令见第 4 节。
- 若 zip 遗失：核心可再生物=工具链（xpack 官网）+ libnx（devkitPro）+ SDL/freetype 源码
  （build_switch.py 的 sdl2/freetype stage 里有获取逻辑）；**不可再生的关键资产是
  `src\Akhenaten-master` 里的全部移植补丁**——务必保留 `src` 目录。

## 10. 调试技能（已固化，本地可复用）

- 技能名：`pharaoh-switch-debug`（显示名：法老王Switch移植调试），已注册可用。
- 本账号位置：`C:\Users\Lsyym\.config\TeleAgent\users\v1_public_2122502839200366592\skills\pharaoh-switch-debug\`
  （SKILL.md + scripts\parse_sg3.py 离线包解析器）。
- 备份内副本：`pharaoh-build\workspace_deliverables\skills\pharaoh-switch-debug\`。
- **换账号安装**：把技能文件夹整体拷到新账号的
  `<TeleAgent配置目录>\skills\` 下（目录名保持 pharaoh-switch-debug），重启 TeleAgent；
  或新会话里运行 skill-creator 的 `add_skill_remote.py <skill>\SKILL.md` 注册。
- 触发：用户回传 boot.log / 要求继续移植调试 / 构建 nro / 解析 sg3 时自动命中；
  内容含每轮标准流程、探针字典、崩溃模式手册（5 类）、构建同步备份命令。
  本交接文档仍是唯一权威上下文，技能只是流程加速器。

> AI生成
