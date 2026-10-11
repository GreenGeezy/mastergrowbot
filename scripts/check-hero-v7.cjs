const {chromium}=require('playwright');
const fs=require('fs');
const assert=require('node:assert/strict');
const base=process.env.HERO_BASE_URL||'http://127.0.0.1:8090';
(async()=>{
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
 const page=await browser.newPage(); const results=[];
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 for(const width of [320,390,768,1440]){
  await page.setViewportSize({width,height:950});await page.emulateMedia({reducedMotion:'reduce'});
  const videosRequested=[];const listener=r=>{if(r.url().includes('narrated')&&r.url().includes('.mp4'))videosRequested.push(r.url());};page.on('request',listener);
  await page.goto(base+'/?mgb_analytics=off');await page.locator('#hero-title').waitFor();
  assert.equal(await page.locator('.hero-demo-video video').count(),0,'hero should not load video before interaction');assert.equal(videosRequested.length,0);
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`overflow ${width}`);
  assert.match(await page.locator('.hero-customer-quote').innerText(),/Sarah K/);
  const feedback=page.locator('#customer-experiences');
  assert.equal(await feedback.locator('blockquote:visible').count(),width<=600?2:4);
  assert.equal(await feedback.locator('blockquote').first().evaluate(e=>getComputedStyle(e).fontSize),'18px');
  if(width<=600){const toggle=feedback.locator('.app-feedback-toggle');await toggle.focus();await page.keyboard.press('Enter');assert.equal(await toggle.getAttribute('aria-expanded'),'true');assert.equal(await feedback.locator('blockquote:visible').count(),4);}
  for(const placement of ['hero','homepage_customer_feedback']){
   assert.match(await page.locator(`[data-cta-location="${placement}:ios"]`).getAttribute('href'),/apps.apple.com\/us\/app\/mastergrowbot-ai-grow-cannabis\/id6752221060/);
   assert.match(await page.locator(`[data-cta-location="${placement}:android"]`).getAttribute('href'),/play.google.com\/store\/apps\/details\?id=com.mastergrowbot.app/);
  }
  const watch=page.getByRole('button',{name:/Watch demo/});await watch.focus();await page.keyboard.press('Enter');
  const video=page.locator('.hero-demo-video video');await video.evaluate(v=>{v.muted=true;return v.play();});await page.waitForTimeout(1500);
  const media=await video.evaluate(v=>({time:v.currentTime,duration:v.duration,width:v.videoWidth,height:v.videoHeight,source:v.currentSrc,error:v.error?.message,controls:v.controls,captionState:v.querySelector('track').readyState}));
  assert(media.time>0);assert(media.duration>=35&&media.duration<=45);assert(media.controls&&!media.error);assert.equal(media.width,width>=768?1920:1080);assert.equal(media.captionState,2);
  await video.evaluate(v=>{v.pause();v.currentTime=15;});await page.waitForTimeout(300);
  await page.screenshot({path:`output/hero-v7-${width}.png`,fullPage:false});
  results.push({viewport:width,...media,qaSuppressed:await page.evaluate(()=>window.mgbAnalyticsSuppressed),overflow:false});
  page.off('request',listener);
 }
 assert.deepEqual(errors,[]);fs.writeFileSync('output/hero-v7-verification.json',JSON.stringify(results,null,2));await browser.close();console.log(JSON.stringify(results));
})().catch(e=>{console.error(e);process.exit(1)});


