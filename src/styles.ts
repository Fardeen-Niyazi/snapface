import { StyleSheet } from 'react-native';
import { useTheme } from './theme';

export const useAppTheme = () => {
  const { colors, type, radius, sizes } = useTheme();
  return { colors, type, radius, sizes };
};

export const styles = StyleSheet.create({
  // Screen base style
  screen: {
    flex: 1,
    backgroundColor: 'colors.bg', // will be overridden at runtime
  },

  // Text styles
  textTitle: {
    // type.title styles + inline overrides
  },
  textBody: {
    // type.body styles + inline overrides
  },
  textCaption: {
    // type.caption styles + inline overrides
  },
  textButton: {
    // type.button styles + inline overrides
  },

  // View styles
  viewFlexRow: {
    flexDirection: 'row',
  },
  viewFlexColumn: {
    flexDirection: 'column',
  },
  viewCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Button styles
  buttonContainer: {
    height: 0, // will be set dynamically
    borderRadius: 0, // will be set dynamically
    paddingHorizontal: 0, // will be set dynamically
    backgroundColor: 'colors.accent', // will be overridden at runtime
  },

  // Chip styles
  chipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 0, // will be set dynamically
    backgroundColor: 'colors.surface', // will be overridden at runtime
    borderWidth: 1,
    borderColor: 'colors.line', // will be overridden at runtime
    opacity: 0.92,
  },

  // Header styles
  headerView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
});