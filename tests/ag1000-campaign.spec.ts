import {test,expect} from 'playwright/test';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
const guide='/grow-guides/100w-led-grow-light-buying-checklist';
const prior=(p:string)=>execFileSync('git',['show',`e74cd10:${p}`],{encoding:'utf8',maxBuffer:16*1024*1024}).replace(/\r\n/g,'\n');
test('owner-protected shop, reviews and all existing guide text remain exact',()=>{
  for(const p of ['src/pages/GrowTechShop.tsx','src/components/grow-tech/LightSupplierReviews.tsx'])expect(readFileSync(p,'utf8').replace(/\r\n/g,'\n')).toBe(prior(p));
  const guides=readFileSync('src/data/growGuides.ts','utf8').replace(/\r\n/g,'\n').replace("import { ag1000BuyingGuide } from './ag1000BuyingGuide';\n",'').replace('  ag1000BuyingGuide,\n','');
  expect(guides).toBe(prior('src/data/growGuides.ts'));
});
test('new buying guide is crawlable and leads to the original light and checkout',async({page,request})=>{
  const response=await request.get(guide);expect(response.status()).toBe(200);const html=await response.text();expect(html).toContain('Buying a 100W LED Grow Light');
  await page.goto(guide);await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href','https://www.mastergrowbot.com'+guide);
  await expect(page.locator('article a[href="/grow-tech#grow-light"]')).toHaveCount(1);
  await expect(page.locator('article a[href="/grow-tech/checkout/grow-light"]').first()).toBeAttached();
  const schemas=await page.locator('script[type="application/ld+json"]').allTextContents();expect(schemas.some(s=>JSON.parse(s)['@type']==='Article')).toBe(true);
  await page.locator('article a[href="/grow-tech#grow-light"]').click();await expect(page.locator('#grow-light')).toContainText('$199');
});
test('Amazon book sits beside both unchanged digital offers and opens the existing Amazon URL',async({page})=>{
  await page.goto('/grow-tech');await expect(page.locator('#digital-guides article')).toHaveCount(3);
  await expect(page.locator('#digital-guides article').nth(0)).toContainText('Equipment Quickstart');
  await expect(page.locator('#digital-guides article').nth(1)).toContainText('AI Plant Observation Playbook');
  await expect(page.locator('[data-offer="amazon-book"] a')).toHaveAttribute('href','https://a.co/d/07dQFaw0');
  await expect(page.locator('[data-offer="amazon-book"] a')).toHaveAttribute('target','_blank');
  for(const width of [1440,390,320]){await page.setViewportSize({width,height:1000});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);}
});
test('a receipt-bearing return renders the light digital-kit handoff without synthesizing a purchase',async({page})=>{
  await page.goto('/grow-tech/thank-you?product=grow-light&status=succeeded&payment=pay_testfixture');
  await expect(page.getByRole('link',{name:'Open guide files',exact:true})).toBeVisible();
  expect(await page.evaluate(()=>window.dataLayer?.filter(e=>(e as {event?:string})?.event==='purchase').length??0)).toBe(0);
});
