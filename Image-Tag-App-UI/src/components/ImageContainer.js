import { Component, createRef } from "react";
import CommentContainer from "./CommentContainer";

class ImageContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imageRef: createRef(),
            inputRef: createRef(),
            newPoint: {
                top: "",
                left: ""
            },
            display: true,
            mounted: false
        }
    }

    componentDidMount() {
        this.setState({ mounted: true })
        let keyUpEvent = (event) => {
            if (event.keyCode === 13) {
                this.addNewPoint()
            }
        }
        this.state.inputRef.current.addEventListener("keyup",keyUpEvent);
        window.addEventListener('resize', () => {
            this.state.mounted && this.setState({ display: false, newPoint: { left: "", right: "" } },
                () => this.setState({ display: true }))
        });
    }

    componentWillUnmount() {
        this.setState({ mounted: false })
    }

    setInputLoc = ({ left, top }) => {
        let { inputRef, imageRef } = this.state;
        inputRef.current.style.left = left * imageRef.current.offsetWidth + 'px';
        inputRef.current.style.top = top * imageRef.current.offsetHeight + 5 + "px";
    }

    createNewPoint = ({ clientX, clientY }) => {
        let { newPoint, imageRef, inputRef } = this.state;
        inputRef.current.value = "";
        let rect = imageRef.current.getBoundingClientRect();
        newPoint.left = (Math.abs(clientX - rect.left) / imageRef.current.offsetWidth);
        newPoint.top = (Math.abs(clientY - rect.top) / imageRef.current.offsetHeight);
        this.setState({ newPoint });
        this.setInputLoc(newPoint);
    }

    addNewPoint = () => {
        let { newPoint, inputRef } = this.state;
        let newCommentTobeAdded = { ...newPoint, comment: inputRef.current.value };
        inputRef.current.value = "";
        this.setState({ newPoint: { left: "", right: "" } });
        this.props.addNewPointToAppAndDB(newCommentTobeAdded);
    }

    render() {
        const { imageRef, inputRef, newPoint, display } = this.state;
        let newPointCommentsArr = [...this.props.pointCommentsArr];
        return (
            display &&
            <div className='absolute-container'>
                <img id='img' ref={imageRef} src={'/' + this.props.imageURL}
                    onClick={this.createNewPoint} alt="alternate text" />
                {newPointCommentsArr.map((eachPoint, index) => <CommentContainer pointData={eachPoint} imageRef={imageRef} key={index} />)}
                {<input className='input' id='input' ref={inputRef} autoFocus={true} style={newPoint.left ? {} : { display: 'none' }} />}
            </div>
        );
    }
}

export default ImageContainer;