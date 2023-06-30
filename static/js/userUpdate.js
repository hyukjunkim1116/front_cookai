// 회원정보 미리 로드하는 함수
async function loadUserData() {
	const response = await getUserDetail();
	console.log(response);
	const usernameText = document.getElementById("username");
	const genderText = document.getElementById("gender") || null;
	const ageText = document.getElementById("age") || null;
	usernameText.innerText = `${response.username}`;
	genderText.innerText = `${response.gender}`;
	ageText.innerText = `${response.age}`;
}
// 회원정보 수정하는 함수
async function putUserDetail() {
	let token = localStorage.getItem("access");
	const userId = new URLSearchParams(window.location.search).get("user_id");
	const username = document.getElementById("username").value;
	const gender = document.getElementById("gender").value;
	const age = document.getElementById("age").value;
	const file = document.getElementById("file").files[0];
	if (file) {
		const responseURL = await fetch(`${BACKEND_BASE_URL}/users/get-url/`, {
			method: "POST"
		});
		const dataURL = await responseURL.json();
		//실제로 클라우드플레어에 업로드
		const formData = new FormData();
		formData.append("file", file);
		const responseRealURL = await fetch(`${dataURL["uploadURL"]}`, {
			body: formData,
			method: "POST"
		});
		const results = await responseRealURL.json();
		const realFileURL = results.result.variants[0];
		const response = await fetch(`${BACKEND_BASE_URL}/users/${userId}/`, {
			headers: {
				Authorization: `Bearer ${token}`,
				"content-type": "application/json"
			},
			method: "PUT",
			body: JSON.stringify({
				username: username,
				gender: gender,
				age: age,
				avatar: realFileURL
			})
		});
		if (response.status == 400) {
			alert("다시 입력하세요!");
		} else {
			alert("변경 완료!");
			window.location.reload();
		}
	} else {
		const response = await fetch(`${BACKEND_BASE_URL}/users/${userId}/`, {
			headers: {
				Authorization: `Bearer ${token}`,
				"content-type": "application/json"
			},
			method: "PUT",
			body: JSON.stringify({
				username: username,
				gender: gender,
				age: age
			})
		});
		if (response.status == 400) {
			alert("다시 입력하세요!");
		} else {
			alert("변경 완료!");
			window.location.reload();
		}
	}
}
const preview = document.getElementById("file");
preview.addEventListener("change", (event) => {
	setThumbnail(event);
});
window.onload = async function () {
	checkNotLogin();
	await loadUserData();
};
