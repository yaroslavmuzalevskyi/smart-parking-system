import { StatusBar } from 'expo-status-bar'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { NavigationContainer } from '@react-navigation/native'
import {
	SafeAreaProvider,
	useSafeAreaInsets
} from 'react-native-safe-area-context'
import IonIcons from 'react-native-vector-icons/Ionicons'
import MapScreen from '../client/screens/MapScreen'
import ParkingScreen from '../client/screens/ParkingScreen'
import SettingsScreen from '../client/screens/SettingsScreen'
import AIScreen from '../client/screens/AIScreen'
import CustomDrawer from '../client/components/CustomDrawer'

const Drawer = createDrawerNavigator()

export default function App() {
	return (
		<SafeAreaProvider>
			<NavigationContainer independent={true}>
				<Drawer.Navigator
					initialRouteName="Map"
					drawerContent={props => <CustomDrawer {...props} />}
					screenOptions={({ navigation }) => ({
						headerLeft: props => (
							<IonIcons
								name="menu-outline"
								color="black"
								size={32}
								style={{ marginLeft: 15 }}
								onPress={() => navigation.toggleDrawer()}
							/>
						)
					})}
				>
					<Drawer.Screen name="Map" component={MapScreen} />
					<Drawer.Screen name="Parkings" component={ParkingScreen} />
					<Drawer.Screen name="Settings" component={SettingsScreen} />
					<Drawer.Screen name="AI" component={AIScreen} />
				</Drawer.Navigator>
			</NavigationContainer>
		</SafeAreaProvider>
	)
}
