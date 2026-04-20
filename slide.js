/**
 * slide.js
 * - .outline-3 > h3 の sticky top を h2 の実測高さに設定
 * - scroll-margin-top を要素種別ごとに設定：
 *     .outline-3 → h2の高さ
 *     .outline-4  → h2の高さ + h3の高さ
 * ResizeObserver でリサイズにも追従する。
 */

function updateTops() {
  document.querySelectorAll('.outline-2').forEach(outline2 => {
    const h2 = outline2.querySelector(':scope > h2');
    if (!h2) return;
    const h2Height = h2.getBoundingClientRect().height;

    outline2.querySelectorAll(':scope > .outline-3').forEach(outline3 => {
      const h3 = outline3.querySelector(':scope > h3');
      if (!h3) return;

      h3.style.top = h2Height + 'px';
      outline3.style.scrollMarginTop = h2Height + 'px';

      const h3Height = h3.getBoundingClientRect().height;

      outline3.querySelectorAll(':scope > .outline-4').forEach(outline4 => {
        outline4.style.scrollMarginTop = (h2Height + h3Height) + 'px';
      });
    });
  });
}

updateTops();

// header内のemailのmailtoリンクを外す
document.querySelectorAll('header .email a').forEach(a => {
  a.replaceWith(a.textContent);
});

// ============================================================
// 表ポップアップ
// ============================================================
const tableOverlay = document.createElement('div');
tableOverlay.className = 'table-overlay';
document.body.appendChild(tableOverlay);

document.querySelectorAll('table').forEach(table => {
    table.addEventListener('click', () => {
        const clone = table.cloneNode(true);
        tableOverlay.innerHTML = '';
        tableOverlay.appendChild(clone);
        tableOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
});

function closeTableOverlay() {
    tableOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

tableOverlay.addEventListener('click', e => {
    if (e.target === tableOverlay) closeTableOverlay();
});

// ============================================================
// 動画ポップアップ
// ============================================================
const videoOverlay = document.createElement('div');
videoOverlay.className = 'video-overlay';
document.body.appendChild(videoOverlay);

document.querySelectorAll('figure video').forEach(video => {
    video.removeAttribute('controls');

    video.parentElement.addEventListener('click', () => {
        const overlayVideo = document.createElement('video');
        overlayVideo.src = video.querySelector('source')?.src || video.src;
        overlayVideo.controls = true;
        overlayVideo.autoplay = true;
        overlayVideo.addEventListener('ended', closeVideoOverlay);
        videoOverlay.innerHTML = '';
        videoOverlay.appendChild(overlayVideo);
        videoOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
});

function closeVideoOverlay() {
    const v = videoOverlay.querySelector('video');
    if (v) { v.pause(); v.src = ''; }
    videoOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

videoOverlay.addEventListener('click', e => {
    if (e.target === videoOverlay) closeVideoOverlay();
});

// ============================================================
// iframeポップアップ
// ============================================================
const iframeOverlay = document.createElement('div');
iframeOverlay.className = 'iframe-overlay';
document.body.appendChild(iframeOverlay);

document.querySelectorAll('figure iframe').forEach(iframe => {
    iframe.parentElement.addEventListener('click', () => {
        const overlayIframe = document.createElement('iframe');
        overlayIframe.src = iframe.src;
        iframeOverlay.innerHTML = '';
        iframeOverlay.appendChild(overlayIframe);
        iframeOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
});

function closeIframeOverlay() {
    const f = iframeOverlay.querySelector('iframe');
    if (f) f.src = '';
    iframeOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

iframeOverlay.addEventListener('click', e => {
    if (e.target === iframeOverlay) closeIframeOverlay();
});

// ============================================================
// 図ポップアップ
// ============================================================
const figOverlay = document.createElement('div');
figOverlay.className = 'figure-overlay';
document.body.appendChild(figOverlay);

document.querySelectorAll('figure img').forEach(img => {
    img.parentElement.addEventListener('click', () => {
        const clone = img.cloneNode();
        clone.style.width = '';
        figOverlay.innerHTML = '';
        figOverlay.appendChild(clone);
        figOverlay.classList.add('active');
    });
});

figOverlay.addEventListener('click', () => {
    figOverlay.classList.remove('active');
});

// ============================================================
// Escキーで全オーバーレイを閉じる
// ============================================================
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        closeTableOverlay();
        closeVideoOverlay();
        closeIframeOverlay();
        figOverlay.classList.remove('active');
    }
});

// リサイズのたびに再計算
const ro = new ResizeObserver(() => updateTops());
ro.observe(document.body);


// ============================================================
// 目次
// ============================================================
const tocButton = document.createElement('button');
tocButton.id = 'toc-button';
tocButton.textContent = '≡';
document.body.appendChild(tocButton);

const tocPanel = document.createElement('div');
tocPanel.id = 'toc-panel';
document.body.appendChild(tocPanel);

// h2・h3を拾ってリンク生成
const titleLink = document.createElement('a');
titleLink.textContent = 'タイトルページ';
titleLink.href = '#';
titleLink.className = 'toc-h2';
titleLink.addEventListener('click', e => {
    e.preventDefault();
    document.querySelector('header').scrollIntoView({ behavior: 'smooth' });
    tocPanel.classList.remove('active');
});
tocPanel.appendChild(titleLink);

document.querySelectorAll('.outline-2 > h2, .outline-3 > h3').forEach(h => {
    const a = document.createElement('a');
    a.textContent = h.textContent.trim();
    a.href = '#' + (h.closest('.outline-2, .outline-3').id || '');
    a.className = h.tagName === 'H2' ? 'toc-h2' : 'toc-h3';
    a.addEventListener('click', () => {
        h.scrollIntoView({ behavior: 'smooth' });
        tocPanel.classList.remove('active');
    });
    tocPanel.appendChild(a);
});

tocButton.addEventListener('click', () => {
    tocPanel.classList.toggle('active');
});

// パネル外クリックで閉じる
document.addEventListener('click', e => {
    if (!tocPanel.contains(e.target) && e.target !== tocButton) {
        tocPanel.classList.remove('active');
    }
});
