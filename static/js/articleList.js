// 유저 게시글 목록 UI

var query =``
var category = ``
var order = ``
var category_state=1
var order_state=1
var tag_state=1
async function loadArticleList(page=1) {
	document.getElementById("categoryArticleBox").hidden=false
	const newCardBox = document.getElementById("card-box")
	console.log(newCardBox)
	const response= await getArticleList(query+category+order,page)
	const response_json=await response.json()
	for (const article of response_json.results) {
        // 새로운 div 요소를 생성하고, class 속성을 "card"로 설정합니다.
        // 또한, 클릭 이벤트 핸들러와 id 속성을 게시물의 고유 식별자(pk)로 설정합니다.
        // 이렇게 생성한 카드를 newCardBox에 추가합니다.
		const newCard = document.createElement("div");
		newCard.setAttribute("class", "card");
		newCard.setAttribute("onclick", `location.href="${FRONT_BASE_URL}/articles/article_detail.html?article_id=${article.id}"`);
		newCard.setAttribute("id", article.id);
		newCardBox.appendChild(newCard);
		const image = response_json.image

        // 게시물의 대표 이미지를 생성하고, 생성한 이미지를 카드에 추가합니다.
        // 게시물의 photos 배열에서 첫 번째 요소의 file 속성을 가져와서 이미지의 src 속성으로 설정합니다.
        // articlePhoto가 존재하지 않는다면, 기본 이미지 주소를 src 속성으로 설정합니다.
		const articleimage = document.createElement("img");
		articleimage.setAttribute("class", "card-img-top");
		if (image) {
			articleimage.setAttribute("src", `${image}`);
		} else {
			articleimage.setAttribute(
				"src",
				"https://cdn11.bigcommerce.com/s-1812kprzl2/images/stencil/original/products/426/5082/no-image__12882.1665668288.jpg?c=2"
			);
		}
		articleimage.setAttribute("onclick", `uploadPhoto(${article.pk})`);
		newCard.appendChild(articleimage);

        // 카드의 본문 생성.
		const newCardBody = document.createElement("div");
		newCardBody.setAttribute("class", "card-body");

		newCard.appendChild(newCardBody);

        // 카드의 제목 생성. 
		const newCardTitle = document.createElement("h6");
		newCardTitle.setAttribute("class", "card-title");
		const newStrong = document.createElement("strong");
		if (article.title.length > 10) {
			newStrong.innerText = `${article.title.substr(0, 10)} ···`;
		} else {
			newStrong.innerText = article.title;
		}
		newCardTitle.appendChild(newStrong);
		newCardBody.appendChild(newCardTitle);
        
        // 카드에 생성일을 표시하는 요소를 생성.
		
		const newCardAuthor = document.createElement("p");
		newCardAuthor.setAttribute("class", "card-text");
		newCardAuthor.innerText = `작성자: ${article.user}`;
		newCardBody.appendChild(newCardAuthor);
		const newCardtime = document.createElement("small");
		newCardtime.setAttribute("class", "card-text");
		newCardtime.innerText = article.created_at.split(".")[0].slice(2,-3).replace("T"," ");
		newCardBody.appendChild(newCardtime);
		
	};
	
	const formerNextPageBtn=document.getElementById("nextpage")
	if (formerNextPageBtn){
		formerNextPageBtn.remove()
	}
	const nextPageBtn= document.createElement("button")
	nextPageBtn.setAttribute("class","btn btn-outline-success col-12")
	nextPageBtn.setAttribute("type","button")
	nextPageBtn.setAttribute("id","nextpage")
	if(response_json.next){
		nextPageBtn.innerText="+ 더보기"
		nextPageBtn.setAttribute("onclick",`loadArticleList(${page+1})`)
	}else{
		nextPageBtn.setAttribute("class","btn btn-outline-secondary col-12")
		nextPageBtn.setAttribute("disabled","true")
		nextPageBtn.innerText="더이상 결과가 없습니다."
	}
	newCardBox.appendChild(nextPageBtn)
}
async function loadTagList(selector){
	const tagBox= document.getElementById("tagBox")
	tagBox.hidden=false
	tagBox.querySelector("h4").innerText =`태그 선택`
	const response = await getTagList(selector)
	const response_json= await response.json()
	document.getElementById("categoryArticleBox").hidden = true
	const tagList=document.getElementById("tagList")
	tagList.setAttribute("class","scrolling-wrapper row flex-row flex-nowrap mt-4 pb-4 pt-2")
	tagList.innerHTML +=`<div id="tags" class="btn-group" role="group" aria-label="Basic radio toggle button group"></div>`
	const tags=document.getElementById("tags")
	tags.innerHTML =``
	var name_list=[]
	response_json.forEach((tag) => {
		console.log(tag)
		if (!name_list.includes(tag.name)){
			tags.innerHTML += `<input type="radio" class="btn-check" name="tag" id="tag_${tag.id}" autocomplete="off">
		<label class="btn btn-outline-primary" for="tag_${tag.id}" onclick="searchByTag(${tag.name})">${tag.name}</label>`
			name_list +=[tag.name]
		}
		

	});
	
}
async function loadFrame(){
	const list_div = document.getElementById("articleList")
	list_div.innerHTML = "";
	const newCardBox = document.createElement("div");
	newCardBox.setAttribute("class", "card-box");
	newCardBox.setAttribute("id", "card-box");
	list_div.appendChild(newCardBox);
}
async function resetTag(){
	const tags = document.getElementById("tagList")
	tags.innerHTML = ""
	document.getElementById("tagBox").hidden=true
}
// 상세 게시글로 이동하는 함수입니다.
function redirectToArticlePage(articleId) {
const url = `http://127.0.0.1:8000/articles/?article_id=${articleId}`;
window.location.href = url;
}
async function search(){
	const preQueryString=document.getElementById("search_type").value
	const selector = document.getElementById("selector").value
	query=`${preQueryString}&selector=${selector}`
	await resetTag()
	if (preQueryString.includes("4")){
		loadTagList(selector)
		return 0
	}
	await loadFrame()
	loadArticleList()
	

}
async function categoryQueryString(categoryId,name){
	// 1. 카테고리선별
	if (categoryId==0){
		category=``
	}else{
		if(query==``){
			category = `?category=${categoryId}`
		}else{
			category += `&category=${categoryId}`
		}
	}
	await loadFrame()
	loadArticleList()
	const categotyTitle=document.getElementById("category_title")
	categotyTitle.innerText=`카테고리:${name}`



}
async function orderQueryString(orderOption){
	// 2. 순서
	if(query+category==``){
		order = `?order=${orderOption}`
	}else{
		order = `&order=${orderOption}`
	}
	await loadFrame()
	loadArticleList()
}

async function loadCategory(){
	const response_json = await getCategory()
	const categoryBox = document.getElementById("category")
	categoryBox.innerHTML=""
	categoryBox.innerHTML +=`<input type="radio" class="btn-check" name="btnradio" id="btnradio0" autocomplete="off"
		checked>
	<label class="btn btn-outline-primary" for="btnradio0" onclick="categoryQueryString(0,'전체')">ALL</label>`
	response_json.forEach((category_) => {
		categoryBox.innerHTML +=`<input type="radio" class="btn-check" name="btnradio" id="btnradio${category_.id}" autocomplete="off">
	<label class="btn btn-outline-primary" for="btnradio${category_.id}" onclick="categoryQueryString(${category_.id},'${category_.name}')">${category_.name}</label>`
	});
}
async function searchByTag(tagname){
	query=`?search=4&selector=${tagname}`
	await loadFrame()
	loadArticleList()
}
// 페이지 로드 시 게시글을 가져오도록 호출합니다
window.onload = async function () {
	await loadFrame()
	loadCategory();
	loadArticleList();
	const SelectOrderBtn = document.createElement("div")
		SelectOrderBtn.setAttribute("id","selectorder")
		SelectOrderBtn.setAttribute("class","btn-group mb-3")
		SelectOrderBtn.setAttribute("role","group")
		SelectOrderBtn.setAttribute("aria-label","Basic radio toggle button group")
		SelectOrderBtn.innerHTML=""
		SelectOrderBtn.innerHTML +=`<input type="radio" class="btn-check" name="selectorder" id="selectorder0" autocomplete="off"
		checked>
	<label class="btn btn-outline-primary" for="selectorder0" onclick="orderQueryString(0)">최신순</label>`
		SelectOrderBtn.innerHTML +=`<input type="radio" class="btn-check" name="selectorder" id="selectorder1" autocomplete="off">
<label class="btn btn-outline-primary" for="selectorder1" onclick="orderQueryString(1)">좋아요순</label>`
	document.getElementById("selectorder").appendChild(SelectOrderBtn)
}
