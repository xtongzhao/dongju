/* 产品 Demo 看板 - 交互脚本 */
(function () {
  const pagesEl = document.getElementById('pages');
  const sections = Array.from(pagesEl.querySelectorAll('.page'));
  const navListEl = document.getElementById('navList');

  /* ================= 手机播放器模板 ================= */
  // 4 个一级 Tab
  const TABS = [
    { key: 'detail', label: '详情' },
    { key: 'ugc', label: '二创', badge: '216万+' },
 { key: 'discuss', label: '讨论' },
    { key: 'ai', label: 'AI懂剧' }
  ];
  // AI 懂剧内的 5 个二级 Tab
  const AI_SUBTABS = [
    { key: 'recap', label: '前情回顾', icon: '📖' },
    { key: 'rel', label: '人物关系', icon: '👥' },
    { key: 'time', label: '时间线', icon: '🕒' },
    { key: 'world', label: '世界线', icon: '🌐' },
    { key: 'faq', label: '常问问题', icon: '💬' }
  ];

  /* ================= 世界线分集数据 ================= */
  // 当前选中的世界线集数（全局状态，供外部 Tab 切换）
  let _worldEp = 5; // 默认第5集

  function setWorldEp(ep) {
    _worldEp = ep;
    // 1. 同步所有外部 Tab 高亮（优先执行，确保选中态一定生效）
    document.querySelectorAll('.wl-ep-tab').forEach(t => {
      t.classList.toggle('active', parseInt(t.dataset.ep) === ep);
    });
    // 2. 刷新所有手机中的 AI 面板
    const epObj = WORLD_EPISODES[_worldEp - 1] || WORLD_EPISODES[WORLD_EPISODES.length - 1];
    document.querySelectorAll('.phone-mount').forEach(mount => {
      const phone = mount.querySelector('.phone-wrap');
      if (!phone || !phone._tpState) return;
      const st = phone._tpState;
      if (st.tab !== 'ai') return;
      const panelEl = phone.querySelector('[data-panel]');
      if (!panelEl) return;
      if (st.sub === 'world') {
        // 世界线：整图重渲
        panelEl.innerHTML = renderWorldPanel(_worldEp - 1);
        bindWorldZoom(panelEl);
      } else if (st.sub === 'rel') {
        // 人物关系：按集数重渲不同图谱
        panelEl.innerHTML = renderRelPanel(_worldEp);
        bindWorldZoom(panelEl); // 关系图也有缩放控件
      } else {
        // 其余场景：仅更新集数徽标
        const ctx = panelEl.querySelector('.ai-ep-context');
        if (ctx) ctx.textContent = '📺 当前：' + epObj.label;
      }
      panelEl.scrollTop = 0;
    });
  }

  const WORLD_EPISODES = [
    {
      id: 1, label: '第1-2集', badge: 'EP01-02', title: '入赘转折',
      totalLocs: 4, totalEvts: 8,
      nodes: [
        { id:'fjzy', name:'樊家宅院', icon:'🏠', x:170, y:115, count:4, color:'#e57373' },
        { id:'zrp',  name:'猪肉铺',   icon:'🥩', x:105, y:75,  count:2, color:'#ef5350' },
        { id:'dp',   name:'当铺',     icon:'🏦', x:55,  y:155, count:1, color:'#90a4ae' },
        { id:'sj',   name:'宋家',     icon:'🏡', x:235, y:55,  count:1, color:'#81c784' }
      ],
      lines: [
        { a:[235,55], b:[170,115], label:'邻里' },
        { a:[170,115], b:[105,75], label:'围巷' },
        { a:[170,115], b:[55,155], label:'' }
      ]
    },
    {
      id: 2, label: '第1-3集', badge: 'EP01-03', title: '暗流涌动',
      totalLocs: 7, totalEvts: 13,
      nodes: [
        { id:'fjzy', name:'樊家宅院', icon:'🏠', x:130, y:110, count:5, color:'#e57373' },
        { id:'zrp',  name:'猪肉铺',   icon:'🥩', x:65,  y:70,  count:2, color:'#ef5350' },
        { id:'dp',   name:'当铺',     icon:'🏦', x:40,  y:150, count:1, color:'#90a4ae' },
        { id:'sj',   name:'宋家',     icon:'🏡', x:195, y:60,  count:1, color:'#81c784' },
        { id:'yxf',  name:'雅绣坊',   icon:'🧵', x:210, y:140, count:1, color:'#ba68c8' },
        { id:'ct',   name:'朝堂（京城）',icon:'👑',x:255, y:45,  count:2, color:'#ab47bc' },
        { id:'hyfq', name:'后院坟前', icon:'⚰️', x:145, y:175, count:1, color:'#78909c' }
      ],
      lines: [
        { a:[195,60], b:[130,110], label:'邻里' },
        { a:[130,110], b:[65,70], label:'围巷' },
        { a:[130,110], b:[40,150], label:'' },
        { a:[130,110], b:[210,140], label:'' },
        { a:[130,110], b:[145,175], label:'' },
        { a:[255,45], b:[195,60], label:'' }
      ]
    },
    {
      id: 3, label: '第1-4集', badge: 'EP01-04', title: '大婚汇聚',
      totalLocs: 9, totalEvts: 18,
      nodes: [
        { id:'fjzy', name:'樊家宅院', icon:'🏠', x:120, y:110, count:7, color:'#e57373' },
        { id:'zrp',  name:'猪肉铺',   icon:'🥩', x:55,  y:70,  count:2, color:'#ef5350' },
        { id:'dp',   name:'当铺',     icon:'🏦', x:35,  y:150, count:1, color:'#90a4ae' },
        { id:'sj',   name:'宋家',     icon:'🏡', x:185, y:55,  count:2, color:'#81c784' },
        { id:'yxf',  name:'雅绣坊',   icon:'🧵', x:200, y:140, count:1, color:'#ba68c8' },
        { id:'xs',   name:'县衙',     icon:'🏛️', x:250, y:110, count:1, color:'#bdbdbd' },
        { id:'sjs',  name:'四季书肆', icon:'📖', x:245, y:175, count:1, color:'#42a5f5' },
        { id:'ct',   name:'朝堂（京城）',icon:'👑',x:275, y:40,  count:2, color:'#ab47bc' },
        { id:'hyfq', name:'后院坟前', icon:'⚰️', x:135, y:178, count:1, color:'#78909c' }
      ],
      lines: [
        { a:[185,55], b:[120,110], label:'邻里' },
        { a:[120,110], b:[55,70], label:'围巷' },
        { a:[120,110], b:[35,150], label:'' },
        { a:[120,110], b:[200,140], label:'' },
        { a:[120,110], b:[135,178], label:'' },
        { a:[120,110], b:[250,110], label:'官道' },
        { a:[275,40], b:[185,55], label:'京城方向', dash:true },
        { a:[250,110], b:[245,175], label:'' }
      ]
    },
    {
      id: 4, label: '第1-5集', badge: 'EP01-05', title: '尘埃暂定',
      totalLocs: 10, totalEvts: 25,
      nodes: [
        { id:'fjzy', name:'樊家宅院', icon:'🏠', x:115, y:115, count:9, color:'#e57373' },
        { id:'zrp',  name:'猪肉铺',   icon:'🥩', x:50,  y:72,  count:2, color:'#ef5350' },
        { id:'dp',   name:'当铺',     icon:'🏦', x:30,  y:155, count:2, color:'#90a4ae' },
        { id:'sj',   name:'宋家',     icon:'🏡', x:180, y:58,  count:3, color:'#81c784' },
        { id:'yxf',  name:'雅绣坊',   icon:'🧵', x:195, y:143, count:1, color:'#ba68c8' },
        { id:'xs',   name:'县衙',     icon:'🏛️', x:240, y:112, count:2, color:'#bdbdbd' },
        { id:'sjs',  name:'四季书肆', icon:'📖', x:235, y:177, count:1, color:'#42a5f5' },
        { id:'ct',   name:'朝堂（京城）',icon:'👑',x:268, y:38,  count:3, color:'#ab47bc' },
        { id:'hyfq', name:'后院坟前', icon:'⚰️', x:128, y:182, count:1, color:'#78909c' },
        { id:'hjly', name:'河间麓原书院',icon:'🎓',x:290, y:165, count:1, color:'#1565c0' }
      ],
      lines: [
        { a:[180,58], b:[115,115], label:'邻里' },
        { a:[115,115], b:[50,72], label:'楼外街' },
        { a:[115,115], b:[30,155], label:'' },
        { a:[115,115], b:[195,143], label:'' },
        { a:[115,115], b:[128,182], label:'' },
        { a:[115,115], b:[240,112], label:'官道' },
        { a:[268,38], b:[180,58], label:'京城方向', dash:true },
        { a:[240,112], b:[235,177], label:'' },
        { a:[268,38], b:[290,165], label:'飞马驿站', dash:true }
      ]
    }
  ];

  /* 生成世界线面板 HTML */
  function renderWorldPanel(epIdx) {
    const ep = WORLD_EPISODES[epIdx] || WORLD_EPISODES[WORLD_EPISODES.length - 1];
    const vb = { w: 320, h: 220 };
    // 节点圆半径
    const r = 16;

    // 生成连线 SVG
    const linesSvg = ep.lines.map(l => {
      const dashAttr = l.dash ? ' stroke-dasharray="6,4"' : '';
      return `<line x1="${l.a[0]}" y1="${l.a[1]}" x2="${l.b[0]}" y2="${l.b[1]}" stroke="#b0bec5" stroke-width="1.5" fill="none"${dashAttr}/>` +
        (l.label ? `<text x="${(l.a[0]+l.b[0])/2}" y="${(l.a[1]+l.b[1])/2 - 4}" fill="#90a4ae" font-size="9" text-anchor="middle">${l.label}</text>` : '');
    }).join('\n');

    // 生成节点 SVG
    const nodesSvg = ep.nodes.map(n => `
      <g class="wl-node" transform="translate(${n.x},${n.y})">
        <circle r="${r+3}" fill="white" stroke="#e0e0e0" stroke-width="1"/>
        <circle r="${r}" fill="white" stroke="${n.color}" stroke-width="2"/>
        <text y="1" text-anchor="middle" dominant-baseline="middle" font-size="${n.count >= 10 ? 11 : 13}">${n.icon}</text>
        ${n.count > 1 ? `<circle cx="${r-4}" cy="${-r+4}" r="9" fill="${n.color}"/><text x="${r-4}" y="${-r+4+1}" text-anchor="middle" dominant-baseline="middle" font-size="9" fill="white" font-weight="700">${n.count}</text>` : ''}
        <text y="${r + 16}" text-anchor="middle" fill="#546e7a" font-size="10">${n.name}</text>
      </g>
    `).join('\n');

    // 地点 chip 列表（按截图顺序）
    const locChips = ep.nodes.map(n => `
      <span class="wl-loc-chip">
        <span class="wl-loc-icon">${n.icon}</span>
        <span class="wl-loc-name">${n.name}</span>
        <span class="wl-loc-count" style="color:${n.color}">${n.count}</span>
      </span>
    `).join('');

    return `
      <div class="wl-card">
        <div class="wl-head">
          <span class="wl-ic">🌐</span>
          <div>
            <div class="wl-t">世界线</div>
            <div class="wl-s">第${ep.label} · ${ep.totalLocs}个地点 · ${ep.totalEvts}件事</div>
          </div>
        </div>
        <div class="wl-map-wrap">
          <svg class="wl-map-svg" viewBox="0 0 ${vb.w} ${vb.h}" preserveAspectRatio="xMidYMid meet" data-wl-zoom>
            <!-- 背景装饰 -->
            <rect width="${vb.w}" height="${vb.h}" rx="14" fill="#faf8f5"/>
            <text x="${vb.w - 12}" y="22" fill="#e8e4de" font-size="20" text-anchor="end">卷</text>
            ${linesSvg}
            ${nodesSvg}
          </svg>
          <div class="wl-zoom-btns">
            <button class="wl-zb" data-wz="in" title="放大">＋</button>
            <button class="wl-zb" data-wz="out" title="缩小">－</button>
            <button class="wl-zb" data-wz="reset" title="还原">⤢</button>
          </div>
        </div>
        <div class="wl-locs">
          <div class="wl-locs-title"><span class="wl-pin">📍</span> 已解锁地点 <span class="wl-locs-num">${ep.totalLocs}个</span></div>
          <div class="wl-locs-list">${locChips}</div>
        </div>
      </div>
    `;
  }

  // 世界线缩放控制（模块级，供 setWorldEp 复用）
  function bindWorldZoom(panelEl) {
    if (!panelEl) return;
    const svg = panelEl.querySelector('[data-wl-zoom]');
    if (!svg) return;
    let wz = 1;
    panelEl.querySelectorAll('.wl-zb').forEach(btn => {
      btn.addEventListener('click', () => {
        const a = btn.dataset.wz;
        if (a === 'in') wz = Math.min(2.5, wz + 0.25);
        else if (a === 'out') wz = Math.max(0.5, wz - 0.25);
        else wz = 1;
        svg.style.transform = `scale(${wz})`;
        svg.style.transformOrigin = 'center center';
      });
    });
  }

  /* ================= 人物关系分集数据 ================= */
  // 集数 → 关系图索引映射：1,2→0 / 3→1 / 4,5→2
  function _relEpIdx(worldEp) {
    if (worldEp <= 2) return 0;
    if (worldEp === 3) return 1;
    return 2; // 4,5
  }

  const REL_EPISODES = [
    {
      label: '第1-2集',
      visible: ['sy', 'sm', 'zdn', 'fcy', 'xz', 'fcn', 'zds'],
      lines: [
        {a: 'sm',  b: 'sy',  c: '#f97316', d: false, lb: '母子'},
        {a: 'sm',  b: 'fcy', c: '#dc2626', d: true,  lb: '嫌弃退婚'},
        {a: 'sy',  b: 'fcy', c: '#6b7280', d: true,  lb: '前未婚夫(已断)'},
        {a: 'fcy', b: 'xz',  c: '#e11d48', d: false, lb: '雪地救命入赘', ldy: -10},
        {a: 'zdn', b: 'fcy', c: '#2563eb', d: true,  lb: '好邻居·撮合'},
        {a: 'fcy', b: 'fcn', c: '#e11d48', d: false, lb: '姐妹情深'},
        {a: 'fcn', b: 'xz',  c: '#2563eb', d: true,  lb: '暗中守护'},
        {a: 'zdn', b: 'fcn', c: '#2563eb', d: true,  lb: '慈爱照顾'},
        {a: 'zdn', b: 'zds', c: '#e11d48', d: false, lb: '夫妻'}
      ]
    },
    {
      label: '第3集',
      visible: ['sy', 'sm', 'wy', 'zdn', 'fcy', 'xz', 'fcn', 'zds'],
      lines: [
        {a: 'sm',  b: 'sy',  c: '#f97316', d: false, lb: '母子'},
        {a: 'sm',  b: 'fcy', c: '#dc2626', d: true,  lb: '嫌弃退婚'},
        {a: 'sy',  b: 'fcy', c: '#6b7280', d: true,  lb: '前未婚夫(已断)'},
        {a: 'fcy', b: 'xz',  c: '#e11d48', d: false, lb: '入赘丈夫(未婚)', ldy: -10},
        {a: 'xz',  b: 'wy',  c: '#dc2626', d: true,  lb: '灭门仇敌', ldx: 6, ldy: -7},
        {a: 'zdn', b: 'fcy', c: '#2563eb', d: true,  lb: '好邻居'},
        {a: 'fcy', b: 'fcn', c: '#e11d48', d: false, lb: '姐妹情深'},
        {a: 'fcn', b: 'xz',  c: '#2563eb', d: true,  lb: '暗中守护'},
        {a: 'zdn', b: 'fcn', c: '#2563eb', d: true,  lb: '慈爱照顾'},
        {a: 'zdn', b: 'zds', c: '#e11d48', d: false, lb: '夫妻'}
      ]
    },
    {
      label: '第4-5集',
      visible: ['cqj', 'sy', 'sm', 'wy', 'zdn', 'fcy', 'xz', 'fcn', 'gsz', 'zds'],
      lines: [
        {a: 'sm',  b: 'sy',  c: '#f97316', d: false, lb: '母子'},
        {a: 'sm',  b: 'fcy', c: '#dc2626', d: true,  lb: '嫌弃退婚'},
        {a: 'sy',  b: 'fcy', c: '#6b7280', d: true,  lb: '前未婚夫(已断)'},
        {a: 'sy',  b: 'cqj', c: '#7c3aed', d: true,  lb: '新婚约'},
        {a: 'fcy', b: 'xz',  c: '#e11d48', d: false, lb: '大婚礼成', ldy: -10},
        {a: 'xz',  b: 'wy',  c: '#dc2626', d: true,  lb: '亲人?仇敌!', ldx: 6, ldy: -7},
        {a: 'xz',  b: 'gsz', c: '#2563eb', d: true,  lb: '飞鸟传信'},
        {a: 'zdn', b: 'fcy', c: '#2563eb', d: true,  lb: '好邻居'},
        {a: 'fcy', b: 'fcn', c: '#e11d48', d: false, lb: '姐妹情深'},
        {a: 'fcn', b: 'xz',  c: '#e11d48', d: false, lb: '守护型姐夫'},
        {a: 'zdn', b: 'fcn', c: '#2563eb', d: true,  lb: '慈爱照顾'},
        {a: 'zdn', b: 'zds', c: '#e11d48', d: false, lb: '夫妻'}
      ]
    }
  ];

  // 全量角色数据（所有集共享）
  const CHARS_ALL = {
    fcy:  { name: '樊长玉', actor: '田曦薇', faction: '正派', subtitle: '屠户奇女', color: 'c-fcy', img: './assets/char-fcy.png', desc: '女主角，临安镇屠户女，天生神力，性格泼辣坚韧。父母双亡后独自拉扯幼妹，为保住家业决意招赘。一把杀猪刀行走江湖，不让须眉。' },
    xz:   { name: '谢征', actor: '张凌赫', faction: '正派', subtitle: '武安侯', color: 'c-xz', img: './assets/char-xz.png', desc: '男主角，武安侯，化名"言正"。十七年前家族遭丞相魏严构陷灭门，隐姓埋名被樊长玉所救后入赘成婚。身份成谜，心怀复仇大计。' },
    fcn:  { name: '樊长宁', actor: '曹晏宁', faction: '正派', subtitle: '乖巧幼妹', color: 'c-fcn', img: './assets/char-fcn.png', desc: '樊长玉的幼妹，又名"宁娘"。乖巧听话但身体有恙，遇事会犯病，由姐姐悉心照料。姐妹情深，是长玉最大的软肋。' },
    sy:   { name: '宋砚', actor: '朱赞锦', faction: '中立', subtitle: '负心书生', color: 'c-sy', img: './assets/char-sy.png', desc: '樊长玉的前未婚夫，忘恩负义。受尽樊家恩惠却单方面退婚，后攀附县令之女崔千金。典型的渣男形象。' },
    zdn:  { name: '赵大娘', actor: '刘琳', faction: '正派', subtitle: '热心邻居', color: 'c-zdn', img: './assets/char-zdn.jpg', desc: '樊长玉的邻居长辈，热心肠，懂些医术。在樊长玉父母双亡后关照姐妹二人，撮合长玉与言正成婚。' },
    wy:   { name: '魏严', actor: '严屹宽', faction: '反派', subtitle: '权臣丞相', color: 'c-wy', img: './assets/char-wy.jpg', desc: '当朝丞相，权倾朝野。谢征的舅舅，也是构陷谢家灭门的幕后黑手，与谢征有不共戴天之仇。城府极深。' },
    gsz:  { name: '公孙鄞', actor: '李卿', faction: '正派', subtitle: '书院山长', color: 'c-gsz', img: './assets/char-gsz.jpg', desc: '谢征的挚友与盟友，足智多谋。河间麓原书院山长，通过飞鸟传信与谢征联络，暗中谋划。' },
    sm:   { name: '宋母', actor: '傅淼', faction: '中立', subtitle: '势利妇人', color: 'c-sm', img: './assets/char-sm.png', desc: '宋砚的母亲，算出樊长玉是"天煞孤星"后单方面退婚，不愿归还樊家钱财，为人刻薄势利。' },
    cqj:  { name: '崔千金', actor: '上淇', faction: '中立', subtitle: '县令之女', color: 'c-cqj', img: './assets/char-cqj.jpg', desc: '县令之女，宋砚的新未婚妻。宋砚攀附的对象。' },
    zds:  { name: '赵大叔', actor: '岳旸', faction: '正派', subtitle: '懂医邻居', color: 'c-zds', img: './assets/char-zds.jpg', desc: '樊长玉的邻居，赵大娘的丈夫，懂些医术。夫妻二人在樊家姐妹困难时施以援手。' }
  };

  // 节点坐标（全量10节点布局）
  const POS_ALL = {
    cqj: {x: 38, y: 28},     sm:  {x: 110, y: 28},    wy:  {x: 298, y: 36},
    sy:  {x: 38, y: 95},     fcy: {x: 158, y: 140},   xz:  {x: 242, y: 140},
    zdn: {x: 38, y: 195},    fcn: {x: 158, y: 225},   gsz: {x: 298, y: 220},
    zds: {x: 38, y: 268}
  };

  /* 生成人物关系面板 HTML（按集数） */
  function renderRelPanel(epIdx) {
    const ri = _relEpIdx(epIdx);
    const ep = REL_EPISODES[ri];
    const visSet = new Set(ep.visible);
    const CHARS = CHARS_ALL;
    const POS = POS_ALL;

    const avatarImg = (id, cls = '') => {
      const src = (CHARS[id] || {}).img || '';
      return src ? `<img src="${src}" class="rel-avatar ${cls}" alt="${CHARS[id]?.name || id}" />` : `<div class="rel-avatar ${cls} ${CHARS[id]?.color || ''}"></div>`;
    };
    const factionCls = { '正派': 'fac-good', '反派': 'fac-bad', '中立': 'fac-mid' };
    const LEGEND = [
      {c:'#e11d48',d:'solid',t:'姻缘'}, {c:'#f97316',d:'solid',t:'血亲'},
      {c:'#2563eb',d:'dashed',t:'同盟'}, {c:'#dc2626',d:'dashed',t:'仇敌'},
      {c:'#6b7280',d:'dashed',t:'旧识'}, {c:'#7c3aed',d:'dashed',t:'主从'}
    ];
    const LIST_ORDER = ['fcy','xz','fcn','sy','sm','cqj','zdn','zds','wy','gsz'];

    // 只渲染可见连线
    const linesSvg = ep.lines.map(l => {
      if (!visSet.has(l.a) || !visSet.has(l.b)) return '';
      const p1 = POS[l.a], p2 = POS[l.b];
      if (!p1 || !p2) return '';
      const lineSvg = `<line x1="${p1.x}" y1="${p1.y}" x2="${p2.x}" y2="${p2.y}" stroke="${l.c}" stroke-width="1.5" ${l.d ? 'stroke-dasharray="4 3"' : ''}/>`;
      if (!l.lb) return lineSvg;
      const mx = (p1.x + p2.x) / 2 + (l.ldx || 0);
      const my = (p1.y + p2.y) / 2 + (l.ldy || 0);
      let tw = 0;
      for (const ch of l.lb) tw += /[一-龥！？()，。、（）]/.test(ch) ? 7.5 : 4.2;
      const bw = Math.ceil(tw) + 9, bh = 14;
      return lineSvg + `<g class="rel-label" transform="translate(${mx},${my})">
        <rect x="${-bw/2}" y="${-bh/2}" width="${bw}" height="${bh}" rx="7" fill="#fff" stroke="${l.c}" stroke-width="0.9" opacity="0.97"/>
        <text x="0" y="0" text-anchor="middle" dominant-baseline="central" font-size="7.5" fill="${l.c}" font-weight="700">${l.lb}</text>
      </g>`;
    }).join('');

    // 只渲染可见节点
    const nodesSvg = ep.visible.map(id => {
      const ch = CHARS[id], p = POS[id];
      if (!ch || !p) return '';
      const cls = factionCls[ch.faction];
      const isCenter = (id === 'fcy' || id === 'xz');
      const size = isCenter ? 34 : 28, half = size / 2;
      return `<g class="node-pos" data-char="${id}" transform="translate(${p.x - half},${p.y - half})">
        <g class="node ${cls}${isCenter ? ' center' : ''}">
          <clipPath id="cp-${id}-${ri}"><rect width="${size}" height="${size}" rx="${isCenter?8:6}"/></clipPath>
          <rect width="${size}" height="${size}" rx="${isCenter?8:6}" fill="#e5e7eb"/>
          <image href="${ch.img}" width="${size}" height="${size}" clip-path="url(#cp-${id}-${ri})" preserveAspectRatio="xMidYMid slice"/>
          <rect width="${size}" height="${size}" rx="${isCenter?8:6}" fill="none" stroke="${cls==='fac-good'?'#14b8a6':cls==='fac-bad'?'#dc2626':'#7c3aed'}" stroke-width="${isCenter?2.5:1.5}"/>
          <text x="${half}" y="${size+12}" text-anchor="middle" font-size="${isCenter?9:8}" fill="#1a1c2c" font-weight="700">${ch.name}</text>
          <text x="${half}" y="${size+22}" text-anchor="middle" font-size="6.5" fill="#9098aa">${ch.actor} 饰</text>
        </g>
      </g>`;
    }).join('');

    // 横排头像条只显示可见角色
    const stripHtml = LIST_ORDER.filter(id => visSet.has(id)).map(id => {
      const ch = CHARS[id];
      return `<div class="rel-chip ${factionCls[ch.faction]}" data-char="${id}">${avatarImg(id,'chip-av')}<div class="chip-name">${ch.name}</div></div>`;
    }).join('');

    return `
      <div class="ai-card">
        <div class="ai-card-head"><span class="ic">👥</span><div><div class="ac-t">人物关系</div><div class="ac-s">前5集 · 主要角色关系图谱</div></div></div>
        <div class="ai-ep-context">📺 当前：${WORLD_EPISODES[_worldEp - 1]?.label || '第1-5集'} · ${ep.label}</div>
        <div class="rel-canvas">
          <svg viewBox="0 0 340 300" preserveAspectRatio="xMidYMid meet" id="relSvg" data-wl-zoom>${linesSvg}${nodesSvg}</svg>
          <span class="rel-heart">♥</span>
          <div class="rel-zoom wl-zoom-btns">
            <button class="wl-zb" data-wz="in" title="放大">＋</button>
            <button class="wl-zb" data-wz="out" title="缩小">－</button>
            <button class="wl-zb" data-wz="reset" title="还原">⤢</button>
          </div>
        </div>
        <div class="rel-legend"><b>图例:</b>${LEGEND.map(l => `<span><i class="ln ${l.d}" style="background:${l.d==='solid'?l.c:''};background-image:${l.d==='dashed'?`repeating-linear-gradient(to right,${l.c} 0 4px,transparent 4px 7px)`:'none'}"></i>${l.t}</span>`).join('')}</div>
        <div class="rel-strip">${stripHtml}</div>
        <div class="rel-sheet" data-sheet hidden><div class="rel-sheet-inner" data-sheet-inner></div></div>
        <script type="application/json" data-chars>${JSON.stringify(CHARS)}</script>
      </div>
    `;
  }

  // 一级 Tab 面板内容
  function panelDetail() {
    return `
      <div class="tp-block tp-title-row">
        <h3>逐玉</h3>
        <span class="tp-sub">简介 ›</span>
   </div>
      <div class="tp-tags">
        <span class="score">9.7分</span>
        <span class="hot">🔥 27966</span>
 <span class="tag">热搜总榜第1名</span>
    <span class="tag">古装爱情</span>
        <span class="tag">甜虐爱情</span>
      </div>
      <div class="tp-actions">
   ${[
     {i: '👍', t: '推荐'},
      {i: '✔', t: '已追', on: true},
       {i: '⬇', t: '下载'},
      {i: '📺', t: '投屏'},
     {i: '👀', t: '一起看'}
     ].map(a => `
          <div class="tp-action ${a.on ? 'on' : ''}">
        <div class="ic">${a.i}</div>
      <div class="lb">${a.t}</div>
   </div>
 `).join('')}
      </div>
      <div class="tp-section">
      <div class="tp-section-head">
   <b>选集</b>
       <span class="meta">追剧日历 · 更新至19集 · 全40集</span>
    <span class="chev">›</span>
        </div>
        <div class="tp-subtabs">
  <span class="on">剧集</span>
     <span>主创直播</span>
        </div>
      <div class="tp-eps">
          ${[1,2,3,4,5].map(n => {
     const vip = n >= 3;
       const cur = n === 5;
 return `
  <div class="tp-ep ${cur ? 'cur' : ''}">
     ${vip ? '<span class="vip">VIP</span>' : ''}
     <span class="n">${n}</span>
              </div>`;
          }).join('')}
        </div>
      </div>
      <div class="tp-section">
     <div class="tp-section-head">
    <b>精选二创</b>
   <span class="chev">›</span>
    </div>
        <div class="tp-subtabs">
       <span class="on">官方</span><span>解读</span><span>整活</span><span>回味</span>
        </div>
  <div class="tp-ugc-row">
     <div class="tp-ugc"><div class="thumb g1"><span class="dur">01:54</span></div></div>
   <div class="tp-ugc"><div class="thumb g2"><span class="dur">00:24</span></div></div>
 <div class="tp-ugc"><div class="thumb g3"><span class="dur">00:47</span></div></div>
  </div>
      </div>
    `;
  }

  function panelUgc() {
    const items = [
      { t: '谢征x征香 甜蜜瞬间大合集', src: '逐玉官方', v: '128.5万播放', g: 'g1' },
      { t: '张凌赫古装造型帅到犯规', src: '追剧小达人', v: '86.3万播放', g: 'g2' },
 { t: '田曦薇演技炸裂名场面', src: '影视解说', v: '52.1万播放', g: 'g3' },
      { t: '逐玉幕后花絮 笑到肚子疼', src: '娱乐前线', v: '45.8万播放', g: 'g4' }
    ];
    return `
      <div class="tp-subtabs solo">
      <span class="on">最新</span><span>最热</span><span>官方</span><span>UP主</span>
      </div>
      <div class="tp-ugc-list">
    ${items.map(x => `
<div class="tp-ugc-item">
     <div class="thumb ${x.g}"></div>
   <div class="info">
    <div class="t">${x.t}</div>
        <div class="meta">${x.src} · ${x.v}</div>
    </div>
        </div>
        `).join('')}
      </div>
    `;
  }

  function panelDiscuss() {
    const comments = [
      { n: '追剧少女', t: '5分钟前', c: '谢征太会了！这出场方式直接封神，雪地里的画面美得像画一样❄️', l: 2341, r: 156 },
    { n: '古装控', t: '12分钟前', c: '第19集结尾那段剧情绝了，编剧太懂我了，又甜又虐！征香CP锁死了🔒', l: 1876, r: 89 },
      { n: '剧评人老张', t: '30分钟前', c: '从剧情节奏、服化道到演员演技，逐玉都堪称今年古偶天花板。特别是张凌赫对谢征这个角色的诠释，层次分明。', l: 956, r: 234 },
      { n: '小甜甜', t: '1小时前', c: '每天准时追更，已经第三次回刷了哈哈哈，根本停不下来！', l: 567, r: 45 }
 ];
    return `
      <div class="tp-input">
        <span class="ph">说点什么…</span>
        <button class="send-btn">发送</button>
      </div>
    <div class="tp-cmts">
  ${comments.map(c => `
    <div class="tp-cmt">
      <div class="avatar">👤</div>
     <div class="cmt-body">
        <div class="cmt-head"><b>${c.n}</b><span>${c.t}</span></div>
         <div class="cmt-txt">${c.c}</div>
      <div class="cmt-foot"><span>👍 ${c.l}</span><span>💬 ${c.r}</span></div>
     </div>
       </div>
  `).join('')}
      </div>
    `;
  }

  function panelAI(subKey, range) {
    const sub = AI_SUBTABS.find(s => s.key === subKey) || AI_SUBTABS[0];
    return `
      <div class="tp-ai-subtabs">
    ${AI_SUBTABS.map(s => `
          <span class="ai-sub ${s.key === sub.key ? 'on' : ''}" data-sub="${s.key}">
      <i>${s.icon}</i>${s.label}
   </span>
 `).join('')}
   </div>
      <div class="tp-ai-banner">
     <img src="./assets/zhuyu-banner.jpg" alt="逐玉 × AI 懂剧" />
      </div>
  <div class="tp-ai-content">${aiContentBySub(sub.key, range)}</div>
    `;
  }

  function aiContentBySub(k, range) {
    if (k === 'recap') {
      const isAll = range === 'all';
      const acS = isAll ? '回顾第1-4集' : '回顾第4集';

      const main = isAll ? {
     text: '长玉冒雪救下化名"言正"的武安侯谢征后，当银簪求医、藏猪圈躲官兵。大伯多次勾结恶人抢地契未果，长玉招谢征入赘保宅。朝堂上太傅与丞相暗中博弈、各自搜寻武安侯下落，霁州李公子到访差点识破身份。大伯递了状纸，十日后开堂审理宅子归属，谢征主动请缨帮长玉模拟公堂攻防、教她背诵文书。大婚当日宋砚再来捣乱被一脚踩碎泥娃娃，婚礼在众人祝福下顺利礼成。',
      scenes: [
      { th: 's6', ep: '第1集', cap: '长玉在雪地中发现奄奄一息的谢征' },
      { th: 's7', ep: '第4集', cap: '成婚当日长玉和谢征穿喜服行礼' }
       ]
    } : {
   text: '大伯樊大牛真的递了状纸，十日后开堂审理宅子归属。请状师花费不菲，谢主动请缨帮长玉备战公堂——他不仅写得一手好字，还能模拟公堂攻防，教长玉背诵文书要点。无奈长玉识字极少，背得磕磕绊绊，直到在谢征身边睡着。',
   scenes: [
  { th: 's1', ep: '第4集', cap: '谢主动请缨帮长玉备战公堂' },
   { th: 's2', ep: '第4集', cap: '长玉识字极少，背得磕磕绊绊' }
     ]
   };

    const love = isAll ? {
       text: '从救命之恩到假入赘，再到真大婚——二人关系步步推进。长玉曾拉着谢征给"谢征"灵牌上坟，不知情的真诚令他深受触动。宋砚提出纳长玉为妾被羞辱，谢征一把将宋砚甩飞出院子宣示主权，二人当众互亲。谢征暗中赎回银簪想归还，却撞见长玉试穿嫁衣只得退出。新婚之夜二人默契瞒过偷窥的大伯夫妇，距离悄然拉近。',
   scenes: [
      { th: 's8', ep: '第3集', cap: '长玉当着谢征的面给"谢征"牌位上坟' },
      { th: 's3', ep: '第4集', cap: '谢征将宋砚甩飞出院子' }
]
     } : {
        text: '宋砚莫名自信地提出纳长玉为妾以"保住宅子"，被长玉气笑着一顿羞辱。谢征出现稍一使力便将宋砚甩飞出院子，当着众人宣示主权，长玉亲了他一口，他也回亲一口。谢征通过旧部换得银钱，暗中赎回了长玉典当的母亲银簪子，原本想趁机归还，却撞见长玉在房中试穿嫁衣，只得轻咳出声后匆忙退出。新婚之夜二人默契瞒过偷窥的大伯夫妇，从假入赘到真大婚，距离悄然拉近。',
     scenes: [
   { th: 's3', ep: '第4集', cap: '谢征将宋砚甩飞出院子' },
    { th: 's4', ep: '第4集', cap: '成婚当日长玉和谢征穿喜服行礼' }
    ]
   };

const hidden = isAll ? {
    text: '谢征屡次暗中出手却不暴露真实武力：筷子击中金爷膝盖、独自击退抢地契的恶人、甩飞宋砚。他谎称自己是镖师搪塞长玉的疑问。但飞鸽传信联系旧部、所写时文换回二十两银钱——一个"逃难流民"不仅武艺高强还才学过人，破绽越来越多。长玉虽看出他有武功在身，却沉浸在大婚喜悦中，尚未将这些疑点串联起来识破"言正"即武安侯。',
      scenes: [
    { th: 's9', ep: '第2集', cap: '谢征暗中用筷子击中金爷膝盖' },
     { th: 's5', ep: '第4集', cap: '谢征伤口渗血谎称自己是镖师' }
    ]
        } : {
        text: '谢征出手帮赵大叔击退金爷时伤口渗血，谎称自己是镖师有些武力傍身。长玉看他身形，其实早知他有武功在身，但并未深究。此后谢征通过飞鸽传信联系旧部，写的时文让夫子都赞不绝口，赵大叔拿去书肆竟换回了二十两银钱。一个"逃难流民"不仅武艺高强还才学过人，破绽越来越多，但长玉沉浸在大婚的喜悦中，仍未将这些疑点串联起来。',
    scenes: [
        { th: 's5', ep: '第4集', cap: '谢征伤口渗血谎称自己是镖师' }
        ]
    };

  const sceneHtml = (s) => `<div class="ai-scene"><div class="th ${s.th}"></div><div class="ep-badge">${s.ep}</div><span class="scene-play">▶</span><div class="scene-cap">${s.cap}</div></div>`;

    return `
  <div class="ai-card">
     <div class="ai-card-head">
      <span class="ic">📖</span>
      <div>
    <div class="ac-t">前情回顾</div>
     <div class="ac-s">${acS}</div>
       </div>
   </div>
   <div class="ai-ep-context">📺 当前：${WORLD_EPISODES[_worldEp - 1]?.label || '第1-5集'}</div>
   <div class="ai-chips">
       <span class="lb">回顾范围</span>
    <span class="range ${!isAll ? 'on' : ''}" data-range="only">仅第4集</span>
    <span class="range ${isAll ? 'on' : ''}" data-range="all">第1~4集</span>
       </div>

   <div class="ai-summary">
        <div class="ai-sum-head">AI 智能生成摘要</div>
      <div class="ai-tag main"><span class="ai-tag-ic tag-main">📌</span>主线剧情</div>
       <p>${main.text}</p>
      </div>
     <div class="ai-scenes">${main.scenes.map(sceneHtml).join('')}</div>

    <div class="ai-divider"></div>

     <div class="ai-summary emo">
       <div class="ai-tag love"><span class="ai-tag-ic tag-love">♥</span>感情线</div>
       <p>${love.text}</p>
      </div>
      <div class="ai-scenes">${love.scenes.map(sceneHtml).join('')}</div>

     <div class="ai-divider"></div>

     <div class="ai-summary secret">
      <div class="ai-tag secret"><span class="ai-tag-ic tag-secret">🔍</span>身份暗线</div>
<p>${hidden.text}</p>
     </div>
   <div class="ai-scenes ${hidden.scenes.length === 1 ? 'single' : ''}">${hidden.scenes.map(sceneHtml).join('')}</div>
    </div>
   `;
    }
    if (k === 'rel') {
      return renderRelPanel(_worldEp);
    }
    if (k === 'time') {
   // 时间线事件数据：每张卡片的标签类型、标题、详情
   const TL_EVENTS = [
     { id: 'ep1-1', tag: '关键相遇', tagCls: 'tag-key', title: '雪地救下神秘男子',
       detail: '长玉冒雪归家途中，发现一个奄奄一息的男子，此人手握与母亲遗物一模一样的玉簪，长玉视为天意将他背回家中。' },
     { id: 'ep2-1', tag: '转折',    tagCls: 'tag-turn', title: '言正答应入赘',
       detail: '为保住宅子，长玉需要招赘。谢征听到她与猪的自言自语后心领神会，主动答应入赘樊家。' },
     { id: 'ep3-1', tag: '名场面',  tagCls: 'tag-scene', title: '给"谢征"上坟（名场面）',
       detail: '长玉在雪地写字无意写出"谢征"二字，更当面拉着真正的谢征给"谢征"灵牌上香跪拜——她不知身旁之人就是武安侯本人。' },
     { id: 'ep4-1', tag: '温情',    tagCls: 'tag-warm', title: '暗中赎回银簪 + 大婚礼成',
       detail: '谢征通过旧部换得银钱，暗中赎回长玉典当的母亲银簪。大婚在西固巷众人祝福下顺利礼成。' },
     { id: 'ep5-1', tag: '名场面',  tagCls: 'tag-scene', title: '新婚夜合演"圆房"戏',
       detail: '为瞒过偷窥的大伯夫妇，长玉和谢征默契配合，用烛影映窗演了一出假圆房戏码。' },
     { id: 'ep5-2', tag: '伏笔回收',tagCls: 'tag-recall',title: '谢征归还银簪',
       detail: '长玉去当铺赎簪却得知已被人买走，十分伤心。谢征拿出银簪半真半假地归还，长玉破涕为笑。' },
     { id: 'ep5-3', tag: '冲突',    tagCls: 'tag-conflict',title: '宋家清算旧账',
       detail: '宋吴氏要求归还聘书，谢征拿出长玉家历年给宋家的钱物明细，村民一致声讨。崔千金出面想羞辱长玉，却被长玉大方化解。' }
   ];

   // EP 分组定义
   const TL_GROUPS = [
     { ep: '01', title: '初遇', events: ['ep1-1'] },
     { ep: '02', title: '入赘', events: ['ep2-1'] },
     { ep: '03', title: '上坟', events: ['ep3-1'] },
     { ep: '04', title: '大婚', events: ['ep4-1'] },
     { ep: '05', title: '还馨', events: ['ep5-1', 'ep5-2', 'ep5-3'] }
   ];

   const eventMap = {};
   TL_EVENTS.forEach(e => eventMap[e.id] = e);

   return `
     <div class="ai-card">
       <div class="ai-card-head">
         <span class="ic">🕒</span>
         <div>
           <div class="ac-t">时间线</div>
           <div class="ac-s">第1-5集 · 7个关键节点</div>
         </div>
       </div>

       <!-- 主时间线 -->
       <div class="ai-timeline">
         ${TL_GROUPS.map(g => `
         <div class="tl-group">
           <div class="tl-ep"><span class="ep-badge">EP${g.ep}</span><span class="ep-title">${g.title}</span></div>
           <div class="tl-events">
             ${g.events.map(eid => {
               const e = eventMap[eid];
               return `
             <div class="tl-card ${e.tagCls}" data-tl="${eid}">
               <span class="tl-tag ${e.tagCls}">${e.tag}</span>
               <div class="tl-card-body">
                 <span class="tl-title">${e.title}</span>
                 <span class="tl-arrow">▽</span>
               </div>
               <div class="tl-detail">${e.detail}</div>
             </div>`;
             }).join('')}
           </div>
         </div>`).join('')}
       </div><!-- end ai-timeline -->

       <!-- 伏笔追踪 -->
       <div class="foreshadow-section">
         <div class="fs-head">
           <span class="fs-icon">✦</span>
           <span class="fs-title">伏笔追踪</span>
           <span class="fs-count">1/4 已回收</span>
         </div>
         <div class="fs-list">

           <div class="fs-card fs-active">
             <div class="fs-icon-wrap"><span class="fs-status-icon si-search">🔍</span></div>
             <div class="fs-info">
               <div class="fs-name">谢征的真实身份</div>
               <div class="fs-meta">EP01 埋下</div>
               <div class="fs-desc">长玉仍未将种种疑点串联识破</div>
             </div>
             <span class="fs-status tag-active">进行中</span>
           </div>

           <div class="fs-card fs-locked">
             <div class="fs-icon-wrap"><span class="fs-status-icon si-lock">🔒</span></div>
             <div class="fs-info">
               <div class="fs-name">朝堂搜寻武安侯</div>
               <div class="fs-meta">EP03 埋下</div>
               <div class="fs-desc">公孙鄞收到谢征飞鸟传信</div>
             </div>
             <span class="fs-status tag-locked">未揭晓</span>
           </div>

           <div class="fs-card fs-locked">
             <div class="fs-icon-wrap"><span class="fs-status-icon si-lock">🔒</span></div>
             <div class="fs-info">
               <div class="fs-name">玉簪子的秘密</div>
               <div class="fs-meta">EP01 埋下</div>
               <div class="fs-desc">尚未揭晓</div>
             </div>
             <span class="fs-status tag-locked">未揭晓</span>
           </div>

           <div class="fs-card fs-done">
             <div class="fs-icon-wrap"><span class="fs-status-icon si-check">✅</span></div>
             <div class="fs-info">
               <div class="fs-name">母亲的银簪子</div>
               <div class="fs-meta">EP01 埋下 → <span class="fs-recall-ep">EP05 回收</span></div>
               <div class="fs-desc">谢征归还银簪，长玉破涕为笑</div>
             </div>
             <span class="fs-status tag-done">已回收</span>
           </div>

         </div>
       </div>

     </div>
   `;
 }
    if (k === 'world') {
      return renderWorldPanel(_worldEp - 1);
    }
    if (k === 'faq') {
      const faqItems = [
        { q: '樊长玉的武功是跟谁学的？', a: '樊长玉的武功是跟父亲樊二牛学的。她父亲教她"长柄刀法"，嘱咐她不能轻易示人。第2集中长玉仅靠一根棍子就把金爷的手下打得屁滚尿流，言正在楼上看到她一套棍法使得行云流水。不过她父亲为什么一个杀猪屠户会这套精妙刀法，这里面藏着很大的秘密。' },
        { q: '谢征为什么愿意入赘樊家？', a: '主要有两个原因：一是报恩，长玉在雪地里救了他一命，还当掉母亲的银簪子为他治伤；二是对长玉动心了。第2集中长玉想提入赘的事却不好意思开口，谢征听到她跟猪"诉苦"才知道这件事，于是主动答应入赘，帮她保住宅子不被大伯夺走。' },
        { q: '新婚夜泼水那段是怎么回事？', a: '第5集中，长玉不小心把赵大娘送的"画本"丢出窗外，砸中了偷听的大伯和大伯母。为了不让他们发现是假成婚，谢征让长玉把蜡烛放侧边，把两人的影子映在窗户上，然后长玉帮他擦汗、扶他躺下、吹灭蜡烛——演了一出"假圆房"的戏。大伯娘还想翻墙来看，长玉出来故意往他们那边泼水，大伯娘尝了味道后信以为真，以为两人圆房了。' },
        { q: '两把一模一样的玉簪子有什么含义？', a: '第1集中，长玉在雪地救下谢征时，发现他手中有一把玉簪子，跟她母亲的玉簪子一模一样。长玉觉得这是母亲在天之灵让她救这个人，是一种"宿命般的缘分"。这两把簪子的来历和关联，暗示着樊家与谢征之间可能有更深的渊源。' },
        { q: '谢征的银簪子是怎么赎回来的？', a: '长玉为了救谢征，把母亲的银簪子当掉换了两二银子。第4集中，谢征通过传讯鸟联络亲信五七，特意写了一篇时文让赵大叔拿去四季书肆，换得二十两银子，偷偷把银簪子赎了回来。第5集中，他半真半假地跟长玉说是书肆老板赏识他的时文，送了簪子和二十两给他，长玉信以为真，开心地收下了簪子。' }
      ];
      const faqHtml = faqItems.map((item, i) => `
        <div class="faq-item" data-faq="${i}">
          <div class="faq-item-head">
            <span class="faq-num">${i + 1}</span>
            <span class="faq-q-text">${item.q}</span>
            <span class="faq-arrow">›</span>
          </div>
          <div class="faq-answer">${item.a}</div>
        </div>
      `).join('');
      return `
   <div class="ai-card">
  <div class="ai-card-head">
       <span class="ic">💬</span>
 <div>
    <div class="ac-t">常问问题</div>
     <div class="ac-s">AI 智能解答</div>
   </div>
     </div>
   <div class="ai-ep-context">📺 当前：${WORLD_EPISODES[_worldEp - 1]?.label || '第1-5集'}</div>
    <div class="ai-faq">${faqHtml}</div>
     </div>
      `;
    }
    return '';
  }

  function panelByKey(tab, sub, range) {
    if (tab === 'detail') return panelDetail();
    if (tab === 'ugc') return panelUgc();
    if (tab === 'discuss') return panelDiscuss();
    if (tab === 'ai') return panelAI(sub, range);
    return '';
  }

  // 生成一台完整播放器
  function buildPhone(defaultTab, defaultSub) {
    const wrap = document.createElement('div');
    wrap.className = 'phone-wrap';
    wrap.innerHTML = `
      <div class="phone">
     <div class="phone-notch"></div>
      <div class="phone-screen">
      <div class="tp">
     <div class="tp-video">
      <div class="tp-status">
     <span>9:41</span>
       <span class="right">●●● 📶 🔋</span>
      </div>
    <div class="tp-danmu">
   <span class="dm d1">男女主初遇名场面</span>
  <span class="dm d2">这段配乐绝了</span>
 <span class="dm d3">这雪景也太美了吧！</span>
      </div>
  <div class="tp-mark">腾讯视频</div>
     </div>
  <div class="tp-tabs">
      ${TABS.map(t => `
     <span class="tp-tab ${t.key === defaultTab ? 'on' : ''}" data-tab="${t.key}">
   ${t.label}${t.badge ? `<sup>${t.badge}</sup>` : ''}
       </span>
   `).join('')}
    </div>
     <div class="tp-panel" data-panel>${panelByKey(defaultTab, defaultSub, 'only')}</div>
       </div>
     <div class="tp-fab" data-fab style="display:${defaultTab === 'ai' ? 'flex' : 'none'}"><img src="./assets/penguin-fab.png" alt="懂剧助手" /></div>
     <div class="tp-chat" data-chat>
       <div class="ai-assist-card">
         <div class="ai-assist-head">
           <span class="ai-assist-title">AI 懂剧助手</span>
           <span class="ai-assist-badge">BETA</span>
           <button class="ai-assist-close" data-chat-close>×</button>
         </div>
         <div class="ai-assist-body" data-chat-body>
           <div class="ai-assist-welcome">
             <div class="ai-assist-avatar"><img src="./assets/penguin-fab.png" alt="" /></div>
             <div class="ai-assist-msg">
               你好呀！我是 AI 懂剧助手 🎬<br>有什么关于剧情的问题都可以问我哦。
               <div class="ai-assist-note">📌 仅根据你看过的剧集作答</div>
             </div>
           </div>
           <div class="ai-assist-suggests">
             <button class="ai-assist-sug" data-q="谢征为什么愿意入赘？">谢征为什么愿意入赘？</button>
             <button class="ai-assist-sug" data-q="新婚夜泼水那段是怎么回事？">新婚夜泼水那段是怎么回事？</button>
             <button class="ai-assist-sug" data-q="谢征的银簪子是怎么赎回来的？">谢征的银簪子是怎么赎回来的？</button>
           </div>
         </div>
         <div class="ai-assist-foot">
           <input class="ai-assist-input" data-chat-input placeholder="想问什么剧情？" />
           <button class="ai-assist-send" data-chat-send>↑</button>
         </div>
       </div>
     </div>
 </div>
     <div class="phone-home"></div>
</div>
    `;

    // 一级 Tab 切换
    const panelEl = wrap.querySelector('[data-panel]');
    const fabEl = wrap.querySelector('[data-fab]');
    const chatEl = wrap.querySelector('[data-chat]');
    const state = { tab: defaultTab, sub: defaultSub || 'recap', range: 'only' };
    wrap.querySelectorAll('.tp-tab').forEach(t => {
    t.addEventListener('click', () => {
   wrap.querySelectorAll('.tp-tab').forEach(x => x.classList.remove('on'));
   t.classList.add('on');
   state.tab = t.dataset.tab;
   panelEl.innerHTML = panelByKey(state.tab, state.sub, state.range);
    fabEl.style.display = state.tab === 'ai' ? 'flex' : 'none';
    if (chatEl) chatEl.classList.remove('open');
    bindSubTabs();
     bindRangeChips();
   bindRelCards();
     bindWorldZoom(panelEl);
     panelEl.scrollTop = 0;
 });
 });
    // AI 二级 Tab 切换（每次重渲染都要重绑）
    function bindSubTabs() {
  panelEl.querySelectorAll('.ai-sub').forEach(s => {
s.addEventListener('click', () => {
     state.sub = s.dataset.sub;
 panelEl.innerHTML = panelByKey(state.tab, state.sub, state.range);
     bindSubTabs();
       bindRangeChips();
   bindRelCards();
     bindWorldZoom(panelEl);
      panelEl.scrollTop = 0;
      });
    });
    }
    // 回顾范围 chip 切换（仅第4集 / 第1~4集）
    function bindRangeChips() {
      panelEl.querySelectorAll('.ai-chips .range').forEach(c => {
 c.addEventListener('click', () => {
 state.range = c.dataset.range;
panelEl.innerHTML = panelByKey(state.tab, state.sub, state.range);
 bindSubTabs();
        bindRangeChips();
     bindRelCards();
   bindWorldZoom(panelEl);
   panelEl.scrollTop = 0;
     });
    });
    }

    // 人物关系 —— 点击角色打开详情，点 × 关闭 + 缩放控制
    function bindRelCards() {
      const charsScript = panelEl.querySelector('[data-chars]');
    if (!charsScript) return;
   const CHARS = JSON.parse(charsScript.textContent);
   const sheet = panelEl.querySelector('[data-sheet]');
      const inner = panelEl.querySelector('[data-sheet-inner]');
      const factionCls = { '正派': 'fac-good', '反派': 'fac-bad', '中立': 'fac-mid' };
     const imgTag = (id, cls) => { const s = (CHARS[id]||{}).img; return s ? `<img src="${s}" class="rel-avatar ${cls}" alt="${CHARS[id]?.name||id}"/>` : `<div class="rel-avatar ${cls}"></div>`; };

      // ---- 缩放功能 ----
      const svg = panelEl.querySelector('#relSvg');
      let zoom = 1;
      if (svg) {
        svg.style.transformOrigin = 'center center';
        panelEl.querySelectorAll('.z-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            const action = btn.dataset.zoom;
            if (action === 'in') zoom = Math.min(2, zoom + 0.25);
            else if (action === 'out') zoom = Math.max(0.5, zoom - 0.25);
            else if (action === 'full') zoom = 1;
            svg.style.transform = `scale(${zoom})`;
          });
        });
      }

      // ---- 角色详情弹层 ----
    function openChar(id) {
     const ch = CHARS[id];
     if (!ch) return;
       const rels = (ch.rels || []).map(r => {
        const target = CHARS[r.id];
      if (!target) return '';
   return `
    <div class="sheet-rel" data-char="${r.id}">
         ${imgTag(r.id, 'sm')}
   <div class="rel-r-name">${target.name}</div>
  <span class="rel-r-tag t-${r.type}">${r.label}</span>
      </div>
   `;
     }).join('');
        inner.innerHTML = `
       <div class="sheet-handle"></div>
    <button class="sheet-close" data-close>×</button>
     <div class="sheet-head ${factionCls[ch.faction]}">
       ${imgTag(id, 'lg')}
       <div class="sheet-h-info">
   <div class="sheet-name">${ch.name}<span class="fac ${factionCls[ch.faction]}">${ch.faction}</span></div>
      <div class="sheet-title ${factionCls[ch.faction]}">「${ch.subtitle}」</div>
       <div class="sheet-actor">饰演：${ch.actor}</div>
      </div>
       </div>
     <div class="sheet-desc">${ch.desc}</div>
        <div class="sheet-rel-title">🔗 人物关系</div>
      <div class="sheet-rels">${rels}</div>
      `;
    sheet.hidden = false;
      requestAnimationFrame(() => sheet.classList.add('open'));
  }
    function close() {
        sheet.classList.remove('open');
        setTimeout(() => { sheet.hidden = true; inner.innerHTML = ''; }, 260);
      }
sheet.addEventListener('click', (e) => {
     if (e.target === sheet) close();
    });

 // 使用事件委托：即使 DOM 重渲染也不会丢失点击
 if (!panelEl._relDelegated) {
   panelEl._relDelegated = true;
   panelEl.addEventListener('click', (e) => {
     const chip = e.target.closest('.rel-chip[data-char]');
     const node = e.target.closest('.rel-canvas .node-pos[data-char]');
     const sheetRel = e.target.closest('.sheet-rel[data-char]');
     const closeBtn = e.target.closest('[data-close]');
     const target = chip || node || sheetRel;
     if (target) {
       e.stopPropagation();
       openChar(target.dataset.char);
     } else if (closeBtn) {
       close();
     }
   });
 }
   }
    // 保存状态供外部切换使用
    wrap._tpState = state;
    wrap._panelEl = panelEl;
    bindSubTabs();
    bindRangeChips();
    bindRelCards();
    bindWorldZoom(panelEl);

    // FAQ 展开答案 / 时间线卡片展开收起 —— 无条件绑定一次（不依赖关系图数据是否加载）
    if (!panelEl._genDelegated) {
      panelEl._genDelegated = true;
      panelEl.addEventListener('click', (e) => {
        const faqItem = e.target.closest('.faq-item[data-faq]');
        if (faqItem) {
          faqItem.classList.toggle('expanded');
          return;
        }
        const tlCard = e.target.closest('.tl-card[data-tl]');
        if (tlCard) {
          tlCard.classList.toggle('expanded');
        }
      });
    }

    // 8. 手机内 AI 懂剧助手：企鹅入口 → 弹半层聊天窗
    (function initPhoneAssist() {
      const fab = wrap.querySelector('[data-fab]');
      const chat = wrap.querySelector('[data-chat]');
      const body = wrap.querySelector('[data-chat-body]');
      const input = wrap.querySelector('[data-chat-input]');
      const sendBtn = wrap.querySelector('[data-chat-send]');
      const closeBtn = wrap.querySelector('[data-chat-close]');
      if (!fab || !chat) return;

      function openChat() { chat.classList.add('open'); setTimeout(() => input.focus(), 300); }
      function closeChat() { chat.classList.remove('open'); }

      fab.addEventListener('click', openChat);
      closeBtn.addEventListener('click', closeChat);
      chat.addEventListener('click', (e) => { if (e.target === chat) closeChat(); });

      // 快捷问题 → 用户气泡 + AI 回复
      body.addEventListener('click', (e) => {
        const sug = e.target.closest('.ai-assist-sug');
        if (!sug) return;
        const q = sug.dataset.q || sug.textContent.trim();
        appendUserQ(q);
        simulateReply(q);
      });

      function doSend() {
        const q = input.value.trim();
        if (!q) return;
        input.value = '';
        appendUserQ(q);
        simulateReply(q);
      }
      sendBtn.addEventListener('click', doSend);
      input.addEventListener('keydown', (e) => { if (e.key === 'Enter') doSend(); });

      function appendUserQ(text) {
        const div = document.createElement('div');
        div.className = 'ai-assist-user-q';
        div.innerHTML = `<div class="ai-assist-user-bubble">${text}</div>`;
        body.appendChild(div);
        body.scrollTop = body.scrollHeight;
      }

      const FAQ_MAP = {
        '谢征为什么愿意入赘？': '主要有两个原因：一是报恩，长玉在雪地里救了他一命，还当掉母亲的银簪子为他治伤；二是对长玉动心了。第2集中长玉想提入赘的事却不好意思开口，谢征听到她跟猪"诉苦"才知道这件事，于是主动答应入赘，帮她保住宅子不被大伯夺走。',
        '新婚夜泼水那段是怎么回事？': '第5集中，长玉不小心把赵大娘送的"画本"丢出窗外，砸中了偷听的大伯和大伯母。为了不让他们发现是假成婚，谢征让长玉把蜡烛放侧边，把两人的影子映在窗户上——演了一出"假圆房"的戏。大伯娘还想翻墙来看，长玉出来故意往他们那边泼水，大伯娘尝了味道后信以为真！',
        '谢征的银簪子是怎么赎回来的？': '长玉为了救谢征，把母亲的银簪子当掉换了二两银子。第4集中，谢征通过传讯鸟联络亲信五七，特意写了一篇时文让赵大叔拿去四季书肆，换得二十两银子，偷偷把银簪子赎了回来。第5集他半真半假地跟长玉说是书肆老板赏识他的时文，送了簪子和二十两给他，长玉信以为真～',
        '樊长玉的武功是跟谁学的？': '樊长玉的武功是跟父亲樊二牛学的。她父亲教她"长柄刀法"，嘱咐她不能轻易示人。第2集中长玉仅靠一根棍子就把金爷的手下打得屁滚尿流！不过她父亲为什么一个杀猪屠户会这套精妙刀法，这里面藏着很大的秘密哦。',
        '两把一模一样的玉簪子有什么含义？': '第1集中，长玉在雪地救下谢征时，发现他手中有一把玉簪子，跟她母亲的玉簪子一模一样。长玉觉得这是母亲在天之灵让她救这个人，是一种"宿命般的缘分"。这两把簪子的来历和关联，暗示着樊家与谢征之间可能有更深的渊源呢。'
      };

      function simulateReply(q) {
        let answer = '';
        for (const [k, v] of Object.entries(FAQ_MAP)) {
          if (q.includes(k) || k.includes(q)) { answer = v; break; }
        }
        if (!answer) {
          answer = `关于"${q}"这个问题，我需要结合更多剧集内容来回答你～目前我已经看完了前5集的剧情，你可以试试问一些关于人物关系、关键情节或者伏笔的问题，我会尽力帮你解答！`;
        }
        setTimeout(() => {
          const div = document.createElement('div');
          div.className = 'ai-assist-reply';
          div.innerHTML = `
            <div class="ai-assist-avatar"><img src="./assets/penguin-fab.png" alt="" /></div>
            <div class="ai-assist-msg">${answer}</div>`;
          body.appendChild(div);
          body.scrollTop = body.scrollHeight;
        }, 500 + Math.random() * 400);
      }
    })();

    return wrap;
  }

  /* ================= 主流程 ================= */
  // 1. 生成 6 台手机
  sections.forEach((sec) => {
    const mount = sec.querySelector('.phone-mount');
    if (!mount) return;
    const defaultTab = sec.dataset.defaultTab || 'detail';
    const defaultSub = sec.dataset.defaultSub || 'recap';
    mount.appendChild(buildPhone(defaultTab, defaultSub));
  });

  // 2. 生成左侧导航
  sections.forEach((sec, idx) => {
    const li = document.createElement('li');
    li.textContent = sec.dataset.title || `第 ${idx + 1} 页`;
    li.dataset.index = idx;
    li.addEventListener('click', () => {
      sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    navListEl.appendChild(li);
  });
  const navItems = Array.from(navListEl.querySelectorAll('li'));

  // 3. 页面高亮 + 入场动画
  const io = new IntersectionObserver(
    (entries) => {
    entries.forEach((entry) => {
const idx = Number(entry.target.dataset.index);
        if (entry.isIntersecting && entry.intersectionRatio >= 0.55) {
   entry.target.classList.add('in-view');
 navItems.forEach((n) => n.classList.remove('active'));
    const cur = navItems[idx];
  if (cur) cur.classList.add('active');
        }
   });
 },
    { root: pagesEl, threshold: [0.55, 0.75] }
  );
  sections.forEach((s) => io.observe(s));

  // 4. 键盘翻页
  let scrolling = false;
  function goTo(idx) {
    if (idx < 0 || idx >= sections.length) return;
    scrolling = true;
    sections[idx].scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => (scrolling = false), 700);
  }
  function currentIndex() {
    return Math.round(pagesEl.scrollTop / window.innerHeight);
  }
  window.addEventListener('keydown', (e) => {
    if (scrolling) return;
    if (e.key === 'ArrowDown' || e.key === 'PageDown') {
    e.preventDefault(); goTo(currentIndex() + 1);
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      e.preventDefault(); goTo(currentIndex() - 1);
    } else if (e.key === 'Home') { goTo(0); }
    else if (e.key === 'End') { goTo(sections.length - 1); }
  });

  // 5. 首屏动画
  window.addEventListener('load', () => {
    sections[0].classList.add('in-view');
    navItems[0].classList.add('active');
  });

  // 6. 外部集数 Tab 切换（所有页面的 .wl-ep-tabs 共享同一全局集数）
  document.querySelectorAll('.wl-ep-tabs').forEach(group => {
    group.querySelectorAll('.wl-ep-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const ep = parseInt(tab.dataset.ep);
        setWorldEp(ep);
      });
    });
  });

})();
