/* eslint-disable @typescript-eslint/no-unused-vars */
import { Link, Outlet, useParams } from "react-router-dom";
import Navbar from "@/components/global/Navbar";
import NavigationLinks from "@/components/global/NavigationLinks";
import { AuthProvider } from "@/providers/AuthProvider";

import Loading from "../global/Loading";
import { useSelector } from "react-redux";
import { selectLoading } from "@/app/slices/loadingSlice";

import "@/styles/HomeLayout.css";
// import MyToast from "../ui/MyToast";

export default function HomeLayout() {
  const { taskId, functionId } = useParams();
  const loadingVisibility = useSelector(selectLoading);
  // const [messages, setMessages] = useState<string[]>([]);

  return (
    <AuthProvider>
      {loadingVisibility && <Loading />}
      <Navbar />
      <main id="home-container" className="d-flex m-0 overflow-hidden">
        <aside className={`sidebar col-md-2 px-0 pt-3 text-white bg-dark `}>
          <NavigationLinks />
          <img
            src="/sidebar-image2.png"
            alt="sidebar-image2.png"
            className="w-100"
          />
          <p className="border-top border-secondary w-100 text-center p-2 m-0">
            v1.3
          </p>
        </aside>
        <section id="shared-area" className="px-0 overflow-hidden">
          <div
            aria-label="breadcrumb"
            className="border px-3 pt-2"
            style={{ height: "50px" }}
          >
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/home">Home</Link>
              </li>
              {taskId && (
                <li className="breadcrumb-item">
                  <Link to={`/home/tasks/${taskId}`}>Task-{taskId}</Link>
                </li>
              )}
              {functionId && (
                <li className="breadcrumb-item">
                  <Link to={`/home/tasks/${taskId}/${functionId}`}>
                    Function-{functionId}
                  </Link>
                </li>
              )}
            </ol>
          </div>
          <div id="shared-container" className="">
            <Outlet />
          </div>
        </section>
        {/* <MyToast  /> */}
      </main>
    </AuthProvider>
  );
}
