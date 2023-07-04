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
					second_password: secondPassword,
					username: username,
					gender: Boolean(gender) ? gender : null,
					age: Boolean(age) ? age : null,
					avatar: realFileURL
				})
			});
			if (response.status == 400) {
				var alertMsg = "";
				const response_json = await response.json();
				var list = Object.values(response_json);
				list.forEach((element) => {
					if (element[0] == "password") {
						alertMsg +=
							"비밀번호는 8자리이상이어야 하며 하나이상의 숫자,알파벳,특수문자(!@#$%^&*())들로 구성됩니다.\n";
					} else {
						alertMsg += `${element}\n`;
					}
				});
				alert(alertMsg);
			} else {
				alert("이메일 인증을 진행해 주세요!");
				window.location.replace(`${FRONT_BASE_URL}/login.html`);
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
					second_password: secondPassword,
					username: username,
					gender: Boolean(gender) ? gender : null,
					age: Boolean(age) ? age : null
				})
			});
			if (response.status == 400) {
				var alertMsg = "";
				const response_json = await response.json();
				var list = Object.values(response_json);
				list.forEach((element) => {
					if (element[0] == "password") {
						alertMsg +=
							"비밀번호는 8자리이상이어야 하며 하나이상의 숫자,알파벳,특수문자(!@#$%^&*())들로 구성됩니다.\n";
					} else {
						alertMsg += `${element}\n`;
					}
				});
				alert(alertMsg);
			} else {
				alert("이메일 인증을 진행해 주세요!");
				window.location.replace(`${FRONT_BASE_URL}/login.html`);
				return response;
			}
		}
	} else {
		alert("비밀번호가 일치하지 않습니다.");
	}
}
async function loaderFunction() {
	checkLogin();
}
