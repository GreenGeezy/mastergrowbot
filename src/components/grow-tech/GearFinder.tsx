import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Camera, Thermometer, Sprout, Package } from "lucide-react";
import { products, bundle, currentPrice, planIds } from "@/data/growTechProducts";
import { trackEvent, trackGrowTechSelectItem, trackGrowTechBeginCheckout } from "@/lib/analytics";
const choices = [
  {label:"Closer plant photos", icon:Camera, product:products[0], title:"Start with the Scout Camera.", reason:"Choose the 10–20X phone lens when close-up plant photography is the gap in your setup. You can buy the lens on its own.", fit:"Phone lens attachment, not a standalone Wi-Fi camera. Ask us about fit for your phone and case before ordering."},
  {label:"Room readings", icon:Thermometer, product:products[1], title:"Start with the Environment Monitor.", reason:"Choose a separate display for grow-room readings when you want an easy reference beside your existing setup.", fit:"A standalone monitor. It does not control your fans or lights and does not sync directly to MasterGrowbot AI."},
  {label:"Soil spot checks", icon:Sprout, product:products[2], title:"Start with the Soil Health Meter.", reason:"Choose the soil meter for occasional moisture and soil-context checks. Buy one tool when you already have your camera and room monitoring covered.", fit:"For soil spot checks. Confirm that the meter suits your growing medium before ordering."},
  {label:"All three tools", icon:Package, product:bundle, title:"Get all three and save $50.", reason:"The kit combines the phone lens, environment monitor, and soil meter for $247. The same tools bought separately total $297.", fit:"An upgrade for an existing setup. Tent, lights, ventilation, smartphone, and an app subscription are not included."},
];
export default function GearFinder() {
 const [selected,setSelected]=useState(0); const choice=choices[selected]; const product=choice.product;
 const help=`mailto:support@mastergrowbot.com?subject=${encodeURIComponent(`Before I order: ${product.name}`)}&body=${encodeURIComponent('Hi, I am interested in '+product.name+'. Please confirm compatibility and the current delivery estimate.\n\nMy setup / phone / growing medium:\nDelivery country and postal code:\n')}`;
 return <section id="shop-tools" className="premium-wrap conversion-lab gear-finder" aria-labelledby="gear-finder-title">
   <div className="lab-heading"><div><p className="premium-eyebrow">BUILD AROUND WHAT YOU ALREADY OWN</p><h2 id="gear-finder-title">Find the tool your grow is missing.</h2></div><p>Start with one tool. Choose the kit when you need all three.</p></div>
   <div className="goal-controls" role="group" aria-label="Choose the gear you need">{choices.map(({label,icon:Icon},i)=><button key={label} type="button" aria-pressed={selected===i} onClick={()=>{setSelected(i);trackEvent('growtech_need_select',{product_id:choices[i].product.productId});}}><Icon size={19}/>{label}</button>)}</div>
   <div className="gear-result"><div aria-live="polite"><p className="premium-eyebrow">YOUR SELECTED TOOL</p><h3>{choice.title}</h3><p>{choice.reason}</p><div className="gear-fit"><Check size={18}/><p>{choice.fit}</p></div></div>
   <div className="gear-order"><p className="gear-price">{currentPrice(product)} <span>USD · one time</span></p><p>Free shipping to the US & Canada</p><Link className="premium-button" to={`/grow-tech/checkout/${product.anchorId}`} data-cta-location="gear-finder" onClick={()=>{trackGrowTechSelectItem(product,'gear-finder',planIds[product.planKey]);trackGrowTechBeginCheckout(product,'gear-finder',planIds[product.planKey]);}}>Buy {selected===3?'the three-tool kit':['Scout Camera','Environment Monitor','Soil Meter'][selected]} <ArrowRight size={18}/></Link><a className="premium-text-link" href={`#${product.anchorId}`}>See product details <ArrowRight size={16}/></a><a className="gear-help" href={help} onClick={()=>trackEvent('growtech_presale_help',{product_id:product.productId})}>Ask about fit or delivery before buying</a></div></div>
   <div className="gear-reassurance"><span><Check size={15}/> Secure one-time Whop checkout</span><span><Check size={15}/> No app subscription required</span><a href="#growtech-order-answers">Shipping, returns & payment help <ArrowRight size={15}/></a></div>
 </section>;
}
