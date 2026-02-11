import { useAllAppointments } from "../../hooks/useAdmin";
import { Card } from "../../components/ui";
import { format } from "date-fns";
import clsx from "clsx";
import { Calendar } from "lucide-react";

const AdminAppointments = () => {
    const { data: appointments, isLoading } = useAllAppointments();

    if (isLoading) return <div className="p-8 text-center">Loading appointments...</div>;

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
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Calendar className="text-emerald-600" /> All Appointments
            </h1>

            <Card className="overflow-hidden">
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
                            {appointments?.map((apt) => {
                                const patient = apt.patientId as any;
                                const doctor = apt.doctorId as any;
                                const slot = apt.slotId as any;

                                return (
                                    <tr key={apt._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {patient?.name || patient?.username || "Unknown"}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {doctor?.name || doctor?.username || "Unknown"}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {slot ? (
                                                <>
                                                    {format(new Date(slot.date), "MMM d, yyyy")} {slot.startTime}
                                                </>
                                            ) : "Date not available"}
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
                        <div className="p-8 text-center text-gray-500">No appointments found.</div>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default AdminAppointments;
