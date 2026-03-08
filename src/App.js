import { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';
import {
  View,
  SplitLayout,
  SplitCol,
  Tabbar,
  TabbarItem,
  ScreenSpinner
} from '@vkontakte/vkui';

import {
  Icon28HomeOutline,
  Icon28UsersOutline,
  Icon28ListOutline,
  Icon28UserOutline
} from '@vkontakte/icons';

// Импорт панелей
import { Home } from './panels/Home';
import { Exchange } from './panels/Exchange';
import { Catalog } from './panels/Catalog';
import { Profile } from './panels/Profile';

export const App = () => {
  const [activePanel, setActivePanel] = useState('home');
  const [fetchedUser, setUser] = useState(null);
  const [popout, setPopout] = useState(null);

  useEffect(() => {
  async function fetchData() {
    try {
      const user = await bridge.send('VKWebAppGetUserInfo');
      setUser(user);
    } catch (e) {
      console.log('Dev mode: VK user not available');
      // В режиме разработки просто продолжаем без пользователя
      setUser(null);
    }
  }
  fetchData();
}, []);

  return (
    <SplitLayout
  style={{
    paddingBottom: 'var(--vk-safe-area-inset-bottom)',
    paddingTop: 'var(--vk-safe-area-inset-top)'
  }}
>
      <SplitCol autoSpaced style={{ height: '100vh' }}>
        <View activePanel={activePanel}>
          <Home
            id="home"
            fetchedUser={fetchedUser}
            setActivePanel={setActivePanel}
          />
          <Exchange
            id="exchange"
            fetchedUser={fetchedUser}
          />
          <Catalog id="catalog" />
          <Profile
            id="profile"
            fetchedUser={fetchedUser}
            setActivePanel={setActivePanel}
          />
        </View>

        <Tabbar>
          <TabbarItem
            onClick={() => setActivePanel('home')}
            selected={activePanel === 'home'}
            text="Главная"
          >
            <Icon28HomeOutline />
          </TabbarItem>

          <TabbarItem
            onClick={() => setActivePanel('exchange')}
            selected={activePanel === 'exchange'}
            text="Поиск"
          >
            <Icon28UsersOutline />
          </TabbarItem>

          <TabbarItem
            onClick={() => setActivePanel('catalog')}
            selected={activePanel === 'catalog'}
            text="Навыки"
          >
            <Icon28ListOutline />
          </TabbarItem>

          <TabbarItem
            onClick={() => setActivePanel('profile')}
            selected={activePanel === 'profile'}
            text="Профиль"
          >
            <Icon28UserOutline />
          </TabbarItem>
        </Tabbar>

      </SplitCol>
    </SplitLayout>
  );
};
export default App;