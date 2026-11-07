"""Prepare approved imagegen masters and responsive delivery variants."""
from pathlib import Path
from PIL import Image, ImageOps
import shutil

ROOT = Path(__file__).resolve().parents[1]
GENERATED = Path.home()/'.codex/generated_images/01a1b637-39d2-7901-bb10-b73adc52e333'
ASSETS = {
 'app-hero':'0deab9c0-8bd6-4148-9b02-ee43e21492b5',
 'app-workflow':'c6f02c98-eeb7-4764-a6b3-46b5cf4509cc',
 'app-journal':'0c6d276b-aa55-4272-ad29-aaa15be7bf4e',
 'light-hero':'bc19380b-0595-4dbb-a747-bef5bceaebaa',
 'light-dimmer':'4d9449d8-f9e2-4936-bda0-ebb6b82bddf0',
 'light-installation':'e6475013-6984-4de2-a868-90e8163384c8',
 'light-contents':'9a06b7d4-e8a3-4ebd-9e4b-2600412dfd70',
 'guide-editorial':'335a8468-75c4-435d-8dde-2e71a81b5149',
}
out=ROOT/'public/images/premium-2026'; out.mkdir(parents=True,exist_ok=True)
masters=ROOT/'source-assets/premium-2026'; masters.mkdir(parents=True,exist_ok=True)
for name,identifier in ASSETS.items():
    source=GENERATED/f'exec-{identifier}.png'
    shutil.copy2(source,masters/f'{name}.png')
    im=Image.open(source).convert('RGB')
    im.thumbnail((1600,1100)); im.save(out/f'{name}.webp',quality=85,method=6)
    ImageOps.fit(im,(720,800),centering=(.7 if name=='app-hero' else .5,.5)).save(out/f'{name}-mobile.webp',quality=82,method=6)
    print(name,(out/f'{name}.webp').stat().st_size)
