import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { VolunteerStatistics } from "./objects/types";
import { fetchVolunteerStatistics } from "./services/volunteerActions";
import { user } from "./objects/user";

const VolunteerStatisticsPage: React.FC = () => {
  const [statistics, setStatistics] = useState<VolunteerStatistics[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchStatistics = async () => {
      if (!user) {
        toast.error("Privalote būti prisijungęs.");
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await fetchVolunteerStatistics(user.id);

        if (error) {
          throw new Error(error);
        }

        setStatistics(data || []);
        setLoading(false);
      } catch (err: any) {
        toast.error(err.message || "Nepavyko gauti savanorystės statistikos.");
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  if (!user) {
    return <div className="container mx-auto p-4">Prašome prisijungti.</div>;
  }

  if (loading) {
    return <div className="container mx-auto p-4">Kraunama statistika...</div>;
  }

  if (statistics.length === 0) {
    return <div className="container mx-auto p-4">Statistikos nerasta.</div>;
  }

  const totalMinutesWorked = statistics.reduce((acc, stat) => acc + stat.minutes_worked, 0);
  const totalEventCount = statistics.reduce((acc, stat) => acc + stat.event_count, 0);
  const averageRating = statistics.reduce((acc, stat) => acc + stat.rating, 0) / statistics.length;

  return (
    <div className="container mx-auto p-4">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <h1 className="text-2xl font-bold mb-6">Mano savanorystės statistika</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold mb-2">Iš viso renginių</h2>
          <p className="text-3xl font-bold text-blue-600">{totalEventCount}</p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold mb-2">Iš viso minučių</h2>
          <p className="text-3xl font-bold text-green-600">{totalMinutesWorked}</p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold mb-2">Vidutinis įvertinimas</h2>
          <p className="text-3xl font-bold text-purple-600">
            {isNaN(averageRating) ? 'N/A' : averageRating.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="mt-8 bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Išsami statistika</h2>
        <table className="w-full">
          <tbody>
            <tr className="border-b">
              <td className="py-2">Bendras dalyvautų renginių skaičius</td>
              <td className="py-2 font-bold text-right">{totalEventCount}</td>
            </tr>
            <tr className="border-b">
              <td className="py-2">Bendras savanorystės minučių skaičius</td>
              <td className="py-2 font-bold text-right">{totalMinutesWorked}</td>
            </tr>
            <tr>
              <td className="py-2">Vidutinis įvertinimas</td>
              <td className="py-2 font-bold text-right">
                {isNaN(averageRating) ? 'N/A' : averageRating.toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VolunteerStatisticsPage;