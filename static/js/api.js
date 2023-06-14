export const FRONT_DEVELOP_URL = "http://127.0.0.1:5500";
export const BACKEND_DEVELOP_URL = "http://127.0.0.1:8000";

// 로그아웃
export function handleLogout() {
	localStorage.removeItem("access");
	localStorage.removeItem("refresh");
	localStorage.removeItem("payload");
	window.location.replace(`${FRONT_DEVELOP_URL}/`);
}

// 로그인 상태에서 로그인, 회원가입 페이지 접속 시 홈으로 이동하는 함수
export function checkLogin() {
	const payload = localStorage.getItem("payload");
	if (payload) {
		window.location.replace(`${FRONT_DEVELOP_URL}/`);
	}
}
// 비로그인 상태에서 글쓰기 페이지 접속 시 홈으로 이동하는 함수
export function checkNotLogin() {
	const payload = localStorage.getItem("payload");
	if (payload == null) {
		window.location.replace(`${FRONT_DEVELOP_URL}/`);
	}
}
// 강제 로그아웃
export function forceLogout() {
	const payload = localStorage.getItem("payload");
	let current_time = String(new Date().getTime()).substring(0, 10);
	if (payload) {
		const payload_parse = JSON.parse(payload).exp;
		if (payload_parse < current_time) {
			handleLogout();
		} else {
			return;
		}
	}
}

// 일반 회원가입하는 함수 .
export async function handleSignUp() {
	const email = document.getElementById("email").value;
	const firstPassword = document.getElementById("first_password").value;
	const secondPassword = document.getElementById("second_password").value;
	const username = document.getElementById("username").value;
	const gender = document.getElementById("gender").value;
	const age = document.getElementById("age").value;
	const file = document.getElementById("file").files[0];
	if (firstPassword === secondPassword) {
		if (file) {
			const responseURL = await fetch(`${BACKEND_DEVELOP_URL}/users/get-url/`, {
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
			const response = await fetch(`${BACKEND_DEVELOP_URL}/users/`, {
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
				window.location.replace(`${FRONT_DEVELOP_URL}/users/login.html`);
				return response;
			}
		} else {
			const response = await fetch(`${BACKEND_DEVELOP_URL}/users/`, {
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
				window.location.replace(`${FRONT_DEVELOP_URL}/users/login.html`);
				return response;
			}
		}
	} else {
		alert("비밀번호가 일치하지 않습니다.");
	}
}

// 로그인
export async function handleLogin() {
	const email = document.getElementById("email").value;
	const password = document.getElementById("password").value;

	const response = await fetch(`${BACKEND_DEVELOP_URL}/users/login/`, {
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
export const kakaoLogin = async () => {
	const response = await fetch(`${BACKEND_DEVELOP_URL}/users/oauth/kakao/`, {
		method: "GET"
	});
	const kakao_id = await response.json();
	const redirect_uri = `${FRONT_DEVELOP_URL}/index.html`;
	const response_type = "code";
	const scope = "profile_nickname,profile_image,account_email,gender";
	window.location.href = `https://kauth.kakao.com/oauth/authorize?client_id=${kakao_id}&redirect_uri=${redirect_uri}&response_type=${response_type}&scope=${scope}`;
};
export const googleLogin = async () => {
	const response = await fetch(`${BACKEND_DEVELOP_URL}/users/oauth/google/`, {
		method: "GET"
	});
	const client_id = await response.json();
	const redirect_uri = `${FRONT_DEVELOP_URL}/index.html`;
	const scope =
		"https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile";
	const param = `scope=${scope}&include_granted_scopes=true&response_type=token&state=pass-through value&prompt=consent&client_id=${client_id}&redirect_uri=${redirect_uri}`;
	window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${param}`;
};

export const naverLogin = async () => {
	const response = await fetch(`${BACKEND_DEVELOP_URL}/users/oauth/naver/`, {
		method: "GET"
	});
	const naver_id = await response.json();
	const redirect_uri = `${FRONT_DEVELOP_URL}/index.html`;
	const state = new Date().getTime().toString(36);
	const response_type = "code";
	window.location.href = `https://nid.naver.com/oauth2.0/authorize?response_type=${response_type}&client_id=${naver_id}&redirect_uri=${redirect_uri}&state=${state}`;
};

// 각각 해당하는 url로 데이터를 실어서 요청을 보내고 액세스 토큰을 받아오는 함수
export async function getKakaoToken(kakao_code) {
	const response = await fetch(`${BACKEND_DEVELOP_URL}/users/oauth/kakao/`, {
		headers: {
			"Content-Type": "application/json"
		},
		method: "POST",
		body: JSON.stringify({ code: kakao_code })
	});
	// if (response.status == 400) {
	// 	alert("해당 이메일로 가입한 계정이 있습니다!");
	// 	window.location.replace(`${FRONT_DEVELOP_URL}/`);
	// }
	console.log(response);
	response_json = await response.json();
	setLocalStorage(response);
}
export async function getGoogleToken(google_token) {
	const response = await fetch(`${BACKEND_DEVELOP_URL}/users/oauth/google/`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({ access_token: google_token })
	});
	console.log(response);
	response_json = await response.json();
	console.log(response_json);
	setLocalStorage(response);
}

export async function getNaverToken(naver_code, state) {
	const response = await fetch(`${BACKEND_DEVELOP_URL}/users/oauth/naver/`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({ naver_code: naver_code, state: state })
	});
	console.log(response);
	response_json = await response.json();
	setLocalStorage(response);
}

export async function handleUpdatePassword() {
	const token = localStorage.getItem("access");
	const oldPassword = document.getElementById("old_password").value;
	const newPassword = document.getElementById("new_password").value;
	const response = await fetch(
		`${BACKEND_DEVELOP_URL}/users/change-password/`,
		{
			headers: {
				Authorization: `Bearer ${token}`,
				"content-type": "application/json"
			},
			method: "PUT",
			body: JSON.stringify({
				old_password: oldPassword,
				new_password: newPassword
			})
		}
	);
	if (response.status == 200) {
		alert("비밀번호가 변경되었습니다!");
		handleLogout();
		window.location = `${FRONT_DEVELOP_URL}/users/login.html`;
		return response;
	} else {
		alert("현재 비밀번호가 일치하지 않습니다!");
	}
}
