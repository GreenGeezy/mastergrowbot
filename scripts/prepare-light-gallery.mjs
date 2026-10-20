import fs from 'node:fs/promises';
import { createRequire } from 'node:module';
const require=createRequire(import.meta.url);
const sharp=require('C:/Users/elidu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const generated='C:/Users/elidu/.codex/generated_images/01a15560-4ece-7161-b0ae-207063280044/';
const images=[['product','exec-986022e7-9c7d-4b5f-891e-62f36cb03ed9.png'],['grower-one','exec-2e0b9879-f2f5-4a7d-9fe9-4b54a0bf375d.png'],['grower-two','exec-483d394d-3956-4d68-b3cc-1e4c75695116.png']];
await fs.mkdir('source-assets/light-gallery-v1',{recursive:true});await fs.mkdir('public/images/grow-tech/light-gallery-v1',{recursive:true});
for(const [name,file] of images){await fs.copyFile(generated+file,`source-assets/light-gallery-v1/${name}.png`);await sharp(generated+file).resize({width:1100,withoutEnlargement:true}).webp({quality:82}).toFile(`public/images/grow-tech/light-gallery-v1/${name}.webp`);}
