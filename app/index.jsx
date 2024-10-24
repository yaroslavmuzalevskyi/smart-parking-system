import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View } from 'react-native'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { NavigationContainer } from '@react-navigation/native'
import {
	SafeAreaProvider,
	useSafeAreaInsets
} from 'react-native-safe-area-context'
import MapScreen from '../client/screens/MapScreen'
import ParkingScreen from '../client/screens/ParkingScreen'
import SettingsScreen from '../client/screens/SettingsScreen'
import CustomDrawer from '../client/components/CustomDrawer'

const Drawer = createDrawerNavigator()

export default function App() {
	return (
		<SafeAreaProvider>
			<NavigationContainer independent={true}>
				<Drawer.Navigator
					initialRouteName="Map"
					drawerContent={props => <CustomDrawer {...props} />}
				>
					<Drawer.Screen name="Map" component={MapScreen} />
					<Drawer.Screen name="Parkings" component={ParkingScreen} />
					<Drawer.Screen name="Settings" component={SettingsScreen} />
				</Drawer.Navigator>
			</NavigationContainer>
		</SafeAreaProvider>
	)
}
