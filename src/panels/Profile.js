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

import { supabase } from '../supabase';

export const Profile = ({ id, fetchedUser, setActivePanel }) => {

  const [skillsOffer, setSkillsOffer] = useState([]);
  const [skillsLearn, setSkillsLearn] = useState([]);
  const [about, setAbout] = useState('');

  useEffect(() => {

    const savedOffer = localStorage.getItem('skillUnitySkillsOffer');
    const savedLearn = localStorage.getItem('skillUnitySkillsLearn');
    const savedAbout = localStorage.getItem('skillUnityAbout');

    if (savedOffer) setSkillsOffer(JSON.parse(savedOffer));
    if (savedLearn) setSkillsLearn(JSON.parse(savedLearn));
    if (savedAbout) setAbout(savedAbout);

  }, []);

  useEffect(() => {
    localStorage.setItem('skillUnityAbout', about);
  }, [about]);


  // 🚀 Публикация профиля
  const publishProfile = async () => {

    if (!fetchedUser) return;

    const profile = {
      vk_id: fetchedUser.id,
      name: fetchedUser.first_name + ' ' + fetchedUser.last_name,
      avatar: fetchedUser.photo_200,
      about: about,
      skills_offer: skillsOffer,
      skills_learn: skillsLearn
    };

    const { error } = await supabase
      .from('users')
      .upsert(profile, { onConflict: 'vk_id' });

    if (error) {
      console.error(error);
      alert('Ошибка сохранения профиля');
    } else {
      alert('Профиль опубликован!');
    }

  };


  const renderSkillCard = (item) => (
    <Card key={item.id} mode="shadow" style={{ margin: 12 }}>
      <Div>
        <Title level="3">{item.skill}</Title>
        <Text>Категория: {item.category}</Text>
        <Text>Уровень: {item.level}</Text>
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
        Профиль Skill Unity
      </PanelHeader>


      {/* Блок пользователя */}

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
            </>
          )}

        </Div>
      </Group>


      {/* ОБО МНЕ */}

      <Group>
        <Div>
          <Title level="2" style={{ color: '#35CE53' }}>
            Обо мне
          </Title>

          <Textarea
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            placeholder="Расскажите о себе..."
            style={{
              background: '#0b0b0b',
              color: 'white'
            }}
          />

        </Div>
      </Group>


      {/* МОГУ НАУЧИТЬ */}

      <Group>

        <Div>
          <Title level="2" style={{ color: '#35CE53' }}>
            Могу научить
          </Title>
        </Div>

        {skillsOffer.length === 0 && (
          <Div>
            <Text>Вы ещё не добавили навыки</Text>

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
              Добавить навыки
            </Button>
          </Div>
        )}

        {skillsOffer.map(renderSkillCard)}

      </Group>


      {/* ХОЧУ НАУЧИТЬСЯ */}

      <Group>

        <Div>
          <Title level="2" style={{ color: '#35CE53' }}>
            Хочу научиться
          </Title>
        </Div>

        {skillsLearn.length === 0 && (
          <Div>
            <Text>Вы ещё не указали интересы</Text>
          </Div>
        )}

        {skillsLearn.map(renderSkillCard)}

      </Group>


      {/* ПУБЛИКАЦИЯ */}

      <Group>
        <Div>

          <Button
            stretched
            size="l"
            style={{
              background: '#35CE53',
              color: '#080904',
              fontWeight: 'bold'
            }}
            onClick={publishProfile}
          >
            📡 Опубликовать профиль
          </Button>

        </Div>
      </Group>

    </Panel>
  );
};