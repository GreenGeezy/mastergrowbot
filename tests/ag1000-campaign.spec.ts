import {test,expect} from 'playwright/test';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
const guide='/grow-guides/100w-led-grow-light-buying-checklist';
const prior=(p:string)=>execFileSync('git',['show',`e74cd10:${p}`],{encoding:'utf8',maxBuffer:16*1024*1024}).replace(/\r\n/g,'\n');
test('owner-protected shop, reviews and all existing guide text remain exact',()=>{
  const shop=readFileSync('src/pages/GrowTechShop.tsx','utf8').replace(/\r\n/g,'\n')
    .replace('itemCondition:"https://schema.org/NewCondition",eligibleRegion:[{"@type":"Country",name:"US"},{"@type":"Country",name:"CA"}],','')
    .replace(',hasMerchantReturnPolicy:{"@type":"MerchantReturnPolicy",applicableCountry:["US","CA"],returnPolicyCategory:"https://schema.org/MerchantReturnFiniteReturnWindow",merchantReturnDays:30,returnMethod:"https://schema.org/ReturnByMail",returnFees:"https://schema.org/ReturnFeesCustomerResponsibility"}','')
    .replace('Purchasers are eligible for a refund if the package is sent back and received within 30 days of purchase and is not damaged. Contact us for return instructions. Return shipping is paid by the buyer except for damaged or incorrect goods.','Unused, unopened hardware: contact us within 30 days of delivery. Return shipping is paid by the buyer except for damaged or incorrect goods.')
    .replace('Purchasers are eligible for a refund if the package is sent back and received within 30 days of purchase and is not damaged. Contact us before returning it. You pay return shipping except for damaged or incorrect goods.','Contact us before returning unused, unopened hardware within 30 days of delivery. You pay return shipping except for damaged or incorrect goods.');
  expect(shop).toBe(prior('src/pages/GrowTechShop.tsx'));
  expect(readFileSync('src/components/grow-tech/LightSupplierReviews.tsx','utf8').replace(/\r\n/g,'\n')).toBe(prior('src/components/grow-tech/LightSupplierReviews.tsx'));
  const guides=readFileSync('src/data/growGuides.ts','utf8').replace(/\r\n/g,'\n')
    .replace("import { ag1000BuyingGuide } from './ag1000BuyingGuide';\n",'')
    .replace('  ag1000BuyingGuide,\n','')
    .replaceAll(' For the current MasterGrowbot plan split, see [MasterGrowbot Pro vs Premium plans](/grow-guides/mastergrowbot-ai-pro-vs-premium-plans).','')
    .replace(/\n  \{\n    slug: 'mastergrowbot-ai-pro-vs-premium-plans',[\s\S]*?\n  \},\n\];\n\nexport function getGuideBySlug/, '\n];\n\nexport function getGuideBySlug');
  expect(guides).toBe(prior('src/data/growGuides.ts'));
});
test('new buying guide is crawlable and leads to the original light and checkout',async({page,request})=>{
  const response=await request.get(guide);expect(response.status()).toBe(200);const html=await response.text();expect(html).toContain('100W LED Grow Light Buying Guide');expect(html).toContain('30 days of purchase');
  await page.goto(guide);await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href','https://www.mastergrowbot.com'+guide);
  await expect(page.locator('article a[href="/grow-tech#grow-light"]')).toHaveCount(1);
  await expect(page.locator('article a[href="/grow-tech/checkout/grow-light"]').first()).toBeAttached();
  const schemas=await page.locator('script[type="application/ld+json"]').allTextContents();expect(schemas.some(s=>JSON.parse(s)['@type']==='Article')).toBe(true);
  await page.locator('article a[href="/grow-tech#grow-light"]').click();await expect(page.locator('#grow-light')).toContainText('$199');
});
test('large digital covers lead to the Amazon gallery below and preserve purchase tracking',async({page})=>{
  await page.goto('/grow-tech');await expect(page.locator('#digital-guides .shop-digital-grid>article')).toHaveCount(2);
  await expect(page.locator('#digital-guides article').nth(0)).toContainText('Equipment Quickstart');
  await expect(page.locator('#digital-guides article').nth(1)).toContainText('AI Plant Observation Playbook');
  await page.setViewportSize({width:1440,height:1000});
  const digitalBox=await page.locator('.shop-digital-grid').boundingBox();
  const bookBox=await page.locator('[data-offer="amazon-book"]').boundingBox();
  expect(bookBox!.y).toBeGreaterThan(digitalBox!.y+digitalBox!.height);
  expect((await page.locator('.shop-digital-grid>article>img').first().boundingBox())!.width).toBeGreaterThan(200);
  await page.getByRole('button',{name:'Show IPM Playbook image 2',exact:true}).click();
  await expect(page.locator('[data-offer="amazon-book"] img').first()).toHaveAttribute('src',/KDPImage4/);
  await expect(page.locator('[data-offer="amazon-book"] a')).toHaveAttribute('href','https://a.co/d/07dQFaw0');
  await expect(page.locator('[data-offer="amazon-book"] a')).toHaveAttribute('target','_blank');
  await page.context().route('https://a.co/**',route=>route.fulfill({status:200,contentType:'text/html',body:'<title>Amazon destination fixture</title>'}));
  const popupPromise=page.waitForEvent('popup');
  await page.locator('[data-offer="amazon-book"] a').click();
  const popup=await popupPromise;await popup.close();
  expect(await page.evaluate(()=>window.dataLayer?.filter(e=>(e as {event?:string})?.event==='amazon_book_click').length??0)).toBe(1);
  for(const width of [1440,390,320]){await page.setViewportSize({width,height:1000});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);}
});
test('a receipt-bearing return renders the light digital-kit handoff without synthesizing a purchase',async({page})=>{
  await page.goto('/grow-tech/thank-you?product=grow-light&status=succeeded&payment=pay_testfixture');
  await expect(page.getByRole('link',{name:'Open guide files',exact:true})).toBeVisible();
  expect(await page.evaluate(()=>window.dataLayer?.filter(e=>(e as {event?:string})?.event==='purchase').length??0)).toBe(0);
});
