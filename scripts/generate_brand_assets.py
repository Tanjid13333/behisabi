from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

root = Path(__file__).resolve().parents[1] / "assets" / "images"
root.mkdir(parents=True, exist_ok=True)
size = 1024
font_path = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
font = ImageFont.truetype(font_path, 420)
for name in ["icon.png", "splash-icon.png", "favicon.png", "android-icon-foreground.png", "android-icon-background.png", "android-icon-monochrome.png"]:
    image = Image.new("RGBA", (size, size), (8, 38, 27, 255))
    draw = ImageDraw.Draw(image)
    draw.rounded_rectangle((34, 34, size - 34, size - 34), radius=210, fill=(13, 58, 41, 255), outline=(48, 117, 87, 255), width=20)
    draw.ellipse((130, 164, 894, 928), fill=(240, 68, 68, 255))
    draw.ellipse((176, 220, 460, 500), fill=(255, 166, 166, 130))
    text = "B"
    box = draw.textbbox((0, 0), text, font=font)
    draw.text(((size - (box[2] - box[0])) / 2, 240), text, font=font, fill=(255, 255, 255, 255))
    draw.ellipse((690, 142, 820, 272), fill=(96, 227, 169, 255))
    draw.ellipse((760, 220, 890, 350), fill=(96, 227, 169, 180))
    image.save(root / name)
