import { useState } from "react";
import { useAddDoctor } from "../../hooks/useAdmin";
import { Button, Input, Card } from "../../components/ui";
import { UserPlus } from "lucide-react";

const AddDoctor = () => {
    const [formData, setFormData] = useState({
        name: "",
        username: "",
        password: "",
        specialization: "",
        phoneNumber: ""
    });
    const { mutate: addDoctor, isPending } = useAddDoctor();
    const [msg, setMsg] = useState("");
    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setMsg(""); setError("");

        addDoctor(formData, {
            onSuccess: () => {
                setMsg("Doctor added successfully");
                setFormData({ name: "", username: "", password: "", specialization: "", phoneNumber: "" });
            },
            onError: (err: any) => {
                setError(err.response?.data?.message || "Failed to add doctor");
            }
        });
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <UserPlus className="text-emerald-600" /> Add New Doctor
            </h2>

            <Card>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Full Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        label="Username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        label="Password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        label="Specialization"
                        name="specialization"
                        value={formData.specialization}
                        onChange={handleChange}
                        placeholder="e.g. Cardiologist"
                    />
                    <Input
                        label="Phone Number"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        required
                    />

                    {msg && <p className="text-emerald-600 text-sm">{msg}</p>}
                    {error && <p className="text-red-600 text-sm">{error}</p>}

                    <Button type="submit" disabled={isPending} className="w-full">
                        {isPending ? "Adding..." : "Add Doctor"}
                    </Button>
                </form>
            </Card>
        </div>
    );
};

export default AddDoctor;
