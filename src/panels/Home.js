import React from 'react';
import {
  Panel,
  PanelHeader,
  Group,
  Div,
  Title,
  Text,
  Button,
  Avatar,
  Card
} from '@vkontakte/vkui';

import logo from '../assets/logo.jpg';

export const Home = ({ id, setActivePanel }) => {
  return (
    <Panel id={id} className="skill-background">

      <div className="skill-content">

        {/* Header без дублирования */}
        <PanelHeader />

        {/* HERO */}
        <Group>
          <Div>

            <div className="glass-card" style={{ padding: 28, textAlign: "center" }}>

              {/* LOGO */}
              {logo ? (
                <img
                  src={logo}
                  alt="Skill Unity"
                  style={{
                    width: 110,
                    height: 110,
                    borderRadius: 20,
                    marginBottom: 16
                  }}
                />
              ) : (
                <Avatar size={110} style={{ marginBottom: 16 }} />
              )}

              {/* TITLE */}
              <Title level="1" className="neon-title">
                Skill Unity
              </Title>

              <Text className="neon-subtitle" style={{ marginTop: 6 }}>
                Учитесь у других — делитесь своим опытом
              </Text>

              {/* ACTION BUTTONS */}
              <div style={{ marginTop: 24 }}>

                <Button
                  className="btn-green"
                  stretched
                  size="l"
                  style={{ marginBottom: 12 }}
                  onClick={() => setActivePanel('exchange')}
                >
                  🔍 Найти собеседника
                </Button>

                <Button
                  className="btn-yellow"
                  stretched
                  size="l"
                  onClick={() => setActivePanel('catalog')}
                >
                  📚 Каталог навыков
                </Button>

              </div>

            </div>

          </Div>
        </Group>


        {/* FEATURES */}
        <Group>
          <Div>

            <Card className="glass-card" style={{ padding: 18, marginBottom: 12 }}>
              <Title level="3">🤝 Обмен навыками</Title>
              <Text className="small-muted">
                Найдите людей, которые могут научить вас новым навыкам и поделитесь своими знаниями.
              </Text>
            </Card>

            <Card className="glass-card" style={{ padding: 18, marginBottom: 12 }}>
              <Title level="3">🎯 Умный поиск</Title>
              <Text className="small-muted">
                Подбираем пользователей по навыкам, уровню и интересам.
              </Text>
            </Card>

            <Card className="glass-card" style={{ padding: 18 }}>
              <Title level="3">🚀 Развитие</Title>
              <Text className="small-muted">
                Развивайте навыки через практическое общение и обучение друг у друга.
              </Text>
            </Card>

          </Div>
        </Group>

      </div>
    </Panel>
  );
};

export default Home;