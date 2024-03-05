import { useEffect } from "react";
import { useTasks } from "../context/tasksContext";
import { TaskCard } from "../components/tasks/TaskCard";
import { ImFileEmpty, ImDroplet } from "react-icons/im";
import ApexChart from '../components/Chart';
import ApexPieChart from '../components/pieChart';


export function TasksPage() {
  const { tasks, getTasks } = useTasks();

  useEffect(() => {
    getTasks();
  }, []);

  return (
    <>
      {tasks.length === 0 && (
        <div className="container justify-content:flex">
          <div className="mx-auto static">
            <ApexChart/>
          </div>
          <div className="mx-auto static">

          </div>
          <div>
          <ApexPieChart/>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2">
        {tasks.map((task) => (
          <TaskCard task={task} key={task._id} />
        ))}
      </div>
      

    </>
  );
}
