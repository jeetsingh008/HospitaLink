export interface User {
    _id: string;
    username: string;
    role: "patient" | "doctor" | "admin";
}

export interface Patient extends User {
    name: string;
}

export interface Doctor extends User {
    name: string;
    phoneNumber: string;
    specialization: string;
}

export interface Admin extends User {
    name: string;
}

export interface Slot {
    _id: string;
    date: string; // ISO Date string
    startTime: string;
    endTime: string;
    isBooked: boolean;
    doctorId: string; // or popluated Doctor object
    appointmentId?: string;
}

export interface Appointment {
    _id: string;
    patientId: string | Patient;
    doctorId: string | Doctor;
    slotId: string | Slot;
    reasonOfVisit: string;
    status: "Pending" | "Accepted" | "Completed" | "Cancelled";
    createdAt: string;
    updatedAt: string;
}
