import React, { useState, useEffect } from 'react';

export default function App() {
  const [atf, setATF] = useState(0);
  const [clickPower, setClickPower] = useState(1);
  const [autoATF, setAutoATF] = useState(0);

  // Уровень игрока
  const [level, setLevel] = useState(1);
  const [xp, setXP] = useState(0);
  const getXpForNextLevel = () => level * 100;

  // Уровни улучшений
  const [wellLevel, setWellLevel] = useState(0);
  const [pipeLevel, setPipeLevel] = useState(0);
  const [pumpLevel, setPumpLevel] = useState(0);
  const [filterLevel, setFilterLevel] = useState(0);
  const [workerLevel, setWorkerLevel] = useState(0);

  // Статус миссий
  const [missions, setMissions] = useState([
    { id: 1, title: "Собери 50 ATF", target: 50, progress: 0, completed: false },
    { id: 2, title: "Собери 100 ATF", target: 100, progress: 0, completed: false },
    { id: 3, title: "Нажми 10 раз", target: 10, progress: 0, completed: false },
  ]);

  // Достижения
  const [achievements, setAchievements] = useState([
    { id: 1, title: "Первый клик", unlocked: false },
    { id: 2, title: "Миллион ATF!", unlocked: false },
    { id: 3, title: "Инженер уровня 3", unlocked: false },
  ]);

  // События
  const [event, setEvent] = useState(null);
  const [showNotification, setShowNotification] = useState(false);

  // Автоматическое производство
  useEffect(() => {
    if (autoATF > 0) {
      const interval = setInterval(() => {
        setATF((prev) => prev + autoATF);
        checkXPGain(autoATF);
        checkMissionProgress('atf', autoATF);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [autoATF]);

  // Проверка XP
  const checkXPGain = (amount) => {
    setXP((prev) => {
      const newXP = prev + amount;
      if (newXP >= getXpForNextLevel()) {
        setLevel((l) => l + 1);
        setXP(0);
        triggerEvent(`Вы достигли уровня ${level + 1}!`);
        checkAchievement(1);
      } else {
        return newXP;
      }
    });
  };

  // Клик
  const collectATF = () => {
    setATF((prev) => prev + clickPower);
    checkXPGain(clickPower);
    checkMissionProgress('click');
    checkAchievement(1);
  };

  // Прокачка
  const buyUpgrade = (type) => {
    switch (type) {
      case 'well':
        if (atf >= getWellCost()) {
          setATF((prev) => prev - getWellCost());
          setClickPower((prev) => prev + 1);
          setWellLevel((prev) => prev + 1);
        } else alert('Недостаточно ATF!');
        break;
      case 'pipe':
        if (atf >= getPipeCost()) {
          setATF((prev) => prev - getPipeCost());
          setAutoATF((prev) => prev + 1);
          setPipeLevel((prev) => prev + 1);
        } else alert('Недостаточно ATF!');
        break;
      case 'pump':
        if (atf >= getPumpCost()) {
          setATF((prev) => prev - getPumpCost());
          setAutoATF((prev) => prev + 3);
          setPumpLevel((prev) => prev + 1);
        } else alert('Недостаточно ATF!');
        break;
      case 'filter':
        if (atf >= getFilterCost()) {
          setATF((prev) => prev - getFilterCost());
          setAutoATF((prev) => prev + 5);
          setFilterLevel((prev) => prev + 1);
        } else alert('Недостаточно ATF!');
        break;
      case 'worker':
        if (atf >= getWorkerCost()) {
          setATF((prev) => prev - getWorkerCost());
          setClickPower((prev) => prev + 2);
          setWorkerLevel((prev) => prev + 1);
        } else alert('Недостаточно ATF!');
        break;
      default:
        break;
    }
  };

  // Проверка выполнения миссий
  const checkMissionProgress = (type, value = 1) => {
    setMissions((list) =>
      list.map((m) => {
        if (type === 'click') {
          return { ...m, progress: m.progress + 1 };
        } else if (type === 'atf') {
          return { ...m, progress: m.progress + value };
        }
        return m;
      })
    );
  };

  // Проверка достижений
  const checkAchievement = (id) => {
    if (id === 1 && !achievements[0].unlocked) {
      setAchievements((a) => {
        const updated = [...a];
        updated[0].unlocked = true;
        triggerEvent("Достижение разблокировано: Первый клик!");
        return updated;
      });
    }
    if (atf >= 1000000 && !achievements[1].unlocked) {
      setAchievements((a) => {
        const updated = [...a];
        updated[1].unlocked = true;
        triggerEvent("Достижение разблокировано: Миллион ATF!");
        return updated;
      });
    }
    if (workerLevel >= 3 && !achievements[2].unlocked) {
      setAchievements((a) => {
        const updated = [...a];
        updated[2].unlocked = true;
        triggerEvent("Достижение разблокировано: Инженер уровня 3!");
        return updated;
      });
    }
  };

  // Случайное событие
  const triggerEvent = (msg) => {
    setEvent(msg);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  // Стоимость улучшений
  const getWellCost = () => 10 * Math.pow(2, wellLevel);
  const getPipeCost = () => 50 * Math.pow(2, pipeLevel);
  const getPumpCost = () => 100 * Math.pow(2, pumpLevel);
  const getFilterCost = () => 200 * Math.pow(2, filterLevel);
  const getWorkerCost = () => 75 * Math.pow(2, workerLevel);

  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-hidden relative">
      {/* Фон стройки */}
      <div className="absolute inset-0 bg-construction z-0"></div>

      {/* Основной контент */}
      <div className="relative z-10 flex flex-col items-center pt-12 pb-8 px-4 max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold tracking-wider mb-2">🔧 ATF Clicker</h1>
        <p className="text-sm opacity-70 mb-6">Станьте мастером водопровода!</p>

        {/* Счётчик ATF и XP */}
        <div className="text-3xl font-extrabold mb-4 animate-pulse">
          ATF: <span>{Math.floor(atf)}</span>
        </div>
        <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden mb-6">
          <div
            className="bg-blue-500 h-full transition-all"
            style={{ width: `${(xp / getXpForNextLevel()) * 100}%` }}
          ></div>
        </div>
        <div className="text-sm opacity-80 mb-8">Уровень: {level}</div>

        {/* Кнопка клика */}
        <button
          onClick={collectATF}
          className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 shadow-lg transform transition hover:scale-105 active:scale-95 flex items-center justify-center mb-8"
        >
          <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
          </svg>
        </button>

        {/* Блок улучшений */}
        <div className="w-full space-y-4 bg-black/30 backdrop-blur-sm p-4 rounded-xl mb-8">
          <h2 className="text-xl font-semibold border-b border-gray-600 pb-2">Улучшения</h2>
          <UpgradeCard
            title="Колодец I"
            description="+1 ATF на клик"
            level={wellLevel}
            cost={getWellCost()}
            onBuy={() => buyUpgrade('well')}
          />
          <UpgradeCard
            title="Труба I"
            description="+1 ATF/сек"
            level={pipeLevel}
            cost={getPipeCost()}
            onBuy={() => buyUpgrade('pipe')}
          />
          <UpgradeCard
            title="Насос I"
            description="+3 ATF/сек"
            level={pumpLevel}
            cost={getPumpCost()}
            onBuy={() => buyUpgrade('pump')}
          />
          <UpgradeCard
            title="Фильтр I"
            description="+5 ATF/сек"
            level={filterLevel}
            cost={getFilterCost()}
            onBuy={() => buyUpgrade('filter')}
          />
          <UpgradeCard
            title="Рабочий I"
            description="+2 ATF на клик"
            level={workerLevel}
            cost={getWorkerCost()}
            onBuy={() => buyUpgrade('worker')}
          />
        </div>

        {/* Миссии */}
        <div className="w-full space-y-4 bg-black/30 backdrop-blur-sm p-4 rounded-xl mb-8">
          <h2 className="text-xl font-semibold border-b border-gray-600 pb-2">Миссии</h2>
          {missions.map((m) => (
            <Mission key={m.id} mission={m} />
          ))}
        </div>

        {/* Достижения */}
        <div className="w-full space-y-4 bg-black/30 backdrop-blur-sm p-4 rounded-xl mb-8">
          <h2 className="text-xl font-semibold border-b border-gray-600 pb-2">Достижения</h2>
          {achievements.map((a) => (
            <Achievement key={a.id} achievement={a} />
          ))}
        </div>

        {/* Уведомление */}
        {showNotification && (
          <div className="fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded shadow-lg animate-fade-in-down">
            {event}
          </div>
        )}

        <footer className="mt-8 text-center text-xs opacity-60">
          © 2025 ATF Clicker | Строим будущее вместе
        </footer>
      </div>
    </div>
  );
}

// Компонент миссии
function Mission({ mission }) {
  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-3">
      <div className="font-bold">{mission.title}</div>
      <div className="text-sm opacity-80">
        Прогресс: {mission.progress}/{mission.target}
      </div>
      <div className="w-full bg-gray-700 h-2 rounded-full mt-1 overflow-hidden">
        <div
          className="bg-yellow-500 h-full transition-all"
          style={{ width: `${(mission.progress / mission.target) * 100}%` }}
        ></div>
      </div>
    </div>
  );
}

// Компонент достижения
function Achievement({ achievement }) {
  return (
    <div
      className={`bg-gray-800/50 border border-gray-700 rounded-lg p-3 ${
        achievement.unlocked ? 'opacity-100' : 'opacity-50'
      }`}
    >
      <div className="font-bold">{achievement.title}</div>
      <div className="text-sm opacity-80">
        {achievement.unlocked ? 'Разблокировано!' : 'Не разблокировано'}
      </div>
    </div>
  );
}

// Компонент улучшения
function UpgradeCard({ title, description, level, cost, onBuy }) {
  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 flex justify-between items-center hover:bg-gray-700/50 transition">
      <div>
        <h3 className="font-bold">{title}</h3>
        <p className="text-sm opacity-80">{description}</p>
        <p className="text-xs mt-1">Уровень: {level}</p>
      </div>
      <div className="text-right">
        <p className="text-sm">Цена: {cost}</p>
        <button
          onClick={onBuy}
          className="mt-1 px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded shadow"
        >
          Купить
        </button>
      </div>
    </div>
  );
}