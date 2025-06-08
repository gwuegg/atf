from PIL import Image, ImageDraw, ImageFont
import os

def render_game_image(state, user_id):
    base = Image.new("RGB", (400, 200), "white")
    draw = ImageDraw.Draw(base)
    draw.rectangle([50, 150, 350, 180], fill="gray")

    skin = state.get("skin", "default")
    skin_path = f"assets/skins/{skin}.png"
    if os.path.exists(skin_path):
        cart = Image.open(skin_path).resize((60, 60))
        base.paste(cart, (170, 90), cart.convert("RGBA"))

    draw.text((10, 10), f"ATF: {state['atf']}", fill="black")
    draw.text((10, 30), f"Dist: {state['distance']}м", fill="black")
    draw.text((10, 50), f"Монеты: {state['currency']}", fill="black")
    output_path = f"/mnt/data/render_{user_id}.png"
    base.save(output_path)
    return output_path