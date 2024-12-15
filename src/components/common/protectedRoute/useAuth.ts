import { useState, useEffect } from "react";
import { User } from "../../../volunteers/objects/types";
import { getCurrentUser } from "../../../volunteers/services/volunteerActions";
import { user } from "../../../volunteers/objects/user";
import { toast } from "react-toastify";

interface AuthContextProps {
  currentUser: User | null;
  loading: boolean;
}

export const useAuth = (): AuthContextProps => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCurrentUserData = async () => {
      try {
        if (!user || !user.id) {
          toast.error("Jūs privalote būti prisijungęs.");
          setLoading(false);
          return;
        }

        const { data: currUser, error: userError } = await getCurrentUser(user.id);
        if (userError || !currUser) {
          toast.error("Jūs privalote būti prisijungęs.");
          setLoading(false);
          return;
        }

        setCurrentUser(currUser);
      } catch (err: any) {
        toast.error(err.message || "Įvyko netikėta klaida.");
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUserData();
  }, []);

  return { currentUser, loading };
};
