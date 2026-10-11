import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import PublicOnlyRoute from '@/components/PublicOnlyRoute';
import AdminLayout from '@/components/AdminLayout';
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const AgentsPage = lazy(() => import('@/pages/AgentsPage'));
const OverviewPage = lazy(() => import('@/pages/analytics/OverviewPage'));
const AgentsAnalyticsPage = lazy(() => import('@/pages/analytics/AgentsAnalyticsPage'));
const CustomersPage = lazy(() => import('@/pages/analytics/CustomersPage'));
const CoveragePage = lazy(() => import('@/pages/analytics/CoveragePage'));
const WithdrawalsPage = lazy(() => import('@/pages/analytics/WithdrawalsPage'));
const PaymentMethodsPage = lazy(() => import('@/pages/PaymentMethodsPage'));
const SettingsPage = lazy(() => import('@/pages/SettingsPage'));
const NoticesPage = lazy(() => import('@/pages/NoticesPage'));
const ActivityPage = lazy(() => import('@/pages/ActivityPage'));

// Old /admin/analytics URL keeps working — forward to Overview with filters.
function AnalyticsRedirect() {
    const location = useLocation();
    return <Navigate to={`/admin/analytics/overview${location.search}`} replace />;
}

export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Suspense fallback={<div className="ly-empty" role="status">Loading workspace…</div>}><Routes>
                    <Route element={<PublicOnlyRoute />}>
                        <Route path="/admin/login" element={<LoginPage />} />
                    </Route>
                    <Route element={<ProtectedRoute />}>
                        <Route element={<AdminLayout />}>
                            <Route path="/admin" element={<DashboardPage />} />
                            <Route path="/admin/agents" element={<AgentsPage />} />
                            <Route path="/admin/analytics" element={<AnalyticsRedirect />} />
                            <Route path="/admin/analytics/overview" element={<OverviewPage />} />
                            <Route path="/admin/analytics/agents" element={<AgentsAnalyticsPage />} />
                            <Route path="/admin/analytics/customers" element={<CustomersPage />} />
                            <Route path="/admin/analytics/coverage" element={<CoveragePage />} />
                            <Route path="/admin/analytics/withdrawals" element={<WithdrawalsPage />} />
                            <Route path="/admin/payment-methods" element={<PaymentMethodsPage />} />
                            <Route path="/admin/settings" element={<SettingsPage />} />
                            <Route path="/admin/notices" element={<NoticesPage />} />
                            <Route path="/admin/activity" element={<ActivityPage />} />
                        </Route>
                    </Route>
                </Routes></Suspense>
            </AuthProvider>
        </BrowserRouter>
    );
}
