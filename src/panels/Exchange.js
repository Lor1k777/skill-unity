import React, { useEffect, useState } from 'react';
import bridge from '@vkontakte/vk-bridge';
import { Panel, PanelHeader, Group, Div, Title, Text, Card, Button, Avatar } from '@vkontakte/vkui';

export const Exchange = ({ id }) => {
  const [directory, setDirectory] = useState([]);
  const [categories, setCategories] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);

  const levels = ['Начинающий', 'Средний', 'Продвинутый', 'Профессиональный'];

  useEffect(() => {
    setCategories({
      '🎨 Хобби': ['Рисование', 'Музыка', 'Фотография', 'Видеомонтаж'],
      '💻 Digital навыки': ['Маркетинг', 'SMM', 'Дизайн', 'Программирование'],
      '📚 Образование': ['Математика', 'История', 'Подготовка к экзаменам'],
      '🌍 Языки': ['Английский', 'Китайский', 'Испанский']
    });

    const saved = JSON.parse(localStorage.getItem('skillUnityDirectory') || '[]');
    setDirectory(saved);
  }, []);

  const matches = directory.filter(profile => {
    if (!selectedCategory && !selectedSkill && !selectedLevel) return true;
    if (!profile.skills || profile.skills.length === 0) return false;
    return profile.skills.some(s => {
      if (selectedSkill && s.skill !== selectedSkill) return false;
      if (selectedCategory && s.category !== selectedCategory) return false;
      if (selectedLevel) {
        const idxProfile = levels.indexOf(s.level);
        const idxSelected = levels.indexOf(selectedLevel);
        return idxProfile >= idxSelected;
      }
      return true;
    });
  });

  const openVKChat = async (userId) => {
    const link = `https://vk.com/im?sel=${userId}`;
    try {
      await bridge.send('VKWebAppOpenLink', { link });
    } catch (e) {
      window.open(link, '_blank');
    }
  };

  return (
    <Panel id={id} className="skill-background">
      <div className="skill-content">
        <PanelHeader className="neon-title">Найти собеседника</PanelHeader>

        <Group>
          <Div>
            <Title level="2" className="neon-title">Фильтр поиска</Title>
            <Text>Выберите категорию / навык / минимальный уровень</Text>
          </Div>

          {!selectedCategory && (
            <Div>
              {Object.keys(categories).map(cat => (
                <Card key={cat} className="glass-card" style={{ margin: 12 }}>
                  <Div>
                    <Title level="3">{cat}</Title>
                    <Button className="btn-green" stretched onClick={() => setSelectedCategory(cat)}>Выбрать категорию</Button>
                  </Div>
                </Card>
              ))}
            </Div>
          )}

          {selectedCategory && !selectedSkill && (
            <Div>
              <Title level="3" style={{ color: '#35CE53' }}>Категория: {selectedCategory}</Title>
              {categories[selectedCategory].map(sk => (
                <Card key={sk} className="glass-card" style={{ margin: 12 }}>
                  <Div>
                    <Title level="4">{sk}</Title>
                    <Button className="btn-yellow" stretched onClick={() => setSelectedSkill(sk)}>По навыку: {sk}</Button>
                  </Div>
                </Card>
              ))}
              <Div style={{ marginTop: 8 }}>
                <Button mode="secondary" stretched onClick={() => setSelectedCategory(null)}>Назад</Button>
              </Div>
            </Div>
          )}

          {selectedSkill && (
            <Div>
              <Title level="3" className="neon-title">Навык: {selectedSkill}</Title>
              <Text>Минимальный уровень (опционально)</Text>
              {levels.map(lv => (
                <Card key={lv} className="glass-card" style={{ margin: 12 }}>
                  <Div>
                    <Title level="4">{lv}</Title>
                    <Button className="btn-green" stretched onClick={() => setSelectedLevel(lv)}>Установить {lv}</Button>
                  </Div>
                </Card>
              ))}
              <Div style={{ marginTop: 8 }}>
                <Button mode="secondary" stretched onClick={() => { setSelectedSkill(null); setSelectedLevel(null); }}>Назад</Button>
              </Div>
            </Div>
          )}
        </Group>

        <Group>
          <Div><Title level="2" className="neon-title">Результаты</Title></Div>

          {matches.length === 0 && (
            <Div><Text>Совпадений не найдено.</Text></Div>
          )}

          {matches.map((p, idx) => (
            <Card key={p.id || idx} className="user-card" style={{ margin: 12 }}>
              <Div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <Avatar size={64} src={p.photo || p.avatar} />
                <div style={{ flex: 1 }}>
                  <Title level="3">{p.name || `${p.first_name} ${p.last_name}`}</Title>
                  <Text style={{ marginTop: 6 }}>{p.about || '—'}</Text>
                  <div style={{ marginTop: 8 }}>
                    <Text weight="regular">Навыки:</Text>
                    {p.skills && p.skills.length > 0 ? p.skills.map((s,i) => <div key={i} style={{ fontSize: 13 }}>• {s.skill} — <i>{s.level}</i></div>) : <div style={{ fontSize: 13 }}>— нет навыков</div>}
                  </div>
                </div>
              </Div>

              <Div style={{ display: 'flex', gap: 8 }}>
                <Button className="btn-green" stretched onClick={() => openVKChat(p.vkId || p.id)}>✉️ Написать в VK</Button>
                <Button mode="secondary" stretched onClick={() => alert(JSON.stringify(p, null, 2))}>👤 Подробнее</Button>
              </Div>
            </Card>
          ))}

        </Group>
      </div>
    </Panel>
  );
};

export default Exchange;