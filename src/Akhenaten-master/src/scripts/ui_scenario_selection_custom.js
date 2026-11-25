log_info("akhenaten: scenario selection — custom maps")

// 自定任务（Custom Maps）列表显示名。map 文件本身保持英文名不变（加载仍用真名），
// 仅列表绘制与右侧标题/副标题使用中文，避免改动玩家 SD 卡上的地图资源。
var custom_map_display_names = {
    "Alexandria": "亞歷山卓",
    "Bridges": "橋樑",
    "Cataract": "瀑布",
    "Chariot Blitz": "戰車閃擊",
    "Default": "預設場景",
    "Empire": "帝國",
    "Enkomi": "恩科米",
    "Fortress Kerma": "克爾瑪要塞",
    "Gateway to Atlantis": "亞特蘭提斯之門",
    "Henen-nesw": "赫嫩涅蘇",
    "Holy Grail": "聖杯",
    "Hostile Nations": "敵對諸國",
    "King": "王者",
    "Kyrene": "昔蘭尼",
    "Lost Tomb": "失落之墓",
    "NAFTA": "北非自由貿易",
    "Pharaohs Memphis": "法老孟菲斯",
    "Pyramid Scheme": "金字塔計畫",
    "Sandbox": "沙盒",
    "Sandbox Bent and Sphinx": "沙盒：彎曲金字塔",
    "Sandbox Maus and Mastabas": "沙盒：陵墓與馬斯塔巴",
    "Sandbox Mudbrick Pyramids": "沙盒：泥磚金字塔",
    "Sandbox Obelisks": "沙盒：方尖碑",
    "Sandbox Pyramids": "沙盒：金字塔",
    "Sandbox Sun Temple": "沙盒：太陽神廟",
    "Shaat": "沙阿特",
    "Small Oasis": "小綠洲",
    "Steps": "階梯之城",
    "The Good Life": "美好生活",
    "Toshka": "托斯卡",
    "Two Cities": "兩座城市",
    "Unreliant": "自給自足",
    "Warfare": "戰爭"
}

var custom_map_display_subtitles = {
    "Alexandria": "亞歷山卓風雲",
    "Bridges": "入侵前的二十年",
    "Cataract": "阿布，還是不阿布",
    "Chariot Blitz": "帝國擴張",
    "Default": "預設場景",
    "Empire": "統治你的帝國",
    "Enkomi": "堅持下去",
    "Fortress Kerma": "庫什欲奪回克爾瑪",
    "Gateway to Atlantis": "我們並不孤單……",
    "Henen-nesw": "想當法老嗎",
    "Holy Grail": "聖杯傳說",
    "Hostile Nations": "艱難時世",
    "King": "為王真好",
    "Kyrene": "利比亞之河",
    "Lost Tomb": "法老失落之墓",
    "NAFTA": "北非自由貿易",
    "Pharaohs Memphis": "建立你的首都",
    "Pyramid Scheme": "二加二等於五",
    "Sandbox": "純粹的城市建設",
    "Sandbox Bent and Sphinx": "純粹的城市建設",
    "Sandbox Maus and Mastabas": "純粹的城市建設",
    "Sandbox Mudbrick Pyramids": "純粹的城市建設",
    "Sandbox Obelisks": "純粹的城市建設",
    "Sandbox Pyramids": "純粹的城市建設",
    "Sandbox Sun Temple": "純粹的城市建設",
    "Shaat": "埃及前哨",
    "Small Oasis": "水即生命",
    "Steps": "階梯金字塔之城",
    "The Good Life": "長壽與繁榮",
    "Toshka": "努比亞邊境",
    "Two Cities": "援助你的姊妹城",
    "Unreliant": "自給自足的城市",
    "Warfare": "保持道路暢通"
}

[es=(window_scenario_selection_custom, init)]
function window_scenario_selection_custom_on_init(ev) {
    var list = ev.scenario_map_list
    list.set_display_names(custom_map_display_names)
    list.change_file_path("Maps/", "map")
    list.refresh_file_finder()
    if (list.items_count > 0) {
        list.select_index(0)
        window_scenario_selection_custom_on_map_list_click({ text: list.selected_text(0) })
    }
}

[es=(window_scenario_selection_custom, click_item)]
function window_scenario_selection_custom_on_map_list_click(p) {
    if (!p || p.text === "") {
        return
    }

    var base = p.text
    var n = base.length
    var name = (n >= 4 && base.substring(n - 4).toLowerCase() === ".map") ? base : base + ".map"
    __game_load_map(name, 0)

    emit window_scenario_selection_custom.mission_changed { id: scenario.campaign_scenario_id }
}

function window_scenario_selection_custom_btn_start() {
    // Custom maps outside custom_missions get campaign_scenario_id = -1; still playable.
    if (!game.session_last_loaded_mission) {
        return
    }
    __game_start_loaded_file()
}

[es=(window_scenario_selection_custom, btn_start)]
function window_scenario_selection_custom_on_btn_start(window) {
    window_scenario_selection_custom_btn_start()
}

[es=(window_scenario_selection_custom, mission_changed)]
function window_scenario_selection_custom_on_mission_changed(ev) {
    ui.invalidate_minimap_preview(ev.scenario_minimap.size)
    var base = custom_map_selection_title(game.session_last_loaded_mission)
    ev.side_mission_title.text = custom_map_display_names[base] || base
    var sub = custom_map_display_subtitles[base]
    ev.side_subtitle.text = sub ? sub : scenario.subtitle
    ev.side_year.text = scenario_selection_format_start_year(scenario.start_year)
}

[es=(window_scenario_selection_custom, draw_minimap)]
function window_scenario_selection_custom_draw_minimap(ev) {
    var elm = ev[ev.active_id]
    if (!elm) {
        return
    }
    ui.draw_minimap_preview(elm.screen_pos, elm.size, elm.size)
}

[es=(window_scenario_selection_custom, mission_changed)]
function window_scenario_selection_custom_update_climate(ev) {
    window_scenario_selection_update_climate(ev)
}

[es=(window_scenario_selection_custom, mission_changed)]
function window_scenario_selection_custom_update_goals(ev) {
    window_scenario_selection_update_goals(ev)
}

[es=(window_scenario_selection_custom, mission_changed)]
function window_scenario_selection_custom_update_monuments(ev) {
    window_scenario_selection_update_monuments(ev)
}

[es=(window_scenario_selection_custom, mission_changed)]
function window_scenario_selection_custom_update_time_limit(ev) {
    window_scenario_selection_update_time_limit(ev)
}

[es=(window_scenario_selection_custom, mission_changed)]
function window_scenario_selection_custom_update_file_schema(ev) {
    window_scenario_selection_update_file_schema(ev)
}

[es=window]
window_scenario_selection_custom {
    allow_rmb_goback : true

    pos [(sw(0) - 1024) / 2, (sh(0) - 768) / 2]
    ui {
        background            : dummy({ size[64, 48] })

        debug_file_schema     : text({ pos[265, 170], size[160, 20], text:"", font:FONT_NORMAL_BLACK_ON_DARK })

        img_custom            : image({ pos[0, 0], pack:PACK_UNLOADED, id:32, offset:0, enabled:true })
        scenario_minimap      : dummy({ pos[270, 179], size[181, 140], ondraw_event: "draw_minimap" })

        scenario_map_list     : scrollable_list({
            pos[210, 360]
            size[16, 15]
            dir:"Maps/"
            file_ext:"map"
            use_file_finder:true
            view_items:14
            scrollbar_margin_x:10
            draw_scrollbar_always:false
            onclick_event: "click_item"
        })

        btn_start              : image_button({ pos[780, 582], size[27, 27], pack:PACK_GENERAL, id:193, offset:4 })

        side_mission_title     : text_center({ pos[545, 162], size[265, 36], align:"center", text:"", font:FONT_LARGE_BLACK_ON_DARK, clip_area:true })
        side_subtitle          : text_center({ pos[545, 200], size[265, 20], align:"center", text:"", font:FONT_NORMAL_WHITE_ON_DARK })
        side_year              : text_center({ pos[545, 225], size[265, 17], align:"center", text:"", font:FONT_NORMAL_BLACK_ON_DARK })

        info_hdr_mission       : text_center({ pos[545, 252], size[265, 17], align:"center", text[44, 10], font:FONT_NORMAL_WHITE_ON_DARK })
        info_line_climate      : text({ pos[545, 272], size[265, 17], font:FONT_NORMAL_BLACK_ON_DARK })
        info_line_mapsize      : text({ pos[545, 292], size[265, 17], font:FONT_NORMAL_BLACK_ON_DARK })
        info_line_invasion     : text({ pos[545, 312], size[265, 17], font:FONT_NORMAL_BLACK_ON_DARK })
        info_line_start_region : text({ pos[545, 332], size[265, 17], text[2, 6], font:FONT_NORMAL_BLACK_ON_DARK })

        info_hdr_goals         : text_center({ pos[545, 347], size[265, 17], align:"center", text[44, 127], font:FONT_NORMAL_WHITE_ON_DARK })
        info_goals_body        : text({ pos[545, 374], size[265, 100], wrap:px(16), font:FONT_NORMAL_BLACK_ON_DARK, multiline:true, clip_area:true })
        info_time_limit        : text({ pos[545, 484], size[265, 17], font:FONT_NORMAL_YELLOW })

        info_hdr_monuments     : text_center({ pos[545, 487], size[265, 17], align:"center", text[41, 48], font:FONT_NORMAL_WHITE_ON_DARK })
        info_monuments_body    : text({ pos[545, 504], size[265, 51], wrap:px(16), font:FONT_NORMAL_BLACK_ON_DARK, multiline:true, clip_area:true })
    }
}
