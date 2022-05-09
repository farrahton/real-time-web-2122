  fetch("https://black-history-month-api.herokuapp.com/people")
  .then(function(response) {
    return response.json();
  })
  .then(function(data) {
    var facts = data[Math.floor(Math.random()*data.length)];
    
    console.log(data);
    // data[288]
    // console.log(data[288]);
    const section = document.querySelector('section')
    section.insertAdjacentHTML('beforeend', `
           <blockquote> ${facts.description} </blockquote>
            `)
  })