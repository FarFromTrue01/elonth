import sys
from PIL import Image
files=sys.argv[2:]; out=sys.argv[1]
n=len(files); cols=2; rows=(n+1)//2
W=Image.new('RGB',(1280,400*rows))
for i,f in enumerate(files):
    try: im=Image.open(f).resize((640,400))
    except Exception: continue
    W.paste(im,((i%2)*640,(i//2)*400))
W.save(out)
