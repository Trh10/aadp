(function (w) {
  "use strict";
  w.AADP_BASE = w.location.pathname.indexOf("/aadp") !== -1 ? "/aadp/" : "";
  w.aadpAsset = function (path) {
    if (!path || /^https?:\/\//i.test(path) || /^data:/i.test(path)) return path;
    return w.AADP_BASE + String(path).replace(/^\//, "");
  };
  w.aadpFixStaticAssets = function () {
    document.querySelectorAll("img[src^='assets/']").forEach(function (img) {
      img.src = w.aadpAsset(img.getAttribute("src"));
    });
  };
})(window);
