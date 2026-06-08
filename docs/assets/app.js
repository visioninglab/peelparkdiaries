/* Peel Park Diaries — single-page app (no build step, GitHub Pages friendly) */
(function () {
  "use strict";
  var D = window.PPD_DATA;
  var pagesById = {};
  D.pages.forEach(function (p) { pagesById[p.id] = p; });
  var contentPages = D.pages.filter(function (p) { return p.transcription && p.themes; });

  var app = document.getElementById("app");
  var IMG = "images/";

  /* ---------- helpers ---------- */
  function el(tag, attrs, html) {
    var e = document.createElement(tag);
    if (attrs) for (var k in attrs) {
      if (k === "class") e.className = attrs[k];
      else if (k === "html") e.innerHTML = attrs[k];
      else e.setAttribute(k, attrs[k]);
    }
    if (html != null) e.innerHTML = html;
    return e;
  }
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
  function highlight(text, q) {
    if (!q) return esc(text);
    var re = new RegExp("(" + q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "ig");
    return esc(text).replace(re, "<mark>$1</mark>");
  }
  function themeTitle(id) {
    var t = D.themes.filter(function (x) { return x.id === id; })[0];
    return t ? t.title : id;
  }

  /* ---------- reader modal ---------- */
  var backdrop = el("div", { class: "reader-backdrop" });
  document.body.appendChild(backdrop);
  backdrop.addEventListener("click", function (e) {
    if (e.target === backdrop) closeReader();
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeReader(); });

  function closeReader() { backdrop.classList.remove("open"); backdrop.innerHTML = ""; }

  function openReader(id) {
    var p = pagesById[id];
    if (!p) return;
    var entities = "";
    if (p.people && p.people.length)
      entities += '<div class="tagset"><span class="lab">People</span>' +
        p.people.map(function (n) { return '<span class="pill" data-ent="' + esc(n) + '">' + esc(n) + "</span>"; }).join(" ") + "</div>";
    if (p.places && p.places.length)
      entities += '<div class="tagset"><span class="lab">Places</span>' +
        p.places.map(function (n) { return '<span class="pill" data-ent="' + esc(n) + '">' + esc(n) + "</span>"; }).join(" ") + "</div>";
    if (p.themes && p.themes.length)
      entities += '<div class="tagset"><span class="lab">Themes</span>' +
        p.themes.map(function (t) { return '<span class="pill">' + esc(themeTitle(t)) + "</span>"; }).join(" ") + "</div>";

    backdrop.innerHTML =
      '<div class="reader" role="dialog" aria-modal="true">' +
        '<div class="bar"><div class="t">' + esc(p.title) + '</div>' +
          '<button class="x" aria-label="Close">&times;</button></div>' +
        '<div class="body">' +
          '<div class="imgpane"><a href="' + IMG + p.image + '" target="_blank" rel="noopener">' +
            '<img src="' + IMG + p.image + '" alt="' + esc(p.title) + '"></a></div>' +
          '<div class="textpane">' +
            (p.date ? '<div class="date">' + esc(p.date) + "</div>" : "") +
            '<div class="ref">' + esc(p.ref) + " &middot; image " + esc(p.seq) +
              (p.folio ? " &middot; " + esc(p.folio) : "") + " &middot; " + esc(p.form) + "</div>" +
            (p.summary ? '<p class="summary">' + esc(p.summary) + "</p>" : "") +
            '<div class="transcription">' + esc(p.transcription) + "</div>" +
            '<div class="entities">' + entities + "</div>" +
            '<p class="draftnote">' + esc(D.meta.note) + " Tap the image to view the full scan.</p>" +
          "</div>" +
        "</div>" +
      "</div>";
    backdrop.classList.add("open");
    backdrop.querySelector(".x").addEventListener("click", closeReader);
    backdrop.querySelectorAll("[data-ent]").forEach(function (b) {
      b.style.cursor = "pointer";
      b.addEventListener("click", function () {
        closeReader();
        location.hash = "#/browse?q=" + encodeURIComponent(b.getAttribute("data-ent"));
      });
    });
  }

  /* ---------- views ---------- */
  function viewHome() {
    var cover = pagesById["dr4-8-cover"];
    var h = el("div");
    h.appendChild(el("div", { class: "hero" }, '' +
      '<div>' +
        '<p>Salford\'s <strong>Peel Park</strong> opened in 1846 as one of the first public parks anywhere in the world. ' +
        'For nearly a century its gardeners and Parks Superintendents kept detailed report books — and two of those volumes have been scanned, page by page.</p>' +
        '<p>This is a small demonstration of what we can do with that material: <strong>read the handwriting and typescript</strong>, ' +
        'turn the pages into <strong>searchable text</strong>, draw out the <strong>people and places</strong>, and trace <strong>themes</strong> across the years.</p>' +
        '<div class="pill-row">' +
          '<span class="pill">' + contentPages.length + ' pages transcribed</span>' +
          '<span class="pill">2 volumes</span>' +
          '<span class="pill">1922–1946</span>' +
        '</div>' +
        '<p><a href="#/browse">Browse &amp; search the pages &rarr;</a></p>' +
      '</div>' +
      '<figure class="figure"><img src="' + IMG + cover.image + '" alt="Volume cover">' +
        '<figcaption>' + esc(cover.ref) + ' — “Parks Superintendent Reports”</figcaption></figure>'
    ));

    var what = el("section");
    what.appendChild(el("h2", { class: "section" }, "What this showcase does"));
    what.appendChild(el("p", { class: "lede" }, "Four things, each shown on a curated handful of pages rather than the whole archive."));
    var cards = el("div", { class: "cards" });
    [
      ["Transcription", "Every featured page is read into clean, structured text — handwritten copperplate and 1940s typescript alike.", "#/browse"],
      ["Full-text search", "Find a gardener, a park or a phrase across every transcribed page and jump straight to it.", "#/browse"],
      ["People &amp; places", "Names and parks are pulled out automatically and linked back to the pages they appear on.", "#/index"],
      ["Themes", "Short threads — staffing, sport, wartime, money — stitched from quotes across the volumes.", "#/themes"]
    ].forEach(function (c) {
      var card = el("a", { class: "card", href: c[2] });
      card.innerHTML = "<h3>" + c[0] + "</h3><p>" + c[1] + "</p><p class='more'>Open &rarr;</p>";
      cards.appendChild(card);
    });
    what.appendChild(cards);

    var vols = el("section");
    vols.appendChild(el("h2", { class: "section" }, "The two volumes"));
    vols.style.marginTop = "44px";
    var vc = el("div", { class: "volcards" });
    D.volumes.forEach(function (v) {
      var card = el("div", { class: "volcard" });
      card.innerHTML = '<div class="ref">' + esc(v.ref) + " &middot; " + esc(v.form) + " &middot; " + esc(v.span) + "</div>" +
        "<h3>" + esc(v.label) + "</h3><p>" + esc(v.blurb) + "</p>" +
        '<p style="font-family:var(--sans);font-size:13px;color:var(--ink-soft)">' + v.pages + " scanned pages</p>";
      vc.appendChild(card);
    });
    vols.appendChild(vc);

    h.appendChild(what);
    h.appendChild(vols);
    return h;
  }

  function tileEl(p, q) {
    var t = el("button", { class: "tile" });
    t.innerHTML =
      '<div class="thumb"><img loading="lazy" src="' + IMG + p.image + '" alt="' + esc(p.title) + '"></div>' +
      '<div class="meta">' +
        (p.date ? '<div class="date">' + esc(p.date) + "</div>" : '<div class="date">&nbsp;</div>') +
        "<h3>" + highlight(p.title, q) + "</h3>" +
        '<div class="ref">' + esc(p.ref) + " &middot; image " + esc(p.seq) + "</div>" +
      "</div>";
    t.addEventListener("click", function () { openReader(p.id); });
    return t;
  }

  function viewBrowse(params) {
    var q = (params.q || "").trim();
    var activeVol = params.vol || "";
    var wrap = el("div");
    wrap.appendChild(el("h2", { class: "section" }, "Browse &amp; search"));
    wrap.appendChild(el("p", { class: "lede" }, "Search across every transcribed page — titles, summaries and full transcription text."));

    var toolbar = el("div", { class: "toolbar" });
    toolbar.innerHTML =
      '<div class="search"><input id="q" type="search" placeholder="Search the diaries — try “bowling”, “Buile Hill”, “superannuation”…" value="' + esc(q) + '"></div>' +
      '<div class="filter-chips">' +
        '<button class="chip' + (activeVol === "" ? " active" : "") + '" data-vol="">Both volumes</button>' +
        '<button class="chip' + (activeVol === "L-CS-DR4-8" ? " active" : "") + '" data-vol="L-CS-DR4-8">1920s (handwritten)</button>' +
        '<button class="chip' + (activeVol === "L-CS-DR4-16" ? " active" : "") + '" data-vol="L-CS-DR4-16">1940s (typed)</button>' +
      "</div>";
    wrap.appendChild(toolbar);

    var count = el("div", { class: "count" });
    wrap.appendChild(count);
    var grid = el("div", { class: "grid" });
    wrap.appendChild(grid);

    function render() {
      var qq = (document.getElementById("q").value || "").trim();
      var ql = qq.toLowerCase();
      grid.innerHTML = "";
      var list = D.pages.filter(function (p) {
        if (activeVol && p.volume !== activeVol) return false;
        if (!ql) return true;
        var hay = (p.title + " " + (p.summary || "") + " " + (p.transcription || "") + " " +
          (p.people || []).join(" ") + " " + (p.places || []).join(" ") + " " + (p.date || "")).toLowerCase();
        return hay.indexOf(ql) !== -1;
      });
      list.sort(function (a, b) { return (a.sortDate || "").localeCompare(b.sortDate || ""); });
      count.textContent = list.length + (list.length === 1 ? " page" : " pages") +
        (qq ? ' matching “' + qq + '”' : "") + (activeVol ? " in this volume" : "");
      if (!list.length) { grid.appendChild(el("div", { class: "empty" }, "No pages match that search. Try a gardener's name, a park, or a word like “tennis”.")); return; }
      list.forEach(function (p) { grid.appendChild(tileEl(p, qq)); });
    }
    render();

    setTimeout(function () {
      var input = document.getElementById("q");
      input.addEventListener("input", function () {
        render();
        var u = "#/browse";
        var parts = [];
        if (input.value.trim()) parts.push("q=" + encodeURIComponent(input.value.trim()));
        if (activeVol) parts.push("vol=" + activeVol);
        history.replaceState(null, "", parts.length ? u + "?" + parts.join("&") : u);
      });
      toolbar.querySelectorAll(".chip").forEach(function (c) {
        c.addEventListener("click", function () {
          var v = c.getAttribute("data-vol");
          var parts = [];
          if (input.value.trim()) parts.push("q=" + encodeURIComponent(input.value.trim()));
          if (v) parts.push("vol=" + v);
          location.hash = "#/browse" + (parts.length ? "?" + parts.join("&") : "");
        });
      });
    }, 0);
    return wrap;
  }

  function viewIndex() {
    var people = {}, places = {};
    contentPages.forEach(function (p) {
      (p.people || []).forEach(function (n) { (people[n] = people[n] || []).push(p.id); });
      (p.places || []).forEach(function (n) { (places[n] = places[n] || []).push(p.id); });
    });
    function listEl(map) {
      var ul = el("ul", { class: "entitylist" });
      Object.keys(map).sort(function (a, b) {
        var la = a.replace(/^(Rev\.|Mr\.|the )\s*/i, ""), lb = b.replace(/^(Rev\.|Mr\.|the )\s*/i, "");
        return la.localeCompare(lb);
      }).forEach(function (name) {
        var li = el("li");
        li.innerHTML = '<span class="name">' + esc(name) + '</span><span class="badge">' +
          map[name].length + (map[name].length === 1 ? " page" : " pages") + "</span>";
        li.querySelector(".name").addEventListener("click", function () {
          location.hash = "#/browse?q=" + encodeURIComponent(name);
        });
        ul.appendChild(li);
      });
      return ul;
    }
    var wrap = el("div");
    wrap.appendChild(el("h2", { class: "section" }, "People &amp; places"));
    wrap.appendChild(el("p", { class: "lede" }, "Names and locations extracted from the transcribed pages. Click any entry to find the pages it appears on."));
    var cols = el("div", { class: "indexcols" });
    var c1 = el("div"); c1.appendChild(el("h3", null, "People")); c1.appendChild(listEl(people));
    var c2 = el("div"); c2.appendChild(el("h3", null, "Parks &amp; places")); c2.appendChild(listEl(places));
    cols.appendChild(c1); cols.appendChild(c2);
    wrap.appendChild(cols);
    return wrap;
  }

  function viewThemes() {
    var wrap = el("div");
    wrap.appendChild(el("h2", { class: "section" }, "Themes across the volumes"));
    wrap.appendChild(el("p", { class: "lede" }, "Threads woven from quotes across the pages — a glimpse of the questions a full transcription could answer."));
    D.themes.forEach(function (t) {
      var sec = el("div", { class: "theme" });
      sec.innerHTML = "<h3>" + esc(t.title) + "</h3><p class='lede'>" + esc(t.lede) + "</p><p>" + esc(t.body) + "</p>";
      var links = el("div", { class: "threadlinks" });
      (t.pages || []).forEach(function (pid) {
        var p = pagesById[pid];
        if (!p) return;
        var b = el("button", null, (p.date || p.title));
        b.addEventListener("click", function () { openReader(pid); });
        links.appendChild(b);
      });
      sec.appendChild(links);
      wrap.appendChild(sec);
    });
    return wrap;
  }

  /* ---------- router ---------- */
  function parse() {
    var h = location.hash.replace(/^#\/?/, "");
    var qi = h.indexOf("?");
    var path = qi === -1 ? h : h.slice(0, qi);
    var params = {};
    if (qi !== -1) h.slice(qi + 1).split("&").forEach(function (kv) {
      var p = kv.split("="); params[decodeURIComponent(p[0])] = decodeURIComponent(p[1] || "");
    });
    return { path: path || "home", params: params };
  }

  function route() {
    var r = parse();
    var view;
    if (r.path === "browse") view = viewBrowse(r.params);
    else if (r.path === "index") view = viewIndex();
    else if (r.path === "themes") view = viewThemes();
    else view = viewHome();
    app.innerHTML = "";
    app.appendChild(view);
    document.querySelectorAll("nav.tabs a").forEach(function (a) {
      a.classList.toggle("active", a.getAttribute("data-route") === r.path ||
        (r.path === "home" && a.getAttribute("data-route") === "home"));
    });
    window.scrollTo(0, 0);
  }
  window.addEventListener("hashchange", route);
  route();
})();
