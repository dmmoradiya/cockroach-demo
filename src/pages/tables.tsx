import Tables from "../components/Tables";
import { useEffect } from "react";
import { useRouter } from "next/router";

const TablesPage = () => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
    }
  }, [router]);

  return <Tables />;
};

export default TablesPage;
