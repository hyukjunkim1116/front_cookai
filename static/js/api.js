const FRONT_DEVELOP_URL = "http://127.0.0.1:5500";
const BACKEND_DEVELOP_URL = "http://127.0.0.1:8000";

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
