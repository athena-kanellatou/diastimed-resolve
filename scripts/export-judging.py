"""Export the editable authored deck to a searchable PDF and accessible browser view."""
from pathlib import Path
import zipfile,xml.etree.ElementTree as ET,html,shutil
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import Paragraph
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.colors import HexColor
root=Path(__file__).resolve().parent.parent;pub=root/'public'
font_root=Path('/usr/share/fonts/truetype/liberation2')
if not font_root.exists():font_root=Path('/usr/share/fonts/truetype/liberation')
for name,file in [('Liberation','LiberationSans-Regular.ttf'),('LiberationBold','LiberationSans-Bold.ttf')]:pdfmetrics.registerFont(TTFont(name,str(font_root/file)))
ns={'p':'http://schemas.openxmlformats.org/presentationml/2006/main','a':'http://schemas.openxmlformats.org/drawingml/2006/main'}
slides=[]
with zipfile.ZipFile(pub/'DiastiMed_RESOLVE_judging.pptx')as z:
 for i in range(1,8):
  xml=ET.fromstring(z.read(f'ppt/slides/slide{i}.xml'));boxes=[]
  for shape in xml.findall('.//p:sp',ns):
   off=shape.find('./p:spPr/a:xfrm/a:off',ns);ext=shape.find('./p:spPr/a:xfrm/a:ext',ns)
   if off is None or ext is None:continue
   paras=shape.findall('./p:txBody/a:p',ns);text='\n'.join(''.join(t.text or ''for t in p.findall('.//a:t',ns))for p in paras)
   fmt=shape.find('.//a:rPr',ns)
   if fmt is None:continue
   color=fmt.find('./a:solidFill/a:srgbClr',ns)
   boxes.append(dict(text=text,x=int(off.get('x'))/12700,y=int(off.get('y'))/12700,w=int(ext.get('cx'))/12700,h=int(ext.get('cy'))/12700,size=int(fmt.get('sz','2000'))/100,bold=fmt.get('b')=='1',color='#'+(color.get('val')if color is not None else'172F38')))
  slides.append(boxes)
c=canvas.Canvas(str(pub/'DiastiMed_RESOLVE_judging.pdf'),pagesize=(960,540));c.setTitle('DiastiMed RESOLVE - seven-slide judging deck');c.setAuthor('DiastiMed - AI-assisted development')
sections=[]
for i,boxes in enumerate(slides,1):
 c.setFillColor(HexColor('#f5f6f0'));c.rect(0,0,960,540,fill=1,stroke=0);parts=[]
 for j,b in enumerate(boxes):
  style=ParagraphStyle('slide',fontName='LiberationBold'if b['bold']else'Liberation',fontSize=b['size'],leading=b['size']*1.2,textColor=HexColor(b['color']))
  text=html.escape(b['text']).replace('\n','<br/>');para=Paragraph(text,style);w,h=para.wrap(b['w']-15,b['h']);para.drawOn(c,b['x']+7.5,540-b['y']-(b['h']-h)/2-h)
  tag='h2'if j==0 else'p';parts.append(f'<{tag} style="left:{b["x"]/9.6}%;top:{b["y"]/5.4}%;width:{b["w"]/9.6}%;height:{b["h"]/5.4}%;font-size:{b["size"]/9.6}cqw;color:{b["color"]};font-weight:{700 if b["bold"]else 400}">{text}</{tag}>')
 c.showPage();sections.append(f'<section aria-label="Slide {i} of 7" id="slide-{i}"><div class="canvas">'+''.join(parts)+'</div></section>')
c.save()
(pub/'judging.html').write_text('''<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>DiastiMed RESOLVE · Seven-slide judging deck</title><style>*{box-sizing:border-box}body{margin:0;background:#e7ebe2;color:#172f38;font:16px Arial,sans-serif}header{padding:16px 4%;display:flex;flex-wrap:wrap;gap:20px;align-items:center;background:#fff;border-bottom:1px solid #bfcbbf}header strong{margin-right:auto}a{color:#1b6c5e;line-height:1.7}main{max-width:1280px;margin:24px auto}section{margin:24px 0;background:#f5f6f0;container-type:inline-size}.canvas{position:relative;aspect-ratio:16/9}.canvas>*{position:absolute;display:flex;flex-direction:column;justify-content:center;margin:0;padding:0 .78%;line-height:1.2;white-space:normal;font-family:Arial,sans-serif}footer{padding:24px 4%;font-size:14px;line-height:1.8}a:focus-visible{outline:3px solid #aa641c;outline-offset:4px}@media(max-width:600px){main{margin:10px 0}section{margin:10px 0}}@media print{header,footer{display:none}main{margin:0}section{margin:0;break-after:page}@page{size:landscape;margin:0}}</style><header><strong>DiastiMed RESOLVE / 7 slides</strong><a href="/">Open working app</a><a href="DiastiMed_RESOLVE_judging.pdf">Download PDF</a><a href="DiastiMed_RESOLVE_judging.pptx">Download editable PowerPoint</a><a href="https://github.com/athena-kanellatou/diastimed-resolve">Source</a></header><main>'''+''.join(sections)+'''</main><footer>Independent research prototype for Space Apps 2026. AI assisted development and presentation. No NASA authorship, endorsement or clinical validation. Sources and full development disclosure are in the repository and PowerPoint notes. All scenarios are synthetic. No optimisation advantage over greedy is claimed.</footer></html>''')
if(pub/'judging').exists():shutil.rmtree(pub/'judging')
print('Exported seven searchable PDF pages and seven semantic HTML slides.')
