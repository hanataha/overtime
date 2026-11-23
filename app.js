(function () {
  "use strict";

  var STORAGE_EXTRA = "hanataha-overtime-extra-v1";
  var STORAGE_LANG = "hanataha-overtime-lang";
  var WEEKDAY_JA = ["日", "月", "火", "水", "木", "金", "土"];
  var WEEKDAY_EN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  var MONTH_EN = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  var COPY = {
    ja: {
      title: "残業報告 2026",
      eyebrow: "hanataha · 入善、富山",
      summary: "2026年10月と11月の残業です。計算した時間と、あなたが書いた時間を並べています。",
      totals: "合計",
      days: "日ごとの記録",
      differences: "数字が違う日",
      rules: "ルール",
      proof: "証明",
      add: "日を追加",
      metricGrand: "合計",
      metricOct: "10月",
      metricNov: "11月",
      metricDiff: "違う日",
      daysUnit: "日",
      filterAll: "すべて",
      filterOct: "10月",
      filterNov: "11月",
      viewList: "一覧",
      viewBreak: "内訳",
      colDate: "日付",
      colPlace: "場所",
      colHours: "時間",
      colOt: "残業",
      colBreakdown: "内訳",
      colWritten: "本人",
      colMonth: "月",
      colGap: "差",
      totalRow: "合計",
      assumeLead: "仮定",
      assume: "朝礼の開始は7:40として計算しています。17時以降の休憩はない、と仮定しています。変えたいときは data.js を直すか、教えてください。",
      writtenNone: "本人の記録なし",
      writtenAs: "本人の記録",
      localTag: "追加分",
      edit: "編集",
      remove: "削除",
      confirmRemove: "この追加した日を削除しますか？",
      noDays: "この月にはまだ日がありません。",
      diffIntro: "あなたが数字を書いた日のうち、計算と違う日です。誤りというより、休憩の引き方が日によって違って見えます。",
      d1024: "この日は土曜日なので、7:30から21:00までの13時間30分が対象です。休憩3つ（合計2時間）を引くと、11時間30分です。あなたが書いた12.30は、昼休みの1時間だけを引いた数字（13時間30分 − 1時間）に一致します。10:00と15:00の30分休憩は入っていないように見えます。差は1時間です。",
      d1104: "この日は水曜日です。朝の残業は6:30から7:40で1時間10分、夕方は17:00から18:30で1時間30分です。合計は2時間40分です。あなたが書いたのは3時間で、20分多いです。切り上げたか、朝を1時間30分（6:30から8:00）と数えた可能性があります。",
      d1114: "11月14日（土）は、計算もあなたが書いた9時間も同じです。7:00から18:00の11時間から、休憩3つ（2時間）を引いています。10月24日とは引き方が違って見えます。",
      genericDiff: "計算は{calc}、本人の記録は{written}です。差は{gap}です。",
      matchNote: "一致しています。",
      early: "早出",
      late: "終了後",
      shift: "勤務",
      breaks: "休憩",
      none: "なし",
      weekday: "平日",
      fullDay: "休日の全日",
      charei: "朝礼（7:40）",
      rulesItems: [
        "普通の勤務は月曜から金曜、7:40から17:00です。",
        "休憩は10:00–10:30、12:00–13:00、15:00–15:30です。",
        "平日の残業は、7:40より前と、17:00より後の時間です。",
        "土曜・日曜・祝日は、その日の勤務が全部残業です。ただし、上の休憩が勤務の中にあれば、その分を引きます。",
        "17時以降には休憩はない、と仮定しています。",
        "「朝礼」の開始は、普通の開始と同じ7:40としています。朝の残業はなしです。この仮定は変えられます。",
        "年は2026年です。曜日はカレンダーで確認しました。",
      ],
      proofIntro: "ここからGoogleマップのタイムラインを開くことはできません。Googleはいま、タイムラインをスマホの中に保存しています。下の手順で書き出してください。ファイルか、各日のスクリーンショットがあれば、この報告の各日に付けられます。",
      android: "Android",
      androidSteps: [
        { title: "設定アプリを開く", detail: "Googleマップではなく、フォンの設定です。" },
        { title: "位置情報 → 位置情報サービス → タイムライン", detail: "Location → Location services → Timeline" },
        { title: "「タイムラインデータをエクスポート」をタップ" },
        { title: "続行して、保存する場所を選ぶ", detail: "保存が終わると、「Export complete」と出ます。" },
      ],
      androidFile: "ファイルの名前は、ふつう Timeline.json です。",
      ios: "iPhone",
      iosSteps: [
        { title: "Google マップを開く" },
        { title: "プロフィール写真 → 設定 → 位置情報とプライバシー" },
        { title: "「タイムラインデータをエクスポート」をタップ" },
        { title: "「ファイルに保存」を選び、場所を選んで保存" },
      ],
      iosFile: "ファイルの名前は location-history.json です。別の行き方は、プロフィール → タイムライン → ⋮ → 位置情報とプライバシー設定 → エクスポート、です。",
      shots: "スクリーンショット",
      shotsSteps: [
        { title: "Google マップを開く" },
        { title: "プロフィール写真 → タイムライン" },
        { title: "上の日付をタップし、カレンダーからその日を選ぶ" },
        { title: "スクリーンショットを撮る", detail: "残業の日は、それぞれ撮ってください。" },
      ],
      linkAndroid: "Androidの公式ガイド",
      linkIos: "iPhoneの公式ガイド",
      addIntro: "新しい日を追加できます。この端末にだけ保存されます（localStorage）。公式の6日は data.js にあり、ここからは消えません。",
      date: "日付",
      place: "場所",
      placePh: "木崎湖",
      start: "開始",
      end: "終了",
      chareiBox: "朝礼で開始（7:40）",
      holidayBox: "祝日（平日でも全日を残業にする）",
      written: "本人の時間（任意）",
      writtenPh: "3時間 または 12.30",
      save: "保存する",
      cancel: "キャンセル",
      clear: "クリア",
      saved: "保存しました。この端末に残ります。",
      errDate: "日付を入れてください。",
      errInvalidDate: "その日付はありません。",
      errStart: "開始時刻が読めませんでした。例: 6.30 または 7:40。",
      errEnd: "終了時刻が読めませんでした。例: 20.30 または 18:00。",
      errOrder: "終了時刻は、開始より後にしてください。",
      errPlace: "場所を入れてください。",
      errWritten: "本人の時間が読めませんでした。例: 3時間、3:00、12.30。",
      foot: "公式の記録は data.js にあります。追加した日はこの端末にだけ保存されます。",
    },
    en: {
      title: "Overtime Report 2026",
      eyebrow: "hanataha · Nyūzen, Toyama",
      summary: "Overtime days in October and November 2026, with calculated hours next to the hours you wrote.",
      totals: "Totals",
      days: "Each day",
      differences: "Days that differ",
      rules: "Rules",
      proof: "Proof",
      add: "Add a day",
      metricGrand: "Total",
      metricOct: "October",
      metricNov: "November",
      metricDiff: "Days that differ",
      daysUnit: "days",
      filterAll: "All",
      filterOct: "October",
      filterNov: "November",
      viewList: "List",
      viewBreak: "Breakdown",
      colDate: "Date",
      colPlace: "Place",
      colHours: "Hours",
      colOt: "Overtime",
      colBreakdown: "Breakdown",
      colWritten: "Your figure",
      colMonth: "Month",
      colGap: "Difference",
      totalRow: "Total",
      assumeLead: "Assumptions",
      assume: "Morning assembly is treated as a 7:40 start. No break is assumed after 17:00. Change data.js, or tell me, if you want either of these changed.",
      writtenNone: "No written figure",
      writtenAs: "Your figure",
      localTag: "Added",
      edit: "Edit",
      remove: "Delete",
      confirmRemove: "Delete this added day?",
      noDays: "There are no days in this month yet.",
      diffIntro: "These are the days where your written figure differs from the calculation. This looks like a difference in how breaks were deducted, not simply a typo.",
      d1024: "This day is a Saturday, so the whole shift from 7:30 to 21:00 is overtime: 13 hours 30 minutes. Minus the three break windows (2 hours in total), that is 11 hours 30 minutes. The 12.30 you wrote matches 13 hours 30 minutes minus only the 1-hour lunch. It looks as if the 30-minute breaks at 10:00 and 15:00 were not deducted. The difference is 1 hour.",
      d1104: "This day is a Wednesday. Morning overtime is 6:30 to 7:40 (1 hour 10 minutes). Evening overtime is 17:00 to 18:30 (1 hour 30 minutes). The total is 2 hours 40 minutes. You wrote 3 hours, which is 20 minutes more. You may have rounded up, or counted the morning as 1 hour 30 minutes (6:30 to 8:00).",
      d1114: "14 November (Saturday) matches: both the calculation and your figure are 9 hours. That is 11 hours from 7:00 to 18:00, minus all three breaks (2 hours). The way breaks were deducted looks different from 24 October.",
      genericDiff: "Calculated {calc}; your figure {written}. The difference is {gap}.",
      matchNote: "These figures match.",
      early: "Early",
      late: "Late",
      shift: "Shift",
      breaks: "Breaks",
      none: "None",
      weekday: "Weekday",
      fullDay: "Full-day overtime",
      charei: "Assembly (7:40)",
      rulesItems: [
        "Ordinary work is Monday to Friday, 7:40 to 17:00.",
        "Breaks are 10:00–10:30, 12:00–13:00, and 15:00–15:30.",
        "On a weekday, overtime is any time before 7:40 and any time after 17:00.",
        "On Saturday, Sunday, and public holidays, the whole shift is overtime, minus any of those break windows that fall inside it.",
        "No break is assumed after 17:00.",
        "If the start is morning assembly (朝礼), it is treated as the ordinary 7:40 start, so there is no early overtime. This assumption can be changed.",
        "The year is 2026. Weekdays were checked against the calendar.",
      ],
      proofIntro: "Google Maps Timeline cannot be opened from this page. Google now stores Timeline on the phone. Export it with the steps below. If you have the file or screenshots of each day, they can be attached to the days in this report.",
      android: "Android",
      androidSteps: [
        { title: "Open the Settings app", detail: "This is the phone Settings app, not Google Maps." },
        { title: "Location → Location services → Timeline" },
        { title: "Tap Export Timeline data" },
        { title: "Tap Continue, choose a folder, and Save", detail: "When it finishes, the phone shows “Export complete.”" },
      ],
      androidFile: "The file is usually named Timeline.json.",
      ios: "iPhone",
      iosSteps: [
        { title: "Open the Google Maps app" },
        { title: "Tap your profile picture → Settings → Location & Privacy" },
        { title: "Tap Export Timeline data" },
        { title: "Tap Save to Files, choose a folder, and Save" },
      ],
      iosFile: "The file is saved as location-history.json. Another path is: profile → Your Timeline → ⋮ → Location & privacy settings → Export Timeline data.",
      shots: "Screenshots",
      shotsSteps: [
        { title: "Open the Google Maps app" },
        { title: "Tap your profile picture → Your Timeline" },
        { title: "Tap the date at the top, then pick the day on the calendar" },
        { title: "Take a screenshot", detail: "Please take one for each overtime day." },
      ],
      linkAndroid: "Official Android guide",
      linkIos: "Official iPhone guide",
      addIntro: "You can add a new day here. It is saved only on this device (localStorage). The official six days live in data.js and cannot be deleted from this form.",
      date: "Date",
      place: "Place",
      placePh: "Kizakiko",
      start: "Start",
      end: "End",
      chareiBox: "Started at morning assembly (7:40)",
      holidayBox: "Public holiday (count the whole shift as overtime)",
      written: "Your figure (optional)",
      writtenPh: "3 hours or 12.30",
      save: "Save",
      cancel: "Cancel",
      clear: "Clear",
      saved: "Saved on this device.",
      errDate: "Please enter a date.",
      errInvalidDate: "That date does not exist.",
      errStart: "The start time could not be read. Example: 6.30 or 7:40.",
      errEnd: "The end time could not be read. Example: 20.30 or 18:00.",
      errOrder: "The end time needs to be after the start time.",
      errPlace: "Please enter a place.",
      errWritten: "The written figure could not be read. Example: 3 hours, 3:00, or 12.30.",
      foot: "Official records are in data.js. Days you add are saved only on this device.",
    },
  };

  var state = {
    lang: "ja",
    month: "all",
    view: "list",
    editingId: null,
    flash: "",
  };

  function $(id) {
    return document.getElementById(id);
  }

  function pad(n) {
    return n < 10 ? "0" + n : String(n);
  }

  function parseClock(raw) {
    if (raw == null) return null;
    var t = String(raw).trim().replace(/時/g, ":").replace(/分/g, "");
    var m = t.match(/^(\d{1,2})(?:[.:](\d{1,2}))?$/);
    if (!m) return null;
    var h = Number(m[1]);
    var min = m[2] != null ? Number(m[2]) : 0;
    if (h < 0 || h > 23 || min < 0 || min > 59) return null;
    return h * 60 + min;
  }

  function parseWritten(raw) {
    if (raw == null) return { ok: true, minutes: null, label: null };
    var t = String(raw).trim();
    if (!t) return { ok: true, minutes: null, label: null };
    var hoursWord = t.match(/^(\d+(?:[.:]\d+)?)\s*(時間|hours?|hrs?|h)?$/i);
    if (hoursWord) {
      var num = hoursWord[1];
      var hm = num.match(/^(\d+)[.:](\d{1,2})$/);
      if (hm) {
        var hh = Number(hm[1]);
        var mm = Number(hm[2]);
        if (mm > 59) return { ok: false };
        return { ok: true, minutes: hh * 60 + mm, label: t };
      }
      return { ok: true, minutes: Math.round(Number(num) * 60), label: t };
    }
    return { ok: false };
  }

  function toClock(min) {
    return Math.floor(min / 60) + ":" + pad(min % 60);
  }

  function fmtHM(min, lang) {
    var sign = min < 0 ? "−" : "";
    var abs = Math.abs(min);
    var h = Math.floor(abs / 60);
    var m = abs % 60;
    if (lang === "ja") {
      if (h === 0) return sign + m + "分";
      if (m === 0) return sign + h + "時間";
      return sign + h + "時間" + m + "分";
    }
    if (h === 0) return sign + m + " min";
    if (m === 0) return sign + h + " h";
    return sign + h + " h " + m + " min";
  }

  function parseISODate(iso) {
    var m = String(iso).match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!m) return null;
    var y = Number(m[1]);
    var mo = Number(m[2]);
    var d = Number(m[3]);
    var dt = new Date(y, mo - 1, d);
    if (dt.getFullYear() !== y || dt.getMonth() !== mo - 1 || dt.getDate() !== d) return null;
    return { year: y, month: mo, day: d, weekday: dt.getDay() };
  }

  function dateLabel(info, lang) {
    if (lang === "ja") {
      return info.year + "/" + pad(info.month) + "/" + pad(info.day) + " " + WEEKDAY_JA[info.weekday];
    }
    return WEEKDAY_EN[info.weekday] + ", " + info.day + " " + MONTH_EN[info.month - 1] + " " + info.year;
  }

  function rulesMinutes(data) {
    return {
      normalStart: parseClock(data.normalStart),
      normalEnd: parseClock(data.normalEnd),
      breaks: data.breaks.map(function (b) {
        return { start: parseClock(b.start), end: parseClock(b.end) };
      }),
    };
  }

  function overlap(a0, a1, b0, b1) {
    return Math.max(0, Math.min(a1, b1) - Math.max(a0, b0));
  }

  function breaksInside(start, end, breaks) {
    var sum = 0;
    for (var i = 0; i < breaks.length; i++) {
      sum += overlap(start, end, breaks[i].start, breaks[i].end);
    }
    return sum;
  }

  function computeOt(startMin, endMin, fullDay, rules) {
    var shiftMin = endMin - startMin;
    if (fullDay) {
      var breakMin = breaksInside(startMin, endMin, rules.breaks);
      return {
        earlyMin: 0,
        lateMin: 0,
        shiftMin: shiftMin,
        breakMin: breakMin,
        otMin: shiftMin - breakMin,
      };
    }
    var earlyRaw = Math.max(0, Math.min(endMin, rules.normalStart) - startMin);
    var lateRaw = Math.max(0, endMin - Math.max(startMin, rules.normalEnd));
    var earlyBreak = breaksInside(startMin, Math.min(endMin, rules.normalStart), rules.breaks);
    var lateBreak = breaksInside(Math.max(startMin, rules.normalEnd), endMin, rules.breaks);
    return {
      earlyMin: earlyRaw - earlyBreak,
      lateMin: lateRaw - lateBreak,
      shiftMin: shiftMin,
      breakMin: earlyBreak + lateBreak,
      otMin: earlyRaw - earlyBreak + lateRaw - lateBreak,
    };
  }

  function loadExtra() {
    try {
      var raw = localStorage.getItem(STORAGE_EXTRA);
      if (!raw) return [];
      var parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  function saveExtra(list) {
    localStorage.setItem(STORAGE_EXTRA, JSON.stringify(list));
  }

  function enrich(entry, rules, local) {
    var info = parseISODate(entry.date);
    var charei = entry.start === "charei";
    var startMin = charei ? rules.normalStart : parseClock(entry.start);
    var endMin = parseClock(entry.end);
    var weekend = info && (info.weekday === 0 || info.weekday === 6);
    var fullDay = !!(entry.holiday || weekend);
    var ot = computeOt(startMin, endMin, fullDay, rules);
    var written = entry.writtenMinutes;
    return Object.assign({}, entry, info, ot, {
      charei: charei,
      startMin: startMin,
      endMin: endMin,
      weekend: weekend,
      fullDay: fullDay,
      local: !!local,
      differs: written != null && written !== ot.otMin,
    });
  }

  function allEntries(rules) {
    var base = (window.OVERTIME_DATA.entries || []).map(function (e) {
      return enrich(e, rules, false);
    });
    var extra = loadExtra().map(function (e) {
      return enrich(e, rules, true);
    });
    return base.concat(extra).sort(function (a, b) {
      return a.date < b.date ? -1 : a.date > b.date ? 1 : 0;
    });
  }

  function breakdownLabel(row, t, lang) {
    if (row.fullDay) {
      var shift = fmtHM(row.shiftMin, lang);
      if (row.breakMin === 0) return t.shift + " " + shift + "、" + t.breaks + t.none;
      return t.shift + " " + shift + "、" + t.breaks + " −" + fmtHM(row.breakMin, lang);
    }
    var early = row.earlyMin === 0 ? t.early + " " + t.none : t.early + " " + fmtHM(row.earlyMin, lang);
    var late = row.lateMin === 0 ? t.late + " " + t.none : t.late + " " + fmtHM(row.lateMin, lang);
    return early + "、" + late;
  }

  function timeLabel(row, t) {
    var end = toClock(row.endMin);
    if (row.charei) return t.charei + "–" + end;
    return toClock(row.startMin) + "–" + end;
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function stepsHtml(steps) {
    return (
      '<ol class="steps">' +
      steps
        .map(function (s) {
          return (
            "<li><span class=\"stitle\">" +
            escapeHtml(s.title) +
            "</span>" +
            (s.detail ? '<span class="sdetail">' + escapeHtml(s.detail) + "</span>" : "") +
            "</li>"
          );
        })
        .join("") +
      "</ol>"
    );
  }

  function helpHl(lang) {
    return lang === "ja" ? "ja" : "en";
  }

  function render() {
    var lang = state.lang;
    var t = COPY[lang];
    var data = window.OVERTIME_DATA;
    var rules = rulesMinutes(data);
    var rows = allEntries(rules);
    var visible = rows.filter(function (r) {
      if (state.month === "all") return true;
      return String(r.month) === state.month;
    });

    document.documentElement.lang = lang;
    document.title = t.title;
    $("eyebrow").textContent = t.eyebrow;
    $("page-title").textContent = t.title;
    $("page-summary").textContent = t.summary;
    $("lang-ja").setAttribute("aria-pressed", lang === "ja" ? "true" : "false");
    $("lang-en").setAttribute("aria-pressed", lang === "en" ? "true" : "false");

    var oct = rows.filter(function (r) { return r.month === 10; });
    var nov = rows.filter(function (r) { return r.month === 11; });
    var otherMonths = {};
    rows.forEach(function (r) {
      if (r.month !== 10 && r.month !== 11) {
        otherMonths[r.month] = (otherMonths[r.month] || 0) + r.otMin;
      }
    });
    var grand = rows.reduce(function (s, r) { return s + r.otMin; }, 0);
    var octTot = oct.reduce(function (s, r) { return s + r.otMin; }, 0);
    var novTot = nov.reduce(function (s, r) { return s + r.otMin; }, 0);
    var diffCount = rows.filter(function (r) { return r.differs; }).length;

    function metric(value, label, detail) {
      return (
        '<div class="card metric"><span class="value">' +
        escapeHtml(value) +
        '</span><span class="label">' +
        escapeHtml(label) +
        '</span><span class="detail">' +
        escapeHtml(detail) +
        "</span></div>"
      );
    }

    var maxOt = rows.reduce(function (m, r) { return Math.max(m, r.otMin); }, 1);
    var bars = rows
      .map(function (r) {
        var w = Math.max(4, Math.round((r.otMin / maxOt) * 100));
        return (
          '<div class="bar-row' +
          (r.differs ? " diff" : "") +
          '"><span>' +
          r.month +
          "/" +
          r.day +
          '</span><div class="bar-track"><div class="bar-fill" style="width:' +
          w +
          '%"></div></div><span class="amt">' +
          escapeHtml(fmtHM(r.otMin, lang)) +
          "</span></div>"
        );
      })
      .join("");

    $("totals").innerHTML =
      "<h2>" +
      escapeHtml(t.totals) +
      '</h2><div class="metrics">' +
      metric(fmtHM(grand, lang), t.metricGrand, rows.length + " " + t.daysUnit) +
      metric(fmtHM(octTot, lang), t.metricOct, oct.length + " " + t.daysUnit) +
      metric(fmtHM(novTot, lang), t.metricNov, nov.length + " " + t.daysUnit) +
      metric(String(diffCount), t.metricDiff, "") +
      '</div><div class="card bars">' +
      bars +
      "</div>";

    var monthBtns =
      '<button type="button" class="chip" data-month="all" aria-pressed="' +
      (state.month === "all") +
      '">' +
      escapeHtml(t.filterAll) +
      " · " +
      rows.length +
      "</button>" +
      '<button type="button" class="chip" data-month="10" aria-pressed="' +
      (state.month === "10") +
      '">' +
      escapeHtml(t.filterOct) +
      " · " +
      oct.length +
      "</button>" +
      '<button type="button" class="chip" data-month="11" aria-pressed="' +
      (state.month === "11") +
      '">' +
      escapeHtml(t.filterNov) +
      " · " +
      nov.length +
      "</button>";

    var viewBtns =
      '<button type="button" class="chip" data-view="list" aria-pressed="' +
      (state.view === "list") +
      '">' +
      escapeHtml(t.viewList) +
      "</button>" +
      '<button type="button" class="chip" data-view="breakdown" aria-pressed="' +
      (state.view === "breakdown") +
      '">' +
      escapeHtml(t.viewBreak) +
      "</button>";

    var dayCards;
    if (!visible.length) {
      dayCards = '<p class="empty-note">' + escapeHtml(t.noDays) + "</p>";
    } else if (state.view === "list") {
      dayCards = visible
        .map(function (r) {
          return dayCard(r, t, lang, false);
        })
        .join("");
    } else {
      dayCards = visible
        .map(function (r) {
          return dayCard(r, t, lang, true);
        })
        .join("");
    }

    var monthLines = [];
    if (state.month === "all" || state.month === "10") {
      monthLines.push([t.filterOct, oct.length + " " + t.daysUnit, fmtHM(octTot, lang)]);
    }
    if (state.month === "all" || state.month === "11") {
      monthLines.push([t.filterNov, nov.length + " " + t.daysUnit, fmtHM(novTot, lang)]);
    }
    if (state.month === "all") {
      Object.keys(otherMonths)
        .sort(function (a, b) { return Number(a) - Number(b); })
        .forEach(function (mo) {
          var count = rows.filter(function (r) { return String(r.month) === String(mo); }).length;
          var name = lang === "ja" ? mo + "月" : MONTH_EN[Number(mo) - 1];
          monthLines.push([name, count + " " + t.daysUnit, fmtHM(otherMonths[mo], lang)]);
        });
    } else if (state.month !== "10" && state.month !== "11") {
      var mrows = visible;
      var mtot = mrows.reduce(function (s, r) { return s + r.otMin; }, 0);
      var mname = lang === "ja" ? state.month + "月" : MONTH_EN[Number(state.month) - 1];
      monthLines.push([mname, mrows.length + " " + t.daysUnit, fmtHM(mtot, lang)]);
    }
    var visTot = visible.reduce(function (s, r) { return s + r.otMin; }, 0);
    monthLines.push([t.totalRow, visible.length + " " + t.daysUnit, fmtHM(visTot, lang)]);

    var totalDl =
      '<div class="card month-total"><dl>' +
      monthLines
        .map(function (line, i) {
          var last = i === monthLines.length - 1;
          return (
            "<dt" +
            (last ? ' class="grand"' : "") +
            ">" +
            escapeHtml(line[0]) +
            " · " +
            escapeHtml(line[1]) +
            "</dt><dd" +
            (last ? ' class="grand"' : "") +
            ">" +
            escapeHtml(line[2]) +
            "</dd>"
          );
        })
        .join("") +
      "</dl></div>";

    $("days").innerHTML =
      "<h2>" +
      escapeHtml(t.days) +
      '</h2><div class="toolbar">' +
      monthBtns +
      "</div><div class=\"toolbar\">" +
      viewBtns +
      "</div>" +
      dayCards +
      totalDl;

    var diffs = rows.filter(function (r) { return r.differs; });
    var matchOfficial = rows.filter(function (r) {
      return !r.local && r.id === "2026-11-14";
    })[0];
    var officialExpl = {
      "2026-10-24": t.d1024,
      "2026-11-04": t.d1104,
    };

    var diffBody = '<p>' + escapeHtml(t.diffIntro) + "</p>";
    if (diffs.length) {
      diffBody +=
        '<div class="table-wrap"><table><thead><tr><th>' +
        escapeHtml(t.colDate) +
        "</th><th class=\"num\">" +
        escapeHtml(t.colOt) +
        "</th><th class=\"num\">" +
        escapeHtml(t.colWritten) +
        "</th><th class=\"num\">" +
        escapeHtml(t.colGap) +
        "</th></tr></thead><tbody>" +
        diffs
          .map(function (r) {
            var info = { year: r.year, month: r.month, day: r.day, weekday: r.weekday };
            return (
              "<tr><td>" +
              escapeHtml(dateLabel(info, lang)) +
              '</td><td class="num">' +
              escapeHtml(fmtHM(r.otMin, lang)) +
              '</td><td class="num warn">' +
              escapeHtml(r.writtenLabel || fmtHM(r.writtenMinutes, lang)) +
              '</td><td class="num">' +
              escapeHtml(fmtHM(Math.abs(r.writtenMinutes - r.otMin), lang)) +
              "</td></tr>"
            );
          })
          .join("") +
        "</tbody></table></div>";
      diffs.forEach(function (r) {
        var info = { year: r.year, month: r.month, day: r.day, weekday: r.weekday };
        var text = officialExpl[r.id];
        if (!text) {
          text = t.genericDiff
            .replace("{calc}", fmtHM(r.otMin, lang))
            .replace("{written}", r.writtenLabel || fmtHM(r.writtenMinutes, lang))
            .replace("{gap}", fmtHM(Math.abs(r.writtenMinutes - r.otMin), lang));
        }
        diffBody +=
          '<article class="card diff-card"><h3>' +
          escapeHtml(dateLabel(info, lang)) +
          "</h3><p>" +
          escapeHtml(text) +
          "</p></article>";
      });
    }
    if (matchOfficial && !matchOfficial.differs) {
      diffBody +=
        '<article class="card diff-card"><h3>' +
        escapeHtml(dateLabel(matchOfficial, lang)) +
        "</h3><p>" +
        escapeHtml(t.d1114) +
        "</p></article>";
    }

    $("differences").innerHTML = "<h2>" + escapeHtml(t.differences) + "</h2>" + diffBody;

    $("rules").innerHTML =
      "<h2>" +
      escapeHtml(t.rules) +
      '</h2><div class="callout"><strong>' +
      escapeHtml(t.assumeLead) +
      "</strong>" +
      escapeHtml(t.assume) +
      "</div><ul>" +
      t.rulesItems
        .map(function (item) {
          return "<li>" + escapeHtml(item) + "</li>";
        })
        .join("") +
      "</ul>";

    var hl = helpHl(lang);
    $("proof").innerHTML =
      "<h2>" +
      escapeHtml(t.proof) +
      "</h2><p>" +
      escapeHtml(t.proofIntro) +
      "</p><h3>" +
      escapeHtml(t.android) +
      "</h3>" +
      stepsHtml(t.androidSteps) +
      "<p>" +
      escapeHtml(t.androidFile) +
      "</p><h3>" +
      escapeHtml(t.ios) +
      "</h3>" +
      stepsHtml(t.iosSteps) +
      "<p>" +
      escapeHtml(t.iosFile) +
      "</p><h3>" +
      escapeHtml(t.shots) +
      "</h3>" +
      stepsHtml(t.shotsSteps) +
      '<div class="links"><a href="https://support.google.com/maps/answer/6258979?co=GENIE.Platform%3DAndroid&hl=' +
      hl +
      '" target="_blank" rel="noopener">' +
      escapeHtml(t.linkAndroid) +
      '</a><a href="https://support.google.com/maps/answer/6258979?co=GENIE.Platform%3DiOS&hl=' +
      hl +
      '" target="_blank" rel="noopener">' +
      escapeHtml(t.linkIos) +
      "</a></div>";

    $("add").innerHTML = addFormHtml(t);
    $("foot").textContent = t.foot;
    bindDynamic();
  }

  function dayCard(r, t, lang, showBreak) {
    var info = { year: r.year, month: r.month, day: r.day, weekday: r.weekday };
    var written = "";
    if (showBreak || r.writtenMinutes != null) {
      if (r.writtenMinutes == null) {
        written = '<p class="day-meta">' + escapeHtml(t.writtenNone) + "</p>";
      } else {
        written =
          '<p class="day-meta' +
          (r.differs ? " day-written warn" : "") +
          '">' +
          escapeHtml(t.writtenAs) +
          " " +
          escapeHtml(r.writtenLabel || fmtHM(r.writtenMinutes, lang)) +
          "</p>";
      }
    }
    var actions = "";
    if (r.local) {
      actions =
        '<div class="day-actions"><button type="button" class="btn" data-edit="' +
        escapeHtml(r.id) +
        '">' +
        escapeHtml(t.edit) +
        '</button><button type="button" class="btn danger" data-del="' +
        escapeHtml(r.id) +
        '">' +
        escapeHtml(t.remove) +
        "</button></div>";
    }
    return (
      '<article class="card day' +
      (r.differs ? " diff" : "") +
      '"><div class="day-top"><div><div class="day-date">' +
      escapeHtml(dateLabel(info, lang)) +
      (r.local ? '<span class="local-tag">' + escapeHtml(t.localTag) + "</span>" : "") +
      '</div><div class="day-place">' +
      escapeHtml(r.place) +
      "</div></div><div class=\"day-ot\">" +
      escapeHtml(fmtHM(r.otMin, lang)) +
      "</div></div><p class=\"day-meta\">" +
      escapeHtml(timeLabel(r, t)) +
      " · " +
      escapeHtml(r.fullDay ? t.fullDay : t.weekday) +
      "</p>" +
      (showBreak ? '<p class="day-break">' + escapeHtml(breakdownLabel(r, t, lang)) + "</p>" : "") +
      written +
      actions +
      "</article>"
    );
  }

  function addFormHtml(t) {
    var editing = null;
    if (state.editingId) {
      editing = loadExtra().filter(function (e) { return e.id === state.editingId; })[0] || null;
    }
    var dateVal = editing ? editing.date : "";
    var placeVal = editing ? editing.place : "";
    var charei = editing ? editing.start === "charei" : false;
    var startVal = editing && editing.start !== "charei" ? editing.start : "";
    var endVal = editing ? editing.end : "";
    var holiday = editing ? !!editing.holiday : false;
    var writtenVal = editing && editing.writtenLabel ? editing.writtenLabel : "";
    var flash = state.flash ? '<p class="note">' + escapeHtml(state.flash) + "</p>" : "";
    return (
      "<h2>" +
      escapeHtml(t.add) +
      "</h2><p>" +
      escapeHtml(t.addIntro) +
      '</p><form class="card form" id="add-form" action="#">' +
      flash +
      '<div class="form-grid"><div><label for="f-date">' +
      escapeHtml(t.date) +
      '</label><input id="f-date" name="date" type="date" value="' +
      escapeHtml(dateVal) +
      '" required></div><div><label for="f-place">' +
      escapeHtml(t.place) +
      '</label><input id="f-place" name="place" type="text" value="' +
      escapeHtml(placeVal) +
      '" placeholder="' +
      escapeHtml(t.placePh) +
      '" autocomplete="off"></div></div>' +
      '<label class="check"><input id="f-charei" type="checkbox"' +
      (charei ? " checked" : "") +
      "> " +
      escapeHtml(t.chareiBox) +
      "</label>" +
      '<div class="form-grid two"><div><label for="f-start">' +
      escapeHtml(t.start) +
      '</label><input id="f-start" name="start" type="text" inputmode="decimal" value="' +
      escapeHtml(startVal) +
      '" placeholder="6.30" ' +
      (charei ? "disabled" : "") +
      '></div><div><label for="f-end">' +
      escapeHtml(t.end) +
      '</label><input id="f-end" name="end" type="text" inputmode="decimal" value="' +
      escapeHtml(endVal) +
      '" placeholder="20.30"></div></div>' +
      '<label class="check"><input id="f-holiday" type="checkbox"' +
      (holiday ? " checked" : "") +
      "> " +
      escapeHtml(t.holidayBox) +
      "</label>" +
      "<div><label for=\"f-written\">" +
      escapeHtml(t.written) +
      '</label><input id="f-written" name="written" type="text" value="' +
      escapeHtml(writtenVal) +
      '" placeholder="' +
      escapeHtml(t.writtenPh) +
      '"></div>' +
      '<p class="error" id="f-error" hidden></p>' +
      '<div class="form-actions"><button type="submit" class="btn primary">' +
      escapeHtml(t.save) +
      '</button><button type="button" class="btn" id="f-clear">' +
      escapeHtml(editing ? t.cancel : t.clear) +
      "</button></div></form>"
    );
  }

  function bindDynamic() {
    document.querySelectorAll("[data-month]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        state.month = btn.getAttribute("data-month");
        render();
      });
    });
    document.querySelectorAll("[data-view]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        state.view = btn.getAttribute("data-view");
        render();
      });
    });
    document.querySelectorAll("[data-edit]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        state.editingId = btn.getAttribute("data-edit");
        state.flash = "";
        render();
        $("add").scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
    document.querySelectorAll("[data-del]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (!window.confirm(COPY[state.lang].confirmRemove)) return;
        var id = btn.getAttribute("data-del");
        saveExtra(
          loadExtra().filter(function (e) {
            return e.id !== id;
          })
        );
        if (state.editingId === id) state.editingId = null;
        state.flash = "";
        render();
      });
    });
    var charei = $("f-charei");
    var start = $("f-start");
    if (charei && start) {
      charei.addEventListener("change", function () {
        start.disabled = charei.checked;
      });
    }
    var form = $("add-form");
    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        saveFromForm();
      });
    }
    var clear = $("f-clear");
    if (clear) {
      clear.addEventListener("click", function () {
        state.editingId = null;
        state.flash = "";
        render();
      });
    }
  }

  function saveFromForm() {
    var t = COPY[state.lang];
    var err = $("f-error");
    function fail(msg) {
      err.hidden = false;
      err.textContent = msg;
    }
    var date = $("f-date").value;
    var info = parseISODate(date);
    if (!date) return fail(t.errDate);
    if (!info) return fail(t.errInvalidDate);
    var place = $("f-place").value.trim();
    if (!place) return fail(t.errPlace);
    var isCharei = $("f-charei").checked;
    var startMin = isCharei ? parseClock(window.OVERTIME_DATA.normalStart) : parseClock($("f-start").value);
    if (startMin == null) return fail(t.errStart);
    var endMin = parseClock($("f-end").value);
    if (endMin == null) return fail(t.errEnd);
    if (endMin <= startMin) return fail(t.errOrder);
    var writtenRaw = $("f-written").value;
    var written = parseWritten(writtenRaw);
    if (!written.ok) return fail(t.errWritten);

    var entry = {
      id: state.editingId || "local-" + Date.now(),
      date: date,
      place: place,
      start: isCharei ? "charei" : pad(Math.floor(startMin / 60)) + ":" + pad(startMin % 60),
      end: pad(Math.floor(endMin / 60)) + ":" + pad(endMin % 60),
      holiday: $("f-holiday").checked,
      writtenMinutes: written.minutes,
      writtenLabel: written.minutes == null ? null : written.label,
    };

    var list = loadExtra();
    if (state.editingId) {
      list = list.map(function (e) {
        return e.id === state.editingId ? entry : e;
      });
    } else {
      list.push(entry);
    }
    saveExtra(list);
    state.editingId = null;
    state.flash = t.saved;
    state.month = "all";
    render();
    $("add").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function selfCheck() {
    var rules = rulesMinutes(window.OVERTIME_DATA);
    var expected = {
      "2026-10-23": 3 * 60 + 30,
      "2026-10-24": 11 * 60 + 30,
      "2026-10-30": 4 * 60 + 40,
      "2026-11-04": 2 * 60 + 40,
      "2026-11-12": 60,
      "2026-11-14": 9 * 60,
    };
    (window.OVERTIME_DATA.entries || []).forEach(function (e) {
      var row = enrich(e, rules, false);
      if (expected[e.id] != null && row.otMin !== expected[e.id]) {
        console.error("Overtime mismatch", e.id, row.otMin, "expected", expected[e.id]);
      }
    });
  }

  document.querySelectorAll(".lang button").forEach(function (btn) {
    btn.addEventListener("click", function () {
      state.lang = btn.getAttribute("data-lang");
      try {
        localStorage.setItem(STORAGE_LANG, state.lang);
      } catch (e) {}
      render();
    });
  });

  try {
    var params = new URLSearchParams(window.location.search);
    var qLang = params.get("lang");
    if (qLang === "ja" || qLang === "en") {
      state.lang = qLang;
    } else {
      var savedLang = localStorage.getItem(STORAGE_LANG);
      if (savedLang === "ja" || savedLang === "en") state.lang = savedLang;
    }
  } catch (e) {}

  selfCheck();
  render();
})();
