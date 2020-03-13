import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import Main from './pages/Main';
import Profile from './pages/Profile';
import DevList from './pages/DevList';
import DevStore from './pages/DevStore';
import DevUpdate from './pages/DevUpdate';

const Routes = createAppContainer(
  createStackNavigator({
    Main: {
      screen: Main,
      navigationOptions: {
        title: 'DevRadar'
      },
    },
    Profile: {
      screen: Profile,
      navigationOptions: {
        title: 'Perfil no Github'
      }
    },
    DevList: {
      screen: DevList,
      navigationOptions: {
        title: 'Devs Listagem'
      }
    },
    DevStore: {
      screen: DevStore,
      navigationOptions: {
        title: 'Devs Cadastro'
      }
    },
    DevUpdate: {
      screen: DevUpdate,
      navigationOptions: {
        title: 'Devs Update'
      }
    },
  }, {
    defaultNavigationOptions: {
      headerTintColor: '#FFF',
      headerBackTitleVisible: false,
      headerStyle: {
        backgroundColor: '#47149f'
      },
    },
  })
);

export default Routes;