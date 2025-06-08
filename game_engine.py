import json
import random

DB_PATH = "db.json"

def load_db():
    try:
        with open(DB_PATH, "r") as f:
            return json.load(f)
    except FileNotFoundError:
        return {}

def save_db(data):
    with open(DB_PATH, "w") as f:
        json.dump(data, f, indent=2)

def init_user(user_id):
    db = load_db()
    if user_id not in db:
        db[user_id] = {
            "atf": 100,
            "tools": 3,
            "currency": 5,
            "distance": 0,
            "speed": 1,
            "capacity": 5,
            "stamina": 1,
            "skin": "default"
        }
        save_db(db)

def start_game(user_id):
    init_user(user_id)
    db = load_db()
    user = db[user_id]
    log = "🚚 *Поездка началась!*
"

    while user["atf"] > 0:
        step = random.randint(1, 2 + user["speed"])
        user["distance"] += step
        user["atf"] -= random.randint(1, 4 - user["stamina"])

        chance = random.random()
        if chance < 0.2:
            user["atf"] += 15
            log += "🍺 Ты нашёл квас 'Яхонт' и восстановил ATF!
"
        elif chance < 0.4:
            user["currency"] += 1
            log += "💰 Ты нашёл 1 монету!
"
        elif chance < 0.5:
            if user["tools"] > 0:
                user["tools"] -= 1
                log += "🧰 Один инструмент выпал из телеги!
"

    log += f"❌ Ты устал. Пройдено: {user['distance']} метров."
    save_db(db)
    return log, user

def get_stats(user_id):
    db = load_db()
    user = db.get(user_id)
    if not user:
        return "Ты ещё не начинал игру!"
    return f"""
📊 *Твоя статистика:*
- ATF: {user['atf']}
- Инструменты: {user['tools']}
- Монеты: {user['currency']}
- Пройдено: {user['distance']}м
- Скорость: {user['speed']}
- Вместимость: {user['capacity']}
- Выносливость: {user['stamina']}
- Скин: {user['skin']}
"""

def shop_menu(user_id):
    db = load_db()
    user = db[user_id]
    return f"""🛒 *Магазин*
У тебя {user['currency']} 💰
Напиши команду:
- /upgrade speed
- /upgrade capacity
- /upgrade stamina
"""

def leaderboard_menu():
    db = load_db()
    top = sorted(db.items(), key=lambda x: x[1]["distance"], reverse=True)[:5]
    msg = "🏁 *Топ-5 игроков по расстоянию:*
"
    for i, (uid, u) in enumerate(top, 1):
        msg += f"{i}. ID {uid[-4:]} — {u['distance']} м
"
    return msg

def upgrade_stat(user_id, stat):
    db = load_db()
    user = db[user_id]
    if user["currency"] < 2:
        return "Недостаточно 💰 для улучшения!"
    user["currency"] -= 2
    user[stat] += 1
    save_db(db)
    return f"✅ {stat.capitalize()} прокачано! Теперь {user[stat]}"

def change_skin(user_id, skin):
    db = load_db()
    user = db[user_id]
    user["skin"] = skin
    save_db(db)
    return f"🎨 Скин изменён на: {skin}"