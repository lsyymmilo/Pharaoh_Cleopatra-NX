# 552个队列来源: include(:conf) 在 modules.js 最前, 但jss[56]才是conf?
# 观察jss日志: [1]=common...[55]=building_menu_ctrl, [56]=akhenaten.conf
# 说明 include() 的入队顺序在 import 之后! 查 js_vm_queue_file 与 include 的顺序语义
print("queue order: includes enqueued AFTER imports -> conf 是第56个")
print("死点: file_open(':akhenaten.conf') -> internal_file_open -> cmrc exists(二分, 无此条目) -> 返回{nullptr,0}")
print("      -> reader() 空 -> 620行 scripts_folders非空 -> js_vm_get_absolute_path('akhenaten.conf')")
print("      -> 检查上轮guard是否在交付nro里生效")
