const preview = document.getElementById("file");
preview.addEventListener("change", (event) => {
	setThumbnail(event);
});

const submit = document.getElementById("button");
submit.addEventListener("click", () => {
	handleSignUp();
});

window.onload = async function () {
	checkLogin();
};
