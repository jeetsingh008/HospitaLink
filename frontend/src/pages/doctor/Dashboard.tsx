import { useState } from "react";
import { useCreateSlot, useDoctorAppointments, useUpdateAppointmentStatus } from "../../hooks/useDoctor";
import { Card, Button, Input } from "../../components/ui";
import { Calendar, Clock, CheckCircle, XCircle, Check } from "lucide-react";
import clsx from "clsx";
import { format } from "date-fns";

const DoctorDashboard = () => {
    const [date, setDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [msg, setMsg] = useState("");

    const { mutate: createSlot, isPending: isCreating } = useCreateSlot();
    const { data: appointments, isLoading } = useDoctorAppointments();
    const { mutate: updateStatus } = useUpdateAppointmentStatus();

    const handleCreateSlot = (e: React.FormEvent) => {
        e.preventDefault();
        setMsg("");

        createSlot(
            { date: new Date(date), startTime, endTime },
            {
                onSuccess: () => {
                    setMsg("Slot created successfully!");
                    setDate(""); setStartTime(""); setEndTime("");
                },
                onError: (err: any) => {
                    setMsg(err.response?.data?.message || "Failed to create slot");
                }
            }
        );
    };

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
            {/* Create Slot Section */}
            <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Manage Schedule</h2>
                <Card className="max-w-3xl">
                    <form onSubmit={handleCreateSlot} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                            <input
                                type="date"
                                required
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                            <input
                                type="time"
                                required
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                            <input
                                type="time"
                                required
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                            />
                        </div>
                        <Button type="submit" disabled={isCreating}>
                            {isCreating ? "Adding..." : "Add Slot"}
                        </Button>
                    </form>
                    {msg && (
                        <p className={clsx("mt-4 text-sm", msg.includes("success") ? "text-emerald-600" : "text-red-600")}>
                            {msg}
                        </p>
                    )}
                </Card>
            </section>

            {/* Appointments Section */}
            <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Appointments</h2>

                {isLoading ? (
                    <div className="text-gray-500">Loading appointments...</div>
                ) : (
                    <div className="grid gap-4">
                        {appointments?.map((apt) => {
                            const patient = apt.patientId as any;
                            const slot = apt.slotId as any;

                            return (
                                <Card key={apt._id} className="flex flex-col md:flex-row justify-between gap-4">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-semibold text-gray-900">{patient.name}</h3>
                                            <StatusBadge status={apt.status} />
                                        </div>
                                        <div className="space-y-1 text-sm text-gray-600">
                                            <p className="flex items-center gap-2"><Calendar size={16} /> {format(new Date(slot.date), "MMM d, yyyy")}</p>
                                            <p className="flex items-center gap-2"><Clock size={16} /> {slot.startTime} - {slot.endTime}</p>
                                        </div>
                                        {apt.reasonOfVisit && (
                                            <div className="mt-3 text-sm text-gray-700 bg-gray-50 p-2 rounded">
                                                <span className="font-semibold">Reason:</span> {apt.reasonOfVisit}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-col gap-2 justify-center min-w-[140px]">
                                        {apt.status === "Pending" && (
                                            <>
                                                <Button
                                                    size="sm"
                                                    onClick={() => updateStatus({ appointmentId: apt._id, status: "Accepted" })}
                                                    className="w-full"
                                                >
                                                    <CheckCircle size={16} className="mr-2" /> Accept
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="danger"
                                                    onClick={() => updateStatus({ appointmentId: apt._id, status: "Cancelled" })}
                                                    className="w-full"
                                                >
                                                    <XCircle size={16} className="mr-2" /> Cancel
                                                </Button>
                                            </>
                                        )}
                                        {apt.status === "Accepted" && (
                                            <Button
                                                size="sm"
                                                variant="secondary"
                                                onClick={() => updateStatus({ appointmentId: apt._id, status: "Completed" })}
                                                className="w-full text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                                            >
                                                <Check size={16} className="mr-2" /> Mark Completed
                                            </Button>
                                        )}
                                    </div>
                                </Card>
                            )
                        })}
                        {appointments?.length === 0 && (
                            <p className="text-gray-500">No appointments found.</p>
                        )}
                    </div>
                )}
            </section>
        </div>
    );
};

export default DoctorDashboard;
