import React from 'react';
import { createPost } from '../../../actions/feedback_forum_actions/Post_Actions';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import styled from "styled-components";
import Modal from '../../general/Modal';

const CreateHeader = styled.div`
    font-size: 4rem;
    margin-left: 3rem;
    margin-top: 2rem;
    color:  #172B4D;
    font-weight: 600;
`

const StyledInput = styled.input`

    font-size: 3rem;
    width: 55rem;
    height: 3.5rem;
    border: #DADCE0 solid 0.2rem;
    padding: 2rem;
    padding-left: 1.5rem;
    border-radius: 0.5rem;

    :focus {
        border: solid 0.2rem #3c40c6;
        outline: none;
    }
`
const InputHeader = styled.div`
    font-size: 2rem;
    font-weight: 600;
`
const InputContainer = styled.div`
    font-size: 2rem;
    margin-left: 3rem;
    margin-top: ${props => props.marginTop};
    font-weight: 600;
`

const Button = styled.button`
    background-color:#3c40c6;
    color: white;
    margin-left: ${props => props.marginLeft};
    margin-top: ${props => props.marginTop};
    width: ${props => props.width};
    height: ${props => props.height};
    font-size: 2rem;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;

    :hover {
        background-color:#575fcf;
    }
    :focus {
        outline: 0;
        box-shadow: none!important;
    }

`

class CreatePost extends React.Component {

    renderError({ error, touched }) {
        if (touched && error) {
            return (
                <div className = "ui error message">
                    <div className = "header">{error}</div>
                </div>
            )
        }
    }

    onSubmit = (formValues) => {
        this.props.onDismiss();
        this.props.createPost(formValues);
    }

    renderInput = ({input, label, meta, marginTop, placeholder}) => {
        return(
            <InputContainer marginTop = {`${marginTop}`}>
                <InputHeader>{label}</InputHeader>
                <StyledInput {...input} placeholder = {`${placeholder}`}/>
            </InputContainer>
        )
    }

    renderForm = () => {
        return(
            <form onSubmit = {this.props.handleSubmit(this.onSubmit)}>
                <Field marginTop = "4rem" name = "title" component = {this.renderInput} label = "Title" placeholder = "Enter post title" />
                <Field marginTop = "2rem" name = "body" component = {this.renderInput} label = "Body" placeholder = "Enter post body" />
                <Button width = "10rem" marginTop = "3rem" marginLeft = "48rem" height = "4rem">Submit</Button>
            </form>
        )
    }

    renderBody(){
        return(
            <>
                <CreateHeader>Create a Post</CreateHeader>
                {this.renderForm()}
            </>
        )
    }


    render(){
        return(
            <>  
                <Modal height = "40rem" width = "65rem" renderContent = {this.renderBody()} show = {this.props.show} onDismiss = {this.props.onDismiss}/>
            </>
        )
    }   
}

const validate = (formValues) => {
    const errors = {};
    if (!formValues.name) {
        errors.title = 'Name is invalid';
    }
    return errors;
}


export default reduxForm({
    form: 'create_post_form'
})(connect(null, { createPost })(CreatePost))
