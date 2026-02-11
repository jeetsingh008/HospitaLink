import { useAllAppointments } from "../../hooks/useAdmin";
import { useDoctors } from "../../hooks/usePatient";
import { Card } from "../../components/ui";
import { Users, Calendar, CheckCircle, Clock } from "lucide-react";
import clsx from "clsx";
import { format } from "date-fns";

const AdminDashboard = () => {
    const { data: appointments, isLoading: isLoadingApts } = useAllAppointments();
    const { data: doctors, isLoading: isLoadingDocs } = useDoctors();

    const stats = [
        {
            label: "Total Doctors",
            value: doctors?.length || 0,
            icon: Users,
            color: "bg-blue-100 text-blue-600"
        },
        {
            label: "Total Appointments",
            value: appointments?.length || 0,
            icon: Calendar,
            color: "bg-emerald-100 text-emerald-600"
        },
        {
            label: "Pending",
            value: appointments?.filter(a => a.status === "Pending").length || 0,
            icon: Clock,
            color: "bg-yellow-100 text-yellow-600"
        },
        {
            label: "Completed",
            value: appointments?.filter(a => a.status === "Completed").length || 0,
            icon: CheckCircle,
            color: "bg-purple-100 text-purple-600"
        },
    ];

    if (isLoadingApts || isLoadingDocs) return <div className="p-8 text-center">Loading dashboard...</div>;

    const StatusBadge = ({ status }: { status: string }) => {
        const styles = {
            Pending: "bg-yellow-100 text-yellow-800",
            Accepted: "bg-emerald-100 text-emerald-800",
            Completed: "bg-blue-100 text-blue-800",
            Cancelled: "bg-red-100 text-red-800",
        }[status] || "bg-gray-100 text-gray-800";

        return (
            <span className={clsx("px-2.5 py-0.5 rounded-full text-xs font-medium", styles)}>
                {status}
            </span>
        );
    };

    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={stat.label} className="flex items-center gap-4">
                            <div className={clsx("p-3 rounded-full", stat.color)}>
                                <Icon size={24} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                            </div>
                        </Card>
                    );
                })}
            </div>

            {/* Recent Appointments Table */}
            <Card className="overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                    <h3 className="text-lg font-medium text-gray-900">Recent Appointments</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {appointments?.slice(0, 10).map((apt) => {
                                const patient = apt.patientId as any;
                                const doctor = apt.doctorId as any;
                                const slot = apt.slotId as any;

                                return (
                                    <tr key={apt._id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {patient?.name || patient?.username}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {doctor?.name || doctor?.username}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {format(new Date(slot.date), "MMM d, yyyy")} {slot.startTime}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <StatusBadge status={apt.status} />
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    {!appointments?.length && (
                        <div className="p-6 text-center text-gray-500">No appointments found.</div>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default AdminDashboard;
