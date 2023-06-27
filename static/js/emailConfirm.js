const emailConfirmBtn = document.getElementById("submit-email-btn");
emailConfirmBtn.addEventListener("click", async () => {
	const response = await handleEmailConfirm();
});
