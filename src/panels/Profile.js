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

  useEffect(() => {
    localStorage.setItem('skillUnitySkillsOffer', JSON.stringify(skillsOffer));
  }, [skillsOffer]);

  useEffect(() => {
    localStorage.setItem('skillUnitySkillsLearn', JSON.stringify(skillsLearn));
  }, [skillsLearn]);


  const publishProfile = async () => {

    if (!fetchedUser) {
      alert('Ошибка получения пользователя VK');
      return;
    }

    const profile = {
      vk_id: fetchedUser.id,
      name: fetchedUser.first_name + ' ' + fetchedUser.last_name,
      avatar: fetchedUser.photo_200,
      about: about || '',
      skills_offer: skillsOffer || [],
      skills_learn: skillsLearn || []
    };

    try {

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('vk_id', fetchedUser.id)
        .maybeSingle();

      if (error) {
        console.error(error);
        alert('Ошибка проверки профиля');
        return;
      }

      if (data) {

        const { error: updateError } = await supabase
          .from('users')
          .update(profile)
          .eq('vk_id', fetchedUser.id);

        if (updateError) throw updateError;

      } else {

        const { error: insertError } = await supabase
          .from('users')
          .insert(profile);

        if (insertError) throw insertError;

      }

      alert('Профиль опубликован!');

      // обновляем данные в Exchange
      window.location.reload();

    } catch (error) {

      console.error(error);
      alert('Ошибка публикации профиля');

    }

  };

  const renderSkill = (skill) => (
    <span key={skill.id} className="skill-badge">
      {skill.skill} • {skill.level}
    </span>
  );

  return (

    <Panel id={id} className="skill-background">

      <div className="skill-content">

        <PanelHeader />

        <Group>

          <Card className="glass-card">

            <Div style={{ display:'flex', gap:16, alignItems:'center' }}>

              <Avatar size={96} src={fetchedUser?.photo_200} />

              <div>

                <Title level="2" className="neon-title">
                  {fetchedUser
                    ? `${fetchedUser.first_name} ${fetchedUser.last_name}`
                    : 'Пользователь'}
                </Title>

                <Text className="small-muted">
                  Участник Skill Unity
                </Text>

              </div>

            </Div>

          </Card>

        </Group>


        <Group>

          <Div>

            <Title level="2" className="neon-title">
              Обо мне
            </Title>

            <Textarea
              value={about}
              onChange={(e)=>setAbout(e.target.value)}
              placeholder="Расскажите о себе..."
            />

          </Div>

        </Group>


        <Group>

          <Div>

            <Title level="2" className="neon-title">
              🟢 Могу научить
            </Title>

            {skillsOffer.length === 0
              ? <Text>Навыки не добавлены</Text>
              : <Div style={{display:'flex',gap:6,flexWrap:'wrap'}}>{skillsOffer.map(renderSkill)}</Div>
            }

            <Button
              className="btn-yellow"
              stretched
              onClick={()=>setActivePanel('catalog')}
              style={{marginTop:10}}
            >
              Добавить навыки
            </Button>

          </Div>

        </Group>


        <Group>

          <Div>

            <Title level="2" className="neon-title">
              🟡 Хочу научиться
            </Title>

            {skillsLearn.length === 0
              ? <Text>Интересы не добавлены</Text>
              : <Div style={{display:'flex',gap:6,flexWrap:'wrap'}}>{skillsLearn.map(renderSkill)}</Div>
            }

            <Button
              className="btn-yellow"
              stretched
              onClick={()=>setActivePanel('catalog')}
              style={{marginTop:10}}
            >
              Добавить интерес
            </Button>

          </Div>

        </Group>


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