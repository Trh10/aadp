(function (w) {
  "use strict";
  w.AADP_BASE = w.location.pathname.indexOf("/aadp") !== -1 ? "/aadp/" : "";
  w.aadpAsset = function (path) {
    if (!path || /^https?:\/\//i.test(path) || /^data:/i.test(path)) return path;
    var p = String(path);
    if (w.AADP_BASE && p.indexOf(w.AADP_BASE) === 0) return p;
    if (w.AADP_BASE && p.indexOf("/aadp/") === 0) return p;
    return w.AADP_BASE + p.replace(/^\//, "");
  };
  w.aadpFixStaticAssets = function () {
    document.querySelectorAll("img[src]").forEach(function (img) {
      var src = img.getAttribute("src");
      if (src && (src.indexOf("assets/") === 0 || src.indexOf("/aadp/assets/") === 0)) {
        img.src = w.aadpAsset(src);
      }
    });
  };
})(window);
