import {useRouter} from "next/router";
import {useState, useEffect} from "react";

export default function EditProject() {
    const router = useRouter();
    const {id} = router.query;

    const [name, setName] = useState('');
    const [projectName, setProjectName] = useState('');
    const [documents, setDocuments] = useState([]);
    const [video, setVideo] = useState(null);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const res = await fetch(`/api/projects/${id}`);
                if (!res.ok) {
                    throw new Error('Something went wrong');
                }
                const data = await res.json();
                setName(data.name);
                setProjectName(data.projectName);

            } catch (error) {
                setError(error.message);
            }
        };
        fetchProject().then();
    },[id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData();
        formData.append('name', name);
        formData.append('projectName', projectName);

        if (documents.length > 0) {
            for (let i = 0; i < documents.length; i++) {
                formData.append('documents', documents[i]);
            }
        }
        if (video) {
            formData.append('video', video);
        }
        try {
            const res = await fetch(`/api/projects/${id}`, {
                method: 'PUT',
                body: formData
            });
            if (!res.ok) throw new Error('Something went wrong');
            await router.push(`/products/${id}`);

        } catch (error) {
            setError(error.message);
            setIsSubmitting(false);
        }
    };
     const handleDocumentsChange = (e) => {
         setDocuments(e.target.files);
     };

     const handelVideoChange = (e) => {
         setVideo(e.target.files[0]);
     };

     return (
         <div>
             <h1>Edit project</h1>
             {error && <p>{error}</p>}
             <form onSubmit={handleSubmit}>
                 <div>
                     <label htmlFor="name">Your name:</label>
                     <input type="text" id={"name"} value={name}
                     onChange={(e) => setName(e.target.value)}
                     />
                 </div>
                 <div>
                     <label htmlFor="projectName">Project name:</label>
                     <input type="text" id={"projectName"} value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                     />
                 </div>
                 <div>
                     <label htmlFor="documents">Documents:</label>
                     <input type="file" id={'"documents'} multiple accept={".pdf,.doc"}
                            onChange={handleDocumentsChange}
                     />
                 </div>
                 <div>
                     <label htmlFor="video">Video:</label>
                     <input type="file" id={"video"} accept={".mp4"}
                            onChange={handelVideoChange}
                     />
                 </div>
                 <button type={"submit"} disabled={isSubmitting}>
                     {isSubmitting ? 'Updating...' : 'Update'}
                 </button>
             </form>
         </div>
     )
}