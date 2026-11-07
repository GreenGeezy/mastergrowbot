from pathlib import Path
from PIL import Image,ImageOps,ImageDraw,ImageFont
import pypdfium2 as pdfium, subprocess, imageio_ffmpeg, sys
R=Path(__file__).resolve().parents[1]; OUT=R/'output/pdf/premium-2026';OUT.mkdir(parents=True,exist_ok=True)
font=ImageFont.truetype('C:/Windows/Fonts/arial.ttf',25)
small=ImageFont.truetype('C:/Windows/Fonts/arial.ttf',16)
for name,path in [('guide',OUT/'ai-growing-field-guide-review.pdf'),('quickstart',R/'public/downloads/grow-tech/equipment-quickstart-free.pdf')]:
 doc=pdfium.PdfDocument(str(path)); thumbs=[]
 for i,page in enumerate(doc):
  pix=page.render(scale=1.5).to_pil();p=OUT/f'{name}-{i+1:02}.png';pix.save(p)
  im=Image.open(p).convert('RGB');im.thumbnail((270,360));thumbs.append(im)
  assert page.get_textpage().get_text_range().strip(),f'Empty page {i}'
 sheet=Image.new('RGB',(270*4,390*((len(thumbs)+3)//4)),'#d7ded7')
 for i,im in enumerate(thumbs):sheet.paste(im,((i%4)*270,(i//4)*390))
 sheet.save(OUT/f'{name}-contact.jpg')
Image.open(OUT/'quickstart-01.png').save(R/'public/images/premium-2026/quickstart-preview.webp',quality=85)
V=R/'public/videos/premium-2026';V.mkdir(parents=True,exist_ok=True)
G=R/'output/media/premium-2026';G.mkdir(parents=True,exist_ok=True)
sets={
 'app-story':(4,[('public/images/premium-2026/app-workflow.webp','01 / CAPTURE A CLEAR PHOTO','AI grower illustration'),('public/images/premium/real-report-overview.webp','02 / REVIEW YOUR REPORT','Supplied MasterGrowbot app screen'),('public/images/premium/real-report-journal.webp','03 / SAVE A JOURNAL RECORD','Supplied MasterGrowbot app screen')]),
 'light-story':(2.5,[('public/images/premium-2026/light-contents.webp','THE AG1000 / 100W PANEL','Reference-based illustration'),('public/images/premium-2026/light-dimmer.webp','MANUAL BRIGHTNESS CONTROL','Reference-based illustration'),('public/images/premium-2026/light-hero.webp','A LIGHT FOR YOUR INDOOR SETUP','AI illustration / tent and plants separate')]),
 'guide-story':(2.5,[(str(OUT/'quickstart-01.png'),'01 / START WITH ONE PLANT','Actual free quickstart page'),(str(OUT/'quickstart-03.png'),'02 / KEEP THE CONTEXT','Actual free quickstart page'),(str(OUT/'quickstart-04.png'),'03 / SAVE YOUR OBSERVATION','Actual printable worksheet')])}
ff=imageio_ffmpeg.get_ffmpeg_exe()
for name,(seconds,slides) in sets.items():
 if len(sys.argv)>1 and name!=sys.argv[1]: continue
 target=V/f'{name}.mp4'
 proc=subprocess.Popen([ff,'-y','-loglevel','error','-f','rawvideo','-vcodec','rawvideo','-pix_fmt','rgb24','-s','1280x720','-r','24','-i','-','-an','-c:v','libx264','-preset','fast','-crf','24','-pix_fmt','yuv420p','-movflags','+faststart',str(target)],stdin=subprocess.PIPE)
 for path,title,caption in slides:
  im=Image.open(R/path).convert('RGB');portrait=im.height>im.width
  for f in range(round(seconds*24)):
   frame=Image.new('RGB',(1280,720),'#080e0c')
   if portrait:
    tile=ImageOps.contain(im,(660,600));frame.paste(tile,((1280-tile.width)//2,24))
   else:
    zoom=1+f/(seconds*24)*.035;tile=ImageOps.fit(im,(round(1280*zoom),round(630*zoom)));left=(tile.width-1280)//2;frame.paste(tile.crop((left,0,left+1280,630)),(0,0))
   d=ImageDraw.Draw(frame);d.rectangle((0,630,1280,720),fill='#080e0c');d.text((32,646),title,font=font,fill='#c5f48b');d.text((32,684),caption,font=small,fill='#bbc8bf');proc.stdin.write(frame.tobytes())
 proc.stdin.close();assert proc.wait()==0
 subprocess.run([ff,'-y','-loglevel','error','-i',str(target),'-c:v','libvpx-vp9','-deadline','realtime','-cpu-used','8','-threads','2','-b:v','0','-crf','36','-an',str(V/f'{name}.webm')],check=True)
 subprocess.run([ff,'-y','-loglevel','error','-i',str(target),'-vf','fps=8,scale=640:-1:flags=lanczos,split[s0][s1];[s0]palettegen=max_colors=96[p];[s1][p]paletteuse','-loop','0',str(G/f'{name}.gif')],check=True)
 print(name,'exported',flush=True)
