// Populates the footer page-visits span from GoatCounter.
// Requires "Allow adding visitor counts on your website" enabled in GoatCounter
// settings (exposes /counter/<path>.json).
(function () {
  var el = document.getElementById("pagevisits");
  if (!el) return;

  var base = "https://yuanhe.goatcounter.com";
  var path = location.pathname;
  var isHome = path === "/" || path === "/index.html";

  // Resolves to the count as a string. GoatCounter answers 404 with
  // {"count": "0"} for a path it has never seen, so a 404 is a real zero,
  // not an error; only network failures and other statuses yield null.
  function fetchCount(key) {
    return fetch(base + "/counter/" + encodeURIComponent(key) + ".json")
      .then(function (r) { return (r.ok || r.status === 404) ? r.json() : null; })
      .then(function (d) {
        if (!d || d.count == null) return null;
        return String(d.count);
      })
      .catch(function () { return null; });
  }

  var tasks = isHome
    ? [fetchCount("TOTAL")]
    : [fetchCount(path), fetchCount("TOTAL")];

  Promise.all(tasks).then(function (vals) {
    var parts = [];
    // Sitewide total is only worth showing when non-zero; the per-page count
    // is shown even at zero so "no visits yet" is distinguishable from
    // "counter failed to load".
    if (isHome) {
      if (vals[0] && vals[0] !== "0") parts.push(vals[0] + " visits");
    } else {
      if (vals[0] !== null) parts.push(vals[0] + " here");
      if (vals[1] && vals[1] !== "0") parts.push(vals[1] + " visits");
    }
    if (!parts.length) return;

    var countLink = document.createElement("a");
    countLink.href = base + "/";
    countLink.target = "_blank";
    countLink.rel = "noopener";
    countLink.textContent = parts.join(" · ");

    var sep = document.createTextNode(" · ");

    var credit = document.createElement("a");
    credit.href = "https://www.goatcounter.com/";
    credit.target = "_blank";
    credit.rel = "noopener";
    credit.textContent = "by GoatCounter";

    el.appendChild(countLink);
    el.appendChild(sep);
    el.appendChild(credit);
    el.hidden = false;
  });
})();
