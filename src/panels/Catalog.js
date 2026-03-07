import { useState, useEffect } from 'react';
import {
  Panel,
  PanelHeader,
  Group,
  Div,
  Title,
  Text,
  Button,
  Card
} from '@vkontakte/vkui';

export const Catalog = ({ id }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [selectedType, setSelectedType] = useState(null); // offer | learn
  const [successMessage, setSuccessMessage] = useState(false);
  const [editingSkillId, setEditingSkillId] = useState(null);

  const [skillsOffer, setSkillsOffer] = useState(() => {
    const saved = localStorage.getItem('skillUnitySkillsOffer');
    return saved ? JSON.parse(saved) : [];
  });

  const [skillsLearn, setSkillsLearn] = useState(() => {
    const saved = localStorage.getItem('skillUnitySkillsLearn');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('skillUnitySkillsOffer', JSON.stringify(skillsOffer));
  }, [skillsOffer]);

  useEffect(() => {
    localStorage.setItem('skillUnitySkillsLearn', JSON.stringify(skillsLearn));
  }, [skillsLearn]);

  const categories = {
    '🎨 Хобби': ['Рисование', 'Музыка', 'Фотография', 'Видеомонтаж'],
    '💻 Digital навыки': ['Маркетинг', 'SMM', 'Дизайн', 'Программирование'],
    '📚 Образование': ['Математика', 'История', 'Подготовка к экзаменам'],
    '🌍 Языки': ['Английский', 'Китайский', 'Испанский']
  };

  const levels = ['Начинающий', 'Средний', 'Продвинутый', 'Профессиональный'];

  const handleSelectLevel = (level) => {
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

    setSuccessMessage(true);
    setSelectedCategory(null);
    setSelectedSkill(null);
    setSelectedType(null);

    setTimeout(() => setSuccessMessage(false), 2000);
  };

  const handleDeleteSkill = (id, type) => {
    if (type === 'offer') {
      setSkillsOffer(prev => prev.filter(skill => skill.id !== id));
    } else {
      setSkillsLearn(prev => prev.filter(skill => skill.id !== id));
    }
  };

  const startEditing = (id) => {
    setEditingSkillId(id);
  };

  const updateSkillLevel = (id, newLevel, type) => {
    if (type === 'offer') {
      setSkillsOffer(prev =>
        prev.map(skill =>
          skill.id === id ? { ...skill, level: newLevel } : skill
        )
      );
    } else {
      setSkillsLearn(prev =>
        prev.map(skill =>
          skill.id === id ? { ...skill, level: newLevel } : skill
        )
      );
    }

    setEditingSkillId(null);
  };

  const renderSkillCard = (item, type) => (
    <Card key={item.id} mode="shadow" style={{ margin: 12 }}>
      <Div>
        <Title level="3">{item.skill}</Title>
        <Text>Категория: {item.category}</Text>
        <Text>Уровень: {item.level}</Text>

        {editingSkillId === item.id ? (
          <Div style={{ marginTop: 12 }}>
            {levels.map(level => (
              <Button
                key={level}
                size="s"
                style={{
                  marginRight: 6,
                  marginBottom: 6,
                  background: '#FEE21F',
                  color: '#080904'
                }}
                onClick={() => updateSkillLevel(item.id, level, type)}
              >
                {level}
              </Button>
            ))}
          </Div>
        ) : (
          <Div style={{ marginTop: 12 }}>
            <Button
              size="m"
              style={{
                marginRight: 8,
                background: '#35CE53',
                color: '#080904'
              }}
              onClick={() => startEditing(item.id)}
            >
              ✏️ Редактировать
            </Button>

            <Button
              size="m"
              mode="destructive"
              onClick={() => handleDeleteSkill(item.id, type)}
            >
              🗑 Удалить
            </Button>
          </Div>
        )}
      </Div>
    </Card>
  );

  return (
    <Panel id={id} style={{ background: '#080904', color: 'white' }}>
      <PanelHeader
        style={{
          background: '#080904',
          color: '#35CE53',
          fontWeight: 'bold'
        }}
      >
        Каталог навыков
      </PanelHeader>

      {successMessage && (
        <Group>
          <Div>
            <Title level="2" style={{ color: '#35CE53' }}>
              Навык добавлен 🎉
            </Title>
            <Text>Навык успешно добавлен в профиль</Text>
          </Div>
        </Group>
      )}

      {!selectedType && (
        <Group>
          <Div>
            <Title level="2" style={{ color: '#35CE53' }}>
              Что вы хотите сделать?
            </Title>
          </Div>

          <Card mode="shadow" style={{ margin: 12 }}>
            <Div>
              <Title level="3">Могу научить</Title>
              <Button
                stretched
                style={{
                  marginTop: 10,
                  background: '#35CE53',
                  color: '#080904'
                }}
                onClick={() => setSelectedType('offer')}
              >
                Добавить навык
              </Button>
            </Div>
          </Card>

          <Card mode="shadow" style={{ margin: 12 }}>
            <Div>
              <Title level="3">Хочу научиться</Title>
              <Button
                stretched
                style={{
                  marginTop: 10,
                  background: '#FEE21F',
                  color: '#080904'
                }}
                onClick={() => setSelectedType('learn')}
              >
                Добавить интерес
              </Button>
            </Div>
          </Card>
        </Group>
      )}

      {selectedType && !selectedCategory && !selectedSkill && (
        <Group>
          <Div>
            <Title level="2" style={{ color: '#35CE53' }}>
              Выберите категорию
            </Title>
          </Div>

          {Object.keys(categories).map(category => (
            <Card key={category} mode="shadow" style={{ margin: 12 }}>
              <Div>
                <Title level="3">{category}</Title>
                <Button
                  stretched
                  style={{
                    marginTop: 10,
                    background: '#35CE53',
                    color: '#080904'
                  }}
                  onClick={() => setSelectedCategory(category)}
                >
                  Выбрать
                </Button>
              </Div>
            </Card>
          ))}
        </Group>
      )}

      {selectedCategory && !selectedSkill && (
        <Group>
          <Div>
            <Title level="2" style={{ color: '#35CE53' }}>
              Категория: {selectedCategory}
            </Title>
          </Div>

          {categories[selectedCategory].map(skill => (
            <Card key={skill} mode="shadow" style={{ margin: 12 }}>
              <Div>
                <Title level="3">{skill}</Title>
                <Button
                  stretched
                  style={{
                    marginTop: 10,
                    background: '#FEE21F',
                    color: '#080904'
                  }}
                  onClick={() => setSelectedSkill(skill)}
                >
                  Выбрать
                </Button>
              </Div>
            </Card>
          ))}
        </Group>
      )}

      {selectedSkill && (
        <Group>
          <Div>
            <Title level="2" style={{ color: '#35CE53' }}>
              Уровень навыка
            </Title>
          </Div>

          {levels.map(level => (
            <Card key={level} mode="shadow" style={{ margin: 12 }}>
              <Div>
                <Title level="3">{level}</Title>
                <Button
                  stretched
                  style={{
                    marginTop: 10,
                    background: '#35CE53',
                    color: '#080904'
                  }}
                  onClick={() => handleSelectLevel(level)}
                >
                  Выбрать уровень
                </Button>
              </Div>
            </Card>
          ))}
        </Group>
      )}

      {skillsOffer.length > 0 && (
        <Group>
          <Div>
            <Title level="2" style={{ color: '#35CE53' }}>
              Могу научить
            </Title>
          </Div>
          {skillsOffer.map(skill => renderSkillCard(skill, 'offer'))}
        </Group>
      )}

      {skillsLearn.length > 0 && (
        <Group>
          <Div>
            <Title level="2" style={{ color: '#35CE53' }}>
              Хочу научиться
            </Title>
          </Div>
          {skillsLearn.map(skill => renderSkillCard(skill, 'learn'))}
        </Group>
      )}
    </Panel>
  );
};