import { Component, createRef } from "react";

class CommentContainer extends Component {
    state = {
        textRef: createRef(),
        dotRef: createRef()
    }

    componentDidMount() {
        const { textRef, dotRef } = this.state;
        const { pointData,  imageRef} = this.props;
        textRef.current.style.top = (pointData.top * imageRef.current.offsetHeight ) + 3 + 'px';
        textRef.current.style.left = (pointData.left * imageRef.current.offsetWidth) + 3 + 'px';
        dotRef.current.style.top = (pointData.top * imageRef.current.offsetHeight ) - 2.5 + 'px';
        dotRef.current.style.left = (pointData.left * imageRef.current.offsetWidth) - 2.5 + 'px';
    }

    render() {
        const { textRef, dotRef } = this.state;
        const { pointData } = this.props
        return (
            <>
                <div className='dot' ref={dotRef} ></div>
                <div className='text' ref={textRef}>{pointData.comment}</div>
            </>
        );
    }
}

export default CommentContainer;