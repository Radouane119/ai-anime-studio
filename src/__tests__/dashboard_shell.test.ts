// Phase 7.1 — Dashboard Shell Test Suite

import { useShellStore } from '../store/useShellStore';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion Failed: ${message}`);
  }
}

export function runDashboardShellTestSuite() {
  console.log('🧪 Starting Phase 7.1 — Dashboard Shell Test Suite...');

  const store = useShellStore.getState();

  // 1. Initial Shell State Verification
  assert(store.activeTab === 'dashboard', 'Initial active tab must be "dashboard"');
  assert(store.sidebarCollapsed === false, 'Initial sidebar collapsed state must be false');
  assert(store.activeWorkspace.id === 'ws_prod_01', 'Initial active workspace must be "Studio AI Production"');
  assert(store.creditsRemaining === 14850, 'Initial credits remaining must be 14,850');
  assert(store.aiProviderStatus.provider === 'Gemini 1.5 Pro', 'Initial AI provider must be "Gemini 1.5 Pro"');

  // 2. Sidebar & Navigation State Mutations
  store.toggleSidebar();
  assert(useShellStore.getState().sidebarCollapsed === true, 'Sidebar toggle must set collapsed state to true');
  store.toggleSidebar();
  assert(useShellStore.getState().sidebarCollapsed === false, 'Sidebar toggle must set collapsed state to false');

  store.setActiveTab('novel');
  assert(useShellStore.getState().activeTab === 'novel', 'setActiveTab must update activeTab to "novel"');

  // 3. Workspace & Team Switchers
  const mockWorkspace = store.workspaces[1]; // Kyoto Anime Labs
  store.setActiveWorkspace(mockWorkspace);
  assert(useShellStore.getState().activeWorkspace.name === 'Kyoto Anime Labs', 'setActiveWorkspace must update active workspace');

  const mockTeam = store.teams[1]; // Key Animation & Rigging Unit
  store.setActiveTeam(mockTeam);
  assert(useShellStore.getState().activeTeam.name === 'Key Animation & Rigging Unit', 'setActiveTeam must update active team');

  // 4. Notifications & Unread Counter
  const initialUnread = useShellStore.getState().notifications.filter(n => !n.read).length;
  assert(initialUnread > 0, 'Must start with unread notifications');

  store.markAllNotificationsAsRead();
  const unreadAfter = useShellStore.getState().notifications.filter(n => !n.read).length;
  assert(unreadAfter === 0, 'markAllNotificationsAsRead must set all notification read flags to true');

  // 5. Pinned & Favorites Toggling
  const initialPinnedCount = useShellStore.getState().pinnedItems.length;
  const newPinItem = { id: 'pin_test_99', title: 'Test Project Pin', type: 'project' as const, tab: 'anime' as const, isFavorite: false };

  store.togglePinItem(newPinItem);
  assert(useShellStore.getState().pinnedItems.length === initialPinnedCount + 1, 'togglePinItem must add new pin when not present');

  store.togglePinItem(newPinItem);
  assert(useShellStore.getState().pinnedItems.length === initialPinnedCount, 'togglePinItem must remove pin when already present');

  // 6. Credit Deduction
  store.deductCredits(100);
  assert(useShellStore.getState().creditsRemaining === 14750, 'deductCredits must reduce credit balance by specified amount');

  console.log('✅ Phase 7.1 Dashboard Shell Test Suite PASSED SUCCESSFULLY!');
  return true;
}

// Execute test suite
runDashboardShellTestSuite();
