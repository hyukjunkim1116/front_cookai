const passwordToggle = () => {
	const passwordToggleBtn = document.querySelector(".check-password");
	const firstPassword = document.getElementById("new_first_password");
	const secondPassword = document.getElementById("new_second_password");
	if (passwordToggleBtn.checked) {
		firstPassword.type = "text";
		secondPassword.type = "text";
	} else {
		firstPassword.type = "password";
		secondPassword.type = "password";
	}
};
async function loaderFunction() {
	checkLogin();
	const userId = new URLSearchParams(window.location.search).get("uid");
	const checkUser = await getNotLoginedUser(userId);
	if (checkUser.login_type != "normal") {
		const token = new URLSearchParams(window.location.search).get("token");
		const uidb64 = new URLSearchParams(window.location.search).get("uidb64");
		const response = await fetch(`${BACKEND_BASE_URL}/users/reset-password/`, {
			method: "PATCH",
			headers: await getHeader((json = true)),
			body: JSON.stringify({
				user_id: userId,
				token: token,
				uidb64: uidb64
			})
		});
		const responseJson = await response.json();
		if (response.status == 200) {
			alert(responseJson.message);
			window.location.replace(`${FRONT_BASE_URL}/login.html`);
		} else {
			alert(responseJson.error);
			window.location.replace(`${FRONT_BASE_URL}/`);
		}
	}
}
