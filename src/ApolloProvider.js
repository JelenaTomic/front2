import {
	ApolloClient,
	ApolloProvider,
	createHttpLink,
	InMemoryCache,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import React from "react";
import App from "./App";

const httpLink = createHttpLink({
	uri: "https://travel-log-123.herokuapp.com/",
});

const authLink = setContext(() => {
	const token = localStorage.getItem("jwtToken");

	return {
		headers: {
			Authorization: token ? `Bearer ${token}` : "",
		},
	};
});

const client = new ApolloClient({
	link: authLink.concat(httpLink),
	cache: new InMemoryCache(),
});

export default (
	<ApolloProvider client={client}>
		<App />
	</ApolloProvider>
);
