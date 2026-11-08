from pathlib import Path
from PIL import Image,ImageOps
import subprocess,imageio_ffmpeg,math
R=Path.cwd(); P=R/'public/images/cinematic-v2'; V=R/'public/videos/cinematic-v2';P.mkdir(parents=True,exist_ok=True);V.mkdir(parents=True,exist_ok=True)
ff=imageio_ffmpeg.get_ffmpeg_exe()
for name in ['app-hero','light-hero']:
 im=Image.open(R/f'source-assets/cinematic-v2/{name}.png').convert('RGB'); im.save(P/f'{name}.webp',quality=88)
 ImageOps.fit(im,(800,1000),centering=(.85,.5) if name=='app-hero' else (.5,.5)).save(P/f'{name}-mobile.webp',quality=86)
 out=V/f'{name}.mp4'
 proc=subprocess.Popen([ff,'-y','-loglevel','error','-f','rawvideo','-pix_fmt','rgb24','-s','1280x720','-r','24','-i','-','-an','-c:v','libx264','-preset','fast','-crf','25','-pix_fmt','yuv420p','-movflags','+faststart',str(out)],stdin=subprocess.PIPE)
 for i in range(192):
  z=1+.025*(1-math.cos(2*math.pi*i/192))/2
  tile=ImageOps.fit(im,(round(1280*z),round(720*z))); x=(tile.width-1280)//2;y=(tile.height-720)//2
  proc.stdin.write(tile.crop((x,y,x+1280,y+720)).tobytes())
 proc.stdin.close();assert proc.wait()==0
 subprocess.run([ff,'-y','-loglevel','error','-i',str(out),'-c:v','libvpx-vp9','-deadline','realtime','-cpu-used','8','-crf','36','-b:v','0',str(V/f'{name}.webm')],check=True)
 subprocess.run([ff,'-y','-loglevel','error','-i',str(out),'-vf','fps=8,scale=560:-1,split[a][b];[a]palettegen=max_colors=80[p];[b][p]paletteuse','-loop','0',str(V/f'{name}.gif')],check=True)
 print(name,flush=True)
