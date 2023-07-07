let ingredientNumber = 1;
let recipeNumber = 1;
async function validateInputs(){
	var flag= true
	var alertMsg=""
	const all_inputs = document.querySelectorAll('input[type="text"]')
	for(var i = 0; i< all_inputs.length;i++){
		all_inputs[i].classList.remove('border-danger')
		if(all_inputs[i].value == null || all_inputs[i].value.trim()==""){
			if (all_inputs[i] ==document.getElementById("article_tag")) continue;
			flag=false
			all_inputs[i].classList.add('border-danger')
		}
	}
	const all_textareas = document.querySelectorAll('textarea')
	for(var i = 0; i< all_textareas.length;i++){
		all_textareas[i].classList.remove('border-danger')
		if(all_textareas[i].value == null || all_textareas[i].value.trim()==""){
			flag=false
			all_textareas[i].classList.add('border-danger')
		}
	}
	const all_amounts = document.getElementsByName('ingredient-amount')
	for(var i = 0; i< all_amounts.length;i++){
		all_amounts[i].classList.remove('border-danger')
		if(all_amounts[i].value == null || all_amounts[i].value<=0){
			flag=false
			all_amounts[i].classList.add('border-danger')
		}
	}
	if(!flag) alertMsg += "1.태그를 제외한 입력칸 중 빈칸이 있거나 수량에 0보다 작거나 같은 수가 입력되었습니다.\n"
	const select = document.getElementById("category")
	select.classList.remove('border-danger')
	if(!select.value) {
		flag=false
		alertMsg += `${alertMsg==""?1:2}.카테고리를 선택해주세요.`
	
	}
	return alertMsg

}
async function arrangeRecipeAndUpload(post=true){
	var recipe_elements = document.getElementsByName("recipe-element")
	for(let i = 0 ; i < recipe_elements.length ; i ++){
		const first_label= recipe_elements[i].firstElementChild
		first_label.innerText = `레시피${i+1}`
		first_label.setAttribute("for",`recipe-${i+1}-textarea`)
		const recipeText=first_label.nextElementSibling
		recipeText.setAttribute("id",`recipe-${i+1}-textarea`)
		recipeText.setAttribute("name",`recipe-${i+1}-textarea`)
		recipeText.innerText=recipeText.value
		const imageLabel = recipeText.nextElementSibling
		imageLabel.setAttribute("for",`recipe-image-${i+1}`)
		const imageInput= imageLabel.nextElementSibling
		imageInput.setAttribute("onchange",`setRecipeThumbnail(${i+1},event);`)
		imageInput.setAttribute("id",`ecipe-image-${i+1}`)
		imageInput.setAttribute("name",`ecipe-image-${i+1}`)
		const recipeImageContainer = imageInput.nextElementSibling
		recipeImageContainer.setAttribute("id",`recipe-image-${i+1}-container`)
		recipeImageContainer.setAttribute("class",`recipe-image-${i+1}-container recipe-image-container`)
		if(post){
			
			let recipeImage = imageInput.files[0];
			console.log(recipeImage)
			if(recipeImage){
				if(recipeImageContainer) recipeImageContainer.innerHTML=``
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
				let recipeImageUrl = document.createElement("img");
				recipeImageUrl.setAttribute("src", realFileURL);
				recipeImageUrl.setAttribute("id", `recipe-url-${i+1}`);
				recipeImageUrl.setAttribute("class","img-thumbnail img-fluid")
				recipeImageUrl.setAttribute("style","max-height: 150px;")
				recipeImageContainer.appendChild(recipeImageUrl);
			}
		}else{
			const imageElement=recipeImageContainer.firstElementChild
			if(imageElement){
				
				if(imageElement.getAttribute("id").includes("thumbnail")) imageElement.setAttribute("id", `recipe-${i+1}-thumbnail`);
				if(imageElement.getAttribute("id").includes("url")) imageElement.setAttribute("id", `recipe-url-${i+1}`);

			}
		}
		
	}
}
const setCategory = async () => {
	const categories = await getCategory();
	const select = document.querySelector(".category");
	categories.forEach((category) => {
		const option = document.createElement("option");
		option.setAttribute("value", `${category.id}`);
		option.innerText = `${category.name}`;
		select.appendChild(option);
	});
};
const handleAddIngredient = () => {
	const ingredientContainer = document.getElementById("ingredient_container");

	const div = document.createElement("div");
	div.setAttribute("id", `ingredient-${ingredientNumber}`);
	div.classList.add("mb-3");
	div.innerHTML = `
	<div class="d-flex justify-content-between align-items-center">
	재료 제목<button class="btn btn-danger" id="delete-ingredient-${ingredientNumber}" onclick="deleteIngredientDiv(${ingredientNumber},event)">재료 삭제하기</button></div>
	<input type="text" class="form-control" id="ingredient-title-${ingredientNumber}" name="ingredient-title" placeholder="재료 제목을 입력하세요">
	<label for="ingredient-amount-${ingredientNumber}" class="form-label">수량</label>
	<input type="number" class="form-control" id="ingredient-amount-${ingredientNumber}" name="ingredient-amount" placeholder="수량을 입력하세요">
	<label for="ingredient-unit-${ingredientNumber}" class="form-label">단위</label>
	`;
	const unitSelect=document.createElement("select")
	unitSelect.setAttribute("class"," form-select")
	unitSelect.innerHTML+=`<option value="">사용자 지정</option><option value="개">개</option><option value="알">알</option><option value="약간">약간</option><option value="꼬집">꼬집</option><option value="큰술">큰술</option><option value="작은술">작은술</option><option value="ml">ml</option><option value="l">l</option><option value="g">g</option><option value="kg">kg</option><option value="cc">cc</option><option value="oz">oz</option><option value="컵(200ml)">컵</option>`
	unitSelect.setAttribute("id",`select${ingredientNumber}`)
	unitSelect.setAttribute("onchange",`valuePropagate(${ingredientNumber})`)
	const unitBox = document.createElement("div")
	unitBox.setAttribute("class","input-group")
	unitBox.appendChild(unitSelect)
	unitBox.innerHTML+=`
	<input type="text" class="form-control" id="ingredient-unit-${ingredientNumber}" name="ingredient-unit" placeholder="단위를 입력하세요">`
	div.appendChild(unitBox)
	div.innerHTML+=``
	


	ingredientContainer.appendChild(div);
	ingredientNumber++;

};
const handleAddRecipe = () => {
	const recipeContainer = document.getElementById("recipe_container");

	const div = document.createElement("div");
	div.classList.add("mb-3");
	div.setAttribute("id", `recipe-${recipeNumber}`);
	div.setAttribute("name", "recipe-element")
	div.innerHTML = `
	<label for="recipe-${recipeNumber}-textarea" class="form-label">레시피 ${recipeNumber}</label>
	<textarea class="form-control recipe-textarea" id="recipe-${recipeNumber}-textarea" name="recipe-${recipeNumber}-textarea" rows="3"></textarea>
	<label for="recipe-image-${recipeNumber}" class="form-label">이미지</label>
	<input type="file" onchange="setRecipeThumbnail(${recipeNumber},event);" class="form-control recipe-file" id="recipe-image-${recipeNumber}" name="recipe-image-${recipeNumber}" accept="image/*">
	<div id="recipe-image-${recipeNumber}-container" class="recipe-image-${recipeNumber}-container recipe-image-container"></div>
	<button class="btn btn-primary" id="delete-recipe-div" onclick="deleteRecipeDiv(${recipeNumber},event)">레시피 삭제하기</button>
	`;
	recipeContainer.appendChild(div);
	recipeNumber++;
};
async function postArticle() {
	const uploadBtn = document.getElementById("submit-article");
	uploadBtn.innerText = "";
	const span = document.createElement("span");
	span.setAttribute("id", "spinner-span");
	span.setAttribute("class", "spinner-border spinner-border-sm");
	span.setAttribute("role", "status");
	span.setAttribute("aria-hidden", "true");
	uploadBtn.appendChild(span);
	await checkTokenExp();
	const token = localStorage.getItem("access");
	const title = document.getElementById("article_title").value;
	const content = document.getElementById("article_content").value;
	const tags = document.getElementById("article_tag").value;
	const file = document.getElementById("article_image").files[0];
	const recipeContainer = document.getElementById("recipe_container");
	
	const alertMsg= await validateInputs();
	if (alertMsg !=""){
		alert(alertMsg)
		uploadBtn.innerHTML = "";
		uploadBtn.innerText = "게시글 작성하기"
		return 0
	}
	await arrangeRecipeAndUpload()
	var recipe_html=recipeContainer.outerHTML
	const category = document.getElementById("category");
	const categoryValue = category.options[category.selectedIndex].value;
	var data = {title: title,
		content: content,
		recipe:recipe_html,
		category: categoryValue
	}
	if(tags.trim()!==""){
		var tagsList=tags.trim().replace(/,[\s]*,/g,",").replace(/^,/g,"").replace(/,$/g,"").split(",");
		data["tags"]=tagsList
	}
	if (file) {
		const responseURL = await fetch(`${BACKEND_BASE_URL}/articles/get-url/`, {
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

		data["image"]=realFileURL;
	}
		const response = await fetch(`${BACKEND_BASE_URL}/articles/`, {
			headers: await getHeader(),
			body: JSON.stringify(data),
			method: "POST"
		});
		if (response.status === 200) {
			const articleResponse = await response.json();

			for (let i = 1; i < ingredientNumber+1; i++) {
				let ingredientTitle = document.getElementById(`ingredient-title-${i}`);

				if (!ingredientTitle) continue;
				let ingredientQuantity = document.getElementById(
					`ingredient-amount-${i}`
				).value;
				let ingredientUnit = document.getElementById(
					`ingredient-unit-${i}`
				).value;
				const ingredientResponse = await fetch(
					`${BACKEND_BASE_URL}/articles/${articleResponse.id}/recipeingredient/`,
					{
						headers: await getHeader(),
						body: JSON.stringify({
							ingredient: ingredientTitle.value,
							ingredient_quantity: ingredientQuantity,
							ingredient_unit: ingredientUnit
						}),
						method: "POST"
					}
				);


			}
			window.location.replace(
				`${FRONT_BASE_URL}/articles/article_detail.html?article_id=${articleResponse.id}`
			);
		} else {
			alert("작성 실패!");

			uploadBtn.innerHTML = "";
			uploadBtn.innerText = "게시글 작성하기"
		}
	
		
}

const deleteRecipeDiv = async(id, event) => {
	const recipeDiv = document.getElementById(`recipe-${id}`);
	recipeDiv.remove();
	await arrangeRecipeAndUpload(post=false);

	recipeNumber--;

	event.preventDefault();
};
const deleteIngredientDiv = (id, event) => {
	const ingredientDiv = document.getElementById(`ingredient-${id}`);
	ingredientDiv.remove();
	event.preventDefault();
};
async function valuePropagate(ingredientNum){
	const selectValue=document.getElementById(`select${ingredientNum}`).value
	document.getElementById(`ingredient-unit-${ingredientNum}`).value=selectValue
}
async function loaderFunction() {
	checkNotLogin();
	// forceLogout();
	await setCategory();
	const addIngredientButton = document.getElementById("add-ingredient");
	addIngredientButton.addEventListener("click", () => {
		handleAddIngredient();
	});
	const addRecipeButton = document.getElementById("add-recipe");
	addRecipeButton.addEventListener("click", () => {
		handleAddRecipe();
	});
	const submitArticleButton = document.getElementById("submit-article");
	if(submitArticleButton){submitArticleButton.addEventListener("click", (event) => {
		postArticle();
		event.preventDefault();
	});}
};
