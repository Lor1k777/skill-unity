import React from 'react';
import { Panel, PanelHeader, Group, Div, Title, Text, Button, Avatar } from '@vkontakte/vkui';
import logo from '../assets/logo.jpg'; // оставь если логотип есть

export const Home = ({ id, fetchedUser, setActivePanel }) => {
  return (
    <Panel id={id} className="skill-background">
      <div className="skill-content">
        <PanelHeader className="neon-title">Skill Unity</PanelHeader>

        <Group>
          <Div>
            <div className="glass-card" style={{ padding: 22 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                <div style={{ flex: 1 }}>
                  <Title level="2" className="neon-title">Skill Unity</Title>
                  <Text className="neon-subtitle">Учитесь у других — делитесь своим опытом</Text>
                </div>

                {logo ? (
                  <img src={logo} alt="Skill Unity" style={{ width: 84, height: 84, borderRadius: 12 }} />
                ) : (
                  <Avatar size={84} />
                )}
              </div>

              <div style={{ marginTop: 18 }}>
                <Button className="btn-green" stretched onClick={() => setActivePanel('exchange')}>🔍 Найти собеседника по навыкам</Button>
              </div>

              <div style={{ marginTop: 12 }}>
                <Button className="btn-yellow" stretched onClick={() => setActivePanel('catalog')}>📚 Перейти в каталог навыков</Button>
              </div>
            </div>
          </Div>
        </Group>
      </div>
    </Panel>
  );
};
export default Home;