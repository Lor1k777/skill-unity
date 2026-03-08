import { Panel, PanelHeader, Group, Div, Title, Text, Button } from '@vkontakte/vkui';
import logo from '../assets/logo.jpg';

export const Home = ({ id, setActivePanel }) => {
  return (
    <Panel id={id} className="skill-background">
      <div className="skill-content">
        <PanelHeader>Skill Unity</PanelHeader>

        <Group className="glass-card">
          <Div style={{ textAlign: 'center' }}>
            <Title level="1" className="neon-title">
              Skill Unity
            </Title>
            <Text className="neon-subtitle" style={{ marginTop: 10 }}>
              Учитесь у других — делитесь своим опытом
            </Text>
            <Text style={{ opacity: 0.8, marginTop: 6 }}>
              Платформа обмена навыками нового поколения
            </Text>
          </Div>
        </Group>

        <Group>
          <Div>
            <Button
              size="l"
              stretched
              className="btn-green"
              onClick={() => setActivePanel('exchange')}
            >
              🔎 Найти собеседника по навыкам
            </Button>

            <div style={{ height: 12 }} />

            <Button
              size="l"
              stretched
              className="btn-yellow"
              onClick={() => setActivePanel('catalog')}
            >
              📚 Перейти в каталог навыков
            </Button>
          </Div>
        </Group>
      </div>
    </Panel>
  );
};