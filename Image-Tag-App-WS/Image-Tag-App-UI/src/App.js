import ImageContainer from "./components/ImageContainer";
import Axios from "axios";
import { useState, useEffect } from "react";
import axios from "axios";

function App() {

  const [imagesList, setImagesList] = useState([]);
  const [selectedImageInd, setSelectedImageInd] = useState('');
  const [reqErrMsg, setReqErrMsg] = useState('');

  useEffect(() => {
    (async () => {
      try {
        let { data } = await Axios.get("http://localhost:3500/imagesComments");
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
      await axios.put("http://localhost:3500/pointComment", bodyObj);
    } catch (error) {
      !error.response ? setReqErrMsg("Network Error") : setReqErrMsg(error.response?.data.message);
    }
  }
  return (
    <>
      <div className='dropdown-container d-flex flex-column justify-content-center align-items-center'>
        <select className='form-control' defaultValue="NaN" onChange={ ({ target }) => {
          (async () =>{
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