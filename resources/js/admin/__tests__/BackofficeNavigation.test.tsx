import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
const logout = vi.fn();
vi.mock('@/context/AuthContext', () => ({ useAuth: () => ({ user: { name: 'Liyu' }, logout }) }));
function renderOffice() { return render(<MemoryRouter initialEntries={['/admin']}><Routes><Route element={<AdminLayout />}><Route path="/admin" element={<h1>Operations overview</h1>} /><Route path="/admin/agents" element={<h1>Agent cards</h1>} /></Route></Routes></MemoryRouter>); }
beforeEach(() => { localStorage.clear(); logout.mockReset(); });
describe('Backoffice navigation', () => {
    it('finds and opens a workspace page', async () => {
        const user = userEvent.setup(); renderOffice();
        await user.type(screen.getByRole('textbox', { name: 'Find a backoffice page' }), 'Agent network');
        await user.click(screen.getByRole('button', { name: 'Agent network' }));
        expect(await screen.findByText('Agent cards')).toBeInTheDocument();
    });
    it('opens the mobile menu and closes it with Escape', async () => {
        const user = userEvent.setup(); renderOffice();
        await user.click(screen.getByRole('button', { name: 'Open navigation' }));
        expect(screen.getByRole('dialog', { name: 'Backoffice navigation' })).toBeInTheDocument();
        await user.keyboard('{Escape}');
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
    it('persists theme changes', async () => {
        const user = userEvent.setup(); renderOffice();
        await user.click(screen.getByRole('button', { name: 'Switch to light theme' }));
        expect(document.documentElement.dataset.adminTheme).toBe('light');
        expect(localStorage.getItem('banabet-admin-theme')).toBe('light');
    });
    it('reports failed logout while keeping the workspace accessible', async () => {
        logout.mockRejectedValue(new Error('Offline')); const user = userEvent.setup(); renderOffice();
        await user.click(screen.getByRole('button', { name: 'Sign out' }));
        await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('Could not sign out'));
        expect(screen.getByText('Operations overview')).toBeInTheDocument();
    });
});
