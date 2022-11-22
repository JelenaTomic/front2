import React from "react";
import { Link } from "react-router-dom";
import "../CSS/home.css";

export default function Home() {

	return (
		<>
			<div className='home-container'>

				<div className='tile-container'>
					<Link to='/map' className='tile-map-link'>
						<div className='tile-contents'>
							<span className='tile-heading'>Clip Your Next Travel Adventure</span>
							<p className='tile-para'>
							Get motivated, explore new places, and share your experiences with us!
								<br />
								<br />
								Clip your travel destinations, leave a review and recommend it to other wanderlusts!
							</p>
						</div>
					</Link>
				</div>
			</div>

		</>
	);
}
