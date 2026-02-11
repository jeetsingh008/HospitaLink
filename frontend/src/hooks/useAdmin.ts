import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../lib/axios";
import { Appointment, Doctor } from "../types";

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

export const useAdminDoctors = () => {
    return useQuery({
        queryKey: ["doctors", "admin"],
        queryFn: async () => {
            const { data } = await api.get("/admin/doctors");
            return data.data as Doctor[];
        }
    })
}

export const useAllAppointments = () => {
    return useQuery({
        queryKey: ["appointments", "admin"],
        queryFn: async () => {
            const { data } = await api.get("/admin/all-appointments");
            return data.data as Appointment[];
        }
    })
}
