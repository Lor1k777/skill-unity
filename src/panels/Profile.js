import { useState, useEffect } from 'react';
import {
  Panel,
  PanelHeader,
  Group,
  Div,
  Title,
  Text,
  Avatar,
  Card,
  Button,
  Textarea
} from '@vkontakte/vkui';

export const Profile = ({ id, fetchedUser, setActivePanel }) => {
  const [userSkills, setUserSkills] = useState([]);
  const [about, setAbout] = useState('');
  const [editingSkillId, setEditingSkillId] = useState(null);

  const levels = ['Начинающий', 'Средний', 'Продвинутый', 'Профессиональный'];

  // Загружаем навыки из localStorage (синхронизация с Catalog)
  useEffect(() => {
    const savedSkills = localStorage.getItem('skillUnitySkills');
    if (savedSkills) {
      setUserSkills(JSON.parse(savedSkills));
    }

    const savedAbout = localStorage.getItem('skillUnityAbout');
    if (savedAbout) {
      setAbout(savedAbout);
    }
  }, []);

  // Автосохранение "Обо мне"
  useEffect(() => {
    localStorage.setItem('skillUnityAbout', about);
  }, [about]);

  // Удаление навыка
  const handleDeleteSkill = (id) => {
    const updated = userSkills.filter((skill) => skill.id !== id);
    setUserSkills(updated);
    localStorage.setItem('skillUnitySkills', JSON.stringify(updated));
  };

  // Начать редактирование
  const startEditing = (id) => {
    setEditingSkillId(id);
  };

  // Обновление уровня навыка
  const updateSkillLevel = (id, newLevel) => {
    const updated = userSkills.map((skill) =>
      skill.id === id ? { ...skill, level: newLevel } : skill
    );

    setUserSkills(updated);
    localStorage.setItem('skillUnitySkills', JSON.stringify(updated));
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
        Профиль Skill Unity
      </PanelHeader>

      {/* Блок профиля */}
      <Group>
        <Div style={{ textAlign: 'center' }}>
          {fetchedUser ? (
            <>
              <Avatar size={96} src={fetchedUser.photo_200} />
              <Title level="2" style={{ marginTop: 12, color: '#35CE53' }}>
                {fetchedUser.first_name} {fetchedUser.last_name}
              </Title>
              <Text>Участник платформы обмена навыками</Text>
            </>
          ) : (
            <>
              <Avatar size={96} />
              <Title level="2" style={{ marginTop: 12, color: '#35CE53' }}>
                Пользователь Skill Unity
              </Title>
              <Text>Демо-профиль (режим разработки)</Text>
            </>
          )}
        </Div>
      </Group>

      {/* Блок "Обо мне" */}
      <Group>
        <Div>
          <Title level="2" style={{ color: '#35CE53' }}>
            Обо мне
          </Title>
          <Textarea
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            placeholder="Расскажите о себе, своих навыках и чему хотите научиться..."
            style={{
              background: '#0b0b0b',
              color: 'white'
            }}
          />
        </Div>
      </Group>

      {/* Навыки (как LinkedIn) */}
      <Group>
        <Div>
          <Title level="2" style={{ color: '#35CE53' }}>
            Мои навыки
          </Title>
          <Text>Навыки из каталога Skill Unity</Text>
        </Div>

        {userSkills.length === 0 && (
          <Div>
            <Text>Вы ещё не добавили навыки в каталоге</Text>
            <Button
              stretched
              style={{
                marginTop: 10,
                background: '#FEE21F',
                color: '#080904',
                fontWeight: 'bold'
              }}
              onClick={() => setActivePanel('catalog')}
            >
              Перейти в каталог навыков
            </Button>
          </Div>
        )}

        {userSkills.map((item) => (
          <Card key={item.id} mode="shadow" style={{ margin: 12 }}>
            <Div>
              <Title level="3">{item.skill}</Title>
              <Text>Категория: {item.category}</Text>
              <Text>Уровень: {item.level}</Text>

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
                    ✏️ Редактировать
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
    </Panel>
  );
};