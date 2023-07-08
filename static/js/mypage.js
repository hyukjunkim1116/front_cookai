async function loadUserFollowing(currentFollowPage = 1) {
	const response = await getUserFollowList(currentFollowPage);
	const followListResponse = await response.json();
	const followingsList = await getUserFollowing();
	const followingIdList = followingsList.map((following) => following.id);
	const currentUserPage = new URLSearchParams(window.location.search).get(
		"user_id"
	);
	const followPageList = document.getElementById("follow-page");
	followPageList.innerHTML = "";
	followPageList.innerText = "팔로잉 목록";

	if (followListResponse !== []) {
		followListResponse.results.forEach((result) => {
			const followList = document.createElement("div");
			followList.setAttribute("id", "follow-list");
			followList.setAttribute("class", "follow-list");
			if (result.avatar) {
				userAvatar = result.avatar;
			} else {
				userAvatar = "/static/img/no_avatar.png";
			}
			followList.innerHTML = `
				<img id="follow-avatar" class="follow-avatar" src=${userAvatar} onclick="location.href='${FRONT_BASE_URL}/mypage.html?user_id=${result.id}'" style="cursor:pointer;">
                <div id="follow-name" class="follow-name" onclick="location.href='${FRONT_BASE_URL}/mypage.html?user_id=${result.id}'" style="cursor:pointer;">${result.username}</div>
				<div id="follow-btn" class="follow-btn follow-following-btn-${result.id}" onclick="userFollowToggle(${result.id})">언팔로우</div>
			`;
			followPageList.appendChild(followList);
			const followBtn = document.querySelector(
				`.follow-following-btn-${result.id}`
			);
			if (isYOU(result.id)) {
				followBtn.remove();
			}
			if (!isYOU(currentUserPage)) {
				if (!followingIdList.includes(result.id))
					followBtn.innerText = "팔로우";
			}
		});
	}
	const pagination = document.createElement("div");
	pagination.setAttribute("class", "pagination");
	pagination.innerHTML = "";

	const pageCount = followListResponse.count / 10 + 1;
	for (i = 1; i < pageCount; i++) {
		const newPageLink = document.createElement("div");
		newPageLink.setAttribute("class", "page-link");
		newPageLink.setAttribute("onclick", `loadUserFollowing(${i})`);
		newPageLink.innerText = i;
		pagination.append(newPageLink);
		followPageList.appendChild(pagination);
	}
}
async function loadUserFollower(currentFollowPage = 1) {
	const response = await getUserFollowList(currentFollowPage, 1);
	const followListResponse = await response.json();
	const followingsList = await getUserFollowing();
	const currentUserPage = new URLSearchParams(window.location.search).get(
		"user_id"
	);
	const followingIdList = followingsList.map((following) => following.id);
	const followPageList = document.getElementById("follow-page");
	followPageList.style.display = "flex";
	followPageList.innerHTML = "";
	followPageList.innerText = "팔로워 목록";

	if (followListResponse !== []) {
		followListResponse.results.forEach((result) => {
			const followList = document.createElement("div");
			followList.setAttribute("id", "follow-list");
			followList.setAttribute("class", "follow-list");
			if (result.avatar) {
				userAvatar = result.avatar;
			} else {
				userAvatar = "/static/img/no_avatar.png";
			}
			followList.innerHTML = `
				<img id="follow-avatar" class="follow-avatar" src=${userAvatar} onclick="location.href='${FRONT_BASE_URL}/mypage.html?user_id=${
				result.id
			}'" style="cursor:pointer;">
                <div id="follow-name" class="follow-name" onclick="location.href='${FRONT_BASE_URL}/mypage.html?user_id=${
				result.id
			}'" style="cursor:pointer;">${result.username}</div>
                <div id="follower-btn" class="follow-btn follow-btn-${
									result.id
								}" onclick = "otherUserFollowToggle(${result.id})">${
				followingIdList.includes(result.id) ? "언팔로우" : "팔로우"
			}</div>
			`;
			followPageList.appendChild(followList);
			const followBtn = document.querySelector(`.follow-btn-${result.id}`);
			if (isYOU(result.id)) {
				followBtn.remove();
			}
			if (!isYOU(currentUserPage)) {
				if (!followingIdList.includes(result.id))
					followBtn.innerText = "팔로우";
			}
		});
	}
	const pagination = document.createElement("div");
	pagination.setAttribute("class", "pagination");
	pagination.innerHTML = "";

	const pageCount = followListResponse.count / 10 + 1;
	for (i = 1; i < pageCount; i++) {
		const newPageLink = document.createElement("div");
		newPageLink.setAttribute("class", "page-link");
		newPageLink.setAttribute("onclick", `loadUserFollower(${i})`);
		newPageLink.innerText = i;
		pagination.append(newPageLink);
		followPageList.appendChild(pagination);
	}
}
async function loadUserBookmarkArticle(currentPage) {
	const userId = new URLSearchParams(window.location.search).get("user_id");
	const response = await getUserFeedArticles(userId, 2, currentPage);
	const bookmarkResponse = await response.json();
	const articleContainer = document.getElementById("article");

	articleContainer.innerHTML = "";
	articleContainer.innerText = "북마크한 게시글";
	const totalArticles = document.createElement("div");
	totalArticles.setAttribute("class", "user-detail-child");
	totalArticles.setAttribute("id", "total_articles");
	totalArticles.innerText = `게시글 : ${bookmarkResponse.count}`;
	articleContainer.appendChild(totalArticles);
	bookmarkResponse.results.forEach((result) => {
		const articleContent = document.createElement("div");
		const articleImage = result.image
			? result.image
			: "https://cdn11.bigcommerce.com/s-1812kprzl2/images/stencil/original/products/426/5082/no-image__12882.1665668288.jpg?c=2";
		articleContent.innerHTML = `
		<div id="article-container" class="article-container"  >
					<img id="article-image" class="article-image" src=${articleImage} onclick="location.href='${FRONT_BASE_URL}/articles/article_detail.html?article_id=${
			result.id
		}'" style="cursor:pointer"/>
                    <div id="article-content" class="article-content">
                        <div id="article-content__title" class="article-content__title">${result.title.slice(
													0,
													15
												)}⋯</div>
                        <div id="article-content__user" class="article-content__user">${
													result.user
												}</div>
                        <div id="article-content-count" class="article-content-count">
                            <div id="article-content__likes_count" class="article-content__likes_count"><i class="bi bi-heart-fill"></i> ${
															result.likes_count
														}</div>
                            <div id="article-content__comments_count" class="article-content__comments_count">댓글 수: ${
															result.comments_count
														}</div>
                            <div id="article-content__edit" class="article-content__edit" style="visibility:hidden;" >수정하기</div>
                        </div>
                    </div>
					</div>
		`;
		articleContainer.appendChild(articleContent);
	});
	const pagination = document.createElement("div");
	pagination.setAttribute("class", "pagination");
	pagination.innerHTML = "";

	const pageCount = bookmarkResponse.count / 4 + 1;
	for (i = 1; i < pageCount; i++) {
		const newPageLink = document.createElement("div");
		newPageLink.setAttribute("class", "page-link");
		newPageLink.setAttribute("onclick", `loadUserBookmarkArticle(${i})`);
		newPageLink.innerText = i;
		pagination.append(newPageLink);
		articleContainer.appendChild(pagination);
	}
}

async function loadUserLikeArticle(currentPage) {
	const userId = new URLSearchParams(window.location.search).get("user_id");
	const response = await getUserFeedArticles(userId, 1, currentPage);
	const likeArticleResponse = await response.json();
	const articleContainer = document.getElementById("article");

	articleContainer.innerHTML = "";
	articleContainer.innerText = "좋아요 누른 게시글";
	const totalArticles = document.createElement("div");
	totalArticles.setAttribute("class", "user-detail-child");
	totalArticles.setAttribute("id", "total_articles");
	totalArticles.innerText = `게시글 : ${likeArticleResponse.count}`;
	articleContainer.appendChild(totalArticles);
	likeArticleResponse.results.forEach((result) => {
		const articleContent = document.createElement("div");
		const articleImage = result.image
			? result.image
			: "https://cdn11.bigcommerce.com/s-1812kprzl2/images/stencil/original/products/426/5082/no-image__12882.1665668288.jpg?c=2";
		articleContent.innerHTML = `
		<div id="article-container" class="article-container"  >
					<img id="article-image" class="article-image" src=${articleImage} onclick="location.href='${FRONT_BASE_URL}/articles/article_detail.html?article_id=${
			result.id
		}'" style="cursor:pointer"/>
                    <div id="article-content" class="article-content">
                        <div id="article-content__title" class="article-content__title">${result.title.slice(
													0,
													15
												)}⋯</div>
                        <div id="article-content__user" class="article-content__user">${
													result.user
												}</div>
                        <div id="article-content-count" class="article-content-count">
                            <div id="article-content__likes_count" class="article-content__likes_count"><i class="bi bi-heart-fill"></i> ${
															result.likes_count
														}</div>
                            <div id="article-content__comments_count" class="article-content__comments_count">댓글 수: ${
															result.comments_count
														}</div>
                            <div id="article-content__edit" class="article-content__edit" style="visibility:hidden;" >수정하기</div>
                        </div>
                    </div>
					</div>
		`;
		articleContainer.appendChild(articleContent);
	});
	const pagination = document.createElement("div");
	pagination.setAttribute("class", "pagination");
	pagination.innerHTML = "";

	const pageCount = likeArticleResponse.count / 4 + 1;
	for (i = 1; i < pageCount; i++) {
		const newPageLink = document.createElement("div");
		newPageLink.setAttribute("class", "page-link");
		newPageLink.setAttribute("onclick", `loadUserLikeArticle(${i})`);
		newPageLink.innerText = i;
		pagination.append(newPageLink);
		articleContainer.appendChild(pagination);
	}
}

async function loadUserLikeComment(currentCommentPage) {
	const likeCommentResponse = await getUserComment(currentCommentPage, 1);
	const commentContainer = document.getElementById("comment");
	commentContainer.innerHTML = "";
	commentContainer.innerText = "좋아요 누른 댓글";

	const totalComments = document.createElement("div");
	totalComments.innerText = `댓글 : ${likeCommentResponse.count}`;
	totalComments.setAttribute("class", "user-detail-child");
	totalComments.setAttribute("id", "total_comments");
	commentContainer.appendChild(totalComments);
	likeCommentResponse.results.forEach((result) => {
		const commentContent = document.createElement("div");
		commentContent.innerHTML = `
				<div class="comment-container" id="comment-container">
                    <div class="comment-text" id="comment-text">내용 : ${result.comment.slice(
											0,
											25
										)}⋯
					</div>
					<div class="comment-author" id="comment-author">작성자 : ${result.user}</div>
                    <div class="comment-detail" id="comment-detail">
                        <div class="comment-article" id="comment-article" onclick="location.href='${FRONT_BASE_URL}/articles/article_detail.html?article_id=${
			result.article
		}'" style="cursor:pointer">게시글 보러 가기</div>
                        <div class="comment-updated" id="comment-updated">
						${result.updated_at.slice(0, 10)}
                        </div>
                        <div class="comment-like" id="comment-like">
                            <i class="bi bi-hand-thumbs-up"></i> ${
															result.likes_count
														}
                        </div>
                    </div>
                </div>
	`;
		commentContainer.appendChild(commentContent);
	});
	const commentPagination = document.createElement("div");
	commentPagination.setAttribute("class", "pagination");
	commentPagination.innerHTML = "";

	const pageCount = likeCommentResponse.count / 4 + 1;
	for (i = 1; i < pageCount; i++) {
		const newPageLink = document.createElement("div");
		newPageLink.setAttribute("class", "page-link");
		newPageLink.setAttribute("onclick", `loadUserLikeComment(${i})`);
		newPageLink.innerText = i;
		commentPagination.append(newPageLink);
		commentContainer.appendChild(commentPagination);
	}
}

async function loadUserDetail() {
	const response = await getUserDetail();
	const followingsList = await getUserFollowing();
	const userDetailFollowBtn = document.getElementById("mypage-following-btn");
	const userUpdateProfileBtn = document.getElementById("update-user");
	if (followingsList != null) {
		const followingIdList = followingsList.map((following) => following.id);
		const avatar = document.getElementById("mypage-avatar");
		avatar.setAttribute(
			"src",
			[null, undefined].includes(response.avatar)
				? "/static/img/no_avatar.png"
				: response.avatar
		);
		const username = document.getElementById("username");
		username.innerText = `${response.username}`;

		if (isYOU(response.id)) {
			const mypage = document.querySelector(".mypage");
			userDetailFollowBtn.remove();
			const userEmail = document.createElement("null");
			userEmail.innerHTML = `<div class="user-email" id="user-email"><i class="bi bi-envelope envelope-icon"></i>${response.email}</div>`;
			mypage.insertAdjacentHTML("afterend", userEmail.innerHTML);
		} else {
			userUpdateProfileBtn.remove();
			userDetailFollowBtn.innerText = followingIdList.includes(response.id)
				? "언팔로우"
				: "팔로우";
		}

		userDetailFollowBtn.setAttribute(
			"onclick",
			`loadedUserFollowToggle(${response.id})`
		);
		const following = document.getElementById("following");
		following.innerText = `팔로잉 : ${response.total_followings}`;
		following.addEventListener("click", () => {
			const followPageList = document.getElementById("follow-page");
			const clickedClass = "followPageListClicked";
			if (followPageList.classList.contains(clickedClass)) {
				followPageList.classList.remove(clickedClass);
				followPageList.style.display = "none";
				following.style.backgroundColor = "#FFF";
				following.style.color = "black";
			} else {
				followPageList.classList.remove("followerPageListClicked");
				loadUserFollowing();
				followPageList.classList.add(clickedClass);
				following.style.backgroundColor = "#FE6B38";
				following.style.color = "#FFF";
				followPageList.style.display = "flex";
				follower.style.backgroundColor = "#FFF";
				follower.style.color = "black";
			}
		});
		const follower = document.getElementById("follower");
		follower.innerText = `팔로워 : ${response.total_followers}`;
		follower.addEventListener("click", () => {
			const followerPageList = document.getElementById("follow-page");
			const clickedClass = "followerPageListClicked";

			if (followerPageList.classList.contains(clickedClass)) {
				followerPageList.classList.remove(clickedClass);
				followerPageList.style.display = "none";
				follower.style.backgroundColor = "#FFF";
				follower.style.color = "black";
			} else {
				followerPageList.classList.remove("followPageListClicked");
				loadUserFollower();
				followerPageList.classList.add(clickedClass);
				followerPageList.style.display = "flex";
				follower.style.backgroundColor = "#FE6B38";
				follower.style.color = "#FFF";
				following.style.backgroundColor = "#FFF";
				following.style.color = "black";
			}
		});
	} else {
		const avatar = document.getElementById("mypage-avatar");
		avatar.setAttribute(
			"src",
			[null, undefined].includes(response.avatar)
				? "/static/img/no_avatar.png"
				: response.avatar
		);
		const username = document.getElementById("username");
		username.innerText = `${response.username}`;
		const userDetailFollowBtn = document.getElementById("mypage-following-btn");
		userUpdateProfileBtn.remove();
		userDetailFollowBtn.remove();
		const following = document.getElementById("following");
		following.remove();
		const follower = document.getElementById("follower");
		follower.remove();
	}

	const bookmark = document.getElementById("bookmark-article");
	bookmark.innerText = `북마크한 게시글 : ${response.total_bookmark_articles}`;
	bookmark.addEventListener("click", async () => {
		const articlePageList = document.getElementById("article");
		const clickedClass = "bookmarkArticlePageListClicked";
		if (articlePageList.classList.contains(clickedClass)) {
			articlePageList.classList.remove(clickedClass);
			articlePageList.classList.remove("likeArticlePageListClicked");
			await loadUserArticle();
			bookmark.style.backgroundColor = "#FFF";
			bookmark.style.color = "black";
			likeArticle.style.backgroundColor = "#FFF";
		} else {
			articlePageList.classList.remove("likeArticlePageListClicked");
			await loadUserBookmarkArticle();
			articlePageList.classList.add(clickedClass);
			bookmark.style.color = "#FFF";
			bookmark.style.backgroundColor = "#FE6B38";
			likeArticle.style.backgroundColor = "#FFF";
			likeArticle.style.color = "black";
		}
	});
	const likeArticle = document.getElementById("like-article");
	likeArticle.innerText = `좋아요 누른 게시글 : ${response.total_like_articles}`;
	likeArticle.addEventListener("click", async () => {
		const articlePageList = document.getElementById("article");
		const clickedClass = "likeArticlePageListClicked";
		if (articlePageList.classList.contains(clickedClass)) {
			articlePageList.classList.remove(clickedClass);
			articlePageList.classList.remove("bookmarkArticlePageListClicked");
			await loadUserArticle();
			likeArticle.style.backgroundColor = "#FFF";
			likeArticle.style.color = "black";
			bookmark.style.backgroundColor = "#FFF";
		} else {
			articlePageList.classList.remove("bookmarkArticlePageListClicked");
			await loadUserLikeArticle();
			articlePageList.classList.add(clickedClass);
			likeArticle.style.backgroundColor = "#FE6B38";
			likeArticle.style.color = "#FFF";
			bookmark.style.backgroundColor = "#FFF";
			bookmark.style.color = "black";
		}
	});
	const likeComment = document.getElementById("like-comment");
	likeComment.innerText = `좋아요 누른 댓글 : ${response.total_like_comments}`;
	likeComment.addEventListener("click", async () => {
		const commentPageList = document.getElementById("comment");
		const clickedClass = "likeCommentPageListClicked";
		if (commentPageList.classList.contains(clickedClass)) {
			commentPageList.classList.remove(clickedClass);
			await loadUserComment();
			likeComment.style.backgroundColor = "#FFF";
			likeComment.style.color = "black";
		} else {
			commentPageList.classList.remove("likeCommentPageListClicked");
			await loadUserLikeComment();
			commentPageList.classList.add(clickedClass);
			likeComment.style.backgroundColor = "#FE6B38";
			likeComment.style.color = "#FFF";
		}
	});
}

async function loadUserFridge() {
	const userId = new URLSearchParams(window.location.search).get("user_id");

	const response = await getUserFridge();

	const userFridgeContent = document.getElementById("fridge-content");
	if (isYOU(userId)) {
		if (response !== []) {
			response.forEach((fridge) => {
				const newUserFridge = document.createElement("div");
				const deleteUserFridgeBtn = document.createElement("div");
				deleteUserFridgeBtn.innerHTML = `<div onclick="deleteUserFridge(${fridge.id})"><i style="cursor:pointer;" class="bi bi-x"></i></div>`;
				newUserFridge.setAttribute("class", "fridge-ingredient");
				newUserFridge.setAttribute("id", `fridge-${fridge.id}`);
				newUserFridge.innerText = `${fridge.ingredient}`;
				newUserFridge.appendChild(deleteUserFridgeBtn);
				userFridgeContent.appendChild(newUserFridge);
			});
		}
	} else {
		const fridge_container = document.getElementById("fridge");
		fridge_container.remove();
	}
}
async function loadUserArticle(currentPage) {
	const response = await getUserArticle(currentPage);
	const articleContainer = document.getElementById("article");
	const userId = new URLSearchParams(window.location.search).get("user_id");
	articleContainer.innerHTML = "";
	articleContainer.innerText = "작성 글";
	const totalArticles = document.createElement("div");
	totalArticles.setAttribute("class", "user-detail-child");
	totalArticles.setAttribute("id", "total_articles");
	totalArticles.innerText = `게시글 : ${response.count}`;
	articleContainer.appendChild(totalArticles);
	response.results.forEach((result) => {
		const articleContent = document.createElement("div");
		const articleImage = result.image
			? result.image
			: "https://cdn11.bigcommerce.com/s-1812kprzl2/images/stencil/original/products/426/5082/no-image__12882.1665668288.jpg?c=2";
		articleContent.innerHTML = `
		<div id="article-container" class="article-container" >
					<img id="article-image" class="article-image" src=${articleImage} onclick="location.href='${FRONT_BASE_URL}/articles/article_detail.html?article_id=${
			result.id
		}'" style="cursor:pointer"/>
                    <div id="article-content" class="article-content">
                        <div id="article-content__title" class="article-content__title">${result.title.slice(
													0,
													15
												)}⋯</div>
                        <div id="article-content__user" class="article-content__user">${
													result.user
												}</div>
                        <div id="article-content-count" class="article-content-count">
                            <div id="article-content__likes_count" class="article-content__likes_count"><i class="bi bi-heart-fill"></i> ${
															result.likes_count
														}</div>
                            <div id="article-content__comments_count" class="article-content__comments_count">댓글 수: ${
															result.comments_count
														}</div>
                            <div id="article-content__edit" class="article-content__edit" onclick="location.href='${FRONT_BASE_URL}/articles/article_update.html?article_id=${
			result.id
		}'" style="cursor:pointer">수정하기</div>
                        </div>
                    </div>
					</div>
		`;
		articleContainer.appendChild(articleContent);
		const updateArticleBtn = document.querySelector(`.article-content__edit`);
		if (!isYOU(userId)) {
			updateArticleBtn.remove();
		}
	});
	const pagination = document.createElement("div");
	pagination.setAttribute("class", "pagination");
	pagination.innerHTML = "";

	const pageCount = response.count / 4 + 1;
	for (i = 1; i < pageCount; i++) {
		const newPageLink = document.createElement("div");
		newPageLink.setAttribute("class", "page-link");
		newPageLink.setAttribute("onclick", `loadUserArticle(${i})`);
		newPageLink.innerText = i;
		pagination.append(newPageLink);
		articleContainer.appendChild(pagination);
	}
}
async function loadUserComment(currentCommentPage) {
	const response = await getUserComment(currentCommentPage);
	const commentContainer = document.getElementById("comment");
	commentContainer.innerHTML = "";
	commentContainer.innerText = "작성 댓글";

	const totalComments = document.createElement("div");
	totalComments.innerText = `댓글 : ${response.count}`;
	totalComments.setAttribute("class", "user-detail-child");
	totalComments.setAttribute("id", "total_comments");
	commentContainer.appendChild(totalComments);
	response.results.forEach((result) => {
		const commentContent = document.createElement("div");
		commentContent.innerHTML = `
				<div class="comment-container" id="comment-container">
                    <div class="comment-text" id="comment-text">내용 : ${result.comment.slice(
											0,
											25
										)}⋯
					</div>
                    <div class="comment-detail" id="comment-detail">
                        <div class="comment-article" id="comment-article" onclick="location.href='${FRONT_BASE_URL}/articles/article_detail.html?article_id=${
			result.article
		}'" style="cursor:pointer">게시글 보러 가기</div>
                        <div class="comment-updated" id="comment-updated">
						${result.updated_at.slice(0, 10)}
                        </div>
                        <div class="comment-like" id="comment-like">
                            <i class="bi bi-hand-thumbs-up"></i> ${
															result.likes_count
														}
                        </div>
                    </div>
                </div>
	`;
		commentContainer.appendChild(commentContent);
	});
	const commentPagination = document.createElement("div");
	commentPagination.setAttribute("class", "pagination");
	commentPagination.innerHTML = "";

	const pageCount = response.count / 4 + 1;
	for (i = 1; i < pageCount; i++) {
		const newPageLink = document.createElement("div");
		newPageLink.setAttribute("class", "page-link");
		newPageLink.setAttribute("onclick", `loadUserComment(${i})`);
		newPageLink.innerText = i;
		commentPagination.append(newPageLink);
		commentContainer.appendChild(commentPagination);
	}
}
const loadedUserFollowToggle = (id) => {
	const followBtn = document.getElementById("mypage-following-btn");
	otherUserFollowing(id);
	if (followBtn.innerText === "언팔로우") {
		followBtn.innerText = "팔로우";
	} else if (followBtn.innerText === "팔로우") {
		followBtn.innerText = "언팔로우";
	}
};
const otherUserFollowToggle = (id) => {
	const followBtn = document.querySelector(`.follow-btn-${id}`);
	otherUserFollowing(id);
	if (followBtn.innerText === "언팔로우") {
		followBtn.innerText = "팔로우";
	} else if (followBtn.innerText === "팔로우") {
		followBtn.innerText = "언팔로우";
	}
};
const userFollowToggle = (userId) => {
	const followBtn = document.getElementById("follow-btn");
	const clickedClass = "clicked";
	otherUserFollowing(userId);
	if (followBtn.classList.contains(clickedClass)) {
		followBtn.classList.remove(clickedClass);
		followBtn.innerText = "언팔로우";
	} else {
		followBtn.classList.add(clickedClass);
		followBtn.innerText = "팔로우";
	}
};
async function loaderFunction() {
	const userId = new URLSearchParams(window.location.search).get("user_id");
	await loadUserArticle();
	await loadUserComment();
	await loadUserDetail();
	if (isLogin() && isYOU(userId)) {
		await loadUserFridge();
	}
}
