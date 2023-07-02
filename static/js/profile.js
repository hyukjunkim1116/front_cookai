async function loadUserFollowing(currentFollowPage) {
	const response = await getUserFollowList(currentFollowPage);
	const followListResponse = await response.json();
	const followPageList = document.getElementById("follow-page");
	followPageList.style.display = "flex";
	followPageList.innerHTML = "";
	followPageList.innerText = "팔로잉 목록";
	console.log(followListResponse);
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
				<img id="follow-avatar" class="follow-avatar" src=${userAvatar} onclick="location.href='${FRONT_BASE_URL}/profile.html?user_id=${result.id}'" style="cursor:pointer;">
                <div id="follow-name" class="follow-name" onclick="location.href='${FRONT_BASE_URL}/profile.html?user_id=${result.id}'" style="cursor:pointer;">${result.username}</div>
			`;
			followPageList.appendChild(followList);
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
async function loadUserFollower(currentFollowPage) {
	const response = await getUserFollowList(currentFollowPage, 1);
	const followListResponse = await response.json();
	const followPageList = document.getElementById("follow-page");
	followPageList.style.display = "flex";
	followPageList.innerHTML = "";
	followPageList.innerText = "팔로워 목록";
	console.log(followListResponse);
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
				<img id="follow-avatar" class="follow-avatar" src=${userAvatar} onclick="location.href='${FRONT_BASE_URL}/profile.html?user_id=${result.id}'" style="cursor:pointer;">
                <div id="follow-name" class="follow-name" onclick="location.href='${FRONT_BASE_URL}/profile.html?user_id=${result.id}'" style="cursor:pointer;">${result.username}</div>
			`;

			followPageList.appendChild(followList);
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
	const userResponse = await getUserDetail();
	const userId = new URLSearchParams(window.location.search).get("user_id");
	const response = await getUserFeedArticles(userId, 2, currentPage);
	const bookmarkResponse = await response.json();
	const articleContainer = document.getElementById("article");
	console.log("article", bookmarkResponse);
	articleContainer.innerHTML = "";
	articleContainer.innerText = `${userResponse.username}의 북마크`;
	const totalArticles = document.createElement("div");
	totalArticles.setAttribute("class", "user-detail-child");
	totalArticles.setAttribute("id", "total_articles");
	totalArticles.innerText = `게시글 : ${bookmarkResponse.count}`;
	articleContainer.appendChild(totalArticles);
	bookmarkResponse.results.forEach((result) => {
		const articleContent = document.createElement("div");
		const articleImage = result.avatar
			? result.avatar
			: "https://cdn11.bigcommerce.com/s-1812kprzl2/images/stencil/original/products/426/5082/no-image__12882.1665668288.jpg?c=2";
		articleContent.innerHTML = `
		<div id="article-container" class="article-container" onclick="location.href='${FRONT_BASE_URL}/articles/article_detail.html?article_id=${
			result.id
		}'" style="cursor:pointer">
					<img id="article-image" class="article-image" src=${articleImage}/>
                    <div id="article-content" class="article-content">
                        <div id="article-content__title" class="article-content__title">${result.title.slice(
													0,
													15
												)}...</div>
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
                            <div id="article-content__edit" class="article-content__edit" style="visibility:hidden;"></div>
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
	const userResponse = await getUserDetail();
	const userId = new URLSearchParams(window.location.search).get("user_id");
	const response = await getUserFeedArticles(userId, 1, currentPage);
	const likeArticleResponse = await response.json();
	const articleContainer = document.getElementById("article");
	console.log("article", likeArticleResponse);
	articleContainer.innerHTML = "";
	articleContainer.innerText = `${userResponse.username}의 좋아요 게시글`;
	const totalArticles = document.createElement("div");
	totalArticles.setAttribute("class", "user-detail-child");
	totalArticles.setAttribute("id", "total_articles");
	totalArticles.innerText = `게시글 : ${likeArticleResponse.count}`;
	articleContainer.appendChild(totalArticles);
	likeArticleResponse.results.forEach((result) => {
		const articleContent = document.createElement("div");
		const articleImage = result.avatar
			? result.avatar
			: "https://cdn11.bigcommerce.com/s-1812kprzl2/images/stencil/original/products/426/5082/no-image__12882.1665668288.jpg?c=2";
		articleContent.innerHTML = `
		<div id="article-container" class="article-container" onclick="location.href='${FRONT_BASE_URL}/articles/article_detail.html?article_id=${
			result.id
		}'" style="cursor:pointer">
					<img id="article-image" class="article-image" src=${articleImage}/>
                    <div id="article-content" class="article-content">
                        <div id="article-content__title" class="article-content__title">${result.title.slice(
													0,
													15
												)}...</div>
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
                            <div id="article-content__edit" class="article-content__edit" style="visibility:hidden;"></div>
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
	const userResponse = await getUserDetail();
	const response = await getUserComment(currentCommentPage, 1);
	const commentContainer = document.getElementById("comment");
	commentContainer.innerHTML = "";
	commentContainer.innerText = `${userResponse.username}이 좋아하는 댓글`;
	console.log("comment", response);
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
										)}...
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

	const pageCount = response.count / 4 + 1;
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
	const followBtn = document.getElementById("following-btn");
	const payload = localStorage.getItem("payload");
	const payload_parse = JSON.parse(payload);
	const loginUserId = payload_parse.user_id;
	const userResponse = await getUserDetail();
	const followersList = await getUserFollower();
	const followerIdList = followersList.map((follower) => follower.id);
	const avatar = document.getElementById("mypage-avatar");
	const username = document.getElementById("username");
	username.innerText = `${userResponse.username}`;
	avatar.setAttribute(
		"src",
		userResponse.avatar ? userResponse.avatar : "/static/img/no_avatar.png"
	);
	if (!payload) {
		followBtn.style.display = "none";
	} else {
		followBtn.innerText = followerIdList.includes(loginUserId)
			? "언팔로우"
			: "팔로우";
	}
	followBtn.addEventListener("click", () => {
		otherUserFollowing(userResponse.id);
		if (followBtn.innerText === "언팔로우") {
			followBtn.innerText = "팔로우";
		} else if (followBtn.innerText === "팔로우") {
			followBtn.innerText = "언팔로우";
		}
	});
	const following = document.getElementById("following");
	following.innerText = `팔로잉 : ${userResponse.total_followings}`;
	following.addEventListener("click", () => {
		const followPageList = document.getElementById("follow-page");
		const clickedClass = "followPageListClicked";
		if (followPageList.classList.contains(clickedClass)) {
			followPageList.classList.remove(clickedClass);
			followPageList.style.display = "none";
			following.style.backgroundColor = "#FFF";
		} else {
			followPageList.classList.remove("followerPageListClicked");
			loadUserFollowing();
			followPageList.classList.add(clickedClass);
			following.style.backgroundColor = "#FE6B38";
			followPageList.style.display = "flex";
			follower.style.backgroundColor = "#FFF";
		}
	});
	const follower = document.getElementById("follower");
	follower.innerText = `팔로워 : ${userResponse.total_followers}`;
	follower.addEventListener("click", () => {
		const followerPageList = document.getElementById("follow-page");
		const clickedClass = "followerPageListClicked";

		if (followerPageList.classList.contains(clickedClass)) {
			followerPageList.classList.remove(clickedClass);
			followerPageList.style.display = "none";
			follower.style.backgroundColor = "#FFF";
		} else {
			followerPageList.classList.remove("followPageListClicked");
			loadUserFollower();
			followerPageList.classList.add(clickedClass);
			followerPageList.style.display = "flex";
			follower.style.backgroundColor = "#FE6B38";
			following.style.backgroundColor = "#FFF";
		}
	});
	const bookmark = document.getElementById("bookmark-article");
	bookmark.innerText = `북마크한 게시글 : ${userResponse.total_bookmark_articles}`;
	bookmark.addEventListener("click", async () => {
		const articlePageList = document.getElementById("article");
		const clickedClass = "bookmarkArticlePageListClicked";
		if (articlePageList.classList.contains(clickedClass)) {
			articlePageList.classList.remove(clickedClass);
			articlePageList.classList.remove("likeArticlePageListClicked");
			await loadUserArticle();
			bookmark.style.backgroundColor = "#FFF";
			likeArticle.style.backgroundColor = "#FFF";
		} else {
			articlePageList.classList.remove("likeArticlePageListClicked");
			await loadUserBookmarkArticle();
			articlePageList.classList.add(clickedClass);
			bookmark.style.backgroundColor = "#FE6B38";
			likeArticle.style.backgroundColor = "#FFF";
		}
	});
	const likeArticle = document.getElementById("like-article");
	likeArticle.innerText = `좋아요 누른 게시글 : ${userResponse.total_like_articles}`;
	likeArticle.addEventListener("click", async () => {
		const articlePageList = document.getElementById("article");
		const clickedClass = "likeArticlePageListClicked";
		if (articlePageList.classList.contains(clickedClass)) {
			articlePageList.classList.remove(clickedClass);
			articlePageList.classList.remove("bookmarkArticlePageListClicked");
			await loadUserArticle();
			likeArticle.style.backgroundColor = "#FFF";
			bookmark.style.backgroundColor = "#FFF";
		} else {
			articlePageList.classList.remove("bookmarkArticlePageListClicked");
			await loadUserLikeArticle();
			articlePageList.classList.add(clickedClass);
			likeArticle.style.backgroundColor = "#FE6B38";
			bookmark.style.backgroundColor = "#FFF";
		}
	});
	const likeComment = document.getElementById("like-comment");
	likeComment.innerText = `좋아요 누른 댓글 : ${userResponse.total_like_comments}`;
	likeComment.addEventListener("click", async () => {
		const commentPageList = document.getElementById("comment");
		const clickedClass = "likeCommentPageListClicked";
		if (commentPageList.classList.contains(clickedClass)) {
			commentPageList.classList.remove(clickedClass);
			await loadUserComment();
			likeComment.style.backgroundColor = "#FFF";
		} else {
			commentPageList.classList.remove("likeCommentPageListClicked");
			await loadUserLikeComment();
			commentPageList.classList.add(clickedClass);
			likeComment.style.backgroundColor = "#FE6B38";
		}
	});
}
async function loadUserArticle(currentPage) {
	const userResponse = await getUserDetail();
	const response = await getUserArticle(currentPage);
	const articleContainer = document.getElementById("article");
	console.log("article", response);
	articleContainer.innerHTML = "";
	articleContainer.innerText = `${userResponse.username}의 글`;
	const totalArticles = document.createElement("div");
	totalArticles.setAttribute("class", "user-detail-child");
	totalArticles.setAttribute("id", "total_articles");
	totalArticles.innerText = `게시글 : ${response.count}`;
	articleContainer.appendChild(totalArticles);
	response.results.forEach((result) => {
		const articleContent = document.createElement("div");
		const articleImage = result.avatar
			? result.avatar
			: "https://cdn11.bigcommerce.com/s-1812kprzl2/images/stencil/original/products/426/5082/no-image__12882.1665668288.jpg?c=2";
		articleContent.innerHTML = `
		<div id="article-container" class="article-container" onclick="location.href='${FRONT_BASE_URL}/articles/article_detail.html?article_id=${
			result.id
		}'" style="cursor:pointer">
					<img id="article-image" class="article-image" src=${articleImage}/>
                    <div id="article-content" class="article-content">
                        <div id="article-content__title" class="article-content__title">${result.title.slice(
													0,
													15
												)}...</div>
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
                            <div id="article-content__edit" class="article-content__edit" style="visibility:hidden;"></div>
                        </div>
                    </div>
					</div>
		`;
		articleContainer.appendChild(articleContent);
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
	const userResponse = await getUserDetail();
	const response = await getUserComment(currentCommentPage);
	const commentContainer = document.getElementById("comment");
	commentContainer.innerHTML = "";
	commentContainer.innerText = `${userResponse.username}의 댓글`;
	console.log("comment", response);
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
										)}...
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

async function loaderFunction() {
	await loadUserDetail();
	await loadUserArticle();
	await loadUserComment();
}
