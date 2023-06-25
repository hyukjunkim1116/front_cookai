const FRONT_BASE_URL = "https://cookai.today";
const BACKEND_BASE_URL = "https://www.backend.cookai.today";

// 일반 회원가입하는 함수
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
				headers: {
					Accept: "application / json"
				},
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
					password: firstPassword,
					psssword2: secondPassword,
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
					psssword2: secondPassword,
					password2: secondPassword,
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

async function handleUpdatePassword() {
	const token = localStorage.getItem("access");
	const oldPassword = document.getElementById("old_password").value;
	const newPassword = document.getElementById("new_password").value;
	const newPassword2 = document.getElementById("new_password2").value;
	const response = await fetch(`${BACKEND_BASE_URL}/users/change-password/`, {
		headers: {
			Authorization: `Bearer ${token}`,
			"content-type": "application/json"
		},
		method: "PUT",
		body: JSON.stringify({
			old_password: oldPassword,
			new_password: newPassword,
			new_password2: newPassword2
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
//해당 유저 정보 조회
async function getUserDetail() {
	let token = localStorage.getItem("access");
	const userId = new URLSearchParams(window.location.search).get("user_id");
	const response = await fetch(`${BACKEND_BASE_URL}/users/${userId}/`, {
		headers: {
			Authorization: `Bearer ${token}`
		},
		method: "GET"
	});
	return response.json();
}
async function putUserDetail() {
	let token = localStorage.getItem("access");
	const userId = new URLSearchParams(window.location.search).get("user_id");
	const username = document.getElementById("username").value;
	const response = await fetch(`${BACKEND_BASE_URL}/users/${userId}/`, {
		headers: {
			Authorization: `Bearer ${token}`,
			"content-type": "application/json"
		},
		method: "PUT",
		body: JSON.stringify({
			username: username
		})
	});
	return response;
}
async function deleteUser() {
	let token = localStorage.getItem("access");
	const userId = new URLSearchParams(window.location.search).get("user_id");
	const password = document.getElementById("password").value;

	const response = await fetch(`${BACKEND_BASE_URL}/users/${userId}/`, {
		headers: {
			Authorization: `Bearer ${token}`,
			"content-type": "application/json"
		},
		method: "PATCH",
		body: JSON.stringify({
			password: password
		})
	});
	return response;
}

async function getUserArticle() {
	let token = localStorage.getItem("access");
	const userId = new URLSearchParams(window.location.search).get("user_id");
	const response = await fetch(
		`${BACKEND_BASE_URL}/users/${userId}/articles/`,
		{
			headers: {
				Authorization: `Bearer ${token}`
			},
			method: "GET"
		}
	);

	return response.json();
}
async function getUserComment() {
	let token = localStorage.getItem("access");
	const userId = new URLSearchParams(window.location.search).get("user_id");
	const response = await fetch(
		`${BACKEND_BASE_URL}/users/${userId}/comments/`,
		{
			headers: {
				Authorization: `Bearer ${token}`
			},
			method: "GET"
		}
	);

	return response.json();
}
async function getUserFridge() {
	let token = localStorage.getItem("access");
	const response = await fetch(`${BACKEND_BASE_URL}/users/fridge/`, {
		headers: {
			Authorization: `Bearer ${token}`
		},
		method: "GET"
	});
	return response.json();
}
async function postUserFridge() {
	let token = localStorage.getItem("access");
	const ingredient = document.getElementById("ingredient").value;
	const response = await fetch(`${BACKEND_BASE_URL}/users/fridge/`, {
		headers: {
			Authorization: `Bearer ${token}`,
			"content-type": "application/json"
		},
		body: JSON.stringify({
			ingredient: ingredient
		}),
		method: "POST"
	});
	return response;
}
async function deleteUserFridge(fridgeId) {
	let token = localStorage.getItem("access");
	const response = await fetch(
		`${BACKEND_BASE_URL}/users/fridge/${fridgeId}/`,
		{
			headers: {
				Authorization: `Bearer ${token}`
			},
			method: "DELETE"
		}
	);
	window.location.reload();
	return response;
}

// 내가 팔로우한 유저 보기
async function getUserFollowing() {
	let token = localStorage.getItem("access");
	const userId = new URLSearchParams(window.location.search).get("user_id");
	const response = await fetch(
		`${BACKEND_BASE_URL}/users/${userId}/following/`,
		{
			headers: {
				Authorization: `Bearer ${token}`
			},
			method: "GET"
		}
	);
	return response.json();
}

// 특정 유저 팔로잉하기
async function userFollowing(userId) {
	console.log(userId);
	let token = localStorage.getItem("access");
	const response = await fetch(
		`${BACKEND_BASE_URL}/users/${userId}/following/`,
		{
			headers: {
				Authorization: `Bearer ${token}`
			},
			method: "POST"
		}
	);
	window.location.reload();
	response_json = await response.json();
	// 팔로우 버튼 변경
	if (response_json == "follow") {
		const followBtn = document.getElementById("following-btn");
		followBtn.innerText.replace("팔로우", "언팔로우");
		window.location.reload();
	} else if (response_json == "unfollow") {
		const followBtn = document.getElementById("following-btn");
		followBtn.innerText.replace("언팔로우", "팔로우");
		window.location.reload();
	}
}

async function getCategory() {
	let token = localStorage.getItem("access");
	const response = await fetch(`${BACKEND_BASE_URL}/articles/category/`, {
		headers: {
			Authorization: `Bearer ${token}`
		},
		method: "GET"
	});
	return response.json();
}
