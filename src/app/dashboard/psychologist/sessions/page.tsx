"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import axios from "axios";
import dayjs from "dayjs";

export default function PsychologistSessionsPage() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [verified, setVerified] = useState<boolean | null>(null);
  const router = useRouter();

  const checkVerification = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/v1/me/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      });
      const data = await res.json();
      if (!data.is_verified) {
        router.push("/dashboard/psychologist/profile");
      } else {
        setVerified(true);
      }
    } catch (err) {
      console.error("Failed to verify psychologist", err);
      setVerified(false);
    }
  };

  const getSessions = async () => {
    try {
      setError(null);
      setLoading(true);
      const res = await axios.get("http://localhost:8000/api/v1/my-sessions/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      });
      const data = res.data;
      const pendingSessions = data.filter((s: any) => s.status === "pending");
      setSessions(pendingSessions);
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Failed to fetch session data");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (sessionId: string, status: string) => {
    try {
      await axios.patch(
        `http://localhost:8000/api/v1/update-status/${sessionId}/`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        }
      );
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    } catch (err: any) {
      console.error("Status update error:", err);
    }
  };

  useEffect(() => {
    checkVerification().then(() => {
      getSessions();
    });
  }, []);

  if (loading || verified === null) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (sessions.length === 0)
    return <div className="text-center text-lg">Tidak ada permintaan sesi baru.</div>;

  return (
    <div className="flex flex-col flex-wrap gap-4">
      <h2 className="text-2xl font-semibold text-primary mb-3">
        Permintaan Sesi Konseling Masuk
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-50">
        {sessions.map((s, i) => (
          <Card key={i} className="w-[350px]">
            <CardHeader>
              <CardTitle>Session Request</CardTitle>
              <CardDescription>
                Diajukan pada {dayjs(s.created_at).format("DD MMM YYYY")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                <div>
                  <Label>Student</Label>
                  <div>{s.student?.username || "-"}</div>
                </div>
                <div>
                  <Label>Schedule</Label>
                  <div>{dayjs(s.schedule_time).format("dddd, D MMMM YYYY HH:mm")}</div>
                </div>
                <div>
                  <Label>Notes</Label>
                  <div>{s.notes || "-"}</div>
                </div>
                <div className="flex gap-3 mt-3">
                  <button
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    onClick={() => updateStatus(s.id, "accepted")}
                  >
                    Accept
                  </button>
                  <button
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    onClick={() => updateStatus(s.id, "rejected")}
                  >
                    Reject
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
