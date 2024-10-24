import { View, Text, TouchableOpacity } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { StyleSheet } from 'react-native';
import { TabBarIcon } from '@/components/TabBarIcon';

export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const icon: { [key: string]: (props: any) => JSX.Element } = {
    index: (props: any) => <TabBarIcon name="home-filled" size={24} {...props} />,
    explore: (props: any) => <TabBarIcon name="search" size={24} {...props} />,
    profile: (props: any) => <TabBarIcon name="person" size={24} {...props} />,
  };

  return (
    <View style={styles.tabBarStyle}>
      {state.routes
        .filter((route) => route.name !== 'cafe') // Exclude the 'cafe' route
        .map((route, index) => {
          const { options } = descriptors[route.key];
          // Use the options.title or options.tabBarLabel as the display name
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
                ? options.title
                : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          return (
            <TouchableOpacity
              key={route.name}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.tabbarItem}>
              {icon[route.name as keyof typeof icon] &&
                icon[route.name]({
                  color: isFocused ? '#000000' : '#9D9D9D',
                })}
            </TouchableOpacity>
          );
        })}
    </View>
  );
}
const styles = StyleSheet.create({
  tabBarStyle: {
    position: 'absolute',
    bottom: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#C4C4C4',
    marginHorizontal: 110,
    borderRadius: 35,
    paddingVertical: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  tabbarItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 0, // Reduced gap between icons
  },
});
