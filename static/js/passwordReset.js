import { handleEmailConfirm, handleChangePasswordConfirm } from "./api.js";

const emailConfirmBtn = document.getElementById("submit-email-btn");
emailConfirmBtn.addEventListener("click", () => {
	handleEmailConfirm();
});

//버튼이 안먹음 ㅡ.ㅡ
const changePasswordConfirmBtn = document.getElementById("change-password-btn");
changePasswordConfirmBtn.addEventListener("click", () => {
	handleChangePasswordConfirm();
});
