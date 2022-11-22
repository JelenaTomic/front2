import React, { useState } from "react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/client";
import Rating from "@material-ui/lab/Rating";
import "../CSS/card.css";
import { useForm } from "../Utils/hooks";
import Pagination from "@material-ui/lab/Pagination";
import { useEffect } from "react";

export default function Card({ pin, setNewPins }) {
	const [newPlace, setNewPlace] = useState(false);
	const [errors, setErrors] = useState([]);

	const itemsPerPage = 1;
	const [page, setPage] = React.useState(1);
	const [noOfPages, setNoOfPages] = useState(0);

	const initialState = {
		body: "",
		rating: 1,
		publishedAt: new Date().toISOString().slice(0, 10),
	};

	const { onChange, onSubmit, values } = useForm(addDesc, initialState);

	const [addDescription, { loading }] = useMutation(ADD_DESCRIPTION, {
		update(_, { data: { createDescription: description } }) {
			setNewPlace(!newPlace);
			setNewPins(description);
		},
		onError(err) {
			if (err.graphQLErrors[0].message.startsWith("Authorization"))
				setErrors("You must login to give a review");
			else setErrors(err.graphQLErrors[0].message);
		},
		variables: { pinId: pin.id, ...values },
	});

	function addDesc() {
		addDescription();
	}

	const handleClick = () => {
		setNewPlace(!newPlace);
	};

	const handleChange = (event, value) => {
		setPage(value);
	};

	const [deletePin, { deletingPin }] = useMutation(DELETE_MARKER, {
		update(_, { data: { deletePin: afterDelete } }) {
			setNewPins(afterDelete);
		},
		onError(err) {
			if (err.graphQLErrors[0].message.startsWith("Authorization"))
				setErrors("You must login to delete");
			else if (err.graphQLErrors[0].message.startsWith("AuthenticationError:"))
				setErrors("You are not authorized to delete this marker");
			else setErrors(err.graphQLErrors[0]);
		},
		variables: { pinId: pin.id },
	});

	const handleDelete = () => {
		deletePin();
	};

	useEffect(() => {
		setNoOfPages(pin.desc.length);
	}, [pin]);

	//TODO : Review Deletion

	return (
		<div className='card-container'>
			{newPlace ? (
				<div className='new-place-wrapper'>
					<form className='newPlace-form' onSubmit={onSubmit}>
						<div className='form-items'>
							<label className='label-card'>Description</label>
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
								className='newPlace-rating'
								name='rating'
								value={parseInt(values.rating)}
								onChange={onChange}
							/>
						</div>
						<button type='submit' className='newPlace-button'>
							{loading ? "ADDING REVIEW" : "ADD THE REVIEW"}
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
			) : (
				<div className='card-wrapper'>
					<h3 className='card-title'>{pin.title}</h3>
					{pin.desc
						.slice((page - 1) * itemsPerPage, page * itemsPerPage)
						.map((pinDesc, index) => (
							<div className='card-desc' key={index}>
								<span className='card-username'>
									Review By : {pinDesc.username}
								</span>
								<span className='card-para'>{pinDesc.body}</span>
								<Rating
									value={pinDesc.rating}
									readOnly
									className='card-rating'
								/>
								<span className='card-date'>{pinDesc.publishedAt}</span>
							</div>
						))}
					<Pagination
						count={noOfPages}
						page={page}
						onChange={handleChange}
						defaultPage={1}
						color='primary'
						size='large'
						showFirstButton
						showLastButton
					/>
					<h5 className='card-by'>Clipped By {pin.createdBy}</h5>
					<div className='func-btns'>
						<button
							type='submit'
							className='card-add-review-button'
							onClick={handleClick}>
							Give A Review
						</button>
						<button
							type='submit'
							className='card-delete-button'
							onClick={handleDelete}>
							{deletingPin ? "REMOVING MARKER" : "Remove Marker"}
						</button>
					</div>
					{Object.keys(errors).length > 0 && (
						<div className='card-ui error message'>
							{Object.values(errors).map((value, index) => (
								<span key={index}>{value}</span>
							))}
						</div>
					)}
				</div>
			)}
		</div>
	);
}

const ADD_DESCRIPTION = gql`
	mutation createDescription(
		$pinId: ID!
		$body: String!
		$rating: Int!
		$publishedAt: String!
	) {
		createDescription(
			pinId: $pinId
			desc: { body: $body, rating: $rating, publishedAt: $publishedAt }
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

const DELETE_MARKER = gql`
	mutation deletePin($pinId: ID!) {
		deletePin(pinId: $pinId) {
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
