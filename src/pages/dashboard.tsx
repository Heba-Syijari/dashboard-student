import { useEffect } from "react";

import { Box } from "@mui/material";
import { useQuery } from "@tanstack/react-query";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import StudentsTable from "../components/StudentsTable";
import AddSection from "../components/AddSection";
import { useSession } from "../hooks/useSession";
import { getAllGenders, getAllGrades } from "../lib/http";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const navigate = useNavigate();

  const { token } = useSession();

  useQuery({
    queryKey: ["all-grades"],
    queryFn: () => getAllGrades(token!),
    enabled: token !== null,
  });

  useQuery({
    queryKey: ["all-genders"],
    queryFn: () => getAllGenders(token!),
    enabled: token !== null,
  });

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }
  }, [token, navigate]);

  return (
    <div className="w-full h-[90vh]">
      <Navbar />
      <div className="flex h-full bg-slate-100">
        <Box display={{ xs: "none", md: "block" }}>
          <Sidebar />
        </Box>
        <Box
          flexDirection="column"
          flexGrow={1}
          width={400}
          className="bg-white rounded-xl"
          m={3}
          px={3}
          py={4}
        >
          <AddSection />
          <StudentsTable />
        </Box>
      </div>
    </div>
  );
};

export default DashboardPage;
