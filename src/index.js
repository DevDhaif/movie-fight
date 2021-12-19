const autoCompleteConfig = {
  renderOption(movie) {
    const imgSrc = movie.Poster === "N/A" ? "" : movie.Poster;
    return `
    <img src="${imgSrc}" class='w-10 h-12' />
    <p >${movie.Title} </p>
    <p >${movie.Year} </p>
    `;
  },

  inputValue(movie) {
    return movie.Title;
  },
  async fetchData(sreachTerm) {
    const resp = await axios.get("http://www.omdbapi.com/", {
      params: {
        apikey: "3182a1da",
        s: sreachTerm,
      },
    });
    if (resp.data.Error) {
      return [];
    }
    return resp.data.Search;
  },
};

CreateAutoComplete({
  ...autoCompleteConfig,
  root: document.querySelector("#left-autocomplete"),
  onOptionSelect(movie) {
    document.querySelector("#tut").classList.add("hidden");
    onMovieSelect(movie, document.querySelector("#left-summary"), "left");
  },
});
CreateAutoComplete({
  ...autoCompleteConfig,
  root: document.querySelector("#right-autocomplete"),
  onOptionSelect(movie) {
    document.querySelector("#tut").classList.add("hidden");
    onMovieSelect(movie, document.querySelector("#right-summary"), "right");
  },
});
let leftMovie;
let rightMovie;

const onMovieSelect = async (movie, summary, side) => {
  // movie.imdbID
  const resp = await axios.get("http://www.omdbapi.com/", {
    params: {
      apikey: "3182a1da",
      i: movie.imdbID,
    },
  });
  summary.innerHTML = movieTemplate(resp.data);
  if (side === "left") {
    leftMovie = resp.data;
  } else {
    rightMovie = resp.data;
  }
  if (leftMovie && rightMovie) {
    runComparison();
  }
};
const runComparison = () => {
  const leftStats = document.querySelectorAll("#left-summary .info");
  const rightStats = document.querySelectorAll("#right-summary .info");

  leftStats.forEach((leftStat, index) => {
    const rightStat = rightStats[index];
    const leftSideValue = parseInt(leftStat.dataset.value);
    const rightSideValue = parseInt(rightStat.dataset.value);

    if (rightSideValue > leftSideValue) {
      leftStat.classList.add("bg-yellow-300");
      
      leftStat.classList.add("text-gray-600");
      
    } else {
      rightStat.classList.add("bg-yellow-300");
      rightStat.classList.add("text-gray-600");
    }
  });
};
const movieTemplate = (movieDetail) => {
  const dollars = parseInt(
    movieDetail.BoxOffice.replace(/\$/g, "").replace(/,/g, "")
  );
  const metaScore = parseInt(movieDetail.Metascore);
  const imdbRating = parseFloat(movieDetail.imdbRating);
  const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g, ""));

  const awards = movieDetail.Awards.split(" ").reduce((prev, word) => {
    const value = parseInt(word);
    if (isNaN(value)) {
      return prev;
    } else {
      return prev + value;
    }
  }, 0);
  return `
    <article class="my-2 w-full flex space-x-2">
    <figure >
      <p>
        <img class="h-56 w-56 rounded-md shadow-md shadow-black/70"  src="${movieDetail.Poster}" />
      </p>
    </figure>
  
    <div >
      <div class="flex flex-col  w-full py-2  justify-between  h-full">
        <h1 class="text-4xl font-semibold">${movieDetail.Title}</h1>
        <h4 class="text-xl font-semibold">${movieDetail.Genre}</h4>
        <p class="text-gray-700 max-w-2xl">
        ${movieDetail.Plot}
        </p>
      </div>
    </div>
  </article>
  <article data-value=${awards} class="info h-full mt-3">
      <p class=" text-2xl">${movieDetail.Awards}</p>
      <p class=" font-semibold">Awards</p>
    </article>

    <article data-value=${dollars} class="info ">
      <p class=" text-2xl">${movieDetail.BoxOffice}</p>
      <p class=" font-semibold">Boxoffice</p>
    </article>
    <article data-value=${metaScore} class="info ">
      <p class=" text-2xl">${movieDetail.Metascore}</p>
      <p class=" font-semibold">Metascore</p>
    </article>

    <article data-value=${imdbRating} class="info">
      <p class=" text-2xl">${movieDetail.imdbRating}</p>
      <p class=" font-semibold">IMDB Rating</p>
    </article>

    <article data-value=${imdbVotes} class="info">
      <p class=" text-2xl">${movieDetail.imdbVotes}</p>
      <p class=" font-semibold">IMDB Votes</p>
    </article>
    `;
};
