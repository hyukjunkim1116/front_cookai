// 회원정보 미리 로드하는 함수
async function loadUserData() {
	const response = await getLoginUser();
	const usernameText = document.getElementById("username");
	const genderSelect = document.getElementById("gender");
	for (var i = 0; i < genderSelect.options.length; i++) {
		if (genderSelect.options[i].value == response.gender) {
			genderSelect.options[i].setAttribute("selected", true);
		}
	}
	let img = document.createElement("img");
	img.setAttribute(
		"src",
		response.avatar ? response.avatar : "/static/img/no_avatar.png"
	);
	// 썸네일 크기 조절
	img.setAttribute("style", "max-height: 300px;");
	img.setAttribute("style", "object-fit:cover;");
	img.setAttribute("style", "margin-top: 15px;");
	img.style.width = "50%"; // 너비 200px로 설정
	img.style.height = "auto"; // 높이 자동 설정
	// 썸네일 리셋 후 미리보기 보여주기
	document.getElementById("image_container").innerHTML = "";
	document.getElementById("image_container").appendChild(img);
	const changePasswordBtn = document.getElementById("user-password-update-btn");
	usernameText.value = `${response.username}`;
	if (response.login_type !== "normal") {
		document.getElementById("flexSwitchCheckDefault").disabled = true;
		document.getElementById("old_password").disabled = true;
		document.getElementById("new_password").disabled = true;
		document.getElementById("new_password_check").disabled = true;
		changePasswordBtn.disabled = true;
		changePasswordBtn.innerText = "변경 불가";
	}
}
// 회원정보 수정하는 함수
async function putUserDetail() {
	await checkTokenExp();
	const putUserBtn = document.getElementById("user-update-button");
	const span = document.createElement("span");
	span.setAttribute("id", "spinner-span");
	span.setAttribute("class", "spinner-border spinner-border-sm");
	span.setAttribute("role", "status");
	span.setAttribute("aria-hidden", "true");
	putUserBtn.appendChild(span);
	putUserBtn.disabled = true;
	const userId = new URLSearchParams(window.location.search).get("user_id");
	const username = document.getElementById("username").value;
	const gender = document.getElementById("gender").value;
	const file = document.getElementById("file").files[0];
	if (file && username) {
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
				avatar: realFileURL
			})
		});
		const response_json = await response.json();
		if (response.status == 400) {
			alert(Object.values(response_json));
			putUserBtn.innerHTML = "";
			putUserBtn.innerText = "변경하기";
			putUserBtn.disabled = false;
		} else {
			putUserBtn.innerHTML = "";
			putUserBtn.innerText = "변경하기";
			alert("변경 완료!");
			window.location.reload();
		}
	} else if (username) {
		const response = await fetch(`${BACKEND_BASE_URL}/users/${userId}/`, {
			headers: await getHeader(),
			method: "PUT",
			body: JSON.stringify({
				username: username,
				gender: gender
			})
		});
		const response_json = await response.json();
		if (response.status == 400) {
			putUserBtn.innerHTML = "";
			putUserBtn.innerText = "변경하기";
			putUserBtn.disabled = false;
		} else {
			alert("변경 완료!");
			window.location.reload();
		}
	} else {
		putUserBtn.innerHTML = "";
		putUserBtn.innerText = "변경하기";
		putUserBtn.disabled = false;
		alert("닉네임을 적어주세요!");
	}
}

async function handleUpdatePassword() {
	await checkTokenExp();
	const changePasswordBtn = document.getElementById("user-password-update-btn");
	changePasswordBtn.disabled = true;
	const span = document.createElement("span");
	span.setAttribute("id", "spinner-span");
	span.setAttribute("class", "spinner-border spinner-border-sm");
	span.setAttribute("role", "status");
	span.setAttribute("aria-hidden", "true");
	changePasswordBtn.appendChild(span);
	const oldPassword = document.getElementById("old_password").value;
	const newPassword = document.getElementById("new_password").value;
	const newPasswordCheck = document.getElementById("new_password_check").value;
	const response = await fetch(`${BACKEND_BASE_URL}/users/change-password/`, {
		headers: await getHeader(),
		method: "PUT",
		body: JSON.stringify({
			old_password: oldPassword,
			new_password: newPassword,
			new_password2: newPasswordCheck
		})
	});
	const response_json = await response.json();
	if (response.status == 200) {
		changePasswordBtn.innerHTML = "";
		changePasswordBtn.innerText = "비밀번호 변경하기";
		alert(response_json.message);
		handleLogout();
		window.location = `${FRONT_BASE_URL}/login.html`;
		return response;
	} else {
		changePasswordBtn.innerHTML = "";
		changePasswordBtn.innerText = "비밀번호 변경하기";
		alert(response_json.error);
		changePasswordBtn.disabled = false;
	}
}
const passwordToggle = () => {
	const passwordToggleBtn = document.querySelector(".check-password");
	const oldPassword = document.getElementById("old_password");
	const firstPassword = document.getElementById("new_password");
	const secondPassword = document.getElementById("new_password_check");
	if (passwordToggleBtn.checked) {
		firstPassword.type = "text";
		secondPassword.type = "text";
		oldPassword.type = "text";
	} else {
		firstPassword.type = "password";
		secondPassword.type = "password";
		oldPassword.type = "password";
	}
};
async function loaderFunction() {
	checkNotLogin();
	const userId = new URLSearchParams(window.location.search).get("user_id");
	if (isYOU(userId)) {
		await loadUserData();
	} else {
		window.location.href = `${FRONT_BASE_URL}/`;
	}
}
