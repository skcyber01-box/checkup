/* dc-lite: ตัวแสดงผลหน้าจอต้นแบบ (template + state) ขนาดเล็ก ไม่ต้องพึ่งไลบรารี */
(function () {
  var STEPS = [
    ['Main', 'เห็นแคมเปญ'], ['Register', 'ลงทะเบียน'], ['Hospital', 'เลือกที่ตรวจ'],
    ['Confirm', 'ยืนยันนัด'], ['Checkin', 'วันตรวจ QR'], ['Results', 'ผลตรวจ'], ['Followup', 'ดูแลต่อ']
  ];
  var params = new URLSearchParams(location.search);
  var thumb = params.has('thumb');
  var bareQ = params.get('view');

  function get(o, p) { return p.split('.').reduce(function (a, k) { return a == null ? a : a[k]; }, o); }
  var ONE = /^\s*\{\{\s*([^}]+?)\s*\}\}\s*$/;
  function res(s, sc) {
    var m = s.match(ONE);
    if (m) { var k = m[1]; if (k === 'true') return true; if (k === 'false') return false; return get(sc, k); }
    return s.replace(/\{\{\s*([^}]+?)\s*\}\}/g, function (_, k) { var v = get(sc, k); return v == null ? '' : v; });
  }

  function expand(node, sc) {
    if (node.nodeType === 3) { if (node.textContent.indexOf('{{') > -1) node.textContent = res(node.textContent, sc); return [node]; }
    if (node.nodeType !== 1) return [node];
    var tag = node.tagName.toLowerCase(), out = [];
    if (tag === 'sc-for') {
      var list = res(node.getAttribute('list'), sc) || [], as = node.getAttribute('as');
      list.forEach(function (it, i) {
        Array.prototype.forEach.call(node.childNodes, function (ch) {
          var s2 = Object.assign({}, sc); s2[as] = it; s2.$index = i;
          out.push.apply(out, expand(ch.cloneNode(true), s2));
        });
      });
      return out;
    }
    if (tag === 'sc-if') {
      if (!res(node.getAttribute('value'), sc)) return [];
      Array.prototype.forEach.call(node.childNodes, function (ch) { out.push.apply(out, expand(ch.cloneNode(true), sc)); });
      return out;
    }
    Array.prototype.slice.call(node.attributes).forEach(function (a) {
      var name = a.name;
      if (/^on/.test(name)) {
        var fn = res(a.value, sc); node.removeAttribute(name);
        if (typeof fn === 'function') node.addEventListener(name.slice(2), function (e) { fn(e); });
        return;
      }
      if (name.indexOf('hint-') === 0) { node.removeAttribute(name); return; }
      if (a.value.indexOf('{{') > -1) {
        var v = res(a.value, sc);
        if (v === false || v == null) node.removeAttribute(name);
        else if (v === true) node.setAttribute(name, '');
        else node.setAttribute(name, String(v));
        if (name === 'checked') node.checked = !!v;
      }
    });
    Array.prototype.slice.call(node.childNodes).forEach(function (k) {
      var r = expand(k, sc);
      if (r.length === 1 && r[0] === k) return;
      r.forEach(function (x) { node.insertBefore(x, k); });
      k.remove();
    });
    return [node];
  }

  function boot() {
    var root = document.querySelector('x-dc');
    var helmet = root.querySelector('helmet');
    if (helmet) { Array.prototype.slice.call(helmet.childNodes).forEach(function (n) { document.head.appendChild(n); }); helmet.remove(); }
    var template = root.innerHTML;
    var src = document.querySelector('script[type="text/x-dc"]').textContent;

    function DCLogic(props) { this.props = props || {}; this.state = {}; }
    DCLogic.prototype.setState = function (p) { this.state = Object.assign({}, this.state, typeof p === 'function' ? p(this.state) : p); render(); };
    DCLogic.prototype.forceUpdate = function () { render(); };
    var Component = new Function('DCLogic', src + '\n;return Component;')(DCLogic);
    var c = new Component({});
    var scroller = 0;

    function render() {
      var m = root.querySelector('main'); if (m) scroller = m.scrollTop;
      root.innerHTML = template;
      expand(root, c.renderVals());
      root.querySelectorAll('a[href$=".dc.html"]').forEach(function (a) {
        a.setAttribute('href', a.getAttribute('href').replace('.dc.html', '.html') + (thumb ? '?thumb' : bareQ === 'frame' ? '?view=frame' : ''));
      });
      var m2 = root.querySelector('main'); if (m2) m2.scrollTop = scroller;
    }
    render();
    layout();
    window.addEventListener('resize', layout);
    window.addEventListener('orientationchange', function () { setTimeout(layout, 300); });
    if (window.visualViewport) window.visualViewport.addEventListener('resize', layout);
  }

  function layout() {
    var b = document.body;
    // ค่าเริ่มต้น: Web App เต็มจอ (?view=frame = ดูในกรอบ iPhone สำหรับนำเสนอ)
    var bare = !thumb && bareQ !== 'frame';
    b.classList.toggle('bare', bare);
    b.classList.toggle('thumb', thumb);
    var stage = document.querySelector('.stage');
    if (!stage) return;
    if (bare) {
      stage.style.transform = ''; stage.style.height = '';
      // ใช้ความสูงที่มองเห็นจริง (กันแถบเบราว์เซอร์/แถบนำทาง Android บังปุ่มด้านล่าง)
      var vv = window.visualViewport;
      document.documentElement.style.setProperty('--app-h', Math.round(vv ? vv.height : window.innerHeight) + 'px');
      return;
    }
    var vw = window.innerWidth, vh = window.innerHeight;
    var navH = thumb ? 0 : (vw < 480 ? 64 : 76);
    var fitW = (vw - (vw < 480 ? 16 : 32)) / 426;
    var fitH = (vh - navH - 24) / 898;
    // พอดีความกว้างเสมอ และพอดีความสูงเมื่อจอสูงพอ
    // จอเตี้ย (เช่น มือถือแนวนอน) จะไม่ย่อจนอ่านไม่ออก แต่ให้เลื่อนหน้าลงแทน
    var s = Math.min(1, fitW);
    if (fitH >= 0.6) s = Math.min(s, fitH);
    if (thumb) s = vw / 426;
    stage.style.transform = 'scale(' + s + ')';
    stage.style.width = '426px';
    stage.parentElement.style.height = (898 * s) + 'px';
    stage.parentElement.style.width = (426 * s) + 'px';
  }

  function nav() {
    if (thumb || bareQ !== 'frame') return;
    var cur = (location.pathname.split('/').pop() || '').replace('.html', '');
    var i = STEPS.findIndex(function (s) { return s[0] === cur; });
    var el = document.createElement('nav');
    el.className = 'stepnav'; el.setAttribute('aria-label', 'ขั้นตอน');
    var h = '<a class="home" href="../overview.html">ภาพรวม</a><div class="dots">';
    STEPS.forEach(function (s, k) {
      h += '<a href="' + s[0] + '.html?view=frame" title="' + s[1] + '"' + (k === i ? ' aria-current="page"' : '') + '>' + (k + 1) + '</a>';
    });
    h += '</div><span class="lbl">' + (i > -1 ? (i + 1) + ' · ' + STEPS[i][1] : '') + '</span>';
    el.innerHTML = h;
    document.body.appendChild(el);
  }

  document.addEventListener('DOMContentLoaded', function () { nav(); boot(); });
})();
