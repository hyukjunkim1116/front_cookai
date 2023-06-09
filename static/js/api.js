const FRONT_DEVELOP_URL = "http://127.0.0.1:5500/";
const BACKEND_DEVELOP_URL = "http://127.0.0.1:8000/";

const instance = axios.create({
	baseURL: BACKEND_DEVELOP_URL,
	withCredentials: true
});

export const handleSignUp = () => {
	const email = document.getElementById("email").value;
	const password = document.getElementById("password").value;
	const passwordCheck = document.getElementById("password-check").value;
	const username = document.getElementById("username").value;
	const gender = document.getElementById("gender").value;
	const age = document.getElementById("age").value;
	instance
		.post("users/signup/", {
			headers: {
				"Content-type": "application/json",
				Accept: "application/json"
			},
			body: JSON.stringify({
				email: email,
				password: password,
				username: username,
				gender: gender,
				age: age
			})
		})
		.then((response) => {
			response.data;
		});
};
