import { useAdminDoctors } from "../../hooks/useAdmin";
import { Card, Button } from "../../components/ui";
import { Plus, Search, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const DoctorsList = () => {
    const { data: doctors, isLoading } = useAdminDoctors();
    const [searchTerm, setSearchTerm] = useState("");

    const filteredDoctors = doctors?.filter(doctor =>
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) return <div className="p-8 text-center">Loading doctors...</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-900">Doctors</h1>
                <Link to="/admin/add-doctor">
                    <Button className="flex items-center gap-2">
                        <Plus size={18} /> Add Doctor
                    </Button>
                </Link>
            </div>

            <Card className="p-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search doctors by name or specialization..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDoctors?.map((doctor) => (
                    <Card key={doctor._id} className="overflow-hidden hover:shadow-md transition-shadow">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">{doctor.name}</h3>
                                    <p className="text-emerald-600 font-medium">{doctor.specialization}</p>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold shrink-0">
                                    {doctor.name[0]}
                                </div>
                            </div>

                            <div className="space-y-2 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                    <Phone size={16} className="text-gray-400" />
                                    <span>{doctor.phoneNumber || "No phone number"}</span>
                                </div>
                                {/* Add more details if available in the future */}
                            </div>
                        </div>
                    </Card>
                ))}

                {filteredDoctors?.length === 0 && (
                    <div className="col-span-full text-center py-12 text-gray-500 bg-white rounded-lg border border-dashed border-gray-300">
                        {searchTerm ? "No doctors found matching your search." : "No doctors added yet."}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DoctorsList;
