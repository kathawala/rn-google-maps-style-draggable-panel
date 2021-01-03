import * as React from 'react';
import { StyleSheet, View } from 'react-native';

interface IPanelHandleProps {
}

const PanelHandle: React.FunctionComponent<IPanelHandleProps> = (props) => {
  return (
    <View style={styles.handleContainer}>
      <View style={styles.handle} />
    </View>
  );
};

const styles = StyleSheet.create({
  handleContainer: {
    backgroundColor: '#ffffff',
    marginVertical: 6,
    height: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  handle: {
    backgroundColor: '#D6D6D6',
    width: 34,
    height: 4,
    borderRadius: 4
  }
});

export default PanelHandle;
