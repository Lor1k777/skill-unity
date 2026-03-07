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

import { supabase } from '../supabase';

export const Exchange = ({ id }) => {
  const [directory, setDirectory] = useState([]);
  const [categories, setCategories] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);

  const levels = ['Начинающий', 'Средний', 'Продвинутый', 'Профессиональный'];

  // Категории
  useEffect(() => {
    setCategories({
      '🎨 Хобби': ['Рисование', 'Музыка', 'Фотография', 'Видеомонтаж'],
      '💻 Digital навыки': ['Маркетинг', 'SMM', 'Дизайн', 'Программирование'],
      '📚 Образование': ['Математика', 'История', 'Подготовка к экзаменам'],
      '🌍 Языки': ['Английский', 'Китайский', 'Испанский']
    });
  }, []);

  // 🚀 Загружаем пользователей из Supabase
  useEffect(() => {
    const loadProfiles = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*');

      if (!error) {
        setDirectory(data);
      } else {
        console.log('Ошибка загрузки профилей', error);
      }
    };

    loadProfiles();
  }, []);

  // Фильтр поиска
  const matches = directory.filter((profile) => {
    if (!selectedCategory && !selectedSkill && !selectedLevel) return true;

    if (!profile.skills || profile.skills.length === 0) return false;

    const found = profile.skills.find((s) => {
      if (selectedSkill && s.skill !== selectedSkill) return false;
      if (selectedCategory && s.category !== selectedCategory) return false;

      if (selectedLevel) {
        const idxProfile = levels.indexOf(s.level);
        const idxSelected = levels.indexOf(selectedLevel);
        if (idxProfile < 0 || idxSelected < 0) return false;
        return idxProfile >= idxSelected;
      }

      return true;
    });

    return Boolean(found);
  });

  // открыть чат VK
  const openVKChat = async (userId) => {
    const link = `https://vk.com/im?sel=${userId}`;

    try {
      await bridge.send('VKWebAppOpenLink', { link });
    } catch {
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
          <Text>Выберите категорию / навык / уровень</Text>
        </Div>

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

        {selectedSkill && (
          <Div>
            <Title level="3" style={{ color: '#35CE53' }}>Навык: {selectedSkill}</Title>

            {levels.map((lv) => (
              <Card key={lv} mode="shadow" style={{ margin: 12 }}>
                <Div>
                  <Title level="4">{lv}</Title>
                  <Button
                    stretched
                    style={{ marginTop: 8, background: '#35CE53', color: '#080904' }}
                    onClick={() => setSelectedLevel(lv)}
                  >
                    Минимум: {lv}
                  </Button>
                </Div>
              </Card>
            ))}

            <Div>
              <Button stretched mode="secondary" onClick={() => {
                setSelectedSkill(null);
                setSelectedLevel(null);
              }}>
                Назад
              </Button>
            </Div>
          </Div>
        )}
      </Group>

      <Group>
        <Div>
          <Title level="2" style={{ color: '#35CE53' }}>Результаты</Title>
          <Text>{matches.length} пользователей найдено</Text>
        </Div>

        {matches.map((p) => (
          <Card key={p.vk_id} mode="shadow" style={{ margin: 12 }}>
            <Div style={{ display: 'flex', alignItems: 'center' }}>
              <Avatar size={64} src={p.avatar} />

              <Div style={{ marginLeft: 12 }}>
                <Title level="3">{p.name}</Title>
                <Text>{p.about || 'Пользователь не добавил описание.'}</Text>

                <Div style={{ marginTop: 6 }}>
                  {p.skills && p.skills.map((s, i) => (
                    <div key={i} style={{ fontSize: 13 }}>
                      • {s.skill} — {s.level}
                    </div>
                  ))}
                </Div>
              </Div>
            </Div>

            <Div>
              <Button
                stretched
                style={{ background: '#35CE53', color: '#080904' }}
                onClick={() => openVKChat(p.vk_id)}
              >
                ✉️ Написать в VK
              </Button>
            </Div>
          </Card>
        ))}
      </Group>
    </Panel>
  );
};