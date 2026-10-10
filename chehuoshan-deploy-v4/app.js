'use strict';
// 将真实方言录音放到此固定路径即可启用，无需修改程序。
// 页面加载时不请求音频，点击“方言发音”后才加载。
const DIALECT_AUDIO_URL = 'assets/audio/chehuoshan.mp3';
const poster = document.getElementById('poster');
const lightning = document.getElementById('lightning');
const figure = document.getElementById('figure');
const horse = document.getElementById('horse');
const lightningBtn = document.getElementById('lightningBtn');
const voiceBtn = document.getElementById('voiceBtn');
const status = document.getElementById('status');
const words = ['wordChe', 'wordHuo', 'wordShan'].map(id => document.getElementById(id));
const apples = ['appleOne', 'appleTwo'].map(id => document.getElementById(id));
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let animations = [], endTimer, toastTimer;
let dialect = null;
function notify(message) {
  clearTimeout(toastTimer);
  status.textContent = message;
  status.classList.add('visible');
  toastTimer = setTimeout(() => status.classList.remove('visible'), 2400);
}
function animate(element, frames, options) {
  const animation = element.animate(frames, options);
  animations.push(animation);
  return animation;
}
function resetMotion() {
  clearTimeout(endTimer);
  animations.forEach(animation => animation.cancel());
  animations = [];
  poster.classList.remove('is-striking');
  lightningBtn.classList.remove('is-pressed');
  lightningBtn.removeAttribute('aria-busy');
}
function triggerLightning() {
  resetMotion();
  poster.classList.add('is-striking');
  lightningBtn.classList.add('is-pressed');
  lightningBtn.setAttribute('aria-busy', 'true');
  revealWords(reducedMotion.matches);
  if (reducedMotion.matches) {
    apples.forEach((apple, i) => animate(apple, [{opacity:.3},{opacity:1}], {duration:450,delay:300+i*160,fill:'both'}));
    animate(lightning, [{opacity:.55}, {opacity:1}, {opacity:.88}], {duration:700});
    notify('扯火闪！人物和马吓了一跳，苹果散落了。');
    endTimer = setTimeout(resetMotion, 1250);
    return;
  }
  spillApples();
  // Reveal from the cloud downward, then let the glow decay. No full-screen strobe.
  animate(lightning, [
    {clipPath:'inset(0 0 100% 0)',opacity:0,filter:'brightness(1)',offset:0},
    {clipPath:'inset(0 0 75% 0)',opacity:1,filter:'brightness(1.2)',offset:.07},
    {clipPath:'inset(0)',opacity:1,filter:'brightness(1.25) drop-shadow(0 0 5px #fff0ba)',offset:.19},
    {clipPath:'inset(0)',opacity:1,filter:'brightness(1.12) drop-shadow(0 0 2px #fff0ba)',offset:.48},
    {clipPath:'inset(0)',opacity:.88,filter:'brightness(1)',offset:1}
  ], {duration:1700,easing:'linear'});
  animate(document.getElementById('strikeLight'), [{opacity:0},{opacity:.7,offset:.3},{opacity:0}], {duration:1000,delay:130});
  animate(document.querySelector('.cloud-main'), [
    {transform:'translate(0,0)'},{transform:'translate(-1%,.5%) rotate(-1deg)'},
    {transform:'translate(1%,-.5%) rotate(1deg)'},{transform:'translate(0,0)'}
  ], {duration:650,easing:'ease-in-out'});
  animate(figure, [
    {transform:'translate(0,0) rotate(0) scale(1)',offset:0},
    {transform:'translate(-.6%,.8%) rotate(-1deg) scale(1.005,.98)',offset:.08},
    {transform:'translate(-1.5%,-2.4%) rotate(-3.2deg) scale(1.015)',offset:.22},
    {transform:'translate(.9%,-1%) rotate(1.8deg)',offset:.37},
    {transform:'translate(-.65%,-1.35%) rotate(-1.3deg)',offset:.5},
    {transform:'translate(.4%,-.3%) rotate(.8deg)',offset:.63},
    {transform:'translate(-.2%,-.5%) rotate(-.4deg)',offset:.78},
    {transform:'translate(0,0) rotate(0) scale(1)',offset:1}
  ], {duration:1900,delay:240,easing:'ease-in-out'});
  // Hooves stay planted: startle through the body, pivoting at the ground line.
  animate(horse, [
    {transform:'skewX(0deg) scaleY(1)',offset:0},
    {transform:'skewX(-.8deg) scaleY(.98)',offset:.08},
    {transform:'skewX(2.8deg) scaleY(1.025)',offset:.2},
    {transform:'skewX(-1.6deg) scaleY(.995)',offset:.38},
    {transform:'skewX(1.3deg) scaleY(1.012)',offset:.53},
    {transform:'skewX(-.6deg) scaleY(.998)',offset:.7},
    {transform:'skewX(0deg) scaleY(1)',offset:1}
  ], {duration:1800,delay:340,easing:'ease-in-out'});
  endTimer = setTimeout(resetMotion, 3000);
}
// Each sprite retains the original handwritten strokes and its original position.
// Backwards fill hides later characters until their individual reveal begins.
function revealWords(gentle) {
  words.forEach((word, i) => animate(word, gentle ? [
    {opacity:0}, {opacity:1}
  ] : [
    {opacity:0,clipPath:'inset(0 0 100% 0)',transform:'translateY(1%) scale(.94)',offset:0},
    {opacity:1,clipPath:'inset(0)',transform:'translateY(-.4%) scale(1.04)',offset:.65},
    {opacity:1,clipPath:'inset(0)',transform:'translateY(0) scale(1)',offset:1}
  ], {duration:gentle ? 300 : 650,delay:120+i*380,easing:'cubic-bezier(.2,.7,.2,1)',fill:'both'}));
}
function spillApples() {
  animate(document.getElementById('basket'), [
    {transform:'rotate(0)'}, {transform:'rotate(-2deg)'},
    {transform:'rotate(1deg)'}, {transform:'rotate(0)'}
  ], {duration:700,delay:400,easing:'ease-in-out'});
  const paths = [
    [
      {transform:'translate(-8.4%,-10.3%) rotate(-75deg) scale(.85)',opacity:0,offset:0},
      {transform:'translate(-7%,-13.4%) rotate(-62deg) scale(.94)',opacity:1,offset:.12},
      {transform:'translate(-3.5%,-14.5%) rotate(-34deg) scale(1)',opacity:1,offset:.29},
      {transform:'translate(-.8%,0) rotate(-10deg) scale(1)',opacity:1,offset:.57},
      {transform:'translate(-.2%,-2.5%) rotate(-4deg) scale(1)',opacity:1,offset:.71},
      {transform:'translate(.25%,0) rotate(3deg) scale(1)',opacity:1,offset:.85},
      {transform:'translate(0,0) rotate(0) scale(1)',opacity:1,offset:1}
    ],
    [
      {transform:'translate(-18.9%,-10%) rotate(-115deg) scale(.83)',opacity:0,offset:0},
      {transform:'translate(-16%,-14%) rotate(-92deg) scale(.94)',opacity:1,offset:.12},
      {transform:'translate(-10%,-16.5%) rotate(-58deg) scale(1)',opacity:1,offset:.3},
      {transform:'translate(-1.4%,0) rotate(-18deg) scale(1)',opacity:1,offset:.6},
      {transform:'translate(-.7%,-2.1%) rotate(-8deg) scale(1)',opacity:1,offset:.73},
      {transform:'translate(.3%,0) rotate(4deg) scale(1)',opacity:1,offset:.88},
      {transform:'translate(0,0) rotate(0) scale(1)',opacity:1,offset:1}
    ]
  ];
  apples.forEach((apple, i) => animate(apple, paths[i], {
    duration:1650,delay:480+i*270,easing:'linear',fill:'both'
  }));
}
async function playDialect() {
  if (!dialect) {
    dialect = new Audio();
    dialect.preload = 'none';
    dialect.addEventListener('ended', () => voiceBtn.classList.remove('is-pressed'));
    dialect.addEventListener('error', () => {
      voiceBtn.classList.remove('is-pressed');
      notify('方言音频暂未就绪');
    });
    dialect.src = DIALECT_AUDIO_URL;
  }
  try {
    // A file added after an earlier missing-file attempt can be retried.
    if (dialect.error) dialect.load();
    dialect.pause();
    dialect.currentTime = 0;
    await dialect.play();
    voiceBtn.classList.add('is-pressed');
  } catch (error) {
    // Repeated clicks interrupt the previous playback request intentionally.
    if (error.name === 'AbortError') return;
    voiceBtn.classList.remove('is-pressed');
    notify(error.name === 'NotAllowedError'
      ? '请再次点击“方言发音”播放。'
      : '方言音频暂未就绪');
  }
}
lightningBtn.addEventListener('click', triggerLightning);
document.getElementById('posterTap').addEventListener('click', triggerLightning);
voiceBtn.addEventListener('click', playDialect);
document.addEventListener('visibilitychange', () => {
  if (document.hidden) { resetMotion(); if (dialect) dialect.pause(); voiceBtn.classList.remove('is-pressed'); }
});
