'use strict';

// ============================================================
//  CONSTANTS — Medical Journal Style
// ============================================================

const JOURNAL_TITLES = [
  'New Albion Journal of Medicine, Vol. 391, Issue 4 (2024)',
  'The Lanced, Vol. 403, Issue 10424 (2024)',
  'JOMA: Journal of the American Medical Organisation, Vol. 331, No. 2 (2024)',
  'BML: British Medical Letters, Vol. 384 (2024)',
  'Nurture Medicine, Vol. 30, Issue 1 (2024)',
  'Annals of Clinical Medicine, Vol. 177, Issue 1 (2024)',
  'Journal of Clinical Oncography, Vol. 42, Issue 2 (2024)',
  'Calculation, Vol. 149, Issue 4 (2024)',
  'JOMA Internal Medicine, Vol. 184, No. 3 (2024)',
  'The Lanced Digital Sciences, Vol. 6, Issue 2 (2024)',
];

const NEWSPAPER_TITLES = [
  'The Morning Clarion',
  'The Daily Tribune',
  'The Global Observer',
  'The Metropolitan Post',
  'The National Courier',
  'The World Dispatch',
  'The Continental Times',
  'The Harbour Chronicle',
  'The Eastern Gazette',
  'The Pacific Ledger',
];

const CONNECTORS = [
  'Therefore, ', 'Furthermore, ', 'In this study, ',
  'Notably, ', 'Consequently, ', 'Moreover, ',
  'Clinical evidence suggests that ', 'These data demonstrate that ',
  'The present analysis indicates that ', 'It should be noted that ',
  'Consistent with previous findings, ', 'In contrast to prior reports, ',
  'Importantly, ', 'In accordance with established guidelines, ',
  'The results confirm that ', 'As previously reported, ',
];

const CITATIONS = [
  ' [1]', ' [3]', ' [7]', ' [12]', ' [18]', ' [24]', ' [31]',
  ' (Smith et al., 2023)', ' (Johnson & Lee, 2024)',
  ' (Wang et al., 2022)', ' (Brown, 2024)',
  ' (Garcia et al., 2023)', ' (Kim & Park, 2024)',
  ' (Nakamura et al., 2024)', ' (Chen, 2024)',
  ' (Yamamoto et al., 2023)', ' (Sato & Tanaka, 2024)',
];

// ============================================================
//  KANA → ROMAJI ENGINE
// ============================================================

const COMPOUND_KANA = {
  'きゃ':'kya','きゅ':'kyu','きょ':'kyo',
  'しゃ':'sha','しゅ':'shu','しょ':'sho',
  'ちゃ':'cha','ちゅ':'chu','ちょ':'cho',
  'にゃ':'nya','にゅ':'nyu','にょ':'nyo',
  'ひゃ':'hya','ひゅ':'hyu','ひょ':'hyo',
  'みゃ':'mya','みゅ':'myu','みょ':'myo',
  'りゃ':'rya','りゅ':'ryu','りょ':'ryo',
  'ぎゃ':'gya','ぎゅ':'gyu','ぎょ':'gyo',
  'じゃ':'ja', 'じゅ':'ju', 'じょ':'jo',
  'びゃ':'bya','びゅ':'byu','びょ':'byo',
  'ぴゃ':'pya','ぴゅ':'pyu','ぴょ':'pyo',
  'ふぁ':'fa', 'ふぃ':'fi', 'ふぇ':'fe', 'ふぉ':'fo',
  'てぃ':'ti', 'でぃ':'di', 'つぁ':'tsa',
};

const SINGLE_KANA = {
  'あ':'a','い':'i','う':'u','え':'e','お':'o',
  'か':'ka','き':'ki','く':'ku','け':'ke','こ':'ko',
  'さ':'sa','し':'shi','す':'su','せ':'se','そ':'so',
  'た':'ta','ち':'chi','つ':'tsu','て':'te','と':'to',
  'な':'na','に':'ni','ぬ':'nu','ね':'ne','の':'no',
  'は':'wa','ひ':'hi','ふ':'fu','へ':'e','ほ':'ho',
  'ま':'ma','み':'mi','む':'mu','め':'me','も':'mo',
  'や':'ya','ゆ':'yu','よ':'yo',
  'ら':'ra','り':'ri','る':'ru','れ':'re','ろ':'ro',
  'わ':'wa','ゐ':'i','ゑ':'e','を':'o',
  'ん':'n',
  'が':'ga','ぎ':'gi','ぐ':'gu','げ':'ge','ご':'go',
  'ざ':'za','じ':'ji','ず':'zu','ぜ':'ze','ぞ':'zo',
  'だ':'da','ぢ':'di','づ':'du','で':'de','ど':'do',
  'ば':'ba','び':'bi','ぶ':'bu','べ':'be','ぼ':'bo',
  'ぱ':'pa','ぴ':'pi','ぷ':'pu','ぺ':'pe','ぽ':'po',
  'ぁ':'a','ぃ':'i','ぅ':'u','ぇ':'e','ぉ':'o',
  'ゃ':'ya','ゅ':'yu','ょ':'yo',
  'っ':'','ー':'-',
  '。':'. ','、':', ','！':'! ','？':'? ',
  '…':'...','・':'-','〜':'-','　':' ',
  '「':'"','」':'"','『':"'",'』':"'",
  '（':'(','）':')','【':'[','】':']',
  '：':': ','；':'; ',
};

function katakanaToHiragana(str) {
  return str.replace(/[\u30A1-\u30F6\u30FC]/g, ch => {
    const c = ch.charCodeAt(0);
    return c === 0x30FC ? 'ー' : String.fromCharCode(c - 0x60);
  });
}

// Convert a hiragana string (no kanji, no katakana) to romaji
function hiraganaToRomaji(hira) {
  let result = '';
  let i = 0;
  let capNext = false; // caller controls initial cap

  while (i < hira.length) {
    if (i + 1 < hira.length) {
      const two = hira[i] + hira[i + 1];
      if (COMPOUND_KANA[two] !== undefined) {
        result += COMPOUND_KANA[two];
        i += 2; continue;
      }
    }

    const ch = hira[i];
    if (ch === 'っ') {
      if (i + 1 < hira.length) {
        const nc = hira[i + 1];
        const nRom = COMPOUND_KANA[nc + (hira[i + 2] || '')] || SINGLE_KANA[nc] || '';
        if (nRom && !/^[aeiou]/.test(nRom)) result += nRom[0];
      }
      i++; continue;
    }
    // Standard Hepburn: は→ha, へ→he, を→wo (SINGLE_KANA has phonetic shortcuts for tableRomanize)
    const romaji = (ch === 'は') ? 'ha' : (ch === 'へ') ? 'he' : (ch === 'を') ? 'wo' : SINGLE_KANA[ch];
    if (romaji !== undefined) {
      result += romaji;
    } else {
      result += ch; // fallback: keep as-is
    }
    i++;
  }
  return result;
}

// ============================================================
//  KANJI FALLBACK TABLE (~350 common kanji for when kuromoji unavailable)
// ============================================================

const KANJI_ROMAJI = {
  '一':'ichi','二':'ni','三':'san','四':'shi','五':'go',
  '六':'roku','七':'shichi','八':'hachi','九':'ku','十':'juu',
  '百':'hyaku','千':'sen','万':'man','億':'oku','兆':'chou',
  '零':'rei','半':'han','倍':'bai',
  '年':'nen','月':'tsuki','日':'nichi','時':'ji','分':'fun',
  '秒':'byou','週':'shuu','昨':'saku','今':'ima','来':'rai',
  '毎':'mai','去':'kyo','当':'tou','初':'sho','末':'matsu',
  '朝':'asa','夕':'yuu','夜':'yoru','午':'hiru','頃':'goro',
  '間':'kan','際':'sai','期':'ki','代':'dai','世':'sei',
  '紀':'nori','前':'zen','後':'ato','以':'i',
  '上':'ue','下':'shita','左':'hidari','右':'migi',
  '中':'naka','外':'soto','内':'uchi','横':'yoko','縦':'tate',
  '奥':'oku','東':'higashi','西':'nishi','南':'minami','北':'kita',
  '側':'gawa','辺':'hen','隣':'tonari','向':'muki','先':'saki',
  '大':'dai','小':'shou','高':'kou','低':'tei',
  '多':'ta','少':'shou','長':'naga','短':'tan',
  '広':'hiro','狭':'kyou','重':'juu','軽':'kei',
  '強':'tsuyoi','弱':'yowa','速':'soku','遅':'chii',
  '深':'shin','浅':'sen','新':'shin','古':'furu',
  '若':'waka','好':'kou','悪':'waru','正':'sei','誤':'go',
  '真':'shin','明':'mei','暗':'an','清':'kiyoi','汚':'o',
  '温':'on','熱':'netsu','冷':'tsumetai','寒':'samu','暖':'atata',
  '人':'hito','男':'otoko','女':'onna','子':'ko',
  '親':'oya','父':'chichi','母':'haha','兄':'ani','姉':'ane',
  '弟':'otouto','妹':'imouto','友':'tomo','者':'sha','民':'min',
  '員':'in','主':'shu','家':'ie','族':'zoku','様':'sama',
  '氏':'shi','君':'kun','婦':'fu','夫':'otto','児':'ji',
  '童':'dou','老':'rou','幼':'you','成':'sei',
  '師':'sensei','生':'sei','徒':'to',
  '山':'yama','川':'kawa','海':'umi','空':'sora','木':'ki',
  '花':'hana','草':'kusa','水':'mizu','火':'hi','土':'tsuchi',
  '風':'kaze','雨':'ame','雪':'yuki','石':'ishi','地':'chi',
  '島':'shima','池':'ike','森':'mori','林':'hayashi','田':'ta',
  '野':'no','丘':'oka','谷':'tani','岩':'iwa','砂':'suna',
  '陸':'riku','岸':'kishi','港':'minato','湾':'wan','洋':'you',
  '国':'koku','都':'to','市':'shi','区':'ku','町':'machi',
  '村':'mura','道':'dou','府':'fu','県':'ken','省':'shou',
  '本':'hon','米':'bei','英':'ei','独':'doku','仏':'futsu',
  '韓':'kan','欧':'ou','亜':'a','洲':'shuu','界':'kai','域':'iki',
  '金':'kin','銀':'gin','円':'en','株':'kabu','会':'kai',
  '社':'sha','業':'gyou','産':'san','工':'kou','農':'nou',
  '商':'shou','貿':'bou','税':'zei','収':'shuu','益':'eki',
  '損':'son','価':'ka','格':'kaku','費':'hi','額':'gaku',
  '輸':'yu','資':'shi','財':'zai','富':'fu',
  '政':'sei','議':'gi','党':'tou','選':'sen','挙':'kyo',
  '律':'ritsu','権':'ken','利':'ri','義':'gi','務':'mu',
  '制':'sei','度':'do','規':'ki','則':'soku','条':'jou',
  '約':'yaku','平':'hei','和':'wa','戦':'sen','争':'sou',
  '安':'an','全':'zen','保':'ho','証':'shou','危':'ki',
  '険':'ken','軍':'gun','防':'bou','衛':'ei','交':'kou',
  '連':'ren','合':'gou','盟':'mei',
  '学':'gaku','校':'kou','研':'ken','究':'kyuu','論':'ron',
  '文':'bun','書':'sho','読':'doku','語':'go','話':'wa',
  '字':'ji','数':'suu','科':'ka','教':'kyou','授':'ju',
  '図':'zu','表':'hyou','式':'shiki','問':'mon','題':'dai',
  '答':'tou','解':'kai','説':'setsu','法':'hou','理':'ri',
  '仮':'ka','実':'jitsu','験':'ken','結':'ketsu','果':'ka',
  '報':'hou','告':'koku','発':'hatsu','見':'ken','系':'kei',
  '統':'tou','分':'bun','析':'seki','較':'kaku','均':'kin',
  '偏':'hen','有':'yuu','意':'i','的':'teki','化':'ka',
  '性':'sei','能':'nou','力':'chikara','感':'kan','知':'chi',
  '識':'shiki','経':'kei','観':'kan','察':'satsu','類':'rui',
  '順':'jun','序':'jo','方':'hou',
  '病':'byou','医':'i','薬':'yaku','治':'chi','療':'ryou',
  '診':'shin','断':'dan','術':'jutsu','患':'kan','症':'shou',
  '状':'jou','検':'ken','査':'sa','脳':'nou','心':'shin',
  '肺':'hai','肝':'kimo','腎':'jin','血':'ketsu','管':'kuda',
  '骨':'kotsu','筋':'kin','神':'shin','炎':'en','癌':'gan',
  '腫':'shu','瘍':'you','毒':'doku','菌':'kin','素':'so',
  '酸':'san','率':'ritsu','測':'soku','定':'tei','値':'chi',
  '量':'ryou','効':'kou','副':'fuku','用':'you','急':'kyuu',
  '慢':'man','臨':'rin','床':'shoo','予':'yo','接':'setsu',
  '種':'shu','免':'men','疫':'eki','細':'sai','胞':'bou',
  '遺':'i','伝':'den','染':'sen','色':'shoku','体':'tai',
  '白':'haku','質':'shitsu','脂':'shi','肪':'bou','炭':'tan',
  '基':'ki','酵':'kou','抗':'kou','受':'ju','容':'you',
  '刺':'shi','激':'geki','応':'ou','比':'hi','差':'sa',
  '技':'gi','機':'ki','器':'utsuwa','装':'sou','置':'chi',
  '設':'setsu','備':'bi','電':'den','気':'ki','光':'kou',
  '音':'on','波':'ha','信':'shin','号':'gou','御':'go',
  '操':'sou','処':'sho','情':'jou','通':'tsuu','網':'mou',
  '路':'ro','線':'sen','端':'tan','回':'kai','導':'dou',
  '事':'koto','物':'mono','所':'sho','場':'ba',
  '関':'kan','部':'bu','門':'mon','課':'ka','係':'kakari',
  '担':'tan','責':'seki','任':'nin','運':'un','営':'ei',
  '施':'shi','行':'kou','記':'ki','録':'roku','絡':'raku',
  '確':'kaku','認':'nin','開':'kai','閉':'hei','増':'zou',
  '減':'gen','変':'hen','進':'shin','退':'tai','提':'tei',
  '供':'kyou','示':'ji','根':'kon','拠':'kyo','準':'jun',
  '標':'hyou','対':'tai','象':'shou','境':'kyou','環':'kan',
  '影':'ei','響':'kyou','要':'you','因':'in','原':'gen',
  '特':'toku','徴':'chou','属':'zoku','群':'gun','集':'shuu',
  '団':'dan','組':'kumi','織':'shiki','構':'kou','造':'zou',
  '形':'kei','態':'tai','模':'mo','範':'han','段':'dan',
  '策':'saku','案':'an','画':'kaku','目':'moku',
  '評':'hyou','判':'han','決':'ketsu','択':'taku','採':'sai',
  '適':'teki','現':'gen','況':'kyou','改':'kai','善':'zen',
  '革':'kaku','展':'ten','拡':'kaku','縮':'shuku','推':'sui',
  '促':'soku','支':'shi','援':'en','協':'kyou','共':'kyou',
  '同':'dou','調':'chou','活':'katsu','動':'dou',
  '止':'shi','始':'haji','終':'shuu','考':'kan',
  '思':'shi','言':'gen','聞':'bun','習':'shuu',
  '練':'ren','訓':'kun','作':'saku','創':'sou','建':'ken',
  '修':'shuu','壊':'kai','破':'ha',
  // ── Extended coverage ──
  '概':'gai','念':'nen','続':'zoku','必':'hitsu','在':'zai','存':'son',
  '次':'ji','最':'sai','近':'kin','遠':'en','早':'sou','程':'tei',
  '可':'ka','否':'hi','非':'hi','無':'mu','不':'fu','再':'sai','更':'kou',
  '各':'kaku','面':'men','点':'ten','型':'gata','品':'hin','名':'mei',
  '計':'kei','想':'sou','完':'kan','了':'ryou','静':'sei',
  '列':'retsu','項':'kou','算':'san','割':'wari','限':'gen',
  '委':'i','整':'sei','純':'jun','指':'shi','底':'tei',
  '局':'kyoku','庁':'chou','院':'in','専':'sen',
  '館':'kan','街':'gai','駅':'eki','店':'ten','園':'en',
  '手':'te','口':'kou','頭':'tou','足':'soku','声':'sei',
  '味':'mi','天':'ten','愛':'ai','命':'mei',
  '取':'shu','持':'ji','得':'toku','求':'kyuu',
  '歩':'ho','休':'kyuu','帰':'ki','飲':'in','食':'shoku','失':'shitsu',
  '歴':'reki','史':'shi','勝':'shou','負':'fu','敗':'hai',
  '競':'kyou','功':'kou','別':'betsu','等':'tou','試':'shi',
  '令':'rei','出':'shutsu','入':'nyuu','介':'kai','護':'go','述':'jutsu',
  '他':'ta','版':'han','旧':'kyuu','既':'ki','配':'hai','弁':'ben',
  '紹':'shou','討':'tou','件':'ken','訪':'hou','及':'kyuu',
  '被':'hi','加':'ka','参':'san','注':'chuu','申':'shin',
  // ── News / politics / society ──
  '自':'ji','圧':'atsu','衆':'shuu','携':'kei','散':'san','従':'juu',
  '投':'tou','稿':'kou','印':'shirushi','苗':'byou','精':'sei',
  '擁':'you','絞':'kou','繫':'han','摘':'teki','暴':'bou','露':'ro',
  '票':'hyou','選':'sen','挙':'kyo','候':'kou','補':'ho','落':'raku',
  '誰':'dare','彼':'kare','皆':'kai',
  '押':'ou','捕':'ho','逮':'tai','逃':'tou',
  '貧':'hin','是':'ze',
  '唯':'yui','但':'tan','故':'ko','即':'soku','尚':'shou','且':'katsu',
  '沿':'en','沖':'oki','浦':'ura','岬':'misaki','崎':'saki',
  // ── Government / news (additional) ──
  '監':'kan','使':'shi','視':'shi','臣':'shin','閣':'kaku',
  '首':'shu','相':'sou','幹':'kan','庫':'ko','執':'shitsu',
  '捜':'sou',
  // ── Missing from output samples ──
  '歳':'sai','迫':'haku','魅':'mi','磨':'ma',
  '材':'zai','姿':'shi','超':'chou','志':'shi',
  '願':'gan','立':'ritsu','私':'shi','貫':'kan',
  '育':'iku','付':'fu',
  '吸':'kyuu','招':'shou',
};

function isKanji(ch) {
  const c = ch.charCodeAt(0);
  return (c >= 0x4E00 && c <= 0x9FFF)
      || (c >= 0x3400 && c <= 0x4DBF)
      || (c >= 0xF900 && c <= 0xFAFF);
}

// Table-based romanization (fallback when kuromoji unavailable)
function tableRomanize(text) {
  let result = '';
  let i = 0;
  let capNext = true;
  const cap = s => s ? s[0].toUpperCase() + s.slice(1) : s;
  const hira = katakanaToHiragana(text);

  while (i < hira.length) {
    if (i + 1 < hira.length) {
      const two = hira[i] + hira[i + 1];
      if (COMPOUND_KANA[two] !== undefined) {
        let rom = COMPOUND_KANA[two];
        if (capNext && rom) { rom = cap(rom); capNext = false; }
        result += rom; i += 2; continue;
      }
    }

    const ch = hira[i];

    if (ch === 'っ') {
      if (i + 1 < hira.length) {
        const nRom = COMPOUND_KANA[hira[i+1]+(hira[i+2]||'')] || SINGLE_KANA[hira[i+1]] || '';
        if (nRom && !/^[aeiou]/.test(nRom)) result += nRom[0];
      }
      i++; continue;
    }

    if (SINGLE_KANA[ch] !== undefined) {
      let rom = SINGLE_KANA[ch];
      if (ch === '。' || ch === '！' || ch === '？') { result += rom; capNext = true; i++; continue; }
      if (capNext && /[a-z]/.test(rom)) { rom = cap(rom); capNext = false; }
      result += rom;
    } else if (isKanji(ch)) {
      const reading = KANJI_ROMAJI[ch];
      if (reading) {
        let rom = reading;
        if (capNext) { rom = cap(rom); capNext = false; }
        result += rom;
        if (i + 1 < hira.length && isKanji(hira[i + 1])) result += ' ';
      } else {
        result += ch; // unknown kanji: pass through rather than silently drop
      }
    } else {
      if (/[.!?]/.test(ch)) capNext = true;
      if (capNext && /[a-z]/.test(ch)) { result += ch.toUpperCase(); capNext = false; }
      else result += ch;
    }
    i++;
  }
  return result.replace(/ {2,}/g, ' ').replace(/ ([.,;:!?])/g, '$1').trim();
}

// ============================================================
//  KUROMOJI INTEGRATION (local dict — no CDN dependency)
// ============================================================

let tokenizer = null;         // set when kuromoji is ready
let tokenizerPromise = null;  // single in-flight init

function initKuromoji() {
  if (tokenizer) return Promise.resolve(tokenizer);
  if (tokenizerPromise) return tokenizerPromise;

  tokenizerPromise = new Promise((resolve, reject) => {
    async function doInit() {
      // 1. Try direct global (content script injection succeeded normally)
      let lib = (typeof kuromoji !== 'undefined' && kuromoji)
             || (typeof window !== 'undefined' && window.kuromoji)
             || null;

      // 2. Also try globalThis and self (isolated-world scope variants)
      if (!lib || typeof lib.builder !== 'function') {
        lib = (typeof globalThis !== 'undefined' && globalThis.kuromoji)
           || (typeof self !== 'undefined' && self.kuromoji)
           || null;
      }

      // Diagnostic: log what we found
      console.log('[CAR] kuromoji lib:', typeof lib, lib ? typeof lib.builder : 'n/a',
        '| window.kuromoji:', typeof window?.kuromoji,
        '| globalThis.kuromoji:', typeof globalThis?.kuromoji);

      if (!lib || typeof lib.builder !== 'function') {
        throw new Error('kuromoji library unavailable');
      }

      const dicPath = chrome.runtime.getURL('lib/dict/');
      console.log('[CAR] dicPath:', dicPath);
      return new Promise((res, rej) => {
        lib.builder({ dicPath }).build((err, t) => {
          if (err) { console.error('[CAR] dict build error:', err); rej(err); return; }
          console.log('[CAR] kuromoji ready');
          tokenizer = t;
          res(t);
        });
      });
    }

    doInit().then(resolve).catch(reject);
  });

  return tokenizerPromise;
}

// Japanese punctuation → ASCII equivalents
const JP_PUNCT_MAP = {
  '。':'. ','、':', ','！':'! ','？':'? ',
  '「':'"','」':'"','『':"'",'』':"'",
  '（':'(','）':')','【':'[','】':']',
  '…':'...','・':'-','〜':'-','　':' ',
  '：':': ','；':'; ',
};

// ── Romanize a kuromoji token object ──
// reading is katakana (or undefined/'*' for ASCII/numbers/punctuation).
function tokenReadingToRomaji(token) {
  const { reading, surface_form } = token;
  // Japanese punctuation → ASCII equivalent
  if (JP_PUNCT_MAP[surface_form] !== undefined) return JP_PUNCT_MAP[surface_form];
  // Katakana reading → romaji (include ー U+30FC in test so "ローマ"-style readings match)
  if (reading && reading !== '*' && /[\u30A1-\u30FC]/.test(reading)) {
    return hiraganaToRomaji(katakanaToHiragana(reading));
  }
  // No reading (unknown word) — try surface conversion
  if (!reading || reading === '*') {
    // Pure kana surface → convert directly
    // ・(U+30FB) and ー(U+30FC) are included so "ミラノ・コルティナ"-style tokens work
    if (/^[\u3041-\u3096\u30A1-\u30FC]+$/.test(surface_form)) {
      return hiraganaToRomaji(katakanaToHiragana(surface_form));
    }
    // Kanji surface with no reading → try KANJI_ROMAJI table per character
    if (/[\u4E00-\u9FFF]/.test(surface_form)) {
      let r = '';
      for (const ch of surface_form) {
        if (KANJI_ROMAJI[ch]) r += KANJI_ROMAJI[ch];
        else if (/[\u4E00-\u9FFF]/.test(ch)) r += ch; // unknown kanji: pass through
        else if (!/[\u3040-\u309F\u30A0-\u30FF]/.test(ch)) r += ch; // non-kana ASCII etc.
      }
      return r;
    }
  }
  // Remaining CJK that slipped through: pass through rather than drop
  if (/[\u4E00-\u9FFF\u3040-\u309F\u30A0-\u30FF]/.test(surface_form)) return surface_form;
  // ASCII, numbers, etc. — return as-is
  return surface_form;
}

// Romanize arbitrary Japanese text using kuromoji.
// Called only after tokenizer is ready.
function kuromojiRomanize(text) {
  const tokens = tokenizer.tokenize(text);
  const parts = tokens.map(t => tokenReadingToRomaji(t));

  // Join with spaces between words, skip space before punctuation
  let result = '';
  const PUNCT = /^[。、！？,.!?;:\)\]）】」』…\s]/;

  for (let i = 0; i < parts.length; i++) {
    result += parts[i];
    if (i + 1 < parts.length && !PUNCT.test(parts[i + 1])) {
      // Add inter-word space unless next token is punctuation
      const cur = tokens[i].part_of_speech?.split(',')[0]; // 品詞
      const next = tokens[i + 1].surface_form;
      if (!PUNCT.test(next)) result += ' ';
    }
  }

  return result.replace(/ {2,}/g, ' ').replace(/ ([.,;:!?])/g, '$1').trim();
}

// ── Public romanizeText: uses kuromoji when ready, table-based fallback otherwise ──
function romanizeText(text) {
  if (!text || !text.trim()) return text || '';
  if (tokenizer) return kuromojiRomanize(text);
  // Fallback to kanji-table + kana conversion (always works, even without kuromoji)
  return tableRomanize(text);
}

// ============================================================
//  ACADEMIC TEXT DRESSING
// ============================================================

let connectorCount = 0;

function dressText(romaji) {
  if (!romaji || romaji.length < 12) return romaji;

  connectorCount++;
  if (connectorCount % 7 === 0) {
    const c = CONNECTORS[Math.floor(Math.random() * CONNECTORS.length)];
    // Lowercase the first letter of the original to merge smoothly
    romaji = c + romaji[0].toLowerCase() + romaji.slice(1);
  }

  if (romaji.length > 30 && Math.random() < 0.22) {
    const cit = CITATIONS[Math.floor(Math.random() * CITATIONS.length)];
    const t = romaji.trimEnd();
    const last = t[t.length - 1];
    romaji = '.!?'.includes(last)
      ? t.slice(0, -1) + cit + last + ' '
      : t + cit + '. ';
  }

  // Capitalize first letter of romanized sentence
  if (/^[a-z]/.test(romaji)) romaji = romaji[0].toUpperCase() + romaji.slice(1);

  return romaji;
}

// ============================================================
//  CONTENT EXTRACTION
// ============================================================

function extractContent() {
  const host = location.hostname;
  if (host.includes('x.com') || host.includes('twitter.com')) return extractTwitter();

  const SELECTORS = [
    '[itemprop="articleBody"]', 'article', '[role="article"]',
    'main', '[role="main"]',
    '.article-body','.article__body','.articleBody',
    '.post-body','.post-content','.post__body',
    '.entry-content','.entry__content',
    '.news-body','.news__body','.story-body',
    '.content-body','.content__body',
    '#article-body','#main-content','#content-body',
    '.detail-body','.body-text','.hentry',
  ];

  for (const sel of SELECTORS) {
    const el = document.querySelector(sel);
    if (el && (el.innerText || '').trim().length > 200) {
      return extractFromElement(el);
    }
  }
  return extractByDensity();
}

// Find the primary URL associated with a DOM element (for headings/list items that are links)
function getElementUrl(el) {
  if (el.tagName === 'A' && el.href) return el.href;
  const parent = el.closest('a[href]');
  if (parent) return parent.href;
  const links = el.querySelectorAll('a[href]');
  if (links.length === 1) return links[0].href;
  // Heading with multiple links — pick the one covering most of the text
  if (links.length > 1 && /^H[1-4]$/.test(el.tagName)) {
    const elLen = (el.innerText || '').length;
    let best = null, bestLen = 0;
    links.forEach(a => { const l = (a.innerText || '').length; if (l > bestLen) { bestLen = l; best = a; } });
    if (best && bestLen > elLen * 0.5) return best.href;
  }
  return null;
}

// True if element is navigation/social noise (link text dominates very short content)
function isNavigationNoise(el) {
  // Headings are always structural content — never treat as noise
  if (/^H[1-4]$/.test(el.tagName)) return false;
  const text = (el.innerText || '').trim();
  if (!text) return true;
  const links = el.querySelectorAll('a');
  if (!links.length) return false;
  const linkLen = Array.from(links).reduce((s, a) => s + (a.innerText || '').trim().length, 0);
  // Only filter genuinely short nav items (< 30 chars, almost all link text)
  // e.g. "Home", "もっと見る", "Share on Twitter" — NOT article titles
  return text.length < 30 && linkLen / text.length > 0.85;
}

function extractFromElement(root) {
  const blocks = [{ type: 'title', text: document.title || '', url: null }];
  const seen = new Set();
  const elems = root.querySelectorAll('h1,h2,h3,h4,p,li,blockquote,dt,dd');

  elems.forEach(el => {
    const text = (el.innerText || '').trim();
    if (!text || text.length < 8 || seen.has(text)) return;
    if (isNavigationNoise(el)) return;
    seen.add(text);
    const tag = el.tagName.toLowerCase();
    const url = getElementUrl(el);
    blocks.push({ type: (tag === 'blockquote' || tag === 'dd') ? 'p' : tag, text, url: url || null });
  });

  return blocks;
}

function extractTwitter() {
  const blocks = [{ type: 'title', text: document.title || 'Social Media Discourse Analysis' }];
  const seen = new Set();

  document.querySelectorAll('[data-testid="tweetText"]').forEach(tw => {
    const text = (tw.innerText || '').trim();
    if (!text || seen.has(text)) return;
    seen.add(text);
    blocks.push({ type: 'p', text });
  });

  if (blocks.length <= 1) {
    document.querySelectorAll('span,div').forEach(el => {
      if (el.children.length > 0) return;
      const text = (el.innerText || '').trim();
      if (text.length < 20 || seen.has(text)) return;
      seen.add(text);
      blocks.push({ type: 'p', text });
    });
  }
  return blocks;
}

function extractByDensity() {
  const NOISE = /nav|menu|sidebar|header|footer|banner|ad\b|comment|related|recommend|widget|breadcrumb/i;
  let best = null, bestScore = 0;

  document.querySelectorAll('div,section,main,article').forEach(el => {
    if (NOISE.test((el.className || '') + ' ' + (el.id || ''))) return;
    if ((el.offsetWidth || 0) < 200) return;
    const text = el.innerText || '';
    if (text.length < 300) return;
    const links = el.querySelectorAll('a');
    const linkLen = Array.from(links).reduce((s, a) => s + (a.innerText?.length || 0), 0);
    const score = (text.length - linkLen * 0.3) / Math.max(1, el.querySelectorAll('*').length);
    if (score > bestScore) { bestScore = score; best = el; }
  });

  if (best) return extractFromElement(best);
  return [
    { type: 'title', text: document.title || '' },
    { type: 'p', text: (document.body?.innerText || '').slice(0, 5000) },
  ];
}

// ============================================================
//  OVERLAY BUILDER
// ============================================================

function escHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function escAttr(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
// Wrap inner HTML in <a> if a URL is available
function linkWrap(innerHtml, url) {
  if (!url) return innerHtml;
  return `<a href="${escAttr(url)}" class="cam-ar-link">${innerHtml}</a>`;
}
function randomDOI() {
  const a = () => Math.random().toString(36).slice(2, 8);
  return `10.${Math.floor(Math.random() * 8000) + 1000}/${a()}.2024.${Math.floor(Math.random() * 90000) + 10000}`;
}

function buildOverlayHTML(blocks, style = 'academic') {
  const isNewspaper = style === 'newspaper';
  const titlesList = isNewspaper ? NEWSPAPER_TITLES : JOURNAL_TITLES;
  const journal  = titlesList[Math.floor(Math.random() * titlesList.length)];
  const pageNum  = Math.floor(Math.random() * 80) + 10;
  const topbarSub = isNewspaper
    ? new Date().toLocaleDateString('en-US', { weekday:'long', year:'numeric', month:'long', day:'numeric' })
    : `p.&nbsp;${pageNum}`;
  const doi = randomDOI();
  const source = location.hostname.replace(/^www\./, '');
  const retrieved = new Date().toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' });

  const titleBlock = blocks.find(b => b.type === 'title');
  const bodyBlocks  = blocks.filter(b => b.type !== 'title');
  const titleRom = titleBlock ? (romanizeText(titleBlock.text) || 'Untitled') : 'Untitled';
  const titleCap = titleRom[0]?.toUpperCase() + titleRom.slice(1);

  const abstractBlock = bodyBlocks.find(b => b.type === 'p' && b.text.length > 40);
  const restBlocks    = bodyBlocks.filter(b => b !== abstractBlock);

  connectorCount = 0;

  let sectionIdx = 0;
  let listOpen = false;
  let bodyHTML = '';

  restBlocks.forEach(b => {
    const rom  = dressText(romanizeText(b.text));
    const orig = escAttr(b.text);

    if (listOpen && b.type !== 'li') { bodyHTML += '</ul>'; listOpen = false; }

    switch (b.type) {
      case 'h1': case 'h2':
        sectionIdx++;
        bodyHTML += `<h2 data-orig="${orig}">${linkWrap(escHtml(`${sectionIdx}. `) + escHtml(rom), b.url)}</h2>`;
        break;
      case 'h3': case 'h4':
        bodyHTML += `<h3 data-orig="${orig}">${linkWrap(escHtml(rom), b.url)}</h3>`;
        break;
      case 'li':
        if (!listOpen) { bodyHTML += '<ul>'; listOpen = true; }
        bodyHTML += `<li data-orig="${orig}">${linkWrap(escHtml(rom), b.url)}</li>`;
        break;
      default:
        bodyHTML += `<p data-orig="${orig}">${linkWrap(escHtml(rom), b.url)}</p>`;
    }
  });
  if (listOpen) bodyHTML += '</ul>';

  const abstractRom  = abstractBlock ? dressText(romanizeText(abstractBlock.text)) : '';
  const abstractOrig = abstractBlock ? escAttr(abstractBlock.text) : '';

  return `
<div id="cam-ar-overlay">
  <div id="cam-ar-topbar">
    <span id="cam-ar-journal">${escHtml(journal)}</span>
    <span id="cam-ar-pagenum">${topbarSub}</span>
  </div>
  <div id="cam-ar-scroll">
    <div id="cam-ar-paper">
      <h1 id="cam-ar-title" data-orig="${escAttr(titleBlock?.text || '')}">${escHtml(titleCap)}</h1>
      <div id="cam-ar-byline">
        <strong>Source:</strong> ${escHtml(source)}&ensp;
        <strong>Retrieved:</strong> ${escHtml(retrieved)}&ensp;
        <strong>DOI:</strong> ${escHtml(doi)}
      </div>
      ${abstractRom ? `
      <div id="cam-ar-abstract" data-orig="${abstractOrig}">
        <em>Abstract.</em>&ensp;${escHtml(abstractRom)}
      </div>` : ''}
      <hr id="cam-ar-rule">
      <div id="cam-ar-body">${bodyHTML}</div>
    </div>
  </div>
  <div id="cam-ar-tooltip"></div>
</div>`;
}

function buildLoadingHTML() {
  const journal = JOURNAL_TITLES[Math.floor(Math.random() * JOURNAL_TITLES.length)];
  return `
<div id="cam-ar-overlay">
  <div id="cam-ar-topbar">
    <span id="cam-ar-journal">${escHtml(journal)}</span>
    <span id="cam-ar-pagenum">&#8230;</span>
  </div>
  <div id="cam-ar-loading">
    <div id="cam-ar-loading-spinner">&#9711;</div>
    <div id="cam-ar-loading-text">Initializing morphological analysis engine&hellip;</div>
    <div id="cam-ar-loading-sub">Loading Japanese language dictionary &mdash; first activation only</div>
  </div>
</div>`;
}

// ============================================================
//  OVERLAY DOM
// ============================================================

let overlayEl  = null;
let tooltipEl  = null;

function mountOverlayHTML(html) {
  if (overlayEl) overlayEl.remove();
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  overlayEl = tmp.firstElementChild;
  document.documentElement.appendChild(overlayEl);
  tooltipEl = overlayEl.querySelector('#cam-ar-tooltip') || null;
}

function mountLoadingOverlay() {
  mountOverlayHTML(buildLoadingHTML());
}

function mountOverlay(blocks) {
  mountOverlayHTML(buildOverlayHTML(blocks, currentStyle));

  if (currentStyle === 'newspaper') overlayEl.classList.add('cam-ar-newspaper');

  if (currentShowTooltip) {
    overlayEl.querySelectorAll('[data-orig]').forEach(el => {
      el.addEventListener('mouseenter', onElemHover);
      el.addEventListener('mouseleave', onElemLeave);
    });
  }
}

function unmountOverlay() {
  overlayEl?.remove();
  overlayEl = null;
  tooltipEl = null;
}

// ============================================================
//  TOOLTIP
// ============================================================

function onElemHover(e) {
  const orig = e.currentTarget.dataset.orig;
  if (!orig || !tooltipEl) return;
  tooltipEl.textContent = orig;
  tooltipEl.style.display = 'block';
  positionTooltip(e.clientX, e.clientY);
  e.stopPropagation();
}
function onElemLeave() {
  if (tooltipEl) tooltipEl.style.display = 'none';
}
function positionTooltip(cx, cy) {
  if (!tooltipEl) return;
  const W = window.innerWidth, H = window.innerHeight;
  let l = cx + 14, t = cy + 18;
  if (l + 340 > W) l = cx - 340 - 8;
  if (t + 220 > H) t = cy - 220 - 8;
  tooltipEl.style.left = l + 'px';
  tooltipEl.style.top  = t + 'px';
}

document.addEventListener('mousemove', e => {
  if (tooltipEl?.style.display === 'block') positionTooltip(e.clientX, e.clientY);
}, { passive: true, capture: true });

// ============================================================
//  BOSS KEY
// ============================================================

const BOSS_KEY_URL = 'https://www.google.com/search?q=quarterly+earnings+report';
let escCount = 0, escTimer = null;

function handleEsc() {
  escCount++;
  if (escTimer) clearTimeout(escTimer);
  if (escCount >= 2) { escCount = 0; window.location.replace(BOSS_KEY_URL); return; }
  escTimer = setTimeout(() => { escCount = 0; }, 600);
}

// ============================================================
//  MODE MANAGEMENT (async because of kuromoji init)
// ============================================================

let isAcademicMode    = false;
let currentStyle      = 'academic'; // 'academic' | 'newspaper'
let currentShowTooltip = true;

async function loadSettings() {
  return new Promise(resolve => {
    chrome.storage.local.get(['readerStyle', 'showTooltip'], ({ readerStyle, showTooltip }) => {
      currentStyle       = readerStyle  || 'academic';
      currentShowTooltip = showTooltip  !== false;
      resolve();
    });
  });
}

async function enableAcademicMode() {
  if (isAcademicMode) return;
  isAcademicMode = true;

  // 1. Show loading screen immediately
  mountLoadingOverlay();

  // 2. Initialize kuromoji
  try {
    await initKuromoji();
  } catch (err) {
    console.warn('[CAR] kuromoji failed — romanization will be limited:', err);
  }

  // 3. Load settings, then extract content and render
  await loadSettings();
  const blocks = extractContent();
  mountOverlay(blocks);

  chrome.storage.local.set({ academicMode: true });
}

function disableAcademicMode() {
  if (!isAcademicMode) return;
  isAcademicMode = false;
  unmountOverlay();
  chrome.storage.local.set({ academicMode: false });
}

async function toggleAcademicMode() {
  if (isAcademicMode) disableAcademicMode();
  else await enableAcademicMode();
  return isAcademicMode;
}

// ============================================================
//  EVENT LISTENERS
// ============================================================

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && isAcademicMode) handleEsc();
}, true);

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  switch (msg.action) {
    case 'toggle':
      toggleAcademicMode()
        .then(state => sendResponse({ academicMode: state }))
        .catch(() => sendResponse({ academicMode: isAcademicMode }));
      return true;
    case 'getState':
      sendResponse({ academicMode: isAcademicMode });
      break;
    case 'updateSettings':
      currentStyle       = msg.style       ?? currentStyle;
      currentShowTooltip = msg.showTooltip ?? currentShowTooltip;
      if (isAcademicMode) refreshOverlay();
      sendResponse({ ok: true });
      break;
  }
  return true;
});

// ============================================================
//  SPA NAVIGATION SUPPORT
// ============================================================

// Re-extract content and re-render overlay (called after SPA URL change)
function refreshOverlay() {
  if (!isAcademicMode) return;
  const blocks = extractContent();
  mountOverlay(blocks);
}

// Detect SPA navigation via History API wrapping
(function () {
  const wrap = (orig) => function (...args) {
    const result = orig.apply(this, args);
    window.dispatchEvent(new Event('cam-ar-urlchange'));
    return result;
  };
  history.pushState    = wrap(history.pushState);
  history.replaceState = wrap(history.replaceState);
})();

let _lastHref = location.href;

window.addEventListener('popstate',          () => window.dispatchEvent(new Event('cam-ar-urlchange')));
window.addEventListener('cam-ar-urlchange', () => {
  if (location.href === _lastHref) return;
  _lastHref = location.href;
  if (!isAcademicMode) return;
  // Give SPA framework ~700 ms to update DOM before re-extracting
  setTimeout(refreshOverlay, 700);
});

// ============================================================
//  INIT
// ============================================================

chrome.storage.local.get('academicMode', ({ academicMode }) => {
  if (academicMode) enableAcademicMode();
});
