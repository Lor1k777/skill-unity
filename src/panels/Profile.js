import React, { useEffect, useState } from 'react';
import { Panel, PanelHeader, Group, Div, Title, Text, Avatar, Card, Button, Textarea } from '@vkontakte/vkui';
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


  const publishProfile = async () => {

    if (!fetchedUser) return;

    const profile = {
      vk_id: fetchedUser.id,
      name: fetchedUser.first_name + ' ' + fetchedUser.last_name,
      avatar: fetchedUser.photo_200,
      about,
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


  const renderSkillBadge = (item) => (

    <span
      key={item.id}
      className="skill-badge"
      style={{ marginRight: 6, marginBottom: 6 }}
    >
      {item.skill} • {item.level}
    </span>

  );


  return (

    <Panel id={id} className="skill-background">

      <div className="skill-content">

        <PanelHeader />

        {/* HERO PROFILE */}

        <Group>

          <Card className="glass-card">

            <Div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>

              <Avatar
                size={96}
                src={fetchedUser ? fetchedUser.photo_200 : undefined}
              />

              <div>

                <Title level="2" className="neon-title">
                  {fetchedUser
                    ? `${fetchedUser.first_name} ${fetchedUser.last_name}`
                    : 'Пользователь Skill Unity'}
                </Title>

                <Text className="small-muted">
                  Участник платформы обмена навыками
                </Text>

              </div>

            </Div>

          </Card>

        </Group>


        {/* ABOUT */}

        <Group>

          <Div>

            <Title level="2" className="neon-title">
              Обо мне
            </Title>

            <Textarea
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              placeholder="Расскажите о себе..."
              style={{
                background: 'rgba(10,10,10,0.6)',
                color: '#fff',
                borderRadius: 12,
                marginTop: 8
              }}
            />

          </Div>

        </Group>


        {/* OFFER */}

        <Group>

          <Div>

            <Title level="2" className="neon-title">
              🟢 Могу научить
            </Title>

            {skillsOffer.length === 0 ? (

              <Card className="glass-card light">

                <Div className="section">

                  <Text>Вы ещё не добавили навыки</Text>

                  <div className="card-actions">

                    <Button
                      className="btn-yellow"
                      stretched
                      onClick={() => setActivePanel('catalog')}
                    >
                      Добавить навыки
                    </Button>

                  </div>

                </Div>

              </Card>

            ) : (

              <Card className="glass-card light">

                <Div style={{ display: 'flex', flexWrap: 'wrap' }}>
                  {skillsOffer.map(renderSkillBadge)}
                </Div>

              </Card>

            )}

          </Div>

        </Group>


        {/* LEARN */}

        <Group>

          <Div>

            <Title level="2" className="neon-title">
              🟡 Хочу научиться
            </Title>

            {skillsLearn.length === 0 ? (

              <Card className="glass-card light">

                <Div className="section">

                  <Text>Вы ещё не указали интересы</Text>

                  <div className="card-actions">

                    <Button
                      className="btn-yellow"
                      stretched
                      onClick={() => setActivePanel('catalog')}
                    >
                      Добавить интерес
                    </Button>

                  </div>

                </Div>

              </Card>

            ) : (

              <Card className="glass-card light">

                <Div style={{ display: 'flex', flexWrap: 'wrap' }}>
                  {skillsLearn.map(renderSkillBadge)}
                </Div>

              </Card>

            )}

          </Div>

        </Group>


        {/* SAVE */}

        <Group>

          <Div>

            <Button
              className="btn-green"
              stretched
              size="l"
              onClick={publishProfile}
            >
              📡 Опубликовать профиль
            </Button>

          </Div>

        </Group>

      </div>

    </Panel>

  );

};

export default Profile;