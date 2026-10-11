import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import StatusZone from '../components/StatusZone';
import type { AgentState } from '../types';
vi.mock('../useCountdown', () => ({ default: () => ({ hours: 0, minutes: 37, seconds: 42 }) }));
const state = { agent: { display_number: 7, telegram_username: 'liyu_agent', is_disabled: false }, status: { is_live: true, live_until: '2030-01-01T00:00:00Z', total_duration_minutes: 60 }, metrics: { clicks_today: 18, clicks_yesterday: 10, live_time_today_minutes: 252, sessions_today: 3 }, available_durations: [15, 30, 60], recommended_duration: 60, recent_activity: [], token_suffix: 'abcd', notices: [], withdrawal: { accepts_withdrawals: false, withdrawal_max: null, withdrawal_id: null, global_min: 200, global_max_default: 10000 } } satisfies AgentState;
describe('Mobile companion session controls', () => {
    it('selects a duration before submitting the session change', async () => {
        const onSelect = vi.fn(), user = userEvent.setup();
        render(<StatusZone state={state} onSelectDuration={onSelect} onGoOffline={vi.fn()} onTimerExpired={vi.fn()} isProcessing={false} />);
        await user.click(screen.getByRole('button', { name: '30 min' }));
        expect(onSelect).not.toHaveBeenCalled();
        await user.click(screen.getByRole('button', { name: 'Extend availability' }));
        expect(onSelect).toHaveBeenCalledWith(30);
    });
    it('disables unavailable durations and exposes remaining time accessibly', () => {
        render(<StatusZone state={state} onSelectDuration={vi.fn()} onGoOffline={vi.fn()} onTimerExpired={vi.fn()} isProcessing={false} />);
        expect(screen.getByRole('button', { name: '2 hours' })).toBeDisabled();
        expect(screen.getByRole('progressbar', { name: 'Session time remaining' })).toHaveAttribute('aria-valuenow', '63');
    });
});
