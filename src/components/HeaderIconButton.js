/* @flow */

import * as React from 'react';
import { Platform, StyleSheet, TouchableOpacity } from 'react-native';
import { Appbar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

import withTheme from '../utils/theme/withTheme';
import type { ThemeType } from '../utils/theme/withTheme';

type Props = {|
  icon: string,
  onPress: () => mixed,
  theme: ThemeType,
  last?: boolean,
|};

class HeaderIconButton extends React.Component<Props> {
  render() {
    const { icon, onPress, last, theme, ...rest } = this.props;
    const { toolbarTint } = theme.colors;

    if (Platform.OS === 'android') {
      return (
        <Appbar.Action
          onPress={onPress}
          icon={icon}
          color={toolbarTint}
          {...rest}
        />
      );
    }

    return (
      <TouchableOpacity
        onPress={onPress}
        style={[styles.container, last && styles.lastStyle]}
      >
        <Icon name={icon} size={24} color={toolbarTint} />
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    paddingLeft: 12,
    paddingRight: 12,
  },
  lastStyle: {
    paddingRight: 16,
  },
});

export default withTheme(HeaderIconButton);
