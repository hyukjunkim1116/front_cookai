//아티클 업데이트 하기
console.log("articleUpdate.js 로드됨");
let originTargets=[]
let updateOrDelete={}
let idToIndex={}
const urlParams = new URLSearchParams(window.location.search);
const articleId = urlParams.get("article_id");
let lastOriginIngredientIndex=0
async function generateUpdateFormFields(articleData) {
    // 재료 처리
    articleData.recipeingredient_set.forEach((ingredientData) => {
        handleAddIngredient();
        const lastIndex = ingredientNumber - 1;
        document.getElementById(`ingredient-title-${lastIndex}`).value = ingredientData.ingredient_id;
        document.getElementById(`ingredient-amount-${lastIndex}`).value = ingredientData.ingredient_quantity;
        document.getElementById(`ingredient-unit-${lastIndex}`).value = ingredientData.ingredient_unit;
		document.getElementById(`ingredient-unit-${lastIndex}`).nextElementSibling.setAttribute("onclick",`deleteOnUpdate(${lastIndex},${ingredientData.id},event)`)
		updateOrDelete[ingredientData.id]=false
		idToIndex[ingredientData.id]=lastIndex
		originTargets +=[lastIndex]
    });

    const recipeContainer = document.getElementById("recipe_container");
    const recipeHTML = articleData.recipe;
    recipeContainer.outerHTML = recipeHTML;
	var count = (recipeHTML.match(/recipe-element/g) || []).length;
	recipeNumber +=count

    // 태그 처리
    const tagInput = document.getElementById("article_tag");
    tagInput.value = articleData.tags.join(', ');
}

window.onload = async function loadUpdatePost() {
	// 수정창에 기존 내용 보이게
    checkNotLogin();
    
    const exist_post = await getArticle(articleId);
    
    const updateTitle = document.getElementById("article_title");
    updateTitle.value = exist_post.title;
	
    const updateContent = document.getElementById("article_content");
    updateContent.value = exist_post.content;
	
    await generateUpdateFormFields(exist_post);
	await setCategory();
	const categories=document.getElementById("category")

	for (var i = 0; i < categories.options.length; i++) {
		var optionValue = categories.options[i].value;
		if (`${exist_post.category}` === optionValue) {
			categories.options[i].selected = true;
		  break; // Exit the loop if a match is found
		}
	}


    // 레시피와 재료를 다루기 위한 코드
    const ingredientsContainer = document.getElementById("ingredient_wrapper");
    // const recipeContainer = document.getElementById("recipe");

    // // 레시피를 처리하기 위한 코드
    // recipeContainer.outerHTML = exist_post.recipe;


    
	// => {
    //     // 기존 작성한 내용과 새로 작성한 내용을 함께 생성된 필드에 할당하게 함
    //     const newArticleData = {
    //     title: updateTitle.value,
    //     content: updateContent.value,
    //     category: document.getElementById("category").value,
    //     ingredients: Array.from(ingredientsContainer.getElementsByTagName("input")).map(
    //         (input) => input.value
    //     ),
    //     recipe: Array.from(recipeContainer.getElementsByTagName("textarea")).map(
    //         (textarea) => textarea.value
    //     ),
    //     };
    //     await putApiUpdateArticle(articleId, newArticleData);
    // });
};
// 업데이트 버튼 이벤트 리스너
const updateButton = document.getElementById("update_article");
updateButton.addEventListener("click", (event)=>{
	articleUpdate();
	event.preventDefault();
}) 


// // 아티클 사진 삭제
// async function articlePhotoDelete() {
// 	const exist_post = await getArticleDetail(articleId);
// 	if (exist_post.photos[0]) {
// 		const response = await fetch(
// 			`${backend_base_url}/api/medias/photos/${exist_post.photos[0]?.pk}`,
// 			{
// 				method: "DELETE",
// 				headers: {
// 					Authorization: `Bearer ${token}`
// 				}
// 			}
// 		);
// 		if (response.status == 200) {
// 			alert("사진이 삭제되었습니다!");
// 		} else {
// 			alert("사진 삭제 권한이 없습니다.");
// 		}
// 	} else {
// 		alert("등록된 사진이 없습니다!");
// 	}
// 	location.reload();
// }

//아티클 업데이트 페이지 들어가면 실행되는 함수. file input은 설정 불가

async function articleUpdate() {
	await arrangeRecipeAndUpload()
	const token = localStorage.getItem("access")

	// const exist_post = await getArticle(articleId);
	const category= document.getElementById("category").value;
	const title = document.getElementById("article_title").value;
	const content = document.getElementById("article_content").value;
	const file = document.getElementById("article_image").files[0];

	const formdata = new FormData();
	formdata.append("title", title);
	formdata.append("content", content);
	formdata.append("category", category);

	
	if (file) {
		const responseURL = await fetch(
			`${backend_base_url}/api/medias/photos/get-url/`,
			{
				method: "POST"
			}
			);
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
			formdata.append("image",realFileURL)
		}
	//재료 수정 및 삭제 및 새로 작성 여부
	const updateOrDelete_=Object.entries(updateOrDelete)
	updateOrDelete_.forEach(async (kv) => {
		if(kv[1]){
			// 삭제 절차
			const ingredientPutResponse = await fetch(
				`${BACKEND_BASE_URL}/articles/recipeingredient/${kv[0]}/`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
					method:"DELETE"
				},
			)
		}else{
			//수정 절차
			let index = idToIndex[kv[0]]
			const ingredientPutResponse = await fetch(
				`${BACKEND_BASE_URL}/articles/recipeingredient/${kv[0]}/`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
						"content-type": "application/json"
					},
					body: JSON.stringify({
						ingredient:  document.getElementById(`ingredient-title-${index}`).value,
						ingredient_quantity: document.getElementById(`ingredient-amount-${index}`).value,
						ingredient_unit: document.getElementById(`ingredient-unit-${index}`).value
					}),
					method: "PUT"
				}
			);
			
		}
		
	});
	// 새 재료 추가 절차
	for(var j = 1;j<=ingredientNumber;j++){
		if(!originTargets.includes(j)){
			const title = document.getElementById(`ingredient-title-${j}`);
			if(!title) continue;
			let ingredientTitle=title.value
			let ingredientQuantity = document.getElementById(
				`ingredient-amount-${i}`
			).value;
			let ingredientUnit = document.getElementById(
				`ingredient-unit-${i}`
			).value;
			const ingredientResponse = await fetch(
				`${BACKEND_BASE_URL}/articles/${articleId}/recipeingredient/`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
						"content-type": "application/json"
					},
					body: JSON.stringify({
						ingredient: ingredientTitle.value,
						ingredient_quantity: ingredientQuantity,
						ingredient_unit: ingredientUnit
					}),
					method: "POST"
				}
			);
		}
	}
	
	//레시피 수정 여부
	var fileInputs = document.getElementById("recipe_container").querySelectorAll('input[type="file"]');
	fileInputs.forEach(async(element) => {
		const file = element.files[0]
		if (file){
			let recipeImage = element.files[0];
			let responseURL = await fetch(`${BACKEND_BASE_URL}/articles/get-url/`, {
				method: "POST"
			});
			let dataURL = await responseURL.json();
			//실제로 클라우드플레어에 업로드
			let formData = new FormData();
			formData.append("file", recipeImage);
			let responseRealURL = await fetch(`${dataURL["uploadURL"]}`, {
				body: formData,
				method: "POST"
			});
			let results = await responseRealURL.json();
			let realFileURL = results.result.variants[0];
			const image = element.nextElementSibling.firstChild
			image.setAttribute("src",realFileURL)
			let id =image.getAttribute("id").split("-")[1];
			image.setAttribute("id", `recipe-url-${id}`);
		}
	});
	formdata.append("recipe",document.getElementById("recipe_container").outerHTML)
	var tags = document.getElementById("article_tag").value
	if(tags.trim()!==""){
		var tagsList=tags.replace(/,[\s]*,/g,",").split(",");
		var last =tagsList.pop()
		if(last!='') tagsList +=[last]
		formdata.append("tags",tagsList)
	}



	const response = await fetch(
		`${BACKEND_BASE_URL}/articles/${articleId}/`,
		{
		headers: {Authorization: `Bearer ${token}`},
		body: formdata,
		method: "PUT"
		}
	);
		if (response.status == 200) {
			alert("글 수정 완료!");
			location.href=`${FRONT_BASE_URL}/articles/article_detail.html?article_id=${articleId}`;
		} else {
			alert("글 수정 실패!");
			
		}
	}

const deleteOnUpdate=(id,recipeIngredientId,event)=>{
	deleteIngredientDiv(id,event)
	updateOrDelete[recipeIngredientId]=true
	event.preventDefault()
}