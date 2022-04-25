// https://api.genius.com/oauth/authorize?3dsveaj6y0Xbd73-VBSnSOXD9PqTRvNq2ET08SAiAKlW74M0OETE_udGR9hupcdE&
// client_id = YOUR_CLIENT_ID&
// redirect_uri = YOUR_REDIRECT_URI&
// scope = REQUESTED_SCOPE&
// state = SOME_STATE_VALUE&
// response_type = code



// const main = document.querySelector('main')

fetch('https://tribe.api.fdnd.nl/v1/list')
    .then((apiData) => apiData.json())
    .then((jsonData) => {

        const data = jsonData.data

        main.innerHTML = data
            .filter((member) => filterOnLength(member, 8))
            .map(renderMember)
            .reduce((current, previous) => previous + '\r\n' + current)
    })

// function filterOnLength(member, length) {
//     return member.memberName.length > length
// }

// function renderMember(member) {
//     return `
// <article>
// <h1>${member.memberName} ${member.memberSurname}</h1>
// <p>${member.tribeName}</p>
// </article>`
// }




