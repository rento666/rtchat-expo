import {SafeAreaProvider} from 'react-native-safe-area-context';
import { RootSiblingParent } from 'react-native-root-siblings';
import Providers from './navigation';
import { MenuProvider } from 'react-native-popup-menu';

export default function App() {
  return (
    <RootSiblingParent>
      <SafeAreaProvider>
        <MenuProvider>
          <Providers />
        </MenuProvider>
      </SafeAreaProvider>
    </RootSiblingParent>
  );
}
