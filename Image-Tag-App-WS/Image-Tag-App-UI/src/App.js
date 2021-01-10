import ImageContainer from "./components/ImageContainer";
import Axios from "axios";
import { useState, useEffect } from "react";

function App() {

  const [imagesList, setImagesList] = useState([]);
  const [selectedImageInd, setSelectedImageInd] = useState('');
  const [reqErrMsg, setReqErrMsg] = useState('');

  useEffect(() => {
    (async () => {
      try {
        let { data } = await Axios.get("/imagesComments");
        setImagesList(data);
      } catch (error) {
        !error.response ? setReqErrMsg("Network Error") : setReqErrMsg(error.response?.data.message);
      }
    })();
  }, [])

  let addNewPointToAppAndDB = async (newCommentTobeAdded) => {
    let imagesListDum = [...imagesList];
    imagesListDum[selectedImageInd].pointCommentsArr.push(newCommentTobeAdded);
    setImagesList(imagesListDum);
    let bodyObj = { _id: imagesListDum[selectedImageInd]._id, newCommentTobeAdded };
    try {
      await Axios.put("/pointComment", bodyObj);
    } catch (error) {
      !error.response ? setReqErrMsg("Network Error") : setReqErrMsg(error.response?.data.message);
    }
  }
  return (
    <>
      <nav class="navbar navbar-light bg-light justify-content-between">
        <a class="navbar-brand">Image Tagging Demo</a>
      </nav>
      <div className='dropdown-container d-flex flex-column justify-content-center align-items-center'>
        <select className='form-control' defaultValue="NaN" onChange={({ target }) => {
          (async () => {
            await setSelectedImageInd('')
            setSelectedImageInd(target.value)
          })()
        }}>
          <option disabled defaultChecked={true} value='NaN'>Select an image</option>
          {imagesList.map(({ imageName }, index) => (
            <option key={imageName} value={index} >
              {imageName}
            </option>
          )
          )}
        </select>
        {reqErrMsg && <span className='text-danger'>{reqErrMsg}</span>}
        {imagesList.length === 0 && <span className='text-info'>{'Loading...'}</span>}
      </div>
      {selectedImageInd !== '' && <div className='image-comment-container' >
        <ImageContainer {...imagesList[selectedImageInd]} addNewPointToAppAndDB={addNewPointToAppAndDB} />
      </div>}
    </>
  );
}

export default App;