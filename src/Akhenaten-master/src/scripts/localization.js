log_info("akhenaten: localization config started")

game_languages = [
  {
    lang:"en", caption:"English", key:"english",
    base_table:"localization_base_en", table:"localization_en", message_table:"eventmsg_en", game_messages:"game_messages_en"
    symbols:"A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z"
    is_bitmap_font:true
    font:"data/neucha.ttf"
    font_configs [
      { type: FONT_SMALL_PLAIN, size:12, color:0xffffffff, bold:false, line_height:12, letter_spacing:1 },
      { type: FONT_NORMAL_BLACK_ON_LIGHT, size:14, color:0xff390800, bold:false, line_height:14, letter_spacing:0 },
      { type: FONT_NORMAL_WHITE_ON_DARK, size:14, color:0xfff7deb5, bold:true, line_height:14, letter_spacing:0 },
      { type: FONT_NORMAL_YELLOW, size:14, color:0xffffce08, bold:true, line_height:14, letter_spacing:0 },
      { type: FONT_NORMAL_BLUE, size:14, color:0xff00efde, bold:true, line_height:14, letter_spacing:1 },
      { type: FONT_LARGE_BLACK_ON_LIGHT, size:18, color:0xff000000, bold:false, line_height:18, letter_spacing:0 },
      { type: FONT_LARGE_BLACK_ON_DARK, size:18, color:0xff000000, bold:false, line_height:18, letter_spacing:0 },
      { type: FONT_SMALL_OUTLINED, size:12, color:0xffffffff, bold:false, line_height:12, letter_spacing:-1 },
      { type: FONT_NORMAL_BLACK_ON_DARK, size:14, color:0xff210000, bold:false, line_height:14, letter_spacing:0 },
      { type: FONT_SMALL_SHADED, size:12, color:0xffffffff, bold:true, line_height:12, letter_spacing:2 },
      { type: FONT_MENU_BLACK_ON_LIGHT, size:14, color:0xff000000, bold:false, line_height:14, letter_spacing:0 }
    ]
  }

  {
    lang:"ru", caption:"Russian", key:"russian",
    base_table:"localization_base_ru", table:"localization_ru", message_table:"eventmsg_ru", game_messages:"game_messages_ru"
    symbols:"А,Б,В,Г,Д,Е,Ж,З,И,Й,К,Л,М,Н,О,П,Р,С,Т,У,Ф,Х,Ц,Ч,Ш,Щ,Ъ,Ы,Ь,Э,Ю,Я,а,б,в,г,д,е,ж,з,и,й,к,л,м,н,о,п,р,с,т,у,ф,х,ц,ч,ш,щ,ъ,ы,ь,э,ю,я"
    font:"data/neucha.ttf"
    font_configs [
      { type: FONT_SMALL_PLAIN, size:12, color:0xffffffff, bold:false, line_height:12, letter_spacing:1 },
      { type: FONT_NORMAL_BLACK_ON_LIGHT, size:14, color:0xff390800, bold:false, line_height:14, letter_spacing:2 },
      { type: FONT_NORMAL_WHITE_ON_DARK, size:14, color:0xfff7deb5, bold:true, line_height:14, letter_spacing:2 },
      { type: FONT_NORMAL_YELLOW, size:14, color:0xffffce08, bold:false, line_height:14, letter_spacing:2 },
      { type: FONT_NORMAL_BLUE, size:14, color:0xff00efde, bold:true, line_height:14, letter_spacing:3 },
      { type: FONT_LARGE_BLACK_ON_LIGHT, size:18, color:0xff422908, bold:true, line_height:18, letter_spacing:2 },
      { type: FONT_LARGE_BLACK_ON_DARK, size:18, color:0xff291000, bold:false, line_height:18, letter_spacing:2 },
      { type: FONT_SMALL_OUTLINED, size:12, color:0xffffffff, bold:false, line_height:12, letter_spacing:-1 },
      { type: FONT_NORMAL_BLACK_ON_DARK, size:14, color:0xff210000, bold:false, line_height:14, letter_spacing:2 },
      { type: FONT_SMALL_SHADED, size:12, color:0xffffffff, bold:true, line_height:12, letter_spacing:2 },
      { type: FONT_MENU_BLACK_ON_LIGHT, size:18, color:0xff422908, bold:false, line_height:18, letter_spacing:1 }
    ]
  }

  {
    lang:"ru_f", caption:"Russian (Fargus)", key:"russian_fargus",
    base_table:"localization_base_ru_f", table:"localization_ru_f", message_table:"eventmsg_ru_f", game_messages:"game_messages_ru_f"
    symbols:"А,Б,В,Г,Д,Е,Ж,З,И,Й,К,Л,М,Н,О,П,Р,С,Т,У,Ф,Х,Ц,Ч,Ш,Щ,Ъ,Ы,Ь,Э,Ю,Я,а,б,в,г,д,е,ж,з,и,й,к,л,м,н,о,п,р,с,т,у,ф,х,ц,ч,ш,щ,ъ,ы,ь,э,ю,я"
    font:"data/neucha.ttf"
    font_configs [
      { type: FONT_SMALL_PLAIN, size:12, color:0xffffffff, bold:false, line_height:12, letter_spacing:1 },
      { type: FONT_NORMAL_BLACK_ON_LIGHT, size:14, color:0xff390800, bold:false, line_height:14, letter_spacing:2 },
      { type: FONT_NORMAL_WHITE_ON_DARK, size:14, color:0xfff7deb5, bold:true, line_height:14, letter_spacing:2 },
      { type: FONT_NORMAL_YELLOW, size:14, color:0xffffce08, bold:false, line_height:14, letter_spacing:2 },
      { type: FONT_NORMAL_BLUE, size:14, color:0xff00efde, bold:true, line_height:14, letter_spacing:3 },
      { type: FONT_LARGE_BLACK_ON_LIGHT, size:18, color:0xff422908, bold:false, line_height:18, letter_spacing:2 },
      { type: FONT_LARGE_BLACK_ON_DARK, size:18, color:0xff291000, bold:false, line_height:18, letter_spacing:2 },
      { type: FONT_SMALL_OUTLINED, size:12, color:0xffffffff, bold:false, line_height:12, letter_spacing:-1 },
      { type: FONT_NORMAL_BLACK_ON_DARK, size:14, color:0xff210000, bold:false, line_height:14, letter_spacing:2 },
      { type: FONT_SMALL_SHADED, size:12, color:0xffffffff, bold:true, line_height:12, letter_spacing:2 },
      { type: FONT_MENU_BLACK_ON_LIGHT, size:18, color:0xff422908, bold:false, line_height:18, letter_spacing:1 }
    ]
  }

  {
    lang:"de", caption:"German", key:"german",
    base_table:"localization_base_de", table:"localization_de", message_table:"eventmsg_de", game_messages:"game_messages_de"
    symbols:"A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,Ä,ä,Ö,ö,Ü,ü,É,é,À,à,È,è,ù"
    font:"data/neucha.ttf"
    font_configs [
      { type: FONT_SMALL_PLAIN, size:12, color:0xffffffff, bold:false, line_height:12, letter_spacing:1 },
      { type: FONT_NORMAL_BLACK_ON_LIGHT, size:14, color:0xff390800, bold:false, line_height:14, letter_spacing:2 },
      { type: FONT_NORMAL_WHITE_ON_DARK, size:14, color:0xfff7deb5, bold:true, line_height:14, letter_spacing:2 },
      { type: FONT_NORMAL_YELLOW, size:14, color:0xffffce08, bold:true, line_height:14, letter_spacing:2 },
      { type: FONT_NORMAL_BLUE, size:14, color:0xff00efde, bold:true, line_height:14, letter_spacing:3 },
      { type: FONT_LARGE_BLACK_ON_LIGHT, size:18, color:0xff422908, bold:false, line_height:18, letter_spacing:2 },
      { type: FONT_LARGE_BLACK_ON_DARK, size:18, color:0xff291000, bold:false, line_height:18, letter_spacing:2 },
      { type: FONT_SMALL_OUTLINED, size:12, color:0xffffffff, bold:false, line_height:12, letter_spacing:-1 },
      { type: FONT_NORMAL_BLACK_ON_DARK, size:14, color:0xff210000, bold:false, line_height:14, letter_spacing:2 },
      { type: FONT_SMALL_SHADED, size:12, color:0xffffffff, bold:true, line_height:12, letter_spacing:2 },
      { type: FONT_MENU_BLACK_ON_LIGHT, size:18, color:0xff422908, bold:false, line_height:18, letter_spacing:1 }
    ]
  }

  {
    lang:"fr", caption:"French", key:"french",
    base_table:"localization_base_fr", table:"localization_fr", message_table:"eventmsg_fr", game_messages:"game_messages_fr"
    symbols:"A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,À,Â,Ç,É,È,Ê,Ë,Î,Ï,Ô,Œ,Ù,Û,Ü,à,â,ç,é,è,ê,ë,î,ï,ô,œ,ù,û,ü,«,»"
    font:"data/neucha.ttf"
    font_configs [
      { type: FONT_SMALL_PLAIN, size:12, color:0xffffffff, bold:false, line_height:12, letter_spacing:1 },
      { type: FONT_NORMAL_BLACK_ON_LIGHT, size:14, color:0xff390800, bold:false, line_height:14, letter_spacing:2 },
      { type: FONT_NORMAL_WHITE_ON_DARK, size:14, color:0xfff7deb5, bold:true, line_height:14, letter_spacing:2 },
      { type: FONT_NORMAL_YELLOW, size:14, color:0xffffce08, bold:true, line_height:14, letter_spacing:2 },
      { type: FONT_NORMAL_BLUE, size:14, color:0xff00efde, bold:true, line_height:14, letter_spacing:3 },
      { type: FONT_LARGE_BLACK_ON_LIGHT, size:18, color:0xff422908, bold:false, line_height:18, letter_spacing:2 },
      { type: FONT_LARGE_BLACK_ON_DARK, size:18, color:0xff291000, bold:false, line_height:18, letter_spacing:2 },
      { type: FONT_SMALL_OUTLINED, size:12, color:0xffffffff, bold:false, line_height:12, letter_spacing:-1 },
      { type: FONT_NORMAL_BLACK_ON_DARK, size:14, color:0xff210000, bold:false, line_height:14, letter_spacing:2 },
      { type: FONT_SMALL_SHADED, size:12, color:0xffffffff, bold:true, line_height:12, letter_spacing:2 },
      { type: FONT_MENU_BLACK_ON_LIGHT, size:18, color:0xff422908, bold:false, line_height:18, letter_spacing:1 }
    ]
  }

  {
    lang:"it", caption:"Italian", key:"italian",
    base_table:"localization_base_it", table:"localization_it", message_table:"eventmsg_it", game_messages:"game_messages_it"
    symbols:"A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,À,È,É,Ì,Ò,Ù,à,è,é,ì,ò,ù"
    font:"data/neucha.ttf"
    font_configs [
      { type: FONT_SMALL_PLAIN, size:12, color:0xffffffff, bold:false, line_height:12, letter_spacing:1 },
      { type: FONT_NORMAL_BLACK_ON_LIGHT, size:14, color:0xff390800, bold:false, line_height:14, letter_spacing:2 },
      { type: FONT_NORMAL_WHITE_ON_DARK, size:14, color:0xfff7deb5, bold:true, line_height:14, letter_spacing:2 },
      { type: FONT_NORMAL_YELLOW, size:14, color:0xffffce08, bold:true, line_height:14, letter_spacing:2 },
      { type: FONT_NORMAL_BLUE, size:14, color:0xff00efde, bold:true, line_height:14, letter_spacing:3 },
      { type: FONT_LARGE_BLACK_ON_LIGHT, size:18, color:0xff422908, bold:false, line_height:18, letter_spacing:2 },
      { type: FONT_LARGE_BLACK_ON_DARK, size:18, color:0xff291000, bold:false, line_height:18, letter_spacing:2 },
      { type: FONT_SMALL_OUTLINED, size:12, color:0xffffffff, bold:false, line_height:12, letter_spacing:-1 },
      { type: FONT_NORMAL_BLACK_ON_DARK, size:14, color:0xff210000, bold:false, line_height:14, letter_spacing:2 },
      { type: FONT_SMALL_SHADED, size:12, color:0xffffffff, bold:true, line_height:12, letter_spacing:2 },
      { type: FONT_MENU_BLACK_ON_LIGHT, size:18, color:0xff422908, bold:false, line_height:18, letter_spacing:1 }
    ]
  }

  {
    lang:"kr", caption:"Korean", key:"korean",
    base_table:"localization_base_kr", table:"localization_kr", message_table:"eventmsg_kr", game_messages:"game_messages_kr"
    symbols:"A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z"
    font:"data/neucha.ttf"
    font_configs [
      { type: FONT_SMALL_PLAIN, size:12, color:0xffffffff, bold:false, line_height:12, letter_spacing:1 },
      { type: FONT_NORMAL_BLACK_ON_LIGHT, size:14, color:0xff390800, bold:false, line_height:14, letter_spacing:2 },
      { type: FONT_NORMAL_WHITE_ON_DARK, size:14, color:0xfff7deb5, bold:true, line_height:14, letter_spacing:2 },
      { type: FONT_NORMAL_YELLOW, size:14, color:0xffffce08, bold:true, line_height:14, letter_spacing:2 },
      { type: FONT_NORMAL_BLUE, size:14, color:0xff00efde, bold:true, line_height:14, letter_spacing:3 },
      { type: FONT_LARGE_BLACK_ON_LIGHT, size:18, color:0xff422908, bold:false, line_height:18, letter_spacing:2 },
      { type: FONT_LARGE_BLACK_ON_DARK, size:18, color:0xff291000, bold:false, line_height:18, letter_spacing:2 },
      { type: FONT_SMALL_OUTLINED, size:12, color:0xffffffff, bold:false, line_height:12, letter_spacing:-1 },
      { type: FONT_NORMAL_BLACK_ON_DARK, size:14, color:0xff210000, bold:false, line_height:14, letter_spacing:2 },
      { type: FONT_SMALL_SHADED, size:12, color:0xffffffff, bold:true, line_height:12, letter_spacing:2 },
      { type: FONT_MENU_BLACK_ON_LIGHT, size:18, color:0xff422908, bold:false, line_height:18, letter_spacing:1 }
    ]
  }

  {
    lang:"po", caption:"Polish", key:"polish",
    base_table:"localization_base_po", table:"localization_po", message_table:"eventmsg_po", game_messages:"game_messages_po"
    symbols:"A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z"
    font:"data/neucha.ttf"
    font_configs [
      { type: FONT_SMALL_PLAIN, size:12, color:0xffffffff, bold:false, line_height:12, letter_spacing:1 },
      { type: FONT_NORMAL_BLACK_ON_LIGHT, size:14, color:0xff390800, bold:false, line_height:14, letter_spacing:2 },
      { type: FONT_NORMAL_WHITE_ON_DARK, size:14, color:0xfff7deb5, bold:true, line_height:14, letter_spacing:2 },
      { type: FONT_NORMAL_YELLOW, size:14, color:0xffffce08, bold:true, line_height:14, letter_spacing:2 },
      { type: FONT_NORMAL_BLUE, size:14, color:0xff00efde, bold:true, line_height:14, letter_spacing:3 },
      { type: FONT_LARGE_BLACK_ON_LIGHT, size:18, color:0xff422908, bold:false, line_height:18, letter_spacing:2 },
      { type: FONT_LARGE_BLACK_ON_DARK, size:18, color:0xff291000, bold:false, line_height:18, letter_spacing:2 },
      { type: FONT_SMALL_OUTLINED, size:12, color:0xffffffff, bold:false, line_height:12, letter_spacing:-1 },
      { type: FONT_NORMAL_BLACK_ON_DARK, size:14, color:0xff210000, bold:false, line_height:14, letter_spacing:2 },
      { type: FONT_SMALL_SHADED, size:12, color:0xffffffff, bold:true, line_height:12, letter_spacing:2 },
      { type: FONT_MENU_BLACK_ON_LIGHT, size:18, color:0xff422908, bold:false, line_height:18, letter_spacing:1 }
    ]
  }

  {
    lang:"pr", caption:"Portugese", key:"portugese",
    base_table:"localization_base_pr", table:"localization_pr", message_table:"eventmsg_pr", game_messages:"game_messages_pr"
    symbols:"A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z"
    font:"data/neucha.ttf"
    font_configs [
      { type: FONT_SMALL_PLAIN, size:12, color:0xffffffff, bold:false, line_height:12, letter_spacing:1 },
      { type: FONT_NORMAL_BLACK_ON_LIGHT, size:14, color:0xff390800, bold:false, line_height:14, letter_spacing:2 },
      { type: FONT_NORMAL_WHITE_ON_DARK, size:14, color:0xfff7deb5, bold:true, line_height:14, letter_spacing:2 },
      { type: FONT_NORMAL_YELLOW, size:14, color:0xffffce08, bold:true, line_height:14, letter_spacing:2 },
      { type: FONT_NORMAL_BLUE, size:14, color:0xff00efde, bold:true, line_height:14, letter_spacing:3 },
      { type: FONT_LARGE_BLACK_ON_LIGHT, size:18, color:0xff422908, bold:false, line_height:18, letter_spacing:2 },
      { type: FONT_LARGE_BLACK_ON_DARK, size:18, color:0xff291000, bold:false, line_height:18, letter_spacing:2 },
      { type: FONT_SMALL_OUTLINED, size:12, color:0xffffffff, bold:false, line_height:12, letter_spacing:-1 },
      { type: FONT_NORMAL_BLACK_ON_DARK, size:14, color:0xff210000, bold:false, line_height:14, letter_spacing:2 },
      { type: FONT_SMALL_SHADED, size:12, color:0xffffffff, bold:true, line_height:12, letter_spacing:2 },
      { type: FONT_MENU_BLACK_ON_LIGHT, size:18, color:0xff422908, bold:false, line_height:18, letter_spacing:1 }
    ]
  }

  {
    lang:"sp", caption:"Spanish", key:"spanish",
    base_table:"localization_base_sp", table:"localization_sp", message_table:"eventmsg_sp", game_messages:"game_messages_sp"
    symbols:"A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z"
    is_bitmap_font:true
    font:"data/neucha.ttf"
    font_configs [
      { type: FONT_SMALL_PLAIN, size:12, color:0xffffffff, bold:false, line_height:12, letter_spacing:1 },
      { type: FONT_NORMAL_BLACK_ON_LIGHT, size:14, color:0xff390800, bold:false, line_height:14, letter_spacing:2 },
      { type: FONT_NORMAL_WHITE_ON_DARK, size:14, color:0xfff7deb5, bold:true, line_height:14, letter_spacing:2 },
      { type: FONT_NORMAL_YELLOW, size:14, color:0xffffce08, bold:true, line_height:14, letter_spacing:2 },
      { type: FONT_NORMAL_BLUE, size:14, color:0xff00efde, bold:true, line_height:14, letter_spacing:3 },
      { type: FONT_LARGE_BLACK_ON_LIGHT, size:18, color:0xff422908, bold:false, line_height:18, letter_spacing:2 },
      { type: FONT_LARGE_BLACK_ON_DARK, size:18, color:0xff291000, bold:false, line_height:18, letter_spacing:2 },
      { type: FONT_SMALL_OUTLINED, size:12, color:0xffffffff, bold:false, line_height:12, letter_spacing:-1 },
      { type: FONT_NORMAL_BLACK_ON_DARK, size:14, color:0xff210000, bold:false, line_height:14, letter_spacing:2 },
      { type: FONT_SMALL_SHADED, size:12, color:0xffffffff, bold:true, line_height:12, letter_spacing:2 },
      { type: FONT_MENU_BLACK_ON_LIGHT, size:18, color:0xff422908, bold:false, line_height:18, letter_spacing:1 }
    ]
  }

  {
    lang:"ci", caption:"Chinese (Simple)", key:"chinese_s",
    base_table:"localization_base_ci", table:"localization_ci", message_table:"eventmsg_ci", game_messages:"game_messages_ci"
    symbols:"A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z"
    font:"data/neucha.ttf"
    font_configs [
      { type: FONT_SMALL_PLAIN, size:12, color:0xffffffff, bold:false, line_height:12, letter_spacing:1 },
      { type: FONT_NORMAL_BLACK_ON_LIGHT, size:14, color:0xff390800, bold:false, line_height:14, letter_spacing:2 },
      { type: FONT_NORMAL_WHITE_ON_DARK, size:14, color:0xfff7deb5, bold:true, line_height:14, letter_spacing:2 },
      { type: FONT_NORMAL_YELLOW, size:14, color:0xffffce08, bold:true, line_height:14, letter_spacing:2 },
      { type: FONT_NORMAL_BLUE, size:14, color:0xff00efde, bold:true, line_height:14, letter_spacing:3 },
      { type: FONT_LARGE_BLACK_ON_LIGHT, size:18, color:0xff422908, bold:false, line_height:18, letter_spacing:2 },
      { type: FONT_LARGE_BLACK_ON_DARK, size:18, color:0xff291000, bold:false, line_height:18, letter_spacing:2 },
      { type: FONT_SMALL_OUTLINED, size:12, color:0xffffffff, bold:false, line_height:12, letter_spacing:-1 },
      { type: FONT_NORMAL_BLACK_ON_DARK, size:14, color:0xff210000, bold:false, line_height:14, letter_spacing:2 },
      { type: FONT_SMALL_SHADED, size:12, color:0xffffffff, bold:true, line_height:12, letter_spacing:2 },
      { type: FONT_MENU_BLACK_ON_LIGHT, size:18, color:0xff422908, bold:false, line_height:18, letter_spacing:1 }
    ]
  }

  {
    lang:"ch", caption:"中文（繁體）", key:"chinese_c",
    base_table:"localization_base_ch", table:"localization_ch", message_table:"eventmsg_ch", game_messages:"game_messages_ch"
    symbols:"A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,0,1,2,3,4,5,6,7,8,9,—,”,…,、,。,《,》,「,」,一,丁,七,三,上,下,不,丑,且,世,丘,丟,並,中,串,丹,主,乃,久,之,乎,乏,乐,乓,乖,乘,九,乞,也,书,乳,乾,亂,了,予,事,二,互,五,井,些,亞,亟,亡,交,亦,享,亮,人,什,仁,仇,今,介,仍,仔,他,仗,付,代,令,以,仰,仳,件,任,份,仿,企,伊,伍,伏,伐,休,伙,伯,估,伴,伸,伺,似,但,佈,位,低,住,佑,佔,何,佘,余,佛,作,你,佩,佳,併,使,來,侈,例,侏,供,依,侵,侶,便,係,促,俗,俘,保,信,修,俯,俱,俸,俾,倆,倉,個,倍,們,倒,倘,候,借,倫,值,假,偉,偏,做,停,健,側,偵,偶,偷,傅,傑,備,傢,储,傲,傳,債,傷,傾,僅,像,僕,僚,僱,價,儀,儉,儒,儘,償,優,儲,允,元,兄,充,兆,兇,先,光,克,免,兒,兔,入,內,全,兩,八,公,六,共,兵,其,具,典,兼,内,冊,再,冒,冰,冷,准,凌,凍,凝,凡,凱,凶,凹,出,击,刀,分,切,刑,划,列,初,判,別,利,刪,到,制,刷,刺,刻,則,削,前,剎,剛,剝,剩,剪,副,割,創,剽,劃,劇,劈,劍,劑,力,功,加,劣,动,助,努,劫,劳,勁,勃,勇,勉,勒,動,勘,務,勝,勞,募,勢,勤,勵,勾,勿,包,匕,化,北,匠,匪,匯,匹,医,區,十,千,升,午,半,卑,卓,協,南,博,卜,占,卡,印,危,即,卷,卸,卻,厄,厚,原,厭,厲,去,參,又,叉,及,友,反,取,受,叛,叢,口,古,句,另,只,叫,召,叭,叮,可,台,史,右,司,吃,各,合,吉,吋,同,名,后,吐,向,君,吞,否,吧,含,吵,吸,吹,吼,呈,告,呎,呢,周,味,呼,命,咀,和,咒,咖,咬,咳,哀,品,哇,哈,員,哥,哨,哩,哪,哭,哼,唐,唬,售,唯,唱,唸,啃,啄,商,啊,問,啓,啟,啤,啥,啦,喀,善,喇,喊,喔,喘,喚,喜,喝,喪,單,喻,嗎,嗓,嗣,嘆,嘉,嘎,嘗,嘮,嘲,噗,器,噪,噬,噴,嚇,嚐,嚕,嚴,嚼,囂,囊,囑,四,回,因,囤,困,围,固,图,圈,國,圍,園,圓,圖,團,土,在,地,均,坊,坍,坎,坏,坐,坑,坡,坦,垂,型,埃,埋,城,域,埤,執,培,基,堂,堅,堆,堡,堤,堪,報,場,塊,塌,塑,塔,塗,塘,塞,塢,填,塵,境,墊,墓,墜,增,墟,墨,墳,墾,壁,壇,壑,壓,壘,壞,壤,士,壯,备,夏,外,多,夜,夠,夢,夥,大,天,太,夫,夭,央,失,夷,夸,夾,奇,奈,奉,奏,契,奔,套,奠,奡,奢,奥,奧,奪,奮,女,奴,她,好,如,妃,妄,妒,妙,妝,妥,妨,妳,妹,妻,姆,姊,始,姓,委,姿,威,娃,娛,娜,娱,婆,婚,婦,婪,媒,媚,嫌,嫩,嬤,子,孔,孕,字,存,孚,孟,季,孤,学,孩,孫,孳,學,它,宅,宇,守,安,完,宏,宕,宗,官,宙,定,宜,客,宣,室,宮,宰,害,宴,家,容,寄,密,寇,富,寒,寓,察,寡,寢,實,寧,審,寫,寬,寵,寶,寸,寺,封,射,將,專,尊,尋,對,導,小,少,尖,尚,尤,尬,就,尷,尸,尺,尼,尾,局,居,屆,屈,屋,屍,屏,展,屠,層,屬,山,岗,岩,岸,峭,峰,島,峻,崁,崇,崎,崖,崗,崩,嶇,嶼,川,州,巡,工,左,巧,巨,巫,差,己,已,巴,市,布,师,帊,希,帕,帝,師,席,帳,帶,常,幅,幕,幟,幣,幫,干,平,年,幸,幹,幼,幾,庇,床,序,底,店,府,度,座,庫,庭,庶,康,庸,廉,廊,廎,廓,廟,廠,廢,廣,廳,延,建,弄,弋,式,弓,弔,引,弗,弟,弦,弭,弱,張,強,彈,彌,彎,形,彩,彰,影,彷,役,彼,彿,往,征,待,很,徊,律,後,徑,徒,得,徘,徙,從,御,復,循,微,徵,德,徹,心,必,忌,忍,志,忘,忙,忠,快,念,忽,忿,怎,怒,怕,怖,思,怠,急,性,怨,怪,恆,恐,恢,恥,恨,恩,恭,息,恰,悅,悉,悍,悔,悠,患,您,悲,悴,情,惑,惕,惜,惠,惡,惱,想,惹,愁,愈,愉,意,愚,愛,感,愧,慈,態,慌,慎,慕,慘,慢,慣,慧,慨,慮,慰,慶,慷,慾,憂,憊,憎,憐,憑,憔,憤,憩,憫,憶,憾,懂,懈,應,懲,懶,懷,懸,懺,懼,戀,戍,成,我,或,戚,截,戮,戰,戲,戴,戶,房,所,扁,手,才,扎,打,托,扣,扥,扭,扮,批,找,承,技,抄,把,抓,投,抖,抗,折,披,抬,抱,抵,抹,押,抽,拆,拉,拍,拒,拓,拔,拖,招,拜,括,拯,拱,拳,拼,拾,拿,持,挂,指,按,挑,挖,挨,挪,挫,振,挺,挽,捆,捉,捏,捐,捕,损,捨,捲,捷,掀,掃,授,掉,掌,排,掘,掙,掛,掠,採,探,接,控,推,掩,措,揉,描,提,插,揚,換,握,揭,揮,援,損,搏,搓,搖,搗,搜,搬,搭,搶,摧,摩,摯,摸,摻,撇,撈,撐,撒,撕,撞,撤,撥,撫,撬,播,撲,撼,擁,擄,擅,擇,擊,擋,操,擔,據,擠,擢,擦,擱,擲,擴,擺,擾,攀,攔,攜,攝,攤,攪,攫,支,收,改,攻,放,政,故,效,敏,救,敗,敘,教,敞,敢,散,敦,敬,敲,整,敵,數,文,斐,斑,料,斥,斧,斬,斯,新,斷,方,於,施,旁,旅,旋,族,旗,既,日,旦,旨,早,旱,旺,昂,昆,昇,明,易,昔,星,昭,是,時,晉,晚,晤,晦,普,景,智,晾,暇,暑,暖,暗,暢,暨,暫,暴,曆,曉,曝,曠,曬,曲,曳,更,書,曼,曾,替,最,會,月,有,服,望,朝,期,木,未,末,本,朱,朽,杂,杉,李,材,村,杓,杖,杜,束,杭,杯,東,松,板,析,林,枚,果,枝,枯,架,柄,柏,某,染,查,柯,柱,柴,柵,校,核,根,格,栽,桂,桅,框,案,桑,桶,桿,梅,梗,條,梯,梱,棄,棋,棍,棒,棕,棗,棚,棟,森,棲,棺,椅,椌,植,椎,楚,業,極,概,榖,榫,榮,榴,構,槌,槍,槓,槳,槽,樁,樂,樑,樓,標,模,樣,樸,樹,樽,橄,橇,橋,橘,橙,機,橫,檀,檔,檢,櫓,櫚,欄,權,欖,欠,次,欣,欲,欸,欺,欽,款,歇,歌,歐,歡,止,正,此,步,武,歧,歪,歲,歷,歸,死,殆,殊,殖,殘,殲,段,殷,殺,殼,殿,毀,母,每,毒,比,毛,毫,毬,毯,民,氓,氛,氣,氦,氧,水,永,氾,汀,求,汐,汗,汙,池,污,汪,汲,決,沃,沈,沉,沐,沒,沓,沖,沙,沛,沫,沮,河,油,治,沼,沾,沿,況,泉,泊,法,泛,泡,波,泣,泥,注,泰,泳,洋,洗,洛,洞,津,洪,洲,洶,活,洽,派,流,浦,浪,浮,浴,海,浸,涅,消,涉,液,涵,涸,涼,淋,淚,淡,淨,淪,淫,深,混,淹,淺,添,清,減,渠,渡,渣,渥,測,港,渴,游,湊,湖,湧,溉,源,準,溝,溫,溯,溶,溼,滅,滋,滑,滯,滲,滷,滾,滿,漁,漂,漆,漏,演,漠,漢,漪,漫,漲,漸,潔,潘,潛,潤,潮,潰,澀,澤,澳,激,濕,濘,濟,濤,濫,濾,瀆,瀏,瀑,瀰,灌,灑,灣,火,灰,災,灾,炎,炭,炸,点,為,烈,烏,烘,烹,焚,無,焦,焰,然,煉,煙,煤,照,煩,煽,熄,熟,熬,熱,燃,燈,燒,營,燥,爆,爍,爛,爪,爬,爭,父,爺,爽,爾,牆,片,版,牙,牛,牠,牡,牢,牧,物,牲,特,牽,犁,犧,犬,犯,狀,狂,狄,狗,狠,狩,狹,狼,猖,猛,猜,猴,猶,獅,獎,獗,獨,獲,獵,獸,獻,玄,率,王,玩,玷,珊,珍,珠,班,現,球,理,琲,琴,瑞,瑟,瑪,環,瓊,瓜,瓦,瓶,瓷,甚,甜,生,產,甥,用,甩,田,由,甲,申,男,界,畏,畔,留,畜,畢,略,番,畫,異,當,疊,疑,疟,疫,疲,疾,病,症,痊,痕,痛,痞,痺,瘉,瘋,瘍,瘓,瘟,瘠,瘦,瘧,療,癒,癟,癱,登,發,白,百,皂,的,皆,皇,皮,皺,皿,盆,盈,益,盒,盔,盛,盜,盟,盡,監,盤,盧,目,直,相,盼,盾,省,眈,眉,看,真,眠,眨,眷,眺,眼,眾,睜,睡,督,睿,瞪,瞬,瞭,瞰,瞻,矗,矚,矛,矜,知,短,矮,矯,石,砂,砌,砍,研,破,硬,碌,碎,碑,碟,碩,碰,碳,確,碼,磚,磨,礁,礎,礙,礦,礫,示,社,祀,祂,祇,祈,祐,祖,祗,祝,神,票,祭,祿,禁,禍,福,禦,禧,禮,禱,禽,禿,秀,私,科,秒,秘,秤,秩,移,稀,稅,稈,程,稍,税,稟,稠,種,稱,稻,稿,穀,穆,積,穢,穩,穫,穴,究,空,穿,突,窄,窗,窟,窮,窯,窺,竄,竊,立,站,竟,章,竣,童,竭,端,競,竿,笑,笛,符,笨,第,筆,等,筋,筏,筑,答,策,算,管,箭,箱,節,範,篆,篇,築,篩,簇,簍,簡,簽,簿,籃,籌,籍,籠,米,粉,粒,粗,粘,精,糕,糖,糙,糟,糧,系,糾,紀,約,紅,納,紐,純,紗,紙,級,紛,素,紡,索,紫,紮,累,細,紹,終,組,結,絕,絡,給,統,絲,綁,綑,經,綜,綠,維,網,綿,緊,緒,線,緣,編,緩,練,緻,縫,縮,縱,總,績,繁,織,繞,繩,繪,繫,繳,繼,纂,續,纏,纖,线,缸,缺,罈,罐,罔,罕,罟,罩,罪,置,罰,署,罵,罷,罹,羅,羊,美,羚,羞,群,義,羽,翁,習,翠,翩,翰,翻,耀,老,考,者,而,耍,耐,耕,耗,耨,耳,耶,耿,聆,聊,聖,聘,聚,聞,聯,聰,聲,聳,職,聽,肆,肇,肉,肋,肌,肖,肚,股,肥,肩,肪,肯,育,肺,胃,背,胚,胞,胡,能,脂,脅,脆,脈,脊,脖,脫,脾,腐,腓,腔,腥,腦,腰,腳,腴,腹,膏,膚,膜,膠,膽,臉,臘,臟,臣,臨,自,臭,至,致,與,興,舉,舊,舍,舒,舖,舞,航,般,船,艘,艙,艦,良,艱,色,艾,芒,芝,芥,芬,芭,芮,花,芽,苛,苣,若,苦,英,茁,茂,范,茅,茫,草,荒,药,荷,莉,莊,莎,莖,莢,莫,菁,菌,菜,菡,華,菱,菲,萃,萄,萊,萌,萎,萓,萬,萵,落,葉,著,葛,葡,葦,葩,葬,蒂,蒐,蒔,蒙,蒜,蒸,蓄,蓆,蓋,蔓,蔥,蔬,蔭,蔾,蕩,蕭,薩,薪,藉,藍,藏,藐,藝,藥,藹,蘆,蘇,蘊,蘭,蘿,虎,虐,虔,處,虛,虜,虞,號,蚊,蚤,蛇,蛋,蛙,蛛,蛤,蛻,蜂,蜘,蜜,蜣,蝕,蝗,蝨,螂,融,螞,螢,螺,蟲,蟻,蠍,蠢,蠻,血,行,衍,術,街,衛,衝,衡,衣,表,衰,衷,袋,袖,被,裁,裂,裕,補,裝,裡,裴,裸,裹,製,複,褐,褪,褻,襲,西,要,覆,見,規,覓,視,覦,親,覬,覺,覽,觀,角,解,觸,言,訂,計,訊,討,訓,託,記,訝,訟,訪,設,許,訴,診,註,評,詛,詞,詢,試,詩,話,該,詳,誌,認,誓,誕,誘,語,誠,誤,說,誰,課,調,談,請,諒,論,諜,諧,諭,諮,諷,諸,諾,謂,謙,講,謝,謠,謹,證,識,譚,譜,警,譯,議,護,譽,讀,變,讓,讚,谷,豆,豈,豌,豎,豐,豔,象,豢,豪,豫,豬,豹,貌,貓,貝,負,財,貢,貧,貨,販,貪,貫,責,貯,貲,貴,買,貸,費,貼,貿,賀,資,賊,賓,賜,賞,賠,賣,賦,質,賴,賺,購,賽,贈,贊,贏,赛,赫,走,赴,起,趁,超,越,趕,趟,趣,趨,足,趴,趺,跋,跌,跑,距,跟,跡,跨,路,跳,踏,蹄,蹈,蹟,蹤,蹬,躁,躍,身,躲,躺,車,軍,軟,軸,較,載,輓,輔,輕,輛,輝,輩,輪,輯,輸,輿,轄,轉,辛,辟,辦,辨,辱,農,达,迂,迄,迅,迎,近,返,迦,迪,迫,述,迴,迷,追,退,送,逃,逆,透,逐,途,逖,這,通,逛,逝,速,造,連,逮,週,進,逻,逼,遇,遊,運,遍,過,遏,道,達,違,遙,遜,遠,遣,適,遭,遲,遵,遷,選,遺,遽,避,邀,邁,還,邊,邏,那,邦,邪,邸,郊,郝,郡,部,都,鄉,鄙,鄰,配,酒,酬,酵,酷,醒,醞,醫,釀,釁,采,釋,里,重,野,量,金,釘,針,釣,鈕,鈞,鈣,鈴,鉅,鉛,銀,銅,銘,銜,銳,銷,鋒,鋤,鋪,鋸,錄,錐,錘,錠,錢,錨,錫,錯,鍊,鍍,鍛,鍵,鎖,鎚,鎢,鎪,鎮,鎳,鏈,鏝,鏡,鏢,鐘,鐮,鑄,鑑,鑲,鑽,鑿,長,門,閂,閃,閉,開,閒,間,閡,閱,闊,關,闡,闢,问,防,阻,阿,附,陋,陌,降,限,陡,院,陣,除,险,陪,陰,陲,陳,陵,陶,陷,陸,陽,隆,隊,階,隔,際,障,隧,隨,險,隱,隸,隻,隼,雀,雄,雅,集,雇,雕,雖,雙,雛,雜,雞,離,難,雨,雪,雲,零,雷,雹,電,需,霆,震,霉,霍,霧,露,靈,青,靜,非,靠,面,革,鞋,鞏,鞭,韋,韭,音,響,頁,頂,項,順,須,頌,預,頓,頗,領,頭,頸,頻,顆,題,額,顏,願,顛,類,顧,顯,顱,题,風,飄,风,飛,食,飢,飭,飲,飼,飽,飾,養,餌,餓,餘,館,餵,饋,饑,饒,馆,首,香,馬,馭,馴,駁,駐,駕,駛,駝,駭,駱,騎,騙,騰,騷,驅,驍,驕,驗,驚,驟,驢,骨,骸,髂,髓,體,高,髦,髮,鬆,鬥,鬧,鬼,魁,魂,魔,魚,魯,鮮,鯰,鰤,鱷,鳥,鴉,鴕,鴨,鷗,鷹,鹽,鹿,麗,麥,麵,麻,麼,麾,黃,黎,黏,黑,默,點,黨,黴,鼓,鼠,鼻,齁,齊,齒,齡,龐,龜,！,（,）,，,－,：,；,？"
    font:"data/notosanssc-vf.ttf"
    font_configs [
      { type: FONT_SMALL_PLAIN, size:12, color:0xffffffff, bold:false, line_height:12, letter_spacing:0 },
      { type: FONT_NORMAL_BLACK_ON_LIGHT, size:14, color:0xff390800, bold:false, line_height:14, letter_spacing:0 },
      { type: FONT_NORMAL_WHITE_ON_DARK, size:14, color:0xfff7deb5, bold:true, line_height:14, letter_spacing:0 },
      { type: FONT_NORMAL_YELLOW, size:14, color:0xffffce08, bold:true, line_height:14, letter_spacing:0 },
      { type: FONT_NORMAL_BLUE, size:14, color:0xff00efde, bold:true, line_height:14, letter_spacing:0 },
      { type: FONT_LARGE_BLACK_ON_LIGHT, size:18, color:0xff422908, bold:false, line_height:18, letter_spacing:0 },
      { type: FONT_LARGE_BLACK_ON_DARK, size:18, color:0xff291000, bold:false, line_height:18, letter_spacing:0 },
      { type: FONT_SMALL_OUTLINED, size:12, color:0xffffffff, bold:false, line_height:12, letter_spacing:0 },
      { type: FONT_NORMAL_BLACK_ON_DARK, size:14, color:0xff210000, bold:false, line_height:14, letter_spacing:0 },
      { type: FONT_SMALL_SHADED, size:12, color:0xffffffff, bold:true, line_height:12, letter_spacing:0 },
      { type: FONT_MENU_BLACK_ON_LIGHT, size:18, color:0xff422908, bold:false, line_height:18, letter_spacing:0 }
    ]
  }

  {
    lang:"hu", caption:"Magyar", key:"hungarian",
    base_table:"localization_base_hu", table:"localization_hu", message_table:"eventmsg_hu", game_messages:"game_messages_hu"
    symbols:"A,Á,B,C,D,E,É,F,G,H,I,Í,J,K,L,M,N,O,Ó,Ö,Ő,P,Q,R,S,T,U,Ú,Ü,Ű,V,W,X,Y,Z,a,á,b,c,d,e,é,f,g,h,i,í,j,k,l,m,n,o,ó,ö,ő,p,q,r,s,t,u,ú,ü,ű,v,w,x,y,z"
    font:"data/neucha.ttf"
    font_configs [
      { type: FONT_SMALL_PLAIN, size:12, color:0xffffffff, bold:false, line_height:12, letter_spacing:1 },
      { type: FONT_NORMAL_BLACK_ON_LIGHT, size:14, color:0xff390800, bold:false, line_height:14, letter_spacing:2 },
      { type: FONT_NORMAL_WHITE_ON_DARK, size:14, color:0xfff7deb5, bold:true, line_height:14, letter_spacing:2 },
      { type: FONT_NORMAL_YELLOW, size:14, color:0xffffce08, bold:true, line_height:14, letter_spacing:2 },
      { type: FONT_NORMAL_BLUE, size:14, color:0xff00efde, bold:true, line_height:14, letter_spacing:3 },
      { type: FONT_LARGE_BLACK_ON_LIGHT, size:18, color:0xff422908, bold:false, line_height:18, letter_spacing:1 },
      { type: FONT_LARGE_BLACK_ON_DARK, size:18, color:0xff291000, bold:false, line_height:18, letter_spacing:1 },
      { type: FONT_SMALL_OUTLINED, size:12, color:0xffffffff, bold:false, line_height:12, letter_spacing:-1 },
      { type: FONT_NORMAL_BLACK_ON_DARK, size:14, color:0xff210000, bold:false, line_height:14, letter_spacing:2 },
      { type: FONT_SMALL_SHADED, size:12, color:0xffffffff, bold:true, line_height:12, letter_spacing:2 },
      { type: FONT_MENU_BLACK_ON_LIGHT, size:18, color:0xff422908, bold:false, line_height:18, letter_spacing:1 }
    ]
  }
]
