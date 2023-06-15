const FRONT_BASE_URL = "http://127.0.0.1:5500";
const BACKEND_BASE_URL = "http://127.0.0.1:8000";

// 일반 회원가입하는 함수 .
async function handleSignUp() {
	const email = document.getElementById("email").value;
	const firstPassword = document.getElementById("first_password").value;
	const secondPassword = document.getElementById("second_password").value;
	const username = document.getElementById("username").value;
	const gender = document.getElementById("gender").value;
	const age = document.getElementById("age").value;
	const file = document.getElementById("file").files[0];
	if (firstPassword === secondPassword) {
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
			const response = await fetch(`${BACKEND_BASE_URL}/users/`, {
				headers: {
					"content-type": "application/json"
				},
				method: "POST",
				body: JSON.stringify({
					email: email,
					password: secondPassword,
					username: username,
					gender: gender,
					age: age,
					avatar: realFileURL
				})
			});
			if (response.status == 400) {
				alert("다시 입력하세요!");
			} else {
				alert("이메일 인증을 진행해 주세요!");
				window.location.replace(`${FRONT_BASE_URL}/users/login.html`);
				return response;
			}
		} else {
			const response = await fetch(`${BACKEND_BASE_URL}/users/`, {
				headers: {
					"content-type": "application/json"
				},
				method: "POST",
				body: JSON.stringify({
					email: email,
					password: firstPassword,
					username: username,
					gender: gender,
					age: age
				})
			});
			if (response.status == 400) {
				alert("다시 입력하세요!");
			} else {
				alert("이메일 인증을 진행해 주세요!");
				window.location.replace(`${FRONT_BASE_URL}/users/login.html`);
				return response;
			}
		}
	} else {
		alert("비밀번호가 일치하지 않습니다.");
	}
}
// 로그인
async function handleLogin() {
	const email = document.getElementById("email").value;
	const password = document.getElementById("password").value;

	const response = await fetch(`${BACKEND_BASE_URL}/users/login/`, {
		headers: {
			"content-type": "application/json"
		},
		method: "POST",
		body: JSON.stringify({
			email: email,
			password: password
		})
	});

	return response;
}
// 로그인 버튼 클릭 시 해당 auth에 코드 요청, redirect_uri로 URL 파라미터와 함께 이동
const kakaoLogin = async () => {
	const response = await fetch(`${BACKEND_BASE_URL}/users/oauth/kakao/`, {
		method: "GET"
	});
	const kakao_id = await response.json();
	const redirect_uri = `${FRONT_BASE_URL}/index.html`;
	const response_type = "code";
	const scope = "profile_nickname,profile_image,account_email,gender";
	window.location.href = `https://kauth.kakao.com/oauth/authorize?client_id=${kakao_id}&redirect_uri=${redirect_uri}&response_type=${response_type}&scope=${scope}`;
};
const googleLogin = async () => {
	const response = await fetch(`${BACKEND_BASE_URL}/users/oauth/google/`, {
		method: "GET"
	});
	const client_id = await response.json();
	const redirect_uri = `${FRONT_BASE_URL}/index.html`;
	const scope =
		"https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile";
	const param = `scope=${scope}&include_granted_scopes=true&response_type=token&state=pass-through value&prompt=consent&client_id=${client_id}&redirect_uri=${redirect_uri}`;
	window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${param}`;
};

const naverLogin = async () => {
	const response = await fetch(`${BACKEND_BASE_URL}/users/oauth/naver/`, {
		method: "GET"
	});
	const naver_id = await response.json();
	const redirect_uri = `${FRONT_BASE_URL}/index.html`;
	const state = new Date().getTime().toString(36);
	const response_type = "code";
	window.location.href = `https://nid.naver.com/oauth2.0/authorize?response_type=${response_type}&client_id=${naver_id}&redirect_uri=${redirect_uri}&state=${state}`;
};
// 비밀번호 리셋 - 이메일 확인
async function handleEmailConfirm() {
	const email = document.getElementById("email").value;
	const response = await fetch(`${BACKEND_BASE_URL}/users/reset-password/`, {
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

async function handleUpdatePassword() {
	const token = localStorage.getItem("access");
	const oldPassword = document.getElementById("old_password").value;
	const newPassword = document.getElementById("new_password").value;
	const response = await fetch(`${BACKEND_BASE_URL}/users/change-password/`, {
		headers: {
			Authorization: `Bearer ${token}`,
			"content-type": "application/json"
		},
		method: "PUT",
		body: JSON.stringify({
			old_password: oldPassword,
			new_password: newPassword
		})
	});
	if (response.status == 200) {
		alert("비밀번호가 변경되었습니다!");
		handleLogout();
		window.location = `${FRONT_BASE_URL}/users/login.html`;
		return response;
	} else {
		alert("현재 비밀번호가 일치하지 않습니다!");
	}
}

// 비밀번호 리셋 - 새로운 비밀번호 설정
async function handleChangePasswordConfirm() {
	const userId = new URLSearchParams(window.location.search).get("uid");
	const newFirstPassword = document.getElementById("new_first_password").value;
	const newSecondPassword = document.getElementById(
		"new_second_password"
	).value;
	const response = await fetch(`${BACKEND_BASE_URL}/users/reset-password/`, {
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

//로그인 한 유저 정보 조회
async function getLoginUser() {
	const payload = localStorage.getItem("payload");
	if (payload) {
		const payload_parse = JSON.parse(payload);
		const response = await fetch(
			`${BACKEND_BASE_URL}/users/${payload_parse.user_id}/`,
			{
				method: "GET"
			}
		);
		if (response.status == 200) {
			response_json = await response.json();
			return response_json;
		} else {
			alert(response.statusText);
		}
	}
}

async function getUserDetail() {
	let getParams = window.location.search;
	let userParams = getParams.split("=")[1];
	const user_id = userParams;
	const response = await fetch(`${BACKEND_BASE_URL}/users/${user_id}/`, {
		method: "GET"
	});
	response_json = await response.json();
	return response_json;
}
async function putUserDetail() {
	let token = localStorage.getItem("access");
	let getParams = window.location.search;
	let userParams = getParams.split("=")[1];
	const user_id = userParams;
	const username = document.getElementById("username").value;
	const response = await fetch(`${BACKEND_BASE_URL}/users/${user_id}/`, {
		headers: {
			Authorization: `Bearer ${token}`,
			"content-type": "application/json"
		},
		method: "PUT",
		body: JSON.stringify({
			username: username
		})
	});
	response_json = await response.json();
	return response_json;
}
async function deleteUser() {
	let token = localStorage.getItem("access");
	let getParams = window.location.search;
	let userParams = getParams.split("=")[1];
	const user_id = userParams;

	const response = await fetch(`${BACKEND_BASE_URL}/users/${user_id}/`, {
		headers: {
			Authorization: `Bearer ${token}`
		},
		method: "DELETE"
	});
	return response;
}

async function getUserFridge() {
	let token = localStorage.getItem("access");
	let getParams = window.location.search;
	let userParams = getParams.split("=")[1];
	const user_id = userParams;
	const response = await fetch(`${BACKEND_BASE_URL}/users/${user_id}/fridge/`, {
		headers: {
			Authorization: `Bearer ${token}`
		},
		method: "GET"
	});
	response_json = await response.json();
	return response_json;
}
async function postUserFridge() {
	let token = localStorage.getItem("access");
	let getParams = window.location.search;
	let userParams = getParams.split("=")[1];
	const user_id = userParams;
	const response = await fetch(`${BACKEND_BASE_URL}/users/${user_id}/fridge/`, {
		headers: {
			Authorization: `Bearer ${token}`
		},
		method: "POST"
	});
	response_json = await response.json();
	return response_json;
}
async function deleteUserFridge() {
	let token = localStorage.getItem("access");
	let getParams = window.location.search;
	let userParams = getParams.split("=")[1];
	const user_id = userParams;
	const response = await fetch(`${BACKEND_BASE_URL}/users/${user_id}/fridge/`, {
		headers: {
			Authorization: `Bearer ${token}`
		},
		method: "DELETE"
	});
	response_json = await response.json();
	return response_json;
}

// 팔로우한 유저 보기
async function getUserFollowing() {
	let getParams = window.location.search;
	let userParams = getParams.split("=")[1];
	const user_id = userParams;
	const response = await fetch(`${BACKEND_BASE_URL}/users/${user_id}/follow/`, {
		method: "GET"
	});
	response_json = await response.json();
	return response_json;
}

// 특정 유저 팔로잉하기
async function userFollowing() {
	let token = localStorage.getItem("access");
	let getParams = window.location.search;
	let userParams = getParams.split("=")[1];
	const user_id = userParams;

	const response = await fetch(`${BACKEND_BASE_URL}/users/${user_id}/follow/`, {
		headers: {
			Authorization: `Bearer ${token}`
		},
		method: "POST"
	});
	response_json = await response.json();

	// 팔로우 버튼 변경
	if (response_json == "follow") {
		const followBtn = document.getElementById("followBtn");
		followBtn.innerText.replace("팔로우 »", "언팔로우 »");
		window.location.reload();
	} else if (response_json == "unfollow") {
		const followBtn = document.getElementById("followBtn");
		followBtn.innerText.replace("언팔로우 »", "팔로우 »");
		window.location.reload();
	}
}
