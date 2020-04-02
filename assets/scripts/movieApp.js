// Navbar
const header = document.getElementById('header');
header.innerHTML = navbar();

// AutoComplete Function
const autoCompleteConfig = {
	renderOption(movie) {
		const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;
		return `
		<img src="${imgSrc}"/>
		${movie.Title} (${movie.Year})
	`;
	},
	inputValue(movie) {
		return movie.Title;
	},
	async fetchData(searchTerm) {
		try {
			const res = await axios.get('http://www.omdbapi.com/', {
				params: {
					apikey: '53462c4c',
					s: searchTerm,
					type: 'movie'
				}
			});
			const { Search, Error } = res.data;

			if (Error) {
				console.log(Error);
				return [];
			}

			return Search;
		} catch (err) {
			console.log('Something wrong happened', err);
		}
	}
};

// Left Movie
createAutoComplete({
	...autoCompleteConfig,
	root: document.querySelector('#autocomplete-left'),
	onOptionSelect(movie) {
		document.querySelector('.tutorial').classList.add('is-hidden');
		onMovieSelect(movie, document.querySelector('#summary-left'), 'left');
	}
});

// Right Movie
createAutoComplete({
	...autoCompleteConfig,
	root: document.querySelector('#autocomplete-right'),
	onOptionSelect(movie) {
		document.querySelector('.tutorial').classList.add('is-hidden');
		onMovieSelect(movie, document.querySelector('#summary-right'), 'right');
	}
});

let leftMovie;
let rightMovie;
const onMovieSelect = async (movie, summaryElement, side) => {
	try {
		const res = await axios.get('http://www.omdbapi.com/', {
			params: {
				apikey: '53462c4c',
				i: movie.imdbID
			}
		});

		summaryElement.innerHTML = movieTemplate(res.data);

		if (side === 'left') {
			leftMovie = res.data;
		} else {
			rightMovie = res.data;
		}

		if (leftMovie && rightMovie) {
			runComparison();
		}
	} catch (err) {
		console.log('Something went wrong', err);
	}
};

const runComparison = () => {
	const leftSideStats = document.querySelectorAll('#summary-left .notification');
	const rightSideStats = document.querySelectorAll('#summary-right .notification');

	leftSideStats.forEach((leftStat, index) => {
		const rightStat = rightSideStats[index];

		const leftSideValue = parseInt(leftStat.dataset.value);
		const rightSideValue = parseInt(rightStat.dataset.value);

		if (rightSideValue > leftSideValue) {
			rightStat.classList.remove('is-info');
			rightStat.classList.add('is-success');
		} else {
			leftStat.classList.remove('is-info');
			leftStat.classList.add('is-success');
		}
	});
};

const movieTemplate = (movieDetail) => {
	const dollars = parseInt(movieDetail.BoxOffice.replace(/\$/g, '').replace(/,/g, ''));
	const meta = parseInt(movieDetail.Metascore);
	const imdbRating = parseFloat(movieDetail.imdbRating);
	const votes = parseInt(movieDetail.imdbVotes.replace(/,/g, ''));

	const awards = movieDetail.Awards.split(' ').reduce((prev, word) => {
		const value = parseInt(word);

		if (isNaN(value)) {
			return prev;
		} else {
			return prev + value;
		}
	}, 0);

	return `
		<article class="media">
			<figure class="media-left">
				<p class="image">
					<img src="${movieDetail.Poster}" />
				</p>
			</figure>
			<div class="media-content">
				<div class="content">
					<h2>${movieDetail.Title} (${movieDetail.Year})</h2>
					<h5>${movieDetail.Genre}</h5>
					<p>${movieDetail.Plot}</p>
				</div>
			</div>
		</article>
		<article data-value=${imdbRating} class="notification is-info">
			<p class="title">${movieDetail.imdbRating}</p>
			<p class="subtitle">IMDB Rating</p>
		</article>
		<article data-value=${meta} class="notification is-info">
			<p class="title">${movieDetail.Metascore}</p>
			<p class="subtitle">Metascore</p>
		</article>
		<article data-value=${votes} class="notification is-info">
			<p class="title">${movieDetail.imdbVotes}</p>
			<p class="subtitle">IMDB Votes</p>
		</article>
		<article data-value=${awards} class="notification is-info">
			<p class="title">${movieDetail.Awards}</p>
			<p class="subtitle">Awards</p>
		</article>
		<article data-value=${dollars} class="notification is-info">
			<p class="title">${movieDetail.BoxOffice}</p>
			<p class="subtitle">Box Office</p>
		</article>
	`;
};
