//Class for  link
var count = 0;
class Link{
    constructor(link){
        this.link = link;
    }
}
//Class for local storage
class Storage{
    static getSpaces(){
        let spaces;
        if(localStorage.getItem('spaces') === null){
            spaces = [];
        } else {
            spaces = JSON.parse(localStorage.getItem('spaces'));
        }
        return spaces;
    }
    static addSpaces(space){
        const spaces = Storage.getSpaces();
        spaces.push(space);
        localStorage.setItem('spaces',JSON.stringify(spaces));
    }
    static removeSpaces(number){
    
        const spaces = Storage.getSpaces();
        spaces.forEach((space,index) => {
            
            if (space["dataKey"] == number){
                
                spaces.splice(index,1);
            }
        })
        
        localStorage.setItem('spaces',JSON.stringify(spaces));
    }
    static getCount(){
        if(localStorage.getItem('count') === null){
            
            count = 0;
            localStorage.setItem('count',count);
        } else {
            count = parseInt(localStorage.getItem('count'));
        }
    }

    static addlink(link,dataKey){
        let store = JSON.parse(localStorage.getItem('spaces'));
        let indx = 0;
        store.forEach((space,index) => {
            if (space["dataKey"] == dataKey){
                indx = index;
            }
        })
    
      
        //adding the links
        if("links" in store[indx]){
            
            store[indx]["links"].push(link);
        } else{
            console.log(store[indx]);
            store[indx]["links"] =[];
            store[indx]["links"].push(link);
        }
        localStorage.setItem('spaces',JSON.stringify(store));
        
    }

    static openlink(dataKey){
        let store = JSON.parse(localStorage.getItem('spaces'));
        let indx = 0;
        store.forEach((space,index) => {
            if (space["dataKey"] == dataKey){
                indx = index;
            }
        })
        if("links" in store[indx]){
            if(store[indx]["links"].length == 0){
                alert('no links to open');
                return;
            } else{
                //open links here
                store[indx]["links"].forEach((link)=>{
                    console.log(link);
                    chrome.tabs.create({ url: link });
                });
            }
            
            
        } else{
            alert('no links to open');
            
        }

        
    }  

    static removelink(linkAddress,dataKey){
        
        let store = JSON.parse(localStorage.getItem('spaces'));
        let indx = 0;
        let linkIndex = 0;
        store.forEach((space,index) => {
            if (space["dataKey"] == dataKey){
                indx = index;
                
                store[indx]["links"].forEach((link,linkIndx) => {
                    console.log(link);
                    if(link == linkAddress){
                        linkIndex = linkIndx;
                        console.log("found it");
                    }
                });
            }
        });
        console.log(linkIndex);
        store[indx]["links"].splice(linkIndex,1);
        localStorage.setItem('spaces',JSON.stringify(store));
    }
}
//Interacting with the UI

class UI{

    static displaySpaces(){
        const spaces = Storage.getSpaces();
        spaces.forEach((space) =>{ 
            
            UI.addWorkplaceScratch(space["dataKey"]);
            if("links" in space){
                space["links"].forEach((link) => {
                    let myLink = new Link(link);                    
                    UI.addLink(myLink,space["dataKey"]);
                }); 
            }
            if("headingContent" in space){
                UI.setHeading(space["dataKey"],space["headingContent"]);
            }
            if("descriptionContent" in space){
                UI.setDescription(space["dataKey"],space["descriptionContent"]);
            }
            
            });
        
    }
    static setHeading(dataKey,heading){
        document.getElementById(`headingContent${dataKey}`).innerHTML = `${heading}`;
    }
    static setDescription(dataKey,description){
        document.getElementById(`descriptionContent${dataKey}`).innerHTML = `${description}`;
    }
    static addLink(myLink,number){
        const link = myLink.link;
        const list = document.querySelector(`.activeWorkplaceList${number}`);
        const li = document.createElement('li');
        li.classList.add('list-group-item');
        li.innerHTML = `
         <a href ="${link}" target= "_blank">${link}</a> <br> <a href = "#" class = "text-muted" id = "remove" data-no ="${number}" > Remove </a>
        `;
        list.appendChild(li);
        
    }
    static removeLink(link){
        link.parentElement.remove();
    }
    static addWorkplaceScratch(number){
        const workspace = document.querySelector('.workspaces');
        const workplace = document.createElement('div');
        workplace.classList.add('card');
        workplace.classList.add('mb-3');
        workplace.classList.add('mt-4');
        workplace.setAttribute('data-no',`${number}`);
        workplace.setAttribute('id','activeWorkPlace');
        workplace.innerHTML = `
        <h3 class="card-header" data-no ="${number}" contenteditable="false" id = "headingContent${number}" >Enter the name of the workspace here </h3>
        
                <div class="card-body" data-no ="${number}">
                    <h5 class="card-title" data-no ="${number}" id ="descriptionContent${number}" contenteditable="false" >What's this space about?</h5>
                    <h6 class="card-subtitle text-muted" data-no ="${number}" id="open" style="cursor: pointer;"> Open </h6>
                    <h6 class="card-subtitle text-muted mt-1 " data-no ="${number}" id="expand" style="cursor: pointer;"> Click here to expand </h6>
                    
                </div>
                
                    <div class="content${number} hidden" data-no ="${number}" style = "display: none; transition: all 1s;">
                    
                    <ul class="list-group list-group-flush activeWorkplaceList${number}" data-no ="${number}">
                        
                        
                    </ul>
                    <div class="card-body" data-no ="${number}">
                        
                        <div class="form-group" data-no ="${number}">
                            
                            <input class="form-control form-control-sm mt-2" type="text" placeholder="Add your link here" data-no ="${number}" >
                            <button type="button" data-no ="${number}" class="btn btn-primary btn-sm mt-1" id ="submit" style="cursor: pointer;">Add</button>
                          </div>
                    </div>
                    <div class="card-footer text-muted" data-no ="${number}">
                    <a href = "#" data-no = "${number}" id = "delete_workspace"> Delete </a>
                    </div>
                </div>
      `;
        workspace.appendChild(workplace);
        
    }
    static addWorkplace(){
        
        count++;
        localStorage.setItem('count',count);
        
        const workspace = document.querySelector('.workspaces');
        const workplace = document.createElement('div');
        workplace.classList.add('card');
        workplace.classList.add('mb-3');
        workplace.classList.add('mt-4');
        workplace.setAttribute('data-no',`${count}`);
        workplace.setAttribute('id','activeWorkPlace');
        workplace.innerHTML = `
        <h3 class="card-header" data-no ="${count}" id = "headingContent${count}" contenteditable="false" >Enter the name of the workspace here </h3>
       
                <div class="card-body" data-no ="${count}">
                    <h5 class="card-title" data-no ="${count}" id = "descriptionContent${count}" contenteditable="false" >What's this space about?</h5>
                    <h6 class="card-subtitle text-muted" data-no ="${count}" id="open" style="cursor: pointer;"> Open </h6>
                    <h6 class="card-subtitle text-muted mt-1" data-no ="${count}" id="expand" style="cursor: pointer;">Click here to expand </h6>
                </div>
                
                    <div class="content${count} hidden" data-no ="${count}" style = "display: none; transition: all 1s;">
                    
                    <ul class="list-group list-group-flush activeWorkplaceList${count}" data-no ="${count}">
                        
                        
                    </ul>
                    <div class="card-body" data-no ="${count}">
                        
                        <div class="form-group" data-no ="${count}">
                            
                            <input class="form-control form-control-sm mt-2" type="text" placeholder="Add your link here" data-no ="${count}" >
                            <button type="button" data-no ="${count}" class="btn btn-primary btn-sm mt-1" id ="submit" style="cursor: pointer;">Add</button>
                          </div>
                    </div>
                    <div class="card-footer text-muted" data-no ="${count}">
                    <a href = "#" data-no = "${count}" id = "delete_workspace"> Delete </a>
                    </div>
                </div>
      `;
        workspace.appendChild(workplace);
        
    }

    static removeWorkplace(number){
        let workplaces = document.querySelectorAll('#activeWorkPlace');
        workplaces.forEach(workplace => {
            if(workplace.getAttribute('data-no') == number){
                workplace.remove();
                
            }
        });
        
    }
    
    
}

document.addEventListener('DOMContentLoaded',UI.displaySpaces);
Storage.getCount();
//Interacting with the submit button



document.querySelector(".workspaces").addEventListener('click', (e) =>{
    let number = e.target.getAttribute("data-no");
    
    
    let content = document.querySelector(`.content${number}`);


    if(e.target.id === 'expand' && content.classList.contains("hidden")){
         content.style.display = "block";
         e.target.innerHTML = "Click here to minimise";
         content.classList.remove("hidden");
         content.classList.add("not-hidden");
    } else if(e.target.id === 'expand' && content.classList.contains("not-hidden")){
        content.style.display = "none";
        e.target.innerHTML = "Click here to expand";
        content.classList.remove("not-hidden");
        content.classList.add("hidden");
    }

    if(e.target.id ==='submit'){
        if(e.target.previousSibling.previousSibling.value === ''){
            alert("Please enter a link");
        } else {
            const link = new Link(e.target.previousSibling.previousSibling.value);
            UI.addLink(link,number);
            console.log(number);
            if(number != 0){
            Storage.addlink(link.link,number);
            }
            e.target.previousSibling.previousSibling.value ='';
        }
    }

    if(e.target.id === 'remove'){
        UI.removeLink(e.target);
        console.log(number);
        Storage.removelink(e.target.previousSibling.previousSibling.previousSibling.previousSibling.textContent,number);
    }

    if(e.target.id === 'delete_workspace'){
        UI.removeWorkplace(number);
        
        if(number != 0){
        Storage.removeSpaces(number);
        }

      

    }
    
    if(e.target.id != `headingContent${number}`){
        let content = document.querySelector(`#headingContent${number}`);
        
        
            let store = JSON.parse(localStorage.getItem('spaces'));
            let idx = 0;
            store.forEach((space,index)=> {
                if(space["dataKey"] == number){
                    idx = index;
                }
            });
            store[idx]["headingContent"] = content.innerHTML;
            localStorage.setItem('spaces',JSON.stringify(store));
            
        
    }
    if(e.target.id === `headingContent${number}`)  {
        e.target.contentEditable = true;  
             
    }

    if(e.target.id != `descriptionContent${number}`){
        let content = document.querySelector(`#descriptionContent${number}`);
        
        
            let store = JSON.parse(localStorage.getItem('spaces'));
            let idx = 0;
            store.forEach((space,index)=>{
                if(space["dataKey"] == number){
                    idx = index;
                }
            });
            store[idx]["descriptionContent"] = content.innerHTML;
            localStorage.setItem('spaces',JSON.stringify(store));
            
        
    }
    if(e.target.id === `descriptionContent${number}`)  {
        e.target.contentEditable = true;  
             
    }

    if(e.target.id === 'open'){
        Storage.openlink(number);
    }
   
});



document.querySelector('#addButton').addEventListener('click', (e) => {
    UI.addWorkplace();
    Storage.addSpaces({
        'dataKey' : count
    });

})

document.querySelector('#save_workspace').addEventListener('click', (e) => {
    UI.addWorkplace();
    Storage.addSpaces({
        'dataKey' : count        
    });
    link = new Link('yolo');
    const list = document.querySelector('ul').childNodes
    
    for(i = 1; i < list.length ; i++){
        let str = new Link(document.querySelector('ul').childNodes[i].firstChild.nextSibling.textContent);
        UI.addLink(str,count);
        Storage.addlink(str.link,count);
    }
    
    
    
    
    
});


chrome.windows.getAll({populate:true},function(windows){
    windows.forEach(function(window){
      window.tabs.forEach(function(tab){
          link = new Link(tab.url);
          
        //collect all of the urls here
        UI.addLink(link,0);
      });
    });
  });


