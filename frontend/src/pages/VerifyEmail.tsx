import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api";

const VerifyEmail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get("token");
      if (token) {
        try {
          await api.post("/users/verify-email/", { token });
          setStatus("Your email has been successfully verified!");
        } catch (err: any) {
          setStatus(
            "Verification failed. The token may be invalid or expired."
          );
        }
      } else {
        setStatus("Invalid request. No verification token provided.");
      }
    };

    verifyEmail();
  }, [searchParams]);

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Email Verification</h2>
      {status ? (
        <p className="text-center text-lg">{status}</p>
      ) : (
        <p className="text-center text-lg">Verifying your email...</p>
      )}
    </div>
  );
};

export default VerifyEmail;
