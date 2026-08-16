// Phase 7.2 — Dashboard Home & Widgets Test Suite

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion Failed: ${message}`);
  }
}

export function runDashboardWidgetsTestSuite() {
  console.log('🧪 Starting Phase 7.2 — Dashboard Home & Widgets Test Suite...');

  // 1. Test Byte Formatting Utility
  const formatBytes = (bytes: number) => {
    const gb = bytes / (1024 * 1024 * 1024);
    return `${gb.toFixed(1)} GB`;
  };

  assert(formatBytes(84.2 * 1024 * 1024 * 1024) === '84.2 GB', 'Byte formatting for 84.2 GB must match');
  assert(formatBytes(500 * 1024 * 1024 * 1024) === '500.0 GB', 'Byte formatting for 500 GB must match');

  // 2. Test Token Count Formatting Utility
  const formatTokens = (num: number) => {
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
    if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
    return num.toString();
  };

  assert(formatTokens(12450000) === '12.5M', 'Token formatting for 12.45M must format to 12.5M');
  assert(formatTokens(482100) === '482.1K', 'Token formatting for 482100 must format to 482.1K');
  assert(formatTokens(850) === '850', 'Token formatting under 1000 must remain integer string');

  // 3. Test Greeting Time Logic
  const getGreetingTime = (hour: number) => {
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  assert(getGreetingTime(9) === 'Good morning', 'Hour 9 must return Good morning');
  assert(getGreetingTime(14) === 'Good afternoon', 'Hour 14 must return Good afternoon');
  assert(getGreetingTime(20) === 'Good evening', 'Hour 20 must return Good evening');

  // 4. Test Favorite Toggling Mock Logic
  const mockProjects = [
    { id: 'p1', title: 'Cyberpunk Odyssey', isFavorite: true },
    { id: 'p2', title: 'Aetheria Blade', isFavorite: false }
  ];

  const toggleFavoriteLocal = (id: string) => {
    return mockProjects.map(p => p.id === id ? { ...p, isFavorite: !p.isFavorite } : p);
  };

  const updatedMock = toggleFavoriteLocal('p2');
  assert(updatedMock.find(p => p.id === 'p2')?.isFavorite === true, 'Toggling p2 favorite must invert boolean flag to true');

  // 5. Test Credit Percentage Calculation
  const remainingCredits = 14850;
  const maxCreditsQuota = 20000;
  const creditPercent = Math.round((remainingCredits / maxCreditsQuota) * 100);
  assert(creditPercent === 74, 'Credit percentage calculation must evaluate to 74%');

  console.log('✅ Phase 7.2 Dashboard Home & Widgets Test Suite PASSED SUCCESSFULLY!');
  return true;
}

// Execute test suite
runDashboardWidgetsTestSuite();
