import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import {
  CameraIcon,
  ImageIcon,
  MicIcon,
  PlusIcon,
  XIcon,
} from 'lucide-react-native';
import React, { useCallback, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { THEME } from '@/lib/theme';
import { useUniwind } from 'uniwind';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const TAB_BAR_HEIGHT = 64;
const FAB_SIZE = 60;

/** Returns the current semantic color palette based on active theme. */
function useColors() {
  const { theme } = useUniwind();
  return THEME[theme ?? 'dark'];
}

export function AddNewExpenseFab({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const [menuOpen, setMenuOpen] = useState(false);

  // Action items use chart colors from the theme for visual distinction
  const actions = [
    {
      key: 'voice',
      label: 'Voice',
      icon: <MicIcon size={22} color={colors.primaryForeground} />,
      color: colors.chart4,
    },
    {
      key: 'photo',
      label: 'Click Photo',
      icon: <CameraIcon size={22} color={colors.primaryForeground} />,
      color: colors.chart5,
    },
    {
      key: 'manual',
      label: 'Manual',
      icon: <PlusIcon size={22} color={colors.primaryForeground} />,
      color: colors.primary,
    },
    {
      key: 'gallery',
      label: 'Gallery',
      icon: <ImageIcon size={22} color={colors.primaryForeground} />,
      color: colors.chart2,
    },
  ];

  // Animations
  const overlayAnim = useRef(new Animated.Value(0)).current;
  const fabRotation = useRef(new Animated.Value(0)).current;

  // Ensure we have enough animation values for all actions
  const actionAnims = useRef<Animated.Value[]>([]);
  if (actionAnims.current.length !== actions.length) {
    actionAnims.current = actions.map((_, i) => actionAnims.current[i] || new Animated.Value(0));
  }

  const openMenu = useCallback(() => {
    setMenuOpen(true);
    Animated.parallel([
      Animated.spring(overlayAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 65,
        friction: 8,
      }),
      Animated.spring(fabRotation, {
        toValue: 1,
        useNativeDriver: true,
        tension: 65,
        friction: 8,
      }),
      ...actionAnims.current.map((anim, i) =>
        Animated.spring(anim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 65,
          friction: 8,
          delay: i * 60,
        })
      ),
    ]).start();
  }, [overlayAnim, fabRotation]);

  const closeMenu = useCallback(() => {
    Animated.parallel([
      Animated.timing(overlayAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.spring(fabRotation, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 8,
      }),
      ...actionAnims.current.map((anim) =>
        Animated.timing(anim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        })
      ),
    ]).start(() => setMenuOpen(false));
  }, [overlayAnim, fabRotation]);

  const handleFabPress = () => {
    if (menuOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  };

  const handleActionPress = (key: string) => {
    closeMenu();
    if (key === 'manual') {
      navigation.navigate('modal');
    }
  };

  const rotateInterpolation = fabRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'],
  });

  // Filter out hidden screens (+not-found, +html, etc.)
  const visibleRoutes = state.routes.filter((route) => {
    // Exclude special Expo Router routes
    if (route.name.startsWith('+')) return false;
    const { options } = descriptors[route.key];
    // Also exclude if tabBarStyle is set to display none
    if ((options.tabBarStyle as any)?.display === 'none') return false;
    return true;
  });

  // Split tabs: left side and right side of the FAB
  const midIndex = Math.ceil(visibleRoutes.length / 2);
  const leftTabs = visibleRoutes.slice(0, midIndex);
  const rightTabs = visibleRoutes.slice(midIndex);

  const renderTab = (route: typeof state.routes[0], index: number) => {
    const { options } = descriptors[route.key];
    const isFocused = state.index === state.routes.indexOf(route);

    const onPress = () => {
      const event = navigation.emit({
        type: 'tabPress',
        target: route.key,
        canPreventDefault: true,
      });

      if (!isFocused && !event.defaultPrevented) {
        navigation.navigate(route.name);
      }
    };

    const color = isFocused ? colors.primary : colors.mutedForeground;

    return (
      <TouchableOpacity
        key={route.key}
        accessibilityRole="button"
        accessibilityState={isFocused ? { selected: true } : {}}
        accessibilityLabel={options.tabBarAccessibilityLabel}
        onPress={onPress}
        style={styles.tabButton}
        activeOpacity={0.7}
      >
        {options.tabBarIcon?.({
          focused: isFocused,
          color,
          size: 24,
        })}
        <Animated.Text
          style={[
            styles.tabLabel,
            { color },
            isFocused && styles.tabLabelActive,
          ]}
        >
          {(options.tabBarLabel as string) ?? options.title ?? route.name}
        </Animated.Text>
        {isFocused && (
          <View style={[styles.activeIndicator, { backgroundColor: colors.primary }]} />
        )}
      </TouchableOpacity>
    );
  };

  // Get the tab bar style from the current screen's options
  const { options: currentOptions } = descriptors[state.routes[state.index].key];
  const screenTabBarStyle = currentOptions.tabBarStyle;

  return (
    <>
      {/* Backdrop overlay */}
      {menuOpen && (
        <Animated.View
          style={[
            styles.overlay,
            {
              opacity: overlayAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1],
              }),
            },
          ]}
        >
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={closeMenu}
          />

          {/* Action buttons */}
          <View style={styles.actionsContainer}>
            {actions.map((action, i) => {
              const translateY = actionAnims.current[i].interpolate({
                inputRange: [0, 1],
                outputRange: [80, 0],
              });
              const scale = actionAnims.current[i].interpolate({
                inputRange: [0, 1],
                outputRange: [0.3, 1],
              });

              return (
                <Animated.View
                  key={action.key}
                  style={[
                    styles.actionItem,
                    {
                      opacity: actionAnims.current[i],
                      transform: [{ translateY }, { scale }],
                    },
                  ]}
                >
                  <TouchableOpacity
                    onPress={() => handleActionPress(action.key)}
                    style={[styles.actionButton, { backgroundColor: action.color }]}
                    activeOpacity={0.8}
                  >
                    {action.icon}
                  </TouchableOpacity>
                  <Animated.Text
                    style={[
                      styles.actionLabel,
                      { color: '#FFFFFF', textShadowColor: 'rgba(0,0,0,0.5)', textShadowRadius: 2 }
                    ]}
                  >
                    {action.label}
                  </Animated.Text>
                </Animated.View>
              );
            })}
          </View>
        </Animated.View>
      )}

      {/* Floating Tab bar Container */}
      <Animated.View
        style={[
          styles.tabBar,
          {
            backgroundColor: colors.card,
            borderTopColor: colors.border,
          },
          screenTabBarStyle as any, // Cast as any to avoid strict Animated vs Static style conflicts
        ]}
      >
        {/* Left tabs */}
        <View style={styles.tabGroup}>
          {leftTabs.map((route, i) => renderTab(route, i))}
        </View>

        {/* FAB spacer */}
        <View style={styles.fabSpacer} />

        {/* Right tabs */}
        <View style={styles.tabGroup}>
          {rightTabs.map((route, i) => renderTab(route, i + midIndex))}
        </View>

        {/* FAB button (absolutely positioned relative to the floating container) */}
        <Animated.View
          style={[
            styles.fabContainer,
            { transform: [{ rotate: rotateInterpolation }] },
          ]}
        >
          <TouchableOpacity
            onPress={handleFabPress}
            style={[styles.fab, { backgroundColor: colors.primary }]}
            activeOpacity={0.85}
          >
            {menuOpen ? (
              <XIcon size={28} color={colors.primaryForeground} />
            ) : (
              <PlusIcon size={28} color={colors.primaryForeground} />
            )}
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>

    </>
  );
}


const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    zIndex: 90,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: TAB_BAR_HEIGHT + 40,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 28,
    alignItems: 'flex-end',
  },
  actionItem: {
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
    }),
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 100,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
      },
      android: {
        elevation: 12,
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
      },
    }),
  },
  tabGroup: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    gap: 3,
    position: 'relative',
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  tabLabelActive: {
    fontWeight: '700',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -2,
    width: 20,
    height: 3,
    borderRadius: 1.5,
  },
  fabSpacer: {
    width: FAB_SIZE + 16,
  },
  fabContainer: {
    position: 'absolute',
    left: '50%',
    marginLeft: -FAB_SIZE / 2,
    top: -FAB_SIZE / 3, // Sit slightly higher than the floating bar
    zIndex: 110,
  },
  fab: {
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: FAB_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
      },
      android: {
        elevation: 8,
      },
    }),
  },
});
