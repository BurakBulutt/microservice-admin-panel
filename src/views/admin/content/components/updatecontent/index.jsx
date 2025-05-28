import ContentCard from "../contentcard/index.jsx";
import {useParams} from "react-router-dom";

const UpdateContent = () => {
    const {id} = useParams();
    return id && <ContentCard id={id}/>
}

export default UpdateContent;