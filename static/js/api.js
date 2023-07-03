const FRONT_BASE_URL = "https://cookai.today";
const BACKEND_BASE_URL = "http://www.backend.cookai.today";

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
	if (response.status == 200) {
		alert("이메일인증을 진행해주세요!");
	} else {
		alert("일치하는 이메일이 없습니다!");
	}
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
		alert(response.message);
		window.location.replace(`${FRONT_BASE_URL}/login.html`);
	} else {
		alert(response.error);
	}
}

async function handleUpdatePassword() {
	await checkTokenExp();

	const token = localStorage.getItem("access");
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
	if (response.status == 200) {
		alert("비밀번호가 변경되었습니다!");
		handleLogout();
		window.location = `${FRONT_BASE_URL}/login.html`;
		return response;
	} else {
		alert("현재 비밀번호가 일치하지 않습니다!");
	}
}

//로그인 한 유저 정보 조회
async function getLoginUser() {
	await checkTokenExp();
	const payload = localStorage.getItem("payload");
	const token = localStorage.getItem("access");
	if (payload) {
		const payload_parse = JSON.parse(payload);
		const response = await fetch(
			`${BACKEND_BASE_URL}/users/${payload_parse.user_id}/`,
			{
				headers: await getHeader((json = false)),

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
	await checkTokenExp();
	let token = localStorage.getItem("access");
	const userId = new URLSearchParams(window.location.search).get("user_id");
	const response = await fetch(`${BACKEND_BASE_URL}/users/${userId}/`, {
		headers: await getHeader((json = false)),
		method: "GET"
	});
	if (response.status == 404)
		location.href = `${FRONT_BASE_URL}/page_not_found.html`;
	return await response.json();
}
async function deleteUser() {
	await checkTokenExp();
	let token = localStorage.getItem("access");
	const userId = new URLSearchParams(window.location.search).get("user_id");
	const password = document.getElementById("password").value;
	const secondPassword = document.getElementById("password-check").value;
	if (password === secondPassword) {
		const response = await fetch(`${BACKEND_BASE_URL}/users/${userId}/`, {
			headers: await getHeader(),
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
	await checkTokenExp();
	let token = localStorage.getItem("access");
	const userId = new URLSearchParams(window.location.search).get("user_id");
	const response = await fetch(
		`${BACKEND_BASE_URL}/users/${userId}/articles/?page=${currentPage}`,
		{
			headers: await getHeader((json = false)),
			method: "GET"
		}
	);

	return await response.json();
}
async function getUserComment(currentCommentPage = 1, filter = 0) {
	await checkTokenExp();
	let token = localStorage.getItem("access");
	const userId = new URLSearchParams(window.location.search).get("user_id");
	const response = await fetch(
		`${BACKEND_BASE_URL}/users/${userId}/comments/?filter=${filter}&page=${currentCommentPage}`,
		{
			headers: await getHeader((json = false)),
			method: "GET"
		}
	);

	return response.json();
}
async function getUserCommentsList() {
	await checkTokenExp();
	let token = localStorage.getItem("access");
	const userId = new URLSearchParams(window.location.search).get("user_id");
	const response = await fetch(
		`${BACKEND_BASE_URL}/users/${userId}/comments?filter=0`,
		{
			headers: await getHeader((json = false)),
			method: "GET"
		}
	);

	return response.json();
}
async function getUserFridge() {
	await checkTokenExp();
	let token = localStorage.getItem("access");
	const response = await fetch(`${BACKEND_BASE_URL}/users/fridge/`, {
		headers: await getHeader((json = false)),
		method: "GET"
	});
	return response.json();
}
async function postUserFridge() {
	await checkTokenExp();
	let token = localStorage.getItem("access");
	const ingredient = document.getElementById("ingredient").value;
	const response = await fetch(`${BACKEND_BASE_URL}/users/fridge/`, {
		headers: await getHeader(),
		body: JSON.stringify({
			ingredient: ingredient
		}),
		method: "POST"
	});
	window.location.reload();
	return response;
}
async function deleteUserFridge(fridgeId) {
	await checkTokenExp();
	let token = localStorage.getItem("access");
	const response = await fetch(
		`${BACKEND_BASE_URL}/users/fridge/${fridgeId}/`,
		{
			headers: await getHeader((json = false)),
			method: "DELETE"
		}
	);
	window.location.reload();
	return response;
}

// 다른 유저의 팔로우리스트 보기
async function getOtherUserFollowing() {
	await checkTokenExp();
	let token = localStorage.getItem("access");
	const userId = new URLSearchParams(window.location.search).get("user_id");
	const response = await fetch(
		`${BACKEND_BASE_URL}/users/${userId}/following/`,
		{
			headers: await getHeader((json = false)),
			method: "GET"
		}
	);
	return response.json();
}
// 내가 팔로우한 유저 보기
async function getUserFollowing() {
	await checkTokenExp();
	let token = localStorage.getItem("access");
	const payload = localStorage.getItem("payload");
	if (payload) {
		const payload_parse = JSON.parse(payload);
		const response = await fetch(
			`${BACKEND_BASE_URL}/users/${payload_parse.user_id}/following/`,
			{
				headers: await getHeader((json = false)),
				method: "GET"
			}
		);
		return response.json();
	} else {
		return null;
	}
}
// 나를 팔로우한 유저 보기
async function getUserFollower() {
	await checkTokenExp();
	let token = localStorage.getItem("access");
	const userId = new URLSearchParams(window.location.search).get("user_id");
	const response = await fetch(
		`${BACKEND_BASE_URL}/users/${userId}/follower/`,
		{
			headers: await getHeader((json = false)),
			method: "GET"
		}
	);
	return response.json();
}

// 특정 유저 팔로잉하기
async function userFollowing() {
	await checkTokenExp();
	const userId = new URLSearchParams(window.location.search).get("user_id");
	let token = localStorage.getItem("access");
	const response = await fetch(
		`${BACKEND_BASE_URL}/users/${userId}/following/`,
		{
			headers: await getHeader((json = false)),
			method: "POST"
		}
	);
	if (response.status == 200) {
		alert("follow!");
	} else if (response.status == 204) {
		alert("unfollow!");
	} else {
		alert("올바르지 않은 요청이거나 존재하지 않는 회원입니다!");
	}
	return response;
}
async function otherUserFollowing(userId) {
	await checkTokenExp();
	let token = localStorage.getItem("access");
	const response = await fetch(
		`${BACKEND_BASE_URL}/users/${userId}/following/`,
		{
			headers: await getHeader((json = false)),
			method: "POST"
		}
	);
	const response_json = await response.json();
	if (response.status == 200) {
		alert(response_json.message);
		window.location.reload();
	} else {
		alert("올바르지 않은 요청이거나 존재하지 않는 회원입니다!");
	}
	return response;
}

async function getCategory() {
	const response = await fetch(`${BACKEND_BASE_URL}/articles/category/`, {
		method: "GET"
	});
	return await response.json();
}

async function deleteArticle(articleId) {
	await checkTokenExp();
	const token = localStorage.getItem("access");

	const response = await fetch(`${BACKEND_BASE_URL}/articles/${articleId}/`, {
		method: "DELETE",
		headers: await getHeader((json = false))
	});
	return response;
}
async function getArticleList(querystring, page = 1) {
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
	await checkTokenExp();
	const token = localStorage.getItem("access");
	if (token) {
		const response = await fetch(`${BACKEND_BASE_URL}/articles/${articleId}/`, {
			headers: await getHeader((json = false))
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
	await checkTokenExp();
	const token = localStorage.getItem("access");
	const response = await fetch(
		`${BACKEND_BASE_URL}/articles/${articleId}/comment/`,
		{
			method: "POST",
			headers: await getHeader(),
			body: JSON.stringify({
				comment: newComment
			})
		}
	);

	return response;
}

async function bookmarkArticle(articleId) {
	await checkTokenExp();
	const token = localStorage.getItem("access");
	const response = await fetch(
		`${BACKEND_BASE_URL}/articles/${articleId}/bookmark/`,
		{
			method: "POST",
			headers: await getHeader((json = false))
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
	await checkTokenExp();
	const token = localStorage.getItem("access");

	const response = await fetch(
		`${BACKEND_BASE_URL}/articles/${articleId}/like/`,
		{
			method: "POST",
			headers: await getHeader((json = false))
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
	await checkTokenExp();
	const token = localStorage.getItem("access");

	const response = await fetch(
		`${BACKEND_BASE_URL}/articles/1/comment/${commentId}/`,
		{
			method: "DELETE",
			headers: await getHeader((json = false))
		}
	);
	return response;
}
async function updateComment(commentId, newComment) {
	await checkTokenExp();
	const token = localStorage.getItem("access");
	const response = await fetch(
		`${BACKEND_BASE_URL}/articles/1/comment/${commentId}/`,
		{
			method: "PUT",
			headers: await getHeader(),
			body: JSON.stringify({
				comment: newComment
			})
		}
	);

	return response;
}

async function likeComment(commentId) {
	await checkTokenExp();
	const token = localStorage.getItem("access");
	const response = await fetch(
		`${BACKEND_BASE_URL}/articles/comment/${commentId}/like/`,
		{
			method: "POST",
			headers: await getHeader((json = false))
		}
	);

	return response;
}
async function deleteArticle(articleId) {
	await checkTokenExp();
	const token = localStorage.getItem("access");

	const response = await fetch(`${BACKEND_BASE_URL}/articles/${articleId}/`, {
		method: "DELETE",
		headers: await getHeader((json = false))
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
			headers: await getHeader((json = false))
		}
	);

	if (response.ok) {
		const ingredientLinks = await response.json();

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
		const container = document.getElementById("ingredientslink_list");
		container.appendChild(missingLinksList);
		if (ingredientLinks.length == 0) {
			document.getElementById("coupang_ingredient").remove();
		}
	} else {
		console.error("API 요청 실패:", response.statusText);
		document.getElementById("coupang_ingredient").remove();
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

// token 만료되면 access토큰 이용하여 재로그인
async function checkTokenExp() {
	const payload = localStorage.getItem("payload");
	const refresh = localStorage.getItem("refresh");
	let current_time = String(new Date().getTime()).substring(0, 10);
	if (payload) {
		const payload_parse = JSON.parse(payload).exp;
		if (payload_parse < current_time) {
			localStorage.removeItem("payload");
			localStorage.removeItem("access");
			const response = await fetch(`${BACKEND_BASE_URL}/users/token/refresh/`, {
				method: "POST",
				headers: { "content-type": "application/json" },
				body: JSON.stringify({
					refresh: refresh
				})
			});
			const response_json = await response.json();
			if (Boolean(response_json.access)) {
				localStorage.setItem("access", response_json.access);
				const base64Url = response_json.access.split(".")[1];
				const base64 = base64Url.replace(/-/g, "+");
				const jsonPayload = decodeURIComponent(
					atob(base64)
						.split("")
						.map(function (c) {
							return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
						})
						.join("")
				);
				localStorage.setItem("payload", jsonPayload);
				window.location.replace(`${FRONT_BASE_URL}/`);
			} else {
				localStorage.removeItem("refresh");
				alert("로그아웃되었습니다! 다시로그인해주세요.");
				location.href = `${FRONT_BASE_URL}/login.html`;
			}
		} else {
			return null;
		}
	} else {
		return null;
	}
}

async function getRecommend(recommendType) {
	await checkTokenExp();
	const token = localStorage.getItem("access");
	const response = await fetch(
		`${BACKEND_BASE_URL}/ai_process/?recommend=${recommendType}`,
		{
			method: "GET",
			headers: await getHeader((json = false))
		}
	);
	return response;
}
async function getFollowArticles(userId, page = 1) {
	await checkTokenExp();
	const token = localStorage.getItem("access");
	const response = await fetch(
		`${BACKEND_BASE_URL}/users/${userId}/articles/?filter=3`,
		{
			method: "GET",
			headers: await getHeader((json = false))
		}
	);
	return response;
}
async function getUserFeedArticles(userId, filter, page = 1) {
	await checkTokenExp();
	const token = localStorage.getItem("access");
	const response = await fetch(
		`${BACKEND_BASE_URL}/users/${userId}/articles/?filter=${filter}&page=${page}`,
		{
			method: "GET",
			headers: await getHeader((json = false))
		}
	);
	return response;
}

async function getUserFollowList(currentFollowPage = 1, filter = 0) {
	await checkTokenExp();
	let token = localStorage.getItem("access");
	const userId = new URLSearchParams(window.location.search).get("user_id");
	const response = await fetch(
		`${BACKEND_BASE_URL}/users/${userId}/follow/?follow_page=${currentFollowPage}&filter=${filter}`,
		{
			headers: await getHeader((json = false)),
			method: "GET"
		}
	);
	return response;
}
async function getHeader(json = true) {
	var headers = {};
	if (
		localStorage.getItem("access") != null &&
		localStorage.getItem("access") != undefined
	) {
		headers["Authorization"] = `Bearer ${localStorage.getItem("access")}`;
	}
	if (json) {
		headers["content-type"] = "application/json";
	}
	return headers;
}
