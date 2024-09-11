import { selectRefetch } from "@/app/slices/refetchSlice";
import MonthlyTaskStats from "@/components/taskboard/MonthlyTaskStats";
import OverallTaskStats from "@/components/taskboard/OverallTaskStats";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import AllTasks from "./AllTasks";
import TaskList from "@/components/all-tasks/TaskList";
import Task from "@/lib/task";
import {
  fetchAllTasks,
  fetchClosedTasks,
  fetchOverdueTasks,
  fetchPendingTasks,
  fetchTaskByAbbreviation,
  fetchTaskByPriority,
} from "@/services/task-apis";
import TaskPrototype from "@/lib/task-prototype";
import Button from "@/components/ui/Button";

export default function TaskBoard() {
  const refetchFlag = useSelector(selectRefetch);

  const [taskPrototypes, setTaskPrototypes] = useState<TaskPrototype[]>([]);
  const [pageData, setPageData] = useState({
    pageNumber: 1,
    pageSize: 0,
    totalPages: 1,
    totalRecords: 0,
  });
  const [taskAbbreviation, setTaskAbbreviation] = useState("");
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [tabs, setTabs] = useState([
    { tabLabel: "All Tasks", isSelected: false },
    { tabLabel: "Overdue Tasks", isSelected: true },
    { tabLabel: "HIGH", isSelected: false },
    { tabLabel: "MEDIUM", isSelected: false },
    { tabLabel: "NORMAL", isSelected: false },
    { tabLabel: "Pending", isSelected: false },
    { tabLabel: "Closed", isSelected: false },
  ]);

  useEffect(() => {
    const selectedTab = tabs.find((tab) => tab.isSelected);
    if (selectedTab?.tabLabel === "All Tasks") {
      getAllTasks();
    } else if (selectedTab?.tabLabel === "Overdue Tasks") {
      getOverdueTasks(pageData.pageNumber);
    } else if (
      selectedTab?.tabLabel === "HIGH" ||
      selectedTab?.tabLabel === "MEDIUM" ||
      selectedTab?.tabLabel === "NORMAL"
    ) {
      getTasksByPriority(selectedTab.tabLabel, pageData.pageNumber);
    } else if (selectedTab?.tabLabel === "Pending") {
      getPendingTasks(pageData.pageNumber);
    } else if (selectedTab?.tabLabel === "Closed") {
      getClosedTasks(pageData.pageNumber);
    }
  }, [refetchFlag, tabs]);

  const getAllTasks = async () => {
    try {
      const response = await fetchAllTasks(pageData.pageNumber);
      console.log(response);
      setAllTasks(response.content);
    } catch (error) {
      console.log(error);
    }
  };

  const getTasksByPriority = async (priority: string, page: number) => {
    try {
      const response = await fetchTaskByPriority(pageData.pageNumber, priority);
      console.log(response);
      setAllTasks(response.content);
    } catch (error) {
      console.log(error);
    }
  };

  const getPendingTasks = async (page: number) => {
    try {
      const response = await fetchPendingTasks(pageData.pageNumber);
      console.log(response);
      setAllTasks(response.content);
    } catch (error) {
      console.log(error);
    }
  };

  const getOverdueTasks = async (page: number) => {
    try {
      const response = await fetchOverdueTasks(pageData.pageNumber);
      console.log(response);
      setAllTasks(response.content);
    } catch (error) {
      console.log(error);
    }
  };

  const getClosedTasks = async (page: number) => {
    try {
      const response = await fetchClosedTasks(pageData.pageNumber);
      console.log(response);
      setAllTasks(response.content);
    } catch (error) {
      console.log(error);
    }
  };

  const handleTabChange = (index: number) => {
    const newTabs = tabs.map((tab, idx) => {
      if (idx === index) {
        return { ...tab, isSelected: true };
      } else {
        return { ...tab, isSelected: false };
      }
    });

    setTabs(newTabs);
  };

  const handleReset = () => {
    setTaskAbbreviation("");

    const selectedTab = tabs.find((tab) => tab.isSelected);
    if (selectedTab?.tabLabel === "All Tasks") {
      getAllTasks();
    } else if (selectedTab?.tabLabel === "Overdue Tasks") {
      getOverdueTasks(pageData.pageNumber);
    } else if (
      selectedTab?.tabLabel === "HIGH" ||
      selectedTab?.tabLabel === "MEDIUM" ||
      selectedTab?.tabLabel === "NORMAL"
    ) {
      getTasksByPriority(selectedTab.tabLabel, pageData.pageNumber);
    } else if (selectedTab?.tabLabel === "Pending") {
      getPendingTasks(pageData.pageNumber);
    } else if (selectedTab?.tabLabel === "Closed") {
      getClosedTasks(pageData.pageNumber);
    }
  };

  const handleSearchTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetchTaskByAbbreviation(taskAbbreviation);
      setAllTasks([response]);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container-fluid p-3 h-100 w-100 border overflow-auto">
      <div id="taskboard-area" className="gap-5 h-100">
        <div id="taskboard-a1">
          <OverallTaskStats />
          {/* {window.innerWidth > 767 ? <AllTasks /> : <MonthlyTaskStats />} */}
        </div>
        <div id="taskboard-a2">
          <h3 className="mb-3">This Month (September 2024)</h3>
          <div className="overflow-y-auto">
            <MonthlyTaskStats />
          </div>
          <div className="my-5 overflow-auto">
            <h3>All Tasks</h3>
            <ul
              className="p-0 d-flex gap-3 border-bottom mt-3"
              style={{ listStyle: "none", minWidth: "1464px" }}
            >
              {tabs.map((tab, index) => (
                <li
                  key={tab.tabLabel}
                  onClick={() => handleTabChange(index)}
                  style={{
                    cursor: "pointer",
                    fontSize: "15px",
                    minWidth: "110px",
                  }}
                  className={`${tab.isSelected ? "border-bottom text-primary border-primary" : ""} pb-2 text-center`}
                >
                  {tab.tabLabel}
                </li>
              ))}
            </ul>
            <form
              className="d-flex align-items-center gap-2"
              onSubmit={handleSearchTask}
            >
              <div className="my-3">
                <input
                  type="text"
                  className="form-control"
                  value={taskAbbreviation}
                  onChange={(e) => setTaskAbbreviation(e.target.value)}
                  placeholder="type task_id..."
                />
              </div>
              <div className="my-3 d-flex gap-2">
                <Button>Search</Button>
                <Button type="button" variant="info" onClick={handleReset}>
                  Reset
                </Button>
              </div>
            </form>
            <TaskList
              tasks={allTasks}
              onSelectTask={() => {}}
              selectedTasks={[]}
            />
          </div>
          {/* {window.innerWidth > 767 ? <MonthlyTaskStats /> : <AllTasks />} */}
        </div>
      </div>
    </div>
  );
}
