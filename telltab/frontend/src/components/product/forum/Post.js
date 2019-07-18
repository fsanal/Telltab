import React from 'react';
import { DropdownButton } from 'react-bootstrap'
import { Dropdown } from 'react-bootstrap';
import styled, {keyframes} from "styled-components";
import DropDown from '../../general/DropDown';


const Feedback = styled.div`
    font-family: 'Lato', sans-serif;
    margin-left: 2rem
    margin-bottom: 0.7rem; 
    cursor:pointer;
    border: ${props => props.border};
    border-radius: 0.3rem;
    background-color: white;
    display: flex;
    color: black;
    min-height: 7rem;
    width: 75rem;
    margin-left: 2rem;
    box-shadow: rgba(23, 43, 77, 0.2) 0px 1px 1px, rgba(23, 43, 77, 0.2) 0px 0px 1px;
    
    
`


const VoteBox = styled.div` 
    width: 3rem;
    font-size: 2rem;
    margin-left: 1.5rem;
    margin-top: 1.2rem;
    text-align: center;
    font-weight: 600;
    color: #DADCE0;
`

const FeedbackContent = styled.div` 
    margin-left: 2rem;
    width: 100%;
    margin-top: 0.6rem;
    margin-bottom: 0.6rem;
    position: relative;
    
`

const FeedbackTitle = styled.div` 
    font-size: 2.3rem;
    height: 2rem;
    font-weight: bold;
    margin-bottom: 1rem;
    color: #172B4D;
`

const FeedbackDescription = styled.div`
    font-size: 2rem;
    font-weight: 400;
    width: 50rem;
    word-wrap: break-word;
    color: #666666;
    line-height: 2rem;
`

const DropDownItem = styled.li`
    height: 2rem;
    z-index: 2
    left: 0;
    top: 100%;
    width: 100%;
    :hover {
        background-color: #DADCE0;
        color: black;
    }
    font-size: 0.3rem;
`

const TagContainer = styled.div`
    display: flex;
    margin-top: 1rem;
`

const Tag = styled.div`
    border: #DADCE0 2px solid;
    padding-left: 1rem;
    padding-right: 1rem;
    height: 3rem;
    margin-right: 1rem;
    font-size: 2rem;
    text-align: center;
`


class Post extends React.Component {

    renderTags() {
        return (
            <TagContainer>
                {this.props.tags.map(tag => {
                    return (<Tag>{tag}</Tag>)
                })}
            </TagContainer>
        )
    }

    renderChangeProgress() {
        return(
            <>
                <DropDownItem onClick = {() => {this.props.changeProgress(this.props.post, "Under Review")}}>Under Review</DropDownItem>
                <DropDownItem onClick = {() => {this.props.changeProgress(this.props.post, "In Progress")}}>In Progress</DropDownItem>
                <DropDownItem onClick = {() => {this.props.changeProgress(this.props.post, "Complete")}}>Complete</DropDownItem>
            </>
        )
    }

    renderActions() {
        return(
            <>
                <DropDownItem onClick = {this.props.onDelete} >Delete</DropDownItem>
                <DropDownItem onClick = {this.props.addPostTag} >Add Tag</DropDownItem>
                <DropDownItem >Change Visibility</DropDownItem>
            </>
        )
    }


    render(){
        return (
            <div>
                <Feedback border = {this.props.border}>
                    <VoteBox className = {this.props.voteCls} >
                            <i onClick = {this.props.onVote} class="far fa-caret-square-up fa-2x"></i>
                            <div>{this.props.numVotes}</div>
                    </VoteBox>
                    <FeedbackContent onClick = {this.props.showPost}  onContextMenu = {this.props.onSelect}>
                        <FeedbackTitle>
                            {this.props.title}
                        </FeedbackTitle>
                        <div>{this.props.progress}</div>
                        <FeedbackDescription>
                            {this.props.body}
                        </FeedbackDescription>
                        {this.renderTags()}
                    </FeedbackContent>
                    <DropDown renderBody = {this.renderChangeProgress()} />
                    <DropDown renderBody = {this.renderActions()} />
                </Feedback>
            </div>
        )
    }
}



/*
<div >
                    <DropdownButton title = {this.props.progress} id = "post__dropdown2" >
                            <Dropdown.Item onClick = {() => {this.props.changeProgress(this.props.post, "Under Review")}}>Under Review</Dropdown.Item>
                            <Dropdown.Item onClick = {() => {this.props.changeProgress(this.props.post, "In Progress")}}>In Progress</Dropdown.Item>
                            <Dropdown.Item onClick = {() => {this.props.changeProgress(this.props.post, "Complete")}}>Complete</Dropdown.Item>
                    </DropdownButton>
                </div>



<div className = "feedback__delete">
                    <DropdownButton title = "" id = "post__dropdown" >
                            <Dropdown.Item  onClick = {this.props.onDelete} >Delete</Dropdown.Item>
                            <Dropdown.Item onClick = {this.props.addPostTag} >Add Tag</Dropdown.Item>
                            <Dropdown.Item >Change Visibility</Dropdown.Item>
                    </DropdownButton>
                </div>
*/

/*
className = {`feedback__votes ${props.voteCls}`}
<div className = "feedback__votes">
                    <i class="far fa-caret-square-up fa-2x"></i>
                    <div>{props.votes}</div>
                </div>

<div className = "feedback__person">
                    <div className = "feedback__person-picture">
                        <i className="fas fa-user-circle"></i>
                    </div>
                    <div className = "feedback__person-name">{props.name}</div>
                </div>
*/

export default Post;