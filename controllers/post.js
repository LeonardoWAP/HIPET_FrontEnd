import { listPosts, findPostById, createPost, createReport, findPostByUserId, findUserById, listPostsByAnimalType } from '../diplomatic/https_client.js'
import { buildPost, formatText, showLoading, hideLoading, reportFailed, reportSucceeded, reportConfirmation, reportWithoutReason } from '../utilities/utilities.js'

export function imgCorreta(){
  let preview= document.querySelector("#preview") 
  preview.enable
}

export function renderPosts(){

    let cardContainer = document.getElementById("card-container")
    showLoading(cardContainer)

    let data = listPosts()
    data.then(data =>{
        
        if(data['status'] == "SUCCESS"){

            hideLoading() 
            cardContainer.innerHTML = "";

            let posts = data['posts'] 
            console.log(posts)

            for (let  i = 0; i < posts.length; i++){
                let post = buildPost(posts[i])           
                cardContainer.innerHTML += post;
            }
            
        }else{
            console.log(data)
        }
    })
}

export function filterByAnimalType(otherButton, animalType){

    let cardContainer = document.getElementById("card-container");
    let thisAriaPressed = this.getAttribute('aria-pressed');
    showLoading(cardContainer)


    if (thisAriaPressed === 'false') {

        this.style.backgroundColor = '#eb7b86';
        this.style.backgroundColor = '#eb7b86';
        this.setAttribute('aria-pressed', 'true');
        otherButton.setAttribute('aria-pressed', 'false');
        otherButton.style.backgroundColor = 'white';

        let data = listPostsByAnimalType(animalType)

        data.then(data =>{

            if(data['status'] == "SUCCESS"){
                hideLoading()

                let posts = data['posts']
                
                cardContainer.innerHTML = "";
                    
                for (let  i = 0; i < posts.length; i++){

                    let post = buildPost(posts[i])
                    cardContainer.innerHTML += post;
                    
                }
                
            }else{
                console.log(data)
            }
        })

    } else {
        this.setAttribute('aria-pressed', 'false');
        this.style.backgroundColor = 'white';

        renderAnimalCards()
    }
}

export function getPostDetails(){

    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('postId');

    let data = findPostById(postId)

    let post_header = document.getElementById("post-details-card-info-header")
    let post_footer = document.getElementById("post-details-user-footer-user")

    let post_tags = document.getElementById("post-details-card-info-tags")
    let post_details = document.getElementById("post-details-card-info-resume")
    let post_img = document.getElementById("post-details-card-img")

    data.then(data =>{

        if(data['status'] == "SUCCESS"){

            let post = data['post'];
            let animalName = post.animal.name
            let animalSex = formatText(post.animal.sex)
            let animalAge = (post.animal.age != undefined) ? post.animal.age : "?"   
            let animalState = post.state
            let picture = post.picture
            let nickname = post.user.nickname
            let userImg = ( post.user.picture != undefined) ? `data:image/png;base64,${post.user.picture}` : "../../src/user.svg"

           post_img.style.backgroundImage = `url('data:image/png;base64,${picture}')`;

           post_footer.innerHTML = `<a class="post-details-footer-user-information" 
                                            href="../user/user_perfil.html?userId=${post.user.id}"> 
                                        
                                            <img id="user-img" src=${userImg}>
                                            <p class="title" id="user-nickname">${nickname}</p>
                                                                        
                                    </a>`


            post_header.innerHTML = `<h1 class="title animalName"> ${animalName}</h1>
                                    <p class="post-details-subtitle animalInfo"> ${animalSex}, ${animalAge} anos </p>
                                    <img src="../../src/maps-and-flags.svg">
                                    <p class="animalState post-localization"> ${animalState} </p>`;

            post_details.innerHTML +=  `<div class="subtitle post-details-text-about"> 
                                            <p >${post.description}</p>
                                        </div> `


            let animalColor = post.animal.color
            let animalCastreated = post.animal.health_info.castreated
            let animalVacinneted = post.animal.health_info.vaccinated
            let animalSpacialCare = post.animal.health_info.special_care
            let animalSize = post.animal.size

            post_tags.innerHTML += `<div class="animal-tag animal-color"> 
                                    <img src="../../src/icon-color.svg"> 
                                    <p>${formatText(animalColor)}</p>
                                    </div>`;

            post_tags.innerHTML += `<div class="animal-tag animal-size"> 
                                        <img src="../../src/icon-size.svg"> 
                                        <p>${formatText(animalSize)}</p>
                                    </div>`;

            if(animalSpacialCare) {
                post_tags.innerHTML += `<div class="animal-tag animal-health"> 
                                        <img src="../../src/icon-health.svg"> 
                                        <p>Requer cuiodados especiais</p>
                                    </div>`
            }

            if(animalVacinneted){
                post_tags.innerHTML += ` <div class="animal-tag animal-vaccine"> 
                                            <img src="../../src/icon-vaccine.svg"> 
                                            <p>Vacinado</p>
                                        </div>`;
            }

            if (animalCastreated) {
                post_tags.innerHTML += ` <div class="animal-tag animal-castrated"> 
                                            <img src="../../src/icon-castrated.svg"> 
                                            <p>Castrado</p>
                                        </div>`;
            }

        }else{
            console.log(data)
        }
    })
}

export function reportPost(){

    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('postId');

    const reason = document.getElementById("report-reason").value;
    const mensagem = document.getElementById("report-mensagem").value;
    const modalError = document.getElementById("report-modal-reason-error");
    const reportModal = document.getElementById("report-modal-info");
    const modalContent = document.getElementById("report-modal");

    const reportRequest = {
        "post_id": postId, 
        "reason": reason,
        "description": mensagem
    }

    if(reportRequest.reason == "Selecione"){
        modalError.innerHTML = reportWithoutReason;
    }else{

        reportModal.innerHTML = reportConfirmation; 

        const createReportButton = document.getElementById('createReport');


        createReportButton.addEventListener('click', () => {

            let data = createReport(reportRequest);
            showLoading(createReportButton)

            data.then(data => {
                if(data['status'] == "SUCCESS"){
                    hideLoading()
                    
                    reportModal.innerHTML = reportSucceeded;
                    modalContent.style.backgroundColor = "#D6F9C8";
                    
                }else{
                    console.log(data)
                    reportModal.innerHTML = reportFailed;
                }
            })
        });

    }
}

export function createNewPost(){

    let animalTypeDog = document.getElementById("checkAnimalTypeDog").firstElementChild.checked ;
    let animalSexFemea = document.getElementById("checkAnimalSexFemea").firstElementChild.checked ;
    let animalName = document.getElementById("animalName").firstElementChild.value;
    let animalAge = document.getElementById("animalAge").firstElementChild.value;
    let animalColor = document.getElementById("animalColor").firstElementChild.value;
    let animalSize = document.getElementById("animalSize").firstElementChild.value;
    let castreated = document.getElementById("checkbox-info-castreated").firstElementChild.checked;
    let vacinnated = document.getElementById("checkbox-info-vacinnated").firstElementChild.checked ;
    let spacialCare = document.getElementById("checkbox-info-spacial-care").firstElementChild.checked ;

    let about = document.getElementById("aboutAnimal").firstElementChild.value;
    let state = document.getElementById("state").firstElementChild.value;

    let userId = localStorage.getItem('user-id')

    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
        const base64Image = reader.result.split(',')[1];
    
        let postRequest = {
            "customer_id": userId, 
            "state": state,
            "description": about,
            "picture": base64Image,
            "animal": {
                "name": animalName,
                "color": animalColor,
                "size": animalSize,
                "age" : animalAge,
                "type": (animalTypeDog  ? "CACHORRO" : "GATO"),
                "sex": (animalSexFemea  ? "FEMEA" : "MACHO"),
                "share_url": "",
                "health_info": {
                    "vaccinated": vacinnated,
                    "castreated": castreated,
                    "special_care": spacialCare
                }
            }
        }

        let data = createPost(postRequest)

        data.then(data =>{
    
            if(data['status'] == "SUCCESS"){
    
                let divPopUp = document.querySelector('.modal-content')
                divPopUp.innerHTML = `
                            <div class="modal-header">
                                <h5 class="modal-title" id="popUpCadastroLabel">Post Criado com Sucesso!</h5>
                                <button 
                                    type="button" 
                                    class="btn-close" 
                                    data-bs-dismiss="modal" 
                                    aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                Seu post foi publicado, clique no botão abaixo para visualizá-lo :)
                            </div>
                            <div class="modal-footer">
                                
                           <a href='post_details.html?postId=${data['post'].id}' > <button type="button" class="modal-button-purple" data-bs-dismiss="modal">Visualizar Post</button>
                           </a>
                        </div>`
            }else{            
                var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
                popoverTriggerList.map(function (popoverTriggerEl) {
                    return new bootstrap.Popover(popoverTriggerEl)
            })}})
}}

export function getUserPosts(){

    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('userId');

    let data = findPostByUserId(userId);
    let cardContainer = document.getElementById("card-container")

    data.then(data => {
        if(data['status'] == "SUCCESS"){
            let posts = data['posts'] 
            
            for (let  i = 0; i < posts.length; i++){
       
                let post = buildPost(posts[i])           
                cardContainer.innerHTML += post;
            }
            
        }else{
            console.log(data)
        }
    })


}
