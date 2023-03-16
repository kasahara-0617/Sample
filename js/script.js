/* --------------------------------
* head内の書き換え
* -------------------------------- */
const replaceHeadTags = target => {
  const head = document.head;
  const targetHead = target.html.match(/<head[^>]*>([\s\S.]*)<\/head>/i)[0];
  const newPageHead = document.createElement('head');
  newPageHead.innerHTML = targetHead;

  const removeHeadTags = [
    "meta[name='keywords']",
    "meta[name='description']",
    "meta[property^='fb']",
    "meta[property^='og']",
    "meta[name^='twitter']",
    "meta[name='robots']",
    'meta[itemprop]',
    'link[itemprop]',
    "link[rel='prev']",
    "link[rel='next']",
    "link[rel='canonical']"
  ].join(',');

  const headTags = [...head.querySelectorAll(removeHeadTags)];
  headTags.forEach(item => {
    head.removeChild(item);
  });
  const newHeadTags = [...newPageHead.querySelectorAll(removeHeadTags)];
  newHeadTags.forEach(item => {
    head.appendChild(item);
  });
};

// Googleアナリティクスに情報を送る
barba.hooks.after(() => {
  ga('set', 'page', window.location.pathname);
  ga('send', 'pageview');
});


/* --------------------------------
* gsap
* -------------------------------- */
// 引数の分だけ処理を遅らせる
function delay(n) {
  n = n || 2000;
  return new Promise((done) => {
    setTimeout(() => {
      done();
    }, n);
  });
}

// 目隠しのアニメーション
function pageTransition() {
  const blindfold = document.querySelector('.blindfold');
  const tl = gsap.timeline();
  tl.to(blindfold, {
    duration: 0.8,
    y: '-100%',
    ease: 'Expo.easeInOut'
  });
  tl.to(blindfold, {
    duration: 1.2,
    y: '-200%',
    ease: 'Expo.easeInOut'
  });
  tl.to(blindfold, {
    duration: 0,
    y: 0
  });
}

// ページを離れる時の上に消える動作
function leaveAnimation() {
  const tl = gsap.timeline();
  tl.to('.container', {
    duration: 1,
    y: -50,
    opacity: 0,
    ease: 'Quart.easeOut'
  });
}

// ページに入った時の下から出てくる動作
function enterAnimation() {
  const tl = gsap.timeline();
  tl.from('.container', {
    duration: 1,
    y: 50,
    opacity: 0,
    ease: 'Quart.easeOut'
  });
}


/* --------------------------------
* barba
* -------------------------------- */
barba.init({
  sync: true,
  transitions: [
    {
      // ページを離れる時に実行される処理
      async leave() {
        const done = this.async();
        leaveAnimation();
        pageTransition();
        await delay(1000);
        done();
      },

      // headを書き換える
      beforeEnter({ next }) {
        replaceHeadTags(next);
      },

      // ページに入った時に実行される処理
      async enter() {
        await delay(600);
        enterAnimation();
      }
    }
  ],

  // aboutページに入ったらクラスを付与
  views: [
    {
      namespace: 'about',
      beforeEnter() {
        document.querySelector('#main').classList.add('active');
      },
      afterLeave() {
        document.querySelector('#main').classList.remove('active');
      }
    }
  ]
})
