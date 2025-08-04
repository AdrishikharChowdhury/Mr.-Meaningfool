const BASE_URL=`https://api.dictionaryapi.dev/api/v2/entries/en/`;
let word=document.querySelector("#word");
let search=document.querySelector("#search");
let phonetics=document.querySelector("#phonetics");
let meanings=document.querySelector("#meanings");
let info=document.querySelector("#info");

const pronounciation=(data)=>{
    phonetics.style.display="flex";
    phonetics.innerHTML="";
    let phoneticBox=document.createElement("div");
    let audio=document.createElement("audio");
    let phoneticText=document.createElement("p");
    let phoneticAudio=document.createElement("button");
    let phoneticHeading=document.createElement("p");
    phoneticBox.id="phonetic-box";
    phoneticHeading.id="phonetic-heading";
    phoneticText.id="phonetic-text";
    phoneticAudio.id="phonetic-audio";
    phoneticHeading.innerText="Pronounciation:";
    phoneticText.innerText=`"${word.value.toLowerCase()}"`;
    phoneticAudio.innerHTML=`<i class="fa-solid fa-volume-high"></i>`;
    audio.controls=true;
    audio.loop=false;
    audio.autoplay=false;
    audio.src=`${data.phonetics[0].audio}`;
    for(let i=0;i<data.phonetics.length;i++)
    {
        if(data.phonetics[i].audio=="")
        {
            audio.src=`${data.phonetics[i+1].audio}`;
            break;
        }
        else{
            break;
        }
    }
    phoneticBox.append(phoneticText,phoneticAudio)
    phonetics.append(phoneticHeading,phoneticBox)
    phoneticAudio.addEventListener("click",()=>{
        audio.play();
    })
    console.log(data.phonetics);
}

const definitionfunc=(definitions,meaningBox)=>{
    for (let definition of definitions)
    {
        let definitionBox=document.createElement("div");
        let defText=document.createElement("p");
        let defExample=document.createElement("p");
        definitionBox.className="definition-box";
        defText.className="def-text";
        defExample.className="def-example";
        defText.innerText=`${definition.definition}`
        definitionBox.append(defText)
        if(definition.example)
        {
            defExample.innerText=`Example: ${definition.example}`;
            definitionBox.append(defExample)
        }
        meaningBox.append(definitionBox);
    }
}

const boxfunc=(data,heading)=>{
    let box=document.createElement("div");
    box.innerHTML="";
    let boxText=document.createElement("p");
    let boxHeading=document.createElement("p");
    box.className="box";
    boxHeading.className="box-heading";
    boxText.className="box-text";
    boxHeading.innerText=`${heading}`;
    data.slice(0,10);
    let text=data.join(", ");
    boxText.innerText=text.replace(/,+\s*$/, "");
    box.append(boxHeading,boxText);
    return box;
}

const meaning=(meaningList)=>{
    meanings.style.display="flex";
    meanings.innerHTML="";
    let meaningHeading=document.createElement("p");
    meaningHeading.id="meaning-heading";
    meaningHeading.innerText="Meaning:";
    meanings.append(meaningHeading)
    for(let meaning of meaningList)
    {
        let meaningBox=document.createElement("div");
        let meaningPOP=document.createElement("p");
        meaningPOP.className="meaning-pop";
        meaningBox.className="meaning-box";
        meaningPOP.innerText=`${meaning.partOfSpeech}`;
        meaningBox.append(meaningPOP);
        definitionfunc(meaning.definitions,meaningBox);
        meanings.append(meaningBox);
        if(meaning.antonyms!="")
        {
            let box=boxfunc(meaning.antonyms,"Antonyms: ")
            meanings.append(box);
        }
        if(meaning.synonyms!="")
        {
            let box=boxfunc(meaning.synonyms,"Synonyms: ")
            meanings.append(box);
        }
    }
}

const wordMeaning = async (e) => {
    if (!word.value.trim()) {
    info.innerHTML = "Please enter a word.";
    return;
    }
    try {
    info.style.backgroundImage = "";
    info.style.width = "";
    info.style.height="";
    let response = await fetch(`${BASE_URL}${word.value}`);
    let data = await response.json();
    if (response.ok && Array.isArray(data)) {
        pronounciation(data[0]);
        meaning(data[0].meanings);
    } else {
        throw new Error(data.title || "Word not found");
    }
    } catch (error) {
    phonetics.innerHTML="";
    meanings.innerHTML="";
    info.style.backgroundImage = `url(./assets/images/20064239_6199763.svg)`;
    info.style.height = "20rem";
    info.style.width = "100%";
    }
};


search.addEventListener("click", wordMeaning);

document.addEventListener("keydown",(event)=>{
    if(event.key==="Enter")
    {
        wordMeaning(event);
    }
    else{
        return;
    }
})

if (window.location.hostname === "adrishikharchowdhury.github.io") {
    const baseTag = document.createElement("base");
    baseTag.href = "Mr.-Meaningfool/";
    document.head.appendChild(baseTag);
  }