'use strict';

const actorsList = document.getElementById('actorsList');
const choosedList = document.querySelector('.choosedList');

const messagesClasses = new Map();

messagesClasses.set('twitter.com', 'fab fa-twitter');
messagesClasses.set('www.facebook.com', 'fab fa-facebook');
messagesClasses.set('www.instagram.com', 'fab fa-instagram');


fetch('./assets/js/data.json').then((response)=> response.json())
  .then((actors)=>{actors.map((actor)=>actorsList.append(createCard(actor)));
})
  .catch((e)=>{
    actorsList.append(createElement('h2', {classNames:['initials','cardName','error'],styleProreties:{color: 'var(--theme-color)'}}, document.createTextNode('Error. Please, try again later')))
    throw e});


function createCard(actor){
  const {id, firstName, lastName, profilePicture:url, contacts} = actor;
  const fullName = getFullName(firstName, lastName);
  const card = createElement('li', {attributes:{'data-id':id,'data-full-name':fullName},classNames:['cardWrapper'],events:{'click':clickHanler}},
    createElement('article',{classNames:['cardContainer']},
      createElement('div',{classNames:['cardImageWrapper']},
        createElement('div',{classNames:['initials'],styleProreties:{'background':stringToColour(fullName)}}, document.createTextNode(getFirstLetterInitials(fullName) || 'none')),
        createElement('img',{attributes:{'src':url},classNames:['cardImage'], events:{'error':handlerImageError}})
      ),
      createElement('h2',{classNames:['cardName']}, document.createTextNode(fullName || 'unknow')),
      createElement('div',{classNames:['messangersWrapper']},
          ...(contacts.map((href)=>
              createElement('a', {attributes:{'href':href}, classNames:findingClassByUrl(messagesClasses, href)})
              ))         
        ), 
    )
  )
  return card; 
}




/**
 * 
 * @param {string} type 
 * @param {object} options 
 * @param {object} options.attributes
 * @param {string[]} options.classNames
 * @param {object} options.events
 * @param {Node[]} children 
 * return {Node}
 */
 function createElement(type='div',{attributes={}, classNames=[], events={}, styleProreties={}}, ...children){
  const elem = document.createElement(type);
  for(const [attrName, attrValue] of Object.entries(attributes)){
    elem.setAttribute(attrName, attrValue);
  }
  for(const [eventType, eventHandler] of Object.entries(events)){
    elem.addEventListener(eventType, eventHandler);
  }
  for (const [property, value] of Object.entries(styleProreties)) {
    elem.style[property] = value;
  }
  elem.classList.add(...classNames);
  elem.append(...children);
  return elem;
}


function clickHanler({currentTarget:{dataset:{id,fullName}}}){
  const arrOfLiDataNames = [...choosedList.children].map((li)=>li.dataset.id);  
  if(!arrOfLiDataNames.includes(id,1)){
    choosedList.append(createElement('li', {attributes:{"data-id":id}}, document.createTextNode(fullName)));
  }
}

function handlerImageError({target}){  
  target.remove();
}

function getFullName(name, sname){
  return name + ' ' + sname;
}

function getFirstLetterInitials (str){  
  let newStr = '';
  for (const element of str.split(' ')) {
    newStr += element.slice(0,1).toUpperCase();
  }
  return newStr;
}
function findingClassByUrl(map, str){  
  for (const key of map.keys()) {
    if(key.includes(new URL(str).hostname)){
      return map.get(key).split(' ');      
    }    
  }  
}


function stringToColour(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let colour = '#';
  for (let i = 0; i < 3; i++) {
    let value = (hash >> (i * 8)) & 0xFF;
    colour += ('00' + value.toString(16)).substr(-2);
  }
  return colour;
}