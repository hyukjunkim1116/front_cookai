import { BACKEND_DEVELOP_URL } from "./api.js";
// 비밀번호 리셋 - 새로운 비밀번호 설정
export async function handleChangePasswordConfirm() {
	const userId = new URLSearchParams(window.location.search).get("uid");
	const newFirstPassword = document.getElementById("new_first_password").value;
	const newSecondPassword = document.getElementById(
		"new_second_password"
	).value;
	const response = await fetch(`${BACKEND_DEVELOP_URL}/users/reset-password/`, {
		headers: {
			"content-type": "application/json"
		},
		method: "PUT",
		body: JSON.stringify({
			new_first_password: newFirstPassword,
			new_second_password: newSecondPassword,
			user_id: userId
		})
	});
	return response;
}

const changePasswordConfirmBtn = document.getElementById("change-password-btn");
changePasswordConfirmBtn.addEventListener("click", () => {
	handleChangePasswordConfirm();
	console.log("작동중");
});
