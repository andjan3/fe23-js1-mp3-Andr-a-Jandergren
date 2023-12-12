/////////////////////////////////////////////////////////////
// Andréa Jandergren, FE23. Miniprojekt 3 - Rest Countries //
////////////////////////////////////////////////////////////


//Selektorer

const form = document.querySelector("form");
const log = document.querySelector("#log");
const container = document.querySelector(".container");

////////////////
//Eventlistner// 
////////////////

/* Beskrivning av min eventlistner:
  -Hämtar användares val(språk eller land) samt fritext. 
  -Återställer arrayen för varje ny sökning. 
  -Testar vilket val användaren gjort och anropar rätt funktion för att visa länderna kopplat till valet
  -Lägger till den fritext användaren angivit i arrayen och visar de länder som berörs
  -Rensar fritexten efter varje sökning
*/
form.addEventListener("submit", (event) => {
    event.preventDefault();
    const searchQuery = document.querySelector("#site-search").value;
    const selectedOption = document.querySelector('input[name="radioButton"]:checked').value;
    
    if (selectedOption === "lang") {
        displayCountry(selectedOption, searchQuery);
    }

    else if(selectedOption === "name"){
        displayCountry(selectedOption, searchQuery);

    } 

    const clearUserInput = document.querySelector('#site-search');
    clearUserInput.value = ""; 
    
});

////////////////
// Funktioner //
///////////////

// Jämförelsefunktion för att sortera objekt i fallande ordning baserat på population
 function SortByPopulation(a, b){
    if(a.population>b.population){
        return -1;
    }
    else if(a.population<b.population){
        return 1;
    }

    else {
        return 0;
    }
} 

// Funktion som loopar igenom varje land eller språk baserat på användarens val.
// Användarens val skickas som förfrågan till API:et för att hämta information om varje land eller språk.
function displayCountry(selectedOption, searchQuery) {
    const divContainer = document.querySelector('.container');
        divContainer.innerHTML = ''; 
        const url = `https://restcountries.com/v3.1/${selectedOption}/${searchQuery}?fields=name,flags,population,subregion,capital,lang`;

// Hanterar fel baserat på Fetch API-svar.
// Om det är en 404-error, visas ett meddelande att sidan inte kunde hittas.
// I annat fall visas ett generellt felmeddelande.
        fetch(url)
        .then(response=>{
            if(response.ok){
                return response.json();
            }
            else if(response.status === 404){
                throw 404;
                
            }
            else{ 
                throw 'error';
            }
        })
        
        //Tar emot countryObj och anropar min jämförelsefunktion som sorterar baserat på populationsmängd.
            .then(countryObj => {
                countryObj.sort(SortByPopulation);

                if (countryObj.length > 0) {
                    for (const country of countryObj) {
                        displayCountryInfo(divContainer, country);
                    }
                } else if (countryObj && countryObj[0]) {
                    displayCountryInfo(divContainer, countryObj[0]);
                }
            })
            
        // Anropar displayError-funktionen för att visa ett lämpligt felmeddelande
            .catch(error => { 
                displayError(error);
            }); 
              
             function displayError(error) {
                const h1El = document.createElement('h1');
                if(error === 404){ 
                     h1El.innerText = 'Sidan kunde inte hittas. Försök igen!';
                 }
                else{ 
                    h1El.innerText = 'Något gick fel. Försök igen!'
                }
                divContainer.append(h1El);
             }

        // Skapar nya HTML-element och hämtar specifik information från API:et
            function displayCountryInfo(divContainer, country) {
                const countryName = country.name.official;
                const flagUrl = country.flags.png;
                const population = country.population;
                const subRegion = country.subregion;
                const capital = country.capital[0];
            
                const countryContainer = document.createElement('div');
                const nameEl = document.createElement('h1');
                const populationEl = document.createElement('p');
                const subRegionEl = document.createElement('p');
                const capitalEl = document.createElement('p');
                const flagImg = document.createElement('img');
            
                nameEl.innerText = countryName;
                populationEl.innerText = `Population: ${population}`; 
                flagImg.src = flagUrl;

                if(capital === undefined || subRegion === undefined){
                    capitalEl.innerText ='Capital: none'
                    subRegionEl.innerText ='Subregion: none'
                }
                else{
                    capitalEl.innerText = `Capital: ${capital}`; 
                    subRegionEl.innerText = `Subregion: ${subRegion}`;
                }
                
                countryContainer.append(nameEl, flagImg, capitalEl, subRegionEl, populationEl);
                divContainer.append(countryContainer);
                countryContainer.classList.add('countryContainer');
            }      
     
}