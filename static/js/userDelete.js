const checkSocialUser = async () => {
	const loginUser = await getLoginUser();
	if (loginUser.login_type !== "normal") {
		document
			.querySelectorAll(".normal-user-password")
			.forEach((e) => e.remove());
	}
};
const passwordToggle = () => {
	const passwordToggleBtn = document.querySelector(".check-password");
	const firstPassword = document.getElementById("password");
	const secondPassword = document.getElementById("password-check");
	if (passwordToggleBtn.checked) {
		firstPassword.type = "text";
		secondPassword.type = "text";
	} else {
		firstPassword.type = "password";
		secondPassword.type = "password";
	}
};
async function loaderFunction() {
	checkNotLogin();
	checkSocialUser();
	const userId = new URLSearchParams(window.location.search).get("user_id");
	if (isYOU(userId)) {
		return;
	} else {
		window.location.href = `${FRONT_BASE_URL}/`;
	}
}
