// Populates the footer page-visits span from GoatCounter.
// Requires "Allow adding visitor counts on your website" enabled in GoatCounter
// settings (exposes /counter/<path>.json).
(function () {
  var el = document.getElementById("pagevisits");
  if (!el) return;

  var base = "https://yuanhe.goatcounter.com";
  var path = location.pathname;
  var isHome = path === "/" || path === "/index.html";

  function fetchCount(key) {
    return fetch(base + "/counter/" + encodeURIComponent(key) + ".json")
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) {
        if (!d) return null;
        var n = d.count;
        return (n && n !== "0") ? n : null;
      })
      .catch(function () { return null; });
  }

  var tasks = isHome
    ? [fetchCount("TOTAL")]
    : [fetchCount(path), fetchCount("TOTAL")];

  Promise.all(tasks).then(function (vals) {
    var parts = [];
    if (isHome) {
      if (vals[0]) parts.push(vals[0] + " visits");
    } else {
      if (vals[0]) parts.push(vals[0] + " here");
      if (vals[1]) parts.push(vals[1] + " visits");
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
