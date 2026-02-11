import { useState } from "react";
import { useAddDoctor } from "../../hooks/useAdmin";
import { Button, Input, Card } from "../../components/ui";
import { UserPlus, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const AddDoctor = () => {
    const navigate = useNavigate();
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
                setTimeout(() => navigate("/admin/doctors"), 1500);
            },
            onError: (err: any) => {
                setError(err.response?.data?.message || "Failed to add doctor");
            }
        });
    };

    return (
        <div className="max-w-2xl mx-auto">
            <Link to="/admin/doctors" className="inline-flex items-center text-gray-500 hover:text-gray-700 mb-6">
                <ArrowLeft size={20} className="mr-2" /> Back to Doctors
            </Link>

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
