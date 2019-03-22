/* @flow */

import * as React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import i18n from '../../utils/i18n';
import withTheme from '../../utils/theme/withTheme';
import { Paragraph, Title } from 'react-native-paper';
import { dateToString, getDatePrettyFormat, getToday } from '../../utils/date';
import {
  deleteWorkoutComments,
  getWorkoutComments,
  setWorkoutComments,
} from '../../database/services/WorkoutService';
import HeaderButton from '../../components/HeaderButton';
import type { NavigationType } from '../../types';
import type { ThemeType } from '../../utils/theme/withTheme';

type NavigationOptions = {
  navigation: NavigationType<{ day: string, saveComments: () => void }>,
};

type Props = NavigationOptions & {
  theme: ThemeType,
};

type State = {
  comments: string,
};

class CommentsScreen extends React.Component<Props, State> {
  static navigationOptions = ({ navigation }: NavigationOptions) => {
    const { params = {} } = navigation.state;
    return {
      headerRight: (
        <HeaderButton onPress={params.saveComments}>
          {i18n.t('save')}
        </HeaderButton>
      ),
    };
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      comments: getWorkoutComments(this.props.navigation.state.params.day),
    };
  }

  componentDidMount() {
    this.props.navigation.setParams({
      saveComments: this._saveComments,
    });
  }

  _onCommentsChange = comments => {
    this.setState({ comments });
  };

  _saveComments = () => {
    const { comments } = this.state;
    const workoutId = this.props.navigation.state.params.day;

    if (comments) {
      setWorkoutComments(workoutId, comments);
    } else {
      deleteWorkoutComments(workoutId);
    }

    this.props.navigation.goBack();
  };

  render() {
    const { comments } = this.state;
    const { colors } = this.props.theme;
    const dayString = getDatePrettyFormat(
      this.props.navigation.state.params.day,
      dateToString(getToday())
    );

    return (
      <View style={styles.screen}>
        <Title style={styles.section}>{i18n.t('workout_notes')}</Title>
        <Paragraph style={styles.section}>{dayString}</Paragraph>
        <TextInput
          autoFocus
          multiline
          underlineColorAndroid="transparent"
          selectionColor={colors.textSelection}
          style={[{ color: colors.text }, styles.textArea]}
          placeholderTextColor={colors.placeholder}
          placeholder={i18n.t('workout_comment__placeholder')}
          value={comments}
          onChangeText={this._onCommentsChange}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 4,
  },
  textArea: {
    flex: 1,
    paddingHorizontal: 0,
    paddingTop: 24,
    fontSize: 16,
    textAlignVertical: 'top',
  },
});

export default withTheme(CommentsScreen);
