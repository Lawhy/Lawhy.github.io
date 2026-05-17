// Populates the footer pageview span from GoatCounter.
// Requires "Allow adding visitor counts on your website" enabled in GoatCounter
// settings (exposes /counter/<path>.json).
(function () {
  var el = document.getElementById("pageviews");
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
      if (vals[0]) parts.push(vals[0] + " sitewide (visits)");
    } else {
      if (vals[0]) parts.push(vals[0] + " here");
      if (vals[1]) parts.push(vals[1] + " sitewide (visits)");
    }
    if (!parts.length) return;
    var a = document.createElement("a");
    a.href = base + "/";
    a.target = "_blank";
    a.rel = "noopener";
    a.textContent = parts.join(" · ");
    el.appendChild(a);
    el.hidden = false;
  });
})();
