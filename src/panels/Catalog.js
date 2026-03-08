import React, { useState, useEffect } from 'react';
import { Panel, PanelHeader, Group, Div, Title, Text, Button, Card } from '@vkontakte/vkui';

export const Catalog = ({ id, setActivePanel }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [selectedType, setSelectedType] = useState(null); // 'offer' | 'learn'
  const [skillsOffer, setSkillsOffer] = useState(() => JSON.parse(localStorage.getItem('skillUnitySkillsOffer') || '[]'));
  const [skillsLearn, setSkillsLearn] = useState(() => JSON.parse(localStorage.getItem('skillUnitySkillsLearn') || '[]'));
  const levels = ['Начинающий', 'Средний', 'Продвинутый', 'Профессиональный'];

  const categories = {
    '🎨 Хобби': ['Рисование', 'Музыка', 'Фотография', 'Видеомонтаж'],
    '💻 Digital навыки': ['Маркетинг', 'SMM', 'Дизайн', 'Программирование'],
    '📚 Образование': ['Математика', 'История', 'Подготовка к экзаменам'],
    '🌍 Языки': ['Английский', 'Китайский', 'Испанский']
  };

  useEffect(() => {
    localStorage.setItem('skillUnitySkillsOffer', JSON.stringify(skillsOffer));
  }, [skillsOffer]);

  useEffect(() => {
    localStorage.setItem('skillUnitySkillsLearn', JSON.stringify(skillsLearn));
  }, [skillsLearn]);

  const addSkill = (level) => {
    const newSkill = { id: Date.now(), category: selectedCategory, skill: selectedSkill, level };
    if (selectedType === 'offer') setSkillsOffer(prev => [...prev, newSkill]);
    else setSkillsLearn(prev => [...prev, newSkill]);

    setSelectedCategory(null);
    setSelectedSkill(null);
    setSelectedType(null);
  };

  const deleteSkill = (id, type) => {
    if (type === 'offer') setSkillsOffer(prev => prev.filter(s => s.id !== id));
    else setSkillsLearn(prev => prev.filter(s => s.id !== id));
  };

  const renderSkillCard = (item, type) => (
    <Card key={item.id} className="glass-card" style={{ margin: 12 }}>
      <Div>
        <Title level="3">{item.skill}</Title>
        <Text style={{ opacity: 0.75 }}>{item.category}</Text>
        <div style={{ marginTop: 8, display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ background: '#111', color: '#fff', padding: '6px 10px', borderRadius: 12, opacity: .9 }}>{item.level}</span>
          <Button size="s" className="btn-green" onClick={() => { /* можно открыть редактор */ }}>Изменить</Button>
          <Button size="s" mode="destructive" onClick={() => deleteSkill(item.id, type)}>Удалить</Button>
        </div>
      </Div>
    </Card>
  );

  return (
    <Panel id={id} className="skill-background">
      <div className="skill-content">
        <PanelHeader className="neon-title">Каталог навыков</PanelHeader>

        {/* выбор типа */}
        {!selectedType && (
          <Group>
            <Div>
              <Title level="2" className="neon-title">Что вы хотите сделать?</Title>
            </Div>

            <Card className="glass-card" style={{ margin: 12 }}>
              <Div>
                <Title level="3">Могу научить</Title>
                <Button className="btn-green" stretched onClick={() => setSelectedType('offer')}>Добавить навык</Button>
              </Div>
            </Card>

            <Card className="glass-card" style={{ margin: 12 }}>
              <Div>
                <Title level="3">Хочу научиться</Title>
                <Button className="btn-yellow" stretched onClick={() => setSelectedType('learn')}>Добавить интерес</Button>
              </Div>
            </Card>
          </Group>
        )}

        {/* категории */}
        {selectedType && !selectedCategory && (
          <Group>
            <Div><Title level="2" className="neon-title">Выберите категорию</Title></Div>
            {Object.keys(categories).map(cat => (
              <Card key={cat} className="glass-card" style={{ margin: 12 }}>
                <Div>
                  <Title level="4">{cat}</Title>
                  <Button className="btn-green" stretched onClick={() => setSelectedCategory(cat)}>Выбрать</Button>
                </Div>
              </Card>
            ))}
            <Div style={{ marginTop: 8 }}>
              <Button mode="secondary" stretched onClick={() => setSelectedType(null)}>Назад</Button>
            </Div>
          </Group>
        )}

        {/* навыки */}
        {selectedCategory && !selectedSkill && (
          <Group>
            <Div><Title level="2" className="neon-title">Категория: {selectedCategory}</Title></Div>
            {categories[selectedCategory].map(sk => (
              <Card key={sk} className="glass-card" style={{ margin: 12 }}>
                <Div>
                  <Title level="4">{sk}</Title>
                  <Button className="btn-yellow" stretched onClick={() => setSelectedSkill(sk)}>Выбрать</Button>
                </Div>
              </Card>
            ))}
            <Div style={{ marginTop: 8 }}>
              <Button mode="secondary" stretched onClick={() => setSelectedCategory(null)}>Назад</Button>
            </Div>
          </Group>
        )}

        {/* уровень */}
        {selectedSkill && (
          <Group>
            <Div><Title level="2" className="neon-title">Навык: {selectedSkill}</Title></Div>
            {levels.map(lv => (
              <Card key={lv} className="glass-card" style={{ margin: 12 }}>
                <Div>
                  <Title level="4">{lv}</Title>
                  <Button className="btn-green" stretched onClick={() => addSkill(lv)}>Указать уровень</Button>
                </Div>
              </Card>
            ))}
            <Div style={{ marginTop: 8 }}>
              <Button mode="secondary" stretched onClick={() => setSelectedSkill(null)}>Назад</Button>
            </Div>
          </Group>
        )}

        {/* мои навыки */}
        {(skillsOffer.length > 0 || skillsLearn.length > 0) && (
          <Group>
            <Div><Title level="2" className="neon-title">Мои навыки</Title></Div>

            {skillsOffer.length > 0 && (
              <>
                <Div><Text weight="medium">Могу научить</Text></Div>
                {skillsOffer.map(s => renderSkillCard(s, 'offer'))}
              </>
            )}

            {skillsLearn.length > 0 && (
              <>
                <Div><Text weight="medium">Хочу научиться</Text></Div>
                {skillsLearn.map(s => renderSkillCard(s, 'learn'))}
              </>
            )}
          </Group>
        )}
      </div>
    </Panel>
  );
};

export default Catalog;