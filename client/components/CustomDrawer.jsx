import React from 'react'
import {
	DrawerContentScrollView,
	DrawerItemList
} from '@react-navigation/drawer'
import { View, Text, Image } from 'react-native'

const CustomDrawer = props => {
	return (
		<View className=" flex-1 ">
			<DrawerContentScrollView
				{...props}
				contentContainerStyle={{ backgroundColor: '#fffff' }}
			>
				<View className="w-full h-52">
					<View className=" w-full h-full flex justify-center items-center">
						<Image
							source={require('../../assets/icons/parking.png')}
							className=" w-16 h-16"
						></Image>
						<Text className=" py-3">Smart Parking System</Text>
					</View>
				</View>
				<View className=" w-full h-auto flex justify-center items-end">
					<View className=" w-full h-[2px] bg-stone-300"></View>
				</View>
				<View className=" py-12">
					<DrawerItemList {...props} />
				</View>
			</DrawerContentScrollView>
			<View className=" w-full h-auto flex justify-center items-center">
				<Text>© all rights reserved</Text>
			</View>
		</View>
	)
}

export default CustomDrawer
