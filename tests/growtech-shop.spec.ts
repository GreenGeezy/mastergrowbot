import {test,expect} from 'playwright/test';
test('shop keeps actual bundles distinct from retailer recommendations',async({page})=>{
  await page.goto('/grow-tech');
  await expect(page.getByRole('heading',{level:1})).toHaveCount(1);
  await page.screenshot({path:'output/sales-recovery/premium-shop-desktop.png',fullPage:true});
  await expect(page.locator('#soil-meter')).toContainText('$59');
  await expect(page.locator('#grow-light')).toContainText('Sold separately by Spider Farmer');
  await expect(page.locator('#more-essentials article')).toHaveCount(3);
  await expect(page.locator('#grow-light a.gt-button')).toHaveAttribute('href','https://www.spider-farmer.com/products/sf-1000-led-grow-light/');
  await page.getByRole('button',{name:'The same grower',exact:true}).click();
  await expect(page.locator('.gt-light-gallery>img')).toHaveAttribute('src',/grower-one.webp$/);
  await expect(page.getByRole('button',{name:'The same grower',exact:true})).toHaveAttribute('aria-pressed','true');
  await page.setViewportSize({width:390,height:844});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
  await page.screenshot({path:'output/sales-recovery/premium-shop-mobile.png',fullPage:true});
  await page.locator('#soil-meter').getByRole('link',{name:'Choose delivery & checkout'}).click();
  await expect(page).toHaveURL(/\/grow-tech\/checkout\/soil-health-meter$/);
  await expect(page.locator('#delivery-country')).toBeVisible();
});
