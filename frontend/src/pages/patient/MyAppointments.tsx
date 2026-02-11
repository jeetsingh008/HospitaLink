import { usePatientAppointments, useCancelAppointment } from "../../hooks/usePatient";
import { Card, Button } from "../../components/ui";
import { Calendar, Clock} from "lucide-react";
import clsx from "clsx";
import { format } from "date-fns";
import { Doctor } from "../../types";

const MyAppointments = () => {
    const { data: appointments, isLoading } = usePatientAppointments();
    const { mutate: cancelAppointment, isPending } = useCancelAppointment();

    if (isLoading) return <div className="p-8 text-center text-gray-500">Loading appointments...</div>;

    const handleCancel = (appointmentId: string) => {
        if (confirm("Are you sure you want to cancel this appointment?")) {
            cancelAppointment(appointmentId);
        }
    }

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
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">My Appointments</h1>

            <div className="space-y-4">
                {appointments?.map((apt) => {
                    const doctor = apt.doctorId as Doctor;
                    const slot = apt.slotId as any;

                    return (
                        <Card key={apt._id} className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-lg font-semibold text-gray-900">Dr. {doctor.name || doctor.username}</h3>
                                    <StatusBadge status={apt.status} />
                                </div>
                                <p className="text-sm text-gray-500 mb-2">{doctor.specialization}</p>

                                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                    <div className="flex items-center gap-1.5">
                                        <Calendar size={16} />
                                        <span>{format(new Date(slot.date), "MMM d, yyyy")}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Clock size={16} />
                                        <span>{slot.startTime} - {slot.endTime}</span>
                                    </div>
                                </div>

                                {apt.reasonOfVisit && (
                                    <div className="mt-3 p-3 bg-gray-50 rounded-md text-sm text-gray-700">
                                        <span className="font-medium">Reason:</span> {apt.reasonOfVisit}
                                    </div>
                                )}
                            </div>

                            {(apt.status === "Pending" || apt.status === "Accepted") && (
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => handleCancel(apt._id)}
                                    disabled={isPending}
                                >
                                    Cancel Appointment
                                </Button>
                            )}
                        </Card>
                    );
                })}

                {appointments?.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-lg border border-gray-100">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 text-gray-400 mb-3">
                            <Calendar size={24} />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">No appointments yet</h3>
                        <p className="text-gray-500 mt-1">Book your first appointment to see it here.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyAppointments;
