log_info("akhenaten: eventmsg chinese started")

eventmsg_ch = [
  { key:PHRASE_egyptian_city_attacked_title_P, text: "埃及城市遭到攻擊" }
  { key:PHRASE_egyptian_city_attacked_title_C, text: "埃及城市遭到攻擊" }
  { key:PHRASE_egyptian_city_attacked_initial_announcement_P, text: "[greeting] [player_name]，[reason_phrase] 異教徒們正在攻擊。全能的法老命令妳向埃及城市 [city_name] 發送軍隊以便攻擊敵人。妳應該在[travel_time]個月內發出軍隊。" }
  { key:PHRASE_egyptian_city_attacked_initial_announcement_C, text: "[greeting] [player_name]，[reason_phrase] 現在一個埃及城市[city_name]正遭到進攻，他們需要妳的幫助。妳應該在[travel_time]個月內發出軍隊。" }
  { key:PHRASE_egyptian_city_attacked_first_reminder_P, text: "[greeting] [player_name]，神聖的法老軍隊仍然在[city_name]與侵略者作戰。在六個月之內發出援軍，否則將會引起法老的怒火。" }
  { key:PHRASE_egyptian_city_attacked_first_reminder_C, text: "[greeting] [player_name]，妳還記得 [city_name] 嗎？在六個月內發出軍隊，否則將會有可怕的後果。" }
  { key:PHRASE_egyptian_city_attacked_last_reminder_P, text: "[greeting] [player_name]，法老等妳的軍隊已經不耐煩了。趕快向[city_name]發送軍隊，否則就太晚了。" }
  { key:PHRASE_egyptian_city_attacked_last_reminder_C, text: "[greeting] [player_name]，[city_name] 可能很快淪陷。如果妳想幫助他們就趕快發出軍隊。" }
  { key:PHRASE_egyptian_city_attacked_comply_reason_P_A, text: "因為妳的軍隊在[city_name]打敗了法老的敵人，" }
  { key:PHRASE_egyptian_city_attacked_comply_reason_P_B, text: "妳的軍隊在[city_name]打敗了法老的敵人。順便的，" }
  { key:PHRASE_egyptian_city_attacked_comply_reason_P_C, text: "雖然妳的軍隊在[city_name]打敗了法老的敵人，" }
  { key:PHRASE_egyptian_city_attacked_comply_reason_C_A, text: "因為妳的軍隊能幹地幹掉了在[city_name]的敵人，" }
  { key:PHRASE_egyptian_city_attacked_comply_reason_C_B, text: "妳的軍隊能幹地幹掉了在[city_name]的敵人，而且，" }
  { key:PHRASE_egyptian_city_attacked_comply_reason_C_C, text: "雖然妳的軍隊能幹地幹掉了在[city_name]的敵人，" }
  { key:PHRASE_egyptian_city_attacked_too_late_reason_P_A, text: "因為妳延誤了發送妳的軍隊去幫助法老在[city_name]與敵人戰鬥，" }
  { key:PHRASE_egyptian_city_attacked_too_late_reason_P_B, text: "法老的軍隊在[city_name]戰敗了，因為妳的軍隊到得太晚了。而且，" }
  { key:PHRASE_egyptian_city_attacked_too_late_reason_P_C, text: "妳的軍隊到[city_name]到得太晚了。不過妳的努力還是受到了贊賞。所以，" }
  { key:PHRASE_egyptian_city_attacked_too_late_reason_C_A, text: "因為妳在發送妳的軍隊保護[city_name]這件事上太拖沓了，" }
  { key:PHRASE_egyptian_city_attacked_too_late_reason_C_B, text: "妳的軍隊沒能及時趕到[city_name]幫助防御。而且，" }
  { key:PHRASE_egyptian_city_attacked_too_late_reason_C_C, text: "妳的軍隊沒能及時趕到[city_name]幫助防御。不過因為妳盡力了，而且願意犧牲妳的士兵，" }
  { key:PHRASE_egyptian_city_attacked_refuse_reason_P_A, text: "因為妳拒絕幫助法老向[city_name]發兵，" }
  { key:PHRASE_egyptian_city_attacked_refuse_reason_P_B, text: "法 老 知 道 妳 拒 絕 向 [city_name]發兵，而且，" }
  { key:PHRASE_egyptian_city_attacked_refuse_reason_P_C, text: "盡管妳拒絕向[city_name]發兵幫助法老" }
  { key:PHRASE_egyptian_city_attacked_refuse_reason_C_A, text: "因為妳拒絕發出妳的軍隊幫助[city_name]趕走掠奪者，" }
  { key:PHRASE_egyptian_city_attacked_refuse_reason_C_B, text: "[city_name]因為妳拒絕向他們發兵援助而感到失望，而且，" }
  { key:PHRASE_egyptian_city_attacked_refuse_reason_C_C, text: "雖然妳拒絕發出妳的軍隊幫助[city_name]趕走掠奪者，" }
  { key:PHRASE_egyptian_city_attacked_lost_battle_reason_P_A, text: "因為妳幫助法老向[city_name]發出的軍隊太弱了，" }
  { key:PHRASE_egyptian_city_attacked_lost_battle_reason_P_B, text: "妳為法老派出的弱旅在[city_name]被打敗了，而且，" }
  { key:PHRASE_egyptian_city_attacked_lost_battle_reason_P_C, text: "雖然妳的軍隊弱得無法在[city_name]幫助法老，" }
  { key:PHRASE_egyptian_city_attacked_lost_battle_reason_C_A, text: "因為妳向[city_name]發出的軍隊不夠強大，" }
  { key:PHRASE_egyptian_city_attacked_lost_battle_reason_C_B, text: "妳的弱小的軍隊在[city_name]被打敗了，另外，" }
  { key:PHRASE_egyptian_city_attacked_lost_battle_reason_C_C, text: "雖然妳的軍隊在[city_name]沒有打勝仗，" }
  { key:PHRASE_egyptian_city_attacked_no_reason_P_A, text: "他們為了更多的土地" }
  { key:PHRASE_egyptian_city_attacked_no_reason_P_B, text: "妳的麻煩還沒有結束，因為" }
  { key:PHRASE_egyptian_city_attacked_no_reason_P_C, text: "" }
  { key:PHRASE_egyptian_city_attacked_no_reason_C_A, text: "因為長期不和，" }
  { key:PHRASE_egyptian_city_attacked_no_reason_C_B, text: "妳的麻煩還沒有結束，因為" }
  { key:PHRASE_egyptian_city_attacked_no_reason_C_C, text: "" }
  { key:PHRASE_distant_battle_title_P, text: "遠征" }
  { key:PHRASE_distant_battle_title_C, text: "遠征" }
  { key:PHRASE_distant_battle_initial_announcement_P, text: "[greeting][player_name],[reason_phrase]法老的部隊們正面對一場艱苦戰鬥. 偉大的法老王下令妳帶領一支軍隊前往遙遠的[city_name]進行支持. 妳必須在[travel_time]個月內出發." }
  { key:PHRASE_distant_battle_initial_announcement_C, text: "[greeting][player_name],[reason_phrase]法老的部隊們正在遙遠的[city_name]進行艱苦戰鬥, 他們亟需要妳的增援.   妳必須在[travel_time]個月內抵達該地." }
  { key:PHRASE_distant_battle_first_reminder_P, text: "[greeting][player_name],[city_name]的浴血戰鬥仍在持續進行,而法老王仍需要妳的支持. 妳必須盡快在六個月內將增援部隊派遣至該地. 否則後果不堪設想. " }
  { key:PHRASE_distant_battle_first_reminder_C, text: "[greeting][player_name],[city_name]的浴血戰鬥仍在持續進行. 妳必須盡快在六個月內將增援部隊派遣至該地.   如此妳才有機會分享勝利的榮耀." }
  { key:PHRASE_distant_battle_last_reminder_P, text: "[greeting][player_name], 埃及部隊仍然在[city_name]艱苦奮戰著, 偉大的法老下令妳必須盡快派遣增援部隊. 須記住的是,千萬別讓法老王的情緒感到不悅." }
  { key:PHRASE_distant_battle_last_reminder_C, text: "[greeting][player_name],[city_name]的戰鬥仍繼續著. 如果妳的援軍能盡快到達該地, 將很有可能分享勝利的榮耀." }
  { key:PHRASE_distant_battle_comply_reason_P_A, text: "因為妳的增援部隊,關係著法老在[city_name]的最後勝利," }
  { key:PHRASE_distant_battle_comply_reason_P_B, text: "妳的部隊將左右著法老在[city_name]的勝利.   對了, 還有一件事," }
  { key:PHRASE_distant_battle_comply_reason_P_C, text: "雖然妳的部隊幫助法老王取得了[city_name]的勝利," }
  { key:PHRASE_distant_battle_comply_reason_C_A, text: "因為妳的支持與幫助,[city_name]的戰爭獲得了勝利," }
  { key:PHRASE_distant_battle_comply_reason_C_B, text: "妳的部隊在取得[city_name]戰爭的勝利上有很大貢獻.   而且," }
  { key:PHRASE_distant_battle_comply_reason_C_C, text: "雖然妳的部隊在取得[city_name]戰爭的勝利上有很大貢獻," }
  { key:PHRASE_distant_battle_too_late_reason_P_A, text: "因為妳的部隊並沒有及時趕到[city_name]增援," }
  { key:PHRASE_distant_battle_too_late_reason_P_B, text: "妳的部隊並沒有及時趕到[city_name]增援.   此外," }
  { key:PHRASE_distant_battle_too_late_reason_P_C, text: "雖然妳的部隊前往增援[city_name]的時間已經太遲, 妳為王國所奉獻出的心力仍受人尊敬.   因此," }
  { key:PHRASE_distant_battle_too_late_reason_C_A, text: "因為妳的部隊並沒有及時趕到[city_name]增援," }
  { key:PHRASE_distant_battle_too_late_reason_C_B, text: "妳的部隊前往增援[city_name]的時間已經太遲了.   此外," }
  { key:PHRASE_distant_battle_too_late_reason_C_C, text: "雖然妳的部隊前往增援[city_name]的時間已經太遲, 妳為王國所奉獻出的心力仍受人尊敬.   因此," }
  { key:PHRASE_distant_battle_refuse_reason_P_A, text: "因為妳拒絕法老王的要求,不願派遣增援部隊前往[city_name]," }
  { key:PHRASE_distant_battle_refuse_reason_P_B, text: "妳拒絕了法老王的要求,不願派遣增援部隊前往[city_name].   這不是明智的做法,如果," }
  { key:PHRASE_distant_battle_refuse_reason_P_C, text: "雖然妳拒絕法老王的要求,不願派遣增援部隊前往[city_name]," }
  { key:PHRASE_distant_battle_refuse_reason_C_A, text: "因為妳拒絕派遣軍隊前往增援[city_name]," }
  { key:PHRASE_distant_battle_refuse_reason_C_B, text: "妳拒絕派遣軍隊前往增援[city_name], 這讓其它人感到沮喪.   意外地," }
  { key:PHRASE_distant_battle_refuse_reason_C_C, text: "雖然妳拒絕派遣軍隊前往增援[city_name]," }
  { key:PHRASE_distant_battle_lost_battle_reason_P_A, text: "因為妳所派遣前往增援[city_name]的部隊,戰鬥力實在太弱了,根本無法與敵軍相抗衡," }
  { key:PHRASE_distant_battle_lost_battle_reason_P_B, text: "妳所派遣前往[city_name]的增援部隊被敵軍擊敗.   此外," }
  { key:PHRASE_distant_battle_lost_battle_reason_P_C, text: "雖然妳所派遣前往[city_name]的增援部隊被敵軍擊敗了," }
  { key:PHRASE_distant_battle_lost_battle_reason_C_A, text: "因為妳所派遣前往增援[city_name]的部隊,缺乏強大的作戰能能力,所以無法抵擋敵軍攻勢," }
  { key:PHRASE_distant_battle_lost_battle_reason_C_B, text: "妳所派遣前往增援[city_name]的部隊,缺乏強大的作戰能能力,所以無法抵擋敵軍攻勢.   同時,妳也了解" }
  { key:PHRASE_distant_battle_lost_battle_reason_C_C, text: "因為妳所派遣增援[city_name]的部隊無法與敵人相抗衡," }
  { key:PHRASE_distant_battle_no_reason_P_A, text: "注意戰鬥情況, 因為" }
  { key:PHRASE_distant_battle_no_reason_P_B, text: "我們的麻煩仍未結束" }
  { key:PHRASE_distant_battle_no_reason_P_C, text: "" }
  { key:PHRASE_distant_battle_no_reason_C_A, text: "部隊們必須提高警覺, 因為" }
  { key:PHRASE_distant_battle_no_reason_C_B, text: "麻煩尚未結束, 因為" }
  { key:PHRASE_distant_battle_no_reason_C_C, text: "" }
  { key:PHRASE_general_request_title_P, text: "法老王要求物品" }
  { key:PHRASE_general_request_title_C, text: "某座城市希望獲得物品" }
  { key:PHRASE_general_request_initial_announcement_P, text: "[greeting][player_name],[reason_phrase]偉大的法老王要求妳在[time_allotted]個月內送出[amount][item]到[city_name]. 如果妳答應這個要求,將能獲得法老的敬重." }
  { key:PHRASE_general_request_initial_announcement_C, text: "[greeting][player_name],[reason_phrase][city_name]要求妳在[time_allotted]個月內送出[amount][item].[city_name]將來將會回報我們." }
  { key:PHRASE_general_request_reminder_P, text: "[greeting][player_name], 法老王不知道為何[city_name]還沒有收到[amount][item].   妳必須在六個月內做出決定,是否要答應他的要求." }
  { key:PHRASE_general_request_reminder_C, text: "[greeting][player_name],[city_name]焦急地等待[amount][item]的運送到來.   妳必須在六個月內決定是否提供該項物資." }
  { key:PHRASE_general_request_overdue_P, text: "[greeting][player_name], 難道妳想激怒法老王嗎? 妳並沒有準時把[amount][item]送到[city_name]. 不過如果僅是運送時間稍晚,法老王還是會原諒妳的." }
  { key:PHRASE_general_request_overdue_C, text: "[greeting][player_name], 剩下的時間已經不多了, 然而妳仍然尚未把[amount][item]送到[city_name]. 不過如果僅是運送時間稍晚,[city_name]的人們還是會很高興的." }
  { key:PHRASE_general_request_warning_P, text: "[greeting][player_name], 妳還有六個月的時間可以考慮,是否要答應法老的請求,將[amount][item]送到[city_name]. 如果妳打算拒絕,最好考慮一下後果." }
  { key:PHRASE_general_request_warning_C, text: "[greeting][player_name], 妳必須決定是否要在六個月內將[amount][item]送到[city_name], 拒絕的後果可能會使雙方關係惡化." }
  { key:PHRASE_general_request_comply_reason_P_A, text: "因為妳答應法老王的要求,[amount][item]已經送到[city_name]," }
  { key:PHRASE_general_request_comply_reason_P_B, text: "妳答應了法老王的要求, 已經將[amount][item]送到[city_name].   此外," }
  { key:PHRASE_general_request_comply_reason_P_C, text: "妳答應了法老王的要求, 已經將[amount][item]送到[city_name], 然而," }
  { key:PHRASE_general_request_comply_reason_C_A, text: "因為妳已經答應對方的請求, 將[amount][item]送到[city_name]," }
  { key:PHRASE_general_request_comply_reason_C_B, text: "[city_name]已經收到他們所請求的[amount][item].   妳應該了解" }
  { key:PHRASE_general_request_comply_reason_C_C, text: "即使妳已經答應對方的請求, 將[amount][item]送到[city_name]," }
  { key:PHRASE_general_request_too_late_reason_P_A, text: "因為妳拒絕了法老王對[amount][item]的要求," }
  { key:PHRASE_general_request_too_late_reason_P_B, text: "因為妳的動作太過遲緩,法老王對[amount][item]的要求仍未或得實現.   此外," }
  { key:PHRASE_general_request_too_late_reason_P_C, text: "雖然對於法老王要求[amount][item]這件事,妳的響應稍嫌緩慢, 然而妳的努力仍獲得他的肯定.   因此," }
  { key:PHRASE_general_request_too_late_reason_C_A, text: "因為妳對[city_name]要求[amount][item]的這件事上, 響應相當遲緩," }
  { key:PHRASE_general_request_too_late_reason_C_B, text: "過了許久時間之後, 妳才將[amount][item]送到[city_name].   妳必須了解" }
  { key:PHRASE_general_request_too_late_reason_C_C, text: "雖然過了許久時間之後, 妳才將[amount][item]送到[city_name], 不過妳的努力仍獲得對方肯定.   因此," }
  { key:PHRASE_general_request_refuse_reason_P_A, text: "因為妳藐視法老王對[amount][item]的要求," }
  { key:PHRASE_general_request_refuse_reason_P_B, text: "妳藐視了法老王對[amount][item]的要求, 這將導致他的不悅.此外," }
  { key:PHRASE_general_request_refuse_reason_P_C, text: "雖然妳藐視法老王對[amount][item]的要求," }
  { key:PHRASE_general_request_refuse_reason_C_A, text: "因為妳並沒有將[amount][item]送到[city_name]," }
  { key:PHRASE_general_request_refuse_reason_C_B, text: "妳並沒有將[amount][item]送到[city_name], 這將使得對方很不高興.同時," }
  { key:PHRASE_general_request_refuse_reason_C_C, text: "雖然妳並沒有將[amount][item]送到[city_name]," }
  { key:PHRASE_general_request_no_reason_P_A, text: "為了補充他所缺乏的," }
  { key:PHRASE_general_request_no_reason_P_B, text: "法老的要求似乎是永無止境的, 因為" }
  { key:PHRASE_general_request_no_reason_P_C, text: "" }
  { key:PHRASE_general_request_no_reason_C_A, text: "為了滿足市民所需," }
  { key:PHRASE_general_request_no_reason_C_B, text: "要求似乎是永不間斷的, 因為" }
  { key:PHRASE_general_request_no_reason_C_C, text: "" }
  { key:PHRASE_great_festival_title_P, text: "為[god]所舉辦的慶典" }
  { key:PHRASE_great_festival_title_C, text: "為[god]所舉辦的盛大慶典" }
  { key:PHRASE_great_festival_initial_announcement_P, text: "[greeting][player_name],[reason_phrase]法老王計畫為[god]在[city_name]舉辦一場盛大慶典,同時需要妳的物資供應. 妳還有[time_allotted]個月的時間將[amount][item]運送出去." }
  { key:PHRASE_great_festival_initial_announcement_C, text: "[greeting][player_name],[reason_phrase][city_name]希望妳能運送[amount][item]給他們,以便為[god]舉辦一場盛大慶典. 這座城市必須在[time_allotted]個月內收到這些物品." }
  { key:PHRASE_great_festival_reminder_P, text: "[greeting][player_name], 妳有六個月的時間可將[amount][item]運送至[city_name], 以便讓他們為[god]舉辦盛大慶典. 如果妳拒絕此項請求,法老王將會很不高興." }
  { key:PHRASE_great_festival_reminder_C, text: "[greeting][player_name], 即將在[city_name]為[god]所舉辦的慶典, 日子已經快到了, 然而妳卻仍未將[amount][item]運送出去. 妳必須在六個月內有所決定." }
  { key:PHRASE_great_festival_overdue_P, text: "[greeting][player_name], 因為在規定時間內,妳仍未將慶典所需的物品送出, 因此法老王停辦了為[god]所舉辦的慶典. 不過妳仍可將[amount][item]運送至[city_name], 如此法老王仍有可能會原諒妳的." }
  { key:PHRASE_great_festival_overdue_C, text: "[greeting][player_name],[city_name]對他們無法獲得為[god]所舉辦慶典的物資,感到很不高興. 不過如果妳現在仍將[amount][item]運送給他們,對方仍是會欣然接受的." }
  { key:PHRASE_great_festival_warning_P, text: "[greeting][player_name], 妳僅剩下六個月的準備時間將[amount][item]運送到[city_name]做為法老王為[god]所舉辦的盛大慶典之用. 如果妳引起法老的憤怒,後果將不堪設想!" }
  { key:PHRASE_great_festival_warning_C, text: "[greeting][player_name],[city_name]的人民對妳感到非常失望. 如果妳仍想與他們維持良好關係的話,最好趕緊在六個月內將[amount][item]運送給他們." }
  { key:PHRASE_great_festival_comply_reason_P_A, text: "因為妳對法老王與[god]的崇敬, 所以[amount][item]已經被運送至[city_name]做為盛大慶典之用," }
  { key:PHRASE_great_festival_comply_reason_P_B, text: "妳對法老王與[god]充滿崇敬, 因此已經將[amount][item]運送至[city_name]做為盛大慶典之用.   而且," }
  { key:PHRASE_great_festival_comply_reason_P_C, text: "雖然妳對法老王與[god]充滿崇敬, 因此已經將[amount][item]運送至[city_name]做為盛大慶典之用," }
  { key:PHRASE_great_festival_comply_reason_C_A, text: "因為妳願意幫助[city_name]為[god]舉辦盛大慶典,因此[amount][item]已經運送給他們了," }
  { key:PHRASE_great_festival_comply_reason_C_B, text: "妳願意幫助[city_name]為[god]所舉辦的盛大慶典,因此,當他們收到妳所給予的[amount][item]時,心中充滿感謝 .   此外," }
  { key:PHRASE_great_festival_comply_reason_C_C, text: "雖然妳願意幫助[city_name],並且運送[amount][item]給他們, 做為崇敬[god]所舉辦的盛大慶典之用," }
  { key:PHRASE_great_festival_too_late_reason_P_A, text: "因為妳將[amount][item]送來的時間太遲,因此法老無法為[god]在[city_name]舉辦盛大慶典," }
  { key:PHRASE_great_festival_too_late_reason_P_B, text: "妳將[amount][item]送來的時間太遲,因此法老無法為[god]在[city_name]舉辦盛大慶典.   此外," }
  { key:PHRASE_great_festival_too_late_reason_P_C, text: "雖然妳將[amount][item]送來的時間太遲,因此法老無法為[god]在[city_name]舉辦盛大慶典, 然而看在妳努力的份上," }
  { key:PHRASE_great_festival_too_late_reason_C_A, text: "因為[city_name]為[god]所舉辦盛大慶典所需之[amount][item]並沒有及時送達," }
  { key:PHRASE_great_festival_too_late_reason_C_B, text: "[city_name]為[god]所舉辦盛大慶典所需之[amount][item]並沒有及時送達.   而且," }
  { key:PHRASE_great_festival_too_late_reason_C_C, text: "雖然[city_name]為[god]所舉辦盛大慶典所需之[amount][item]並沒有被及時送達, 然而因為妳已經盡了力," }
  { key:PHRASE_great_festival_refuse_reason_P_A, text: "因為妳忽視法老王為[god]在[city_name]所舉辦之盛大慶典, 並沒有將所需之[amount][item]運送來," }
  { key:PHRASE_great_festival_refuse_reason_P_B, text: "妳忽視法老王所需之[amount][item],它是用來為[god]在[city_name]舉辦慶典之用的.   而且," }
  { key:PHRASE_great_festival_refuse_reason_P_C, text: "雖然妳忽視法老王所需之[amount][item],它是用來為[god]在[city_name]舉辦慶典之用的," }
  { key:PHRASE_great_festival_refuse_reason_C_A, text: "因為妳毫不重視[city_name]對為[god]所舉辦之盛大慶典所需之[amount][item]," }
  { key:PHRASE_great_festival_refuse_reason_C_B, text: "妳毫不重視[city_name]對於為[god]所舉辦之盛大慶典所需之[amount][item].   同時," }
  { key:PHRASE_great_festival_refuse_reason_C_C, text: "雖然妳毫不重視[city_name]對於為[god]所舉辦之盛大慶典所需之[amount][item]," }
  { key:PHRASE_great_festival_no_reason_P_A, text: "因為法老王為了顯示對神明的崇敬," }
  { key:PHRASE_great_festival_no_reason_P_B, text: "因為[god]仍然不能感到十分滿意," }
  { key:PHRASE_great_festival_no_reason_P_C, text: "" }
  { key:PHRASE_great_festival_no_reason_C_A, text: "因為[city_name]受到[god]的祝福," }
  { key:PHRASE_great_festival_no_reason_C_B, text: "因為[god]仍然不能感到十分滿意," }
  { key:PHRASE_great_festival_no_reason_C_C, text: "" }
  { key:PHRASE_project_title_P, text: "為法老而建" }
  { key:PHRASE_project_title_C, text: "建設工程" }
  { key:PHRASE_project_initial_announcement_P, text: "[greeting] [player_name], [reason_phrase] 法老正在建設的東西十分龐大，他需要妳送 [amount] [item] 至 [city_name] 在 [time_allotted] 月內. 不管是什麼項目，它肯定會增加埃及的榮耀。" }
  { key:PHRASE_project_initial_announcement_C, text: "[greeting] [player_name], [reason_phrase] 城市 [city_name] 在上一個重點建設項目，請您發送 [amount] [item] 在 [time_allotted] 月內。" }
  { key:PHRASE_project_reminder_P, text: "[greeting] [player_name], 法老王即將暴走. 妳還沒把 [amount] [item] 送到 [city_name] ，妳還有6個月完成法老王的要求" }
  { key:PHRASE_project_reminder_C, text: "[greeting] [player_name], [city_name] 需要 [amount] [item] 來完成他的建設項目. 6個月內發送貨物, 不然他們市長要不爽了." }
  { key:PHRASE_project_overdue_P, text: "[greeting] [player_name], 法老王反感於妳的傲慢. 妳未準時發送 [amount] [item] 至 [city_name] 。亡羊補牢，趕緊送貨，妳還能保全點面子." }
  { key:PHRASE_project_overdue_C, text: "[greeting] [player_name], [city_name] 正準備向法老王打妳的小報告. 因為妳沒有及時將 [amount] [item] 送到，他們的工程要完不成鳥。如果妳趕緊送貨, 使得[city_name] 能夠及時完成工程，他們或許會保持安靜." }
  { key:PHRASE_project_warning_P, text: "[greeting] [player_name], 一個爛尾項目使法老王感到尷尬. 妳還有6個月將 [amount] [item] 送到 [city_name]，否則法老王將把恥辱分享給妳，哼哼." }
  { key:PHRASE_project_warning_C, text: "[greeting] [player_name], 妳還有6個月將 [amount] [item] 送到[city_name] ，如果妳不發送這些貨物, 他們不會說啥，僅會策劃進行一番報復." }
  { key:PHRASE_project_comply_reason_P_A, text: "因為妳發送了 [amount] [item] 給 [city_name],法老王的工程順利完工鳥" }
  { key:PHRASE_project_comply_reason_P_B, text: "妳發送的 [amount] [item] 使 [city_name]的工程順利完工." }
  { key:PHRASE_project_comply_reason_P_C, text: "妳發送的 [amount] [item] 讓 [city_name]的工程按時完工." }
  { key:PHRASE_project_comply_reason_C_A, text: "因為妳的幫助， [city_name] 成功完成了工程，感謝那 [amount] [item]," }
  { key:PHRASE_project_comply_reason_C_B, text: "妳幫[city_name] 按時完成了工程，通過發送 [amount] [item]，順便說一句，" }
  { key:PHRASE_project_comply_reason_C_C, text: "雖然妳幫助 [city_name] 順利完成了工程，通過發送 [amount] [item]," }
  { key:PHRASE_project_too_late_reason_P_A, text: "因為妳使法老王在 [city_name] 的工程等待[amount] [item]太久," }
  { key:PHRASE_project_too_late_reason_P_B, text: "法老王在 [city_name] 的工程停工了，因為等不到他向妳要的 [amount] [item] . 此外," }
  { key:PHRASE_project_too_late_reason_P_C, text: "盡管法老王在[city_name]的工程等待[amount] [item]很久了, 妳的努力還是得到了贊賞, 並因此" }
  { key:PHRASE_project_too_late_reason_C_A, text: "因為妳拖延，不發送[city_name] [amount] [item]," }
  { key:PHRASE_project_too_late_reason_C_B, text: "妳拖延發送給 [city_name] 所需要的 [amount] [item] ，順便說一句" }
  { key:PHRASE_project_too_late_reason_C_C, text: "即使發送[city_name] 的 [amount] [item] 工作擱置了, 妳的努力依然得到贊賞, 並因此" }
  { key:PHRASE_project_refuse_reason_P_A, text: "因為妳拒絕了法老王在 [city_name]那�� [amount] [item] 的重要需求，" }
  { key:PHRASE_project_refuse_reason_P_B, text: "妳不明智地拒絕了法老王在[city_name] [amount] [item] 的工程需要. 此外," }
  { key:PHRASE_project_refuse_reason_P_C, text: "妳降低法老王在[city_name] [amount] [item] 的工程需要雖然是不明智的," }
  { key:PHRASE_project_refuse_reason_C_A, text: "因為妳回絕了 [city_name] 所要求的 [amount] [item]," }
  { key:PHRASE_project_refuse_reason_C_B, text: "妳回絕了 [city_name]所要求的 [amount] [item]. 此外," }
  { key:PHRASE_project_refuse_reason_C_C, text: "雖然妳回絕了[city_name] 所要求的 [amount] [item]," }
  { key:PHRASE_project_no_reason_P_A, text: "以慶祝他的許多成就," }
  { key:PHRASE_project_no_reason_P_B, text: "因為還有許多工作要做" }
  { key:PHRASE_project_no_reason_P_C, text: "" }
  { key:PHRASE_project_no_reason_C_A, text: "以紀唸埃及的榮耀," }
  { key:PHRASE_project_no_reason_C_B, text: "因為還有許多工作要做" }
  { key:PHRASE_project_no_reason_C_C, text: "" }
  { key:PHRASE_famine_title_P, text: "饑荒" }
  { key:PHRASE_famine_title_C, text: "饑荒" }
  { key:PHRASE_famine_initial_announcement_P, text: "[greeting] [player_name], [reason_phrase] 饑荒襲擊了[city_name]. 法老王要求妳提供幫助. 妳有 [time_allotted] 來發送 [amount] [item] 給他們來減輕百姓的苦難." }
  { key:PHRASE_famine_initial_announcement_C, text: "[greeting] [player_name], [reason_phrase] 饑荒襲擊了[city_name], 它的市民在挨餓. 發送[amount] [item] 在 [time_allotted] 月內. 生命受到威脅！" }
  { key:PHRASE_famine_reminder_P, text: "[greeting] [player_name], 法老王問妳有沒有良心.  妳還沒發送 [amount] [item] 給 [city_name], 它的市民快頂不住了. 妳還有 6 個月來完成法老王的需求." }
  { key:PHRASE_famine_reminder_C, text: "[greeting] [player_name],  [city_name] 的市民餓得內牛滿面, 妳還沒發送 [amount] [item]. 6個月內發送物資, 否則饑者的哀泣將變成對死者的悲傷." }
  { key:PHRASE_famine_overdue_P, text: "[greeting] [player_name], 法老王對妳心生不滿. 妳對同胞的饑餓無動於衷. 妳該發送[amount] [item] 至 [city_name] 來改變法老王對妳的看法." }
  { key:PHRASE_famine_overdue_C, text: "[greeting] [player_name], 饑餓的呼聲被置若罔聞. 妳未準時發送[amount] [item] 至[city_name] . 遲到總比不到好，如果您發送食品，無論如何，妳還可能提供一些幫助." }
  { key:PHRASE_famine_warning_P, text: "[greeting] [player_name], 6個月內如果妳再不發送[amount] [item]至 [city_name] , 法老王要對妳不客氣了." }
  { key:PHRASE_famine_warning_C, text: "[greeting] [player_name], [city_name] 的市民想知道妳是否是冷酷無情的.  妳僅有6個月發送 [amount] [item] 去減輕他們的痛苦. 拒絕他們, 他們就要挂掉了." }
  { key:PHRASE_famine_comply_reason_P_A, text: "因為妳遵旨迅速發送[amount] [item] 給 [city_name], " }
  { key:PHRASE_famine_comply_reason_P_B, text: "妳遵旨迅速發送 [amount] [item]給 [city_name]是明智的,現在" }
  { key:PHRASE_famine_comply_reason_P_C, text: "盡管妳遵旨發送 [amount] [item] 給 [city_name],仍然" }
  { key:PHRASE_famine_comply_reason_C_A, text: "因為妳發送[amount] [item] 給 [city_name]，市民們總算有點東西果腹了," }
  { key:PHRASE_famine_comply_reason_C_B, text: "妳發送[amount] [item] 給 [city_name] 填飽了饑荒中的市民的肚子. 此外，據報告" }
  { key:PHRASE_famine_comply_reason_C_C, text: "雖然妳發送 [amount] [item] 給 [city_name] 幫助他們度過饑荒, 但是" }
  { key:PHRASE_famine_too_late_reason_P_A, text: "[city_name]等待妳發送 [amount] [item]等得望眼慾穿," }
  { key:PHRASE_famine_too_late_reason_P_B, text: "[city_name] 等待妳發送 [amount] [item] 等得痛苦不堪. 此外, 據報告" }
  { key:PHRASE_famine_too_late_reason_P_C, text: "雖然妳發送給 [city_name] 的[amount] [item] 來得太晚, 但總算有些幫助, 所以" }
  { key:PHRASE_famine_too_late_reason_C_A, text: "因為妳發送 [amount] [item] 給 [city_name]時間太長," }
  { key:PHRASE_famine_too_late_reason_C_B, text: "妳發送 [amount] [item] 給 [city_name]太遲, 他們痛苦不堪. 更重要的是," }
  { key:PHRASE_famine_too_late_reason_C_C, text: "雖然妳發送 [amount] [item] 給 [city_name]太遲, 那些食物總算有助於緩解饑荒,所以" }
  { key:PHRASE_famine_refuse_reason_P_A, text: "因為妳躲避發送[city_name] [amount] [item]," }
  { key:PHRASE_famine_refuse_reason_P_B, text: "妳躲避發送[city_name] [amount] [item]是不明智的. 另外,據報告" }
  { key:PHRASE_famine_refuse_reason_P_C, text: "妳躲避法老和他在[city_name]的人民, 不發送[amount] [item],盡管這樣" }
  { key:PHRASE_famine_refuse_reason_C_A, text: "因為妳無視 [city_name] 要求的[amount] [item]," }
  { key:PHRASE_famine_refuse_reason_C_B, text: "妳無視 [city_name] 要求的[amount] [item],另據報告" }
  { key:PHRASE_famine_refuse_reason_C_C, text: "即使妳無視 [city_name] 要求的[amount] [item]," }
  { key:PHRASE_famine_no_reason_P_A, text: "法老的子民眉頭大皺" }
  { key:PHRASE_famine_no_reason_P_B, text: "麻煩繼續上升，因為" }
  { key:PHRASE_famine_no_reason_P_C, text: "" }
  { key:PHRASE_famine_no_reason_C_A, text: "[city_name]正在失去希望，因為" }
  { key:PHRASE_famine_no_reason_C_B, text: "麻煩繼續上升，因為" }
  { key:PHRASE_famine_no_reason_C_C, text: "" }
  { key:PHRASE_threat_title_P, text: "法老的勒索" }
  { key:PHRASE_threat_title_C, text: "另一個城市的勒索" }
  { key:PHRASE_threat_initial_announcement_P, text: "[greeting] [player_name], [reason_phrase] 法老命令妳發送 [amount] [item] 至[city_name] 在 [time_allotted] 月內. 否則他將打上門來." }
  { key:PHRASE_threat_initial_announcement_C, text: "[greeting] [player_name], [reason_phrase] 城市[city_name] 要妳發送 [amount] [item] 在 [time_allotted]月內. 如果妳拒絕請求, [city_name] 將攻打妳的城市." }
  { key:PHRASE_threat_reminder_P, text: "[greeting] [player_name], 驕傲的法老不久將責令其有凝聚力的部隊攻擊. 妳必須在6個月內發送 [amount] [item] 至 [city_name] 以避免不愉快." }
  { key:PHRASE_threat_reminder_C, text: "[greeting] [player_name], [city_name] 的部隊渴望戰爭. 如果妳在6個月內發送[amount] [item] ,該市將停止其侵略行為。不過它的士兵將非常失望." }
  { key:PHRASE_threat_overdue_P, text: "[greeting] [player_name], 妳的時間已經耗盡, 法老渴望鮮血. 您可能仍然有機會使他的部隊留在海灣，如果您立即發送[amount] [item] 至 [city_name] 的話." }
  { key:PHRASE_threat_overdue_C, text: "[greeting] [player_name], 戰爭的哭喊已經可聞， [city_name] 正在準備屠戮妳的城市. 立即發送 [amount] [item]至 [city_name] 的話，他們可能會有一絲憐憫之心." }
  { key:PHRASE_threat_warning_P, text: "[greeting] [player_name], 虛榮的法老急於述諸武力，他的軍隊正充分準備，但是妳可以拯救妳的城市來避免一場大屠殺，如果妳在6個月內給他 [amount] [item] . 否則，準備讓妳的人民流血吧." }
  { key:PHRASE_threat_warning_C, text: "[greeting] [player_name], [city_name]的征服部隊正在行軍. 如果妳在6個月內發送 [amount] [item]，攻擊部隊可以考慮離開妳的城市." }
  { key:PHRASE_threat_comply_reason_P_A, text: "因為妳已發生 [amount] [item]至 [city_name]," }
  { key:PHRASE_threat_comply_reason_P_B, text: "妳已發生[amount] [item]至 [city_name]. 此外, 據報告" }
  { key:PHRASE_threat_comply_reason_P_C, text: "即使妳做到了法老的[city_name]的要求," }
  { key:PHRASE_threat_comply_reason_C_A, text: "因為妳已恭敬地向 [city_name] 發送 [amount] [item]," }
  { key:PHRASE_threat_comply_reason_C_B, text: "妳已恭敬地向 [city_name] 發送 [amount] [item]. 此外, 似乎" }
  { key:PHRASE_threat_comply_reason_C_C, text: "即使妳已向 [city_name] 發送[amount] [item], 然而" }
  { key:PHRASE_threat_too_late_reason_P_A, text: "發送 [amount] [item] 至 [city_name]的延遲在考驗法老的耐心,因而" }
  { key:PHRASE_threat_too_late_reason_P_B, text: "發送 [amount] [item] 至 [city_name]的延遲在考驗法老的耐心. 另外:" }
  { key:PHRASE_threat_too_late_reason_P_C, text: "發送 [amount] [item] 至 [city_name]的延遲在考驗法老的耐心, 但妳的努力得到贊賞. 此外" }
  { key:PHRASE_threat_too_late_reason_C_A, text: "因為妳低估了[city_name]的威脅，並沒有很快發送[amount] [item]，" }
  { key:PHRASE_threat_too_late_reason_C_B, text: "妳低估了[city_name]的威脅，並沒有很快發送[amount] [item]，但那是過去，現在" }
  { key:PHRASE_threat_too_late_reason_C_C, text: "妳冒了很大的險不迅速發送[amount] [item] 至 [city_name] .盡管如此，看在妳盡力了的份上," }
  { key:PHRASE_threat_refuse_reason_P_A, text: "因為妳違抗法老發送 [amount] [item] 至 [city_name]的命令," }
  { key:PHRASE_threat_refuse_reason_P_B, text: "妳違抗法老發送 [amount] [item] 至 [city_name]的命令,此外," }
  { key:PHRASE_threat_refuse_reason_P_C, text: "盡管妳拒絕了法拉要求發送 [amount] [item] 至 [city_name]的威脅," }
  { key:PHRASE_threat_refuse_reason_C_A, text: "因為妳明知危險仍拒絕發送 [amount] [item] 至 [city_name]," }
  { key:PHRASE_threat_refuse_reason_C_B, text: "妳明知危險仍拒絕發送 [amount] [item] 至 [city_name]，妳也應該知道" }
  { key:PHRASE_threat_refuse_reason_C_C, text: "雖然妳明知危險仍拒絕發送 [amount] [item] 至 [city_name]," }
  { key:PHRASE_threat_no_reason_P_A, text: "因為他心情不好," }
  { key:PHRASE_threat_no_reason_P_B, text: "法老的心情不好，而且似乎沒有結束," }
  { key:PHRASE_threat_no_reason_P_C, text: "" }
  { key:PHRASE_threat_no_reason_C_A, text: "因為 [city_name] 私慾的榮耀," }
  { key:PHRASE_threat_no_reason_C_B, text: "似乎 [city_name]永不滿足," }
  { key:PHRASE_threat_no_reason_C_C, text: "" }
  { key:PHRASE_eg_city_falls_title, text: "埃及城市淪陷" }
  { key:PHRASE_eg_city_falls_initial_announcement, text: "[greeting] [player_name], [reason_phrase] 強大的 [city_name]被我們的敵人攻陷了." }
  { key:PHRASE_eg_city_falls_reason_A, text: "因為[city_name] 被侵略勢力攻陷了," }
  { key:PHRASE_eg_city_falls_reason_B, text: "[city_name] 被侵略勢力攻陷了，此外," }
  { key:PHRASE_eg_city_falls_reason_C, text: "即使 [city_name] 被侵略勢力攻陷了," }
  { key:PHRASE_eg_city_falls_no_reason_A, text: "[city_name]的災禍:" }
  { key:PHRASE_eg_city_falls_no_reason_B, text: "看起來 [city_name] 的麻煩永無止盡" }
  { key:PHRASE_eg_city_falls_no_reason_C, text: "" }
  { key:PHRASE_foreign_city_conquered_title, text: "攻占外國城市" }
  { key:PHRASE_foreign_city_conquered_initial_announcement, text: "[greeting] [player_name], [reason_phrase] 埃及成功征服了著名的 [city_name],進一步擴大了我們的影響！" }
  { key:PHRASE_foreign_city_conquered_reason_A, text: "因為外國城市 [city_name] 已經被我們的軍隊征服," }
  { key:PHRASE_foreign_city_conquered_reason_B, text: "外國城市 [city_name] 已經被我們的軍隊征服! 現在," }
  { key:PHRASE_foreign_city_conquered_reason_C, text: "即使外國城市 [city_name] 已經被我們的軍隊征服," }
  { key:PHRASE_foreign_city_conquered_no_reason_A, text: "因為我們強大的武力," }
  { key:PHRASE_foreign_city_conquered_no_reason_B, text: "我們的王國的力量繼續增長。現在" }
  { key:PHRASE_foreign_city_conquered_no_reason_C, text: "" }
  { key:PHRASE_route_opened_title, text: "開辟新商路" }
  { key:PHRASE_route_opened_initial_announcement, text: "[greeting] [player_name], [reason_phrase] 一個至 [city_name] 的新商路開通了." }
  { key:PHRASE_route_opened_reason_A, text: "因為一個至 [city_name] 的新商路開通了," }
  { key:PHRASE_route_opened_reason_B, text: "一個至 [city_name] 的新商路開通了，同時" }
  { key:PHRASE_route_opened_reason_C, text: "即使與 [city_name]的貿易成為可能," }
  { key:PHRASE_route_opened_no_reason_A, text: "因為外交活動," }
  { key:PHRASE_route_opened_no_reason_B, text: "很快就會發生變化，" }
  { key:PHRASE_route_opened_no_reason_C, text: "" }
  { key:PHRASE_route_closed_title, text: "商路關閉" }
  { key:PHRASE_route_closed_initial_announcement, text: "[greeting] [player_name], [reason_phrase] 至 [city_name] 的商路被關閉了." }
  { key:PHRASE_route_closed_reason_A, text: "因為至 [city_name] 的商路被關閉了," }
  { key:PHRASE_route_closed_reason_B, text: "至 [city_name] 的商路被關閉了,此外，" }
  { key:PHRASE_route_closed_reason_C, text: "即使至 [city_name] 的商路被關閉了," }
  { key:PHRASE_route_closed_no_reason_A, text: "因為政治不穩定," }
  { key:PHRASE_route_closed_no_reason_B, text: "這應當被預見，看來" }
  { key:PHRASE_route_closed_no_reason_C, text: "" }
  { key:PHRASE_siege_reason_B, text: "[city_name] 被圍困，同時" }
  { key:PHRASE_siege_reason_C, text: "即使 [city_name] 被圍困," }
  { key:PHRASE_siege_no_reason_B, text: "他們的麻煩顯然未結束，因為" }
  { key:PHRASE_siege_no_reason_C, text: "" }
  { key:PHRASE_eg_city_saved_title, text: "埃及城市被拯救" }
  { key:PHRASE_eg_city_saved_initial_announcement, text: "[greeting] [player_name], [reason_phrase] [city_name] 被我們的軍隊拯救了. " }
  { key:PHRASE_eg_city_saved_reason_A, text: "因為 [city_name] 被我們的軍隊拯救了," }
  { key:PHRASE_eg_city_saved_reason_B, text: "[city_name] 被我們的軍隊拯救了!  現在," }
  { key:PHRASE_eg_city_saved_reason_C, text: "即使 [city_name] 被我們的軍隊拯救了," }
  { key:PHRASE_eg_city_saved_no_reason_A, text: "因為埃及軍隊英勇的努力," }
  { key:PHRASE_eg_city_saved_no_reason_B, text: "戰爭的潮汐來回擺動，現在" }
  { key:PHRASE_eg_city_saved_no_reason_C, text: "" }
  { key:PHRASE_battle_won_title, text: "勝利之戰" }
  { key:PHRASE_battle_won_initial_announcement, text: "[greeting] [player_name], [reason_phrase] 埃及軍隊獲得了勝利!" }
  { key:PHRASE_battle_won_reason_A, text: "因為我們的部隊遠征 [city_name]獲得了勝利," }
  { key:PHRASE_battle_won_reason_B, text: "我們的部隊遠征 [city_name]獲得了勝利，現在" }
  { key:PHRASE_battle_won_reason_C, text: "即使我們的部隊遠征 [city_name]獲得了勝利" }
  { key:PHRASE_battle_won_no_reason_A, text: "因為訓練有素的部隊在遙遠的城市[city_name]的活力," }
  { key:PHRASE_battle_won_no_reason_B, text: "在[city_name]奇跡似乎永遠不會停止" }
  { key:PHRASE_battle_won_no_reason_C, text: "" }
  { key:PHRASE_battle_lost_title, text: "埃及軍隊打了敗仗" }
  { key:PHRASE_battle_lost_initial_announcement, text: "[greeting] [player_name], [reason_phrase] 埃及軍隊在[city_name]打了敗仗. " }
  { key:PHRASE_battle_lost_reason_A, text: "因為埃及軍隊在[city_name]打了敗仗," }
  { key:PHRASE_battle_lost_reason_B, text: "埃及軍隊在[city_name]打了敗仗,更何況" }
  { key:PHRASE_battle_lost_reason_C, text: "即使埃及軍隊在[city_name]打了敗仗," }
  { key:PHRASE_battle_lost_no_reason_A, text: "大不幸已經降臨部隊" }
  { key:PHRASE_battle_lost_no_reason_B, text: "戰爭是如此可怕的不可預知的，可惜" }
  { key:PHRASE_battle_lost_no_reason_C, text: "" }
  { key:PHRASE_acknowledgement_title, text: "屈服" }
  { key:PHRASE_acknowledgement_initial_announcement, text: "[greeting] [player_name], [reason_phrase] 妳的城市現在是安全的了." }
  { key:PHRASE_acknowledgement_reason_A, text: "因為妳乖乖屈服於威脅," }
  { key:PHRASE_acknowledgement_reason_B, text: "妳乖乖屈服於威脅," }
  { key:PHRASE_acknowledgement_reason_C, text: "即使妳乖乖屈服於威脅," }
  { key:PHRASE_acknowledgement_no_reason_A, text: "因為改變主意," }
  { key:PHRASE_acknowledgement_no_reason_B, text: "沒有什麼是永遠確定的, 但" }
  { key:PHRASE_acknowledgement_no_reason_C, text: "" }
  { key:PHRASE_pharaoh_attacks_you_title, text: "法老的軍隊襲擊" }
  { key:PHRASE_pharaoh_attacks_you_initial_announcement, text: "[greeting] [player_name], [reason_phrase] 法老的軍隊正在移動，將在[time_until_attack]月內到達妳的城市." }
  { key:PHRASE_pharaoh_attacks_you_2year_reminder, text: "[greeting] [player_name], [reason_phrase] 法老的軍隊正在靠近，將在2年內到達妳的城市." }
  { key:PHRASE_pharaoh_attacks_you_1year_reminder, text: "[greeting] [player_name], [reason_phrase] 法老的軍隊正在靠近，將在1年內到達妳的城市." }
  { key:PHRASE_pharaoh_attacks_you_6month_warning, text: "[greeting] [player_name], [reason_phrase] 法老的軍隊正在靠近，將在6個月內到達妳的城市." }
  { key:PHRASE_pharaoh_attacks_you_1month_warning, text: "[greeting] [player_name], [reason_phrase] 法老的軍隊正在靠近，將在1個月內到達妳的城市." }
  { key:PHRASE_pharaoh_attacks_you_city_attacked_alert, text: "[greeting] [player_name], 法老的軍隊已到門口！" }
  { key:PHRASE_pharaoh_attacks_you_reason_A, text: "因為妳的城市被法老的軍隊襲擊," }
  { key:PHRASE_pharaoh_attacks_you_reason_B, text: "妳的城市已遭到法老的軍隊。更何況" }
  { key:PHRASE_pharaoh_attacks_you_reason_C, text: "即使妳的城市已被法老的軍隊襲擊," }
  { key:PHRASE_pharaoh_attacks_you_no_reason_A, text: "法老的行為有時僅有他自己知道理由. " }
  { key:PHRASE_pharaoh_attacks_you_no_reason_B, text: "法老是不可預測的。現在," }
  { key:PHRASE_pharaoh_attacks_you_no_reason_C, text: "因為您在王國的地位已經下降到如此低," }
  { key:PHRASE_eg_city_attacks_you_title, text: "埃及軍隊攻擊" }
  { key:PHRASE_eg_city_attacks_you_initial_announcement, text: "[greeting] [player_name], [reason_phrase] 一支埃及軍隊將在[time_until_attack]月內攻打上門." }
  { key:PHRASE_eg_city_attacks_you_2year_reminder, text: "[greeting] [player_name], [reason_phrase] 一支埃及軍隊正在行軍，將在2年內到達妳的城市.                " }
  { key:PHRASE_eg_city_attacks_you_1year_reminder, text: "[greeting] [player_name], [reason_phrase] 妳的城市將會在1年內受到一支埃及軍隊的衝擊." }
  { key:PHRASE_eg_city_attacks_you_6month_warning, text: "[greeting] [player_name], [reason_phrase] 一支埃及軍隊正在靠近，6個月內將到達妳的城市.    " }
  { key:PHRASE_eg_city_attacks_you_1month_warning, text: "[greeting] [player_name], [reason_phrase] 一支埃及軍隊正接近邊界，1個月內將到達妳的城市." }
  { key:PHRASE_eg_city_attacks_you_city_attacked_alert, text: "[greeting] [player_name], 埃及軍隊打上門來了!" }
  { key:PHRASE_eg_city_attacks_you_reason_A, text: "因為妳的城市被埃及軍隊襲擊," }
  { key:PHRASE_eg_city_attacks_you_reason_B, text: "埃及軍隊正在攻擊妳的城市! 此外" }
  { key:PHRASE_eg_city_attacks_you_reason_C, text: "即使妳的城市已經被埃及軍隊的襲擊," }
  { key:PHRASE_eg_city_attacks_you_no_reason_A, text: "請注意:" }
  { key:PHRASE_eg_city_attacks_you_no_reason_B, text: "開戰的時機已經到來，因為" }
  { key:PHRASE_eg_city_attacks_you_no_reason_C, text: "因為您在王國的聲譽是如此之低，" }
  { key:PHRASE_foreign_army_attacks_you_title, text: "外國軍隊入侵" }
  { key:PHRASE_foreign_army_attacks_you_initial_announcement, text: "[greeting] [player_name], [reason_phrase] [a_foreign_army]將在[time_until_attack]月內到達妳的城市." }
  { key:PHRASE_foreign_army_attacks_you_2year_reminder, text: "[greeting] [player_name], [reason_phrase]在2年內[a_foreign_army]將抵達妳的門口." }
  { key:PHRASE_foreign_army_attacks_you_1year_reminder, text: "[greeting] [player_name], [reason_phrase] [a_foreign_army]渴望入侵，並會在一年內達到妳的城市." }
  { key:PHRASE_foreign_army_attacks_you_6month_warning, text: "[greeting] [player_name], [reason_phrase] [a_foreign_army]將在6個月內到達妳的城市，對他們的到來做好準備." }
  { key:PHRASE_foreign_army_attacks_you_1month_Warning, text: "[greeting] [player_name], [reason_phrase] [a_foreign_army]征服者將在1個月內抵達妳的城市." }
  { key:PHRASE_foreign_army_attacks_you_city_attacked_alert, text: "[greeting] [player_name], [a_foreign_army] 打上門了，他們決心摧毀這個城市!" }
  { key:PHRASE_foreign_army_attacks_you_reason_A, text: "因為妳的城市被[a_foreign_army]攻擊," }
  { key:PHRASE_foreign_army_attacks_you_reason_B, text: "妳的城市被[a_foreign_army]攻擊,現在" }
  { key:PHRASE_foreign_army_attacks_you_reason_C, text: "雖然妳的城市被[a_foreign_army]攻擊," }
  { key:PHRASE_foreign_army_attacks_you_no_reason_A, text: "因為帝國的夢想," }
  { key:PHRASE_foreign_army_attacks_you_no_reason_B, text: "似乎總有麻煩，因為" }
  { key:PHRASE_foreign_army_attacks_you_no_reason_C, text: "" }
  { key:PHRASE_rating_change_title_I, text: "王國評價提升" }
  { key:PHRASE_rating_change_initial_announcement_I, text: "[greeting] [player_name], [reason_phrase]妳在埃及人民中變得更受歡迎,妳的王國評價提升了." }
  { key:PHRASE_rating_change_reason_I_A, text: "因為您的王國聲譽最近有所增加," }
  { key:PHRASE_rating_change_reason_I_B, text: "您的王國聲譽最近有所增加，現在" }
  { key:PHRASE_rating_change_reason_I_C, text: "您的王國聲譽最近有所增加，但是" }
  { key:PHRASE_rating_change_no_reason_I_A, text: "因為日子好過了," }
  { key:PHRASE_rating_change_no_reason_I_B, text: "這是個好消息，因為" }
  { key:PHRASE_rating_change_no_reason_I_C, text: "妳城市在戰爭中的犧牲使埃及人民大受感動，結果" }
  { key:PHRASE_rating_change_title_D, text: "王國評價降低" }
  { key:PHRASE_rating_change_initial_announcement_D, text: "[greeting] [player_name], [reason_phrase] 埃及人民不喜歡妳,妳的王國評價降低了." }
  { key:PHRASE_rating_change_reason_D_A, text: "因為妳的王國排名已經下降到如此低," }
  { key:PHRASE_rating_change_reason_D_B, text: "妳的聲望屬於整個王國，現在" }
  { key:PHRASE_rating_change_reason_D_C, text: "即使妳變得越來越不受歡迎," }
  { key:PHRASE_rating_change_no_reason_D_A, text: "因為在王國中的不滿情緒," }
  { key:PHRASE_rating_change_no_reason_D_B, text: "這是個壞消息，因為" }
  { key:PHRASE_rating_change_no_reason_D_C, text: "妳的同胞不同意妳的暴力方式，結果" }
  { key:PHRASE_price_change_title_I, text: "提價" }
  { key:PHRASE_price_change_initial_announcement_I, text: "[greeting] [player_name], [reason_phrase] [item]的價格上漲. 進口此貨物要花更多的錢,但出口也會賺更多." }
  { key:PHRASE_price_change_reason_I_A, text: "因為[item]漲價了," }
  { key:PHRASE_price_change_reason_I_B, text: "[item]漲價了，此外" }
  { key:PHRASE_price_change_reason_I_C, text: "雖然價格上漲了," }
  { key:PHRASE_price_change_no_reason_I_A, text: "因為各地的供應減少了," }
  { key:PHRASE_price_change_no_reason_I_B, text: "隨著市場不斷改變" }
  { key:PHRASE_price_change_no_reason_I_C, text: "" }
  { key:PHRASE_price_change_title_D, text: "降價" }
  { key:PHRASE_price_change_initial_announcement_D, text: "[greeting] [player_name], [reason_phrase][item]的價格下跌. 這會使得出口利潤下降." }
  { key:PHRASE_price_change_reason_D_A, text: "因為[item]的價格下跌," }
  { key:PHRASE_price_change_reason_D_B, text: "價格下跌了，此外" }
  { key:PHRASE_price_change_reason_D_C, text: "雖然價格下跌了," }
  { key:PHRASE_price_change_no_reason_D_A, text: "因為王國供過於求," }
  { key:PHRASE_price_change_no_reason_D_B, text: "隨著市場不斷改變" }
  { key:PHRASE_price_change_no_reason_D_C, text: "" }
  { key:PHRASE_demand_change_title_I, text: "增加貿易" }
  { key:PHRASE_demand_change_initial_announcement_I, text: "[greeting] [player_name], [reason_phrase] [city_name]希望交易更多的[item]." }
  { key:PHRASE_demand_change_reason_I_A, text: "因為[city_name]希望交易更多的[item]," }
  { key:PHRASE_demand_change_reason_I_B, text: "[city_name]現在希望交易更多的[item].更何況," }
  { key:PHRASE_demand_change_reason_I_C, text: "雖然[city_name]希望交易更多的[item]," }
  { key:PHRASE_demand_change_no_reason_I_A, text: "因為[city_name]在發展," }
  { key:PHRASE_demand_change_no_reason_I_B, text: "隨著時代的變化，" }
  { key:PHRASE_demand_change_no_reason_I_C, text: "" }
  { key:PHRASE_demand_change_title_D, text: "減少貿易" }
  { key:PHRASE_demand_change_initial_announcement_D, text: "[greeting] [player_name], [reason_phrase] [city_name]決定減少[item]的貿易量." }
  { key:PHRASE_demand_change_reason_D_A, text: "因為[city_name]不再交易如此之多的[item]," }
  { key:PHRASE_demand_change_reason_D_B, text: "[city_name]交易減少，此外" }
  { key:PHRASE_demand_change_reason_D_C, text: "雖然[city_name]交易減少," }
  { key:PHRASE_demand_change_no_reason_D_A, text: "因為[city_name]的人口減少," }
  { key:PHRASE_demand_change_no_reason_D_B, text: "隨著時代的變化，" }
  { key:PHRASE_demand_change_no_reason_D_C, text: "" }
  { key:PHRASE_earthquake_title, text: "地震!" }
  { key:PHRASE_earthquake_initial_announcement, text: "[greeting] [player_name], [reason_phrase]我們腳下的沙層發生變化，地貌變遷.盡可能救援妳的城市和市民." }
  { key:PHRASE_earthquake_reason_A, text: "因為一場可怕的地震," }
  { key:PHRASE_earthquake_reason_B, text: "除了可怕的地震," }
  { key:PHRASE_earthquake_reason_C, text: "地震雖然可怕" }
  { key:PHRASE_earthquake_no_reason_A, text: "城市感到恐懼，因為" }
  { key:PHRASE_earthquake_no_reason_B, text: "麻煩再次籠罩著城市，" }
  { key:PHRASE_earthquake_no_reason_C, text: "" }
  { key:PHRASE_stormy_seas_title, text: "風暴" }
  { key:PHRASE_stormy_seas_initial_announcement, text: "[greeting] [player_name], [reason_phrase]驚濤駭浪撕裂商船,將有很長一段時間才會有商人冒險裝貨上路，在此之前，水路交易停止了." }
  { key:PHRASE_stormy_seas_reason_A, text: "因為激烈的風暴深不可測," }
  { key:PHRASE_stormy_seas_reason_B, text: "雖然我們深受風暴困擾," }
  { key:PHRASE_stormy_seas_reason_C, text: "盡管可怕的風暴" }
  { key:PHRASE_stormy_seas_no_reason_A, text: "風暴肆虐，" }
  { key:PHRASE_stormy_seas_no_reason_B, text: "我們的麻煩才剛剛開始，因為" }
  { key:PHRASE_stormy_seas_no_reason_C, text: "" }
  { key:PHRASE_sandstorm_title, text: "沙暴" }
  { key:PHRASE_sandstorm_initial_announcement, text: "[greeting] [player_name], [reason_phrase]沙暴掩埋了道路，商人駝隊受困.風停之前，沒有商人能夠通過." }
  { key:PHRASE_sandstorm_reason_A, text: "因為商人不敢再沙暴期間行動，貿易停止了," }
  { key:PHRASE_sandstorm_reason_B, text: "風沙阻擋了商人，此外" }
  { key:PHRASE_sandstorm_reason_C, text: "雖然最近的沙塵暴阻礙了交易," }
  { key:PHRASE_sandstorm_no_reason_A, text: "因為狂風," }
  { key:PHRASE_sandstorm_no_reason_B, text: "沙漠是一個危險的地方，因為" }
  { key:PHRASE_sandstorm_no_reason_C, text: "" }
  { key:PHRASE_wage_change_title_I, text: "工資上漲" }
  { key:PHRASE_wage_change_initial_announcement_I, text: "[greeting] [player_name], [reason_phrase]王國的平均工資上調了，妳再不跟著漲工資，工人們就要跳槽了." }
  { key:PHRASE_wage_change_reason_I_A, text: "因為王國的平均工資上調了," }
  { key:PHRASE_wage_change_reason_I_B, text: "王國的平均工資上調了，另外" }
  { key:PHRASE_wage_change_reason_I_C, text: "雖然王國的平均工資上調了," }
  { key:PHRASE_wage_change_no_reason_I_A, text: "時代在變化，現在" }
  { key:PHRASE_wage_change_no_reason_I_B, text: "有人慶幸，有人抱怨，因為" }
  { key:PHRASE_wage_change_no_reason_I_C, text: "" }
  { key:PHRASE_wage_change_title_D, text: "工資下降" }
  { key:PHRASE_wage_change_initial_announcement_D, text: "[greeting] [player_name], [reason_phrase]王國的平均工資下調了，看來有些地方的工人要失業了." }
  { key:PHRASE_wage_change_reason_D_A, text: "因為王國的平均工資下調了," }
  { key:PHRASE_wage_change_reason_D_B, text: "王國的平均工資下調了,更糟糕的是" }
  { key:PHRASE_wage_change_reason_D_C, text: "雖然王國的平均工資下調了," }
  { key:PHRASE_wage_change_no_reason_D_A, text: "試著降工資吧," }
  { key:PHRASE_wage_change_no_reason_D_B, text: "有人歡喜有人愁，因為" }
  { key:PHRASE_wage_change_no_reason_D_C, text: "" }
  { key:PHRASE_bad_water_title, text: "水污染" }
  { key:PHRASE_bad_water_initial_announcement, text: "[greeting] [player_name], [reason_phrase]妳的一些市民因為水污染而生病了，希望問題不會升級." }
  { key:PHRASE_bad_water_reason_A, text: "因為最近的水污染," }
  { key:PHRASE_bad_water_reason_B, text: "最近的水污染相當不幸,現在" }
  { key:PHRASE_bad_water_reason_C, text: "雖然最近水被污染了," }
  { key:PHRASE_bad_water_no_reason_A, text: "霉運籠罩城市，" }
  { key:PHRASE_bad_water_no_reason_B, text: "這是一個不幸的消息，看來" }
  { key:PHRASE_bad_water_no_reason_C, text: "" }
  { key:PHRASE_goldmine_cavein_title, text: "金礦坍塌" }
  { key:PHRASE_goldmine_cavein_initial_announcement, text: "[greeting] [player_name], [reason_phrase]一個金礦坍塌了，我們的建築工程師無力阻止事故的發生. 希望礦下的工人能及時逃出來." }
  { key:PHRASE_goldmine_cavein_reason_A, text: "因為一個金礦坍塌了," }
  { key:PHRASE_goldmine_cavein_reason_B, text: "最近的金礦坍塌事故相當不幸,現在" }
  { key:PHRASE_goldmine_cavein_reason_C, text: "盡管最近一個金礦坍塌了," }
  { key:PHRASE_goldmine_cavein_no_reason_A, text: "因為流沙," }
  { key:PHRASE_goldmine_cavein_no_reason_B, text: "沒有預警," }
  { key:PHRASE_goldmine_cavein_no_reason_C, text: "" }
  { key:PHRASE_landslide_title, text: "滑坡" }
  { key:PHRASE_landslide_initial_announcement, text: "[greeting] [player_name], [reason_phrase]一個嚴重的滑坡阻塞了道路，在道路清通之前，商人們不會來了." }
  { key:PHRASE_landslide_reason_A, text: "因為最近的滑坡," }
  { key:PHRASE_landslide_reason_B, text: "最近的滑坡是災難性的。現在," }
  { key:PHRASE_landslide_reason_C, text: "雖然最近的滑坡是災難性的," }
  { key:PHRASE_landslide_no_reason_A, text: "有可怕的消息:" }
  { key:PHRASE_landslide_no_reason_B, text: "沒有預警" }
  { key:PHRASE_landslide_no_reason_C, text: "" }
  { key:PHRASE_flood_fails_title, text: "泛濫可能不妙" }
  { key:PHRASE_flood_fails_initial_announcement, text: "[greeting] [player_name], [reason_phrase]祭司們帶來壞消息，尼羅河泛濫前景不妙，定期檢查水位標尺,如果祭司們的語言沒有改善，城市要做最壞的打算了." }
  { key:PHRASE_flood_fails_reason_A, text: "因為尼羅河泛濫前景不妙" }
  { key:PHRASE_flood_fails_reason_B, text: "尼羅河泛濫前景不妙，另外" }
  { key:PHRASE_flood_fails_reason_C, text: "雖然尼羅河泛濫前景不妙," }
  { key:PHRASE_flood_fails_no_reason_A, text: "因為非洲幹旱," }
  { key:PHRASE_flood_fails_no_reason_B, text: "我們的麻煩才剛剛開始，因為" }
  { key:PHRASE_flood_fails_no_reason_C, text: "" }
  { key:PHRASE_perfect_flood_title, text: "完美的洪水預期" }
  { key:PHRASE_perfect_flood_initial_announcement, text: "[greeting] [player_name], [reason_phrase]我們受到豐饒的祝福，將會有一場完美的泛濫!請定期檢查水位標尺。如果預測要惡化，城市可能會發現自己沒有準備好." }
  { key:PHRASE_perfect_flood_reason_A, text: "因為將會有一場完美的泛濫," }
  { key:PHRASE_perfect_flood_reason_B, text: "將會有一場完美的泛濫，此外" }
  { key:PHRASE_perfect_flood_reason_C, text: "雖然將會有一場完美的泛濫," }
  { key:PHRASE_perfect_flood_no_reason_A, text: "非洲雨季即將到來，因此" }
  { key:PHRASE_perfect_flood_no_reason_B, text: "很幸運，因為" }
  { key:PHRASE_perfect_flood_no_reason_C, text: "" }
  { key:PHRASE_bedouin_attacks_you_title, text: "貝多因人軍隊的進攻" }
  { key:PHRASE_bedouin_attacks_you_initial_announcement, text: "[greeting] [player_name], [reason_phrase]一支貝多因軍隊正在接近城市，[time_until_attack]月內將會抵達." }
  { key:PHRASE_bedouin_attacks_you_2year_reminder, text: "[greeting] [player_name], [reason_phrase]一支貝多因軍隊正在接近，2年內抵達我們的城市." }
  { key:PHRASE_bedouin_attacks_you_1year_reminder, text: "[greeting] [player_name], [reason_phrase]一支貝多因軍隊正在接近，1年內抵達我們的城市.." }
  { key:PHRASE_bedouin_attacks_you_6month_warning, text: "[greeting] [player_name], [reason_phrase]一支貝多因軍隊正在準備發動戰爭，6個月內抵達我們的城市. " }
  { key:PHRASE_bedouin_attacks_you_1month_warning, text: "[greeting] [player_name], [reason_phrase]一支貝多因軍隊離我們的城市僅有1個月的路程了." }
  { key:PHRASE_bedouin_attacks_you_city_attacked_alert, text: "[greeting] [player_name],一支貝多因軍隊打上門來了!" }
  { key:PHRASE_bedouin_attacks_you_reason_A, text: "因為妳的城市成功地擊退了貝多因人的軍隊," }
  { key:PHRASE_bedouin_attacks_you_reason_B, text: "妳的城市成功地擊退了貝都因人的軍隊，此外" }
  { key:PHRASE_bedouin_attacks_you_reason_C, text: "雖然妳的城市成功地擊退了貝都因人的軍隊," }
  { key:PHRASE_bedouin_attacks_you_no_reason_A, text: "為滿足他們對於財富的慾望," }
  { key:PHRASE_bedouin_attacks_you_no_reason_B, text: "我們的麻煩大了，因為" }
  { key:PHRASE_bedouin_attacks_you_no_reason_C, text: "" }
  { key:PHRASE_gift_title_P, text: "法老的禮物" }
  { key:PHRASE_gift_title_C, text: "一個鄰居的禮物" }
  { key:PHRASE_gift_granted_P, text: "[greeting] [player_name], [reason_phrase]法老下令，妳將收到一份禮物，來自[city_name]的[amount] [item]." }
  { key:PHRASE_gift_granted_C, text: "[greeting] [player_name], [reason_phrase][city_name]希望送妳[amount] [item]作為禮物." }
  { key:PHRASE_gift_cash_granted_P, text: "[greeting] [player_name], [reason_phrase]法老下令[city_name]送妳[amount]戴班幣作為禮物." }
  { key:PHRASE_gift_cash_granted_C, text: "[greeting] [player_name], [reason_phrase][city_name]希望送妳[amount]戴班幣作為禮物." }
  { key:PHRASE_gift_partial_space_P, text: "[greeting] [player_name], [reason_phrase]法老下令[city_name]送妳[amount][item]作為禮物，不過妳的倉庫或谷倉放不下，僅能先收一半." }
  { key:PHRASE_gift_partial_space_C, text: "[greeting] [player_name], [reason_phrase][city_name] 希望送妳[amount][item]作為禮物.不過妳的倉庫或谷倉放不下，僅能先收一半.." }
  { key:PHRASE_gift_insufficient_space_P, text: "[greeting] [player_name], [reason_phrase] 法老下令[city_name]送妳[amount][item]作為禮物，不過妳的倉庫或谷倉放不下，趕緊騰出空間或造新的，準備下個月接受禮物." }
  { key:PHRASE_gift_insufficient_space_C, text: "[greeting] [player_name], [reason_phrase] [city_name] 希望送妳[amount][item]作為禮物.不過妳的倉庫或谷倉放不下，趕緊騰出空間或造新的，準備下個月接受禮物." }
  { key:PHRASE_gift_last_chance_P, text: "[greeting] [player_name], 根據法老的命令，[city_name] 希望送妳[amount][item]作為禮物.不過妳的倉庫或谷倉放不下，送禮使者正在失去耐心，接受這部分禮物吧，他們不會再等下去了." }
  { key:PHRASE_gift_last_chance_C, text: "[greeting] [player_name], [city_name] 希望送妳[amount][item]作為禮物.不過妳的倉庫或谷倉放不下，送禮使者正在失去耐心，接受這部分禮物吧，他們不會再等下去了." }
  { key:PHRASE_gift_forfeited_P, text: "[greeting] [player_name],來自[city_name]的[amount] [item]還是沒地方放，所以禮物被放棄了." }
  { key:PHRASE_gift_forfeited_C, text: "[greeting] [player_name],來自[city_name]的[amount] [item]還是沒地方放，所以禮物被放棄了." }
  { key:PHRASE_gift_accepted_P, text: "妳的倉庫和谷倉裝滿了來自[city_name]的[item]." }
  { key:PHRASE_gift_accepted_C, text: "妳的倉庫和谷倉裝滿了來自[city_name]的[item]." }
  { key:PHRASE_gift_cash_accepted_P, text: "根據法老的命令，[amount_granted]戴班幣被充入妳的國庫." }
  { key:PHRASE_gift_cash_accepted_C, text: "感謝[city_name], [amount_granted]戴班幣被充入妳的國庫." }
  { key:PHRASE_gift_postponed_P, text: "來自[city_name]的使者將在下個月交付[item]." }
  { key:PHRASE_gift_postponed_C, text: "來自[city_name]的使者將在下個月交付[item]." }
  { key:PHRASE_gift_refused_P, text: "雖然妳拒絕了來自[city_name]的[item]，我相信別人可以利用我們的幫助." }
  { key:PHRASE_gift_refused_C, text: "雖然妳拒絕了來自[city_name]的[item]，我相信別人可以利用我們的幫助." }
  { key:PHRASE_gift_accepted_reason_P_A, text: "因為妳接受了來自[city_name]的[amount] [item]。 " }
  { key:PHRASE_gift_accepted_reason_P_B, text: "在妳最近接受[city_name]的禮物之後," }
  { key:PHRASE_gift_accepted_reason_P_C, text: "雖然妳接受了來自[city_name]的[amount] [item]," }
  { key:PHRASE_gift_accepted_reason_C_A, text: "因為妳接受了來自[city_name]的[amount] [item]" }
  { key:PHRASE_gift_accepted_reason_C_B, text: "在妳最近接受[city_name]的禮物之後," }
  { key:PHRASE_gift_accepted_reason_C_C, text: "雖然妳接受了來自[city_name]的[amount] [item]," }
  { key:PHRASE_gift_forfeited_reason_P_A, text: "因為妳拒絕了來自[city_name]的[amount] [item]" }
  { key:PHRASE_gift_forfeited_reason_P_B, text: "妳拒絕了來自[city_name]的[amount] [item],此外" }
  { key:PHRASE_gift_forfeited_reason_P_C, text: "雖然妳拒絕了來自[city_name]的[amount] [item]" }
  { key:PHRASE_gift_forfeited_reason_C_A, text: "因為妳拒絕了來自[city_name]的[amount] [item]" }
  { key:PHRASE_gift_forfeited_reason_C_B, text: "妳拒絕了來自[city_name]的[amount] [item],此外" }
  { key:PHRASE_gift_forfeited_reason_C_C, text: "雖然妳拒絕了來自[city_name]的[amount] [item]" }
  { key:PHRASE_gift_refused_reason_P_A, text: "因為妳拒絕了來自[city_name]的[amount] [item]" }
  { key:PHRASE_gift_refused_reason_P_B, text: "妳拒絕了來自[city_name]的[amount] [item],現在" }
  { key:PHRASE_gift_refused_reason_P_C, text: "雖然妳拒絕了來自[city_name]的[amount] [item]" }
  { key:PHRASE_gift_refused_reason_C_A, text: "因為妳拒絕了來自[city_name]的[amount] [item]" }
  { key:PHRASE_gift_refused_reason_C_B, text: "妳拒絕了來自[city_name]的[amount] [item],現在" }
  { key:PHRASE_gift_refused_reason_C_C, text: "雖然妳拒絕了來自[city_name]的[amount] [item]," }
  { key:PHRASE_gift_no_reason_P_A, text: "因為妳的幫助" }
  { key:PHRASE_gift_no_reason_P_B, text: "因為法老的仁慈," }
  { key:PHRASE_gift_no_reason_P_C, text: "妳的城市在戰鬥中的犧牲使法老大為贊賞。結果" }
  { key:PHRASE_gift_no_reason_C_A, text: "因為妳的幫助" }
  { key:PHRASE_gift_no_reason_C_B, text: "因為埃及人經常幫助他們的鄉親們," }
  { key:PHRASE_gift_no_reason_C_C, text: "妳的城市在戰鬥中的犧牲使埃及人民大為贊賞。結果" }
  { key:PHRASE_pharaoh_attacks_you_disembarked_alert, text: "[greeting] [player_name], [reason_phrase] 法老的軍隊已經抵達妳的城市." }
  { key:PHRASE_eg_city_attacks_you_disembarked_alert, text: "[greeting] [player_name], [reason_phrase]一支埃及軍隊已經登陸!" }
  { key:PHRASE_foreign_army_attacks_you_disembarked_alert, text: "[greeting] [player_name], [reason_phrase] [a_foreign_army]已經登陸並攻擊我們的城市，讓賽特大神救救我們." }
  { key:PHRASE_bedouin_attacks_you_disembarked_alert, text: "[greeting] [player_name], [reason_phrase]一支貝多因軍隊登陸了!" }
  { key:PHRASE_pyramid_congratulations_title, text: "金字塔完成了!" }
  { key:PHRASE_pyramid_congratulations, text: "[greeting] [player_name],這是一個壯觀的成就！經過無數個月的勞動，金字塔終於完成了!" }
  { key:PHRASE_stepped_pyramid_congratulations_title, text: "階梯金字塔完成了!" }
  { key:PHRASE_stepped_pyramid_congratulations, text: "[greeting] [player_name], 階梯金字塔終於完成了! 這紀唸碑將永遠矗立以作為妳能力的證明." }
  { key:PHRASE_bent_pyramid_congratulations_title, text: "彎曲金字塔完成了!" }
  { key:PHRASE_bent_pyramid_congratulations, text: "[greeting] [player_name], 彎曲金字塔完成了! 這是妳的城市一個了不起的偉大成就." }
  { key:PHRASE_mudbrick_pyramid_congratulations_title, text: "泥磚金字塔完成了!" }
  { key:PHRASE_mudbrick_pyramid_congratulations, text: "[greeting] [player_name], 石匠們已完成了閃閃發光的細石灰石外�椌滷膚壑u作，泥磚金字塔終於完成了!" }
  { key:PHRASE_mastaba_congratulations_title, text: "石室墳墓完成了!" }
  { key:PHRASE_mastaba_congratulations, text: "[greeting] [player_name], 最後一塊磚已鋪設到位，石室墳墓現已完成!" }
  { key:PHRASE_sphinx_congratulations_title, text: "獅身人面像完成了!" }
  { key:PHRASE_sphinx_congratulations, text: "[greeting] [player_name], 石匠終於雕刻完成了強大的獅身人面像，此碑將永久守護埃及。" }
  { key:PHRASE_obelisk_congratulations_title, text: "方尖碑完成了!" }
  { key:PHRASE_obelisk_congratulations, text: "[greeting] [player_name], 石匠們結束了方尖碑的收尾工作，它終於完成鳥." }
  { key:PHRASE_sun_temple_congratulations_title, text: "太陽神廟完成了!" }
  { key:PHRASE_sun_temple_congratulations, text: "[greeting] [player_name], 經過許多個月的辛勞，太陽神殿的建設工作終於結束，這是妳的城市的一個偉大成就！" }
  { key:PHRASE_alex_library_congratulations_title, text: "亞歷山大圖書館完成了!" }
  { key:PHRASE_alex_library_congratulations, text: "[greeting] [player_name], 經過許多艱苦勞動，雄偉美麗的亞歷山大圖書館終於落成，它的大門隨時向全世界的學者敞開。" }
  { key:PHRASE_abu_simbel_congratulations_title, text: "阿布辛波神廟完成了!" }
  { key:PHRASE_abu_simbel_congratulations, text: "[greeting] [player_name], 這是一個真正驚人的成就！妳的熟練勞動者創造了一個永�琲漪鰤廎O，向世間昭示法老的自豪和埃及的力量。” ." }
  { key:PHRASE_caesareum_congratulations_title, text: "凱撒大帝館完成了!" }
  { key:PHRASE_caesareum_congratulations, text: "[greeting] [player_name], 神聖的寺廟和宏偉的花園式庭院凱撒大帝館終於完成了！它的宏偉和美麗已經在整個地區傳唱!" }
  { key:PHRASE_lighthouse_congratulations_title, text: "費洛斯燈塔完成了!" }
  { key:PHRASE_lighthouse_congratulations, text: "[greeting] [player_name], 經過血與汗的努力，工人小心地將最後一塊大理石放在了令人驚奇的法羅斯燈塔上！高聳明亮的燈塔，吸引著來自全國各地的貿易商。" }
  { key:PHRASE_mausoleum_congratulations_title, text: "陵墓完成了!" }
  { key:PHRASE_mausoleum_congratulations, text: "[greeting] [player_name], 神聖的陵墓終於完成了！這是妳城市的一個了不起的成就。" }
  { key:PHRASE_smalltomb_congratulations_title, text: "小型帝王陵墓完成了!" }
  { key:PHRASE_smalltomb_congratulations, text: "[greeting] [player_name],小型帝王陵墓的建設已經完成，希望它能存在很多年，直到妳的工人準備下一個." }
  { key:PHRASE_medtomb_congratulations_title, text: "中型帝王陵墓完成了!" }
  { key:PHRASE_medtomb_congratulations, text: "[greeting] [player_name], 中型帝王陵墓完成了！它為逝去的法老提供一個理想的通道通往來世." }
  { key:PHRASE_largetomb_congratulations_title, text: "大型帝王陵墓完成了!" }
  { key:PHRASE_largetomb_congratulations, text: "[greeting] [player_name], 經過多年的辛勤勞動，妳的工人完成了最壯麗的陵墓！它確實是一個了不起的成就." }
  { key:PHRASE_grandtomb_congratulations_title, text: "巨型帝王陵墓完成了!" }
  { key:PHRASE_grandtomb_congratulations, text: "[greeting] [player_name], 經過艱苦的工作，宏偉的巨型帝王陵墓完成得正是時候，壯麗的陵墓使我們尊敬的法老通往來世的旅程更加完美。" }
  { key:PHRASE_troopcarryover_title, text: "忠誠的部隊歸來" }
  { key:PHRASE_troopcarryover_initial_announcement, text: "妳最好的士兵希望重歸您的麾下.  建造兵營[reason_phrase]他們就會回歸." }
  { key:PHRASE_troopcarryover_inf_only, text: "一個步兵堡壘" }
  { key:PHRASE_troopcarryover_arch_only, text: "一個弓箭手堡壘" }
  { key:PHRASE_troopcarryover_char_only, text: "一個戰車堡壘" }
  { key:PHRASE_troopcarryover_inf_arch, text: "步兵和弓箭手堡壘" }
  { key:PHRASE_troopcarryover_inf_char, text: "步兵和戰車堡壘" }
  { key:PHRASE_troopcarryover_arch_char, text: "弓箭手和戰車堡壘" }
  { key:PHRASE_troopcarryover_all_three, text: "步兵，弓箭手和戰車堡壘" }
  { key:PHRASE_pyramid_speedup_title, text: "神恩眷顧" }
  { key:PHRASE_pyramid_speedup_announcement, text: "[reason_phrase] 很高興，並將推動您的紀唸碑建設項目，現在是妳的員工暫時靠邊站的時候了" }
  { key:PHRASE_pyramid_minor_speedup_announcement, text: "[reason_phrase] 認可了您的崇拜，並將推動您的紀唸碑建設項目，現在是讓妳的員工短期休息的時候了." }
  { key:PHRASE_pyramid_speedup_Osiris, text: "奧塞�奡�" }
  { key:PHRASE_pyramid_speedup_Ra, text: "拉" }
  { key:PHRASE_pyramid_speedup_Ptah, text: "卜塔" }
  { key:PHRASE_pyramid_speedup_Seth, text: "賽特" }
  { key:PHRASE_pyramid_speedup_Bast, text: "芭斯特" }
]
