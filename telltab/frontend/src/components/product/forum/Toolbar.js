import React from 'react';
import { connect } from 'react-redux';
import { deletePost } from '../../../actions/feedback_forum_actions/Post_Actions'
import styled, {keyframes} from "styled-components";

const Bar = styled.div`
     display: flex;
     background-color: white;
     height: 5rem;
     border-radius: 0.5rem;
     margin-left: auto;
     margin-right: auto;
     margin-bottom: 2rem;
     border: #DADCE0 solid 0.05rem;
     box-shadow: rgba(23, 43, 77, 0.2) 0px 1px 1px, rgba(23, 43, 77, 0.2) 0px 0px 1px;
     width: 30rem;
`


 




class Toolbar extends React.Component {


     handleMultiDelete = () => {
          let toBeDeletedPosts = this.props.selectedPosts;
          toBeDeletedPosts.map((post) => {
               this.props.deletePost(post);
          })
     }    
     class="far fa-trash-alt"
    render(){
         return (
                    <Bar>
                         <i onClick = {this.handleMultiDelete} className="toolbar-item far fa-trash-alt"></i>
                         <i className="toolbar-item fas fa-tag"></i>
                         <i className="toolbar-item fas fa-angle-right"></i>
                         <i className="toolbar-item material-icons">remove_red_eye</i>
                         <i className="toolbar-item fas fa-address-book"></i>
                    </Bar>

         /*
        <div className = "toolbar">
           <div className = "toolbar__item">
               Select All
           </div>
           <div className = "toolbar__item">
                Delete
           </div>
           <div className = "toolbar__item">
                Move
           </div>
           <div className = "toolbar__item">
                Set Visibility
           </div>
           <div className = "toolbar__item">
                Tag
           </div>
           <div className = "toolbar__item">
                Change Progress
           </div>
           <div className = "toolbar__item">
                Assign
           </div>
           <div className = "toolbar__item">
                Chat
           </div>
           <div className = "toolbar__item">
                Add to Actions
           </div>
           <div className = "toolbar__item">
                Notify
           </div>
           <div className = "toolbar__item">
                Star
           </div>
        </div>
        */
          )
     }
}

const mapStateToProps = (state) => {
     return {
         selectedPosts: Object.values(state.postState.selectedPosts),
     }
 }

 export default connect(mapStateToProps, { deletePost })(Toolbar);