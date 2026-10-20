import fs from 'node:fs/promises';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const sharp=require('C:/Users/elidu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const base='C:/Users/elidu/.codex/generated_images/01a15560-4ece-7161-b0ae-207063280044/';
await fs.mkdir('source-assets/ag1000-lifestyle-v2',{recursive:true});
await fs.mkdir('public/images/grow-tech/ag1000-lifestyle-v2',{recursive:true});
for(const [name,file] of [['hero','exec-5c47a542-2fbb-4a6b-85fb-0791927bd81d.png'],['dimmer','exec-b8a749b4-b011-4023-98f3-23e2b3e7c684.png']]){
 await fs.copyFile(base+file,`source-assets/ag1000-lifestyle-v2/${name}.png`);
 await sharp(base+file).resize({width:1200}).webp({quality:83}).toFile(`public/images/grow-tech/ag1000-lifestyle-v2/${name}.webp`);
 if(name==='hero') await sharp(base+file).resize({width:640}).webp({quality:80}).toFile('public/images/grow-tech/ag1000-lifestyle-v2/hero-mobile.webp');
}
