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

  useEffect(() => { localStorage.setItem('skillUnityAbout', about); }, [about]);

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
    const { error } = await supabase.from('users').upsert(profile, { onConflict: 'vk_id' });
    if (error) { console.error(error); alert('Ошибка сохранения профиля'); } else { alert('Профиль опубликован!'); }
  };

  const renderSkillCard = (item) => (
    <Card key={item.id} className="glass-card" style={{ margin: 12 }}>
      <Div>
        <Title level="3">{item.skill}</Title>
        <Text style={{ opacity: 0.7 }}>{item.category}</Text>
        <Div style={{ marginTop: 6 }}>
          <span style={{ background: '#35CE53', color: '#080904', padding: '4px 10px', borderRadius: 8, fontSize: 12, fontWeight: 600 }}>{item.level}</span>
        </Div>
      </Div>
    </Card>
  );

  return (
    <Panel id={id} className="skill-background">
      <div className="skill-content">
        <PanelHeader className="neon-title">Профиль</PanelHeader>

        <Group>
          <Div>
            <Card className="glass-card" style={{ padding: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                <Avatar size={96} src={fetchedUser ? fetchedUser.photo_200 : undefined} />
                <div>
                  <Title level="2" className="neon-title">{fetchedUser ? `${fetchedUser.first_name} ${fetchedUser.last_name}` : 'Пользователь Skill Unity'}</Title>
                  <Text className="neon-subtitle">Участник платформы обмена навыками</Text>
                </div>
              </div>
            </Card>
          </Div>
        </Group>

        <Group>
          <Div>
            <Title level="2" className="neon-title">Обо мне</Title>
            <Textarea value={about} onChange={(e) => setAbout(e.target.value)} placeholder="Расскажите о себе..." style={{ background: 'rgba(10,10,10,0.6)', color: '#fff', borderRadius: 12 }} />
          </Div>
        </Group>

        <Group>
          <Div>
            <Title level="2" className="neon-title">🟢 Могу научить</Title>
            {skillsOffer.length === 0 ? (
              <Card className="glass-card" style={{ padding: 12 }}>
                <Text>Вы ещё не добавили навыки</Text>
                <Button className="btn-yellow" stretched style={{ marginTop: 8 }} onClick={() => setActivePanel('catalog')}>Добавить навыки</Button>
              </Card>
            ) : skillsOffer.map(renderSkillCard)}
          </Div>
        </Group>

        <Group>
          <Div>
            <Title level="2" className="neon-title">🟡 Хочу научиться</Title>
            {skillsLearn.length === 0 ? <Text>Вы ещё не указали интересы</Text> : skillsLearn.map(renderSkillCard)}
          </Div>
        </Group>

        <Group>
          <Div>
            <Button className="btn-green" stretched onClick={publishProfile}>📡 Опубликовать профиль</Button>
          </Div>
        </Group>
      </div>
    </Panel>
  );
};

export default Profile;