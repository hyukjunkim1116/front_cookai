let articleId
let authorId


async function loadArticle(){
    const response = await getArticle(articleId);

    if(response.status == 200) {
        const response_json = await response.json()

        const articleTitle = document.getElementById("article-title")
        const articleContent = document.getElementById("article-content")
        const articlePictures=document.getElementById("article-pictures")
        const articleAuthor = document.getElementById("article-author")
        const likesCount = document.getElementById("likes-count")
        articleTitle.innerText = response_json.title
        articlePictures.innerHTML = `<div class="col-md-6">
                                        Original Picture: <br> <img class="img-fluid" src="${backend_base_url}${response_json.input_pic}" />
                                    </div>
                                    <div class="col-md-6">
                                        Changed Picture: <br> <img class="img-fluid" src="${backend_base_url}${response_json.change_pic}" />
                                    </div>`
        articleContent.innerHTML = `<div class="card mt-3">
                                        <div class="card-body text-start">
                                            <h3>${response_json.author}의 한마디</h3>
                                            <p>${response_json.description}</p>
                                        </div>
                                        
                                    </div>
                                    <div class="card mt-3">
                                        <div class="text-end card-body">
                                            <h3>고양이의 한마디</h3>
                                            <p>${response_json.cat_says}</p>
                                        </div>
                                        
                                    </div>`
        articleAuthor.innerText = response_json.author
        likesCount.innerText = response_json.likes_count
        authorId = response_json.author_id
        const commentCount=document.getElementById("comment-count")
        commentCount.innerText=`댓글 ${response_json.comment_count}개`
    } else {
        alert(response.status)
    }
}


async function loadComments(){
    const response = await getComments(articleId);
    

    const commentList = document.getElementById("comment-list")
    commentList.innerHTML = ""

    response.results.forEach(comment => {
        commentList.innerHTML += `
                <li class="list-group-item d-flex justify-content-between align-items-start">
                    <div>
                        <h5>${comment.author}</h5>
                        <p>${comment.content}</p>
                    </div>
                    <div>
                        <span class="badge bg-secondary" onclick="updateCommentButton(${comment.id}, this)">수정</span>
                        <span class="badge bg-secondary" onclick="deleteCommentButton(${comment.id})">삭제</span>
                    </div>
            </li>
            `
    });
}


async function submitComment(){
    const commentElement = document.getElementById("comment-input")
    const newComment = commentElement.value
    const response = await postComment(articleId, newComment)
    commentElement.value = ""

    if(response.status == 201) {
        response_json = await response.json()
        alert(response_json.message)
        loadComments()
    } else {
        alert(response.status)
    }
}


async function updateCommentButton(commentId, element){
    const comment_content = element.parentNode.previousElementSibling.querySelector('p').innerText
    const commentElement = document.getElementById("comment-input")
    commentElement.value = comment_content
    
    const submitCommentButton = document.getElementById("submitCommentButton")
    submitCommentButton.innerText = "댓글수정"
    submitCommentButton.setAttribute("onclick",`submitUpdateComment(${commentId})`)
}


async function submitUpdateComment(commentId){
    const commentElement = document.getElementById("comment-input")
    const newComment = commentElement.value
    const response = await updateComment(commentId, newComment)
    commentElement.value = ""
    
    if(response.status == 200) {
        response_json = await response.json()
        alert(response_json.message)
        loadComments()
    } else {
        alert(response.status)
    }

    const submitCommentButton = document.getElementById("submitCommentButton")
    submitCommentButton.innerText = "댓글작성"
    submitCommentButton.setAttribute("onclick",`submitComment()`)
}


async function deleteCommentButton(commentId){
    const response = await deleteComment(commentId)

    if(response.status == 204) {
        alert("삭제 완료!")
        loadComments()
    } else {
        alert(response.status)
    }
}


async function injectButton(){
    let buttonArea = document.getElementById("button-area")

    let authorBtn = document.createElement("a")
    authorBtn.setAttribute("class","btn btn-outline-primary")
    authorBtn.setAttribute("href",`/profile.html?user_id=${authorId}`)
    authorBtn.innerText = "작성자"

    let likeBtn = document.createElement("button")
    likeBtn.setAttribute("type","button")
    likeBtn.setAttribute("class","btn btn-outline-warning")
    likeBtn.setAttribute("onclick",`likeArticle(${articleId})`)
    likeBtn.innerText = "좋아요"

    let bookmarkBtn = document.createElement("button")
    bookmarkBtn.setAttribute("type","button")
    bookmarkBtn.setAttribute("class","btn btn-outline-success")
    bookmarkBtn.setAttribute("onclick",`bookmarkArticle(${articleId})`)
    bookmarkBtn.innerText = "북마크"

    let updateBtn = document.createElement("a")
    updateBtn.setAttribute("class","btn btn-outline-secondary")
    updateBtn.setAttribute("href",`/article_update.html?article_id=${articleId}`)
    updateBtn.innerText = "수정"

    let deleteBtn = document.createElement("button")
    deleteBtn.setAttribute("type","button")
    deleteBtn.setAttribute("class","btn btn-outline-danger")
    deleteBtn.setAttribute("onclick",`deleteArticle(${articleId})`)
    deleteBtn.innerText = "삭제"

    buttonArea.append(authorBtn)
    buttonArea.append(likeBtn)
    buttonArea.append(bookmarkBtn)
    buttonArea.append(updateBtn)
    buttonArea.append(deleteBtn)
}


window.onload = async function() {
    const urlParams = new URLSearchParams(window.location.search);
    articleId = urlParams.get('article_id');

    await loadArticle();
    await injectButton();
    await loadComments();
}