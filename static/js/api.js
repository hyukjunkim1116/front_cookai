const FRONT_BASE_URL = "http://127.0.0.1:5500";
const BACKEND_BASE_URL = "http://127.0.0.1:8000";

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
	if (response.status == 200) {
		alert("비밀번호 변경 완료!");
		window.location.replace(`${FRONT_BASE_URL}/`);
	} else {
		alert("다시 입력하세요!");
	}
}

async function handleUpdatePassword() {
	const token = localStorage.getItem("access");
	const oldPassword = document.getElementById("old_password").value;
	const newPassword = document.getElementById("new_password").value;
	const newPasswordCheck = document.getElementById("new_password_check").value;
	const response = await fetch(`${BACKEND_BASE_URL}/users/change-password/`, {
		headers: {
			Authorization: `Bearer ${token}`,
			"content-type": "application/json"
		},
		method: "PUT",
		body: JSON.stringify({
			old_password: oldPassword,
			new_password: newPassword,
			new_password2: newPasswordCheck
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
async function deleteUser() {
	let token = localStorage.getItem("access");
	const userId = new URLSearchParams(window.location.search).get("user_id");
	const password = document.getElementById("password").value;
	const secondPassword = document.getElementById("password-check").value;
	if (password === secondPassword) {
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
		if (response.status == 200) {
			alert("탈퇴 완료!");
			handleLogout();
		}
	} else {
		alert("비밀번호가 일치하지 않습니다!");
	}
}

async function getUserArticle(currentPage = 1) {
	let token = localStorage.getItem("access");
	const userId = new URLSearchParams(window.location.search).get("user_id");
	const response = await fetch(
		`${BACKEND_BASE_URL}/users/${userId}/articles/?page=${currentPage}`,
		{
			headers: {
				Authorization: `Bearer ${token}`
			},
			method: "GET"
		}
	);

	return response.json();
}
async function getUserComment(currentCommentPage = 1) {
	let token = localStorage.getItem("access");
	const userId = new URLSearchParams(window.location.search).get("user_id");
	const response = await fetch(
		`${BACKEND_BASE_URL}/users/${userId}/comments/?page=${currentCommentPage}`,
		{
			headers: {
				Authorization: `Bearer ${token}`
			},
			method: "GET"
		}
	);

	return response.json();
}
async function getUserCommentsList() {
	let token = localStorage.getItem("access");
	const userId = new URLSearchParams(window.location.search).get("user_id");
	const response = await fetch(
		`${BACKEND_BASE_URL}/users/${userId}/comments?filter=0`,
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
	window.location.reload();
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
// 나를 팔로우한 유저 보기
async function getUserFollower() {
	let token = localStorage.getItem("access");
	const userId = new URLSearchParams(window.location.search).get("user_id");
	const response = await fetch(
		`${BACKEND_BASE_URL}/users/${userId}/follower/`,
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
	const response = await fetch(`${BACKEND_BASE_URL}/articles/category/`, {
		method: "GET"
	});
	return await response.json();
}

async function deleteArticle(articleId) {
	const token = localStorage.getItem("access");

	const response = await fetch(`${BACKEND_BASE_URL}/articles/${articleId}/`, {
		method: "DELETE",
		headers: {
			Authorization: `Bearer ${token}`
		}
	});
	return response;
}
async function getArticleList(querystring, page = 1) {
	console.log(querystring);
	if (querystring == ``) {
		var pageQuery = `?page=${page}`;
	} else {
		var pageQuery = `&page=${page}`;
	}
	const response = await fetch(
		`${BACKEND_BASE_URL}/articles/${querystring}${pageQuery}`
	);
	return response;
}

async function getArticleDetail(articleId) {
	const token = localStorage.getItem("access");
	if (token) {
		const response = await fetch(`${BACKEND_BASE_URL}/articles/${articleId}/`, {
			headers: {
				Authorization: `Bearer ${token}`
			}
		});

		return response;
	} else {
		const response = await fetch(`${BACKEND_BASE_URL}/articles/${articleId}/`);

		return response;
	}
}

async function getComments(articleId, comment_page = 1) {
	const response = await fetch(
		`${BACKEND_BASE_URL}/articles/${articleId}/comment/?comment_page=${comment_page}`
	);

	if (response.status == 200) {
		response_json = await response.json();
		return response_json;
	} else {
		alert(response.status);
		return null;
	}
}
async function postComment(articleId, newComment) {
	const token = localStorage.getItem("access");
	const response = await fetch(
		`${BACKEND_BASE_URL}/articles/${articleId}/comment/`,
		{
			method: "POST",
			headers: {
				"content-type": "application/json",
				Authorization: `Bearer ${token}`
			},
			body: JSON.stringify({
				comment: newComment
			})
		}
	);

	return response;
}

async function bookmarkArticle(articleId) {
	const token = localStorage.getItem("access");
	const response = await fetch(
		`${BACKEND_BASE_URL}/articles/${articleId}/bookmark/`,
		{
			method: "POST",
			headers: {
				Authorization: `Bearer ${token}`
			}
		}
	);

	if (response.status == 200 || response.status == 204) {
		const response_json = await response.json();
		alert(response_json);
		location.reload();
	} else {
		alert(response.status);
	}
}

async function likeArticle(articleId) {
	const token = localStorage.getItem("access");

	const response = await fetch(
		`${BACKEND_BASE_URL}/articles/${articleId}/like/`,
		{
			method: "POST",
			headers: {
				Authorization: `Bearer ${token}`
			}
		}
	);

	if (response.status == 200 || response.status == 204) {
		const response_json = await response.json();
		alert(response_json);
		location.reload();
	} else {
		alert(response.status);
	}
}

async function deleteComment(commentId) {
	const token = localStorage.getItem("access");

	const response = await fetch(
		`${BACKEND_BASE_URL}/articles/1/comment/${commentId}/`,
		{
			method: "DELETE",
			headers: {
				Authorization: `Bearer ${token}`
			}
		}
	);
	return response;
}
async function updateComment(commentId, newComment) {
	const token = localStorage.getItem("access");
	const response = await fetch(
		`${BACKEND_BASE_URL}/articles/1/comment/${commentId}/`,
		{
			method: "PUT",
			headers: {
				"content-type": "application/json",
				Authorization: `Bearer ${token}`
			},
			body: JSON.stringify({
				comment: newComment
			})
		}
	);

	return response;
}

async function likeComment(commentId) {
	const token = localStorage.getItem("access");
	const response = await fetch(
		`${BACKEND_BASE_URL}/articles/comment/${commentId}/like/`,
		{
			method: "POST",
			headers: {
				Authorization: `Bearer ${token}`
			}
		}
	);

	return response;
}
async function deleteArticle(articleId) {
	const token = localStorage.getItem("access");

	const response = await fetch(`${BACKEND_BASE_URL}/articles/${articleId}/`, {
		method: "DELETE",
		headers: {
			Authorization: `Bearer ${token}`
		}
	});
	return response;
}

async function getArticle(articleId) {
	const response = await fetch(`${BACKEND_BASE_URL}/articles/${articleId}/`);

	if (!response.ok) {
		throw new Error(`Error fetching article detail: ${response.statusText}`);
	}

	const article_data = await response.json(); // JSON 형식으로 데이터 추출
	return article_data;
}

async function fetchMissingIngredients(articleId, token) {
	const response = await fetch(
		`${BACKEND_BASE_URL}/articles/${articleId}/order/`,
		{
			headers: {
				Authorization: `Bearer ${token}`
			}
		}
	);

	if (response.ok) {
		const ingredientLinks = await response.json();
		console.log("서버에서 반환한 JSON:", ingredientLinks);

		const ingredients = {};

		// 재료별로 링크 분류
		ingredientLinks.forEach((link) => {
			if (!ingredients[link.ingredientName]) {
				ingredients[link.ingredientName] = [];
			}
			ingredients[link.ingredientName].push(link);
		});

		const missingLinksList = document.createElement("div");
		missingLinksList.style.display = "flex";
		missingLinksList.style.flexWrap = "wrap";

		for (const ingredientName in ingredients) {
			const ingredientLink = ingredients[ingredientName];
			const randomLinks = [];
			const length = Math.min(ingredientLink.length, 5);

			for (let i = 0; i < length; i++) {
				const randomIndex = Math.floor(Math.random() * ingredientLink.length);
				randomLinks.push(ingredientLink[randomIndex]);
				ingredientLink.splice(randomIndex, 1);
			}

			randomLinks.forEach((link) => {
				const listItem = document.createElement("div");
				listItem.style.padding = "10px";
				listItem.innerHTML = `
                    ${
											link.link
												? `<a href="${link.link}" target="_blank">${
														link.link_img
															? `<img src="${link.link_img}" style="width: 5em; height: auto;"/>`
															: "링크"
												  }</a>`
												: ""
										}
                `;
				missingLinksList.appendChild(listItem);
			});
		}
		const container = document.querySelector(".ingredientslink_list");
		container.appendChild(missingLinksList);
	} else {
		console.error("API 요청 실패:", response.statusText);
	}
}

async function getTagList(selector) {
	if (selector) {
		var query = `?tag=${selector}`;
	} else {
		var query = ``;
	}
	const response = await fetch(`${BACKEND_BASE_URL}/articles/tags/${query}`);
	return response;
}
