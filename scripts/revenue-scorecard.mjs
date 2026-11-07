// Usage: node scripts/revenue-scorecard.mjs private-input.json
// Keep financial inputs outside the public repository. Missing values are not zero.
import fs from 'node:fs';
const file=process.argv[2];
if(!file) throw new Error('Supply a private JSON file with orders and monthlyOperatingCosts.');
const data=JSON.parse(fs.readFileSync(file,'utf8'));
const fields=['revenueExTax','supplierCost','shippingImportCost','fees','refunds','returnsReserve','supportCost','acquisitionCost'];
const ids=new Set(); let contribution=0,paidOrders=0;
const excluded=[];
for(const order of data.orders ?? []) {
 if(order.test || !['paid','refunded','partially_refunded'].includes(order.status)) {excluded.push({id:order.id,reason:'not a genuine paid receipt'});continue;}
 if(!order.id || ids.has(order.id)) throw new Error('Missing or duplicate receipt ID');
 ids.add(order.id);
 if(fields.some(f=>typeof order[f]!=='number'||!Number.isFinite(order[f])||order[f]<0)) throw new Error(`Incomplete costs for ${order.id}; unknown is not zero`);
 contribution+=order.revenueExTax-fields.slice(1).reduce((sum,f)=>sum+order[f],0);paidOrders++;
}
const costs=data.monthlyOperatingCosts;
if(typeof costs!=='number'||!Number.isFinite(costs)||costs<0) throw new Error('Supply verified allocated monthly operating costs');
const round=n=>Math.round(n*100)/100;
console.log(JSON.stringify({window:data.window,paidOrders,contribution:round(contribution),netProfit:round(contribution-costs),targetNetProfit:500,targetMet:contribution-costs>=500,excluded,app:data.app??{storeClicks:null,downloads:null,trials:null,newPaidSubscribers:null,renewals:null,refunds:null},warning:'Use matching monthly windows. Store clicks are not installs. Missing app metrics are unknown.'},null,2));
