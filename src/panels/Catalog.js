import React, { useState, useEffect } from 'react';
import { Panel, PanelHeader, Group, Div, Title, Text, Button, Card } from '@vkontakte/vkui';

export const Catalog = ({ id }) => {

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [selectedType, setSelectedType] = useState(null);

  const [skillsOffer, setSkillsOffer] = useState(() =>
    JSON.parse(localStorage.getItem('skillUnitySkillsOffer') || '[]')
  );

  const [skillsLearn, setSkillsLearn] = useState(() =>
    JSON.parse(localStorage.getItem('skillUnitySkillsLearn') || '[]')
  );

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

    const newSkill = {
      id: Date.now(),
      category: selectedCategory,
      skill: selectedSkill,
      level
    };

    if (selectedType === 'offer') {
      setSkillsOffer(prev => [...prev, newSkill]);
    } else {
      setSkillsLearn(prev => [...prev, newSkill]);
    }

    setSelectedCategory(null);
    setSelectedSkill(null);
    setSelectedType(null);
  };

  const deleteSkill = (id, type) => {

    if (type === 'offer') {
      setSkillsOffer(prev => prev.filter(s => s.id !== id));
    } else {
      setSkillsLearn(prev => prev.filter(s => s.id !== id));
    }
  };

  const renderSkillCard = (item, type) => (

    <Card key={item.id} className="glass-card light" style={{ marginBottom: 14 }}>
      <Div>

        <Title level="3">{item.skill}</Title>
        <Text className="small-muted">{item.category}</Text>

        <div className="card-actions">

          <span className="skill-badge">
            {item.level}
          </span>

          <Button size="s" className="btn-green">
            Изменить
          </Button>

          <Button
            size="s"
            mode="destructive"
            onClick={() => deleteSkill(item.id, type)}
          >
            Удалить
          </Button>

        </div>

      </Div>
    </Card>
  );

  return (

    <Panel id={id} className="skill-background">

      <div className="skill-content">

        <PanelHeader />

        {/* выбор действия */}

        {!selectedType && (

          <Group>

            <Div>
              <Title level="2" className="neon-title">
                Что вы хотите сделать?
              </Title>
            </Div>

            <Card className="glass-card light">

              <Div className="section">

                <Title level="3">Могу научить</Title>

                <div className="card-actions">

                  <Button
                    className="btn-green"
                    stretched
                    onClick={() => setSelectedType('offer')}
                  >
                    Добавить навык
                  </Button>

                </div>

              </Div>

            </Card>


            <Card className="glass-card light">

              <Div className="section">

                <Title level="3">Хочу научиться</Title>

                <div className="card-actions">

                  <Button
                    className="btn-yellow"
                    stretched
                    onClick={() => setSelectedType('learn')}
                  >
                    Добавить интерес
                  </Button>

                </div>

              </Div>

            </Card>

          </Group>

        )}


        {/* выбор категории */}

        {selectedType && !selectedCategory && (

          <Group>

            <Div>
              <Title level="2" className="neon-title">
                Выберите категорию
              </Title>
            </Div>

            {Object.keys(categories).map(cat => (

              <Card key={cat} className="glass-card light">

                <Div className="section">

                  <Title level="4">{cat}</Title>

                  <div className="card-actions">

                    <Button
                      className="btn-green"
                      stretched
                      onClick={() => setSelectedCategory(cat)}
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
                onClick={() => setSelectedType(null)}
              >
                Назад
              </Button>

            </Div>

          </Group>

        )}


        {/* выбор навыка */}

        {selectedCategory && !selectedSkill && (

          <Group>

            <Div>
              <Title level="2" className="neon-title">
                Категория: {selectedCategory}
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

          </Group>

        )}


        {/* выбор уровня */}

        {selectedSkill && (

          <Group>

            <Div>
              <Title level="2" className="neon-title">
                Навык: {selectedSkill}
              </Title>
            </Div>

            {levels.map(level => (

              <Card key={level} className="glass-card light">

                <Div className="section">

                  <Title level="4">{level}</Title>

                  <div className="card-actions">

                    <Button
                      className="btn-green"
                      stretched
                      onClick={() => addSkill(level)}
                    >
                      Указать уровень
                    </Button>

                  </div>

                </Div>

              </Card>

            ))}

            <Div>

              <Button
                mode="secondary"
                stretched
                onClick={() => setSelectedSkill(null)}
              >
                Назад
              </Button>

            </Div>

          </Group>

        )}


        {/* мои навыки */}

        {(skillsOffer.length > 0 || skillsLearn.length > 0) && (

          <Group>

            <Div>
              <Title level="2" className="neon-title">
                Мои навыки
              </Title>
            </Div>


            {skillsOffer.length > 0 && (

              <>
                <Div>
                  <Text weight="medium">Могу научить</Text>
                </Div>

                {skillsOffer.map(skill => renderSkillCard(skill, 'offer'))}
              </>

            )}


            {skillsLearn.length > 0 && (

              <>
                <Div>
                  <Text weight="medium">Хочу научиться</Text>
                </Div>

                {skillsLearn.map(skill => renderSkillCard(skill, 'learn'))}
              </>

            )}

          </Group>

        )}

      </div>

    </Panel>
  );
};

export default Catalog;