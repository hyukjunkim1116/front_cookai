// 비밀번호 리셋 - 이메일 확인
import { BACKEND_DEVELOP_URL } from "./api.js";

export async function handleEmailConfirm() {
	const email = document.getElementById("email").value;
	const response = await fetch(`${BACKEND_DEVELOP_URL}/users/reset-password/`, {
		headers: {
			"content-type": "application/json"
		},
		method: "POST",
		body: JSON.stringify({
			email: email
		})
	});
	return response;
}
const emailConfirmBtn = document.getElementById("submit-email-btn");
emailConfirmBtn.addEventListener("click", () => {
	handleEmailConfirm();
	console.log("작동중");
});
