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
  const [successMessage, setSuccessMessage] = useState(false);
  const [editingSkillId, setEditingSkillId] = useState(null);

  // Загрузка навыков (НЕ пропадают между вкладками)
  const [userSkills, setUserSkills] = useState(() => {
    const savedSkills = localStorage.getItem('skillUnitySkills');
    return savedSkills ? JSON.parse(savedSkills) : [];
  });

  // Автосохранение
  useEffect(() => {
    localStorage.setItem('skillUnitySkills', JSON.stringify(userSkills));
  }, [userSkills]);

  const categories = {
    '🎨 Хобби': ['Рисование', 'Музыка', 'Фотография', 'Видеомонтаж'],
    '💻 Digital навыки': ['Маркетинг', 'SMM', 'Дизайн', 'Программирование'],
    '📚 Образование': ['Математика', 'История', 'Подготовка к экзаменам'],
    '🌍 Языки': ['Английский', 'Китайский', 'Испанский']
  };

  const levels = ['Начинающий', 'Средний', 'Продвинутый', 'Профессиональный'];

  // Мгновенное добавление навыка
  const handleSelectLevel = (level) => {
    const newSkill = {
      id: Date.now(),
      category: selectedCategory,
      skill: selectedSkill,
      level: level,
    };

    setUserSkills((prev) => [...prev, newSkill]);
    setSuccessMessage(true);

    setSelectedCategory(null);
    setSelectedSkill(null);

    setTimeout(() => {
      setSuccessMessage(false);
    }, 2000);
  };

  // Удаление навыка
  const handleDeleteSkill = (id) => {
    setUserSkills((prev) => prev.filter((skill) => skill.id !== id));
  };

  // Начать редактирование
  const startEditing = (id) => {
    setEditingSkillId(id);
  };

  // Изменение уровня навыка
  const updateSkillLevel = (id, newLevel) => {
    setUserSkills((prev) =>
      prev.map((skill) =>
        skill.id === id ? { ...skill, level: newLevel } : skill
      )
    );
    setEditingSkillId(null);
  };

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

      {/* Уведомление */}
      {successMessage && (
        <Group>
          <Div>
            <Title level="2" style={{ color: '#35CE53' }}>
              Профиль навыка создан 🎉
            </Title>
            <Text>Навык успешно добавлен в ваш профиль</Text>
          </Div>
        </Group>
      )}

      {/* Шаг 1 — Категории */}
      {!selectedCategory && !selectedSkill && (
        <Group>
          <Div>
            <Title level="2" style={{ color: '#35CE53' }}>
              Выберите категорию навыков
            </Title>
          </Div>

          {Object.keys(categories).map((category) => (
            <Card key={category} mode="shadow" style={{ margin: 12 }}>
              <Div>
                <Title level="3">{category}</Title>
                <Button
                  stretched
                  style={{
                    marginTop: 10,
                    background: '#35CE53',
                    color: '#080904',
                    fontWeight: 'bold'
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

      {/* Шаг 2 — Навыки */}
      {selectedCategory && !selectedSkill && (
        <Group>
          <Div>
            <Title level="2" style={{ color: '#35CE53' }}>
              Категория: {selectedCategory}
            </Title>
            <Text>Выберите конкретный навык</Text>
          </Div>

          {categories[selectedCategory].map((skill) => (
            <Card key={skill} mode="shadow" style={{ margin: 12 }}>
              <Div>
                <Title level="3">{skill}</Title>
                <Button
                  stretched
                  style={{
                    marginTop: 10,
                    background: '#FEE21F',
                    color: '#080904',
                    fontWeight: 'bold'
                  }}
                  onClick={() => setSelectedSkill(skill)}
                >
                  Выбрать навык
                </Button>
              </Div>
            </Card>
          ))}

          <Div>
            <Button
              stretched
              mode="secondary"
              onClick={() => setSelectedCategory(null)}
            >
              Назад к категориям
            </Button>
          </Div>
        </Group>
      )}

      {/* Шаг 3 — Уровень */}
      {selectedSkill && (
        <Group>
          <Div>
            <Title level="2" style={{ color: '#35CE53' }}>
              Навык: {selectedSkill}
            </Title>
            <Text>Укажите ваш уровень владения</Text>
          </Div>

          {levels.map((level) => (
            <Card key={level} mode="shadow" style={{ margin: 12 }}>
              <Div>
                <Title level="3">{level}</Title>
                <Button
                  stretched
                  style={{
                    marginTop: 10,
                    background: '#35CE53',
                    color: '#080904',
                    fontWeight: 'bold'
                  }}
                  onClick={() => handleSelectLevel(level)}
                >
                  Выбрать уровень
                </Button>
              </Div>
            </Card>
          ))}

          <Div>
            <Button
              stretched
              mode="secondary"
              onClick={() => setSelectedSkill(null)}
            >
              Назад к навыкам
            </Button>
          </Div>
        </Group>
      )}

      {/* Мои навыки с РЕДАКТИРОВАНИЕМ и УДАЛЕНИЕМ */}
      {userSkills.length > 0 && (
        <Group>
          <Div>
            <Title level="2" style={{ color: '#35CE53' }}>
              Мои добавленные навыки
            </Title>
          </Div>

          {userSkills.map((item) => (
            <Card key={item.id} mode="shadow" style={{ margin: 12 }}>
              <Div>
                <Title level="3">{item.skill}</Title>
                <Text>Категория: {item.category}</Text>
                <Text>Уровень: {item.level}</Text>

                {/* Режим редактирования */}
                {editingSkillId === item.id ? (
                  <Div style={{ marginTop: 12 }}>
                    <Text style={{ marginBottom: 8 }}>
                      Изменить уровень:
                    </Text>
                    {levels.map((level) => (
                      <Button
                        key={level}
                        size="s"
                        style={{
                          marginRight: 6,
                          marginBottom: 6,
                          background: '#FEE21F',
                          color: '#080904'
                        }}
                        onClick={() => updateSkillLevel(item.id, level)}
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
                      ✏️ Редактировать уровень
                    </Button>

                    <Button
                      size="m"
                      mode="destructive"
                      onClick={() => handleDeleteSkill(item.id)}
                    >
                      🗑 Удалить
                    </Button>
                  </Div>
                )}
              </Div>
            </Card>
          ))}
        </Group>
      )}
    </Panel>
  );
};