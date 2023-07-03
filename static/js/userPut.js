// 회원정보 미리 로드하는 함수
async function loadUserData() {
	const response = await getLoginUser();

	const usernameText = document.getElementById("username");
	const genderSelect = document.getElementById("gender");
	const BirthDate = document.getElementById("age");
	BirthDate.value = response.age;
	for (var i = 0; i < genderSelect.options.length; i++) {
		if (genderSelect.options[i].value == response.gender) {
			genderSelect.options[i].setAttribute("selected", true);
		}
	}

	const changePasswordForm = document.getElementById("change-password-form");
	usernameText.value = `${response.username}`;

	if (response.login_type != "normal") {
		changePasswordForm.style.display = "none";
	} else {
		changePasswordForm.style.display = "block";
	}
}
// 회원정보 수정하는 함수
async function putUserDetail() {
	await checkTokenExp();

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
			headers: await getHeader(),
			method: "PUT",
			body: JSON.stringify({
				username: username,
				gender: gender,
				age: age,
				avatar: realFileURL
			})
		});
		const response_json = await response.json();
		if (response.status == 400) {
			alert(response_json.error);
		} else {
			alert("변경 완료!");
			window.location.reload();
		}
	} else {
		const response = await fetch(`${BACKEND_BASE_URL}/users/${userId}/`, {
			headers: await getHeader(),
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

async function loaderFunction() {
	checkNotLogin();
	const preview = document.getElementById("file");
	preview.addEventListener("change", (event) => {
		setThumbnail(event);
	});
	await loadUserData();
}
