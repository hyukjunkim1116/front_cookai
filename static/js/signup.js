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
window.onload = function () {
	checkLogin();
};
