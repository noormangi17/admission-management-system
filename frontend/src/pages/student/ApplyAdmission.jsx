import ApplicationForm from "../../components/common/ApplicationForm";

export default function ApplyAdmission() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <h1 className="text-4xl font-bold text-blue-700 mb-8">
        Admission Application
      </h1>

      <ApplicationForm />

    </div>
  );
}