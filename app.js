(function () {
  "use strict";

  var STORAGE_LANG = "hanataha-overtime-lang";
  var WEEKDAY_JA = ["日", "月", "火", "水", "木", "金", "土"];
  var WEEKDAY_EN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  var MONTH_EN = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  var COPY = {
    ja: {
      title: "残業報告 2026",
      eyebrow: "ハリ · 入善、富山",
      summary: "2026年10月と11月の残業です。各日の計算した残業時間を載せています。",
      totals: "合計",
      days: "日ごとの記録",
      metricGrand: "合計",
      metricOct: "10月",
      metricNov: "11月",
      daysUnit: "日",
      filterAll: "すべて",
      filterOct: "10月",
      filterNov: "11月",
      viewList: "一覧",
      viewBreak: "内訳",
      totalRow: "合計",
      early: "早出",
      late: "終了後",
      shift: "勤務",
      breaks: "休憩",
      none: "なし",
      weekday: "平日",
      fullDay: "休日の全日",
      charei: "朝礼（7:40）",
      foot: "公式の記録は data.js にあります。",
    },
    en: {
      title: "Overtime Report 2026",
      eyebrow: "ハリ · Nyūzen, Toyama",
      summary: "Overtime days in October and November 2026, with the calculated hours for each day.",
      totals: "Totals",
      days: "Each day",
      metricGrand: "Total",
      metricOct: "October",
      metricNov: "November",
      daysUnit: "days",
      filterAll: "All",
      filterOct: "October",
      filterNov: "November",
      viewList: "List",
      viewBreak: "Breakdown",
      totalRow: "Total",
      early: "Early",
      late: "Late",
      shift: "Shift",
      breaks: "Breaks",
      none: "None",
      weekday: "Weekday",
      fullDay: "Full-day overtime",
      charei: "Assembly (7:40)",
      foot: "Official records are in data.js.",
    },
  };

  var state = {
    lang: "ja",
    month: "all",
    view: "list",
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

  function enrich(entry, rules) {
    var info = parseISODate(entry.date);
    var charei = entry.start === "charei";
    var startMin = charei ? rules.normalStart : parseClock(entry.start);
    var endMin = parseClock(entry.end);
    var weekend = info && (info.weekday === 0 || info.weekday === 6);
    var fullDay = !!(entry.holiday || weekend);
    var ot = computeOt(startMin, endMin, fullDay, rules);
    return Object.assign({}, entry, info, ot, {
      charei: charei,
      startMin: startMin,
      endMin: endMin,
      weekend: weekend,
      fullDay: fullDay,
    });
  }

  function allEntries(rules) {
    return (window.OVERTIME_DATA.entries || []).map(function (e) {
      return enrich(e, rules);
    }).sort(function (a, b) {
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
    var grand = rows.reduce(function (s, r) { return s + r.otMin; }, 0);
    var octTot = oct.reduce(function (s, r) { return s + r.otMin; }, 0);
    var novTot = nov.reduce(function (s, r) { return s + r.otMin; }, 0);

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
          '<div class="bar-row"><span>' +
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
      '</h2><div class="metrics metrics-3">' +
      metric(fmtHM(grand, lang), t.metricGrand, rows.length + " " + t.daysUnit) +
      metric(fmtHM(octTot, lang), t.metricOct, oct.length + " " + t.daysUnit) +
      metric(fmtHM(novTot, lang), t.metricNov, nov.length + " " + t.daysUnit) +
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

    var showBreak = state.view === "breakdown";
    var dayCards = visible
      .map(function (r) {
        return dayCard(r, t, lang, showBreak);
      })
      .join("");

    var monthLines = [];
    if (state.month === "all" || state.month === "10") {
      monthLines.push([t.filterOct, oct.length + " " + t.daysUnit, fmtHM(octTot, lang)]);
    }
    if (state.month === "all" || state.month === "11") {
      monthLines.push([t.filterNov, nov.length + " " + t.daysUnit, fmtHM(novTot, lang)]);
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

    $("foot").textContent = t.foot;
    bindDynamic();
  }

  function dayCard(r, t, lang, showBreak) {
    var info = { year: r.year, month: r.month, day: r.day, weekday: r.weekday };
    return (
      '<article class="card day"><div class="day-top"><div><div class="day-date">' +
      escapeHtml(dateLabel(info, lang)) +
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
      "</article>"
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
      var row = enrich(e, rules);
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
