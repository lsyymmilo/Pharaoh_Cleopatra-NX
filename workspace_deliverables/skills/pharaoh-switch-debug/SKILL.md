---
name: pharaoh-switch-debug
description: "Pharaoh Switch port debugging and build-delivery loop. Use when the user sends back device test logs (boot.log/sdl.log/akhenaten-log.txt), asks to continue the Pharaoh Switch port, build a new nro, sync deliverables, parse sg3 pak files, or refresh the desktop backup. Triggers: 法老王, pharaoh, akhenaten, boot.log, Switch移植, 真机测试, 构建nro, custom pack. Runs fully local - no network needed."
name_cn: 法老王Switch移植调试
description_cn: "法老王 Switch 移植调试一条龙：本地解析真机日志精确定位崩溃点，内置崩溃模式手册、探针字典、sg3 离线解析与构建/同步/备份命令，免重复联网检索与上下文重建。"
create_source: super-agent-skill-creator
---

# Pharaoh Switch Debug

## 0. Context source of truth (read first, only once)

Read `E:\移植项目\pharaoh-build\PROJECT_HANDOVER.md` — it holds the full fix history (15+),
file map, current state, and next steps. Do not re-derive context from chat history.
The machine may be the SAME PC (path intact) or a NEW PC (backup zip must be
extracted to `E:\移植项目\pharaoh-build\` first — pure-ASCII path is mandatory).

## 1. Per-round standard loop

1. Read `C:\Users\<user>\Desktop\boot.log` (Tail 60-100 lines is enough; it is the
   only reliable log — sdl.log appends across runs, akhenaten-log.txt is unflushed).
2. Death point = last probe line. Nothing after it ⇒ crash/hang inside that step.
3. Classify via probe dictionary (§2) + crash-pattern manual (§3). Fix in source.
4. Build + verify + sync (§4). Refresh `PROJECT_HANDOVER.md` (state + fix list).
5. Refresh desktop backup zip (§5).
6. Reply to user: conclusion → change → verification → replace-both-nro test steps.

## 2. boot.log probe dictionary

| Prefix | Meaning |
|---|---|
| `boot:/main:/setup:/sdl:/screen:/check:` | boot, SD mount, SDL, window, pre_init |
| `jsf:/jsp:/jss:/jsr:/js:` | JS VM load/parse/exec; 552 embedded scripts |
| `img:` | pak loop: `pak[N] 'name'` then `status=` (3=LOADED 4=FAILED) |
| `gen:` | get_entries_num: sgx probe / sg3 header entries |
| `lp:` | load_pak stages: hdr→groups→names→packer→parse→sysskip→iso→pack→atlas→555→conv→tex→done |
| `ginit:` | game_init milestones; success ends `entering main loop` |

## 3. Crash-pattern manual (all previously hit — check these first)

1. **Inner-colon garbage path** `sdmc:/.../sdmc:/...`: base dir joined onto an
   already-absolute path → `fs::exists` crashes in SD devoptab. Fix: guard with
   `vfs::path_is_absolute()` (dir.cpp) before ANY join; audit new join sites with
   `grep` for `vfs::path(` + `"/"` concatenations. JS-side join spots live in
   js.cpp (`js_vm_load_file_and_exec` user-dir branch, `js_vm_get_absolute_path`).
2. **`verify_no_crash` / `vector::at()`** on garbage data → abort (no exceptions
   on Switch). Fix: bounds-check, log via `switch_boot_log`, skip gracefully.
3. **Atlas memory/OOM**: software renderer page = w*h*4B. Switch clamp = 2048
   (renderer.cpp ~L1280). 4096 = instant OOM; 1024 breaks big images (Empire map
   1200x1600). Aggregate memory is area-invariant across page sizes.
4. **Packer pages underflow**: atlas_packer.cpp early-exit `pages_needed--` at 0
   → 0xFFFFFFFF → huge reserve. Guarded now; keep the `(int)pages_needed <= 0`
   check in load_pak. Symptom in log: `lp: pack pages=-1`.
5. Pak entry stride: **64 bytes** (version<214), +8 if version>=214. Entry table
   at 40680. NEVER parse with 63.

## 4. Build + verify + sync (exact commands)

```powershell
$env:DKP_LIBNX='E:/移植项目/pharaoh-build/dkp/libnx'
Set-Location E:\移植项目\pharaoh-build
python build_switch.py all          # game → link → nro (incremental)
```

Verify: fresh .o timestamps ≥ source for every edited file; new probe strings
survive in the nro (`[Text.Encoding]::ASCII.GetString(bytes).Contains('lp: ...')`);
comments/identifiers do NOT survive — only string literals.

Sync the nro to exactly three places (hashes must match):
```
E:\移植项目\pharaoh-build\output\sdcard\switch\akhenaten.nro
E:\移植项目\pharaoh-build\output\sdcard\switch\pharaoh\akhenaten.nro
<workspace>\pharaoh-switch\output\akhenaten.nro
```

User test steps (paste in reply): replace both nro on SD card → launch via
Sphaira → send back the three desktop logs.

## 5. Refresh backup (desktop)

```powershell
Copy-Item C:\Users\<user>\Desktop\{boot.log,sdl.log,akhenaten-log.txt} E:\移植项目\pharaoh-build\.temp\last_logs\ -Force
Copy-Item <workspace>\pharaoh-switch\output\akhenaten.nro E:\移植项目\pharaoh-build\workspace_deliverables\ -Force
Set-Location C:\
tar.exe -a -cf 'C:\Users\<user>\Desktop\Pharaoh_Switch_Port_Backup_<date>.zip' pharaoh-build
```
Verify: source file count == zip entry count; spot-extract nro + handover, MD5
compare. The zip is the cross-account/cross-PC lifeline — keep it current.

## 6. Offline pak analysis

```powershell
python <this-skill>\scripts\parse_sg3.py Empire SprMain          # headers + largest image
python <this-skill>\scripts\parse_sg3.py --entry Empire 201      # one entry in detail
```
Use BEFORE burning a device test round: most pak-load questions (image sizes,
mirrors, offsets, system slots) are answerable from the local staging copy in
`E:\移植项目\pharaoh-build\output\sdcard\switch\pharaoh\assets\Data\`.

## 7. Operations routing map (every task type → local authority + action)

| Task | Local authority / tool | Action |
|---|---|---|
| Crash diagnosis | boot.log tail + §2/§3 | classify last probe → fix in `src\Akhenaten-master` |
| Pak data question (sizes/mirrors/offsets) | `scripts\parse_sg3.py` | run offline BEFORE device tests |
| Build new nro | §4 commands | incremental `build_switch.py all` |
| Deliver to user | 3-path sync (§4) | hash-verify all three |
| Backup refresh | §5 commands | tar + count + spot-MD5 |
| State/history/fix list | `E:\移植项目\pharaoh-build\PROJECT_HANDOVER.md` | update §2/§3/§7 after each round |
| Install zip repack (post-milestone) | `output\sdcard\switch\` tree | compress AFTER game boots (old zip has stale nro) |
| Cross-account / cross-PC resume | handover §9/§10 + backup zip | read handover; copy skill folder to new account config dir |
| Verify fix entered binary | ASCII string search in nro | only string literals survive compilation |

## 8. Token discipline (mandatory every round)

Priority order: local skill/docs > local offline scripts (parse_sg3.py) >
verified conclusions already in handover/logs > network search/download (LAST
resort, mirrors ghfast.top / gh-proxy.com only).

- Read logs via Tail (60-100 lines), never full files; use Read offset/limit for
  source; never re-derive facts already in PROJECT_HANDOVER.md.
- Never rebuild unchanged stages; never re-run proven probes.
- **End every reply with the round's tool-call ratio: `本地 X% / 网络 Y%`**
  (count tool calls this round: file/shell/script = 本地; online_search/webfetch
  /downloads = 网络).
