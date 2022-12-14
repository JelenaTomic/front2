import React, { useContext, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import gql from "graphql-tag";
import { useMutation } from "@apollo/client";
import { AuthContext } from "../Context/auth";
import { useForm } from "../Utils/hooks";
import "../CSS/login.css";

export default function Login() {
	const [errors, setErrors] = useState([]);
	const history = useHistory();
	const context = useContext(AuthContext);

	const initialState = {
		username: "",
		password: "",
	};

	const { onChange, onSubmit, values } = useForm(loggedUser, initialState);
	const [loginUser, { loading }] = useMutation(LOGIN_USER, {
		update(_, { data: { login: userData } }) {
			context.login(userData);
			history.push("/");
		},
		onError(err) {
			setErrors(err.graphQLErrors[0].extensions.exception.errors);
		},
		variables: values,
	});

	function loggedUser() {
		loginUser();
	}

	return (
		<div className='login-container'>
			<div className='login-right'>
				<div className='login-wrapper'>
					<div className='login-form'>
						<h1 className='login-header'>Log In</h1>
						<form onSubmit={onSubmit}>
							<input
								type='text'
								className='input-field'
								name='username'
								placeholder='Username'
								value={values.username}
								onChange={onChange}
							/>
							<input
								type='password'
								className='input-field'
								name='password'
								placeholder='Password'
								value={values.password}
								onChange={onChange}
							/>
							<button type='submit' className='login-button'>
								{loading ? "Logging In" : "Log In"}
							</button>
						</form>
						{Object.keys(errors).length > 0 && (
							<div className='ui error message'>
								<div className='list'>
									{Object.values(errors).map((value) => (
										<li key={value}>{value}</li>
									))}
								</div>
							</div>
						)}
					</div>
					<div className='sign-up-new'>
						<span>New Here?</span>
						<Link className='signup-link' to='/register'>
							Sign Up Now
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}

const LOGIN_USER = gql`
	mutation login($username: String!, $password: String!) {
		login(username: $username, password: $password) {
			id
			email
			username
			createdAt
			token
		}
	}
`;
