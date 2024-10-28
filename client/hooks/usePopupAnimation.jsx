import { useRef, useEffect } from 'react'
import { Animated } from 'react-native'

const usePopupAnimation = (isVisible, popupHeight) => {
	const popupAnimation = useRef(new Animated.Value(popupHeight)).current

	useEffect(() => {
		if (isVisible) {
			// Animate pop-up in
			Animated.timing(popupAnimation, {
				toValue: 0, // On-screen position
				duration: 300,
				useNativeDriver: true
			}).start()
		}
	}, [isVisible])

	const animateOut = callback => {
		Animated.timing(popupAnimation, {
			toValue: popupHeight, // Off-screen position
			duration: 300,
			useNativeDriver: true
		}).start(() => {
			if (callback) callback()
		})
	}

	return { popupAnimation, animateOut }
}

export default usePopupAnimation
