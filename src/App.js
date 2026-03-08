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

// панели
import { Home } from './panels/Home';
import { Exchange } from './panels/Exchange';
import { Catalog } from './panels/Catalog';
import { Profile } from './panels/Profile';

export const App = () => {

  const [activePanel, setActivePanel] = useState('home');
  const [fetchedUser, setUser] = useState(null);

  useEffect(() => {

    bridge.send('VKWebAppInit');

    async function fetchData() {
      try {
        const user = await bridge.send('VKWebAppGetUserInfo');
        setUser(user);
      } catch (e) {
        console.log('VK user not available (dev mode)');
        setUser(null);
      }
    }

    fetchData();

  }, []);

  return (

    <SplitLayout
      className="app-root"
      style={{
        paddingBottom: 'var(--vk-safe-area-inset-bottom)',
        paddingTop: 'var(--vk-safe-area-inset-top)'
      }}
    >

      {/* ПАРАЛЛАКС ФОН */}
      <div className="skill-parallax-bg"></div>

      <SplitCol autoSpaced className="app-container">

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


        {/* TABBAR */}

        <Tabbar className="app-tabbar">

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