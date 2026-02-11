import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../lib/axios";
import { Appointment } from "../types";

export const useCreateSlot = () => {
    return useMutation({
        mutationFn: async (payload: { date: Date; startTime: string; endTime: string }) => {
            const { data } = await api.post("/doctors/slots", payload);
            return data.data;
        }
    })
}

export const useDoctorAppointments = () => {
    return useQuery({
        queryKey: ["appointments", "doctor"],
        queryFn: async () => {
            const { data } = await api.get("/doctors/appointments");
            return data.data as Appointment[];
        }
    })
}

export const useUpdateAppointmentStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ appointmentId, status }: { appointmentId: string; status: string }) => {
            const { data } = await api.patch(`/doctors/appointments/${appointmentId}/status`, { status });
            return data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["appointments", "doctor"] });
        }
    })
}
