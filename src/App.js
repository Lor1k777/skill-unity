import { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';

import {
  View,
  SplitLayout,
  SplitCol,
  Tabbar,
  TabbarItem
} from '@vkontakte/vkui';

import {
  Icon28HomeOutline,
  Icon28UsersOutline,
  Icon28ListOutline,
  Icon28UserOutline
} from '@vkontakte/icons';

import { Home } from './panels/Home';
import { Exchange } from './panels/Exchange';
import { Catalog } from './panels/Catalog';
import { Profile } from './panels/Profile';

export const App = () => {

  const [activePanel, setActivePanel] = useState('home');
  const [fetchedUser, setUser] = useState(null);

  useEffect(() => {

    bridge.send('VKWebAppInit');

    const fetchUser = async () => {
      try {
        const user = await bridge.send('VKWebAppGetUserInfo');
        setUser(user);
      } catch {
        console.log('VK user unavailable (dev mode)');
      }
    };

    fetchUser();

  }, []);

  return (

    <SplitLayout
      className="app-root"
      style={{
        paddingTop: 'var(--vk-safe-area-inset-top)',
        paddingBottom: 'var(--vk-safe-area-inset-bottom)'
      }}
    >

      {/* Глобальный фон */}
      <div className="skill-parallax-bg"></div>

      <SplitCol
        autoSpaced
        className="app-container"
      >

        {/* Панели */}

        <View
          activePanel={activePanel}
          className="app-view"
        >

          <Home
            id="home"
            fetchedUser={fetchedUser}
            setActivePanel={setActivePanel}
          />

          <Exchange
            id="exchange"
            fetchedUser={fetchedUser}
          />

          <Catalog
            id="catalog"
          />

          <Profile
            id="profile"
            fetchedUser={fetchedUser}
            setActivePanel={setActivePanel}
          />

        </View>


        {/* Нижняя навигация */}

        <Tabbar className="app-tabbar">

          <TabbarItem
            selected={activePanel === 'home'}
            onClick={() => setActivePanel('home')}
            text="Главная"
          >
            <Icon28HomeOutline />
          </TabbarItem>

          <TabbarItem
            selected={activePanel === 'exchange'}
            onClick={() => setActivePanel('exchange')}
            text="Поиск"
          >
            <Icon28UsersOutline />
          </TabbarItem>

          <TabbarItem
            selected={activePanel === 'catalog'}
            onClick={() => setActivePanel('catalog')}
            text="Навыки"
          >
            <Icon28ListOutline />
          </TabbarItem>

          <TabbarItem
            selected={activePanel === 'profile'}
            onClick={() => setActivePanel('profile')}
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