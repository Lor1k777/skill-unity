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
    } catch {
      window.open(link, '_blank');
    }

  };


  return (

    <Panel id={id} className="skill-background">

      <div className="skill-content">

        <PanelHeader />

        {/* ФИЛЬТР */}

        <Group>

          <Div>
            <Title level="2" className="neon-title">
              Фильтр поиска
            </Title>

            <Text className="small-muted">
              Выберите категорию, навык и минимальный уровень
            </Text>
          </Div>


          {!selectedCategory && (

            <Div>

              {Object.keys(categories).map(cat => (

                <Card key={cat} className="glass-card light">

                  <Div className="section">

                    <Title level="3">{cat}</Title>

                    <div className="card-actions">

                      <Button
                        className="btn-green"
                        stretched
                        onClick={() => setSelectedCategory(cat)}
                      >
                        Выбрать категорию
                      </Button>

                    </div>

                  </Div>

                </Card>

              ))}

            </Div>

          )}


          {selectedCategory && !selectedSkill && (

            <Div>

              <Div className="section">
                <Title level="2" className="neon-title">
                  {selectedCategory}
                </Title>
              </Div>

              {categories[selectedCategory].map(skill => (

                <Card key={skill} className="glass-card light">

                  <Div className="section">

                    <Title level="4">{skill}</Title>

                    <div className="card-actions">

                      <Button
                        className="btn-yellow"
                        stretched
                        onClick={() => setSelectedSkill(skill)}
                      >
                        Выбрать
                      </Button>

                    </div>

                  </Div>

                </Card>

              ))}

              <Div>

                <Button
                  mode="secondary"
                  stretched
                  onClick={() => setSelectedCategory(null)}
                >
                  Назад
                </Button>

              </Div>

            </Div>

          )}


          {selectedSkill && (

            <Div>

              <Div className="section">

                <Title level="2" className="neon-title">
                  Навык: {selectedSkill}
                </Title>

                <Text className="small-muted">
                  Минимальный уровень (опционально)
                </Text>

              </Div>

              {levels.map(level => (

                <Card key={level} className="glass-card light">

                  <Div className="section">

                    <Title level="4">{level}</Title>

                    <div className="card-actions">

                      <Button
                        className="btn-green"
                        stretched
                        onClick={() => setSelectedLevel(level)}
                      >
                        Выбрать уровень
                      </Button>

                    </div>

                  </Div>

                </Card>

              ))}

              <Div>

                <Button
                  mode="secondary"
                  stretched
                  onClick={() => {
                    setSelectedSkill(null);
                    setSelectedLevel(null);
                  }}
                >
                  Назад
                </Button>

              </Div>

            </Div>

          )}

        </Group>


        {/* РЕЗУЛЬТАТЫ */}

        <Group>

          <Div>
            <Title level="2" className="neon-title">
              Результаты
            </Title>
          </Div>


          {matches.length === 0 && (

            <Div>
              <Text>Совпадений не найдено</Text>
            </Div>

          )}


          {matches.map((p, idx) => (

            <Card key={p.id || idx} className="user-card">

              <Div style={{ display: 'flex', gap: 14 }}>

                <Avatar size={64} src={p.photo || p.avatar} />

                <div style={{ flex: 1 }}>

                  <Title level="3">
                    {p.name || `${p.first_name} ${p.last_name}`}
                  </Title>

                  <Text className="small-muted" style={{ marginTop: 6 }}>
                    {p.about || 'Информация отсутствует'}
                  </Text>

                  <div style={{ marginTop: 10 }}>

                    {p.skills && p.skills.length > 0 ? (

                      p.skills.map((s, i) => (
                        <span key={i} className="skill-badge" style={{ marginRight: 6 }}>
                          {s.skill} • {s.level}
                        </span>
                      ))

                    ) : (
                      <Text className="small-muted">Навыки не указаны</Text>
                    )}

                  </div>

                </div>

              </Div>


              <Div className="card-actions">

                <Button
                  className="btn-green"
                  stretched
                  onClick={() => openVKChat(p.vkId || p.id)}
                >
                  ✉️ Написать
                </Button>

                <Button
                  mode="secondary"
                  stretched
                  onClick={() => alert(JSON.stringify(p, null, 2))}
                >
                  Подробнее
                </Button>

              </Div>

            </Card>

          ))}

        </Group>

      </div>

    </Panel>

  );

};

export default Exchange;