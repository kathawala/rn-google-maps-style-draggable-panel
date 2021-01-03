import React, { useCallback, useRef, useState } from 'react';
import { 
  Platform, Animated, ScrollView, StyleSheet,
  useWindowDimensions, View, Dimensions,
  PanResponderGestureState, NativeSyntheticEvent,
  NativeScrollEvent
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SlidingUpPanel, { SlidingUpPanelAnimationConfig } from 'rn-sliding-up-panel';
import { MarkerData } from './Map';
import MarkerDisplay from './MarkerDisplay';
import PanelHandle from './PanelHandle';

const ios = Platform.OS === 'ios';

interface IMapPanelProps {
  marker: MarkerData
}

const MapPanel: React.FunctionComponent<IMapPanelProps> = ({ marker }) => {
  // strange calculation here to get the top of the draggable range correct
  // need to see if it works on ios
  const deviceHeight = useWindowDimensions().height;
  const insets = useSafeAreaInsets();
  const statusBarHeight: number = ios ? insets.bottom : insets.top;
  const draggableRange = {
    top: deviceHeight - statusBarHeight,
    bottom: deviceHeight / 2.8
  };

  const snappingPoints = [
    draggableRange.top,
    draggableRange.bottom
  ];

  const [scrollEnabled, setScrollEnabled] = useState(false);
  const [allowDragging, setAllowDragging] = useState(true);
  const [atTop, setAtTop] = useState(true);

  // fired when panel is finished being dragged up or down
  // if panel is dragged to 'top' position, then we switch to scrollmode
  const onMomentumDragEnd = useCallback((value: number) => {
    if (value === draggableRange.top && !scrollEnabled) {
      setScrollEnabled(true);
      setAtTop(true);
    }
  }, [draggableRange, scrollEnabled]);

  // fired when scroll is finished inside the panel,
  // if the content in the panel has scrolled to the very top,
  // then we allow the panel to be dragged down (only if the next gesture is down, not up)
  const onMomentumScrollEnd = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { nativeEvent } = event;
    if (nativeEvent.contentOffset.y === 0) {
      setAtTop(true);
      if (ios) {
        setAllowDragging(true);
      }
    }
  }, []);
  
  const PANEL_VELOCITY = ios ? 1 : 2.3;
  const hideFullScreenPanelOptions: SlidingUpPanelAnimationConfig = {
    velocity: PANEL_VELOCITY,
    toValue: draggableRange.bottom
  };
  const panelRef = useRef<SlidingUpPanel | null>(null);

  // if panel is at the top and scrolling is allowed
  // check the velocity of the drag,
  // if the velocity is downward, then we animate the panel to its bottom state
  // if the velocity is upward, we treat the drag like a scroll instead
  const onDragStart = useCallback((_: number, gestureState: PanResponderGestureState) => {
    if (atTop && scrollEnabled) {
      if (gestureState.vy > 0) {
        setScrollEnabled(false);
        if (ios) {
          setAllowDragging(true);
        }
        if (panelRef && panelRef.current) {
          panelRef.current.show(hideFullScreenPanelOptions);
        }
      } else {
        setAtTop(false);
        if (ios) {
          setAllowDragging(false);
        }
      }
    }
  }, [atTop, scrollEnabled, panelRef]);

  const [panelPositionVal] = useState(new Animated.Value(draggableRange.bottom));

  return (
    <SlidingUpPanel
      ref={panelRef}
      animatedValue={panelPositionVal}
      draggableRange={draggableRange}
      snappingPoints={snappingPoints}
      backdropOpacity={0}
      showBackdrop={false}
      height={deviceHeight}
      allowDragging={allowDragging}
      onMomentumDragEnd={onMomentumDragEnd}
      onDragStart={onDragStart}
    >
      <View style={styles.panelContent}>
        <PanelHandle />
        <ScrollView
          scrollEnabled={scrollEnabled}
          showsVerticalScrollIndicator={false}
          bounces={false}
          onMomentumScrollEnd={onMomentumScrollEnd}
        >
          <MarkerDisplay marker={marker} />
        </ScrollView>
      </View>
    </SlidingUpPanel>
  );
};

const styles = StyleSheet.create({
  panelContent: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: 'white'
  }
});

export default MapPanel;
