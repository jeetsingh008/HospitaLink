import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../lib/axios";
import { Doctor, Slot, Appointment } from "../types";

// Fetch all doctors
export const useDoctors = () => {
    return useQuery({
        queryKey: ["doctors"],
        queryFn: async () => {
            const { data } = await api.get("/patients/doctors");
            return data.data as Doctor[];
        },
    });
};

// Fetch slots for a doctor
export const useDoctorSlots = (doctorId: string | null) => {
    return useQuery({
        queryKey: ["slots", doctorId],
        queryFn: async () => {
            if (!doctorId) return [];
            const { data } = await api.get(`/patients/doctors/${doctorId}/slots`);
            return data.data as Slot[];
        },
        enabled: !!doctorId,
    });
};

// Book an appointment
export const useBookAppointment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: { doctorId: string; slotId: string; reasonOfVisit: string }) => {
            const { data } = await api.post("/patients/appointments", payload);
            return data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["slots"] });
            queryClient.invalidateQueries({ queryKey: ["appointments"] });
        }
    })
}

// Fetch patient appointments
export const usePatientAppointments = () => {
    return useQuery({
        queryKey: ["appointments", "patient"],
        queryFn: async () => {
            const { data } = await api.get("/patients/appointments");
            return data.data as Appointment[];
        }
    })
}

// Cancel appointment
export const useCancelAppointment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (appointmentId: string) => {
            const { data } = await api.patch(`/patients/appointments/${appointmentId}/cancel`);
            return data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["appointments"] });
            queryClient.invalidateQueries({ queryKey: ["slots"] });
        }
    })
}
