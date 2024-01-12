import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CircularProgress, Pagination } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import toast from "react-hot-toast";
import axios from "axios";
import { useState } from "react";

const Projects = () => {
  // const { id } = useParams();
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const allProjects = async (page = 1) => {
    const response = await axios.get(`api/projects/?page=${page}`);
    return response.data;
  };

  const handlePageChange = async (event, newPage) => {
    const nextPage = event === 'next' ? newPage + 1 : event === 'previous' ? newPage + 1: newPage;
    
    // queryClient.invalidateQueries(["projects"]);
    setCurrentPage(nextPage);
    queryClient.removeQueries({
      queryKey: ["projects", nextPage],
      exact: true
    })
    queryClient.fetchQuery({
      queryKey: ["projects", nextPage],
      queryFn: () => allProjects(nextPage),
    });
  };

  const { data, isLoading, error } = useQuery({
    queryFn: () => allProjects(currentPage),
    queryKey: ["projects", currentPage],
    keepPreviousData: true,
  });

  const totalPages = Math.ceil(data?.count / data?.results.length);

  const { mutate } = useMutation(
    async (id) => await axios.delete(`api/projects/${id}/`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["projects"]);
        toast.success("Project deleted 💪", { duration: 5000 });
      },
    }
  );
  const deleteProject = (id) => {
    mutate(id);
  };
  if (error) return error;
  if (isLoading)
    return (
      <CircularProgress
        color="inherit"
        className="items-center mx-auto justify-center"
      />
    );

  return (
    <div>
      <div className="container">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 p-8">
          {data.results.map((project) => (
            <div key={project.id} className="bg-white shadow rounded-xl p-1">
              <h3 className="font-semibold text-center">
                {project.project_name}
              </h3>
              <h5 className="text-center">{project.duration}</h5>
              <p className="bg-gradient-to-r from-blue-300 to-purple-400 text-center">
                {project.description}
              </p>
              <p className="bg-gradient-to-r from-violet-300 via-amber-400 to-teal-500">
                From <strong>{project.start_date}</strong>
                <em> to {project.end_date}</em>
              </p>
              <img
                src={project.get_image_url}
                alt={`Project ${project.project_name}`}
                className="w-full h-28 object-cover"
              />
              {/* <iframe src={project.get_documentation_url} className="h-64 w-64"></iframe> */}
              {/* <object data={project.get_documentation_url} type="application/pdf" className="h-64 w-64"></object> */}
              <video
                src={project.get_video_url}
                controls="controls"
                className="w-full h-48 object-cover rounded-b-lg my-1"
              >
                <source src={project.get_video_url} type="video/mp4" />
              </video>
              {project.id && (
                <button
                  onClick={() => deleteProject(project.id)}
                  className="btn bg-red-400 text-white rounded-md hover:bg-red-600 p-2"
                >
                  Delete
                  <Delete />
                </button>
              )}
              <Link
                to={`/projects/${project.id}`}
                className="rounded-md bg-emerald-600 hover:bg-green-700 text-white p-2 m-2"
              >
                Update
                <Edit />
              </Link>
            </div>
          ))}
        </div>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          className="float-right mb-6 mt-2"
        />
      </div>
    </div>
  );
};

export default Projects;
