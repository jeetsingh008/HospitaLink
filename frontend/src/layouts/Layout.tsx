import { useAuth } from "../context/AuthContext";
import { Link, Outlet, useLocation, Navigate } from "react-router-dom";
import {
    LayoutDashboard,
    Calendar,
    Users,
    UserCircle,
    LogOut,
    Menu,
    X,
    Clock
} from "lucide-react";
import { useState } from "react";
import clsx from "clsx";

const Layout = () => {
    const { user, logout, isLoading } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();

    if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    if (!user) return <Navigate to="/login" replace />;

    const navItems = {
        patient: [
            { label: "Find Doctors", path: "/patient/dashboard", icon: UserCircle },
            { label: "My Appointments", path: "/patient/appointments", icon: Calendar },
        ],
        doctor: [
            { label: "Dashboard", path: "/doctor/dashboard", icon: LayoutDashboard },
            { label: "Appointments", path: "/doctor/appointments", icon: Calendar },
        ],
        admin: [
            { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
            { label: "Doctors", path: "/admin/doctors", icon: Users },
            { label: "All Appointments", path: "/admin/appointments", icon: Clock },
        ]
    }[user.role];

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <aside
                className={clsx(
                    "fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out lg:transform-none flex flex-col",
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="h-16 flex items-center px-6 border-b border-gray-100">
                    <span className="text-xl font-bold text-gray-900">Hospital<span className="text-emerald-600">Link</span></span>
                </div>

                <div className="flex-1 overflow-y-auto py-4">
                    <div className="px-4 mb-6">
                        <div className="p-3 bg-gray-50 rounded-lg flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold">
                                {user.username[0].toUpperCase()}
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-sm font-medium text-gray-900 truncate">{user.username}</p>
                                <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                            </div>
                        </div>
                    </div>

                    <nav className="px-2 space-y-1">
                        {navItems?.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;

                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setIsSidebarOpen(false)}
                                    className={clsx(
                                        "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                                        isActive
                                            ? "bg-emerald-50 text-emerald-700"
                                            : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                                    )}
                                >
                                    <Icon size={18} />
                                    {item.label}
                                </Link>
                            )
                        })}
                    </nav>
                </div>

                <div className="p-4 border-t border-gray-100">
                    <button
                        onClick={logout}
                        className="flex items-center gap-3 px-3 py-2 w-full text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    >
                        <LogOut size={18} />
                        Sign Out
                    </button>
                </div>
            </aside>

            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-md lg:hidden"
                    >
                        <Menu size={24} />
                    </button>
                    <div className="flex-1" />
                </header>

                <main className="flex-1 overflow-y-auto p-4 lg:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;
