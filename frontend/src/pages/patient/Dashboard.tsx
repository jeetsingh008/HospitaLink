import { useState } from "react";
import { useDoctors, useDoctorSlots, useBookAppointment } from "../../hooks/usePatient";
import { Card, Button, Input } from "../../components/ui";
import { Modal } from "../../components/Modal";
import { UserCircle, Calendar, Clock } from "lucide-react";
import { Doctor, Slot } from "../../types";
import clsx from "clsx";

const PatientDashboard = () => {
    const { data: doctors, isLoading } = useDoctors();
    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleBookClick = (doctor: Doctor) => {
        setSelectedDoctor(doctor);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedDoctor(null);
    };

    if (isLoading) return <div className="p-8 text-center text-gray-500">Loading doctors...</div>;

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Find a Doctor</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {doctors?.map((doctor) => (
                    <Card key={doctor._id} className="flex flex-col items-center text-center hover:shadow-md transition-shadow">
                        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-4">
                            <UserCircle size={40} />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">{doctor.username}</h3>
                        <p className="text-sm text-gray-500 mb-1">{doctor.specialization || "General Physician"}</p>
                        <p className="text-xs text-gray-400 mb-4">Phone: {doctor.phoneNumber}</p>

                        <Button
                            onClick={() => handleBookClick(doctor)}
                            className="w-full mt-auto"
                        >
                            Book Appointment
                        </Button>
                    </Card>
                ))}
                {doctors?.length === 0 && (
                    <div className="col-span-full text-center text-gray-500 py-12">
                        No doctors found.
                    </div>
                )}
            </div>

            {selectedDoctor && (
                <BookingModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    doctor={selectedDoctor}
                />
            )}
        </div>
    );
};

const BookingModal = ({ isOpen, onClose, doctor }: { isOpen: boolean; onClose: () => void; doctor: Doctor }) => {
    const { data: slots, isLoading } = useDoctorSlots(doctor._id);
    const { mutate: bookAppointment, isPending } = useBookAppointment();

    const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
    const [reason, setReason] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = () => {
        if (!selectedSlot) return setError("Please select a time slot");
        if (!reason.trim()) return setError("Please provide a reason for visit");

        bookAppointment(
            { doctorId: doctor._id, slotId: selectedSlot._id, reasonOfVisit: reason },
            {
                onSuccess: () => {
                    onClose();
                    alert("Appointment booked successfully!");
                },
                onError: (err: any) => {
                    setError(err.response?.data?.message || "Booking failed");
                }
            }
        );
    };

    const groupedSlots = slots?.reduce((acc, slot) => {
        if (slot.isBooked) return acc;
        const date = new Date(slot.date).toLocaleDateString();
        if (!acc[date]) acc[date] = [];
        acc[date].push(slot);
        return acc;
    }, {} as Record<string, Slot[]>);

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Book Appointment with ${doctor.username}`}>
            <div className="space-y-6">
                <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                        <Calendar size={16} /> Select a Slot
                    </h4>

                    {isLoading ? (
                        <p className="text-sm text-gray-500">Loading slots...</p>
                    ) : !slots || slots.length === 0 ? (
                        <p className="text-sm text-gray-500">No available slots for this doctor.</p>
                    ) : (
                        <div className="max-h-60 overflow-y-auto space-y-4 pr-2">
                            {Object.entries(groupedSlots || {}).map(([date, dateSlots]) => (
                                <div key={date}>
                                    <p className="text-xs font-semibold text-gray-500 mb-2 sticky top-0 bg-white py-1">{date}</p>
                                    <div className="grid grid-cols-2 gap-2">
                                        {dateSlots.map(slot => (
                                            <button
                                                key={slot._id}
                                                onClick={() => { setSelectedSlot(slot); setError(""); }}
                                                className={clsx(
                                                    "flex items-center justify-center px-3 py-2 border rounded-md text-sm transition-all",
                                                    selectedSlot?._id === slot._id
                                                        ? "border-emerald-500 bg-emerald-50 text-emerald-700 font-medium ring-1 ring-emerald-500"
                                                        : "border-gray-200 hover:border-emerald-200 hover:bg-emerald-50/50"
                                                )}
                                            >
                                                <Clock size={14} className="mr-1.5" />
                                                {slot.startTime} - {slot.endTime}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            {Object.keys(groupedSlots || {}).length === 0 && (
                                <p className="text-sm text-gray-500">No available slots.</p>
                            )}
                        </div>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Visit</label>
                    <textarea
                        rows={3}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm resize-none"
                        placeholder="Briefly describe your symptoms..."
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                    />
                </div>

                {error && <p className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</p>}

                <div className="flex justify-end gap-3 pt-2">
                    <Button variant="ghost" onClick={onClose} disabled={isPending}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={isPending || !selectedSlot}>
                        {isPending ? "Booking..." : "Confirm Booking"}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default PatientDashboard;
