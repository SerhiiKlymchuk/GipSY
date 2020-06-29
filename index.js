const search = {
	searchBtn: document.getElementById('search-btn'),
	trendingSection: document.getElementById("trending-inner"),
	latestSection:  document.getElementById("latest-inner"),
	searchStr: document.getElementById("search"),
	trendingHeader: document.getElementById("trending-header"),

	getDataAPI:{
		APIKey: "o8zxUc45btY9GLMFiBL9XmUopqSVag2y",
		trendingURL: "",
		randomURL:  "",
		searchURL: "",

		setURL: function(){
			this.trendingURL = `https://api.giphy.com/v1/gifs/trending?api_key=${this.APIKey}&limit=24`;
			this.randomURL = `https://api.giphy.com/v1/gifs/random?api_key=${this.APIKey}`;
		}
	},

	getDataGifs: function(tmpUrl, section, startPointGifs){
		fetch(tmpUrl)
	 	.then(response=>response.json())
	 	.then(content=>{
			section.innerHTML = "";

			let contentLength = content.data.length;
			if(startPointGifs == 0) contentLength=12;

	 		for(let i = startPointGifs ; i<contentLength ; i++){

				//creating new HTML elements
				let divGif = document.createElement("div");
				let img = document.createElement("img");
				let pCaption = document.createElement("p");

				//adding classes
				divGif.classList.add("trending-item");
				img.classList.add("item-gif");
				pCaption.classList.add("item-caption");
			
				//filling elements
				let gifCaption = content.data[i].title;
			
				if(gifCaption.endsWith("GIF")){
					gifCaption = gifCaption.slice(0, -3);
				}
				img.src = content.data[i].images.downsized.url;
				pCaption.textContent =gifCaption ;
				img.alt = gifCaption;

				//form structure of new element
				divGif.appendChild(img);
				divGif.appendChild(pCaption);

				//add to page
				section.appendChild(divGif);
			}
	 	})
		.catch(err=>{
	 		console.error(err);
	 	})
	},

	showFullScreenGif: function(){
		let itemsGIF = document.getElementsByClassName('trending-item');

		for(let i = 0 ; i < itemsGIF.length; i++){
			itemsGIF[i].addEventListener('dblclick', function(){
				//createElements
				let divGif = document.createElement('div');
				let img = document.createElement('img');
				let pCaption = document.createElement('p');

				//add classes 
				divGif.classList.add('chosen-gif');
				divGif.setAttribute('id', 'full-screen-el');
				img.classList.add('item-gif');
				pCaption.classList.add('item-caption');

				//fill with data
				img.src = itemsGIF[i].firstChild.currentSrc;

				//slice gif text if need
				let gifCaption = itemsGIF[i].firstChild.alt;
				
				if(gifCaption.endsWith("GIF")){
					gifCaption = gifCaption.slice(0, -3);
				}

				img.alt = gifCaption ;
				pCaption.textContent = gifCaption;

				//from structure of new element
				divGif.appendChild(img);
				divGif.appendChild(pCaption);

				let check = true;
				const body= document.querySelector('body');

				//add new-el to page
				body.insertAdjacentElement('afterend',divGif);

				//blur background behind new element
				body.style.opacity ='.4';
				body.style.filter = 'blur(3px)';
				body.style.overflow = 'hidden';

				setTimeout(()=>{
					divGif.style.opacity = '1';
				}, 100)

				//if element is added then you can delete it
				if(check){
					body.addEventListener('click',()=>{
						check=false;
						let delElement = document.getElementById('full-screen-el');
						if(delElement){
							//hide and delete new element
							setTimeout(()=>{
								delElement.parentNode.removeChild(delElement);
							}, 3000)

							divGif.style.opacity = '0';
							
							//return default values of page
							body.style.opacity ='1';
							body.style.filter = 'blur(0px)';
							body.style.overflow = 'auto';
						}
					})
				}
			})
		}
	}, 

	onSearchBtnClick: function(){
		//generating url request
		let url= `https://api.giphy.com/v1/gifs/search?api_key=${this.getDataAPI.APIKey}&limit=12&q=`;
		if(this.searchStr.value!="") {
		
			
		
			document.getElementById("latest").style.display = 'none';
			this.trendingHeader.textContent="Results: ";

			url = url.concat(this.searchStr.value.trim());
			this.searchStr.value="";
		
			//getting results
			this.getDataGifs(url, this.trendingSection, 0);

			setTimeout(()=>{
				this.showFullScreenGif();
			},3000);
		}
	}


};

//create url for request
search.getDataAPI.setURL();

//filling page with gifs
search.getDataGifs(search.getDataAPI.trendingURL, search.trendingSection, 0);
search.getDataGifs(search.getDataAPI.trendingURL, search.latestSection, 12);

//see results pressing 'Enter'
search.searchStr.addEventListener("keydown", function(e){
	if(e.key === "Enter"){
		e.preventDefault();
		search.onSearchBtnClick();
	}
})

//see results clicking on btn
search.searchBtn.addEventListener("click" , e=>{
	e.preventDefault();
	search.onSearchBtnClick();
})

//wait 3s to download gifs data
setTimeout(()=>{
	search.showFullScreenGif();
},3000);

