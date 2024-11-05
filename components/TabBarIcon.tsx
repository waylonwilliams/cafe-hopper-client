// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/

import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { type IconProps } from '@expo/vector-icons/build/createIconSet';
import { type ComponentProps } from 'react';

export function TabBarIcon({
  style,
  ...rest
}: IconProps<ComponentProps<typeof MaterialIcons>['name']>) {
  return <MaterialIcons size={32} style={[{ marginBottom: 0 }, style]} {...rest} />;
}
