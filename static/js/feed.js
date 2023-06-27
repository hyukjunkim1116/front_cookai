async function loadCollaviraticeRecommend(){
    const response = await getRecommend(0)
    const response_json = await response.json()
    if (response.status == 200){
        console.log(response_json)
    }else{alert(response.status)}
}
async function loadContentRecommend(){
    const response = await getRecommend(1)
    const response_json = await response.json()
    if (response.status == 200){
        console.log(response_json)
    }else{alert(response.status)}
}


window.onload = async function () {
	await loadCollaviraticeRecommend();
	await loadContentRecommend();
    const goback= document.getElementById("goback")
    goback.setAttribute("onclick",`location.href="${FRONT_BASE_URL}"`)
};
