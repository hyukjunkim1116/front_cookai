const changePasswordConfirmBtn = document.getElementById("change-password-btn");
changePasswordConfirmBtn.addEventListener("click", async () => {
	const response = await handleChangePasswordConfirm();
	if (response.status == 200) {
		alert("비밀번호 변경 완료!");
		window.location.replace(`${FRONT_BASE_URL}/`);
	} else {
		alert("다시 입력하세요!");
	}
});
