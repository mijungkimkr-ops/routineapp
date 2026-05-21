import { useEffect, useState } from "react";

// ── 상수 ──────────────────────────────────────────────────────────────────────
const APP_START = "2026-05-20";
const TODAY = new Date();
const TODAY_KEY = fmtKey(TODAY);

const DAY_KEYS = ["sun","mon","tue","wed","thu","fri","sat"];
const DAY_KO   = {sun:"일",mon:"월",tue:"화",wed:"수",thu:"목",fri:"금",sat:"토"};
const DAY_FULL = {sun:"일요일",mon:"월요일",tue:"화요일",wed:"수요일",thu:"목요일",fri:"금요일",sat:"토요일"};

const ROUTINES0 = {
  jaei:[
    {id:"bag",icon:"🎒",title:"하교후 가방정리",days:["mon","tue","wed","thu","fri"],order:1},
    {id:"math",icon:"🧮",title:"수학학원 숙제하기",days:["mon","tue","thu","fri"],order:2},
    {id:"reading",icon:"📚",title:"한글책 2권 + 영어책 1권",days:["mon","tue","wed","thu","sat","sun"],order:3,link:"reading"},
    {id:"er",icon:"📝",title:"영어학원 복습하기",days:["mon","tue","wed","thu"],order:4},
    {id:"qt",icon:"🙏",title:"큐티하기",days:["mon","tue","wed","thu","fri"],order:5},
    {id:"times",icon:"✖️",title:"구구단 외우기",days:["tue","thu"],order:6},
    {id:"hansol",icon:"✏️",title:"한솔숙제하기",days:["sun","tue","thu"],order:7},
    {id:"hanja",icon:"🀄",title:"한자 연습하기",days:["tue","wed"],order:8,link:"hanja"},
    {id:"sight",icon:"🔤",title:"사이트워드 외우기",days:["mon","thu"],order:9,link:"sight"},
    {id:"walk",icon:"🚶",title:"산책하기",days:["wed","fri"],order:10},
    {id:"free",icon:"🌈",title:"자유공부",days:["sat","sun"],order:11},
  ],
  mom:[
    {id:"yoga",icon:"🧘",title:"요가",days:["mon","wed","fri"],order:1},
    {id:"walk",icon:"🚶",title:"걷기",days:["tue","thu"],order:2},
    {id:"sermon",icon:"🎧",title:"설교듣기",days:["mon"],order:3},
    {id:"journal",icon:"📓",title:"일기쓰기",days:["sun","mon","tue","wed","thu","fri","sat"],order:4},
    {id:"work",icon:"💻",title:"일하기",days:["sun","mon","tue","wed","thu","fri","sat"],order:5},
    {id:"book",icon:"📖",title:"책읽기",days:["sun","mon","tue","wed","thu","fri","sat"],order:6},
    {id:"fullfill",icon:"🍇",title:"풀필 구상하기",days:["sun","mon","tue","wed","thu","fri","sat"],order:7},
  ],
};

const SIGHT = {
  "1단계":"the,to,and,he,a,I,you,it,of,in,was,said,his,that,she,for,on,they,but,had,at,him,with,up,all,look,is,her,there,some",
  "2단계":"out,as,be,have,go,we,am,then,little,down,do,can,could,when,did,what,so,see,not,were,get,them,like,one,this,my,would,me,will,yes",
  "3단계":"big,went,are,come,if,now,long,no,came,ask,very,an,over,your,its,ride,into,just,blue,red,from,good,any,about,around,want,don't,how,know,right",
  "4단계":"put,too,got,take,where,every,pretty,jump,green,four,away,old,by,their,here,saw,call,after,well,think,ran,let,help,make,going,sleep,brown,yellow,five,six",
  "5단계":"walk,two,or,before,eat,again,play,who,been,may,stop,off,never,seven,eight,cold,today,fly,myself,round,tell,much,keep,give,work,first,try,new,must,start",
};

// ── 한자 데이터 ───────────────────────────────────────────────────────────────
const HANJA_STUDY = {
  敎:{words:["교육(敎育)","교사(敎師)","교실(敎室)"],s:"학교에는 아이들을 가르치는 교사(敎師)가 있어요."},
  校:{words:["학교(學校)","교문(校門)","교장(校長)"],s:"아침마다 학교(學校) 교문(校門)으로 들어가요."},
  家:{words:["가족(家族)","가정(家庭)","가구(家具)"],s:"가족(家族)은 한집에서 서로 도와요."},
  百:{words:["백점(百點)","백일(百日)","백과(百科)"],s:"받아쓰기에서 백점(百點)을 받았어요."},
  學:{words:["학교(學校)","학생(學生)","학원(學院)"],s:"학생(學生)은 학교(學校)에서 배워요."},
  生:{words:["학생(學生)","생일(生日)","생활(生活)"],s:"학생(學生)은 학교에서 배워요."},
  水:{words:["수영(水泳)","생수(生水)","수요일(水曜日)"],s:"수요일(水曜日)에는 수영(水泳)을 배워요."},
  火:{words:["화요일(火曜日)","화재(火災)","화산(火山)"],s:"화요일(火曜日)에는 한자를 복습해요."},
  木:{words:["목요일(木曜日)","목재(木材)","목공(木工)"],s:"목요일(木曜日)에는 한자를 복습해요."},
  金:{words:["금요일(金曜日)","금색(金色)","금메달(金메달)"],s:"금요일(金曜日)에는 주말이 가까워져요."},
  土:{words:["토요일(土曜日)","토지(土地)","국토(國土)"],s:"토요일(土曜日)에는 가족과 산책해요."},
  月:{words:["월요일(月曜日)","정월(正月)","매월(每月)"],s:"월요일(月曜日)에는 학교에 가요."},
  日:{words:["일요일(日曜日)","생일(生日)","일기(日記)"],s:"일요일(日曜日)에는 가족과 쉬어요."},
  人:{words:["인간(人間)","인사(人事)","인기(人氣)"],s:"친구를 만나면 인사(人事)를 해요."},
  國:{words:["한국(韓國)","국기(國旗)","국가(國家)"],s:"한국(韓國)의 국기(國旗)는 태극기예요."},
  韓:{words:["한국(韓國)","한식(韓食)","한류(韓流)"],s:"한국(韓國)에서는 한식을 즐겨 먹어요."},
  門:{words:["교문(校門)","대문(大門)","정문(正門)"],s:"학교 정문(正門) 앞에서 친구를 만났어요."},
  花:{words:["화분(花盆)","생화(生花)","화원(花園)"],s:"화분(花盆)에 물을 주었어요."},
  春:{words:["춘분(春分)","청춘(靑春)","입춘(立春)"],s:"입춘(立春)이 지나면 봄이 가까워져요."},
  夏:{words:["하복(夏服)","하계(夏季)","입하(立夏)"],s:"여름에는 하복(夏服)을 입어요."},
  秋:{words:["추석(秋夕)","추분(秋分)","추수(秋收)"],s:"추석(秋夕)에는 가족이 모여요."},
  冬:{words:["동복(冬服)","동계(冬季)","겨울(冬)"],s:"겨울에는 동복(冬服)을 입어요."},
};

function parseHanja(raw, grade) {
  return raw.split(",").map((part, idx) => {
    const [char, meaning, reading] = part.split("|");
    return { id: grade+"-"+idx+"-"+char, grade, char, meaning, reading };
  }).filter(x => x.char && x.meaning && x.reading);
}

const HANJA_8_RAW = "敎|가르칠|교,校|학교|교,九|아홉|구,國|나라|국,軍|군사|군,金|쇠|금,南|남녘|남,女|계집|녀,年|해|년,大|큰|대,東|동녘|동,六|여섯|육,萬|일만|만,母|어미|모,木|나무|목,門|문|문,民|백성|민,白|흰|백,父|아비|부,北|북녘|북,四|넉|사,山|메|산,三|석|삼,生|날|생,西|서녘|서,先|먼저|선,小|작을|소,水|물|수,室|집|실,十|열|십,五|다섯|오,王|임금|왕,外|바깥|외,月|달|월,二|두|이,人|사람|인,一|한|일,日|날|일,長|긴|장,弟|아우|제,中|가운데|중,靑|푸를|청,寸|마디|촌,七|일곱|칠,土|흙|토,八|여덟|팔,學|배울|학,韓|한국|한,兄|형|형,火|불|화";
const HANJA_7_RAW = "歌|노래|가,家|집|가,間|사이|간,江|강|강,車|수레|거,空|빌|공,工|장인|공,敎|가르칠|교,校|학교|교,九|아홉|구,口|입|구,國|나라|국,軍|군사|군,金|쇠|금,記|기록할|기,旗|깃발|기,氣|기운|기,南|남녘|남,男|사내|남,內|안|내,女|계집|녀,年|해|년,農|농사|농,答|대답|답,大|큰|대,道|길|도,冬|겨울|동,洞|골|동,東|동녘|동,動|움직일|동,同|한가지|동,登|오를|등,來|올|래,力|힘|력,老|늙을|로,六|여섯|육,里|마을|리,林|수풀|림,立|설|립,萬|일만|만,每|매양|매,面|낯|면,命|목숨|명,名|이름|명,母|어미|모,木|나무|목,文|글월|문,門|문|문,問|물을|문,物|물건|물,民|백성|민,方|모|방,百|일백|백,白|흰|백,夫|지아비|부,父|아비|부,北|북녘|북,不|아니|불,四|넉|사,事|일|사,山|메|산,算|셈|산,三|석|삼,上|윗|상,色|빛|색,生|날|생,西|서녘|서,夕|저녁|석,先|먼저|선,姓|성|성,世|세상|세,所|바|소,小|작을|소,少|적을|소,水|물|수,數|셈|수,手|손|수,時|때|시,市|저자|시,食|밥|식,植|심을|식,室|집|실,心|마음|심,十|열|십,安|편안|안,語|말씀|어,然|그럴|연,午|낮|오,五|다섯|오,王|임금|왕,外|바깥|외,右|오른|우,月|달|월,有|있을|유,育|기를|육,邑|고을|읍,二|두|이,人|사람|인,日|날|일,一|한|일,入|들|입,字|글자|자,自|스스로|자,子|아들|자,長|긴|장,場|마당|장,電|번개|전,前|앞|전,全|온전|전,正|바를|정,弟|아우|제,祖|할아비|조,足|발|족,左|왼|좌,主|주인|주,住|살|주,中|가운데|중,重|무거울|중,地|땅|지,紙|종이|지,直|곧을|직,川|내|천,千|일천|천,天|하늘|천,靑|푸를|청,草|풀|초,寸|마디|촌,村|마을|촌,秋|가을|추,春|봄|춘,出|날|출,七|일곱|칠,土|흙|토,八|여덟|팔,便|편할|편,平|평평할|평,下|아래|하,夏|여름|하,學|배울|학,韓|한국|한,漢|한수|한,海|바다|해,兄|형|형,話|말씀|화,火|불|화,活|살|활,花|꽃|화,孝|효도|효,後|뒤|후,休|쉴|휴";

const HANJA_DATA = {
  "8급": parseHanja(HANJA_8_RAW, "8급"),
  "7급": parseHanja(HANJA_7_RAW, "7급"),
};

const HANJA_SETS = {
  "8급": [{id:"grade8-all", label:"8급 전체", start:0, end:50}],
  "7급": [
    {id:"grade7-1", label:"7급 1세트", start:0, end:50},
    {id:"grade7-2", label:"7급 2세트", start:50, end:100},
    {id:"grade7-3", label:"7급 3세트", start:100, end:150},
  ],
};

function getHanjaSet(grade, setId) {
  const sets = HANJA_SETS[grade];
  const target = sets.find(s => s.id === setId) || sets[0];
  return HANJA_DATA[grade].slice(target.start, target.end);
}

function getStudyContent(item) {
  return HANJA_STUDY[item.char] || {
    words: [],
    s: item.char + "는 '" + item.meaning + " / " + item.reading + "'로 외워요.",
  };
}

function createChoices(item, list) {
  const wrong = list.filter(x => x.char !== item.char).sort(() => Math.random()-0.5).slice(0,2);
  return [item, ...wrong].sort(() => Math.random()-0.5);
}

function normalize(v) { return v.trim().replace(/\s/g,"").toLowerCase(); }

// 연간 달력 (모듈 레벨에서 한 번만 계산)
const YEAR_MONTHS = (function() {
  const start = new Date("2026-01-01T00:00:00");
  const months = {};
  for (let i = 0; i < 365; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const m = d.getMonth();
    if (!months[m]) months[m] = [];
    months[m].push(d);
  }
  return months;
})();

// ── 유틸 ──────────────────────────────────────────────────────────────────────
function fmtKey(d) {
  return d.getFullYear() + "-" +
    String(d.getMonth()+1).padStart(2,"0") + "-" +
    String(d.getDate()).padStart(2,"0");
}
function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}
function fmtDate(d) {
  return (d.getMonth()+1) + "월 " + d.getDate() + "일 " + DAY_KO[DAY_KEYS[d.getDay()]] + "요일";
}
function dayKey(d) { return DAY_KEYS[d.getDay()]; }
function getDayTasks(routines, user, date) {
  const day = dayKey(date);
  return routines[user].filter(t => t.days.includes(day)).slice().sort((a,b) => a.order - b.order);
}
function getChecks(checks, dk, user) {
  return (checks[dk] && checks[dk][user]) ? checks[dk][user] : {};
}
function getWeekDates(date) {
  const sun = new Date(date);
  sun.setDate(date.getDate() - date.getDay());
  return Array.from({length:7}, (_,i) => { const d = new Date(sun); d.setDate(sun.getDate()+i); return d; });
}
function load(k, fb) {
  try { const r = localStorage.getItem(k); return r ? JSON.parse(r) : fb; } catch { return fb; }
}
function save(k, v) {
  try { localStorage.setItem(k, JSON.stringify(v)); } catch {}
}

// ── 컬러 ──────────────────────────────────────────────────────────────────────
const C = {
  board:"#F0BFA8", deep:"#CC7A54", side:"#D9956E",
  on:"#E07850", onL:"#F0A888",
  text:"#4A2010", mid:"#7A4428", mute:"#B8806A",
  pill:"#E8CDB8", pillT:"#6A3820",
  panel:"rgba(255,255,255,0.60)",
  slot:"#FFFAF6",
};

// ── CSS (한 번만 주입) ─────────────────────────────────────────────────────────
const CSS = [
  "@import url('https://fonts.googleapis.com/css2?family=Jua&display=swap');",
  "*{box-sizing:border-box;margin:0;padding:0;}",
  "html,body{width:100%;background:#F0BFA8;font-family:'Jua',sans-serif;}",
  ".root{width:100%;min-height:100vh;background:#F0BFA8;padding:16px 18px;font-family:'Jua',sans-serif;color:#4A2010;position:relative;overflow-x:hidden;box-shadow:0 2px 0 rgba(255,255,255,0.5) inset,0 -5px 0 #CC7A54 inset,5px 0 0 rgba(255,255,255,0.25) inset,-5px 0 0 #D9956E inset;}",
  ".root::before{content:'';position:absolute;inset:0;pointer-events:none;background:linear-gradient(150deg,rgba(255,255,255,0.2) 0%,transparent 45%);}",
  ".pnl{background:rgba(255,255,255,0.60);border-radius:16px;padding:15px;box-shadow:0 1px 0 rgba(255,255,255,0.88) inset,0 -2px 0 rgba(160,70,30,0.10) inset,0 3px 10px rgba(160,70,30,0.08);}",
  ".slot{background:#FFFAF6;border-radius:11px;padding:10px 12px;display:flex;align-items:center;gap:10px;cursor:pointer;user-select:none;box-shadow:0 1px 0 rgba(255,255,255,0.92) inset,0 -1px 0 rgba(180,80,40,0.13) inset,0 2px 5px rgba(180,80,40,0.13);transition:background 0.15s;}",
  ".slot:hover{background:#FFF4EE;}.slot.done{background:#FFEEE6;}",
  ".si{width:32px;height:32px;border-radius:8px;background:rgba(255,255,255,0.72);display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0;}",
  ".st{flex:1;font-size:14px;color:#4A2010;line-height:1.25;}.slot.done .st{color:#B8806A;text-decoration:line-through;}",
  ".tog{width:48px;height:26px;flex-shrink:0;cursor:pointer;}",
  ".trk{width:100%;height:100%;border-radius:999px;background:#CCAAA0;box-shadow:inset 0 2px 4px rgba(0,0,0,0.16);position:relative;overflow:hidden;transition:background 0.22s;}",
  ".trk.on{background:#E07850;}",
  ".knb{position:absolute;top:3px;left:3px;width:20px;height:20px;border-radius:50%;background:linear-gradient(145deg,#fff,#ecddd8);box-shadow:0 2px 4px rgba(0,0,0,0.22),inset 0 1px 0 rgba(255,255,255,0.9);transition:left 0.22s cubic-bezier(0.34,1.56,0.64,1);}",
  ".trk.on .knb{left:25px;}",
  ".tx{position:absolute;right:7px;top:50%;transform:translateY(-50%);font-size:8px;color:rgba(255,255,255,0.55);pointer-events:none;transition:opacity 0.18s;}",
  ".trk.on .tx{opacity:0;}",
  ".tab{border:none;border-radius:999px;padding:8px 18px;font-family:'Jua',sans-serif;font-size:13px;cursor:pointer;background:#E8CDB8;color:#6A3820;box-shadow:0 3px 0 #CC7A54;transition:all 0.1s;position:relative;top:0;}",
  ".tab:active{top:3px;box-shadow:0 0 0 #CC7A54;}.tab.on{background:#E07850;color:#fff;}",
  ".pill{border:none;border-radius:999px;padding:7px 14px;font-family:'Jua',sans-serif;font-size:13px;cursor:pointer;background:#E8CDB8;color:#6A3820;box-shadow:0 2px 0 #CC7A54;transition:all 0.1s;position:relative;top:0;}",
  ".pill:active{top:2px;box-shadow:0 0 0 #CC7A54;}.pill.on{background:#E07850;color:#fff;}",
  ".arw{border:none;border-radius:9px;width:32px;height:32px;font-family:'Jua',sans-serif;font-size:17px;cursor:pointer;background:rgba(255,255,255,0.55);color:#6A3820;box-shadow:0 2px 0 #CC7A54;display:flex;align-items:center;justify-content:center;transition:all 0.1s;position:relative;top:0;flex-shrink:0;}",
  ".arw:active{top:2px;box-shadow:0 0 0 #CC7A54;}",
  ".tdy{border:none;border-radius:999px;padding:5px 12px;font-family:'Jua',sans-serif;font-size:11px;cursor:pointer;background:#E07850;color:#fff;box-shadow:0 2px 0 #CC7A54;transition:all 0.1s;position:relative;top:0;}",
  ".tdy:active{top:2px;box-shadow:0 0 0 #CC7A54;}",
  ".dtab{border:none;border-radius:9px;padding:7px 12px;font-family:'Jua',sans-serif;font-size:12px;cursor:pointer;white-space:nowrap;background:#E8CDB8;color:#6A3820;box-shadow:0 2px 0 #CC7A54;transition:all 0.1s;position:relative;top:0;}",
  ".dtab:active{top:2px;}.dtab.on{background:#E07850;color:#fff;}",
  ".btn{border:none;border-radius:12px;padding:12px 18px;font-family:'Jua',sans-serif;font-size:14px;cursor:pointer;background:#E07850;color:#fff;box-shadow:0 3px 0 #CC7A54;transition:all 0.1s;position:relative;top:0;width:100%;}",
  ".btn:active{top:3px;box-shadow:0 0 0 #CC7A54;}.btn:disabled{opacity:0.38;cursor:not-allowed;}.btn.sec{background:#E8CDB8;color:#6A3820;}",
  ".inp{width:100%;border:2px solid #E8CDB8;border-radius:10px;padding:10px 12px;font-family:'Jua',sans-serif;font-size:13px;color:#4A2010;background:#fff;outline:none;box-shadow:inset 0 2px 4px rgba(160,70,30,0.07);transition:border-color 0.14s;}",
  ".inp:focus{border-color:#E07850;}",
  "@keyframes popIn{0%{transform:scale(0.5);opacity:0;}70%{transform:scale(1.22);}100%{transform:scale(1);opacity:1;}}",
  ".pop{animation:popIn 0.18s ease both;}",
  "@keyframes fadeUp{from{opacity:0;transform:translateY(7px);}to{opacity:1;transform:translateY(0);}}",
  ".fu{animation:fadeUp 0.2s ease both;}",
].join("\n");

function useCSS() {
  useEffect(() => {
    if (document.getElementById("rb-css")) return;
    const el = document.createElement("style");
    el.id = "rb-css";
    el.textContent = CSS;
    document.head.appendChild(el);
  }, []);
}

// ── 공통 컴포넌트 ─────────────────────────────────────────────────────────────
function Ring({ pct }) {
  const size=76, stroke=6, r=(size-stroke)/2;
  const circ = 2*Math.PI*r;
  const dash = circ * (pct/100);
  return (
    <div style={{position:"relative",width:size,height:size,display:"inline-flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
      <svg width={size} height={size} style={{transform:"rotate(-90deg)",position:"absolute"}}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth={stroke}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={C.on} strokeWidth={stroke}
          strokeDasharray={dash+" "+(circ-dash)} strokeLinecap="round"
          style={{transition:"stroke-dasharray 0.45s ease"}}/>
      </svg>
      <div style={{position:"relative",textAlign:"center",lineHeight:1}}>
        <div style={{fontSize:15,color:C.text}}>{pct}%</div>
        <div style={{fontSize:9,color:C.mid,marginTop:1}}>완료</div>
      </div>
    </div>
  );
}

function Toggle({ checked, onToggle, disabled }) {
  return (
    <div className="tog" onClick={e => { e.stopPropagation(); if (!disabled) onToggle(); }}>
      <div className={"trk" + (checked ? " on" : "")}>
        <div className={"knb" + (checked ? " pop" : "")} />
        <span className="tx">✕</span>
      </div>
    </div>
  );
}

function TopNav({ title, sub, onBack }) {
  return (
    <div className="pnl fu" style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
      <button className="arw" style={{fontSize:16}} onClick={onBack}>←</button>
      <div>
        <div style={{fontSize:19,color:C.text}}>{title}</div>
        {sub && <div style={{fontSize:11,color:C.mid,marginTop:1}}>{sub}</div>}
      </div>
    </div>
  );
}

function DateNav({ viewDate, setViewDate }) {
  const dk = fmtKey(viewDate);
  const isToday = dk === TODAY_KEY;
  return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",background:"rgba(255,255,255,0.55)",borderRadius:13,padding:"11px 13px",boxShadow:"0 1px 0 rgba(255,255,255,0.88) inset,0 -2px 0 rgba(160,70,30,0.10) inset,0 2px 6px rgba(160,70,30,0.07)"}}>
      <div style={{fontSize:18,color:C.text}}>{fmtDate(viewDate)}</div>
      <div style={{display:"flex",alignItems:"center",gap:6}}>
        {!isToday && (
          <button className="tdy" onClick={() => setViewDate(new Date(TODAY))}>TODAY</button>
        )}
        <button className="arw" onClick={() => setViewDate(d => addDays(d, -1))}>‹</button>
        <button className="arw" onClick={() => setViewDate(d => addDays(d, 1))}>›</button>
      </div>
    </div>
  );
}

function WeekStrip({ viewDate, routines, checks, user }) {
  const week = getWeekDates(viewDate);
  const vk = fmtKey(viewDate);
  return (
    <div className="pnl">
      <div style={{fontSize:10,color:C.mid,marginBottom:8,letterSpacing:"0.05em"}}>이번 주</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:4}}>
        {week.map(date => {
          const key = fmtKey(date);
          const tasks = getDayTasks(routines, user, date);
          const dc = getChecks(checks, key, user);
          const done = tasks.filter(t => dc[t.id]).length;
          const ratio = tasks.length ? done/tasks.length : 0;
          const past = key < APP_START;
          const isV = key === vk;
          const isT = key === TODAY_KEY;
          let bg = "rgba(255,255,255,0.42)", tc = C.mute;
          if (past) bg = "rgba(255,255,255,0.15)";
          else if (ratio >= 1) { bg = C.on; tc = "#fff"; }
          else if (ratio >= 0.5) { bg = C.onL; tc = "#fff"; }
          return (
            <div key={key} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
              <div style={{fontSize:10,color:isV?C.on:isT?C.mid:C.mute}}>{DAY_KO[DAY_KEYS[date.getDay()]]}</div>
              <div style={{width:"100%",aspectRatio:"1",borderRadius:7,background:bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:tc,boxShadow:isV?"0 0 0 2px #E07850":isT?"0 0 0 1.5px #7A4428":"none",transition:"all 0.15s"}}>
                {ratio>=1?"✓":done>0&&!past?done:""}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── 홈 ───────────────────────────────────────────────────────────────────────
function Home({ user, setUser, viewDate, setViewDate, routines, checks, toggle, move, go }) {
  const [edit, setEdit] = useState(false);
  const dk = fmtKey(viewDate);
  const tasks = getDayTasks(routines, user, viewDate);
  const dc = getChecks(checks, dk, user);
  const done = tasks.filter(t => dc[t.id]).length;
  const pct = tasks.length ? Math.round(done/tasks.length*100) : 0;
  const canCheck = dk === TODAY_KEY;

  return (
    <div className="fu">
      <div className="pnl" style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,marginBottom:10}}>
        <div style={{flex:1}}>
          <div style={{display:"flex",gap:7,marginBottom:10}}>
            <button className={"tab"+(user==="jaei"?" on":"")} onClick={()=>setUser("jaei")}>재이</button>
            <button className={"tab"+(user==="mom"?" on":"")} onClick={()=>setUser("mom")}>엄마</button>
          </div>
          <div style={{fontSize:20,color:C.text}}>{user==="jaei"?"재이의 루틴":"엄마의 루틴"}</div>
          <div style={{fontSize:11,color:C.mid,marginTop:4}}>{done}/{tasks.length} 완료</div>
        </div>
        <Ring pct={pct}/>
      </div>

      <DateNav viewDate={viewDate} setViewDate={setViewDate}/>

      <div style={{display:"flex",gap:7,margin:"10px 0 12px",flexWrap:"wrap"}}>
        <button className={"pill"+(edit?" on":"")} onClick={()=>setEdit(p=>!p)}>{edit?"✓ 완료":"✎ 편집"}</button>
        <button className="pill" onClick={()=>go("records")}>📋 기록보드</button>
        <button className="pill" onClick={()=>go("reading")}>📚 독서기록</button>
        <button className="pill" onClick={()=>go("settings")}>⚙ 요일설정</button>
      </div>

      <div className="pnl" style={{marginBottom:12}}>
        <div style={{fontSize:10,color:C.mid,marginBottom:9}}>할 일</div>
        <div style={{display:"flex",flexDirection:"column",gap:7}}>
          {tasks.length===0 && (
            <div style={{textAlign:"center",padding:"24px 0",color:C.mute,fontSize:13}}>이 날은 할 일이 없어요 ✨</div>
          )}
          {tasks.map(task => {
            const checked = !!dc[task.id];
            return (
              <div key={task.id} className={"slot"+(checked?" done":"")} onClick={()=>{ if(canCheck) toggle(user,task.id); }}>
                {edit && (
                  <div style={{display:"flex",flexDirection:"column",gap:2}} onClick={e=>e.stopPropagation()}>
                    <button onClick={()=>move(user,task.id,-1)} style={{border:"none",borderRadius:4,background:C.pill,color:C.pillT,width:20,height:17,cursor:"pointer",fontSize:8,boxShadow:"0 1px 0 #CC7A54"}}>▲</button>
                    <button onClick={()=>move(user,task.id,1)}  style={{border:"none",borderRadius:4,background:C.pill,color:C.pillT,width:20,height:17,cursor:"pointer",fontSize:8,boxShadow:"0 1px 0 #CC7A54"}}>▼</button>
                  </div>
                )}
                <div className="si">{task.icon}</div>
                <span className="st">{task.title}</span>
                {task.link && user==="jaei" && (
                  <button style={{border:"none",borderRadius:999,background:C.pill,color:C.pillT,fontFamily:"'Jua',sans-serif",fontSize:10,padding:"3px 9px",cursor:"pointer",flexShrink:0,boxShadow:"0 2px 0 #CC7A54"}}
                    onClick={e=>{e.stopPropagation();go(task.link);}}>
                    {task.link==="reading"?"기록":"공부"}
                  </button>
                )}
                <Toggle checked={checked} onToggle={()=>toggle(user,task.id)} disabled={!canCheck}/>
              </div>
            );
          })}
        </div>
      </div>

      <WeekStrip viewDate={viewDate} routines={routines} checks={checks} user={user}/>
    </div>
  );
}

// ── 기록보드 ──────────────────────────────────────────────────────────────────
function Records({ routines, checks, user, setUser, go }) {
  return (
    <div className="fu">
      <TopNav title="📋 기록보드" sub="2026년 루틴 달성도" onBack={()=>go("home")}/>
      <div style={{display:"flex",gap:7,marginBottom:12}}>
        <button className={"tab"+(user==="jaei"?" on":"")} onClick={()=>setUser("jaei")}>재이</button>
        <button className={"tab"+(user==="mom"?" on":"")} onClick={()=>setUser("mom")}>엄마</button>
      </div>
      <div className="pnl">
        <div style={{display:"flex",gap:12,fontSize:11,color:C.mid,marginBottom:12}}>
          {[["100%",C.on],["50%+",C.onL],["일부","rgba(220,120,80,0.38)"]].map(([l,bg])=>(
            <span key={l} style={{display:"flex",alignItems:"center",gap:4}}>
              <span style={{width:10,height:10,borderRadius:3,background:bg,display:"inline-block",flexShrink:0}}/>{l}
            </span>
          ))}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14}}>
          {Object.keys(YEAR_MONTHS).map(mi => {
            const mds = YEAR_MONTHS[mi];
            return (
              <div key={mi}>
                <div style={{fontSize:11,color:C.mid,marginBottom:4,fontWeight:"bold"}}>{Number(mi)+1}월</div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2}}>
                  {Array.from({length:mds[0].getDay()}).map((_,i)=><div key={i}/>)}
                  {mds.map(date => {
                    const key = fmtKey(date);
                    const tasks = getDayTasks(routines, user, date);
                    const dc = getChecks(checks, key, user);
                    const done = tasks.filter(t=>dc[t.id]).length;
                    const ratio = tasks.length ? done/tasks.length : 0;
                    const past = key < APP_START;
                    let bg = "rgba(255,255,255,0.25)";
                    if (past) bg = "rgba(255,255,255,0.1)";
                    else if (ratio>=1) bg = C.on;
                    else if (ratio>=0.5) bg = C.onL;
                    else if (ratio>0) bg = "rgba(220,120,80,0.38)";
                    return <div key={key} title={key+" "+done+"/"+tasks.length} style={{aspectRatio:"1",borderRadius:2,background:bg}}/>;
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── 독서기록 ──────────────────────────────────────────────────────────────────
function Reading({ logs, saveLog, go }) {
  const ex = logs[TODAY_KEY] || {};
  const [b1, setB1] = useState(ex.book1 || "");
  const [b2, setB2] = useState(ex.book2 || "");
  const [en, setEn] = useState(ex.englishBook || "");
  const ok = b1.trim() && b2.trim() && en.trim();
  const all = Object.entries(logs).sort((a,b)=>b[0].localeCompare(a[0]));
  return (
    <div className="fu">
      <TopNav title="📚 독서기록장" sub="오늘 읽은 책을 기록하고 전체 기록을 봐요" onBack={()=>go("home")}/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,alignItems:"start"}}>
        <div className="pnl">
          <div style={{fontSize:12,color:C.mid,marginBottom:12}}>{TODAY_KEY} 기록</div>
          <div style={{display:"flex",flexDirection:"column",gap:11}}>
            {[["한글책 ①",b1,setB1],["한글책 ②",b2,setB2],["영어책",en,setEn]].map(([label,val,setter])=>(
              <div key={label}>
                <label style={{display:"block",fontSize:11,color:C.mid,marginBottom:5}}>{label}</label>
                <input className="inp" value={val} onChange={e=>setter(e.target.value)} placeholder="책 제목"/>
              </div>
            ))}
            <button className="btn" disabled={!ok} style={{marginTop:4}} onClick={()=>saveLog(b1,b2,en)}>저장하고 완료 ✓</button>
          </div>
        </div>
        <div className="pnl" style={{maxHeight:460,overflowY:"auto"}}>
          <div style={{fontSize:12,color:C.mid,marginBottom:10}}>전체 기록 ({all.length}일)</div>
          {all.length===0
            ? <div style={{textAlign:"center",padding:"24px 0",color:C.mute,fontSize:12}}>아직 기록이 없어요 📖</div>
            : all.map(([key,val])=>(
              <div key={key} style={{padding:"9px 0",borderBottom:"1px solid rgba(255,255,255,0.45)"}}>
                <div style={{fontSize:10,color:C.mid,marginBottom:4}}>{key}</div>
                {[["📘",val.book1],["📗",val.book2],["📙",val.englishBook]].map(([ico,txt])=>(
                  <div key={ico} style={{fontSize:12,color:C.text,display:"flex",gap:5,overflow:"hidden"}}>
                    <span>{ico}</span><span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{txt}</span>
                  </div>
                ))}
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
}

// ── 설정 ─────────────────────────────────────────────────────────────────────
function Settings({ user, setUser, routines, updateDays, addTask, go }) {
  const [sel, setSel] = useState(dayKey(new Date()));
  const [title, setTitle] = useState("");
  const [icon, setIcon] = useState("⭐");
  const tasks = routines[user].slice().sort((a,b)=>a.order-b.order);
  return (
    <div className="fu">
      <TopNav title="⚙ 요일별 설정" sub="할 일을 요일마다 켜고 끌 수 있어요" onBack={()=>go("home")}/>
      <div style={{display:"flex",gap:7,marginBottom:10}}>
        <button className={"tab"+(user==="jaei"?" on":"")} onClick={()=>setUser("jaei")}>재이</button>
        <button className={"tab"+(user==="mom"?" on":"")} onClick={()=>setUser("mom")}>엄마</button>
      </div>
      <div style={{display:"flex",gap:7,overflowX:"auto",paddingBottom:4,marginBottom:10}}>
        {["mon","tue","wed","thu","fri","sat","sun"].map(d=>(
          <button key={d} className={"dtab"+(sel===d?" on":"")} onClick={()=>setSel(d)}>{DAY_FULL[d]}</button>
        ))}
      </div>
      <div className="pnl">
        <div style={{fontSize:13,color:C.text,marginBottom:9}}>{DAY_FULL[sel]} 루틴</div>
        <div style={{display:"flex",flexDirection:"column",gap:7}}>
          {tasks.map(task=>{
            const active = task.days.includes(sel);
            return (
              <div key={task.id} className="slot" style={{background:active?"rgba(224,120,80,0.1)":"rgba(255,255,255,0.55)"}}
                onClick={()=>updateDays(user,task.id,sel)}>
                <span style={{fontSize:16}}>{task.icon}</span>
                <span style={{flex:1,fontSize:13,color:active?C.text:C.mute}}>{task.title}</span>
                <Toggle checked={active} onToggle={()=>updateDays(user,task.id,sel)} disabled={false}/>
              </div>
            );
          })}
        </div>
        <div style={{marginTop:12,padding:12,background:"rgba(255,255,255,0.35)",borderRadius:12,border:"2px dashed rgba(224,120,80,0.3)"}}>
          <div style={{fontSize:11,color:C.mid,marginBottom:8}}>+ {DAY_FULL[sel]}에 할 일 추가</div>
          <div style={{display:"grid",gridTemplateColumns:"44px 1fr auto",gap:7,alignItems:"center"}}>
            <input className="inp" value={icon} onChange={e=>setIcon(e.target.value)} style={{textAlign:"center",fontSize:18,padding:"8px 4px"}}/>
            <input className="inp" value={title} onChange={e=>setTitle(e.target.value)} placeholder="할 일 이름" style={{fontSize:12,padding:"8px 10px"}}/>
            <button className="btn" style={{width:"auto",padding:"8px 12px",fontSize:12}}
              onClick={()=>{addTask(user,title,icon,sel);setTitle("");setIcon("⭐");}}>추가</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── 한자 미니앱 ───────────────────────────────────────────────────────────────
function Hanja({ go, done }) {
  const [grade, setGrade] = useState("8급");
  const [setId, setSetId] = useState("grade8-all");
  const [mode, setMode] = useState(null); // null=랜딩, "practice", "easy", "hard"
  const [idx, setIdx] = useState(0);
  const [answer, setAnswer] = useState({m:"",r:""});
  const [score, setScore] = useState(0);
  const [choices, setChoices] = useState([]);
  const [result, setResult] = useState(null); // null | "correct" | "wrong"
  const [finished, setFinished] = useState(false);
  const [wrong, setWrong] = useState([]);

  const list = getHanjaSet(grade, setId);
  const item = list[idx];
  const study = item ? getStudyContent(item) : null;
  const total = list.length;

  function startMode(m) {
    setMode(m); setIdx(0); setScore(0); setWrong([]);
    if (m==="easy") setChoices(createChoices(list[0], list));
  }

  function nextCard() {
    if (idx >= total-1) { setFinished(true); return; }
    const next = idx+1;
    setResult(null);
    if (mode==="easy") setChoices(createChoices(list[next], list));
  }

  function handleEasyChoice(chosen) {
    if (result) return;
    const ok = chosen.char === item.char;
    setResult(ok?"correct":"wrong");
    if (ok) setScore(s=>s+1);
    else setWrong(w=>[...w, item.char]);
  }

  function handleHardSubmit() {
    if (result) return;
    const ok = normalize(answer.m)===normalize(item.meaning) && normalize(answer.r)===normalize(item.reading);
    setResult(ok?"correct":"wrong");
    if (ok) setScore(s=>s+1);
    else setWrong(w=>[...w, item.char]);
  }

  function handleGradeChange(g) {
    setGrade(g);
    const firstSet = HANJA_SETS[g][0].id;
    setSetId(firstSet);
    setMode(null); setFinished(false);
  }

  const card = {width:130,height:130,borderRadius:18,background:"rgba(255,255,255,0.7)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:84,fontFamily:"serif",color:C.text,margin:"0 auto 14px",boxShadow:"inset 0 2px 6px rgba(160,70,30,0.1),0 3px 0 #CC7A54"};

  // 완료 화면
  if (finished) return (
    <div className="fu">
      <TopNav title="🀄 한자" sub="" onBack={()=>go("home")}/>
      <div className="pnl" style={{textAlign:"center",padding:28}}>
        <div style={{fontSize:48,marginBottom:12}}>🎉</div>
        <div style={{fontSize:22,color:C.text,marginBottom:6}}>{mode==="practice"?"연습 완료!":"시험 완료!"}</div>
        {mode!=="practice" && <div style={{fontSize:16,color:C.mid,marginBottom:16}}>맞춤: {score} / {total}</div>}
        {wrong.length>0 && (
          <div style={{marginBottom:16}}>
            <div style={{fontSize:12,color:C.mid,marginBottom:8}}>다시 볼 한자</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:6,justifyContent:"center"}}>
              {wrong.map(c=><span key={c} style={{background:"rgba(255,255,255,0.6)",borderRadius:8,padding:"4px 10px",fontSize:20,fontFamily:"serif",color:C.text}}>{c}</span>)}
            </div>
          </div>
        )}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9,marginTop:8}}>
          <button className="btn sec" onClick={()=>{setMode(null);setFinished(false);}}>처음으로</button>
          <button className="btn" onClick={done}>홈으로 ✓</button>
        </div>
      </div>
    </div>
  );

  // 랜딩
  if (!mode) return (
    <div className="fu">
      <TopNav title="🀄 한자 연습" sub="급수와 모드를 선택해요" onBack={()=>go("home")}/>
      <div className="pnl" style={{marginBottom:12}}>
        <div style={{fontSize:11,color:C.mid,marginBottom:8}}>급수 선택</div>
        <div style={{display:"flex",gap:8,marginBottom:16}}>
          {["8급","7급"].map(g=>(
            <button key={g} className={"tab"+(grade===g?" on":"")} onClick={()=>handleGradeChange(g)}>{g}</button>
          ))}
        </div>
        <div style={{fontSize:11,color:C.mid,marginBottom:8}}>세트 선택</div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          {HANJA_SETS[grade].map(s=>(
            <button key={s.id} className={"dtab"+(setId===s.id?" on":"")} onClick={()=>setSetId(s.id)}>{s.label}</button>
          ))}
        </div>
      </div>
      <div className="pnl">
        <div style={{fontSize:11,color:C.mid,marginBottom:10}}>모드 선택 ({getHanjaSet(grade,setId).length}자)</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:9}}>
          {[["practice","📖","연습","카드 넘기기"],["easy","🟡","순한맛","보기 3개 중 선택"],["hard","🌶️","마라맛","뜻·음 직접 입력"]].map(([m,ico,label,desc])=>(
            <button key={m} onClick={()=>startMode(m)}
              style={{border:"none",borderRadius:12,padding:"14px 10px",background:"rgba(255,255,255,0.7)",cursor:"pointer",boxShadow:"0 2px 0 #CC7A54",fontFamily:"'Jua',sans-serif"}}>
              <div style={{fontSize:22,marginBottom:4}}>{ico}</div>
              <div style={{fontSize:14,color:C.text}}>{label}</div>
              <div style={{fontSize:10,color:C.mid,marginTop:2}}>{desc}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // 연습 모드
  if (mode==="practice") return (
    <div className="fu">
      <TopNav title={"🀄 연습 · "+grade+" · "+(idx+1)+"/"+total} sub="" onBack={()=>setMode(null)}/>
      <div className="pnl" style={{textAlign:"center",padding:20}}>
        <div style={card}>{item.char}</div>
        <div style={{fontSize:20,color:C.text,marginBottom:8}}>{item.meaning} / {item.reading}</div>
        {study.words.length>0 && (
          <div style={{display:"flex",gap:6,flexWrap:"wrap",justifyContent:"center",marginBottom:10}}>
            {study.words.map(w=><span key={w} style={{background:"rgba(255,255,255,0.6)",borderRadius:999,padding:"4px 11px",fontSize:12,color:C.text,boxShadow:"0 2px 0 #CC7A54"}}>{w}</span>)}
          </div>
        )}
        <div style={{background:"rgba(255,255,255,0.5)",borderRadius:11,padding:"10px 14px",color:C.mid,fontSize:13,marginBottom:16}}>{study.s}</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9}}>
          <button className="btn sec" onClick={()=>setIdx(Math.max(0,idx-1))}>← 이전</button>
          <button className="btn" onClick={nextCard}>{idx>=total-1?"완료하기 ✓":"다음 →"}</button>
        </div>
      </div>
    </div>
  );

  // 순한맛
  if (mode==="easy") return (
    <div className="fu">
      <TopNav title={"🟡 순한맛 · "+grade+" · "+(idx+1)+"/"+total} sub={"맞춤: "+score} onBack={()=>setMode(null)}/>
      <div className="pnl" style={{textAlign:"center",padding:20}}>
        <div style={card}>{item.char}</div>
        <div style={{fontSize:12,color:C.mid,marginBottom:12}}>뜻과 음이 맞는 것을 고르세요</div>
        <div style={{display:"flex",flexDirection:"column",gap:9}}>
          {choices.map(ch=>{
            const isCorrect = ch.char===item.char;
            let bg="rgba(255,255,255,0.7)";
            if (result && isCorrect) bg="#d4edda";
            else if (result && ch.char===choices.find(x=>result&&!isCorrect&&x.char===ch.char)?.char) bg="#f8d7da";
            return (
              <button key={ch.char} onClick={()=>handleEasyChoice(ch)}
                style={{border:"none",borderRadius:11,padding:"12px 16px",background:bg,cursor:result?"default":"pointer",fontFamily:"'Jua',sans-serif",fontSize:14,color:C.text,boxShadow:"0 2px 0 #CC7A54",textAlign:"left"}}>
                {ch.meaning} / {ch.reading}
                {result && isCorrect && " ✓"}
              </button>
            );
          })}
        </div>
        {result && (
          <div style={{marginTop:14}}>
            <div style={{fontSize:13,color:result==="correct"?C.on:C.mid,marginBottom:10}}>
              {result==="correct"?"정답! 🎉":"오답 😅 → "+item.meaning+" / "+item.reading}
            </div>
            <button className="btn" onClick={nextCard}>{idx>=total-1?"결과 보기":"다음 →"}</button>
          </div>
        )}
      </div>
    </div>
  );

  // 마라맛
  if (mode==="hard") return (
    <div className="fu">
      <TopNav title={"🌶️ 마라맛 · "+grade+" · "+(idx+1)+"/"+total} sub={"맞춤: "+score} onBack={()=>setMode(null)}/>
      <div className="pnl" style={{textAlign:"center",padding:20}}>
        <div style={card}>{item.char}</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9,marginBottom:12}}>
          <div>
            <label style={{display:"block",fontSize:11,color:C.mid,marginBottom:5}}>뜻</label>
            <input className="inp" value={answer.m} onChange={e=>setAnswer(a=>({...a,m:e.target.value}))}
              placeholder="예: 노래" disabled={!!result} style={{textAlign:"center"}}/>
          </div>
          <div>
            <label style={{display:"block",fontSize:11,color:C.mid,marginBottom:5}}>음</label>
            <input className="inp" value={answer.r} onChange={e=>setAnswer(a=>({...a,r:e.target.value}))}
              placeholder="예: 가" disabled={!!result} style={{textAlign:"center"}}/>
          </div>
        </div>
        {!result
          ? <button className="btn" onClick={handleHardSubmit} disabled={!answer.m||!answer.r}>확인</button>
          : <div>
              <div style={{fontSize:13,color:result==="correct"?C.on:C.mid,marginBottom:10}}>
                {result==="correct"?"정답! 🎉":"오답 😅 → "+item.meaning+" / "+item.reading}
              </div>
              <button className="btn" onClick={nextCard}>{idx>=total-1?"결과 보기":"다음 →"}</button>
            </div>
        }
      </div>
    </div>
  );

  return null;
}

// ── 사이트워드 ────────────────────────────────────────────────────────────────
function SightWords({ go, done }) {
  const levels = Object.keys(SIGHT);
  const [lv, setLv] = useState(levels[0]);
  const [i, setI] = useState(0);
  const words = SIGHT[lv].split(",");
  return (
    <div className="fu">
      <TopNav title="🔤 사이트워드" sub="소리 내서 읽고 넘겨요" onBack={()=>go("home")}/>
      <div style={{display:"flex",gap:7,overflowX:"auto",paddingBottom:4,marginBottom:12}}>
        {levels.map(l=><button key={l} className={"dtab"+(lv===l?" on":"")} onClick={()=>{setLv(l);setI(0);}}>{l}</button>)}
      </div>
      <div className="pnl" style={{textAlign:"center",padding:28}}>
        <div style={{minHeight:130,borderRadius:18,background:"rgba(255,255,255,0.7)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:60,color:C.text,marginBottom:12,boxShadow:"inset 0 2px 6px rgba(160,70,30,0.09),0 3px 0 #CC7A54"}}>{words[i]}</div>
        <div style={{fontSize:11,color:C.mid,marginBottom:18}}>{i+1} / {words.length}</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9}}>
          <button className="btn sec" onClick={()=>setI(Math.max(0,i-1))}>← 이전</button>
          {i<words.length-1
            ? <button className="btn" onClick={()=>setI(i+1)}>다음 →</button>
            : <button className="btn" onClick={done}>완료하기 ✓</button>}
        </div>
      </div>
    </div>
  );
}

// ── 루트 ─────────────────────────────────────────────────────────────────────
export default function App() {
  useCSS();
  const [viewDate, setViewDate] = useState(new Date());
  const [user, setUser] = useState("jaei");
  const [screen, setScreen] = useState("home");
  const [routines, setRoutines] = useState(() => load("rb7-r", ROUTINES0));
  const [checks, setChecks] = useState(() => load("rb7-c", {}));
  const [logs, setLogs] = useState(() => load("rb7-l", {}));

  useEffect(() => save("rb7-r", routines), [routines]);
  useEffect(() => save("rb7-c", checks), [checks]);
  useEffect(() => save("rb7-l", logs), [logs]);

  function toggle(u, id) {
    const dk = fmtKey(viewDate);
    if (dk !== TODAY_KEY) return;
    setChecks(prev => {
      const d = prev[dk] || {};
      const uu = d[u] || {};
      return { ...prev, [dk]: { ...d, [u]: { ...uu, [id]: !uu[id] } } };
    });
  }
  function markDone(u, id) {
    setChecks(prev => {
      const d = prev[TODAY_KEY] || {};
      const uu = d[u] || {};
      return { ...prev, [TODAY_KEY]: { ...d, [u]: { ...uu, [id]: true } } };
    });
  }
  function move(u, id, dir) {
    const list = routines[u].slice().sort((a,b)=>a.order-b.order);
    const i = list.findIndex(t=>t.id===id);
    const tgt = i + dir;
    if (i<0||tgt<0||tgt>=list.length) return;
    const tmp = list[i]; list[i]=list[tgt]; list[tgt]=tmp;
    setRoutines(prev => ({ ...prev, [u]: list.map((t,n)=>({...t,order:n+1})) }));
  }
  function updateDays(u, id, day) {
    setRoutines(prev => ({
      ...prev,
      [u]: prev[u].map(t => {
        if (t.id!==id) return t;
        const has = t.days.includes(day);
        return { ...t, days: has ? t.days.filter(d=>d!==day) : [...t.days, day] };
      })
    }));
  }
  function addTask(u, title, icon, day) {
    const tr = title.trim();
    if (!tr) return;
    setRoutines(prev => {
      const list = prev[u];
      const max = list.reduce((m,t)=>Math.max(m,t.order||0),0);
      return { ...prev, [u]: [...list, {id:"c"+Date.now(),icon:icon.trim()||"⭐",title:tr,days:[day],order:max+1}] };
    });
  }
  function saveLog(b1, b2, en) {
    setLogs(prev => ({ ...prev, [TODAY_KEY]: { book1:b1, book2:b2, englishBook:en } }));
    markDone("jaei","reading");
    setScreen("home");
  }

  const go = setScreen;

  return (
    <div className="root">
      {screen==="home" && <Home user={user} setUser={setUser} viewDate={viewDate} setViewDate={setViewDate} routines={routines} checks={checks} toggle={toggle} move={move} go={go}/>}
      {screen==="records" && <Records routines={routines} checks={checks} user={user} setUser={setUser} go={go}/>}
      {screen==="reading" && <Reading logs={logs} saveLog={saveLog} go={go}/>}
      {screen==="settings" && <Settings user={user} setUser={setUser} routines={routines} updateDays={updateDays} addTask={addTask} go={go}/>}
      {screen==="hanja" && <Hanja go={go} done={()=>{markDone("jaei","hanja");go("home");}}/>}
      {screen==="sight" && <SightWords go={go} done={()=>{markDone("jaei","sight");go("home");}}/>}
    </div>
  );
}
