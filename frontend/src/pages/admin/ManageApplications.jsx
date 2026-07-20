import { useEffect, useState } from "react";
import API from "../../services/api";
import AdminLayout from "../../components/admin/AdminLayout";

export default function ManageApplications() {
    const BACKEND_URL = const BACKEND_URL = import.meta.env.VITE_API_URL;

    const [applications, setApplications] = useState([]);
    const [filteredApplications, setFilteredApplications] = useState([]);

    const [loading, setLoading] = useState(true);
    const [statusLoading, setStatusLoading] = useState(false);

    const [search, setSearch] = useState("");

    const [selectedApplication, setSelectedApplication] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchApplications();
    }, []);

    useEffect(() => {

        if (!search) {
            setFilteredApplications(applications);
            return;
        }

        const value = search.toLowerCase();

        const filtered = applications.filter((app) => {

            return (

                app.personalInfo?.fullName?.toLowerCase().includes(value) ||

                app.personalInfo?.email?.toLowerCase().includes(value) ||

                app.applicationId?.toLowerCase().includes(value) ||

                app.courseApplied?.courseName?.toLowerCase().includes(value)

            );

        });

        setFilteredApplications(filtered);

    }, [search, applications]);

    const fetchApplications = async () => {

        try {

            setLoading(true);

            const res = await API.get("/applications");

            setApplications(res.data.applications || []);
            setFilteredApplications(res.data.applications || []);

        } catch (err) {

            console.error(err);
            alert("Unable to load applications.");

        } finally {

            setLoading(false);

        }

    };

    const handleView = async (id) => {

        try {

            const res = await API.get(`/applications/${id}`);

            setSelectedApplication(res.data.application);

            setShowModal(true);

        } catch (err) {

            console.error(err);

            alert("Unable to load application.");

        }

    };

    const updateStatus = async (id, status) => {

        try {

            setStatusLoading(true);

            await API.put(`/applications/${id}/status`, {
                status,
            });

            alert(`Application ${status} successfully.`);

            fetchApplications();

            if (selectedApplication?._id === id) {

                const res = await API.get(`/applications/${id}`);

                setSelectedApplication(res.data.application);

            }

        } catch (err) {

            console.error(err);

            alert("Status update failed.");

        } finally {

            setStatusLoading(false);

        }

    };
    const downloadPDF = async () => {
        try {
            const response = await API.get(
                `/applications/${selectedApplication._id}/pdf`,
                {
                    responseType: "blob",
                }
            );

            const url = window.URL.createObjectURL(
                new Blob([response.data])
            );

            const link = document.createElement("a");

            link.href = url;
            link.download = `Application-${selectedApplication.applicationId}.pdf`;

            document.body.appendChild(link);
            link.click();

            link.remove();

            window.URL.revokeObjectURL(url);

        } catch (err) {
            console.error(err);
            alert("Failed to download PDF.");
        }
    };
    const statusBadge = (status) => {

        switch (status) {

            case "approved":

                return (
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                        Approved
                    </span>
                );

            case "rejected":

                return (
                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">
                        Rejected
                    </span>
                );

            case "under_review":

                return (
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                        Under Review
                    </span>
                );

            default:

                return (
                    <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">
                        Pending
                    </span>
                );

        }

    };

    return (

        <AdminLayout>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">

                <div>

                    <h1 className="text-3xl font-bold text-gray-800">
                        Manage Applications
                    </h1>

                    <p className="text-gray-500 mt-1">
                        View and manage all student applications
                    </p>

                </div>

                <div className="mt-4 md:mt-0">

                    <input
                        type="text"
                        placeholder="Search by name, email, course..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border border-gray-300 rounded-lg px-4 py-2 w-80 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                </div>

            </div>

            <div className="bg-white rounded-xl shadow overflow-hidden">

                {loading ? (

                    <div className="text-center py-12 text-lg">
                        Loading applications...
                    </div>

                ) : (

                    <div className="overflow-x-auto">

                        <table className="min-w-full">

                            <thead className="bg-gray-100">

                                <tr>

                                    <th className="p-4 text-left">Application ID</th>

                                    <th className="p-4 text-left">Student</th>

                                    <th className="p-4 text-left">Course</th>

                                    <th className="p-4 text-left">Status</th>

                                    <th className="p-4 text-left">Date</th>

                                    <th className="p-4 text-center">
                                        Actions
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {filteredApplications.length === 0 ? (

                                    <tr>

                                        <td
                                            colSpan="6"
                                            className="text-center py-10"
                                        >
                                            No Applications Found
                                        </td>

                                    </tr>

                                ) : (

                                    filteredApplications.map((app) => (

                                        <tr
                                            key={app._id}
                                            className="border-t hover:bg-gray-50 transition"
                                        >

                                            <td className="p-4 font-medium">
                                                {app.applicationId}
                                            </td>

                                            <td className="p-4">

                                                <div className="font-semibold">
                                                    {app.personalInfo?.fullName}
                                                </div>

                                                <div className="text-sm text-gray-500">
                                                    {app.personalInfo?.email}
                                                </div>

                                            </td>

                                            <td className="p-4">
                                                {app.courseApplied?.courseName}
                                            </td>

                                            <td className="p-4">
                                                {statusBadge(app.status)}
                                            </td>

                                            <td className="p-4">
                                                {new Date(app.submittedAt).toLocaleDateString()}
                                            </td>

                                            <td className="p-4">

                                                <div className="flex justify-center gap-2">

                                                    <button
                                                        onClick={() => handleView(app._id)}
                                                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded"
                                                    >
                                                        View
                                                    </button>

                                                    <button
                                                        disabled={statusLoading}
                                                        onClick={() =>
                                                            updateStatus(app._id, "approved")
                                                        }
                                                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded"
                                                    >
                                                        Approve
                                                    </button>

                                                    <button
                                                        disabled={statusLoading}
                                                        onClick={() =>
                                                            updateStatus(app._id, "rejected")
                                                        }
                                                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded"
                                                    >
                                                        Reject
                                                    </button>

                                                </div>

                                            </td>

                                        </tr>

                                    ))

                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>
            {showModal && selectedApplication && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">

                    <div className="bg-white rounded-xl shadow-xl w-11/12 max-w-5xl max-h-[90vh] overflow-y-auto">

                        {/* Header */}

                        <div className="flex items-center justify-between border-b p-5">

                            <div>

                                <h2 className="text-2xl font-bold">
                                    Application Details
                                </h2>

                                <p className="text-gray-500">
                                    {selectedApplication.applicationId}
                                </p>

                            </div>

                            <button
                                onClick={() => setShowModal(false)}
                                className="text-red-600 text-2xl font-bold"
                            >
                                ✕
                            </button>

                        </div>

                        {/* Body */}

                        <div className="grid md:grid-cols-2 gap-8 p-6">

                            {/* Personal */}

                            <div className="border rounded-lg p-5">

                                <h3 className="text-xl font-semibold mb-4">
                                    Personal Information
                                </h3>

                                <div className="space-y-2">

                                    <p><strong>Name:</strong> {selectedApplication.personalInfo?.fullName}</p>

                                    <p><strong>Father:</strong> {selectedApplication.personalInfo?.fatherName}</p>

                                    <p><strong>Mother:</strong> {selectedApplication.personalInfo?.motherName}</p>

                                    <p><strong>Email:</strong> {selectedApplication.personalInfo?.email}</p>

                                    <p><strong>Phone:</strong> {selectedApplication.personalInfo?.phone}</p>

                                    <p><strong>Gender:</strong> {selectedApplication.personalInfo?.gender}</p>

                                    <p><strong>Date of Birth:</strong> {selectedApplication.personalInfo?.dob}</p>

                                    <p><strong>Address:</strong> {selectedApplication.personalInfo?.address}</p>

                                </div>

                            </div>

                            {/* Academic */}

                            <div className="border rounded-lg p-5">

                                <h3 className="text-xl font-semibold mb-4">
                                    Academic Information
                                </h3>

                                <div className="space-y-2">

                                    <p><strong>Qualification:</strong> {selectedApplication.academicInfo?.previousQualification}</p>

                                    <p><strong>Percentage:</strong> {selectedApplication.academicInfo?.percentage}%</p>

                                    <p><strong>Passing Year:</strong> {selectedApplication.academicInfo?.passingYear}</p>

                                    <p><strong>Institute:</strong> {selectedApplication.academicInfo?.instituteName}</p>

                                    <hr className="my-4" />

                                    <p><strong>Course:</strong> {selectedApplication.courseApplied?.courseName}</p>

                                    <p>
                                        <strong>Status:</strong>{" "}
                                        {statusBadge(selectedApplication.status)}
                                    </p>

                                    <p>
                                        <strong>Remarks:</strong>{" "}
                                        {selectedApplication.remarks || "No remarks"}
                                    </p>

                                </div>

                            </div>

                        </div>

                        {/* Documents */}

                        <div className="px-6 pb-6">

                            <h3 className="text-xl font-semibold mb-4">
                                Uploaded Documents
                            </h3>

                            <div className="grid md:grid-cols-2 gap-4">

    <a
        href={`${BACKEND_URL}${selectedApplication.documents?.profilePhoto}`}
        target="_blank"
        rel="noreferrer"
        className="border rounded-lg p-3 hover:bg-gray-100"
    >
        📷 Profile Photo
    </a>

    <a
        href={`${BACKEND_URL}${selectedApplication.documents?.marksheet10}`}
        target="_blank"
        rel="noreferrer"
        className="border rounded-lg p-3 hover:bg-gray-100"
    >
        📄 10th Marksheet
    </a>

    <a
        href={`${BACKEND_URL}${selectedApplication.documents?.marksheet12}`}
        target="_blank"
        rel="noreferrer"
        className="border rounded-lg p-3 hover:bg-gray-100"
    >
        📄 12th Marksheet
    </a>

    <a
        href={`${BACKEND_URL}${selectedApplication.documents?.idProof}`}
        target="_blank"
        rel="noreferrer"
        className="border rounded-lg p-3 hover:bg-gray-100"
    >
        🪪 ID Proof
    </a>

</div>
                        </div>
                        {/* Footer */}

                        <div className="border-t p-6 flex flex-wrap justify-between items-center gap-3">

                            <div>

                                <button
                                    onClick={downloadPDF}
                                    className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg"
                                >
                                    Download PDF
                                </button>
                            </div>

                            <div className="flex gap-3">

                                <button
                                    disabled={statusLoading}
                                    onClick={() =>
                                        updateStatus(selectedApplication._id, "approved")
                                    }
                                    className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg"
                                >
                                    Approve
                                </button>

                                <button
                                    disabled={statusLoading}
                                    onClick={() =>
                                        updateStatus(selectedApplication._id, "rejected")
                                    }
                                    className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg"
                                >
                                    Reject
                                </button>

                                <button
                                    onClick={() => setShowModal(false)}
                                    className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded-lg"
                                >
                                    Close
                                </button>

                            </div>

                        </div>

                    </div>

                </div>
            )}

        </AdminLayout>

    );

}
