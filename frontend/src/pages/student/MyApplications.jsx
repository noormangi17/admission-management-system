import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import StudentLayout from "../../components/Student/StudentLayout";
import { useAuth } from "../../context/AuthContext";
import API from "../../services/api";

export default function MyApplications() {
  const { token } = useAuth();
  

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchApplications();
  }, []);

 const fetchApplications = async () => {
  try {
    setLoading(true);

    const res = await API.get("/applications/my");

    setApplications(res.data.applications || []);

  } catch (err) {
    console.error(err);
    alert("Unable to load applications");
  } finally {
    setLoading(false);
  }
};

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      const id = app.applicationId?.toLowerCase() || "";
      const course =
        app.courseApplied?.courseName?.toLowerCase() || "";

      return (
        id.includes(search.toLowerCase()) ||
        course.includes(search.toLowerCase())
      );
    });
  }, [applications, search]);

  const downloadPDF = async (id) => {
  try {
    const response = await API.get(
      `/applications/${id}/pdf`,
      {
        responseType: "blob",
      }
    );

    const file = new Blob([response.data], {
      type: "application/pdf",
    });

    const fileURL = window.URL.createObjectURL(file);

    const link = document.createElement("a");
    link.href = fileURL;
    link.download = "Application.pdf";

    document.body.appendChild(link);
    link.click();

    link.remove();

    window.URL.revokeObjectURL(fileURL);

  } catch (err) {
    console.error(err);
    alert("Unable to download PDF");
  }
};
  const statusBadge = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-700";

      case "rejected":
        return "bg-red-100 text-red-700";

      case "under_review":
        return "bg-yellow-100 text-yellow-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <StudentLayout>

      <div className="bg-white rounded-xl shadow-md p-6">

        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">

          <div>
            <h1 className="text-3xl font-bold">
              My Applications
            </h1>

            <p className="text-gray-500 mt-1">
              View your submitted admission applications.
            </p>
          </div>

          <input
            type="text"
            placeholder="Search by ID or Course..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-lg px-4 py-2 w-full md:w-80"
          />

        </div>

        {loading ? (

          <div className="text-center py-20">

            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto"></div>

            <p className="mt-4 text-gray-500">
              Loading Applications...
            </p>

          </div>

        ) : filteredApplications.length === 0 ? (

          <div className="text-center py-16">

            <h2 className="text-2xl font-semibold">
              No Applications Found
            </h2>

            <p className="text-gray-500 mt-2">
              You have not submitted any admission application.
            </p>

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="min-w-full border">

              <thead className="bg-blue-700 text-white">

                <tr>

                  <th className="px-4 py-3 text-left">
                    Application ID
                  </th>

                  <th className="px-4 py-3 text-left">
                    Course
                  </th>

                  <th className="px-4 py-3 text-left">
                    Date
                  </th>

                  <th className="px-4 py-3 text-left">
                    Status
                  </th>

                  <th className="px-4 py-3 text-center">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>
                {filteredApplications.map((app) => (

  <tr
    key={app._id}
    className="border-b hover:bg-gray-50"
  >

    <td className="px-4 py-4 font-medium">
      {app.applicationId}
    </td>

    <td className="px-4 py-4">
      {app.courseApplied?.courseName}
    </td>

    <td className="px-4 py-4">
      {new Date(app.submittedAt).toLocaleDateString()}
    </td>

    <td className="px-4 py-4">

      <span
        className={`px-3 py-1 rounded-full text-sm font-semibold ${statusBadge(
          app.status
        )}`}
      >
        {app.status.replace("_", " ")}
      </span>

    </td>

    <td className="px-4 py-4">

      <div className="flex flex-wrap gap-2 justify-center">

        <button
          onClick={() => setSelectedApplication(app)}
          className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700"
        >
          View
        </button>

        <button
          onClick={() => downloadPDF(app._id)}
          className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700"
        >
          PDF
        </button>

        {app.status === "pending" && (

          <button
            className="bg-yellow-500 text-white px-3 py-2 rounded hover:bg-yellow-600"
          >
            Edit
          </button>

        )}

      </div>

    </td>

  </tr>

))}
</tbody>

</table>

</div>

)}
{selectedApplication && (

<div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

  <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl p-8 max-h-[90vh] overflow-y-auto">

    <div className="flex justify-between items-center mb-6">

      <h2 className="text-2xl font-bold">
        Application Details
      </h2>

      <button
        onClick={() => setSelectedApplication(null)}
        className="text-red-600 text-2xl"
      >
        ×
      </button>

    </div>

    <div className="grid md:grid-cols-2 gap-6">

      <div>

        <h3 className="font-bold mb-3 text-blue-700">
          Personal Information
        </h3>

        <p><strong>Name:</strong> {selectedApplication.personalInfo.fullName}</p>

        <p><strong>Father:</strong> {selectedApplication.personalInfo.fatherName}</p>

        <p><strong>Mother:</strong> {selectedApplication.personalInfo.motherName}</p>

        <p><strong>Email:</strong> {selectedApplication.personalInfo.email}</p>

        <p><strong>Phone:</strong> {selectedApplication.personalInfo.phone}</p>

        <p><strong>Gender:</strong> {selectedApplication.personalInfo.gender}</p>

      </div>

      <div>

        <h3 className="font-bold mb-3 text-blue-700">
          Academic Information
        </h3>

        <p><strong>Qualification:</strong> {selectedApplication.academicInfo.previousQualification}</p>

        <p><strong>Percentage:</strong> {selectedApplication.academicInfo.percentage}%</p>

        <p><strong>Passing Year:</strong> {selectedApplication.academicInfo.passingYear}</p>

        <p><strong>Institute:</strong> {selectedApplication.academicInfo.instituteName}</p>

        <p><strong>Course:</strong> {selectedApplication.courseApplied?.courseName}</p>

      </div>

    </div>
          <div className="mt-8">

        <h3 className="font-bold text-blue-700 mb-3">
          Documents
        </h3>

        <div className="grid md:grid-cols-2 gap-4">

          {selectedApplication.documents.profilePhoto && (
            <a
              href={`http://localhost:5000${selectedApplication.documents.profilePhoto}`}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 hover:underline"
            >
              Profile Photo
            </a>
          )}

          {selectedApplication.documents.marksheet10 && (
            <a
              href={`http://localhost:5000${selectedApplication.documents.marksheet10}`}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 hover:underline"
            >
              10th Marksheet
            </a>
          )}

          {selectedApplication.documents.marksheet12 && (
            <a
              href={`http://localhost:5000${selectedApplication.documents.marksheet12}`}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 hover:underline"
            >
              12th Marksheet
            </a>
          )}

          {selectedApplication.documents.idProof && (
            <a
              href={`http://localhost:5000${selectedApplication.documents.idProof}`}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 hover:underline"
            >
              ID Proof
            </a>
          )}

        </div>

      </div>

      <div className="mt-8">

        <h3 className="font-bold text-blue-700 mb-3">
          Remarks
        </h3>

        <div className="bg-gray-100 rounded-lg p-4">
          {selectedApplication.remarks || "No remarks available."}
        </div>

      </div>

      <div className="mt-8">

        <h3 className="font-bold text-blue-700 mb-3">
          Status History
        </h3>

        {selectedApplication.statusHistory?.length ? (

          <div className="space-y-3">

            {selectedApplication.statusHistory.map((history, index) => (

              <div
                key={index}
                className="border rounded-lg p-4"
              >

                <div className="flex justify-between">

                  <span className="font-semibold capitalize">
                    {history.status.replace("_", " ")}
                  </span>

                  <span className="text-gray-500">
                    {new Date(history.changedAt).toLocaleDateString()}
                  </span>

                </div>

                {history.remark && (
                  <p className="text-gray-600 mt-2">
                    {history.remark}
                  </p>
                )}

              </div>

            ))}

          </div>

        ) : (

          <p className="text-gray-500">
            No status history available.
          </p>

        )}

      </div>

      <div className="flex justify-end mt-8">

        <button
          onClick={() => setSelectedApplication(null)}
          className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
        >
          Close
        </button>

      </div>

    </div>

  </div>

)}

</div>

</StudentLayout>

  );
}