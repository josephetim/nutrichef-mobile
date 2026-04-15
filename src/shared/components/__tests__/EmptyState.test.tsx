import { fireEvent, render } from '@testing-library/react-native';

import { EmptyState } from '@/src/shared/components/EmptyState';

describe('EmptyState', () => {
  it('renders copy and fires the action callback', () => {
    const onActionPress = jest.fn();
    const screen = render(
      <EmptyState
        title="No favorites"
        description="Save a meal first."
        actionLabel="Search"
        onActionPress={onActionPress}
      />
    );

    expect(screen.getByText('No favorites')).toBeTruthy();
    expect(screen.getByText('Save a meal first.')).toBeTruthy();

    fireEvent.press(screen.getByText('Search'));

    expect(onActionPress).toHaveBeenCalledTimes(1);
  });
});
