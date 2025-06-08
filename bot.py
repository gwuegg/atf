from aiogram import Bot, Dispatcher, types
from aiogram.types import ReplyKeyboardMarkup, KeyboardButton, InlineKeyboardMarkup, InlineKeyboardButton
import asyncio
from game_engine import start_game, get_stats, shop_menu, leaderboard_menu, upgrade_stat, change_skin
from render import render_game_image

bot = Bot(token='YOUR_TELEGRAM_BOT_TOKEN')
dp = Dispatcher(bot)

def main_menu():
    kb = ReplyKeyboardMarkup(resize_keyboard=True)
    kb.add(KeyboardButton("🚀 Старт"))
    kb.add(KeyboardButton("📊 Статистика"), KeyboardButton("🛒 Магазин"))
    kb.add(KeyboardButton("🏁 Таблица лидеров"), KeyboardButton("🎨 Сменить скин"))
    return kb

@dp.message_handler(commands=["start"])
async def cmd_start(message: types.Message):
    await message.answer("🚚 Добро пожаловать в *ATF Carts*!", parse_mode="Markdown")
    await message.answer("Нажми кнопку ниже, чтобы начать игру", reply_markup=main_menu())

@dp.message_handler(lambda m: m.text == "🚀 Старт")
async def start_game_handler(message: types.Message):
    user_id = str(message.from_user.id)
    result, state = start_game(user_id)
    img_path = render_game_image(state, user_id)
    with open(img_path, 'rb') as img:
        await message.answer_photo(img, caption=result)

@dp.message_handler(lambda m: m.text == "📊 Статистика")
async def stats_handler(message: types.Message):
    user_id = str(message.from_user.id)
    stats = get_stats(user_id)
    await message.answer(stats)

@dp.message_handler(lambda m: m.text == "🛒 Магазин")
async def shop_handler(message: types.Message):
    user_id = str(message.from_user.id)
    await message.answer(shop_menu(user_id))

@dp.message_handler(lambda m: m.text == "🏁 Таблица лидеров")
async def leaderboard_handler(message: types.Message):
    await message.answer(leaderboard_menu())

@dp.message_handler(lambda m: m.text == "🎨 Сменить скин")
async def skin_handler(message: types.Message):
    keyboard = InlineKeyboardMarkup()
    for s in ["default", "gold", "speedster"]:
        keyboard.add(InlineKeyboardButton(s, callback_data=f"skin_{s}"))
    await message.answer("Выбери скин:", reply_markup=keyboard)

@dp.callback_query_handler(lambda c: c.data.startswith("skin_"))
async def change_skin_callback(callback_query: types.CallbackQuery):
    user_id = str(callback_query.from_user.id)
    skin = callback_query.data.split("_")[1]
    msg = change_skin(user_id, skin)
    await callback_query.message.edit_text(msg)

async def main():
    await dp.start_polling()

if __name__ == "__main__":
    asyncio.run(main())