import logging
from aiogram import Bot, Dispatcher, types, F
from aiogram.enums import ParseMode
from aiogram.client.default import DefaultBotProperties
from aiogram.types import WebAppInfo, InlineKeyboardMarkup, InlineKeyboardButton
from aiogram.fsm.storage.memory import MemoryStorage
from aiogram.utils.keyboard import InlineKeyboardBuilder
import asyncio
import json

TOKEN = "YOUR_BOT_TOKEN"

bot = Bot(token=TOKEN, default=DefaultBotProperties(parse_mode=ParseMode.HTML))
dp = Dispatcher(storage=MemoryStorage())

STATS_FILE = "stats.json"

def load_stats():
    try:
        with open(STATS_FILE, "r") as f:
            return json.load(f)
    except:
        return {}

def save_stats(data):
    with open(STATS_FILE, "w") as f:
        json.dump(data, f, indent=2)

@dp.message(F.text == "/start")
async def start_handler(message: types.Message):
    kb = InlineKeyboardMarkup(inline_keyboard=[
        [InlineKeyboardButton(text="🎮 Играть", web_app=WebAppInfo(url="https://yourdomain.com/"))],
        [InlineKeyboardButton(text="📊 Моя статистика", callback_data="my_stats")]
    ])
    await message.answer("Добро пожаловать в <b>ATF Carts</b>!
Жми кнопку ниже чтобы начать:", reply_markup=kb)

@dp.callback_query(F.data == "my_stats")
async def stats_handler(callback: types.CallbackQuery):
    user_id = str(callback.from_user.id)
    stats = load_stats().get(user_id, {
        "distance": 0,
        "tools": 0,
        "currency": 0
    })
    msg = f"📊 <b>Твоя статистика</b>:
"
    msg += f"🚚 Пройдено: {stats['distance']}м
"
    msg += f"🧰 Инструменты: {stats['tools']}
"
    msg += f"💰 Монеты: {stats['currency']}"
    await callback.message.edit_text(msg)

@dp.message(F.web_app_data)
async def webapp_data_handler(message: types.Message):
    data = json.loads(message.web_app_data.data)
    user_id = str(message.from_user.id)
    stats = load_stats()
    stats[user_id] = data
    save_stats(stats)
    await message.answer("✅ Прогресс сохранён!")

async def main():
    await dp.start_polling(bot)

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    asyncio.run(main())