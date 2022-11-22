import { useMutation } from "@apollo/client";
import Rating from "@material-ui/lab/Rating";
import gql from "graphql-tag";
import React from "react";
import { useState } from "react";
import "../CSS/addDesc.css";
import { useForm } from "../Utils/hooks";

export default function AddDesc({ newPlace, setNewPins, setNewPlace }) {
	const [errors, setErrors] = useState([]);
	const lat = newPlace.lat;
	const long = newPlace.long;

	const initialState = {
		title: "",
		body: "",
		rating: 1,
		publishedAt: new Date().toISOString().slice(0, 10),
		lat,
		long,
	};
	const { onChange, onSubmit, values } = useForm(pinCreate, initialState);

	const [createPin, { loading }] = useMutation(CREATE_PIN, {
		update(_, { data: { createPin: pinData } }) {
			setNewPins((prevState) => [...prevState, pinData]);
			setNewPlace(null);
		},
		onError(err) {
			if (err.graphQLErrors[0].message.startsWith("Authorization"))
				setErrors("You must login to create a Pin");
			else setErrors(err.graphQLErrors[0].message);
		},
		variables: values,
	});

	function pinCreate() {
		createPin();
	}

	return (
		<div className='addDesc-container'>
			<div className='addDesc-wrapper'>
				<form className='addDesc-form' onSubmit={onSubmit}>
					<div className='form-items'>
						<label className='label'>Title</label>
						<input
							type='text'
							className='title-input'
							name='title'
							value={values.title}
							onChange={onChange}
						/>
					</div>
					<div className='form-items'>
						<label className='label'>Description</label>
						<textarea
							placeholder='Write a review...'
							className='txt-area'
							name='body'
							value={values.body}
							onChange={onChange}
						/>
					</div>
					<div className='form-items'>
						<label className='label'>Rating</label>
						<Rating
							className='addDesc-rating'
							name='rating'
							value={parseInt(values.rating)}
							onChange={onChange}
						/>
					</div>
					<button type='submit' className='addDesc-button'>
						{loading ? "CREATING THE REVIEW" : "Add Review"}
					</button>
				</form>
				{Object.keys(errors).length > 0 && (
					<div className='card-ui error message'>
						{Object.values(errors).map((value, index) => (
							<span key={index}>{value}</span>
						))}
					</div>
				)}
			</div>
		</div>
	);
}

const CREATE_PIN = gql`
	mutation createPin(
		$title: String!
		$body: String!
		$rating: Int!
		$publishedAt: String!
		$lat: Float!
		$long: Float!
	) {
		createPin(
			title: $title
			desc: { body: $body, rating: $rating, publishedAt: $publishedAt }
			lat: $lat
			long: $long
		) {
			id
			createdBy
			title
			desc {
				username
				body
				rating
				publishedAt
			}
			lat
			long
		}
	}
`;