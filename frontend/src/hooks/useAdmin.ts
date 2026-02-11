import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../lib/axios";
import { Appointment, Doctor } from "../types";

// Add a doctor
export const useAddDoctor = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: any) => {
            const { data } = await api.post("/admin/add-doctor", payload);
            return data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["doctors"] });
        }
    })
}

// Get all appointments (Admin)
export const useAllAppointments = () => {
    return useQuery({
        queryKey: ["appointments", "admin"],
        queryFn: async () => {
            const { data } = await api.get("/admin/all-appointments");
            return data.data as Appointment[];
        }
    })
}
