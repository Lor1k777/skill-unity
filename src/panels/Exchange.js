// src/panels/Exchange.js
import { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';
import {
  Panel,
  PanelHeader,
  Group,
  Div,
  Title,
  Text,
  Card,
  Button,
  Avatar
} from '@vkontakte/vkui';

export const Exchange = ({ id, fetchedUser }) => {
  const [directory, setDirectory] = useState([]); // опубликованные профили других пользователей
  const [categories, setCategories] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const levels = ['Начинающий', 'Средний', 'Продвинутый', 'Профессиональный'];

  // Категории — синхронизуем с теми, что в Catalog (если изменишь в Catalog, обновляй здесь)
  useEffect(() => {
    setCategories({
      '🎨 Хобби': ['Рисование', 'Музыка', 'Фотография', 'Видеомонтаж'],
      '💻 Digital навыки': ['Маркетинг', 'SMM', 'Дизайн', 'Программирование'],
      '📚 Образование': ['Математика', 'История', 'Подготовка к экзаменам'],
      '🌍 Языки': ['Английский', 'Китайский', 'Испанский']
    });
  }, []);

  // Загружаем директорию опубликованных профилей
  useEffect(() => {
    const saved = localStorage.getItem('skillUnityDirectory');
    setDirectory(saved ? JSON.parse(saved) : []);
  }, []);

  // Фильтрация: находим совпадения
  const matches = directory.filter((profile) => {
    // если не выбрано ничего — показываем всех
    if (!selectedCategory && !selectedSkill && !selectedLevel) return true;

    // проверяем наличие навыков профиля
    if (!profile.skills || profile.skills.length === 0) return false;

    // ищем совпадающий навык
    const found = profile.skills.find((s) => {
      if (selectedSkill && s.skill !== selectedSkill) return false;
      if (selectedCategory && s.category !== selectedCategory) return false;
      if (selectedLevel) {
        // сравним уровни по индексу (принимаем равный или выше)
        const idxProfile = levels.indexOf(s.level);
        const idxSelected = levels.indexOf(selectedLevel);
        if (idxProfile < 0 || idxSelected < 0) return false;
        return idxProfile >= idxSelected;
      }
      return true;
    });

    return Boolean(found);
  });

  // Открыть диалог в VK с пользователем (открывает страницу сообщений)
  const openVKChat = async (userId) => {
    const link = `https://vk.com/im?sel=${userId}`;
    try {
      await bridge.send('VKWebAppOpenLink', { link });
    } catch (e) {
      console.log('open link error', e);
      // fallback: открыть обычную ссылку (в браузере)
      window.open(link, '_blank');
    }
  };

  return (
    <Panel id={id} style={{ background: '#080904', color: 'white' }}>
      <PanelHeader style={{ background: '#080904', color: '#35CE53', fontWeight: 'bold' }}>
        Найти собеседника
      </PanelHeader>

      <Group>
        <Div>
          <Title level="2" style={{ color: '#35CE53' }}>Фильтр поиска</Title>
          <Text>Выберите категорию / навык / минимальный уровень</Text>
        </Div>

        {/* Категории */}
        {!selectedCategory && (
          <Div>
            {Object.keys(categories).map((cat) => (
              <Card key={cat} mode="shadow" style={{ margin: 12 }}>
                <Div>
                  <Title level="3">{cat}</Title>
                  <Button
                    stretched
                    style={{ marginTop: 8, background: '#35CE53', color: '#080904' }}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    Выбрать категорию
                  </Button>
                </Div>
              </Card>
            ))}
          </Div>
        )}

        {/* Навыки в категории */}
        {selectedCategory && !selectedSkill && (
          <Div>
            <Title level="3" style={{ color: '#35CE53' }}>Категория: {selectedCategory}</Title>
            {categories[selectedCategory].map((sk) => (
              <Card key={sk} mode="shadow" style={{ margin: 12 }}>
                <Div>
                  <Title level="4">{sk}</Title>
                  <Button
                    stretched
                    style={{ marginTop: 8, background: '#FEE21F', color: '#080904' }}
                    onClick={() => setSelectedSkill(sk)}
                  >
                    По навыку: {sk}
                  </Button>
                </Div>
              </Card>
            ))}

            <Div>
              <Button stretched mode="secondary" onClick={() => setSelectedCategory(null)}>
                Назад
              </Button>
            </Div>
          </Div>
        )}

        {/* Уровень (опционально) */}
        {selectedSkill && (
          <Div>
            <Title level="3" style={{ color: '#35CE53' }}>Навык: {selectedSkill}</Title>
            <Text>Минимальный уровень для поиска (опционально)</Text>

            {levels.map((lv) => (
              <Card key={lv} mode="shadow" style={{ margin: 12 }}>
                <Div>
                  <Title level="4">{lv}</Title>
                  <Button
                    stretched
                    style={{ marginTop: 8, background: '#35CE53', color: '#080904' }}
                    onClick={() => setSelectedLevel(lv)}
                  >
                    Установить {lv}
                  </Button>
                </Div>
              </Card>
            ))}

            <Div style={{ marginTop: 8 }}>
              <Button stretched mode="secondary" onClick={() => { setSelectedSkill(null); setSelectedLevel(null); }}>
                Назад
              </Button>
            </Div>
          </Div>
        )}
      </Group>

      {/* Результаты поиска */}
      <Group>
        <Div>
          <Title level="2" style={{ color: '#35CE53' }}>Результаты</Title>
          <Text>{selectedSkill ? `По запросу: ${selectedSkill}${selectedLevel ? ` (минимум: ${selectedLevel})` : ''}` : 'Все опубликованные профили'}</Text>
        </Div>

        {matches.length === 0 && (
          <Div>
            <Text>Совпадений не найдено. Попробуйте убрать фильтры.</Text>
          </Div>
        )}

        {matches.map((p) => (
          <Card key={p.id || p.vkId || p.name} mode="shadow" style={{ margin: 12 }}>
            <Div style={{ display: 'flex', alignItems: 'center' }}>
              <Avatar size={64} src={p.photo || p.photo_200} />
              <Div style={{ marginLeft: 12, flex: 1 }}>
                <Title level="3">{p.name || `${p.first_name} ${p.last_name}`}</Title>
                <Text style={{ marginTop: 6 }}>{p.about || 'Пользователь не добавил информацию "Обо мне".'}</Text>
                <Div style={{ marginTop: 8 }}>
                  <Text weight="regular">Навыки:</Text>
                  {p.skills && p.skills.length > 0 ? (
                    p.skills.map((s, i) => (
                      <div key={i} style={{ fontSize: 13, marginTop: 4 }}>
                        • {s.skill} — <i>{s.level}</i>
                      </div>
                    ))
                  ) : (
                    <div style={{ fontSize: 13, marginTop: 4 }}>— нет навыков</div>
                  )}
                </Div>
              </Div>
            </Div>

            <Div style={{ display: 'flex', gap: 8 }}>
              {/* Написать в VK */}
              <Button
                stretched
                style={{ background: '#35CE53', color: '#080904' }}
                onClick={() => openVKChat(p.vkId || p.id)}
              >
                ✉️ Написать в VK
              </Button>

              {/* Просмотр расширенного профиля (в отдельном окне / подробно) */}
              <Button
                stretched
                mode="secondary"
                onClick={() => {
                  // Открываем профиль (отправим в Profile панель и можно реализовать view)
                  // Для простоты: попроcим показать alert с полной информацией (в будущем можно реализовать подробный просмотр)
                  const skillsText = p.skills && p.skills.length > 0 ? p.skills.map(s => `${s.skill} (${s.level})`).join('\n') : 'Нет навыков';
                  alert(`${p.name || 'Пользователь'}\n\nОбо мне:\n${p.about || '—'}\n\nНавыки:\n${skillsText}\n\nVK id: ${p.vkId || '—'}`);
                }}
              >
                👤 Подробнее
              </Button>
            </Div>
          </Card>
        ))}
      </Group>
    </Panel>
  );
};